import Image from "next/image";

export default async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    
    return (
        <main className="w-full">
          <section className="min-h-full w-full flex justify-between font-inter">
            {children}
            <div className="auth-asset">
              <Image 
                src={"/icons/auth-image.svg"}
                alt="auth_image"
                width={500}
                height={500}
              />
            </div>
          </section>
        </main>
    );
  }
  