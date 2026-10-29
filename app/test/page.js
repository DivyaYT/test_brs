"use client";

import FormFields from "../hooks/FormFields";
import useFormState from "../hooks/useFormState";

export default function TestPage() {
  const fields = FormFields("customer");
  const { formData, handleChange } = useFormState(fields);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-semibold">Test Page</h1>

      <div className="grid gap-4 max-w-md">
        {fields.map((field) => (
          <label key={field.name} className="flex flex-col gap-1">
            <span>{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="border rounded-md p-2"
            />
          </label>
        ))}
      </div>

      <pre className="mt-6 rounded bg-gray-100 p-4">
        {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
  );
}
