
"use client";

export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p>{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}
