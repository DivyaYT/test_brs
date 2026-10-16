
"use client";

export default function Notification({ notification }) {
  if (!notification) return null;

  return (
    <div
      className={`fixed top-5 right-5 p-3 rounded shadow ${
        notification.type === "success" ? "bg-green-100" : "bg-red-100"
      }`}
    >
      {notification.message}
    </div>
  );
}
