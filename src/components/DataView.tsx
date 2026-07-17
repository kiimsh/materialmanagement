import { Upload, FileSpreadsheet, CheckCircle, Database, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function DataView() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadStep(1);
    setTimeout(() => setUploadStep(2), 1500);
    setTimeout(() => setUploadStep(3), 3000);
    setTimeout(() => {
      setIsUploading(false);
      setUploadStep(0);
    }, 4500);
  };

  return (
    <div className="space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">데이터 인프라 관리</h1>
        <p className="text-slate-400 mt-1">Multi-Source 데이터 병합 및 무결성 검증</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass-panel p-8 flex flex-col items-center justify-center border-dashed border-2 border-slate-700 hover:border-primary/50 transition-all group">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Upload size={32} className="text-slate-400 group-hover:text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">외부 데이터 업로드</h3>
          <p className="text-sm text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
            ERP(SAP/Oracle), 자재 마스터, 재고 현황, PO/PR 현황 엑셀 파일을 드래그하여 업로드하세요.
          </p>
          
          {isUploading ? (
            <div className="w-full max-w-md space-y-4">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(uploadStep / 3) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-primary">
                  {uploadStep === 1 ? 'Parsing Excel...' : uploadStep === 2 ? 'Mapping Part Numbers...' : 'Finalizing Integration...'}
                </span>
                <span className="text-slate-500">{Math.round((uploadStep / 3) * 100)}%</span>
              </div>
            </div>
          ) : (
            <button 
              onClick={simulateUpload}
              className="px-8 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              파일 선택 (Excel, CSV)
            </button>
          )}
        </section>

        <section className="glass-panel p-8 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database size={24} className="text-primary" />
            Source Mapping Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <FileSpreadsheet size={20} className="text-success" />
                <div>
                  <h4 className="text-sm font-medium">자재 마스터 (Material Master)</h4>
                  <p className="text-[10px] text-slate-500 font-mono">LAST UPDATED: 2026-07-15 09:00</p>
                </div>
              </div>
              <CheckCircle size={18} className="text-success" />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <FileSpreadsheet size={20} className="text-success" />
                <div>
                  <h4 className="text-sm font-medium">실시간 재고 현황 (Current Stock)</h4>
                  <p className="text-[10px] text-slate-500 font-mono">LAST UPDATED: 2026-07-16 18:00</p>
                </div>
              </div>
              <CheckCircle size={18} className="text-success" />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <FileSpreadsheet size={20} className="text-warning" />
                <div>
                  <h4 className="text-sm font-medium">PO/PR 발주 현황 (Open Orders)</h4>
                  <p className="text-[10px] text-slate-500 font-mono">LAST UPDATED: 2026-07-14 14:30</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-warning/20 text-warning text-[10px] font-bold">
                <AlertTriangle size={12} />
                Stale
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-lg font-semibold">데이터 전처리 검증 로그</h2>
          <button className="text-xs text-slate-500 font-mono hover:text-white transition-colors">CLEAN LOGS</button>
        </div>
        <div className="p-6 font-mono text-[11px] text-slate-500 space-y-1 max-h-48 overflow-y-auto">
          <p>[18:30:15] <span className="text-success">INFO</span>: System standby. Ready for ingestion.</p>
          <p>[18:05:42] <span className="text-success">INFO</span>: Automated sync with SCM-DB completed. 1,402 records updated.</p>
          <p>[17:50:21] <span className="text-warning">WARN</span>: Null value detected in 'Lead Time' for Part K9-BOLT-M12. Using fallback (14d).</p>
          <p>[17:45:10] <span className="text-success">INFO</span>: EL expiration dates recalculated for 156 items.</p>
          <p>[15:20:33] <span className="text-danger">ERROR</span>: Failed to parse 'Production Plan' CSV. Header mismatch at Column 5.</p>
          <p>[09:00:00] <span className="text-success">INFO</span>: Morning batch processing started.</p>
        </div>
      </div>
    </div>
  );
}
