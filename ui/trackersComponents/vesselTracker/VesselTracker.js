"use client";
import { useState } from "react";
import styles from "./vesselTracker.module.css";
import dynamic from "next/dynamic";
import { fetchTrackerData, formatTimestamp } from "@/lib/trackerService";
import SearchContainer from "../commen/search/SearchContainer";

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});

const VesselTracker = ({ APILink }) => {
  const [searchNumber, setSearchNumber] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    await fetchTrackerData({
      searchQuery: searchNumber.trim(),
      menuId: "Vessel Tracker",
      apiLink: APILink,
      processResponseData: (response) => response?.data?.data,
      setState: {
        setLoading,
        setError,
        setData: (responseData) => setData(responseData?.data),
      },
      errorMessages: {
        wrongNumber: "Invalid Vessel IMO",
        noData: "No Tracking Info Found, please try again later",
        genericError: "No Tracking Info Found. Please try again",
      },
    });
  };
  const handleSearchChange = (e) => {
    setSearchNumber(e.target.value);
  };
  console.log("ddddd", data);

  return (
    <div className={styles.container}>
      <SearchContainer
        label={"Vessel IMO"}
        loading={loading}
        fetchData={fetchData}
        searchNumber={searchNumber}
        handleSearchChange={handleSearchChange}
      />

      {loading && (
        <div className={styles.loading_state}>
          Loading vessel information...
        </div>
      )}

      {error && <div className={styles.error_state}>{error}</div>}

      {/* {data &&
        !loading &&
        !error &&
        data?.results &&
        data?.results.length > 0 && (
          <div className={styles.result_container}>
            <div className={styles.vessel_info}>
              <h3>Vessel Information</h3>
              <div className={styles.info_grid}>
                <div className={styles.info_item}>
                  <span className={styles.label}>UPDATED AT:</span>
                  <span className={styles.value}>
                    {formatTimestamp(data?.results[0].updated_at)}
                  </span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.label}>VESSEL ID:</span>
                  <span className={styles.value}>{data?.results[0].id}</span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.label}>Name:</span>
                  <span className={styles.value}>{data?.results[0].name}</span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.label}>MMSI:</span>
                  <span className={styles.value}>{data?.results[0].mmsi}</span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.label}>IMO:</span>
                  <span className={styles.value}>{data?.results[0].imo}</span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.label}>CALL SIGN:</span>
                  <span className={styles.value}>
                    {data?.results[0].call_sign}
                  </span>
                </div>

                <div className={styles.info_item}>
                  <span className={styles.label}>SHIP TYPE:</span>
                  <span className={styles.value}>
                    {data?.results[0].ship_type}
                  </span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.label}>Flag:</span>
                  <span className={styles.value}>{data?.results[0].flag}</span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.label}>Length:</span>
                  <span className={styles.value}>
                    {data?.results[0].length}m
                  </span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.label}>Width:</span>
                  <span className={styles.value}>
                    {data?.results[0].width}m
                  </span>
                </div>
              </div>
            </div>

            {data.results[0].last_position && (
              <div className={styles.map_container}>
                <MapComponent
                  position={[
                    data.results[0].last_position.position.coordinates[1],
                    data.results[0].last_position.position.coordinates[0],
                  ]}
                  vesselName={data.results[0].name}
                />
              </div>
            )}
          </div>
        )} */}
    </div>
  );
};

export default VesselTracker;
