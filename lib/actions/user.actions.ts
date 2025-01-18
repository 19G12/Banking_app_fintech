"use server";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer, createNewBankAccount } from "./dwolla.actions";
import {PlaidApi, Configuration} from 'plaid';

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID
} = process.env;

const plaidClient = new PlaidApi(
  new Configuration({
    basePath:'https://sandbox.plaid.com', 
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  })
);

export const signUp = async (data : SignUpParams) => {
    try {
        
        const {account, database} = await createAdminClient();
        const {password, ...filteredData} = data;
        
        const newUserAccount = await account.create(
        ID.unique(),
        data.email,
        password,
        `${data.firstName} ${data.lastName}`
        );
        
        if(!newUserAccount) throw new Error("Error in signing up!");
        
        const session = await account.createEmailPasswordSession(data.email, password);
        
        (await cookies()).set("appwrite-session", session.secret ,{
            httpOnly: true,
            path:"/",
            sameSite:"strict",
            secure:true
        });
        
        const dwollaCustomerUrl = await createDwollaCustomer({
            ...filteredData,
            type: "personal"
        });
        
        if(!dwollaCustomerUrl) throw new Error("Error in generating dwollaCustomer url");
        
        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
        
        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...filteredData,
                dwollaCustomerId: dwollaCustomerId,
                dwollaCustomerUrl: dwollaCustomerUrl,
                userId: newUserAccount.$id
            }
        );
        
        return parseStringify(newUser);
        
    } catch (error) {
        console.log("Error: ",error);
    }
}

export const userGetInfo = async ({userId}:{userId : string}) => {
    try {
        const {database} = await createAdminClient();
        const response = await database.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal('userId', userId)] 
        );
        
        if (!response.documents.length) console.log("No banks were found for this user");
        
        return parseStringify(response.documents[0]);
    } catch (error) {
        console.log("Error in fetching user info",error);
    }
}

export const signIn = async ({
    email,
    password
}: signInProps) => {
    try {        
        const {account} = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);
        
        (await cookies()).set("appwrite-session", session.secret ,{
            httpOnly: true,
            path:"/",
            sameSite:"strict",
            secure:true
        });
        
        const user = await userGetInfo({userId: session?.userId});
        
        return parseStringify(user);
        
    } catch (error) {
    
        console.log("Error: ",error);
    }
}

export const getLoggedInUser = async () => {
    try {
        const {account} = await createSessionClient();
        const response = await account.get();
        
        const user = await userGetInfo({userId: response.$id});
        
        return parseStringify(user);
    } catch (error) {
        console.log(error);
        
    }
}
 
export const LogOutUser = async () => {
    try {
        const {account} = await createSessionClient();
        (await cookies()).delete("appwrite-session");
        
        const deletedSession = await account.deleteSession("current");
        return deletedSession;
        
    } catch (error) {
        console.log("Error: ",error);
        
    }
}

export const getLinkToken = async (user: User) => {
    try {
        const id = user.$id
        const response = await plaidClient.linkTokenCreate({
            user: {
                client_user_id: id
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ['auth','transactions'] as Products[],
            country_codes: ['US','CA'] as CountryCode[],
            language: 'en'
        });
        
        return parseStringify(response.data);
        
    } catch (error) {
        console.log("Error in link token: ",error);
        throw new Error('Failed to link token');
    }
}

export const exchangePublicToken = async ({publicToken, user}: exchangePublicTokenProps) => {
    try {
        
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken
        });
        
        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;
        
        const accountResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });
        
        const accountData = accountResponse.data.accounts[0];
        
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id ,
            processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
        };
        
        const process_response = await plaidClient.processorTokenCreate(request);
        
        const {processor_token} = process_response.data;
        
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user?.dwollaCustomerId,
            processorToken: processor_token,
            bankName: accountData.name
        });
        
        if (!fundingSourceUrl) throw new Error;
        
        // This is creating a doc in db Bank
        await createNewBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            sharableId: encryptId(accountData.account_id)
        });
        
        revalidatePath("/");
        
        return parseStringify({
            publicTokenExchange: "complete",
        });
        
    } catch (error) {
        console.log('Error exchanging public token:', error);
        throw new Error("Failed to exchange public token");
    }
}

export const getBanks = async (userId: string) => {    
    
    try {
        const {database} = await createAdminClient();
        const response = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('userId', userId)] 
        );
        
        if (!response.documents.length) console.log("No banks were found for this user");
        
        return parseStringify(response.documents);
        
    } catch (error) {
        console.log("Error occured while fetching bank details: ", error);
        throw error
    }
}

export const getBank = async (documentId: string) => {

    try {
        const {database} = await createAdminClient();
        const response = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('$id', documentId)] 
        );
        
        if (!response.documents.length) console.log("No banks were found for this user");
        
        return parseStringify(response.documents[0]);
        
    } catch (error) {
        console.log("Error occured while fetching bank details: ", error);
        throw error
    }
}