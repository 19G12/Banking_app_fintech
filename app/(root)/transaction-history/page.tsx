import Header from "@/components/Header";
import Pagination from "@/components/Paginated";
import TransactionsTable from "@/components/TransactionsTable";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { formatAmount } from "@/lib/utils";

const TransactionHistory = async ({searchParams: asyncSearchParams}: {searchParams: Promise<Record<string, string>> }) => {
  
  const searchParams = await asyncSearchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const id = searchParams?.id;
  const sessionUser = await getLoggedInUser();
    
  const accounts = await getAccounts({userId: sessionUser?.$id});
  if(!accounts) return;
  
  const appwriteItemId = id || accounts?.data[0].appwriteItemId;
  
  const indexOfLastTransaction = currentPage * 10 ;
  const indexOfFirstTransaction = indexOfLastTransaction - 10;  
  const {data, transactions} = await getAccount({appwriteItemId});
  
  const paginatedTransactions = transactions.slice(indexOfFirstTransaction,indexOfLastTransaction);
  
  return (
    <section className="transactions">
      <div className="transactions-header">
        <Header 
          title={"Transaction History"} 
          subtext="See your bank details and transactions"
          />
      </div>
      
      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {data?.name}
            </h2>
            <p className="text-14 text-blue-25">
              {data?.officialName}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● <span>{data?.mask || "XXXX"}</span>
            </p>
          </div>
          
          <div className="transactions-account-balance">
            <p className="text-14">
              Account Balance
            </p>
            <p className="text-14 font-bold text-center">
              {formatAmount(data?.currentBalance)}
            </p>
          </div>
        </div>
        
        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={paginatedTransactions}/>
          <Pagination page={currentPage} totalPages={Math.ceil(transactions.length/10)} />
        </section>
      </div>
    </section>
  )
}

export default TransactionHistory