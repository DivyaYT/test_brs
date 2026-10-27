"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import TableContainer from "../component/report/TableContainer";
import TableHeader from "../component/report/TableHeader";
import TableSearch from "../component/report/TableSearch";
import TableActions from "../component/report/TableActions";
import Table from "../component/report/Table";

// 🔥 IMPORT SPLIT FILES
import { TableColumns } from "../component/report/TableColumns";
export default function Page() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/org");
        const json = await res.json();
        setData(json);
        console.log("err", data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    return data.filter((d) =>
      d.org_name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  return (
    <TableContainer>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <TableHeader title="Organization" subtitle="Manage all organizations" />

        <div className="flex gap-3 flex-wrap">
          <TableSearch value={search} onChange={setSearch} />

          <TableActions
            onCreate={() => router.push("/customer")}
            onUpload={() => alert("Upload")}
            onDownload={() => alert("Download")}
          />
        </div>
      </div>

      {/* 🔥 ONLY COLUMN CONFIG PASSED */}
      <Table
        columns={TableColumns}
        data={filtered}
        onEdit={(id) => router.push(`/edit/${id}`)}
      />
    </TableContainer>
  );
}
