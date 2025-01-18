"use client";
import { cn, formUrlQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

const BankTableItem = ({account, appwriteItemId}: BankTabItemProps) => {
    
  const isActive: boolean = (account.appwriteItemId === appwriteItemId);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const handleBankChange = () => {
    const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "id",
        value: account?.appwriteItemId
    });
    
    router.push(newUrl, {scroll: false});
  };
    
  return (
    <div onClick={handleBankChange}
        className={cn(`banktab-item`, {
        " border-blue-600": isActive,
    })}>
      <p
        className={cn(`text-16 line-clamp-1 flex-1 font-medium text-gray-500`, {
          " text-blue-600": isActive,
        })}
      >
        {account.name}
      </p>
    </div>
  );
};

export default BankTableItem