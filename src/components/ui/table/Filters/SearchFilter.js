import { FiSearch } from "react-icons/fi";
import { useState } from "react";

const SearchFilter = ({ onApply }) => {
  const [value, setValue] = useState("");

  return (
    <div className=" absolute  bg-white shadow-md border rounded-md p-2 w-56">
      <div className="flex items-center gap-2">
        <FiSearch size={16} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search..."
          className="w-full outline-none"
        />
      </div>
      <button
        onClick={() => onApply?.(value)}
        className="mt-2 w-full bg-blue-600 text-white text-xs py-1 rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default SearchFilter;
