"use client";
import React, { useState, useEffect } from "react";
import styles from "./APIEndPoint.module.css";
import axios from "axios";

const APIEndPoint = () => {
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEndpoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/endpoints`
      );
      console.log("Response data:", response.data);
      if (response.data && response.data.data) {
        setData(response.data.data);
        const initialEditingData = {};
        response.data.data.forEach((record, index) => {
          initialEditingData[index] = {
            menu_id: record.menu_id,
            endpoint: record.endpoint,
          };
        });
        setEditingData(initialEditingData);
      } else {
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.log("error", error);
      setError("Failed to fetch endpoints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const handleAdd = () => {
    const newEndpoint = {
      menu_id: "",
      endpoint: "",
      update_date: new Date().toISOString(),
      isNew: true,
    };
    setData((prevData) => [newEndpoint, ...prevData]);
    setEditingData((prev) => ({
      ...prev,
      [0]: { menu_id: "", endpoint: "" },
    }));
  };

  const handleInputChange = (index, field, value) => {
    setEditingData((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const handleSave = async (record, index) => {
    try {
      setLoading(true);
      setError(null);
      const updatedData = {
        menu_id: editingData[index].menu_id,
        endpoint: editingData[index].endpoint,
      };

      if (record.isNew) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/endpoints`,
          updatedData
        );
        if (!response.data || response.data.status !== "success") {
          throw new Error("Failed to create endpoint");
        }
      } else {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/endpoints/update`,
          {
            old_menu_id: record.menu_id,
            old_endpoint: record.endpoint,
            ...updatedData,
          }
        );
        if (!response.data || response.data.status !== "success") {
          throw new Error("Failed to update endpoint");
        }
      }
      fetchEndpoints();
    } catch (error) {
      console.log("error", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.addButton} onClick={handleAdd}>
          Add Endpoint
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Menu ID</th>
              <th>Endpoint</th>
              <th>Update Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((record, index) => (
                <tr
                  key={
                    record.isNew
                      ? `new-${index}`
                      : `${record.menu_id}-${record.endpoint}`
                  }
                >
                  <td>
                    <input
                      type="text"
                      className={styles.input}
                      value={editingData[index]?.menu_id || ""}
                      onChange={(e) =>
                        handleInputChange(index, "menu_id", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className={styles.input}
                      value={editingData[index]?.endpoint || ""}
                      onChange={(e) =>
                        handleInputChange(index, "endpoint", e.target.value)
                      }
                    />
                  </td>
                  <td>{new Date(record.update_date).toLocaleString()}</td>
                  <td>
                    <button
                      className={styles.saveButton}
                      onClick={() => handleSave(record, index)}
                      disabled={loading}
                    >
                      {record.isNew ? "Save" : "Update"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && <div className={styles.loading}>Loading...</div>}
      </div>
    </div>
  );
};

export default APIEndPoint;
