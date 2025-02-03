import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"

const TransactionsTable = ({transactions}: TransactionTableProps) => {
  
  const CategoryBadge = ({category}:CategoryBadgeProps) => {
    
    const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor
    } = transactionCategoryStyles[typeof category === "string" ? category as keyof typeof transactionCategoryStyles : category[0] as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default
    
    return (
      <div className={cn('category-badge',borderColor, chipBackgroundColor)}>
        <div className={cn('size-2 rounded-full',backgroundColor)} />
        <p className={cn('text-[12px] font-medium',textColor)}>
          {typeof category === "string" ? category : category[0]}
        </p>
      </div>
    )
  }
    
  return (
    <Table key={transactions[0].$id}>
      <TableHeader>
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody key={transactions[0].$id}>
        {transactions.map((t: Transaction) => {
          const status = getTransactionStatus(new Date(t?.date));
          const amount = formatAmount(t?.amount);
          const isDebit = t?.type === "debit";
          const isCredit = t?.type === "credit";
          
          return (
            <TableRow key={t?.transaction_id || t?.id}
              className={`${isDebit || amount[0] === "-" ? "bg-[#ffbfa]": "bg-[#f6fef9]"} !over-bg:none
               !border-b-default`}>
              <TableCell className={"max-w-[250px] pl-2 pr-10"}>
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">{removeSpecialCharacters(t?.name)}</h1>
                </div>
              </TableCell>
              <TableCell className={`pl-2 min-w-28 pr-10 font-semibold !text-sm ${isDebit || amount[0] === "-" ? "text-[#f04438]" : "text-[#039855]"}`}>
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>
              <TableCell className={`pl-2 pr-10`}>
                {CategoryBadge({category: [status]})}
              </TableCell>
              <TableCell className={`max-w-32 pl-2 pr-10`}>
                {formatDateTime(new Date(t?.date)).dateTime} 
              </TableCell>
              <TableCell className={`pl-2 pr-10 capitalize min-w-32`}> 
                {t?.payment_channel || t.paymentChannel}
              </TableCell>
              <TableCell className={`max-md:hidden`}> 
                {CategoryBadge({category: t?.category})}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default TransactionsTable