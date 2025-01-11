"use server";
import {Client, Account, Databases, Users} from "node-appwrite"
import * as dotenv from "dotenv";
import { cookies } from "next/headers";
dotenv.config();

export const createSessionClient = async () => {

    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    
    const session = (await cookies()).get("appwrite-session");
    
    if (!session || !session.value){
        throw new Error("No session");
        // do something here 
    }
    
    client.setSession(session.value);
    
    return {
        get account(){
            return new Account(client);
        }
    }
    
}

export const createAdminClient = async () => {
    
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        .setKey(process.env.NEXT_APPWRITE_KEY!)
    
    return {
        get account(){
            return new Account(client);
        },
        get database(){
            return new Databases(client);
        },
        get user(){
            return new Users(client);
        }
    };
    
}
