import {
  GraduationCap,
  CheckCircle,
  Users,
  BookOpen,
  BarChart3,
} from "lucide-react";

const Hero = () => {
  return (
    <main className="Hero mx-auto pt-16 px-6 pb-10  lg:px-32 lg:pb-20 bg-gray-100">
      <div className="inner-hero flex flex-col lg:flex-row items-center justify-between space-y-12">
        <div className=" ">
          <h1 className="text-6xl font-bold">
            Simplify School Administration
            <span className="text-indigo-600"> with EduSystems</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 max-w-xl leading-relaxed ">
            The all-in-one platform for modern school management. Streamline
            operations, enhance collaboration, and focus on what matters
            most—education
          </p>
          <div className=" flex pt-4 flex-col sm:flex-row gap-4 ">
            <div className="w-full sm:w-auto">
              <button className="bg-indigo-600 w-full  hover:bg-indigo-800 text-white font-bold py-4 px-4 rounded-md shadow-lg transition flex items-center gap-2 group cursor-pointer">
                Get Started Free
              </button>
            </div>
            <div className="w-full sm:w-auto">
              <button className="bg-white w-full hover:border-indigo-600 border-2 border-gray-300 hover:text-indigo-600 font-bold py-4 px-4 rounded-md">
                Request a Demo
              </button>
            </div>
          </div>
        </div>
        {/* The image card */}
        <div className="relative w-full ">
          {/* Floating Badge  */}
          <div className="absolute -top-3 right-1 bg-white  shadow-lg border-slate-100 rounded-xl p-4 flex items-center gap-3 z-10 animate-float-slow">
            <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-full flex items-center justify-center ">
              {/* Success Check icon */}
              <CheckCircle size={16} className="w-5 h-5" />
            </div>
            <div className="">
              <h4 className="text-sm font-bold text-slate-800 leading-tight">
                Cloud Synced
              </h4>
              <p className="text-xs text-slate-500 "> Real-time updates</p>
            </div>
          </div>
          {/* Main Dashboard card */}
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl  overflow-hidden">
            {/* Blue header bar */}
            <div className="bg-indigo-600 p-6 text-white flex items-center gap-4 ">
              <div className="bg-indigo-500/80 p-2.5 rounded-full w-10 h-10 flex items-center justify-center">
                {/* Admin user profile icon */}
                <Users size={20} className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">
                  Admin Dashboard
                </h3>
                <p className="text-xs text-indigo-200 ">Overview</p>
              </div>
              {/* Mac Window Control Dots (Red, Yellow, Green) */}
              <div className="bg-indigo-600 px-4 py-3 flex items-center gap-2 ml-auto">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-inner"></div>
              </div>
            </div>

            {/* Inner content of the dashboard card */}
            <div className="p-6 bg-slate-50/50 grid grid-cols-2 gap-4">
              {/* card student */}
              <div className="bg-white p-4 ronded-xl border border-slate-100 shadow-sm">
                <div className="bg-indigo-600 text-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <Users size={16} className="text-white w-5 h-5"/>
                </div>
                <div className="text-2xl font-black text-slate-800"> 2,874</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5 ">
                  Total Students
                </div>
              </div>
              {/* Teachers Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="bg-blue-600 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <GraduationCap size={20} className="text-white w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-slate-800">142</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  Teachers
                </div>
              </div>
              {/* Classes Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="bg-purple-500 text-white h-10 w-10 rounded-xl flex items-center justify-center mb-3">
                  <BookOpen size={20} className="text-white w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-slate-800">68</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  Classes
                </div>
              </div>
              {/* Attendace Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shodow-sm">
                <div className="bg-green-600 text-green-600 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle size={20} className="text-white w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-slate-800">96.3%</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  Attendance
                </div>
              </div>
            </div>
            {/* Recent activity placeholder */}
            <div className="p-6 pt-2 border-t border-slate-100 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-slate-700">
                  Recent Activity
                </h4>
                <span className="text-slate-500 text-xs">
                  <BarChart3 size={16} className="inline-block mr-1" />
                  Last 7 days
                </span>
              </div>
              <div className="space-y-3">
                <div className="h-2.5 bg-indigo-600 rounded-full w-full"></div>
                <div className="h-2.5 bg-indigo-400 rounded-full w-5/6"></div>
                <div className="h-2.5 bg-blue-200 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
