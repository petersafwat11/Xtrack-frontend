"use client";
import { useState } from "react";
import styles from "./ocean.module.css";
import axios from "axios";
import DateInput from "../inputs/dateInput/DateInput";
import { logTrackingSearch } from "@/lib/trackingLogger";

const Ocean = ({ APILink }) => {
  const [inputsData, setInputsData] = useState({
    fromLocation: "",
    toLocation: "",
    date: new Date(),
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (
      !inputsData.fromLocation.trim() ||
      !inputsData.toLocation.trim() ||
      !inputsData.date
    )
      return;

    setLoading(true);
    setError(null);
    setData(null);

    const date = inputsData.date
      ? `${inputsData.date.getFullYear()}/${String(
          inputsData.date.getMonth() + 1
        ).padStart(2, "0")}/${String(inputsData.date.getDate()).padStart(
          2,
          "0"
        )}`
      : "";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/tracking/s`,
        {
          params: {
            externalApiUrl: `${APILink}from/${inputsData.fromLocation.toLocaleUpperCase()}/to/${inputsData.toLocation.toLocaleUpperCase()}/date/${date}`,
          },
        }
      );
      console.log("response", response?.data);
      const responseData = response?.data?.data;
      if (responseData?.error === "Data not found") {
        setError("No Tracking Info Found");
        await logTrackingSearch({
          menu_id: "Ocean",
          api_request: `From: ${inputsData.fromLocation}, To: ${inputsData.toLocation}, Date: ${inputsData.date}`,
          api_status: "F",
          api_error: "No Tracking Info Found",
        });

        return;
      }
      if (responseData?.error === "no data received") {
        setError("No Tracking Info Found");
        await logTrackingSearch({
          menu_id: "Ocean",
          api_request: `From: ${inputsData.fromLocation}, To: ${inputsData.toLocation}, Date: ${inputsData.date}`,
          api_status: "F",
          api_error: "No Tracking Info Found",
        });
        return;
      }
      await logTrackingSearch({
        menu_id: "Ocean",
        api_request: `From: ${inputsData.fromLocation}, To: ${inputsData.toLocation}, Date: ${inputsData.date}`,
        api_status: "S",
      });

      setData(responseData);
    } catch (error) {
      if (error.response.data?.details?.response_status === "success") {
        console.log("success");

        const responseData = error?.response?.data?.details;
        if (responseData?.response_data.length===0) {
          setError("No Tracking Info Found");
          await logTrackingSearch({
            menu_id: "Ocean",
            api_request: `From: ${inputsData.fromLocation}, To: ${inputsData.toLocation}, Date: ${inputsData.date}`,
            api_status: "F",
            api_error: "No Tracking Info Found",
          });
          return;
        }
        await logTrackingSearch({
          menu_id: "Ocean",
          api_request: `From: ${inputsData.fromLocation}, To: ${inputsData.toLocation}, Date: ${inputsData.date}`,
          api_status: "S",
        });

        setData(responseData);
        return;
      }

      setError("No tracking info found, try again later.");
      const errorMessage =
        error?.response?.data?.error || error?.message || error;
      await logTrackingSearch({
        menu_id: "Ocean",
        api_request: `From: ${inputsData.fromLocation}, To: ${inputsData.toLocation}, Date: ${inputsData.date}`,
        api_status: "F",
        api_error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.searchForm}>
          <div className={styles.inputContainer}>
            <p className={styles.searchLabel}>From</p>

            <input
              type="text"
              value={inputsData?.fromLocation}
              onChange={(e) =>
                setInputsData({ ...inputsData, fromLocation: e.target.value })
              }
              placeholder="Enter From Location"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.searchLabel}>To</p>

            <input
              type="text"
              value={inputsData?.toLocation}
              onChange={(e) =>
                setInputsData({ ...inputsData, toLocation: e.target.value })
              }
              placeholder="Enter To Location"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.searchLabel}>From</p>
            <DateInput
              data={inputsData}
              setData={setInputsData}
              dataKey="date"
              label="Date"
            />
            {/* </div>
             */}
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

      {error && <div className={styles.errorMessage}>{error}</div>}
      {!data && !loading && !error ? (
        <div className={styles.emptyState}>
          Enter a tracking number to view shipment details
        </div>
      ) : data && !loading && !error ? (
        data?.response_data?.length > 0 ? (
          data.response_data.map((oceanData, index) => (
            <div className={styles.tableContainer} key={index}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles["first-table-header"]}>
                    <th className={styles["header-item"]}>Loading</th>
                    <th className={styles["header-item"]}>Cut Off Date</th>
                    <th className={styles["header-item"]}>Service</th>
                    <th className={styles["header-item"]}>Discharge</th>
                    <th className={styles["header-item"]}>Delivery</th>
                    <th className={styles["header-item"]}>Transit Days</th>
                    <th className={styles["header-item"]}>Dep date</th>
                    <th className={styles["header-item"]}>Arrival Date</th>
                    <th className={styles["header-item"]}>Vessel Voyage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles["table-row"]}>
                    <td className={styles["row-item"]}>
                      {oceanData?.port_of_loading}
                    </td>
                    <td className={styles["row-item"]}>
                      {oceanData?.port_cut_off_date}
                    </td>
                    <td className={styles["row-item"]}>{oceanData?.service}</td>
                    <td className={styles["row-item"]}>
                      {oceanData?.port_of_discharge}
                    </td>
                    <td className={styles["row-item"]}>
                      {oceanData?.place_of_delivery}
                    </td>
                    <td className={styles["row-item"]}>
                      {oceanData?.transit_time}
                    </td>
                    <td className={styles["row-item"]}>
                      {oceanData?.departure_date}
                    </td>
                    <td className={styles["row-item"]}>
                      {oceanData?.arrival_date}
                    </td>
                    <td className={styles["row-item"]}>
                      {oceanData?.vessel_voyage}
                    </td>
                  </tr>
                </tbody>
              </table>

              {oceanData?.routing_details?.length > 0 && (
                <div
                  style={{ width: "92%", margin: "0 auto" }}
                  className={styles.tableContainer}
                >
                  <table className={styles.secondTable}>
                    <thead>
                      <tr className={styles["table-header"]}>
                        <th className={styles["header-item"]}>From</th>
                        <th className={styles["header-item"]}>To</th>
                        <th className={styles["header-item"]}>Dep Date</th>
                        <th className={styles["header-item"]}>Arrival</th>
                        <th className={styles["header-item"]}>Service</th>
                        <th className={styles["header-item"]}>Vessel</th>
                        <th className={styles["header-item"]}>Transit Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {oceanData.routing_details.map((details, subIndex) => (
                        <tr className={styles["table-row"]} key={subIndex}>
                          <td className={styles["row-item"]}>
                            {details?.location_from}
                          </td>
                          <td className={styles["row-item"]}>
                            {details?.location_to}
                          </td>
                          <td className={styles["row-item"]}>
                            {details?.departure_date}
                          </td>
                          <td className={styles["row-item"]}>
                            {details?.arrival_date}
                          </td>
                          <td className={styles["row-item"]}>
                            {details?.service}
                          </td>
                          <td className={styles["row-item"]}>
                            {details?.vessel_voyage}
                          </td>
                          <td className={styles["row-item"]}>
                            {details?.transit_time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        ) : null
      ) : null}
    </div>
  );
};
export default Ocean;
