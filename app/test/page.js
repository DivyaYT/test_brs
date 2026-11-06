"use client";

import useFormState from "../hooks/useFormState";
import FormFields from "../hooks/FormFields";

export default function TestPage() {
  const fields = FormFields("organization");
  const { formData, handleChange } = useFormState(fields);

  return (
    <div style={{ padding: 24 }}>
      <h1>Test Page</h1>

      <form>
        {fields.map((field) => (
          <div key={field.name} style={{ marginBottom: 16 }}>
            <label htmlFor={field.name} style={{ display: "block", marginBottom: 6 }}>
              {field.label}
            </label>

            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] ?? ""}
                onChange={(event) => handleChange(field.name, event.target.value)}
                style={{ width: "100%", maxWidth: 320, minHeight: 80, padding: 8 }}
              />
            ) : field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] ?? ""}
                onChange={(event) => handleChange(field.name, event.target.value)}
                style={{ width: "100%", maxWidth: 320, padding: 8 }}
              >
                <option value="">Select</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                value={formData[field.name] ?? ""}
                onChange={(event) => handleChange(field.name, event.target.value)}
                style={{ width: "100%", maxWidth: 320, padding: 8 }}
              />
            )}
          </div>
        ))}
      </form>
    </div>
  );
}
