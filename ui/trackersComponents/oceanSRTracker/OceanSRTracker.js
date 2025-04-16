"use client";
import { useState } from "react";
import styles from "../cargoTracker/CargoTracker.module.css";
import { fetchTrackerData } from "@/lib/trackerService";
import SearchContainer from "../commen/search/SearchContainer";
import MetaData from "../commen/metaData/MetaData";
import Table from "../commen/table/Table";
const OceanSRTracker = ({ APILink }) => {
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

  const generateMetaData = (data) => {
    const metadata = [
      { label: "Container", value: data?.metadata?.number || null },
      { label: "Sealine", value: data?.metadata?.sealine_name || null },
      { label: "Updated At", value: data?.metadata?.updated_at || null },
      {
        label: "From",
        value: (() => {
          const polLocationId = data?.route?.pol?.location;
          const location = data?.locations?.find(
            (location) => location.id === polLocationId
          );
          return location
            ? `${location.name}, ${location.state}, ${location.country}`
            : null;
        })(),
      },
      {
        label: "To",
        value: (() => {
          const podLocationId = data?.route?.pod?.location;
          const location = data?.locations?.find(
            (location) => location.id === podLocationId
          );
          return location
            ? `${location.name}, ${location.state}, ${location.country}`
            : null;
        })(),
      },

      { label: "Status", value: data?.metadata?.status || null },
      { label: "ETA DEPARTURE", value: data?.route?.pol?.date || null },
      { label: "ETA ARRIVAL", value: data?.route?.pod?.date || null },
    ];
    return metadata;
  };

  // Helper functions for location, facility and vessel logic
  const getLocationString = (locationId, data) => {
    const location = data?.locations?.find((loc) => loc.id === locationId);
    return location ? `${location.name}, ${location.country}` : "";
  };

  const getFacilityString = (facilityId, data) => {
    const facility = data?.facilities?.find((fac) => fac.id === facilityId);
    return facility ? facility.name : "";
  };

  const getVesselInfo = (vesselId, voyageNumber, data) => {
    if (!vesselId) return { vesselVoyage: "", vesselImo: "" };

    const vessel = data?.vessels?.find((v) => v.id === vesselId);
    return {
      vesselVoyage: vessel ? `${vessel.name}, ${voyageNumber || ""}` : "",
      vesselImo: vessel?.imo || "",
    };
  };

  const fetchData = async () => {
    await fetchTrackerData({
      searchQuery: searchNumber.trim(),
      menuId: "Ocean SR",
      apiLink: APILink,
      processResponseData: (response) => response?.data?.data,
      generateMetadata: (responseData) => generateMetaData(responseData?.data),
      setState: {
        setLoading,
        setError,
        setData: (responseData) => setData(responseData?.data),
        setMetadata,
      },
      errorMessages: {
        wrongNumber: "Wrong Number",
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
            headers={[
              "ID",
              "DATE",
              "LOCATION",
              "FACILITY",
              "EVENT",
              "DESCRIPTION",
              "TYPE",
              "TRANSPORT TYPE",
              "VESSEL VOYAGE",
              "VESSEL IMO",
            ]}
            data={
              data?.containers?.length > 0 &&
              data?.containers[0]?.events?.map((event, index) => ({
                id: event?.order_id,
                date: event?.date,
                location: getLocationString(event?.location, data),
                facility: getFacilityString(event?.facility, data),
                event: event?.event_type + " " + event?.event_code,
                description: event?.description,
                type: event?.type,
                transportType: event?.transport_type,
                vesselVoyage: getVesselInfo(event?.vessel, event?.voyage, data)
                  .vesselVoyage,
                vesselImo: getVesselInfo(event?.vessel, event?.voyage, data)
                  .vesselImo,
              }))
            }
          />
        ) : null}
      </div>
    </div>
  );
};
export default OceanSRTracker;
