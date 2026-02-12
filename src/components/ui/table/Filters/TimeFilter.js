import { useState } from "react";

const TimeFilter = ({ onApply }) => {
  const [time, setTime] = useState("");

  return (
    <div className=" absolute   glassy-text-primary shadow-md border rounded-md p-2">
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <button
        onClick={() => onApply?.(time)}
        className="mt-2 w-full glassy-button   text-xs py-1 rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default TimeFilter;
