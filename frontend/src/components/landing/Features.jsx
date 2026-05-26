import { Users, BarChart3, Calendar } from "lucide-react";

const Features = () => {
  return (
    <div className="features bg-white-50 py-12 shadoe-lg flex items-center justify-center shadow-sm ">
      <div className="features-content bg-white mx-auto   px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4 py-4 text-center">
          Powerful Features for Modern Schools
        </h1>
        <h3 className="text-xl text-slate-600 mb-4 text-center">
          Everything you need to run your institution efficiently
        </h3>
        <div className="features-grid  p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 gap-6 card-interactive">
            {/* Icon */}
            <div className="bg-indigo-200 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users size={24} className="text-indigo-600 " />
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Student Management
            </h3>
            <h4 className="text-slate-600">
              Centeralized student database with profiles, enrollment tracking,
              and academic rocords.
            </h4>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 gap-6 card-interactive ">
            {/* Icon */}
            <div className="bg-indigo-200 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Attendace Tracking
            </h3>
            <h4 className="text-slate-600">
              Real-time attendace monitoring with automated alerts and
              comprehensive reports.
            </h4>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6  gap-6 card-interactive ">
            {/* Icon */}
            <div className="bg-indigo-200 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Anaylytics & Insight
            </h3>
            <h4 className="text-slate-600">
              Data-driven dashboards for performance tracking and informed decision-making.
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
