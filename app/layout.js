"use client";
import { Geist } from "next/font/google";
import "./globals.css";
import Menu from "./ui/layout/menu/Menu";
import Header from "./ui/layout/header/Header";
import styles from "./layout.module.css";
import { useState } from "react";
import { DMSans } from "./fonts";
import { Toaster } from "react-hot-toast";
// export const metadata = {
//   title: "Dashboard",
//   description: "Dashboard application",
// };

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <html lang="en">
      <body className={DMSans.className}>
        <Toaster position="top-right" />
        <div className={styles.layout}>
          <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
          <Menu isOpen={isMenuOpen} />
          <main
            className={`${styles.main} ${!isMenuOpen ? styles.expanded : ""}`}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
