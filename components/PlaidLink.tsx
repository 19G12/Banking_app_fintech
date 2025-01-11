"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import {usePlaidLink} from "react-plaid-link";
import { useRouter } from "next/navigation";
import { exchangePublicToken, getLinkToken } from "@/lib/actions/user.actions";

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
            (<Button>
                Connect bank
            </Button>)
            :
            (<Button>
                Connect bank
            </Button>)
        }
    </>
  )
}

export default PlaidLink