"use client";
import { useState } from "react";
import styles from "./marineTrafficTracker.module.css";
import { fetchTrackerData } from "@/lib/trackerService";
import axios from "axios";
import SearchContainer from "../commen/search/SearchContainer";

export default function MarineTrafficTracker({APILink}) {
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
      menuId: 'Marine Traffic',
      apiLink: APILink,
      processResponseData: (response) => response?.data?.data,
      setState: {
        setLoading,
        setError,
        setData
      },
      errorMessages: {
        wrongNumber: "Wrong Number",
        noData: "No Tracking Info Found, please try again later",
        genericError: "No Tracking Info Found. Please try again."
      }
    });
  };
const getPortData = (data) => {
 return {name:data?.port_name, code:data?.port_code} 
}
  return (
    <div className={styles.container}>
      {/* <div className={styles.searchSection}>
        <div className={styles.searchForm}>
          <div className={styles.searchInputContainer}>
          <p className={styles.searchLabel}>VESSEL IMO</p>

          <input
            type="text"
            value={searchNumber}
            onChange={handleSearchChange}
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
 */}
      <SearchContainer label={"Vessel IMO"} loading={loading} fetchData={fetchData} searchNumber={searchNumber} handleSearchChange={handleSearchChange}/>

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
   {data !== null && !loading && !error&&  
   <>
   <div className={styles.dates}>
    <div className={styles.datesContainer}>
        <div className={styles.datesItem}>
            <p className={styles.label}>From</p>
            <p  className={styles.value}>{`${getPortData(data?.current_voyage?.from)?.name}, ${getPortData(data?.current_voyage?.from)?.code}`}</p>
        </div>
        <div className={styles.datesItem}>
            <p className={styles.label}>Date</p>
            <p className={styles.value}>{`${data?.current_voyage?.from?.departure_time}`}</p>
        </div>
        </div>
        <div className={styles.datesContainer}>
        <div className={styles.datesItem}>
            <p className={styles.label}>To</p>
            <p className={styles.value}>{`${getPortData(data?.current_voyage?.to)?.name}, ${getPortData(data?.current_voyage?.to)?.code}`}</p>
        </div>
        <div className={styles.datesItem}>
            <p className={styles.label}>Date</p>
            <p className={styles.value}>{`${data?.current_voyage?.to?.arrival_time}`}</p>
        </div>
        </div>
     </div>
     <div className={styles.summery}>
        <h2 className={styles.summert_title}>SUMMARY</h2>
        <div className={styles.summert_content}>
        <p className={styles.content_item}>{data?.summary?.ship_location}</p>
        <p className={styles.content_item}>{data?.summary?.ship_kind}</p>
        </div>
     </div>
     <div className={styles.info}>
        <div className={styles.vesselInfo}>

        <h3 className={styles.infoTitle}>Other Info</h3>
            <div className={styles.vesselInfoContent}>

            <div className={styles.vesselItem}>
            
            <p className={styles.vesselLabel}>Name</p>
            <p className={styles.vesselValue}>{data?.general?.name}</p>

            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Country</p>
            <p className={styles.vesselValue}>{data?.general?.country}</p>

            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>IMO</p>
            <p className={styles.vesselValue}>{data?.general?.imo}</p>

            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>MMSI</p>
            <p className={styles.vesselValue}>{data?.general?.mmsi}</p>

            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Call Sign</p> 
            <p className={styles.vesselValue}>{data?.general?.call_sign}</p>

            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Transponder</p>
            <p className={styles.vesselValue}>{data?.general?.transponder_class}</p>

            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Type</p>
            <p className={styles.vesselValue}>{data?.general?.general_vessel_type}, {data?.general?.detailed_vessel_type}</p>
            </div>
            </div>
        </div>
        <div className={styles.otherInfo}>
            <h3 className={styles.infoTitle}>Other Info</h3>
            <div className={styles.otherInfoContent}>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Status</p>
            <p className={styles.vesselValue}>{data?.latest_ais_information?.navigational_status}</p>
            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Local Time</p>
            <p className={styles.vesselValue}>{data?.latest_ais_information?.vessel_local_time}</p>
            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Speed</p>
            <p className={styles.vesselValue}>{data?.latest_ais_information?.speed}</p>
            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Course</p>
            <p className={styles.vesselValue}>{data?.latest_ais_information?.course}</p>
            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Heading</p>
            <p className={styles.vesselValue}>{data?.latest_ais_information?.true_heading}</p>
            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Rate Of Turn</p>
            <p className={styles.vesselValue}>{data?.latest_ais_information?.rate_of_turn}</p>
            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Draught</p>
            <p className={styles.vesselValue}>{data?.latest_ais_information?.draught}</p>
            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>Destination</p>
            <p className={styles.vesselValue}>{data?.latest_ais_information?.reported_destination}, {data?.latest_ais_information?.matched_destination}</p>
            </div>
            <div className={styles.vesselItem}>
            <p className={styles.vesselLabel}>ETA</p>
            <p className={styles.vesselValue}>{data?.latest_ais_information?.estimated_time_of_arrival}</p>
            </div>

            </div>
        </div>
     </div>
     </>

     }
    </div>
  );
}
