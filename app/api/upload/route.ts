// import { NextResponse } from "next/server";
// import * as XLSX from "xlsx";
// import Groq from "groq-sdk";

// const CONCURRENCY = 5; // 🔥 control parallel calls

// export async function POST(req: Request) {
//   try {
//     if (!process.env.GROQ_API_KEY) {
//       return NextResponse.json(
//         { error: "Missing GROQ_API_KEY" },
//         { status: 500 },
//       );
//     }

//     const groq = new Groq({
//       apiKey: process.env.GROQ_API_KEY,
//     });

//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const buffer = await file.arrayBuffer();

//     // 📊 READ EXCEL
//     const workbook = XLSX.read(buffer, { type: "buffer" });
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows: any[] = XLSX.utils.sheet_to_json(sheet);

//     // 🔁 FUNCTION TO PROCESS SINGLE ROW
//     const processRow = async (row: any) => {
//       const raw = Object.values(row).join(" ").trim();

//       try {
//         const completion = await groq.chat.completions.create({
//           model: "llama-3.3-70b-versatile",
//           temperature: 0,
//           messages: [
//             {
//               role: "system",
//               content: `
//                 You are a BANK RECONCILIATION AI.
//                 Extract from transaction text:
//                     1. transfer_name → ONLY human or company name
//                     2. transaction_type → debit or credit
//                     3. confidence → 0 to 100
// 4. transaction_mode → upi / gpay / phonepe / paytm / neft / imps / rtgs / card
// 5. reference_no → transaction reference number
//                 RULES:
//                     - Remove all numbers, dates, codes
//                     - Focus ONLY on real name
//                     - If unclear → lower confidence
//                     - Return ONLY valid JSON
//                 FORMAT:
//                     {
//                     "transfer_name": "",
//                     "transaction_type": "debit",
//                     "confidence": 0
//                     } `,
//             },
//             {
//               role: "user",
//               content: raw,
//             },
//           ],
//         });

//         let content = completion.choices[0].message.content || "{}";

//         // 🧹 CLEAN JSON
//         content = content.replace(/```json|```/g, "").trim();

//         const parsed = JSON.parse(content);

//         return {
//           raw,
//           transfer_name: parsed.transfer_name || "UNKNOWN",
//           transaction_type: parsed.transaction_type || "unknown",
//           confidence: parsed.confidence ?? 0,
//         };
//       } catch (err) {
//         return {
//           raw,
//           transfer_name: "ERROR",
//           transaction_type: "unknown",
//           confidence: 0,
//         };
//       }
//     };

//     // 🚀 PARALLEL PROCESSING WITH LIMIT
//     const results: any[] = [];
//     let index = 0;

//     while (index < rows.length) {
//       const chunk = rows.slice(index, index + CONCURRENCY);

//       const chunkResults = await Promise.all(
//         chunk.map((row) => processRow(row)),
//       );

//       results.push(...chunkResults);
//       index += CONCURRENCY;
//     }

//     return NextResponse.json({ data: results });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import Groq from "groq-sdk";

const CONCURRENCY = 5;

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 500 },
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    // 🔁 PROCESS ROW
    const processRow = async (row: any) => {
      const raw = Object.values(row).join(" ").trim() || "UNKNOWN";
      const lowerRaw = raw.toLowerCase();

      try {
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          temperature: 0,
          messages: [
            {
              role: "system",
              content: `
You are a BANK RECONCILIATION AI.

Extract from transaction text:

1. transfer_name → ONLY human or company name
2. transaction_type → debit or credit
3. transaction_mode → upi / gpay / phonepe / paytm / neft / imps / rtgs / card
4. reference_no → transaction reference number
5. confidence → 0 to 100

RULES:
      - Remove all numbers, dates, codes
      - Focus ONLY on real name
      - If unclear → lower confidence
      - Return ONLY valid JSON
- Remove all numbers EXCEPT reference number
- transfer_name must contain ONLY name (no digits)
- Detect transaction_mode using keywords:
    UPI → upi
    GPay → gpay
    PhonePe → phonepe
    Paytm → paytm
    NEFT → neft
    IMPS → imps
    RTGS → rtgs
    CARD/POS → card

- reference_no = long numeric/alphanumeric string (8+ length)
- If unclear → lower confidence
- Return ONLY valid JSON

IMPORTANT:
- No explanation
- Only JSON output

FORMAT:
{
  "transfer_name": "",
  "transaction_type": "debit",
  "transaction_mode": "upi",
  "reference_no": "",
  "confidence": 0
}
              `,
            },
            {
              role: "user",
              content: raw,
            },
          ],
        });

        let content = completion.choices?.[0]?.message?.content || "{}";

        // 🧹 CLEAN OUTPUT
        content = content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        let parsed: any = {};

        try {
          const match = content.match(/\{[\s\S]*\}/);
          parsed = match ? JSON.parse(match[0]) : {};
        } catch {
          parsed = {};
        }

        // =========================
        // 🔵 NAME FIX
        // =========================
        let transfer_name = parsed.transfer_name || "";
        transfer_name = transfer_name.replace(/[0-9]/g, "").trim();

        if (!transfer_name || transfer_name.length < 2) {
          const nameMatch = raw.match(/[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/);
          transfer_name = nameMatch ? nameMatch[0] : "UNKNOWN";
        }

        // =========================
        // 🔵 TYPE FIX
        // =========================
        let transaction_type =
          parsed.transaction_type ||
          (lowerRaw.includes("cr") ? "credit" : "debit");

        // =========================
        // 🔵 MODE FIX
        // =========================
        let transaction_mode = "unknown";

        if (
          lowerRaw.includes("upi") ||
          lowerRaw.includes("gpay") ||
          lowerRaw.includes("phonepe") ||
          lowerRaw.includes("paytm")
        ) {
          transaction_mode = "upi";
        } else if (lowerRaw.includes("neft")) {
          transaction_mode = "neft";
        } else if (lowerRaw.includes("imps")) {
          transaction_mode = "imps";
        } else if (lowerRaw.includes("rtgs")) {
          transaction_mode = "rtgs";
        } else if (lowerRaw.includes("card") || lowerRaw.includes("pos")) {
          transaction_mode = "card";
        } else {
          transaction_mode = parsed.transaction_mode || "unknown";
        }

        // =========================
        // 🔵 REFERENCE FIX
        // =========================
        const refMatch =
          raw.match(/\b\d{10,20}\b/) || raw.match(/\b[A-Z0-9]{8,}\b/);

        const reference_no =
          parsed.reference_no || (refMatch ? refMatch[0] : "N/A");

        // =========================
        // 🔵 CONFIDENCE FIX
        // =========================
        const confidence =
          typeof parsed.confidence === "number"
            ? parsed.confidence
            : transfer_name !== "UNKNOWN"
              ? 75
              : 40;

        return {
          raw,
          transfer_name,
          transaction_type,
          transaction_mode,
          reference_no,
          confidence,
        };
      } catch (err) {
        return {
          raw,
          transfer_name: "ERROR",
          transaction_type: "unknown",
          transaction_mode: "unknown",
          reference_no: "N/A",
          confidence: 0,
        };
      }
    };

    // 🚀 PARALLEL EXECUTION
    const results: any[] = [];
    let index = 0;

    while (index < rows.length) {
      const chunk = rows.slice(index, index + CONCURRENCY);

      const chunkResults = await Promise.all(
        chunk.map((row) => processRow(row)),
      );

      results.push(...chunkResults);
      index += CONCURRENCY;
    }

    return NextResponse.json({ data: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
