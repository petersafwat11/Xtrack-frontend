"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./menu.module.css";
import {
  FiHome,
  FiCalendar,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

const menuItems = [
  {
    title: "Dashboard",
    icon: <FiHome />,
    path: "/dashboard",
    children: [
      { title: "Ocean (AF)", path: "/dashboard/ocean-af" },
      { title: "Ocean (SR)", path: "/dashboard/ocean-sr" },
      { title: "Air Cargo", path: "/dashboard/air-cargo" },
      { title: "Vessel", path: "/dashboard/vessel" },
      { title: "Port Congestion", path: "/dashboard/port-congestion" },
    ],
  },
  {
    title: "Schedule",
    icon: <FiCalendar />,
    path: "/schedule",
    children: [
      { title: "Ocean", path: "/schedule/ocean" },
      { title: "Air", path: "/schedule/air" },
    ],
  },
  {
    title: "Settings",
    icon: <FiSettings />,
    path: "/settings",
    children: [
      { title: "Profile", path: "/settings/profile" },
      { title: "API Endpoints", path: "/settings/api-endpoints" },
      { title: "Logs", path: "/settings/logs" },
      { title: "Feedback", path: "/settings/feedback" },
      { title: "Support", path: "/settings/support" },
    ],
  },
];

const Menu = ({ isOpen }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const pathname = usePathname();

  const toggleSubmenu = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (path) => pathname === path;
  const isParentActive = (children) =>
    children?.some((child) => pathname === child.path);

  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.menuHeader}>
        <h1 className={styles.title}>Xtrack</h1>
      </div>

      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`
            ${styles.menuItem}
            ${
              isActive(item.path) || isParentActive(item.children)
                ? styles.active
                : ""
            }
          `}
          >
            <div
              className={styles.menuItemHeader}
              onClick={() => toggleSubmenu(item.title)}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuTitle}>{item.title}</span>
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
