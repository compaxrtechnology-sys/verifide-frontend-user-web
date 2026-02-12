import { useState } from "react";

const DateRangeFilter = ({ onApply }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className=" absolute shadow-md border rounded-md p-2">
      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      <button
        onClick={() => onApply?.({ from, to })}
        className="mt-2 w-full bg-blue-600 text-white text-xs py-1 rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default DateRangeFilter;
