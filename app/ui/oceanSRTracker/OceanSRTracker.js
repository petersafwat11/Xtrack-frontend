"use client";
import { useState } from "react";
import styles from "./oceanSRTracker.module.css";
import axios from "axios";

 const OceanSRTracker = () => {
  const [searchNumber, setSearchNumber] = useState("");
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatSearchNumber = (value) => {
    // const numbers = value.replace(/[^\d]/g, '');
    
    // if (numbers.length > 3) {
    //   return numbers.slice(0, 3) + '-' + numbers.slice(3);
    // }
    return value;
  };

  const handleSearchChange = (e) => {
    const formattedValue = formatSearchNumber(e.target.value);
    // Limit the total length (including hyphen) to 12 characters
    if (formattedValue.length <= 12) {
      setSearchNumber(formattedValue);
    }
  };

  const generateMetaData = (data) => {
    const metadata = {
      number: data?.metadata?.number || null,
      sealine: data?.metadata?.sealine_name || null,
      updated_at: data?.metadata?.updated_at || null,
      status: data?.metadata?.status || null,
      arrival: data?.route?.pod?.date || null,
      departure: data?.route?.pol?.date || null,
      from: (() => {
        const polLocationId = data?.route?.pol?.location;
        const location = data?.locations?.find((location) => location.id === polLocationId);
        return location ? `${location.name}, ${location.state}, ${location.country}` : null;
      })(),
      to: (() => {
        const podLocationId = data?.route?.pod?.location;
        const location = data?.locations?.find((location) => location.id === podLocationId);
        return location ? `${location.name}, ${location.state}, ${location.country}` : null;
      })(),
    };
    return metadata;
  };

  // Helper functions for location, facility and vessel logic
  const getLocationString = (locationId, data) => {
    const location = data?.locations?.find(loc => loc.id === locationId);
    return location ? `${location.name}, ${location.country}` : '';
  };

  const getFacilityString = (facilityId, data) => {
    const facility = data?.facilities?.find(fac => fac.id === facilityId);
    return facility ? facility.name : '';
  };

  const getVesselInfo = (vesselId, voyageNumber, data) => {
    if (!vesselId) return { vesselVoyage: '', vesselImo: '' };
    
    const vessel = data?.vessels?.find(v => v.id === vesselId);
    console.log("vessel", vessel);
    return {
      vesselVoyage: vessel ? `${vessel.name}, ${voyageNumber || ''}` : '',
      vesselImo: vessel?.imo || ''
    };
  };

  const fetchData = async () => {
    if (!searchNumber.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setMetadata(null);

    try {
      const response = await axios.get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(`http://178.128.210.208:8000/searates/api/tracker/${searchNumber}`)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      );

      // allorigins returns the data in a nested 'contents' property as a string
      const responseData = JSON.parse(response.data.contents);
      console.log("response", response, responseData)
      if (responseData?.message === "WRONG_NUMBER") {
        setError("Wrong Number");
        return;
      }
      if (responseData?.message === "no data received") {
        setError("No Tracking Info Found");
        return;
      }

      setData(responseData?.data);
      setMetadata(generateMetaData(responseData?.data));
    } catch (error) {
      setError("No tracking info found, try again later.");
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
          <p className={styles.searchLabel}>CONTAINER NO</p>

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

      {metadata !== null && !loading && !error && (
        <div className={styles.metadata}>
          <div className={styles.metadataItem}>
            <p className={styles.label}>CONTAINER</p>
            <p className={styles.value}>{metadata?.number}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>SEALINE</p>
            <p className={styles.value}>{metadata?.sealine}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>UPDATED AT</p>
            <p className={styles.value}>{metadata?.updated_at}</p>
          </div>

          <div className={styles.metadataItem}>
            <p className={styles.label}>FROM </p>
            <p className={styles.value}> {metadata?.from}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>TO </p>
            <p className={styles.value}>{metadata?.to}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>STATUS</p>
            <p className={styles.value}>{metadata?.status}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>ETA DEPARTURE</p>
            <p className={styles.value}>{metadata?.departure}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>ETA ARRIVAL</p>
            <p className={styles.value}>{metadata?.arrival}</p>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        {!data && !loading && !error ? (
          <div className={styles.emptyState}>
            Enter a tracking number to view shipment details
          </div>
        ) : data && !loading && !error ? (
          <table className={styles.table}>
            <thead>
              <tr className={styles["table-header"]}>
                <th className={styles["header-item"]}>ID</th>
                <th className={styles["header-item"]}>DATE</th>
                <th className={styles["header-item"]}>LOCATION</th>
                <th className={styles["header-item"]}>FACILITY</th>
                <th className={styles["header-item"]}>EVENT</th>
                <th className={styles["header-item"]}>DESCRIPTION</th>
                <th className={styles["header-item"]}>TYPE</th>
                <th className={styles["header-item"]}>TRANSPORT TYPE</th>
                <th className={styles["header-item"]}>VESSEL VOYAGE</th>
                <th className={styles["header-item"]}>VESSEL IMO
                </th>
              </tr>
            </thead>
            <tbody>
               {data?.containers && data?.containers?.length>0 &&data?.containers[0]?.events?.map((event, index) => (
                <tr className={styles["table-row"]} key={index}>
                  <td className={styles["row-item"]}>{event?.order_id}</td>
                  <td className={styles["row-item"]}>{event?.date}</td>
                  <td className={styles["row-item"]}>{getLocationString(event?.location, data)}</td>
                  <td className={styles["row-item"]}>{getFacilityString(event?.facility, data)}</td>
                  <td className={styles["row-item"]}>{event?.event_type}, {event?.event_code}</td>
                  <td className={styles["row-item"]}>{event?.description}</td>
                  <td className={styles["row-item"]}>{event?.type.toLocaleUpperCase()}</td>
                  <td className={styles["row-item"]}>{event?.transport_type}</td>
                  <td className={styles["row-item"]}>{getVesselInfo(event?.vessel, event?.voyage, data).vesselVoyage}</td>
                  <td className={styles["row-item"]}>{getVesselInfo(event?.vessel, event?.voyage, data).vesselImo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
export default OceanSRTracker