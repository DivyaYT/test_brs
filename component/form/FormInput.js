"use client";

export default function FormInput({
  label,
  name,
  type,
  value,
  onChange,
  options = [],
  placeholder = "",
  validation = {}, // Added validation prop
  error = "",      // Added error prop to show messages
}) {
  const base = `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
    error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
  }`;

  const handleChange = (e) => {
    let val;
    if (type === "file") {
      val = e.target.files[0];
    } else {
      val = e.target.value;
    }
    onChange(name, val);
  };

  if (type === "hidden") {
    return <input type="hidden" name={name} value={value || ""} />;
  }

  return (
    <div className="flex flex-col space-y-1 w-full">
      <label className="text-sm font-semibold text-gray-700">
        {label}
        {validation?.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* RENDER LOGIC */}
      {["text", "number", "date", "email", "file"].includes(type) && (
        <input
          type={type}
          value={type === "file" ? undefined : value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          className={base}
          // Native browser validation hooks
          required={!!validation?.required} 
        />
      )}

      {type === "select" && (
        <select value={value || ""} onChange={handleChange} className={base}>
          <option value="">-- Select --</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {type === "textarea" && (
        <textarea
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${base} h-28 resize-none`}
        />
      )}

      {/* ERROR MESSAGE */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}