// "use client";
import "./globals.css";
import styles from "./layout.module.css";
import { Toaster } from "react-hot-toast";
import SignOutButton from "../ui/layout/signout/SignOutButton";
import UserName from "../ui/layout/userName/UserName";
import { poppins } from "./fonts";
import Navbar from "@/ui/layout/navbar/Navbar";
export const metadata = {
  title: "Xtrack",
  description: "renders data from many sources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Toaster position="top-right" />
        <div className="app-container">
          <Navbar />
          <main
            className={
              // islogin ? "" :
              "main-content"
            }
          >
            <div className={styles.user}>
              <UserName />
              <SignOutButton />
            </div>

            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
