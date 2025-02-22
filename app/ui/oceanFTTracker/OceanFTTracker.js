"use client";
import { useState } from "react";
import styles from "../cargoTracker/CargoTracker.module.css";
import axios from "axios";

const OceanFTTracker = () => {
  const generateMetaData = (data) => {
    const metadata = {
      type: data?.container_type || null,
      number: data?.container || null,
      updated_at: data?.updated_at || null,
      status: `${data?.last?.status}, ${data?.last?.port}, ${data?.last?.date}` || null,
      from: data?.from?.port || null,
      to: data?.to?.port || null,
      arrival: data?.estimated_time_of_arrival || null,
      departure: data?.from?.date || null,
    };
    return metadata;
  };

  const [searchNumber, setSearchNumber] = useState("");
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("data", data, "metadata", metadata)
  const handleSearchChange = (e) => {
    const formattedValue = e.target.value;
    // Limit the total length (including hyphen) to 12 characters
    if (formattedValue.length <= 20) {
      setSearchNumber(formattedValue);
    }
  };
  const fetchData = async () => {
    if (!searchNumber.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setMetadata(null);

    try {
      const response = await axios.get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(`http://178.128.210.208:8000/findteu/api/tracker/${searchNumber}`)}&timestamp=${new Date().getTime()}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Cache-Control': 'no-cache, no-store, must-revalidate',
            // 'Pragma': 'no-cache',
            // 'Expires': '0'
          },
          timeout: 90000, 
        }
      );

      // allorigins returns the data in a nested 'contents' property as a string
      const responseData = JSON.parse(response.data.contents);
      console.log("response", response, responseData)
      if (responseData?.error === "We couldn't find any data available on public track for this container") {
        setError("Wrong Number, Enter a valid container number");
        return;
      }
      setData(responseData);
      setMetadata(generateMetaData(responseData));
    } catch (error) {
      setError("No tracking info found, try again later.");
      console.error("Tracking Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.searchForm}>
          <div className={styles.searchInputContainer}>
          <p className={styles.searchLabel}>CONTAINER NO</p>

          <input
            type="text"
            value={searchNumber}
            onChange={handleSearchChange}
            placeholder="Enter tracking number"
            className={styles.searchInput}
            maxLength={12}
          />

          </div>
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
            <p className={styles.label}>CONTAINER</p>
            <p className={styles.value}>{metadata?.number}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>TYPE</p>
            <p className={styles.value}>{metadata?.type}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>UPDATED AT</p>
            <p className={styles.value}>{metadata?.updated_at}</p>
          </div>

          <div className={styles.metadataItem}>
            <p className={styles.label}>FROM </p>
            <p className={styles.value}> {metadata?.from}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>TO </p>
            <p className={styles.value}>{metadata?.to}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>STATUS</p>
            <p className={styles.value}>{metadata?.status}</p>
          </div>

          <div className={styles.metadataItem}>
            <p className={styles.label}>ETA DEPARTURE</p>
            <p className={styles.value}>{metadata?.departure}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>ETA ARRIVAL</p>
            <p className={styles.value}>{metadata?.arrival}</p>
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
                <th className={styles["header-item"]}>DATE</th>
                <th className={styles["header-item"]}>LOCATION</th>
                <th className={styles["header-item"]}>FACILITY</th>
                <th className={styles["header-item"]}>STATUS</th>
              </tr>
            </thead>
            <tbody>
               {data?.events && data?.events?.length>0 &&data?.events?.map((event, index) => (
                <tr className={styles["table-row"]} key={index}>
                  <td className={styles["row-item"]}>{event?.date}</td>
                  <td className={styles["row-item"]}>{event?.location}</td>
                  <td className={styles["row-item"]}>{event?.port}</td>
                  <td className={styles["row-item"]}>{event?.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
export default OceanFTTracker