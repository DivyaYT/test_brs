// "use client";

// export default function useFormSubmit(form) {
//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();

//     try {
//       console.log("🚀 SUBMIT DATA:", form);

//       // 🔥 API CALL HERE
//       // await fetch("/api/submit", { method: "POST", body: JSON.stringify(form) });

//       alert("Form submitted successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Error submitting form");
//     }
//   };

//   return { handleSubmit };
// }

export default function useFormSubmit(form) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/org", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Insert failed");
      }

      console.log("Saved successfully:", data);
      alert("Organization saved successfully!");
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Error saving data");
    }
  };

  return { handleSubmit };
}
