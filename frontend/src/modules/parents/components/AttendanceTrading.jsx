import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
  } from 'recharts';

const attendanceTimelineData = [
    { month: 'Jan', emma: 98, jack: 98 },
    { month: 'Feb', emma: 95, jack: 96 },
    { month: 'Mar', emma: 97, jack: 97 },
    { month: 'Apr', emma: 94, jack: 95 },
    { month: 'May', emma: 96, jack: 96 },
];



export function AttendanceTrend({ data = attendanceTimelineData }) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col">
      
      {/* Header Area with Custom Clean Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Attendance Trend
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-0.5">
            Monthly attendance rate (%)
          </p>
        </div>

        {/* Custom Screen Legend matching your UI layout exactly */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-indigo-600 rounded-full" />
            <span>Emma</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-500 rounded-full" />
            <span>Jack</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
          >
            {/* Subtle horizontal grid lines only */}
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="4 4" 
              stroke="#f1f5f9" // slate-100
            />

            {/* Custom Locked Y-Axis Bound matching screenshot targets */}
            <YAxis
              domain={[85, 100]}
              ticks={[85, 89, 93, 100]}
              axisLine={false}
              tickLine={false}
              stroke="#94a3b8" // slate-400
              style={{ fontSize: '12px', fontWeight: 500 }}
            />

            {/* X-Axis */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              stroke="#94a3b8"
              style={{ fontSize: '12px', fontWeight: 500 }}
              dy={10}
            />

            {/* Premium Interactive Tooltip popup */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ color: '#fff', padding: '2px 0' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />

            {/* Line 1: Emma (Monotone Smooth Pathing) */}
            <Line
              type="monotone"
              dataKey="emma"
              stroke="#4f46e5" // indigo-600
              strokeWidth={3}
              dot={false}      // No static dot nodes per your clean image layout
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* Line 2: Jack */}
            <Line
              type="monotone"
              dataKey="jack"
              stroke="#0ea5e9" // sky-500
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}