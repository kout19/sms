import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const EnrollmentByGradeChart = () => {
  const data = {
    labels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    datasets: [
      {
        label: "Students",
        data: [120, 98, 145, 110, 133, 87],
        backgroundColor: "#6366F1",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-slate-600 font-medium mb-4">Enrollment by Grade</h2>
      <Bar data={data} />
    </div>
  );
};

export default EnrollmentByGradeChart;
