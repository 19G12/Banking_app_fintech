import { LogOutUser } from "@/lib/actions/user.actions";
import Image from "next/image"
import { useRouter } from "next/navigation";

const Footer = ({user, type="desktop"}: FooterProps) => {
    
    const router = useRouter();
    const handleLogOut = async () => {
        
        try {
            const loggedOut = await LogOutUser();
            
            if(loggedOut) {
                router.push("/sign-in");
            }
        } catch (error) {
            console.log("Error: ",error);
        }
        
    };

  return (
    <footer className="footer">
        <div className={`${type === "mobile" ? "footer_name-mobile" : "footer_name"}`}>
            <p className="text-xl font-bold text-gray-700"> {user?.name[0] || "G"} </p>
        </div>
        <div className={type === "mobile" ? "footer_email-mobile" : "footer_email"}>
            <h1 className="text-14 truncate font-normal text-gray-600"> 
                {user?.name || "Guest name"}
            </h1>
            <p className="text-14 truncate font-semibold text-gray-700">
                {user?.email || "guestmail@xyz.com"}
            </p>
        </div>
        <div className={type === "mobile" ? "footer_image-mobile" : "footer_image"} onClick={handleLogOut}>
            <Image 
                src={"/icons/logout.svg"}
                fill
                alt="footer_img"
            />
        </div>
    </footer>
  )
}

export default Footer