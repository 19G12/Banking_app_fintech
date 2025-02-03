"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_ID
} = process.env;

export const createTransaction = async (transactions: CreateTransactionProps) => {
    try {
        const {database} = await createAdminClient();
        
        const newTransaction = database.createDocument(
            DATABASE_ID!,
            TRANSACTION_ID!,
            ID.unique(),
            {
                channel: "online",
                category: "Transfer",
                ...transactions
            }
        )
        
        return parseStringify(newTransaction);
        
    } catch (error) {
        console.log("Error occured during transaction: ", error);
    }
}

export const getTransferTransactions = async (bankId: string) => {
    try {
        
        const {database} = await createAdminClient();
        
        const receiverTransactions = await database.listDocuments(
            DATABASE_ID!,
            TRANSACTION_ID!,
            [Query.equal("receiverBankId", bankId)]
        );
        
        const senderTransactions = await database.listDocuments(
            DATABASE_ID!,
            TRANSACTION_ID!,
            [Query.equal("senderBankId", bankId)]
        );
        
        const transactions = {
            total: receiverTransactions.total + senderTransactions.total,
            documents: [
                ...receiverTransactions.documents,
                ...senderTransactions.documents
            ]
        };
        
        return parseStringify(transactions);
        
    } catch (error) {
        console.log("Error in fetching transactions: ",error);
    }
}