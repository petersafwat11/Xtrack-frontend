import { Suspense } from "react";
import styles from "./page.module.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import Dashboard from "../ui/dashboard/Dashboard";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) {
    redirect("/login");
  }

  let userId = null;
  let data = null;
  try {
    const userData = JSON.parse(userCookie);
    userId = userData?.user_id;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/tracking/dashboard?user_id=${userId}&year=2025`,
      {}
    );
    data = res.data;
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  return (
    <div className={styles.page}>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.loading}>Loading dashboard data...</div>
          </div>
        }
      >
        <Dashboard data={data} userId={userId} />
      </Suspense>
    </div>
  );
}
