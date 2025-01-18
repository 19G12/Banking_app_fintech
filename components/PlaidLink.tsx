"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import {usePlaidLink} from "react-plaid-link";
import { useRouter } from "next/navigation";
import { exchangePublicToken, getLinkToken } from "@/lib/actions/user.actions";
import { read } from "fs";
import Image from "next/image";

const PlaidLink = ({user, variant}:PlaidLinkProps) => {

    const router = useRouter();
    
    const [linkToken, setLinkToken] = useState(null);
    
    useEffect(() => {
        const createLinkToken = async () => {
            try {
                const response = await getLinkToken(user); // get this data in json()
                
                setLinkToken(response?.link_token);
            } catch (error) {
                console.error('Error fetching link token:', error);
            }
        }
        
        createLinkToken();
    }, [user]);
    
    const onSuccess = async (public_token:string) => {
        try {
            await exchangePublicToken({
                publicToken: public_token,
                user: user
            });
            
            
            router.push("/");
            
        } catch (error) {
            console.error('Error exchanging public token:', error);
        }
    }
    
    const {open, ready} = usePlaidLink({
        token: linkToken,
        onSuccess,
    })

  return (
    <>
        {variant === "primary" ? 
            (<Button
            onClick={() => open()}
            disabled= {!ready}
            className="plaidlink-primary">
                Connect bank
            </Button>)
            :
            variant === "ghost" ?
            (<Button onClick={() => open()} variant="ghost"
            disabled={!ready} className="plaidlink-ghost">
                <Image
                    src={"/icons/connect-bank.svg"}
                    alt="connect-bank"
                    height={24}
                    width={24}
                />
                <p className="hidden xl:block text-[16px] font-semibold text-black-2">Connect bank</p>
            </Button>)
            :
            (<Button onClick={() => open()}
            disabled={!ready} className="plaidlink-default">
                <Image
                    src={"/icons/connect-bank.svg"}
                    alt="connect-bank"
                    height={24}
                    width={24}
                />
                <p className="text-[16px] font-semibold text-black-2">Connect bank</p>
            </Button>)
        }
    </>
  )
}

export default PlaidLink