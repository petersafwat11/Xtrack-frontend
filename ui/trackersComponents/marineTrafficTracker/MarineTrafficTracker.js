"use client";
import { useState } from "react";
import styles from "./marineTrafficTracker.module.css";
import { fetchTrackerData } from "@/lib/trackerService";
import SearchContainer from "../commen/search/SearchContainer";
import DatesItems from "./datesItem/DatesItems";
import InfoContainer from "./infoContainer/InfoContainer";

export default function MarineTrafficTracker({ APILink }) {
  const [searchNumber, setSearchNumber] = useState("");
  const [data, setData] = useState(null);
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
      menuId: "Marine Traffic",
      apiLink: APILink,
      processResponseData: (response) => response?.data?.data,
      setState: {
        setLoading,
        setError,
        setData,
      },
      errorMessages: {
        wrongNumber: "Wrong Number",
        noData: "No Tracking Info Found, please try again later",
        genericError: "No Tracking Info Found. Please try again.",
      },
    });
  };
  const getPortData = (data) => {
    return { name: data?.port_name, code: data?.port_code };
  };
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
        <div className={styles.loading_container}>
          <div className={styles.loading_spinner} />
          <p className={styles.loading_text}>
            Fetching tracking information...
          </p>
        </div>
      )}

      {error && <div className={styles.error_message}>{error}</div>}
      {data !== null && !loading && !error && (
        <>
          <div className={styles.dates}>
            <DatesItems
              data={{
                From:
                  getPortData(data?.current_voyage?.from)?.name +
                  "," +
                  getPortData(data?.current_voyage?.from)?.code,
                Date: data?.current_voyage?.from?.departure_time,
              }}
            />

            <DatesItems
              data={{
                To:
                  getPortData(data?.current_voyage?.to)?.name +
                  "," +
                  getPortData(data?.current_voyage?.to)?.code,
                Date: data?.current_voyage?.to?.arrival_time,
              }}
            />
          </div>
          <div className={styles.summery}>
            <h2 className={styles.summert_title}>SUMMARY</h2>
            <div className={styles.summert_content}>
              <p className={styles.content_item}>
                {data?.summary?.ship_location}
              </p>
              <p className={styles.content_item}>{data?.summary?.ship_kind}</p>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.vessel_info}>
              <h3 className={styles.info_title}>Other Info</h3>
              <InfoContainer
                data={{
                  Name: data?.general?.name,
                  Country: data?.general?.country,
                  IMO: data?.general?.imo,
                  MMSI: data?.general?.mmsi,
                  Call_Sign: data?.general?.call_sign,
                  Transponder: data?.general?.transponder_class,
                  Type:
                    data?.general?.general_vessel_type +
                    "," +
                    data?.general?.detailed_vessel_type,
                }}
              />
            </div>
            <div className={styles.other_info}>
              <h3 className={styles.info_title}>Other Info</h3>
              <InfoContainer
                data={{
                  Status: data?.latest_ais_information?.navigational_status,
                  Local_Time: data?.latest_ais_information?.vessel_local_time,
                  Speed: data?.latest_ais_information?.speed,
                  Course: data?.latest_ais_information?.course,
                  Heading: data?.latest_ais_information?.true_heading,
                  Rate_Of_Turn: data?.latest_ais_information?.rate_of_turn,
                  Draught: data?.latest_ais_information?.draught,
                  Destination:
                    data?.latest_ais_information?.reported_destination +
                    "," +
                    data?.latest_ais_information?.matched_destination,
                  ETA: data?.latest_ais_information?.estimated_time_of_arrival,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
