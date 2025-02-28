"use client";
import { useState } from "react";
import styles from "./marineTrafficTracker.module.css";
import { logTrackingSearch } from "@/app/lib/trackingLogger";
import axios from "axios";

export default function MarineTrafficTracker() {
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
    if (!searchNumber.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {

      const response = await axios.get(`${process.env.BACKEND_SERVER}/api/tracking/${searchNumber}`, {
        params: { externalApiUrl: `http://178.128.210.208:8000/marinetraffic/api/tracker/imo:${searchNumber}` }
    });
      const responseData = response?.data?.data;
      console.log('responseData', responseData)

      if (responseData.error === "Data wasn't received") {
        setError("Wrong Number");
        // Log the error in tracking
        await logTrackingSearch({
          menu_id: 'Marine Traffic',
          api_request: searchNumber,
          api_status: 'F',
          api_error: "Wrong Number, No Tracking Info Found"
        });
        return;
      }
      if (responseData.error === "no data received") {
        setError("No Tracking Info Found");
        // Log the error in tracking
        await logTrackingSearch({
          menu_id: 'Marine Traffic',
          api_request: searchNumber,
          api_status: 'F',
          api_error: "No Tracking Info Found"
        });
        return;
      }
      // Log the tracking request
      await logTrackingSearch({ 
        menu_id: 'Marine Traffic',
        api_request: searchNumber,
        api_status: 'S'
      });

      setData(responseData);
    } catch (error) {
      setError("An error occurred while fetching tracking information. Please try again.");
      console.error("Tracking Error:", error);
      // Log the error in tracking
      await logTrackingSearch({
        menu_id: 'Marine Traffic',
        api_request: searchNumber,
        api_status: 'F',
        api_error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.searchForm}>
          <div className={styles.searchInputContainer}>
          <p className={styles.searchLabel}>VESSEL</p>

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
   {data !== null && !loading && !error&&  
   <>
   <div className={styles.dates}>
    <div className={styles.datesContainer}>
        <div className={styles.datesItem}>
            <p className={styles.label}>From</p>
            <p className={styles.value}>{`${data?.current_voyage?.from?.Port_name}, ${data?.current_voyage?.from?.Port_code}`}</p>
        </div>
        <div className={styles.datesItem}>
            <p className={styles.label}>Date</p>
            <p className={styles.value}>{`${data?.current_voyage?.from?.departure_time}`}</p>
        </div>
        </div>
        <div className={styles.datesContainer}>
        <div className={styles.datesItem}>
            <p className={styles.label}>To</p>
            <p className={styles.value}>{`${data?.current_voyage?.to?.Port_name}, ${data?.current_voyage?.to?.Port_code}`}</p>
        </div>
        <div className={styles.datesItem}>
            <p className={styles.label}>Date</p>
            <p className={styles.value}>{`${data?.current_voyage?.to?.arrival_time}`}</p>
        </div>
        </div>
     </div>
     <div className={styles.summery}>
        <h2 className={styles.summert_title}>SUMMERY</h2>
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
            <p className={styles.vesselValue}>{data?.general.name}</p>

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
