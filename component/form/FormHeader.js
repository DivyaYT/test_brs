export default function FormHeader({ title }) {
  return (
    <div className="flex justify-between items-center p-6 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <button
        type="submit"
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
      >
        Continue
      </button>
    </div>
  );
}
