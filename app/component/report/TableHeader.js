export default function TableHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}
