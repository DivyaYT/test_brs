"use client";

import FormInput from "./FormInput";
import FormFields from "./FormFields";
import FormHandler from "./FormHandler";
import FormSubmit from "./FormSubmit";
import FormState from "./FormState";
import FormHeader from "./FormHeader";

export default function Form({ formType, title, forward }) {
  const inputFields = FormFields(formType);
  const { state } = FormState(formType);
  const { formData, handleChange } = FormHandler(state);
  const { handleSubmit } = FormSubmit(formData, forward, formType);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <FormHeader
        title={title}
        onSubmitClick={handleSubmit}
        onBackClick={() => window.history.back()}
      />

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {inputFields.map((field) => (
            <FormInput
              key={field.name}
              {...field}
              value={
                field.type === "file" ? undefined : (formData[field.name] ?? "")
              }
              onChange={handleChange}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-200 px-5 py-2 rounded-lg"
          >
            Back
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
