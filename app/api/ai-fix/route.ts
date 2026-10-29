import { NextResponse } from "next/server";
import Tesseract from "tesseract.js";
import Groq from "groq-sdk";

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

    // 🔍 OCR STEP
    const buffer = await file.arrayBuffer();

    const result = await Tesseract.recognize(Buffer.from(buffer), "eng");

    const text = result.data.text || "";

    // split OCR into rows
    const lines = text.split("\n").filter((l) => l.trim());

    const results = [];

    // 🤖 AI PROCESS EACH LINE (same style as Excel code)
    for (const line of lines) {
      const raw = line.trim();

      if (!raw) continue;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: `
You are a BANK RECONCILIATION AI.

Extract from transaction text:

1. transfer_name → ONLY person or company
2. transaction_type → debit or credit
3. confidence → 0 to 100

RULES:
- Remove numbers, dates, codes
- Focus only on real entity name
- If unclear → low confidence
- Return ONLY valid JSON

FORMAT:
{
  "transfer_name": "",
  "transaction_type": "debit",
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

      let transfer_name = "UNKNOWN";
      let transaction_type = "unknown";
      let confidence = 0;

      try {
        const content = completion.choices[0].message.content || "{}";

        const parsed = JSON.parse(content);

        transfer_name = parsed.transfer_name || "UNKNOWN";
        transaction_type = parsed.transaction_type || "unknown";
        confidence = parsed.confidence ?? 0;
      } catch (err) {
        // fallback safe values
      }

      results.push({
        raw,
        transfer_name,
        transaction_type,
        confidence,
      });
    }

    return NextResponse.json({
      text,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
