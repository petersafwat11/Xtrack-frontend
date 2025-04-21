"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./users.module.css";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import DeleteConfirmation from "./DeleteConfirmation";
import Table from "../trackersComponents/commen/table/Table";
import { toast } from "react-hot-toast";

const Users = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
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

      if (response.data.status === "success") {
        setUsers(response.data.data);
        setTotalPages(Math.ceil(response.data.results / limit));
      } else {
        setError("Failed to fetch users: Invalid response format");
        toast.error("Failed to fetch users: Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching Users:", err);

      // Handle specific backend error messages
      const errorMessage =
        err.response?.data?.message || "Failed to fetch users";
      setError(errorMessage);

      // Show more user-friendly error messages based on error codes
      if (err.response?.status === 400) {
        if (
          err.response?.data?.message?.includes(
            "Page number must be at least 1"
          )
        ) {
          setError("Invalid page number. Page must be at least 1.");
          toast.error("Invalid page number");
        } else {
          toast.error(errorMessage);
        }
      } else if (err.response?.status === 401) {
        setError("You are not authorized to view users. Please log in again.");
        toast.error("Authentication error");
        // Optionally redirect to login
        // router.push("/login");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to access users.");
        toast.error("Access denied");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later or contact support.");
        toast.error("Server error");
      } else {
        toast.error(errorMessage);
      }

      setUsers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, router]);

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
      setDeleteError(null);
      const response = await api.delete(`/api/users/${userId}`);

      if (response.status === 204) {
        toast.success("User deleted successfully");
        fetchUsers(); // Refresh the users list
        setDeleteModal({ isOpen: false, userId: null, userName: "" });
      }
    } catch (err) {
      console.error("Error deleting user:", err);

      // Handle specific backend error messages
      const errorMessage =
        err.response?.data?.message || "Failed to delete user";
      setDeleteError(errorMessage);

      if (err.response?.status === 404) {
        setDeleteError(`User not found. They may have been already deleted.`);
        toast.error("User not found");
      } else if (err.response?.status === 400) {
        if (
          err.response?.data?.message?.includes("referenced by other records")
        ) {
          setDeleteError(
            "Cannot delete user because they have associated records. Remove those first."
          );
          toast.error("User has associated records");
        } else {
          toast.error(errorMessage);
        }
      } else if (err.response?.status === 403) {
        setDeleteError("You don't have permission to delete users.");
        toast.error("Permission denied");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const openDeleteModal = (e, user) => {
    e.stopPropagation(); // Prevent row click event
    setDeleteError(null);
    setDeleteModal({
      isOpen: true,
      userId: user.user_id,
      userName: user.user_name,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: "" });
    setDeleteError(null);
  };

  const handleEditUser = (userId) => {
    router.push(`/users/${userId}`);
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
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchUsers} className={styles.retryButton}>
            Retry
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          {users.length === 0 ? (
            <div className={styles.noUsers}>
              No users found. {search && "Try adjusting your search criteria."}
            </div>
          ) : (
            <>
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
                  valid_till: user.valid_till
                    ? formatDate(user.valid_till)
                    : "N/A",
                  company: user.user_company || "N/A",
                  country: user.user_country || "N/A",
                  action: (
                    <div className={styles.actionButtons}>
                      <button
                        onClick={(e) => openDeleteModal(e, user)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  ),
                }))}
                onRowClick={(row) => handleEditUser(row.user_id)}
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
            </>
          )}
        </div>
      )}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.userId)}
        userName={deleteModal.userName}
        error={deleteError}
      />
    </div>
  );
};

export default Users;
