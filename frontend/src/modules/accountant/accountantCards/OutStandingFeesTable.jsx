
import { useNavigate } from "react-router-dom";

const OutstandingFeesTable = ({
  title = "OUTSTANDING FEES — PRIORITY CASES",
  totalCount = 48,
  data = [
    {
      id: "STU-2401",
      student: "Liya Dawit",
      class: "Grade 11A",
      expected: "ETB 18,000",
      paid: "ETB 9,000",
      balance: "ETB 9,000",
      dueDate: "Aug 01",
      status: "Overdue",
    },
    {
      id: "STU-2318",
      student: "Naol Tesfaye",
      class: "Grade 12B",
      expected: "ETB 18,000",
      paid: "ETB 12,000",
      balance: "ETB 6,000",
      dueDate: "Aug 01",
      status: "Overdue",
    },
    {
      id: "STU-2204",
      student: "Saron Bekele",
      class: "Grade 10C",
      expected: "ETB 14,000",
      paid: "ETB 7,000",
      balance: "ETB 7,000",
      dueDate: "Aug 15",
      status: "Pending",
    },
    {
      id: "STU-2156",
      student: "Abebe Girma",
      class: "Grade 9A",
      expected: "ETB 14,000",
      paid: "ETB 0",
      balance: "ETB 14,000",
      dueDate: "Aug 10",
      status: "Overdue",
    },
    {
      id: "STU-2389",
      student: "Hana Mekdes",
      class: "Grade 11B",
      expected: "ETB 18,000",
      paid: "ETB 15,000",
      balance: "ETB 3,000",
      dueDate: "Aug 20",
      status: "Pending",
    },
  ],
  isLoading = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden w-full">
      {/* Table Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          {title}
        </h3>
        <button
          onClick={() => navigate("/finance/outstanding")}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All {totalCount} &rarr;
        </button>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-100 font-medium">
            <tr>
              <th className="px-5 py-3">STUDENT</th>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">CLASS</th>
              <th className="px-5 py-3">EXPECTED</th>
              <th className="px-5 py-3">PAID</th>
              <th className="px-5 py-3">BALANCE</th>
              <th className="px-5 py-3">DUE DATE</th>
              <th className="px-5 py-3">STATUS</th>
              <th className="px-5 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {isLoading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-8 text-center text-slate-400"
                >
                  Loading priority records...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-8 text-center text-slate-400"
                >
                  No outstanding cases recorded.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5 font-bold text-slate-800">
                    {row.student}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{row.id}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.class}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.expected}</td>
                  <td className="px-5 py-3.5 text-emerald-600 font-semibold">
                    {row.paid}
                  </td>
                  <td className="px-5 py-3.5 text-red-500 font-bold">
                    {row.balance}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{row.dueDate}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.status === "Overdue"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-3">
                    <button
                      onClick={() => console.log("Record payment for:", row.id)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Record
                    </button>
                    <button
                      onClick={() => console.log("Send reminder to:", row.id)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      Remind
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutstandingFeesTable;
