import Link from "next/link";
import {
    Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import BankTableItem from "./BankTableItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import Paginated from "./Paginated";

const RecentTransactions = ({transactions=[], page=1, appwriteItemId, accounts}: RecentTransactionsProps) => {

  const indexOfLastTransaction = page * 10 ;
  const indexOfFirstTransaction = indexOfLastTransaction - 10;
  
  const paginatedTransactions = transactions.slice(indexOfFirstTransaction,indexOfLastTransaction);
  
  return (
    <section className="recent-transactions">
        <header className="flex flex-col items-center justify-between">
            <div className="w-full flex justify-between items-center">
              <h2 className="recent-transactions-label">
                Recent Transactions
              </h2>
              <Link href={`/transaction-history/?id=${appwriteItemId}`}
                  className="view-all-btn"
              >
                  View All
              </Link>
            </div>
            <Tabs defaultValue={appwriteItemId} className="w-full">
              <TabsList className="recent-transactions-tablist">
                {accounts.map((val) => 
                <TabsTrigger value={val.appwriteItemId} key={val.id}>
                    <BankTableItem account={val} appwriteItemId={val?.appwriteItemId}/>
                </TabsTrigger>)}
              </TabsList>
              
              {accounts.map((val) => (
                <TabsContent value={val?.appwriteItemId} key={val.id}
                className="space-y-4">
                    <BankInfo account={val} appwriteItemId={val.appwriteItemId} type={"full"} />
                    <TransactionsTable transactions={paginatedTransactions} />
                    
                    <Paginated page={page} totalPages={Math.ceil(transactions.length/10)} />
                    
                </TabsContent>
              ))}
              
            </Tabs>
        </header>
    </section>
  )
}

export default RecentTransactions