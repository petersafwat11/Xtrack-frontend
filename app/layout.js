"use client";
import "./globals.css";
import Menu from "../ui/layout/menu/Menu";
import styles from "./layout.module.css";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import SignOutButton from "../ui/layout/signout/SignOutButton";
import UserName from "../ui/layout/userName/UserName";
import { poppins } from "./fonts";
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
      <body className={poppins.className}>
        <Toaster position="top-right" />
        <div className={styles.layout}>
          {!isLoginPage && (
            <Menu toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
          )}
          <main
            className={`${isLoginPage ? styles.login : styles.main} ${
              !isMenuOpen || isLoginPage ? styles.expanded : ""
            }`}
          >
            {!isLoginPage && (
              <div className={styles.user}>
                <UserName />
                <SignOutButton />
              </div>
            )}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
