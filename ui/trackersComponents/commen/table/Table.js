import React from "react";
import styles from "./table.module.css";
const Table = ({
  headers,
  data,
  smallPadding,
  headerBackgorund,
  onRowClick,
}) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr
          style={{ backgroundColor: headerBackgorund }}
          className={styles.table_header}
        >
          {headers.map((header, index) =>
            typeof header === "string" ? (
              <th
                style={{ padding: smallPadding ? "0.75rem" : "" }}
                className={styles.header_item}
                key={index}
              >
                {header}
              </th>
            ) : (
              header
            )
          )}
        </tr>
      </thead>
      <tbody>
        {data?.map((item, index) => (
          <tr
            onClick={() => {
              console.log("row clicked", item);
              onRowClick && onRowClick(item);
            }}
            className={styles.table_row}
            key={index}
          >
            {Object.keys(item).map((key, index) => (
              <td
                style={{ padding: smallPadding ? "0.85rem" : "" }}
                className={styles.row_item}
                key={index}
              >
                {item[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
