"use client";
import { decryptId, PaymentFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import BankDropDown from "./BankDropDown";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.action";
import { Form } from "./ui/form";

const PaymentTransferForm = ({accounts}: PaymentTransferFormProps) => {
    
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const schema = PaymentFormSchema;
   type formSchema = z.infer<typeof schema>;
   
   const form = useForm<formSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
        email: "",
        name: "",
        amount: "",
        senderBank: "",
        sharableId: "",
    },
   });
   
   const submit: SubmitHandler<formSchema> = async (data) => {
    try {
        setIsLoading(true);
        // do something here
        const receiverAccountId = decryptId(data?.sharableId);
        const receiverBank = await getBankByAccountId({accountId: receiverAccountId});
        const senderBank = await getBank(data?.senderBank);
        
        const transferUrl = await createTransfer({
          sourceFundingSourceUrl: senderBank?.fundingSourceUrl,
          destinationFundingSourceUrl: receiverBank?.fundingSourceUrl,
          amount: data.amount
        });
        
        // create a transaction in db
        if (transferUrl) {
          
          const transactions = {
            name: data?.name,
            amount: data?.amount,
            senderId: senderBank.userId.$id,
            senderBankId: senderBank.$id,
            receiverId: receiverBank.userId.$id,
            receiverBankId: receiverBank.$id,
            email: data.email
          }
          const newTransaction = await createTransaction(transactions);
          if(newTransaction){
            form.reset();
            router.push("/");
          }
        }
        
    } catch (error) {
        console.log("Error in submitting paymentTransfer form: ", error);
        throw error;
    }
   }
    
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(submit, (error) => console.log("Submission errors:", error))} className="flex flex-col">
            <FormField 
                control={form.control}
                name="senderBank"
                render={() => (
                    <FormItem className="border-t border-gray-200">
                      <div className="payment-transfer_form-item pb-6 pt-5">
                        <div className="payment-transfer_form-content">
                          <FormLabel className="text-14 font-medium text-gray-700">
                            Select Source Bank
                          </FormLabel>
                          <FormDescription className="text-12 font-normal text-gray-600">
                            Select the bank account you want to transfer funds from
                          </FormDescription>
                        </div>
                        <div className="flex w-full flex-col">
                          <FormControl>
                            <BankDropDown
                              accounts={accounts}
                              setValue={form.setValue}
                              otherStyles="!w-full"
                            />
                          </FormControl>
                          <FormMessage className="text-12 text-red-500" />
                        </div>
                      </div>
                    </FormItem>
                )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item pb-6 pt-5">
                    <div className="payment-transfer_form-content">
                      <FormLabel className="text-14 font-medium text-gray-700">
                        Transfer Note (Optional)
                      </FormLabel>
                      <FormDescription className="text-12 font-normal text-gray-600">
                        Please provide any additional information or instructions
                        related to the transfer
                      </FormDescription>
                    </div>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Textarea
                          placeholder="Write a short note here"
                          className="input-class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
    
            <div className="payment-transfer_form-details">
              <h2 className="text-18 font-semibold text-gray-900">
                Bank account details
              </h2>
              <p className="text-16 font-normal text-gray-600">
                Enter the bank account details of the recipient
              </p>
            </div>
    
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item py-5">
                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                      Recipient&apos;s Email Address
                    </FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          placeholder="ex: johndoe@gmail.com"
                          className="input-class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
    
            <FormField
              control={form.control}
              name="sharableId"
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item pb-5 pt-6">
                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                      Receiver&apos;s Plaid Sharable Id
                    </FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          placeholder="Enter the public account number"
                          className="input-class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
    
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="border-y border-gray-200">
                  <div className="payment-transfer_form-item py-5">
                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                      Amount
                    </FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          placeholder="ex: 5.00"
                          className="input-class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
    
            <div className="payment-transfer_btn-box">
              <Button type="submit" className="payment-transfer_btn">
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
                  </>
                ) : (
                  "Transfer Funds"
                )}
              </Button>
            </div>
            
        </form>
    </Form>
  )
}

export default PaymentTransferForm