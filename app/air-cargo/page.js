import styles from "./page.module.css";
import CargoTracker from "../ui/cargoTracker/CargoTracker";

export default function AirCargoPage() {
  return (
    <div className={styles.container}>
      <CargoTracker />
    </div>
  );
}
