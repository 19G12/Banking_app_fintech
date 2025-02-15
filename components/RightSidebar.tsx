import Image from "next/image"
import Link from "next/link"
import BankCard from "./BankCard"
import Category from "./Category"
import { countTransactionCategories } from "@/lib/utils"

const RightSidebar = ({user, transactions, banks}: RightSidebarProps) => {

  const categories: CategoryCount[] = countTransactionCategories(transactions);
  
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner"></div>
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">{user?.name[0] || "G"}</span>
          </div>
          
          <div className="profile-details">
            <h1 className="profile-name">{user?.name || "Guest"}</h1>
            <p className="profile-email">{user.email || "guestmail@xyz.com"}</p>
          </div>
        </div>
      </section>
      
      <section className="banks">
        <div className="justify-between flex w-full">
          <h2 className="header-2">My Banks</h2>
          <Link href={"/"} className="flex gap-2">
            <Image alt="plus" src={"/icons/plus.svg"} width={20} height={20}/>
            <h2 className="text-14 text-grey-600 font-semibold">Add bank</h2>
          </Link>
        </div>
        
        {banks?.length && 
          (<div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative left-[-4%] z-10">
              <BankCard key={banks[0]?.$id} account={banks[0]} userName={`${user?.name}`}
                showBalance={false}
              />
            </div>
            {banks[1] && 
              <div className="absolute right-[-5%] top-8 z-0">
                <BankCard key={banks[1]?.$id} account={banks[1]} userName={`${user?.name}`}
                  showBalance={false}
                />
              </div>
            }
          </div>)
        }
        
        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="header-2">Top categories</h2>

          <div className='space-y-5'>
            {categories.map((category) => (
              <Category key={category.name} category={category} />
            ))}
          </div>
        </div>
        
      </section>
    </aside>
  )
}

export default RightSidebar