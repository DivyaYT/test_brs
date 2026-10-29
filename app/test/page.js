"use client";
import { useState } from "react";
import useFormState from "../../component/useFormState";
import FormFields from "../../component/FormFields";
import useFormHandler from "../../component/useFormHandler";
export default function test() {
  //   const { state: checked, setState: setChecked } = useFormState("docMaster");
  //   console.log("checked:", checked);
  //   const { state: checked, setState: setChecked } = useFormState("docMaster");
  console.log("FormFields:", FormFields);

  const [doc, setDoc] = useState({
    docId: null,
    docType: null,
    docPrefix: null,
    currentVal: null,
    userId: null,
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null,
    organizationId: null,
  });
  const { formData, handleChange, setFormData, resetForm } =
    useFormHandler(doc);

  //   const handleChange = (name, value) => {
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //   };
  return (
    <div>
      <h1>Test Page</h1>
      <label>Document ID</label>
      <input
        type="text"
        name="docId"
        value={doc.docId}
        onChange={handleChange}
      />

      <label>Document Type</label>
      <input
        type="text"
        name="docType"
        value={doc.docType}
        onChange={handleChange}
      />

      <label>Document Prefix</label>
      <input
        type="text"
        name="docPrefix"
        value={doc.docPrefix}
        onChange={handleChange}
      />
      <p>Current Form Data: {doc.docPrefix}</p>
    </div>
  );
}

// "use client";

// import FormFields from "../../component/FormFields";
// import useFormState from "../../component/useFormState";
// import ReusableForm from "../../component/ReusableForm";

// export default function CustomerPage() {
//   const { state, setState, handleChange, resetForm } = useFormState(FormFields);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log("Submitted Data:", state);

//     // Call your POST / PUT API here
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Customer Master</h1>

//       <form onSubmit={handleSubmit}>
//         <ReusableForm
//           fields={FormFields}
//           state={state}
//           handleChange={handleChange}
//         />

//         <button type="submit">Save</button>

//         <button type="button" onClick={resetForm}>
//           Reset
//         </button>
//       </form>

//       <h3>Live State Values</h3>
//       <pre>{JSON.stringify(state, null, 2)}</pre>
//     </div>
//   );
// }
