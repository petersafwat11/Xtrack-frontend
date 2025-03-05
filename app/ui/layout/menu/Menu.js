"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./menu.module.css";
import {
  FiHome,
  FiCalendar,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiCrosshair,
} from "react-icons/fi";
import Image from "next/image";
import Cookies from "js-cookie";

const Menu = ({toggleMenu, isMenuOpen}) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  // Safely access cookies only on the client side
  useEffect(() => {
    try {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        const userData = JSON.parse(userCookie);
        setUser(userData);
        setIsAdmin(userData?.menuPermissions?.showSettingsAPI || false);
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
    }
  }, []);

  const navPathName = {
    Schedule: ["/air", "/ocean"],
    Settings: ["/profile", "/endpoints", "/logs", "/feedback", "/support"],
    Tracker: ["/ocean-af", "/ocean-sr", "/air-cargo", "/vessel","/port-congestion", "/ocean-traffic", "/ocean-ft"],
  };

  const isPathInSection = (path, sectionPaths) => {
    return sectionPaths.includes(path);
  };

  const [expandedItems, setExpandedItems] = useState({
    Schedule: isPathInSection(pathname, navPathName.Schedule),
    Settings: isPathInSection(pathname, navPathName.Settings),
    Tracker: isPathInSection(pathname, navPathName.Tracker),
  });
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const dashboardItems = [
    {
      title: "dashboard",
      path: "/",
    },
  ];
  const settingsItems = [
    { title: "Profile", path: "/profile" },
    isAdmin ? { title: "API Endpoints", path: "/endpoints" } : null,
    { title: "Logs", path: "/logs" },
    { title: "Feedback", path: "/feedback" },
    isAdmin ? { title: "Users", path: "/users" } : null,
  ].filter(Boolean);
  const menuItems = [
    {
      title: "Tracker",
      icon: (
        <FiCrosshair
          onClick={() => {
            toggleMenu();
            // setIsCollapsed(false);
          }}
        />
      ),
      path: "/tracker",
      children: [
        { title: "Ocean (FT)", path: "/ocean-ft" },
        { title: "Ocean (AF)", path: "/ocean-af" },
        { title: "Ocean (SR)", path: "/ocean-sr" },
        { title: "Air Cargo", path: "/air-cargo" },
        { title: "Vessel", path: "/vessel" },
        { title: "Marine Traffic", path: "/marine-traffic" },
          ],
    },
    {
      title: "Schedule",
      icon: (
        <FiCalendar
          onClick={() => {
            toggleMenu();
            // setIsCollapsed(false);
          }}
        />
      ),
      path: "/schedule",
      children: [
        { title: "Ocean", path: "/ocean" },
        { title: "Air", path: "/air" },
      ],
    },
    {
      title: "Settings",
      icon: (
        <FiSettings
          onClick={() => {
            toggleMenu();
            // setIsCollapsed(false);
          }}
        />
      ),
      path: "/settings",
      children: settingsItems,
    },
  ];

  // const toggleCollapse = () => {
  //   setIsCollapsed(!isCollapsed);
  // };

  const toggleSubmenu = (title) => {
    if (isMenuOpen) {
      setExpandedItems((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  const isActive = (path) => pathname === path;
  const isParentActive = (children) =>
    children?.some((child) => pathname === child.path);

  return (
    <nav
      className={`${styles.sidebar} ${isMenuOpen ? styles.open : ""} ${
        !isMenuOpen ? styles.collapsed : ""
      }`}
    >
      <div className={styles.menuHeader}>
        {/* <h1 className={styles.title}>Xtrack</h1> */}
        <Image style={{cursor:"pointer"}} src="/svg/logo.png" alt="logo" width={80} height={39} />
        <button className={styles.menuToggle} onClick={toggleMenu}>
          <FiMenu size={20} />
        </button>
      </div>

      <ul className={styles.menu}>
        {dashboardItems.map((page, index) => (
          <li
            className={`${styles["standalone-item"]} ${
              isActive(page.path) ? styles.active : ""
            }`}
            key={page.path}
          >
            {index === 0 && (
              <span className={styles.menuIcon} style={{ marginRight: !isMenuOpen ? 0 : "0.75rem" }}>
              <FiHome
                onClick={() => {
                  // setIsCollapsed(false);
                  toggleMenu();
                }}
              />
              </span>
            )}

              <Link
              style={{    padding:index===0? "0":""}}
                href={page.path}
                className={`
                  ${styles.submenuItem}
                  ${isActive(page.path) ? styles.active : ""}
                `}

              >
                Dashboard
              </Link>
          </li>
        ))}

        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`
            ${styles.menuItem}
          `}
          >
            <div
              className={styles.menuItemHeader}
              onClick={() => toggleSubmenu(item.title)}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuTitle}>{item.title==="Tracker"? "Live Tracking":item.title}</span>
              <span className={styles.menuArrow}>
                {expandedItems[item.title] ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                )}
              </span>
            </div>
            {item.children && (
              <ul
                className={`
                ${styles.submenu}
                ${expandedItems[item.title] ? styles.expanded : ""}
              `}
              >
                {item.children.map((child) => (
                  <li key={child.path}>
                    <Link
                      href={child.path}
                      className={`
                        ${styles.submenuItem}
                        ${isActive(child.path) ? styles.active : ""}
                      `}
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
