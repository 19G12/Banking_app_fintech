import Header from "@/components/Header"
import PaymentTransferForm from "@/components/PaymentTransferForm"
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions"

const PaymentTransfer = async () => {

  const user = await getLoggedInUser();
  const accountsData = await getAccounts({userId: user?.$id});
  if(!accountsData) return
  
  const accounts = accountsData?.data;
  
  return (
    <section className="payment-transfer">
      <Header 
        title={"Payment Transfer"} 
        subtext={"Please provide any specific details or notes related to the payment transfer"}
      />
      
      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accounts}/>
      </section>
    </section>
  )
}

export default PaymentTransfer