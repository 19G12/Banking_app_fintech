"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button"
import { Form } from "./ui/form";
import CustomFormElement from "./CustomFormElement";
import { AuthFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUp, signIn} from "@/lib/actions/user.actions";
import PlaidLink from "./PlaidLink";

const AuthForm = ({type}:{type: string}) => {
  
  const router = useRouter();  
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const schema = AuthFormSchema(type)
  
  type formSchema = z.infer<typeof schema>
  
  const form = useForm<formSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address1: "",
      state: "",
      city:"",
      postalCode: "",
      dateOfBirth: "",
      ssn: ""
    },
  })
  
  const onSubmit: SubmitHandler<formSchema> = async (data) => {    
    setIsLoading(true);
    try {
      
      // Appwrite signUp 
      
      if(type === "sign-up") {
      
        // Make sure firstName, lastName and all are string. nit undefined | string
        
        const userData = {
          email: data.email,
          password: data.password,
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city:  data.city!,
          state: data.state!,
          postalCode:data.postalCode!, 
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
        }
        
        const newUser = await signUp(userData);
        setUser(newUser);
        
      }
      
      if(type === "sign-in") {        
        const response = await signIn({
          email: data.email,
          password: data.password
        });
        console.log(response);
        if(response) router.push("/")
      }
    
    } catch (error) {
      throw new Error (`Error in auth: ${error}`);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href={"/"}className="mb-12 flex cursor-pointer items-center gap-2">
            <Image 
                src={"/icons/logo.svg"}
                alt="Horizon"
                width={34}
                height={34}
                className="size-[24px] max-xl:size-14"
            />
            <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-grey-900">
            {user ? "Link Account" :
              type === "sign-in" ?
              "Sign In" :
              "Sign Up"
            }
          </h1>
          <p className="text-16 font-normal text-grey-600">
            {user ? "Link your account to get started" :
              "Please enter your details"
            }
          </p>
        </div>
      </header>
      {user ? (
      
        // PLAID LINK ACCOUNT
        
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant={"primary"}/>
        </div>
      ) : 
      (<>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, 
            (error) => console.log("Submission errors:", error)
          )} className="space-y-8">
            
            {type === "sign-up" &&
            
              <>
              
                <div className="w-full justify-between flex">
                  <CustomFormElement
                    form={form} 
                    label={"First Name"} 
                    placeholder="First name"
                    name={"firstName"}
                  />
                  
                  <CustomFormElement
                    form={form} 
                    label={"Last Name"} 
                    placeholder="Last name"
                    name={"lastName"}
                  />
                </div>
                
                <CustomFormElement
                  form={form} 
                  label={"Address"} 
                  placeholder="Enter your address"
                  name={"address1"}
                />
                
                <CustomFormElement
                  form={form} 
                  label={"City"} 
                  placeholder="Enter your city"
                  name={"city"}
                />
                
                <div className="w-full justify-between flex">
                  <CustomFormElement
                    form={form} 
                    label={"State"} 
                    placeholder="Ex: MH"
                    name={"state"}
                  />
                  
                  <CustomFormElement
                    form={form} 
                    label={"Postal Code"} 
                    placeholder="Ex: 11011"
                    name={"postalCode"}
                  />
                </div>
                
                <div className="w-full justify-between flex">
                  <CustomFormElement
                    form={form} 
                    label={"DOB"} 
                    placeholder="yyyy-mm-dd"
                    name={"dateOfBirth"}
                  />
                  
                  <CustomFormElement
                    form={form} 
                    label={"SSN"} 
                    placeholder="Ex: 1234-33-0019"
                    name={"ssn"}
                  />
                </div>
                
              </>
            
            }
          
            <CustomFormElement
              form={form} 
              label={"Email"} 
              placeholder="Enter your email Id"
              name={"email"}
            />
            <CustomFormElement
              form={form} 
              label={"Password"} 
              placeholder="Your Password"
              name={"password"}
              type="password"
            />
            <div className="flex flex-col gap-4">
              <Button type="submit" className="form-btn" disabled={isLoading}>
                {isLoading ? 
                <>
                  <Loader2 size={20} className="animate-spin" />&nbsp;
                  Loading...
                </> :
                 type === 'sign-in'? "Sign In" : "Sign Up"
                }
              </Button>
            </div>
          </form>
        </Form>
        
        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-grey-600">
            {type === "sign-in" ?
            "Don't have an account? "
            : "Already have an account? "}
          </p>
          <Link className="form-link" href={type === "sign-in"? "/sign-up" : "/sign-in"}>
            {type === "sign-in"? "Sign up ": "Sign In"}
          </Link>
        </footer>
        
      </>)
      }
    </section>
  )
}

export default AuthForm