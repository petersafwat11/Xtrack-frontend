"use client";
import { useState } from "react";
import styles from "../cargoTracker/CargoTracker.module.css";
import axios from "axios";
import { fetchTrackerData } from "@/lib/trackerService";
import SearchContainer from "../commen/search/SearchContainer";
import MetaData from "../commen/metaData/MetaData";
import Table from "../commen/table/Table";
const OceanFTTracker = ({ APILink }) => {
  const generateMetaData = (data) => {
    const metadata = [
      { label: "Container", value: data?.container || null },
      { label: "Type", value: data?.container_type || null },
      { label: "Updated At", value: data?.updated_at || null },
      { label: "From", value: data?.from?.port || null },
      { label: "To", value: data?.to?.port || null },
      {
        label: "Status",
        value:
          `${data?.last?.status}, ${data?.last?.port}, ${data?.last?.date}` ||
          null,
      },
      { label: "ETA DEPARTURE", value: data?.from?.date || null },
      { label: "ETA ARRIVAL", value: data?.estimated_time_of_arrival || null },
    ];
    return metadata;
  };

  const [searchNumber, setSearchNumber] = useState("");
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchChange = (e) => {
    const formattedValue = e.target.value;
    if (formattedValue.length <= 20) {
      setSearchNumber(formattedValue);
    }
  };

  const fetchData = async () => {
    await fetchTrackerData({
      searchQuery: searchNumber.trim(),
      menuId: "Ocean FT",
      apiLink: APILink,
      processResponseData: (response) => response?.data?.data,
      generateMetadata: generateMetaData,
      setState: {
        setLoading,
        setError,
        setData,
        setMetadata,
      },
      errorMessages: {
        wrongNumber: "Wrong Number, Enter a valid container number",
        noData: "No Tracking Info Found, please try again later",
        genericError: "No Tracking Info Found. Please try again.",
      },
    });
  };

  return (
    <div className={styles.container}>
      <SearchContainer
        label={"CONTAINER NO"}
        loading={loading}
        fetchData={fetchData}
        searchNumber={searchNumber}
        handleSearchChange={handleSearchChange}
      />

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Fetching tracking information...</p>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}

      {metadata !== null && !loading && !error && (
        <MetaData metadata={metadata} />
      )}

      <div className={styles.tableContainer}>
        {!data && !loading && !error ? (
          <div className={styles.emptyState}>
            Enter a tracking number to view shipment details
          </div>
        ) : data && !loading && !error ? (
          <Table
            headers={["DATE", "LOCATION", "FACILITY", "STATUS"]}
            data={
              data?.events &&
              data?.events?.length > 0 &&
              data?.events
                .filter((event) => new Date(event?.date) < new Date())
                .map((event, index) => ({
                  date: event?.date,
                  location: event?.location,
                  facility: event?.port,
                  status: event?.status,
                }))
            }
          />
        ) : null}
      </div>
    </div>
  );
};
export default OceanFTTracker;
