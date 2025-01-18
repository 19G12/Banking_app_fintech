import MobileNavbar from "@/components/MobileNavbar";
import SideBar from "@/components/SideBar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const sessionUser = await getLoggedInUser();
    if (!sessionUser) redirect("/sign-in");
    
    sessionUser['name'] = `${sessionUser.firstName} ${sessionUser.lastName}`;
    
  return (
     <main className="flex h-screen w-full font-inter">
        <SideBar user={sessionUser} />
        <div className="flex size-full flex-col">
            <div className="root-layout">
                <Image 
                    src={"/icons/logo.svg"}
                    width={30}
                    height={30}
                    alt="mobile-logo"
                />
                <div>
                    <MobileNavbar user={sessionUser} />
                </div>
            </div>
            {children}
        </div>
      </main>
  );
}
