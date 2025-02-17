"use client";
import "./globals.css";
import Menu from "./ui/layout/menu/Menu";
import styles from "./layout.module.css";
import { useState } from "react";
import { DMSans } from "./fonts";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import SignOutButton from "./ui/signout/SignOutButton";
// export const metadata = {
//   title: "Xtrack",
//   description: "renders data from many sources",
// };

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <html lang="en">
      <body className={DMSans.className}>
        <Toaster position="top-right" />
        <div className={styles.layout}>
          {
          !isLoginPage && 
          <Menu 
          toggleMenu={toggleMenu} 
          isMenuOpen={isMenuOpen}
           />
           }
          <main
            className={`${styles.main} ${
              !isMenuOpen || isLoginPage ? styles.expanded : ""
            }`}
          >
            {
            !isLoginPage && 
            <SignOutButton />}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
