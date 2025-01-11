import BalanceBox from "@/components/BalanceBox"
import Header from "@/components/Header"
import RightSidebar from "@/components/RightSidebar"
import { getLoggedInUser } from "@/lib/actions/user.actions"

const Home = async () => {
  
  const sessionUser = await getLoggedInUser();
  console.log(sessionUser);
  
  return (
    <section className="home">
      <div className="home-content">
        <h1 className="home-header">
          <Header 
            type="greeting"
            title="Welcome"
            user={sessionUser?.name || "Guest"}
            subtext="Access and manage your account and 
              transactions efficiently."
          />
        
          <BalanceBox 
            accounts={[]}
            totalBanks={3}
            totalCurrentBalance={1250.35}
          />
        </h1>
        RECENT TRANSACTIONS
      </div>
      <RightSidebar user={sessionUser} transactions={[]} banks={[{currentBalance: 123.50},{currentBalance: 500.25}]}/>
    </section>
  )
}

export default Home