"use client";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

const MobileNavbar = ({user}:MobileNavProps) => {

    const pathName = usePathname();
    
  return (
    <section className="w-full w-mac-[264px]">
        <Sheet>
            <SheetTrigger>
            <Image src={"/icons/hamburger.svg"} width={30} height={30} className="cursor-pointer" alt="trigger-btn" />
            </SheetTrigger>
            <SheetContent side={"left"} className="border-none bg-white">
                <Link href={"/"}className="flex cursor-pointer items-center gap-1 px-4">
                    <Image 
                        src={"/icons/logo.svg"}
                        alt="Horizon"
                        width={34}
                        height={34}
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
                </Link>
                <div className="mobilenav-sheet">
                    <SheetClose asChild>
                        <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                            {sidebarLinks.map((value: { imgURL: string; route: string; label: string; }, index: number) => {
                    const isActive = pathName === value.route || pathName.startsWith(`${value.route}`)
                    return(
                    <SheetClose key={index}  asChild>
                        <Link href={value.route} key={index} className={cn("mobilenav-sheet_close w-full",{
                            "bg-bank-gradient": isActive
                        })}>
                                <Image 
                                    src={value.imgURL}
                                    alt={value.label}
                                    width={20}
                                    height={20}
                                    className={cn({"brightness-[3] invert-0": isActive})}
                                /> 
                            
                            <p className={cn("text-16 text-black-2 font-semibold",{
                                "!text-white": isActive
                            })}>
                                {value.label}
                            </p>
                        </Link>
                    </SheetClose>
                    )
                })}
                    USER
                        </nav>
                    </SheetClose>
                    <Footer user={user} type="mobile"/>
                </div>
          </SheetContent>
        </Sheet>
    </section>
  )
}

export default MobileNavbar