"use client";
import { useState } from "react";

export default function TestPage() {
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDoc((currentDoc) => ({ ...currentDoc, [name]: value }));
  };

  return (
    <div>
      <h1>Test Page</h1>
      <label>Document ID</label>
      <input
        type="text"
        name="docId"
        value={doc.docId ?? ""}
        onChange={handleChange}
      />

      <label>Document Type</label>
      <input
        type="text"
        name="docType"
        value={doc.docType ?? ""}
        onChange={handleChange}
      />

      <label>Document Prefix</label>
      <input
        type="text"
        name="docPrefix"
        value={doc.docPrefix ?? ""}
        onChange={handleChange}
      />
      <p>Current Form Data: {doc.docPrefix}</p>
    </div>
  );
}
