import BankCard from "@/components/BankCard";
import Header from "@/components/Header";
import { getAccounts } from "@/lib/actions/bank.actions"
import { getLoggedInUser } from "@/lib/actions/user.actions"

const MyBanks = async () => {
  
  const user = await getLoggedInUser();
  const {data} = await getAccounts({userId: user?.$id});
  
  if (!data) return ;
  return (
    <section className="flex">
      <div className="my-banks">
        <Header 
          title={"My Bank Accounts"}
          subtext="Effortlessly manage your activities"
        />
        
        <div className="space-y-4">
          <h2 className="header-2">
            Your cards
          </h2>
          <div className="flex flex-wrap gap-6">
            {data.map((val: Account) => 
                (<BankCard key={val?.id} account={val} userName={user?.firstName}/>)
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks