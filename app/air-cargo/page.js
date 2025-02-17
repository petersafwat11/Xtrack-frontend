import styles from "./page.module.css";
import CargoTracker from "../ui/cargoTracker/CargoTracker";
import { manrope } from "../fonts";
export default function AirCargoPage() {
  return (
    <div className={styles.container}>
      <h2 className={`
         ${styles['title']}`}>AIR CARGO TRACKING</h2>
      <CargoTracker />
    </div>
  );
}
