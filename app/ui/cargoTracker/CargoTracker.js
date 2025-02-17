"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "./CargoTracker.module.css";
import axios from "axios";
import { useDebounce } from "use-debounce";
import jsonData from "../../../json.json";

export default function CargoTracker() {
  const [searchNumber, setSearchNumber] = useState(jsonData.metadata.request_parameters.number || "");
  console.log('jsonData', jsonData)
  const [data, setData] = useState(jsonData);
  const [metadata] = useState({
    number: jsonData.metadata.request_parameters.number || null,
    airline: jsonData.metadata.airline.name || null,
    updated_at: jsonData.metadata.updated_at || null,
    status: jsonData.data.status || null,
    arrival: jsonData.data.arrival_datetime_local?.actual || null,
    from_airport: jsonData.data.from.iata_code || null,
    from_country: jsonData.data.from.country || null,
    to_airport: jsonData.data.to.iata_code || null,
    to_country: jsonData.data.to.country || null,
    departure: jsonData.data.departure_datetime_local?.actual || null,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // API call implementation here
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://178.128.210.208:8000/airrates/api/tracker/${searchNumber}`
      );
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [searchNumber]);

  const [debouncedFetchData] = useDebounce(fetchData, 1000);

  useEffect(() => {
    debouncedFetchData();
  }, [debouncedFetchData]);

  return (
      <div className={styles.container}>
        <div className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            placeholder="Enter tracking number"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Track
          </button>
        </form>
      </div>

      <div className={styles.metadata}>
        <div className={styles.metadataItem}>
          <p className={styles.label}>Number</p>
          <p className={styles.value}>{metadata.number}</p>
        </div>
        <div className={styles.metadataItem}>
          <p className={styles.label}>Airline</p>
          <p className={styles.value}>{metadata.airline}</p>
        </div>
        <div className={styles.metadataItem}>
          <p className={styles.label}>Updated At</p>
          <p className={styles.value}>{metadata.updated_at}</p>
        </div>
        <div className={styles.metadataItem}>
          <p className={styles.label}>Status</p>
          <p className={styles.value}>{metadata.status}</p>
        </div>
        <div className={styles.metadataItem}>
          <p className={styles.label}>Arrival</p>
          <p className={styles.value}>{metadata.arrival}</p>
        </div>

        <div className={styles.metadataItem}>
          <p className={styles.label}>From Airport</p>
          <p className={styles.value}>{metadata.from_airport}</p>
        </div>
        <div className={styles.metadataItem}>
          <p className={styles.label}>From Country</p>
          <p className={styles.value}>{metadata.from_country}</p>
        </div>
        <div className={styles.metadataItem}>
          <p className={styles.label}>To Airport</p>
          <p className={styles.value}>{metadata.to_airport}</p>
        </div>
        <div className={styles.metadataItem}>
          <p className={styles.label}>To Country</p>
          <p className={styles.value}>{metadata.to_country}</p>
        </div>
        <div className={styles.metadataItem}>
          <p className={styles.label}>Departure</p>
          <p className={styles.value}>{metadata.departure}</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {!data ? (
          <div className={styles.emptyState}>
            Enter a tracking number to view shipment details
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr className={styles["table-header"]}>
                <th className={styles['header-item']}>Order ID</th>
                <th className={styles['header-item']}>Event Code</th>
                <th className={styles['header-item']}>description</th>
                <th className={styles['header-item']}>Location</th>
                <th className={styles['header-item']}>State</th>
                <th className={styles['header-item']}>Country</th>
                <th className={styles['header-item']}>Date Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.events?.map((event, index) => (
                <tr className={styles['table-row']} key={index}>
                  <td className={styles['row-item']}>{event.order_id}</td>
                  <td className={styles['row-item']}>{event.event_code}</td>
                  <td className={styles['row-item']}>{event.description}</td>
                  <td className={styles['row-item']}>{event.location.name}</td>
                  <td className={styles['row-item']}>{event.location.state}</td>
                  <td className={styles['row-item']}>{event.location.country}</td>
                  <td className={styles['row-item']}>{event.datetime_local.actual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
