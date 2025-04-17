"use client";

import axios from "axios";
import { logTrackingSearch } from "./trackingLogger";

/**
 * Universal tracking data fetcher for all tracker components
 *
 * @param {Object} options - Configuration options for the tracker
 * @param {string} options.searchQuery - The search query (tracking number, vessel ID, etc.)
 * @param {string} options.menuId - The menu ID for logging (e.g., 'Air Cargo', 'Ocean', 'Vessel Tracker')
 * @param {string} options.apiLink - The external API base URL
 * @param {Function} options.formatApiUrl - Function to format the API URL (receives searchQuery and apiLink)
 * @param {Function} options.processResponseData - Function to process the response data
 * @param {Function} options.generateMetadata - Optional function to generate metadata from response data
 * @param {Object} options.setState - Object containing state setter functions
 * @param {Function} options.setState.setLoading - Function to set loading state
 * @param {Function} options.setState.setError - Function to set error state
 * @param {Function} options.setState.setData - Function to set data state
 * @param {Function} options.setState.setMetadata - Optional function to set metadata state
 * @param {Object} options.errorMessages - Custom error messages
 * @param {string} options.errorMessages.wrongNumber - Message for wrong number errors
 * @param {string} options.errorMessages.noData - Message for no data errors
 * @param {string} options.errorMessages.genericError - Generic error message
 * @returns {Promise<void>}
 */
export const fetchTrackerData = async (options) => {
  const {
    searchQuery,
    menuId,
    apiLink,
    formatApiUrl = (query, link) => `${link}${query}`,
    processResponseData = (response) => response?.data?.data,
    generateMetadata,
    setState,
    errorMessages = {
      wrongNumber: "Wrong Number, please check your input",
      noData: "No Tracking Info Found, please try again later",
      genericError: "No Tracking Info Found. Please try again.",
    },
  } = options;

  // Validate required parameters
  if (!searchQuery?.trim()) return;
  if (!setState?.setLoading || !setState?.setError || !setState?.setData) {
    console.error("Required state setters are missing");
    return;
  }

  // Set initial states
  setState.setLoading(true);
  setState.setError(null);
  setState.setData(null);
  if (setState.setMetadata) setState.setMetadata(null);

  try {
    // Format the external API URL
    const externalApiUrl = formatApiUrl(searchQuery, apiLink);

    // Make the API request
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/tracking/${searchQuery}`,
      { params: { externalApiUrl } }
    );
    // Process the response data
    const responseData = processResponseData(response);
    if (
      responseData?.status_code === "no data received" ||
      responseData?.status === "error" ||
      responseData?.success === false ||
      responseData?.error === "no data received" ||
      responseData?.error === "Data wasn't received" ||
      responseData?.data?.results?.length === 0 ||
      responseData?.error === "Data not found" ||
      responseData?.error ===
        "We couldn't find any data available on public track for this container"
    ) {
      setState.setError(errorMessages.noData);
      await logTrackingSearch({
        menu_id: menuId,
        api_request: searchQuery,
        api_status: "F",
        api_error: errorMessages.noData,
      });
      return;
    }

    // Log successful tracking
    await logTrackingSearch({
      menu_id: menuId,
      api_request: searchQuery,
      api_status: "S",
    });

    // Set the data in state
    setState.setData(responseData);

    // Generate and set metadata if applicable
    if (generateMetadata && setState.setMetadata) {
      const metadata = generateMetadata(responseData);
      setState.setMetadata(metadata);
    }
  } catch (error) {
    // Handle errors
    setState.setError(errorMessages.genericError);
    console.error(`${menuId} Tracking Error:`, error);

    // Log the error
    await logTrackingSearch({
      menu_id: menuId,
      api_request: searchQuery,
      api_status: "F",
      api_error: error.message || errorMessages.genericError,
    });
  } finally {
    setState.setLoading(false);
  }
};

/**
 * Format date for Ocean tracker
 * @param {Date} date - Date object to format
 * @returns {string} - Formatted date string (YYYY/MM/DD)
 */
export const formatDate = (date) => {
  if (!date) return "";
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(date.getDate()).padStart(2, "0")}`;
};

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted date and time string
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const datePart = date.toISOString().split("T")[0];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${datePart}, ${hours}:${minutes}`;
};

/**
 * Fetch ocean shipping data
 * @param {Object} options - Configuration options for fetching ocean data
 * @param {Object} options.inputsData - Input data for the API request (fromLocation, toLocation, date)
 * @param {string} options.apiLink - External API base URL
 * @param {Function} options.setLoading - Function to set loading state
 * @param {Function} options.setError - Function to set error state
 * @param {Function} options.setData - Function to set data state
 * @returns {Promise<void>}
 */
export const fetchOceanData = async ({
  inputsData,
  apiLink,
  setLoading,
  setError,
  setData,
}) => {
  if (
    !inputsData.fromLocation.trim() ||
    !inputsData.toLocation.trim() ||
    !inputsData.date
  )
    return;

  setLoading(true);
  setError(null);
  setData(null);

  const date = formatDate(inputsData.date);
  const apiRequest = `From: ${inputsData.fromLocation}, To: ${inputsData.toLocation}, Date: ${inputsData.date}`;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/tracking/s`,
      {
        params: {
          externalApiUrl: `${apiLink}from/${inputsData.fromLocation.toLocaleUpperCase()}/to/${inputsData.toLocation.toLocaleUpperCase()}/date/${date}`,
        },
      }
    );

    const responseData = response?.data?.data;

    if (
      responseData?.error === "Data not found" ||
      responseData?.error === "no data received"
    ) {
      setError("No Tracking Info Found");
      await logTrackingSearch({
        menu_id: "Ocean",
        api_request: apiRequest,
        api_status: "F",
        api_error: "No Tracking Info Found",
      });
      return;
    }

    await logTrackingSearch({
      menu_id: "Ocean",
      api_request: apiRequest,
      api_status: "S",
    });

    setData(responseData);
  } catch (error) {
    if (error.response?.data?.details?.response_status === "success") {
      const responseData = error.response.data.details;

      if (responseData?.response_data.length === 0) {
        setError("No Tracking Info Found");
        await logTrackingSearch({
          menu_id: "Ocean",
          api_request: apiRequest,
          api_status: "F",
          api_error: "No Tracking Info Found",
        });
        return;
      }

      await logTrackingSearch({
        menu_id: "Ocean",
        api_request: apiRequest,
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
      api_request: apiRequest,
      api_status: "F",
      api_error: errorMessage,
    });
  } finally {
    setLoading(false);
  }
};
