import { useState } from "react";

const DropdownFilter = ({ options = [], multi = false, onApply }) => {
  const [selected, setSelected] = useState(multi ? [] : "");

  const toggle = (val) => {
    if (!multi) {
      setSelected(val);
    } else {
      setSelected((prev) =>
        prev.includes(val)
          ? prev.filter((v) => v !== val)
          : [...prev, val]
      );
    }
  };

  const isSelected = (val) =>
    multi ? selected.includes(val) : selected === val;

  return (
    <div className="absolute glassy-text-primary shadow-md  rounded-md p-2 min-w-[180px]">
      {options.map((opt) => (
        <div
          key={opt}
          onClick={() => toggle(opt)}
          className={`
            flex items-center gap-2 cursor-pointer p-1 rounded
             
            ${isSelected(opt) ? "glassy-card glassy-text-primary font-medium" : ""}
          `}
        >
          {multi && (
            <input
              type="checkbox "
              checked={selected.includes(opt)}
              readOnly
              className="glassy-input"
            />
          )}
          <span className="text-sm">{opt}</span>
        </div>
      ))}

      <button
        onClick={() => onApply?.(selected)}
        className="mt-2 w-full  text-xs py-1 rounded   glassy-button"
      >
        Apply
      </button>
    </div>
  );
};

export default DropdownFilter;
