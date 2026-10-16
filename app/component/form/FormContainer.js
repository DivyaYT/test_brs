export default function FormContainer({ children, onSubmit }) {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-start py-10 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-4xl bg-white rounded-xl shadow"
      >
        {children}
      </form>
    </div>
  );
}