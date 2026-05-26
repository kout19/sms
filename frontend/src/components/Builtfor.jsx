import {
  Shield,
  GraduationCap,
  Users,
  BarChart3,
  Clock,
  FileText,
  BookOpen,
  Calendar,
  Bell,
} from "lucide-react";

const Builtfor = () => {
  return (
    <div className="bg-gray-100/10 py-12 shadow-sm mb-3 flex items-center justify-center">
      <div className="w-full max-w-5xl px-6">
        <h1 className="text-4xl font-bold  text-slate-800 text-center mb-4">
          Built for Every Role
        </h1>
        <h3 className="text-xl  text-slate-600  mb-4">
          Tailored experience for Admins , Teachres, Studnets and parents
        </h3>
        <div className="built-for-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Card */}
          <div className="bg-white shadow-xl border border-slate-100 overflow-hidden  rounded-xl flex-col">
            {/* Indigo header */}
            <div className="bg-indigo-600 p-6 text-white">
              <div className="text-white bg-indigo-400 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                <Shield size={24} className="text-white w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">For Admins</h3>
            </div>
            <div className=" px-6 flex items-center gap-3  mt-6 mb-3 ">
              <div className=" bg-indigo-200  w-10 h-10 flex items-center justify-center rounded-xl  space-y-3  ">
                <BarChart3 size={20} className="text-indigo-600 w-5 h-5" />
              </div>
              <div className="flex items-center justify-center text-slate-600">
                <h3>Complete oversight dashboard</h3>
              </div>
            </div>
            <div className="px-6 flex items-center gap-3 mt-6 mb-6">
              <div className="bg-indigo-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <Users size={20} className="text-indigo-600 w-5 h-5" />
              </div>
              <div className="text-slate-600 flex items-center justify-center ">
                <h3>Staff and student management</h3>
              </div>
            </div>
            <div className="px-6 flex items-center gap-3 mt-6 mb-6">
              <div className="bg-indigo-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <FileText size={20} className="text-indigo-600 w-5 h-5" />
              </div>
              <div className="text-slate-600 flex items-center justify-center">
                <h3>Compliance and reporting tools</h3>
              </div>
            </div>
            <div className="px-6 gap-3 mt-6 mb-6 flex items-center">
              <div className="bg-indigo-200 h-10 w-10 flex items-center justify-center rounded-xl">
                <Shield size={20} className="w-5 h-5 text-ingigo-600" />
              </div>
              <div className="text-slate-600 flex items-center justify-center">
                <h3>Security and data protection</h3>
              </div>
            </div>
          </div>
          {/* Second Card */}
          <div className="bg-white shadow-xl border border-slate-100 overflow-hidden  rounded-xl flex-col ">
            {/* blue header */}
            <div className="bg-blue-800 px-6 p-6">
              <div className=" rounded-xl text-white  bg-blue-300/50 h-12 w-12 flex items-center justify-center ">
                <GraduationCap size={20} className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mt-3">
                For Teachers
              </h3>
            </div>
            <div className="px-6 flex items-center gap-3  mt-6 mb-6">
              <div className="text-white bg-indigo-200 h-10 w-10 flex items-center justify-center rounded-xl">
                <BookOpen size={20} className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-slate-600 flex items-center justify-center ">
                <h3 className="">Digital gradebook & grading</h3>
              </div>
            </div>
            <div className=" px-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-200 flex items-center justify-center rounded-xl">
                <Calendar size={20} className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex items-center justify-center text-slate-600">
                <h3>Lesson planning & scheduling</h3>
              </div>
            </div>
            <div className="p-6 px-6 flex items-center gap-3">
              <div className="bg-indigo-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <Bell size={20} className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-slate-600 flex items-center justify-center">
                <h3>Parent communication hub</h3>
              </div>
            </div>
            <div className="px-6 flex items-center gap-3">
              <div className="bg-indigo-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <Clock size={20} className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-slate-600 flex items-center justify-center">
                <h3>Attendance Management</h3>
              </div>
            </div>
          </div>
          {/* Third card */}
          <div className="bg-white shadow-xl border border-slate-100 overflow-hidden rounded-xl">
            {/* card hdeader */}
            <div className="bg-purple-600 px-6 p-6">
              <div className="w-12 h-12 bg-purple-300/50 rounded-xl flex items-center justify-center">
                <Users size={20} className="w-10 h-10 text-white " />
              </div>
              <h3 className="text-xl font-bold text-white mt-3">For Parents</h3>
            </div>
            <div className="px-6 flex items-center gap-3 mt-6 mb-6">
              <div className="bg-indigo-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <BarChart3 size={20} className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-slate-600 flex items-center justify-center">
                <h3>Real-time grade tracking</h3>
              </div>
            </div>
            <div className="px-6 flex items-center gap-3 mt-6 mb-6">
              <div className="bg-indigo-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <Users size={20} className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-slate-600 flex items-center justify-center">
                <h3>School calendar & events</h3>
              </div>
            </div>
            <div className="px-6 flex items-center gap-3 mt-6 mb-6">
              <div className="bg-indigo-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <FileText size={20} className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-slate-600 flex items-center justify-center">
                <h3>Instant notifications</h3>
              </div>
            </div>
            <div className="px-6 flex items-center gap-3 mt-6 mb-6">
              <div className="bg-indigo-200 w-10 h-10 flex items-center justify-center rounded-xl">
                <Shield size={20} className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-slate-600 flex items-center justify-center">
                <h3>Report card access</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Builtfor;
