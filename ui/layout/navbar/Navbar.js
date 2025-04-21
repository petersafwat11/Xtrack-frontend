"use client";
import React, { useState, useEffect } from "react";
import classes from "./navbar.module.css";
import Link from "next/link";
import navDefault from "./default";
import { FaHome, FaCog, FaChevronRight, FaBars, FaTimes } from "react-icons/fa";
import logo from "@/public/svg/logo.png";
import { usePathname } from "next/navigation";
import { poppins } from "@/app/fonts";
import Image from "next/image";
import { FiCalendar, FiCrosshair } from "react-icons/fi";
import Cookies from "js-cookie";
const getIcon = (title) => {
  switch (title) {
    case "Dashboard":
      return <FaHome className={classes.icon} />;
    case "Tracker":
      return <FiCrosshair className={classes.icon} />;
    case "Schedule":
      return <FiCalendar className={classes.icon} />;
    case "Settings":
      return <FaCog className={classes.icon} />;
    default:
      return null;
  }
};

const Navbar = () => {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const [isAdmin, setIsAdmin] = useState(false);

  // Safely access cookies only on the client side
  useEffect(() => {
    try {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        const userData = JSON.parse(userCookie);
        setIsAdmin(userData?.menuPermissions?.showSettingsAPI || false);
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
    }
  }, []);

  const settingsItems = [
    { title: "Profile", path: "/profile" },
    isAdmin ? { title: "API Endpoints", path: "/endpoints" } : null,
    { title: "Logs", path: "/logs" },
    { title: "Feedback", path: "/feedback" },
    isAdmin ? { title: "Users", path: "/users" } : null,
  ].filter(Boolean);

  const navState = {
    expanded: navDefault.expanded,
    items: [
      ...navDefault.items,
      {
        title: "Settings",
        active: false,
        children: settingsItems,
      },
    ],
  };

  const [navbar, setNavbar] = useState(navState);

  // Add effect to toggle body class based on navbar state
  useEffect(() => {
    if (navbar.expanded) {
      document.body.classList.add("nav-expanded");
    } else {
      document.body.classList.remove("nav-expanded");
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("nav-expanded");
    };
  }, [navbar.expanded]);

  const toggleNavbar = () => {
    setNavbar({ ...navbar, expanded: !navbar.expanded });
  };

  const expandNavbar = () => {
    if (!navbar.expanded) {
      setNavbar({ ...navbar, expanded: true });
    }
  };

  const toggleSubmenu = (index) => {
    const updatedNavbar = { ...navbar };
    updatedNavbar.items[index].active = !updatedNavbar.items[index].active;
    setNavbar({ ...updatedNavbar, expanded: true });
  };

  const handleNavItemClick = (item, index) => {
    if (item.path === undefined && item?.children?.length > 0) {
      toggleSubmenu(index);
    } else {
      expandNavbar();
    }
  };

  return isLogin ? null : (
    <div
      className={`${classes.navbar} ${poppins.className} ${
        navbar.expanded ? classes.expanded : classes.collapsed
      }`}
    >
      <div className={classes.navbar_header}>
        {navbar.expanded ? (
          <div className={classes.logo_container}>
            <Image
              width={80}
              height={40}
              src={logo}
              alt="logo"
              className={classes.logo}
            />
            <button className={classes.toggle_btn} onClick={toggleNavbar}>
              <FaTimes />
            </button>
          </div>
        ) : (
          <button className={classes.toggle_btn} onClick={toggleNavbar}>
            <FaBars />
          </button>
        )}
      </div>
      <div className={classes.nav_items}>
        {navbar.items.map((item, index) => (
          <div key={item.title} className={classes.nav_item}>
            <div className={classes.nav_item_header}>
              {item.path ? (
                <Link
                  href={item.path}
                  className={classes.nav_link}
                  onClick={() => expandNavbar()}
                >
                  {getIcon(item.title)}
                  {navbar.expanded && (
                    <span className={classes.nav_title}>{item.title}</span>
                  )}
                </Link>
              ) : (
                <div
                  className={classes.nav_link}
                  onClick={() => handleNavItemClick(item, index)}
                >
                  {getIcon(item.title)}
                  {navbar.expanded && (
                    <>
                      <span className={classes.nav_title}>{item.title}</span>
                      <FaChevronRight
                        className={`${classes.arrow} ${
                          item.active ? classes.arrow_active : ""
                        }`}
                      />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Show submenu in expanded mode */}
            {item.children && item.active && navbar.expanded && (
              <div className={classes.nav_sub_items}>
                {item.children.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.path}
                    className={classes.nav_sub_link}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
