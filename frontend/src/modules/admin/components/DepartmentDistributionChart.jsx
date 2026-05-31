import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DepartmentDistributionChart = () => {
  const data = {
    labels: ["Science", "Arts", "Commerce", "Tech"],
    datasets: [
      {
        data: [320, 210, 180, 290],
        backgroundColor: ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
      <h2 className="text-slate-600 font-medium mb-4">
        Department Distribution
      </h2>
      <div className="w-full max-w-[280px] mx-auto">
        <Doughnut data={data} />
      </div>
    </div>
  );
};

export default DepartmentDistributionChart;
