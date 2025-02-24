"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./users.module.css";
import api from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import DeleteConfirmation from "./DeleteConfirmation";

const Users = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: "" });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/users', {
        params: {
          page,
          limit,
          search,
        }
      });

      console.log('Response:', response.data);

      if (response.data.status === 'success') {
        setUsers(response.data.data);
        setTotalPages(Math.ceil(response.data.results / limit));
      } else {
        setError('Failed to fetch users: Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching Users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
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
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(',', '').replace(/ /g, "-");
  }

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`);
      fetchUsers(); // Refresh the users list
      setDeleteModal({ isOpen: false, userId: null, userName: "" });
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const openDeleteModal = (e, user) => {
    e.stopPropagation(); // Prevent row click event
    setDeleteModal({ 
      isOpen: true, 
      userId: user.user_id,
      userName: user.user_name 
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: "" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button onClick={()=>{router.push('/users/create-user')}} className={styles.create}>
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
          <table className={styles.table}>
            <thead>
              <tr className={styles["table-header"]}>
                <th className={styles["header-item"]}>User ID</th>
                <th className={styles["header-item"]}>User Name</th>
                <th className={styles["header-item"]}>User Email</th>
                <th className={styles["header-item"]}>Active</th>
                <th className={styles["header-item"]}>Valid Till</th>
                <th className={styles["header-item"]}>Company</th>
                <th className={styles["header-item"]}>Country</th>
                <th className={styles["header-item"]}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (              
                <tr onClick={() => {router.push(`/users/${user.user_id}`)}} className={styles["table-row"]} key={user.user_id}>
                  <td className={styles["row-item"]}>{user.user_id}</td>
                  <td className={styles["row-item"]}>{user.user_name}</td>
                  <td className={styles["row-item"]}>{user.user_email}</td>
                  <td className={styles["row-item"]}>{user.is_active ? "Yes" : "No"}</td>
                  <td className={styles["row-item"]}>{formatDate(user.valid_till)}</td>
                  <td className={styles["row-item"]}>{user.user_company}</td>
                  <td className={styles["row-item"]}>{user.user_country}</td>
                  <td className={styles["row-item"]}>
                    <button 
                      onClick={(e) => openDeleteModal(e, user)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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