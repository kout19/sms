import { Phone, Mail, BookOpen } from "lucide-react";

const TeacherCard = ({
  id,
  name,
  email,
  phone,
  courses,
  activeClasses,
  onEdit,
  onView,
  onDelete,
}) => {


  const getInitials = (name) => {
    if (!name) return "";

    // List of titles to ignore
    const titles = ["dr.", "mr.", "mrs.", "ms.", "prof.", "doc."];

    const cleanWords = name
      .trim()
      .split(/\s+/)
      .filter((word) => !titles.includes(word.toLowerCase())); // Removes titles

    // Takes the first letter of the first and last remaining words
    const firstInitial = cleanWords[0]?.[0] || "";
    const lastInitial =
      cleanWords.length > 1 ? cleanWords[cleanWords.length - 1][0] : "";

    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <div className="w-full border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg">
      <div className="">
        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl mb-4">
          <span className="">{getInitials()}</span>
        </div>
        <div className="id"></div>
        <div className="flex flex-col gap-2">
          <div className="mb-2 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900 mb-1">
                {name}
              </h3>
              <span className="text-xs text-slate-500 -mt-32">ID: {id}</span>
            </div>

            {/* <p className="text-xs text-slate-500">
              {courses.length} ({courses.join(", ")})
            </p> */}
          </div>
          <div className="text-slate-500 flex flex-col gap-1">
            <div className="flex items-center gap-1 justify-start">
              <Mail size={16} />
              <p className="text-sm">Email: {email}</p>
            </div>
            <div className="flex items-center gap-1 justify-start">
              <Phone size={16} />
              <p className="text-sm">Phone: {phone}</p>
            </div>

            {/* <div className="flex items-center gap-1 justify-start">
              <BookOpen size={16} />
              <p className="text-sm">
                Active Classes: {activeClasses.length} (
                {activeClasses.join(",")})
              </p>
            </div> */}
          </div>
          <div className=" flex items-center gap-2 mt-2">
            <button className="px-4 py-2 md:px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              View Profile
            </button>
            <button className="px-3 py-2 md:px-3 bg-indigo-600 text-white rounded-lg hover:bg-indogo-700 transition-colors">
              Edit
            </button>
            <button className="px-3 py-2 md:px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
