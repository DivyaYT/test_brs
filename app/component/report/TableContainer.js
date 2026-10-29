export default function TableContainer({ children }) {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow p-6">{children}</div>
    </div>
  );
}
