import { FileText, Download } from "lucide-react";
import PageHeader from "../../../shared/components/dashboard/PageHeader";
import SectionCard from "../../../shared/components/dashboard/SectionCard";
import { documents } from "../data/parentMockData";

const ParentDocumentsPage = () => {
  return (
    <div className="p-6 w-full bg-gray-50 min-h-full">
      <PageHeader
        icon={FileText}
        title="Documents"
        subtitle="Access report cards, certificates, and forms"
        accent="violet"
      />

      <SectionCard badge={`${documents.length} documents`}>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-slate-100 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 bg-violet-100 rounded-full">
                  <FileText className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-800">{doc.name}</p>
                  <p className="text-xs text-slate-500">
                    {doc.type} · {doc.date}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default ParentDocumentsPage;
