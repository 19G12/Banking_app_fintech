"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger
} from "@/components/ui/select";
import { useState } from "react";
import Image from "next/image";
import { formatAmount, formUrlQuery } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const BankDropDown = ({accounts, setValue, otherStyles}: BankDropdownProps) => {
    
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState(accounts[0]);
    
  const handleValueChange = (id : string) => {
    const account = accounts.find((val) => val.appwriteItemId === id);
    setSelected(account!);
    
    const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "id",
        value: id
    });
    
    router.push(newUrl, {scroll: false});
    
    if(setValue){
        setValue("senderBank", id);
    }
    
  }  
    
  return (
    <Select defaultValue={selected.id} onValueChange={(value) => handleValueChange(value)}>
        <SelectTrigger className={`flex w-full gap-3 bg-white md:w-[300px] ${otherStyles}`}>
            <Image
              src="icons/credit-card.svg"
              width={20}
              height={20}
              alt="account"
            />
            <p className="line-clamp-1 w-full text-left">{selected.name}</p>
        </SelectTrigger>
        <SelectContent className={`w-full md:w-[300px] bg-white ${otherStyles}`} align="end">
            <SelectGroup>
                <SelectLabel className="py-2 font-normal text-gray-500">
                  Select a bank to display
                </SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id}
              value={account.appwriteItemId}
              className="cursor-pointer border-t"
            >
              <div className="flex flex-col ">
                <p className="text-16 font-medium">{account.name}</p>
                <p className="text-14 font-medium text-blue-600">
                  {formatAmount(account.currentBalance)}
                </p>
              </div>
            </SelectItem>
          ))
          }
            </SelectGroup>
        </SelectContent>
    </Select>
  )
}

export default BankDropDown;
