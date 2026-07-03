import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

// Production-grade mock data format
const trendData = [
  { month: 'Jan', gpa: 3.40 },
  { month: 'Feb', gpa: 3.60 },
  { month: 'Mar', gpa: 3.70 },
  { month: 'Apr', gpa: 3.80 },
  { month: 'May', gpa: 3.92 },
];

export function GpaTrend({ data = trendData }) {
  return (
    <div className="max-w-xs w-full bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">GPA Trend</h2>
        <p className="text-sm font-medium text-slate-400 mt-0.5">Jan — May 2026</p>
      </div>

      {/* Chart Wrapper Container */}
      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
          >
            {/* Subtle dashed horizontal grid lines only */}
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="4 4" 
              stroke="#f1f5f9" // slate-100
            />

            {/* Y Axis tailored exactly to GPA scaling (3.0 to 4.0) */}
            <YAxis
              domain={[3, 4]}
              tickCount={5}
              axisLine={false}
              tickLine={false}
              stroke="#94a3b8" // slate-400
              style={{ fontSize: '12px', fontWeight: 500 }}
            />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              stroke="#94a3b8" // slate-400
              style={{ fontSize: '12px', fontWeight: 500 }}
              dy={10}
            />

            {/* Custom Tooltip on hover */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b', // slate-800
                border: 'none',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ display: 'none' }} // Hide label header for cleaner minimal look
            />

            {/* The Main Trend Line */}
            <Line
              type="monotone"
              dataKey="gpa"
              stroke="#4f46e5" // indigo-600 (matches your brand color)
              strokeWidth={3}
              dot={{ r: 5, fill: '#4f46e5', strokeWidth: 0 }}
              activeDot={{ r: 7, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}