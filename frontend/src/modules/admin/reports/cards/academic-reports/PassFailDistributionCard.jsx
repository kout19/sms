import { usePassFailDistribution } from "../../hooks/useAcademicReports";

export default function PassFailDistributionCard({ filters }) {
  const { data, isLoading } = usePassFailDistribution(filters);
  if (isLoading || !data) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900">Pass / Fail Distribution</h3>
      <p className="text-sm text-gray-500 mb-6">Current term results</p>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-14 flex-shrink-0">
            Passed
          </span>
          <div className="flex-1 h-6 bg-gray-50 rounded-md overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-md"
              style={{ width: `${data.passed}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-14 flex-shrink-0">
            Failed
          </span>
          <div className="flex-1 h-6 bg-gray-50 rounded-md overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-md"
              style={{ width: `${data.failed}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-400 mt-2 pl-[68px]">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-emerald-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{data.passed}%</p>
          <p className="text-sm text-gray-600">Passed</p>
        </div>
        <div className="bg-rose-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-rose-600">{data.failed}%</p>
          <p className="text-sm text-gray-600">Failed</p>
        </div>
      </div>
    </div>
  );
}
