"use client";
import { useState } from "react";
import styles from "./CargoTracker.module.css";
import { fetchTrackerData } from "@/lib/trackerService";
import SearchContainer from "../commen/search/SearchContainer";
import MetaData from "../commen/metaData/MetaData";
import Table from "../commen/table/Table";
export default function CargoTracker({ APILink }) {
  console.log("APILink", APILink);
  const [searchNumber, setSearchNumber] = useState("");
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatSearchNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, "");

    if (numbers.length > 3) {
      return numbers.slice(0, 3) + "-" + numbers.slice(3);
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
    const metadata = [
      { label: "MAWB", value: data?.metadata?.request_parameters?.number },
      { label: "Airline", value: data?.metadata?.airline?.name },
      { label: "Updated At", value: data?.metadata?.updated_at },
      { label: "Status", value: data?.data?.status },
      {
        label: "Arrival Date",
        value: data?.data?.arrival_datetime_local?.actual,
      },
      {
        label: "Departure Date",
        value: data?.data?.departure_datetime_local?.actual,
      },
      {
        label: "From",
        value: data?.data?.from?.name + "," + data?.data?.from?.country,
      },
      {
        label: "To",
        value: data?.data?.to?.name + "," + data?.data?.to?.country,
      },
    ];
    return metadata;
  };

  const fetchData = async () => {
    await fetchTrackerData({
      searchQuery: searchNumber.trim(),
      menuId: "Air Cargo",
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
        wrongNumber: "Wrong Number",
        noData: "No Tracking Info Found, please try again later",
        genericError: "No Tracking Info Found, please try again later.",
      },
    });
  };
  return (
    <div className={styles.container}>
      <SearchContainer
        label={"AIRWAY BILL"}
        loading={loading}
        fetchData={fetchData}
        searchNumber={searchNumber}
        handleSearchChange={handleSearchChange}
      />
      {loading && (
        <div className={styles.loading_container}>
          <div className={styles.loading_spinner} />
          <p className={styles.loading_text}>
            Fetching tracking information...
          </p>
        </div>
      )}

      {error && <div className={styles.error_message}>{error}</div>}

      {metadata !== null && !loading && !error && (
        <MetaData metadata={metadata} />
      )}

      <div className={styles.table_container}>
        {!data && !loading && !error ? (
          <div className={styles.empty_state}>
            Enter a tracking number to view shipment details
          </div>
        ) : data && !loading && !error ? (
          <Table
            headers={[
              "ID",
              "DATE",
              "EVENT",
              "DESCRIPTION",
              "LOCATION",
              "IATA/ICAO",
            ]}
            data={data?.data?.events.map((item) => ({
              id: item.order_id,
              date: item.datetime_local.actual,
              event: item.event_code,
              description: item.description,
              location: item.location?.name + "," + item.location?.country,
            }))}
          />
        ) : null}
      </div>
    </div>
  );
}
