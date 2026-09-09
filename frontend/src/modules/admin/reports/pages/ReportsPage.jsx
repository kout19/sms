import ReportOverviewSection from "../components/ReportsOverviewSection";
import SchoolHealthCard from "../cards/SchoolHealthCard";
import {useSchoolHealthOverview} from "../hooks/useReport";
import QuickInsightsSection from "../components/QuickInsightsSection";
const ReportsPage =() =>{
    const {data:healthData , isLoading:isHealthLoading} = useSchoolHealthOverview();


    return (
        <div className="bg-gray-50 min-h-screen p-6 "> 
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold ">Reports </h1>
                <p className="text-slate-500 text-sm font-semibold ">Analyze academic, attendance, and financial performance accros your school.</p>
            </div>
            <div>
            <ReportOverviewSection />
            </div>
            <div className="mt-6">
            <SchoolHealthCard
            data={healthData} isLoading={isHealthLoading} />
            </div>
            <div>
            <QuickInsightsSection />
            </div>
        </div>
    )
}


export default ReportsPage;