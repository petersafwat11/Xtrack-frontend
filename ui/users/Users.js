"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./users.module.css";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import DeleteConfirmation from "./DeleteConfirmation";
import Table from "../trackersComponents/commen/table/Table";
const Users = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/users", {
        params: {
          page,
          limit,
          search,
        },
      });

      console.log("Response:", response.data);

      if (response.data.status === "success") {
        setUsers(response.data.data);
        setTotalPages(Math.ceil(response.data.results / limit));
      } else {
        setError("Failed to fetch users: Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching Users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
      setUsers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date
      .toLocaleDateString("en-GB", options)
      .replace(",", "")
      .replace(/ /g, "-");
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`);
      fetchUsers(); // Refresh the users list
      setDeleteModal({ isOpen: false, userId: null, userName: "" });
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const openDeleteModal = (e, user) => {
    e.stopPropagation(); // Prevent row click event
    setDeleteModal({
      isOpen: true,
      userId: user.user_id,
      userName: user.user_name,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: "" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button
          onClick={() => {
            router.push("/users/create-user");
          }}
          className={styles.create}
        >
          Create New User
        </button>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.tableContainer}>
          <Table
            smallPadding={true}
            headers={[
              "User ID",
              "User Name",
              "User Email",
              "Active",
              "Valid Till",
              "Company",
              "Country",
              "Action",
            ]}
            data={users.map((user) => ({
              user_id: user.user_id,
              user_name: user.user_name,
              user_email: user.user_email,
              active: user.user_active,
              valid_till: user.valid_till,
              company: user.user_company,
              country: user.user_country,
              action: (
                <button
                  onClick={(e) => openDeleteModal(e, user)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              ),
            }))}
          />
          <div className={styles.pagination}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.userId)}
        userName={deleteModal.userName}
      />
    </div>
  );
};

export default Users;
