import React from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const DateInput = ({ data, setData, dataKey, label, required, noLabel }) => {
  return (
    <DatePicker
      onChange={(date) => setData({ ...data, [dataKey]: date })}
      format="dd-MM-yyyy"
      dayPlaceholder="dd"
      monthPlaceholder="mm"
      yearPlaceholder="yyyy"
      value={data[dataKey]}
    />
  );
};

export default DateInput;
