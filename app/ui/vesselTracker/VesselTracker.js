'use client'
import { useState } from "react";
import axios from "axios";
import styles from "./vesselTracker.module.css";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});

const VesselTracker = () => {
  const [searchNumber, setSearchNumber] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!searchNumber.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `http://178.128.210.208:8000/sinay/api/tracker/${searchNumber}`
        )}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const responseData = JSON.parse(response.data.contents);
      console.log("response", response);

      if (responseData?.error) {
        setError("No Vessel Info Found");
        return;
      }

      setData(responseData?.data);
    } catch (error) {
      setError("Error fetching vessel data");
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
          <p className={styles.searchLabel}>Vessel IMO</p>

          <input
            type="text"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            placeholder="Enter Vessel IMO"
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
        <div className={styles.loadingState}>Loading vessel information...</div>
      )}

      {error && <div className={styles.errorState}>{error}</div>}

      {data && !loading && !error && (
        <div className={styles.resultContainer}>
          <div className={styles.vesselInfo}>
            <h3>Vessel Information</h3>
            <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
                <span className={styles.label}>UPDATED AT:</span>
                <span className={styles.value}>{data.results[0].updated_at}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>VESSEL ID:</span>
                <span className={styles.value}>{data.results[0].id}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Name:</span>
                <span className={styles.value}>{data.results[0].name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>MMSI:</span>
                <span className={styles.value}>{data.results[0].mmsi}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>IMO:</span>
                <span className={styles.value}>{data.results[0].imo}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>CALL SIGN:</span>
                <span className={styles.value}>{data.results[0].call_sign}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>SHIP TYPE:</span>
                <span className={styles.value}>{data.results[0].ship_type}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Flag:</span>
                <span className={styles.value}>{data.results[0].flag}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Length:</span>
                <span className={styles.value}>{data.results[0].length}m</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Width:</span>
                <span className={styles.value}>{data.results[0].width}m</span>
              </div>
            </div>
          </div>

          {data.results[0].last_position && (
            <div className={styles.mapContainer}>
              {/* <h3>Current Location</h3> */}
              <MapComponent
                position={[
                  data.results[0].last_position.position.coordinates[1],
                  data.results[0].last_position.position.coordinates[0],
                ]}
                vesselName={data.results[0].name}
              />
              {/* <div className={styles.locationDetails}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Speed:</span>
                  <span className={styles.value}>
                    {data.results[0].last_position.speed} knots
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Course:</span>
                  <span className={styles.value}>
                    {data.results[0].last_position.course}°
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Last Update:</span>
                  <span className={styles.value}>
                    {new Date(
                      data.results[0].last_position.timestamp
                    ).toLocaleString()}
                  </span>
                </div>
              </div> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VesselTracker;