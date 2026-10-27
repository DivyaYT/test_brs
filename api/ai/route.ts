import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { text } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a bank reconciliation AI.

Extract:
1. transfer_name
2. transaction_type (debit/credit)
3. confidence (0-100)

Return JSON only.
        `,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return NextResponse.json({
    result: completion.choices[0].message.content,
  });
}
