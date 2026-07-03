import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// Production data format mapping the subjects and scores out of 100
const performanceData = [
  { subject: 'Math', score: 90, fullMark: 100 },
  { subject: 'English', score: 75, fullMark: 100 },
  { subject: 'Physics', score: 70, fullMark: 100 },
  { subject: 'History', score: 85, fullMark: 100 },
  { subject: 'Chemistry', score: 65, fullMark: 100 },
];

export function PerformanceRadar({ data = performanceData }) {
  return (
    <div className="max-w-xs w-full bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center">
      {/* Header Alignment */}
      <div className="w-full text-left mb-2">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Performance Radar</h2>
        <p className="text-sm font-medium text-slate-400 mt-0.5">Score by subject</p>
      </div>

      {/* Chart Wrapper Container */}
      <div className="w-full h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            {/* Concentric grid lines matching the slate style */}
            <PolarGrid stroke="#e2e8f0" />
            
            {/* Subject Label Axis */}
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
            />
            
            {/* Invisible Radius axis just to manage boundaries (max 100) */}
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

            {/* Premium Minimal Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ display: 'none' }}
            />

            {/* The Radar Shape fill & boundary lines */}
            <Radar
              name="Student Score"
              dataKey="score"
              stroke="#4f46e5"          // indigo-600
              fill="#4f46e5"            // indigo-600
              fillOpacity={0.12}        // Light background fill opacity matching your screenshot
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}