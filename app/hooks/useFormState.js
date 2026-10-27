// "use client";
// import { useState } from "react";

// export default function useFormState(initialValues) {
//   const [form, setForm] = useState(initialValues);
//   const [touched, setTouched] = useState({});

//   const handleChange = (name, value) => {
//     setForm((prev) => ({ ...prev, [name]: value }));
//     setTouched((prev) => ({ ...prev, [name]: true }));
//   };

//   return {
//     form,
//     touched,
//     handleChange,
//     setForm,
//   };
// }
"use client";
import { useState } from "react";

export default function useFormState(fields) {
  const initialState = Object.fromEntries(fields.map((f) => [f.name, ""]));

  const [formData, setFormData] = useState(initialState);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return { formData, handleChange };
}
