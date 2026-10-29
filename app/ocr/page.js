// "use client";

// import { useState } from "react";
// import Tesseract from "tesseract.js";

// export default function OCRPage() {
//   const [file, setFile] = useState(null);

//   const [text, setText] = useState("");

//   const [ocrRows, setOcrRows] = useState([]);
//   const [aiRows, setAiRows] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [view, setView] = useState("ocr");

//   // 📁 upload
//   const handleFile = (e) => {
//     setFile(e.target.files[0]);
//     setText("");
//     setOcrRows([]);
//     setAiRows([]);
//   };

//   // 🔍 OCR PROCESS
//   const runOCR = async () => {
//     if (!file) return alert("Upload file");

//     setLoading(true);

//     try {
//       const result = await Tesseract.recognize(file, "eng");

//       const extracted = result.data.text;

//       setText(extracted);

//       // RAW TABLE GENERATION
//       const lines = extracted.split("\n").filter((l) => l.trim());

//       const table = lines.map((line) => {
//         const date = line.match(/\d{2}[-/]\d{2}[-/]\d{4}/);
//         const amount = line.match(/\d+(\.\d{1,2})?/);

//         return {
//           date: date?.[0] || "-",
//           amount: amount?.[0] || "-",
//           description: line
//             .replace(date?.[0] || "", "")
//             .replace(amount?.[0] || "", "")
//             .trim(),
//         };
//       });

//       setOcrRows(table);
//       setView("ocr");
//     } catch (err) {
//       console.error(err);
//       alert("OCR failed");
//     }

//     setLoading(false);
//   };

//   // 🤖 AI CALL
//   const runAI = async () => {
//     if (!text) return alert("Run OCR first");

//     setLoading(true);

//     try {
//       const res = await fetch("/api/ai-fix", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text }),
//       });

//       const data = await res.json();

//       console.log("AI RESULT:", data);

//       if (Array.isArray(data)) {
//         setAiRows(data);
//         setView("ai");
//       } else {
//         setAiRows([]);
//         alert("AI returned invalid data");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("AI failed");
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>📄 OCR + AI Bank Reconciliation</h1>

//       {/* UPLOAD */}
//       <div style={styles.card}>
//         <input type="file" onChange={handleFile} />

//         <div style={{ marginTop: 10 }}>
//           <button onClick={runOCR} style={styles.btn}>
//             {loading ? "Running OCR..." : "Run OCR"}
//           </button>

//           <button onClick={runAI} style={styles.btnGreen}>
//             🤖 AI Reconcile
//           </button>

//           <button onClick={() => setView("ocr")} style={styles.btnGray}>
//             OCR Table
//           </button>

//           <button onClick={() => setView("ai")} style={styles.btnBlue}>
//             AI Table
//           </button>
//         </div>
//       </div>

//       {/* RAW TEXT */}
//       <div style={styles.card}>
//         <h3>📝 OCR Raw Text</h3>
//         <textarea value={text} rows={6} style={styles.textarea} readOnly />
//       </div>

//       {/* OCR TABLE */}
//       {view === "ocr" && (
//         <div style={styles.card}>
//           <h3>📊 OCR Extracted Data</h3>

//           {ocrRows.length === 0 ? (
//             <p>No OCR data</p>
//           ) : (
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Amount</th>
//                   <th>Description</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {ocrRows.map((r, i) => (
//                   <tr key={i}>
//                     <td>{r.date}</td>
//                     <td>{r.amount}</td>
//                     <td>{r.description}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {/* AI TABLE */}
//       {view === "ai" && (
//         <div style={styles.card}>
//           <h3>🤖 AI Reconciled Data</h3>

//           {aiRows.length === 0 ? (
//             <p>No AI data</p>
//           ) : (
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Transfer Name</th>
//                   <th>Type</th>
//                   <th>Confidence</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {aiRows.map((r, i) => (
//                   <tr key={i}>
//                     <td>{r.transfer_name}</td>
//                     <td>{r.transaction_type}</td>
//                     <td>{r.confidence}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* 🎨 STYLES */
// const styles = {
//   container: {
//     padding: 20,
//     fontFamily: "Arial",
//     background: "#f5f6fa",
//     minHeight: "100vh",
//   },
//   title: { textAlign: "center" },

//   card: {
//     background: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//   },

//   btn: {
//     padding: 10,
//     marginRight: 10,
//     background: "#333",
//     color: "#fff",
//     border: "none",
//     borderRadius: 5,
//     cursor: "pointer",
//   },

//   btnGreen: {
//     padding: 10,
//     marginRight: 10,
//     background: "green",
//     color: "#fff",
//     border: "none",
//     borderRadius: 5,
//     cursor: "pointer",
//   },

//   btnGray: {
//     padding: 10,
//     marginRight: 10,
//     background: "gray",
//     color: "#fff",
//     border: "none",
//     borderRadius: 5,
//     cursor: "pointer",
//   },

//   btnBlue: {
//     padding: 10,
//     background: "#0070f3",
//     color: "#fff",
//     border: "none",
//     borderRadius: 5,
//     cursor: "pointer",
//   },

//   textarea: {
//     width: "100%",
//     padding: 10,
//     borderRadius: 5,
//   },

//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
// };
