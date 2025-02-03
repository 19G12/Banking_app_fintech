import BalanceBox from "@/components/BalanceBox"
import Header from "@/components/Header"
import RecentTransactions from "@/components/RecentTransactions"
import RightSidebar from "@/components/RightSidebar"
import { getAccount, getAccounts } from "@/lib/actions/bank.actions"
import { getLoggedInUser } from "@/lib/actions/user.actions"

const Home = async ({searchParams: asyncSearchParams}: {searchParams: Promise<Record<string, string>> }) => {
  
  const searchParams = await asyncSearchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const id = searchParams?.id;
  const sessionUser = await getLoggedInUser();
  sessionUser['name'] = `${sessionUser?.firstName} ${sessionUser?.lastName}`
    
  const accounts = await getAccounts({userId: sessionUser?.$id});
  if(!accounts) return;
  const accountsData = accounts?.data;
  
  const appwriteItemId = id || accountsData[0]?.appwriteItemId;  
  const {transactions} = await getAccount({appwriteItemId});   
  
  return (
    <section className="home">
      <div className="home-content">
        <h1 className="home-header">
          <Header 
            type="greeting"
            title="Welcome"
            user={sessionUser?.firstName || "Guest"}
            subtext="Access and manage your account and 
              transactions efficiently."
          />
        
          <BalanceBox 
            accounts={accountsData}
            totalBanks={accounts.totalBanks}
            totalCurrentBalance={accounts.totalCurrentBalance}
          />
        </h1>
        <RecentTransactions page={currentPage} appwriteItemId={appwriteItemId} accounts={accountsData} transactions={transactions}/>
      </div>
      <RightSidebar user={sessionUser} transactions={transactions} banks={accountsData?.slice(0,2)}/>
    </section>
  )
}

export default Home