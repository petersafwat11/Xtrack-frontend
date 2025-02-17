"use client";
import { useState } from "react";
import styles from "./CargoTracker.module.css";
import axios from "axios";
export default function CargoTracker() {
  const [searchNumber, setSearchNumber] = useState("");
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateMetaData = (data) => {
    const metadata = {
      number: data?.metadata?.request_parameters?.number || null,
      airline: data?.metadata?.airline?.name || null,
      updated_at: data?.metadata?.updated_at || null,
      status: data?.data?.status || null,
      arrival: data?.data?.arrival_datetime_local?.actual || null,
      from_airport: data?.data?.from?.iata_code || null,
      from_country: data?.data?.from?.country || null,
      to_airport: data?.data?.to?.iata_code || null,
      to_country: data?.data?.to?.country || null,
      departure: data?.data?.departure_datetime_local?.actual || null,
    };
    return metadata;
  };

  const fetchData = async () => {
    if (!searchNumber.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setMetadata(null);

    try {
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/http://178.128.210.208:8000/airrates/api/tracker/${searchNumber}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          // timeout: 10000,
          // ssdds
        }
      );

      if (response.status_code === "WRONG_NUMBER") {
        setError("Wrong Number");
        return;
      }
      if (response.status_code === "no data received") {
        setError("No Tracking Info Found");
        return;
      }

      setData(response);
      setMetadata(generateMetaData(response));
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setError("Network Error: The tracking service is currently unavailable. This might be due to CORS restrictions. Please try again later or contact support.");
      } else if (error.code === "ECONNABORTED") {
        setError("Request timeout: The server took too long to respond. Please try again.");
      } else if (error.response?.status === 404) {
        setError("Tracking service not found. Please try again later.");
      } else if (error.response?.status === 403) {
        setError("Access to tracking service is forbidden. Please contact support.");
      } else {
        setError("An error occurred while fetching tracking information. Please try again.");
      }
      console.error("Tracking Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.searchForm}>
          <input
            type="text"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            placeholder="Enter tracking number"
            className={styles.searchInput}
          />
          <button
            onClick={fetchData}
            className={styles.searchButton}
            disabled={loading}
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Fetching tracking information...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {metadata !== null && !loading && !error && (
        <div className={styles.metadata}>
          <div className={styles.metadataItem}>
            <p className={styles.label}>Number</p>
            <p className={styles.value}>{metadata?.number}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>Airline</p>
            <p className={styles.value}>{metadata?.airline}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>Updated At</p>
            <p className={styles.value}>{metadata?.updated_at}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>Status</p>
            <p className={styles.value}>{metadata?.status}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>Arrival</p>
            <p className={styles.value}>{metadata?.arrival}</p>
          </div>

          <div className={styles.metadataItem}>
            <p className={styles.label}>From Airport</p>
            <p className={styles.value}>{metadata?.from_airport}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>From Country</p>
            <p className={styles.value}>{metadata?.from_country}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>To Airport</p>
            <p className={styles.value}>{metadata?.to_airport}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>To Country</p>
            <p className={styles.value}>{metadata?.to_country}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>Departure</p>
            <p className={styles.value}>{metadata?.departure}</p>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        {!data && !loading && !error ? (
          <div className={styles.emptyState}>
            Enter a tracking number to view shipment details
          </div>
        ) : data && !loading && !error ? (
          <table className={styles.table}>
            <thead>
              <tr className={styles["table-header"]}>
                <th className={styles["header-item"]}>Order ID</th>
                <th className={styles["header-item"]}>Event Code</th>
                <th className={styles["header-item"]}>description</th>
                <th className={styles["header-item"]}>Location</th>
                <th className={styles["header-item"]}>State</th>
                <th className={styles["header-item"]}>Country</th>
                <th className={styles["header-item"]}>Date Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.events?.map((event, index) => (
                <tr className={styles["table-row"]} key={index}>
                  <td className={styles["row-item"]}>{event.order_id}</td>
                  <td className={styles["row-item"]}>{event.event_code}</td>
                  <td className={styles["row-item"]}>{event.description}</td>
                  <td className={styles["row-item"]}>{event.location.name}</td>
                  <td className={styles["row-item"]}>{event.location.state}</td>
                  <td className={styles["row-item"]}>{event.location.country}</td>
                  <td className={styles["row-item"]}>{event.datetime_local.actual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
