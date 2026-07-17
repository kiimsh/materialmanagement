import { mockParts, mockELs } from '../data/mockData';
import { AlertCircle, Package, ShieldCheck, Box, ShieldAlert, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function DashboardView() {
  const stats = [
    { label: '전체 자재', value: mockParts.length, icon: Package, color: 'text-primary' },
    { label: '결품 위험 (Red)', value: mockParts.filter(p => p.status === 'Red').length, icon: AlertCircle, color: 'text-danger' },
    { label: 'EL 관리 대상', value: mockELs.length, icon: ShieldCheck, color: 'text-success' },
    { label: '총 재고 가치', value: `$${(mockParts.reduce((acc, p) => acc + (p.currentStock * p.unitPrice), 0) / 1000000).toFixed(1)}M`, icon: Box, color: 'text-warning' },
  ];

  return (
    <div className="space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">종합 대시보드</h1>
        <p className="text-slate-400 mt-1">K9 자주포 생산 자재 현황 및 리스크 요약</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded uppercase tracking-wider">Live</span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass-panel overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle size={20} className="text-danger" />
              결품 위험 및 관찰 품목
            </h2>
            <button className="text-xs text-primary hover:underline">상세보기</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Part Number</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Current</th>
                  <th className="px-6 py-3 text-right">Safety</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockParts.filter(p => p.status !== 'Green').map(part => (
                  <tr key={part.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-medium text-sm">{part.partNumber}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[200px]">{part.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                        part.status === 'Red' ? "bg-danger/20 text-danger" : "bg-warning/20 text-warning"
                      )}>
                        {part.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm">{part.currentStock}</td>
                    <td className="px-6 py-4 text-right font-mono text-sm text-slate-400">{part.safetyStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-panel overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" />
              EL(수출승인) 만료 임박
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {mockELs.filter(el => el.status !== 'Normal').map(el => {
              const part = mockParts.find(p => p.id === el.partId);
              return (
                <div key={el.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded flex items-center justify-center shrink-0",
                      el.status === 'Expired' ? "bg-danger/20 text-danger" : "bg-warning/20 text-warning"
                    )}>
                      {el.status === 'Expired' ? <ShieldAlert size={20} /> : <TrendingUp size={20} />}
                    </div>
                    <div>
                      <h4 className="font-mono text-sm font-semibold">{part?.partNumber}</h4>
                      <p className="text-xs text-slate-500">{el.country} | 만료: {el.expirationDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-xs font-bold",
                      el.status === 'Expired' ? "text-danger" : "text-warning"
                    )}>
                      {el.status === 'Expired' ? '만료됨' : 'D-45'}
                    </span>
                    <p className="text-[10px] text-slate-500 uppercase font-mono">Urgent</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
