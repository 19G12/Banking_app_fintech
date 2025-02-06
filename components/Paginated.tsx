"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Paginated = ({page, totalPages}: PaginationProps) => {

  const pageNumbers: number[] = [];
  
  for (let index = 1; index <= totalPages; index++) {
    pageNumbers.push(index);
  }
  
  const router = useRouter();
  const searchParams = useSearchParams();
    
  const handleNav = (type: "prev" | "next" | number) => {
    
    const pageNumber = type === "prev" ? page - 1 : type === "next" ? page + 1: type;
    const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: pageNumber.toString()
    });
    
    router.push(newUrl, {scroll: false});
  }  
  
  const hidePrev = page <= 1;
  const hideNext = page >= totalPages;
    
  return (
    <div className="flex justify-between gap-3">
      <Pagination>
        <PaginationContent>
          <PaginationItem className={`${hidePrev && "hidden"}`}>
            <PaginationPrevious className="cursor-pointer" onClick={() => handleNav("prev")} />
          </PaginationItem>
          {pageNumbers.map((val: number, ind) => (
            <PaginationItem key={ind}>
              <PaginationLink className="cursor-pointer" onClick={() => handleNav(val)} isActive={page === val}>{val}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem  className={`${hideNext && "hidden"}`}>
            <PaginationNext className="cursor-pointer" onClick={() => handleNav("next")} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default Paginated