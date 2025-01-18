"use server";
import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import dwolla from "dwolla-v2";

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID
} = process.env;

const dwollaClient = new dwolla.Client({
    key: process.env.DWOLLA_KEY!,
    secret: process.env.DWOLLA_SECRET!,
    environment: 'sandbox',
});

export const createFundingSource = async (options: CreateFundingSourceOptions) => {
    try {
        const response = await dwollaClient.post(`customers/${options.customerId}/funding-sources`, {
          plaidToken: options.plaidToken,
          name: options.fundingSourceName,
        });
    
    const fundingSourceUrl = response.headers.get('location');
    return fundingSourceUrl;
    
    } catch (error) {
        console.error("Creating a Funding Source Failed: ", error);
    }
} 

export const createDwollaCustomer = async (customerData: NewDwollaCustomerParams) => {
    try {   
        const response = await dwollaClient.post("customers", customerData);
        return response.headers.get("location"); // Dwolla customer URL
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
};

export const createTransfer = async ({sourceFundingSourceUrl, destinationFundingSourceUrl, amount}: TransferParams) => {
    const res = await dwollaClient.post('transfers',{
        _links: {
          source: {
            href: sourceFundingSourceUrl
          },
          destination: {
            href: destinationFundingSourceUrl
          }
        },
        amount: {
          currency: 'USD',
          value: amount
        }
    });
    return res.headers.get('location'); // Transfer Url
};

export const createOndemandAuthorization = async () => {
    
    try {
        const onDemandAuth = await dwollaClient.post(`on-demand-authorizations`);
        return onDemandAuth.body?._links;
    } catch (error) {
        console.error("Error creating on-demand authorization:", error);
        throw error;
    }
    
};

export const addFundingSource = async ({dwollaCustomerId, processorToken, bankName}: AddFundingSourceParams) => {
    
    try {
        const dwollaAuthLinks = await createOndemandAuthorization();
            
        const fundingSourceOptions = {
          customerId: dwollaCustomerId,
          fundingSourceName: bankName,
          plaidToken: processorToken,
          _links: dwollaAuthLinks,
        };
        
        return await createFundingSource(fundingSourceOptions);
        
    } catch (error) {
        console.error("Transfer fund failed: ", error);
        throw error;
    }
};

export const createNewBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    sharableId
}: createBankAccountProps) => {
    try {
        const {database} = await createAdminClient();
        
        const bankAccountData = {
            userId,
            bankId,
            accountId,
            accessToken,
            fundingSourceUrl,
            sharableId,
        };
        
        const newBankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            bankAccountData
        );
        
        return parseStringify(newBankAccount);
        
    } catch (error) {
        console.log("Error in creating new bank account: ", error);
        throw error; 
    }
}