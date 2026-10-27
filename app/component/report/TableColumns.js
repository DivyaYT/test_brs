export const TableColumns = [
  { key: "org_id", label: "Org ID" },
  { key: "org_code", label: "Org Code" },
  { key: "org_name", label: "Org Name" },
  { key: "created_by", label: "Created By" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`px-3 py-1 rounded-full text-xs ${
          value === 1
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        {value === 1 ? "Active" : "Inactive"}
      </span>
    ),
  },
];
