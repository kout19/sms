import { Plus, Search } from "lucide-react";
import { useState } from "react";
import TeacherCard from "../cards/TeacherCard";

const courses = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Science" },
  { id: 3, name: "History" },
  { id: 4, name: "Literature" },
];

const teachersData = [
  {
    id: 1,
    name: "Dr. John Doe",
    email: "jdoe@school.edu",
    phone: "(555) 123-4567",
    courses: ["Mathematics", "Science"],
    activeClasses: ["9 A", "10 C"],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jsmit@school.edu",
    phone: "(555) 234-5678",
    courses: ["History", "Literature"],
    activeClasses: ["11 B", "12 E"],
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: " ajohnson@school.edu",
    phone: "(555) 345-6789",
    courses: ["Mathematics", "History"],
    activeClasses: ["9 D", "11 F"],
  },
];

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };
  const handleClassFilter = (val) => {
    setSelectedClass(val);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="">
          <h1 className="text-slate-900 text-xl md:text-2xl font-semibold">
            Teachers
          </h1>
          <p className="text-slate-600 mt-2">Manage teaching staff here.</p>
        </div>
        <div className="">
          <button className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus size={18} />
            Add Teacher
          </button>
        </div>
      </div>
      {/* Search + Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex items-center flex-1">
          <Search
            size={16}
            className="text-slate-400 absolute left-3 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={selectedClass}
            onChange={(e) => handleClassFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700"
          >
            <option value="">All Classes</option>
            {courses.map((crs) => (
              <option key={crs.id} value={crs.name}>
                {crs.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachersData.map((teacher, index) => (
          <TeacherCard
            key={index}
            name={teacher.name}
            courses={teacher.courses}
            email={teacher.email}
            phone={teacher.phone}
            activeClasses={teacher.activeClasses}
            onEdit={() => {}}
            onView={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Teachers;
