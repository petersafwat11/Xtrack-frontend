"use client";
import { useState } from "react";
import styles from "./ocean.module.css";
import DateInput from "../inputs/dateInput/DateInput";
import Table from "../trackersComponents/commen/table/Table";
import { fetchOceanData } from "@/lib/trackerService";

const Ocean = ({ APILink }) => {
  const [inputsData, setInputsData] = useState({
    fromLocation: "",
    toLocation: "",
    date: new Date(),
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchData = () => {
    fetchOceanData({
      inputsData,
      apiLink: APILink,
      setLoading,
      setError,
      setData,
    });
  };

  // Main table headers
  const mainTableHeaders = [
    "Loading",
    "Cut Off Date",
    "Service",
    "Discharge",
    "Delivery",
    "Transit Days",
    "Dep date",
    "Arrival Date",
    "Vessel Voyage",
  ];

  // Routing details table headers
  const routingTableHeaders = [
    "From",
    "To",
    "Dep Date",
    "Arrival",
    "Service",
    "Vessel",
    "Transit Days",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.search_section}>
        <div className={styles.search_form}>
          <div className={styles.input_container}>
            <p className={styles.search_label}>From</p>

            <input
              type="text"
              value={inputsData?.fromLocation}
              onChange={(e) =>
                setInputsData({ ...inputsData, fromLocation: e.target.value })
              }
              placeholder="Enter From Location"
              className={styles.search_input}
            />
          </div>
          <div className={styles.input_container}>
            <p className={styles.search_label}>To</p>

            <input
              type="text"
              value={inputsData?.toLocation}
              onChange={(e) =>
                setInputsData({ ...inputsData, toLocation: e.target.value })
              }
              placeholder="Enter To Location"
              className={styles.search_input}
            />
          </div>
          <div className={styles.input_container}>
            <p className={styles.search_label}>From</p>
            <DateInput
              data={inputsData}
              setData={setInputsData}
              dataKey="date"
              label="Date"
            />
          </div>
          <button
            onClick={handleFetchData}
            className={styles.search_button}
            disabled={loading}
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loading_container}>
          <div className={styles.loading_spinner} />
          <p className={styles.loading_text}>
            Fetching tracking information...
          </p>
        </div>
      )}

      {error && <div className={styles.error_message}>{error}</div>}
      {!data && !loading && !error ? (
        <div className={styles.empty_state}>
          Enter a tracking number to view shipment details
        </div>
      ) : data && !loading && !error && data?.response_data?.length > 0 ? (
        data.response_data.map((oceanData, index) => (
          <div className={styles.table_container} key={index}>
            {/* Main Table */}
            <Table
              headers={mainTableHeaders}
              data={[
                {
                  port_of_loading: oceanData?.port_of_loading || "-",
                  port_cut_off_date: oceanData?.port_cut_off_date || "-",
                  service: oceanData?.service || "-",
                  port_of_discharge: oceanData?.port_of_discharge || "-",
                  place_of_delivery: oceanData?.place_of_delivery || "-",
                  transit_time: oceanData?.transit_time || "-",
                  departure_date: oceanData?.departure_date || "-",
                  arrival_date: oceanData?.arrival_date || "-",
                  vessel_voyage: oceanData?.vessel_voyage || "-",
                },
              ]}
              smallPadding={true}
            />

            {/* Routing Details Table */}
            {oceanData?.routing_details?.length > 0 && (
              <div className={styles.routing_table_wrapper}>
                <Table
                  headerBackgorund={"rgb(160 168 186)"}
                  headers={routingTableHeaders}
                  data={oceanData.routing_details.map((details) => ({
                    location_from: details?.location_from || "-",
                    location_to: details?.location_to || "-",
                    departure_date: details?.departure_date || "-",
                    arrival_date: details?.arrival_date || "-",
                    service: details?.service || "-",
                    vessel_voyage: details?.vessel_voyage || "-",
                    transit_time: details?.transit_time || "-",
                  }))}
                  smallPadding={true}
                />
              </div>
            )}
          </div>
        ))
      ) : null}
    </div>
  );
};

export default Ocean;
