"use client";
import { useState } from "react";
import styles from "./CargoTracker.module.css";
import { fetchTrackerData } from "@/app/lib/trackerService";
import axios from "axios";

export default function CargoTracker({APILink}) {
  const [searchNumber, setSearchNumber] = useState("");
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatSearchNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    
    if (numbers.length > 3) {
      return numbers.slice(0, 3) + '-' + numbers.slice(3);
    }
    return numbers;
  };

  const handleSearchChange = (e) => {
    const formattedValue = formatSearchNumber(e.target.value);
    // Limit the total length (including hyphen) to 12 characters
    if (formattedValue.length <= 20) {
      setSearchNumber(formattedValue);
    }
  };

  const generateMetaData = (data) => {
    const metadata = {
      number: data?.metadata?.request_parameters?.number || null,
      airline: data?.metadata?.airline?.name || null,
      updated_at: data?.metadata?.updated_at || null,
      status: data?.data?.status || null,
      arrival: data?.data?.arrival_datetime_local?.actual || null,
      from_name: data?.data?.from?.name || null,
      from_country: data?.data?.from?.country || null,
      to_name: data?.data?.to?.name || null,
      to_country: data?.data?.to?.country || null,
      departure: data?.data?.departure_datetime_local?.actual || null,
    };
    return metadata;
  };

  const fetchData = async () => {
    await fetchTrackerData({
      searchQuery: searchNumber,
      menuId: 'Air Cargo',
      apiLink: APILink,
      processResponseData: (response) => response?.data?.data,
      generateMetadata: generateMetaData,
      setState: {
        setLoading,
        setError,
        setData,
        setMetadata
      },
      errorMessages: {
        wrongNumber: "Wrong Number",
        noData: "No Tracking Info Found, please try again later",
        genericError: "No Tracking Info Found, please try again later."
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.searchForm}>
          <div className={styles.searchInputContainer}>
          <p className={styles.searchLabel}>AIRWAY BILL</p>

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
            <p className={styles.label}>MAWB</p>
            <p className={styles.value}>{metadata?.number}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>AIRLINE</p>
            <p className={styles.value}>{metadata?.airline}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>UPDATED AT</p>
            <p className={styles.value}>{metadata?.updated_at}</p>
          </div>

          <div className={styles.metadataItem}>
            <p className={styles.label}>FROM </p>
            <p className={styles.value}> {metadata?.from_name}, {metadata?.from_country}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>TO </p>
            <p className={styles.value}>{metadata?.to_name}, {metadata?.to_country}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>STATUS</p>
            <p className={styles.value}>{metadata?.status}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>DEPARTURE DATE</p>
            <p className={styles.value}>{metadata?.departure}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>ARRIVAL DATE</p>
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
                <th className={styles["header-item"]}>ID</th>
                <th className={styles["header-item"]}>DATE</th>
                <th className={styles["header-item"]}>EVENT</th>
                <th className={styles["header-item"]}>DESCRIPTION</th>
                <th className={styles["header-item"]}>LOCATION</th>
                <th className={styles["header-item"]}>IATA/ICAO</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.events?.map((event, index) => (
                <tr className={styles["table-row"]} key={index}>
                  <td className={styles["row-item"]}>{event.order_id}</td>
                  <td className={styles["row-item"]}>{event.datetime_local.actual}</td>
                  <td className={styles["row-item"]}>{event.event_code}</td>
                  <td className={styles["row-item"]}>{event.description}</td>
                  <td className={styles["row-item"]}>{event.location?.name}, {event.location?.country}</td>
                  <td className={styles["row-item"]}>{event.location?.iata_code}/{event.location?.icao_code} </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
