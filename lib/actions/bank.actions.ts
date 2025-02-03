"use server";
import { PlaidApi, Configuration, TransactionsSyncRequest, PlaidEnvironments } from "plaid";
import { parseStringify } from "../utils";
import { getBank, getBanks } from "./user.actions";
import { getTransferTransactions } from "./transaction.action";

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV!], 
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
        'Plaid-Version': '2020-09-14',
      },
    },
  })
);

// get multiple bank accounts
export const getAccounts = async ({userId} : {userId: string}) => {
    
    // Get bank details from database
    try {
        const bankResponse = await getBanks(userId);        
    
        const bankAccounts = await Promise.all(
            bankResponse.map(async (bank: Bank) => {
                const accountsResponse = await plaidClient.accountsGet({
                    access_token: bank.accessToken
                });
                
                const accountsData = accountsResponse.data.accounts[0];
                
                // const instituation = await getInstitution({
                //     institutionId: accountsResponse.data.item.institution_id!,
                // });
                
                const account = {
                    id: accountsData.account_id,
                    name: accountsData.name,
                    officialName: accountsData.official_name,
                    type: accountsData.type as string,
                    subtype: accountsData.subtype! as string,
                    currentBalance: accountsData.balances.current!,
                    availableBalance: accountsData.balances.available!,
                    appwriteItemId: bank.$id,
                    shareableId: bank.sharableId
                };
                
                return account
            })
        );
        
        const totalBanks = bankAccounts.length;
        const totalCurrentBalance = bankAccounts.reduce((total, account) => {
            return total + account.currentBalance
        }, 0);
        
        return parseStringify({
            data: bankAccounts,
            totalBanks,
            totalCurrentBalance
        });
        
    } catch (error) {
        console.log("Error in getting accounts: ",error);
        throw error;
    }
}

// get single bank account
export const getAccount = async ({appwriteItemId}: getAccountProps) => {
    try {
        // get the bank data
        const bank = await getBank(appwriteItemId);
        
        const accountResponse = await plaidClient.accountsGet({
            access_token: bank.accessToken,
        });
        
        const accountData = accountResponse.data.accounts[0];
        
        // Get transactions here
        const transactions = await getTransactions({
            accessToken: bank?.accessToken,
        })
        
        // Get bank to bank transfers
        const transfers = await getTransferTransactions(bank?.$id);
        
        // Club all of them up
        const allTransfers = transfers.documents.map((val: Transaction) => {
            return {
                id: val.$id,
                name: val?.name,
                amount: val.amount,
                date: val.$createdAt,
                paymentChannel: val.channel,
                category: val.category,
                type: val.senderBankId === bank?.$id ? "debit" : "credit"
            }
        });
        
        const account = {
            id: accountData.account_id,
            availableBalance: accountData.balances.available!,
            currentBalance: accountData.balances.current!,
            name: accountData.name,
            officialName: accountData.official_name,
            mask: accountData.mask!,
            type: accountData.type as string,
            subtype: accountData.subtype! as string,
            appwriteItemId: bank.$id,
        };
        
        const allTransactions = [...transactions, ...allTransfers].sort((a,b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        return parseStringify({
            data: account,
            transactions: allTransactions
        });
        
    } catch (error) {
        console.log("Error in fetching individual bank account: ", error);
        throw error;
    }
}

export const getTransactions = async ({accessToken} : getTransactionsProps) => {
    
    try {
    
        let transactionData: Array<Transaction> = [];
        let hasMore = true;
        let cursor = undefined;
        
        while(hasMore) {
            const request: TransactionsSyncRequest = {
                access_token: accessToken,
                cursor
            };
            
            const response = await plaidClient.transactionsSync(request);
            
            const {added, has_more, next_cursor} = response.data;
            
            cursor = next_cursor;
            transactionData = transactionData.concat(added);
            hasMore = has_more;
            
        }
        
        return parseStringify(transactionData);
        
    } catch (error) {
        console.log("Error in retrieving transactions: ",error);
    }
    
}