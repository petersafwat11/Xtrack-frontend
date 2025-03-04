"use client";
import { useState } from "react";
import styles from "../cargoTracker/CargoTracker.module.css";
import { fetchTrackerData } from "@/app/lib/trackerService";
import axios from "axios";

const OceanAFTracker = ({APILink}) => {
  const generateMetaData = (data) => {
    const metadata = {
      type: data?.metadata?.type || null,
      number: data?.metadata?.number || null,
      sealine: data?.metadata?.sealine || null,
      sealine_name: data?.metadata?.sealine_name || null,
      updated_at: data?.metadata?.updated_at || null,
      status: data?.metadata?.status || null,
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

  const [searchNumber, setSearchNumber] = useState("");
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatSearchNumber = (value) => {
    return value;
  };

  const handleSearchChange = (e) => {
    const formattedValue = formatSearchNumber(e.target.value);
    // Limit the total length (including hyphen) to 12 characters
    if (formattedValue.length <= 20) {
      setSearchNumber(formattedValue);
    }
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
    return {
      vesselVoyage: vessel ? `${vessel.name}, ${voyageNumber || ''}` : '',
      vesselImo: vessel?.imo || ''
    };
  };

  const fetchData = async () => {
    await fetchTrackerData({
      searchQuery: searchNumber,
      menuId: 'Ocean AF',
      apiLink: APILink,
      processResponseData: (response) => response?.data?.data?.containerPosition,
      generateMetadata: (responseData) => generateMetaData(responseData.data),
      setState: {
        setLoading,
        setError,
        setData: (responseData) => setData(responseData?.data),
        setMetadata
      },
      errorMessages: {
        wrongNumber: "Wrong Number",
        noData: "No Tracking Info Found",
        genericError: "An error occurred while fetching the data"
      }
    });
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
            <p className={styles.label}>TYPE</p>
            <p className={styles.value}>{metadata?.type}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>CONTAINER</p>
            <p className={styles.value}>{metadata?.number}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>SEALINE </p>
            <p className={styles.value}>{metadata?.sealine}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>SEALINE NAME</p>
            <p className={styles.value}>{metadata?.sealine_name}</p>
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
          {/* <div className={styles.metadataItem}>
            <p className={styles.label}>ETA DEPARTURE</p>
            <p className={styles.value}>{metadata?.departure}</p>
          </div>
          <div className={styles.metadataItem}>
            <p className={styles.label}>ETA ARRIVAL</p>
            <p className={styles.value}>{metadata?.arrival}</p>
          </div> */}
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
                {/* <th className={styles["header-item"]}>STATUS</th>
                <th className={styles["header-item"]}>ACTUAL</th>
                <th className={styles["header-item"]}>IS ADDITIONAL EVENT</th> */}
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
                  {/* <td className={styles["row-item"]}>{event?.status}</td>
                  <td className={styles["row-item"]}>{event?.actual}</td>
                  <td className={styles["row-item"]}>{event?.is_additional_event}</td> */}
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
};

export default OceanAFTracker;