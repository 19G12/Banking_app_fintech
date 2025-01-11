"use client";
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer";

const SideBar = ({user}:SiderbarProps) => {

    const pathName = usePathname();

  return (
    <section className="sidebar">
        <nav className="flex flex-col gap-4">
                <Link href={"/"}className="mb-12 flex cursor-pointer items-center gap-2">
                    <Image 
                        src={"/icons/logo.svg"}
                        alt="Horizon"
                        width={34}
                        height={34}
                        className="size-[24px] max-xl:size-14"
                    />
                    <h1 className="sidebar-logo">Horizon</h1>
                </Link>
            {sidebarLinks.map((value: { imgURL: string; route: string; label: string; }, index: number) => {
                const isActive = (pathName === value.route || pathName.startsWith(`${value.route}`))
                return(
                <Link href={value.route} key={index} className={cn("sidebar-link text-black	",{
                    "bg-bank-gradient": isActive
                })}>
                    <div className="relative size-6">
                        <Image 
                            src={value.imgURL}
                            alt={value.label}
                            width={34}
                            height={34}
                            className={cn({"brightness-[3] invert-0": isActive})}
                        /> 
                    </div>
                    <p className={cn("sidebar-label",{
                        "!text-white": isActive
                    })}>
                        {value.label}
                    </p>
                </Link>
            )
            })}
            USER
        </nav>
        
        <Footer user={user} type="desktop"/>
    </section>
  )
}

export default SideBar