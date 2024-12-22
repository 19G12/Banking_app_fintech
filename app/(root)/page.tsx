import BalanceBox from "@/components/BalanceBox"
import Header from "@/components/Header"
import RightSidebar from "@/components/RightSidebar"

const Home = () => {

  const LoggedIn = {
    firstName: "Gagan",
    lastName: "G",
    email: "24m1090@iitb.ac.in"
  }
  
  return (
    <section className="home">
      <div className="home-content">
        <h1 className="home-header">
          <Header 
            type="greeting"
            title="Welcome"
            user={LoggedIn?.firstName || "Guest"}
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
      <RightSidebar user={LoggedIn} transactions={[]} banks={[{currentBalance: 123.50},{currentBalance: 500.25}]}/>
    </section>
  )
}

export default Home