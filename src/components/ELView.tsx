import { mockParts, mockELs } from '../data/mockData';
import { ShieldAlert, Info, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '../lib/utils';

export default function ELView() {
  const today = new Date();

  return (
    <div className="space-y-8 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">EL(수출 승인) 관리</h1>
          <p className="text-slate-400 mt-1">국제 규제 준수 및 재신청 시점 역산 관리</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 border border-border rounded-lg text-sm hover:bg-white/10 transition-colors">전체 보고서</button>
          <button className="px-4 py-2 bg-primary text-background font-semibold rounded-lg text-sm hover:bg-primary/90 transition-colors">새 EL 등록</button>
        </div>
      </header>

      <section className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-border bg-white/[0.02] flex items-center justify-between">
          <h2 className="text-lg font-semibold">EL 역산 타임라인 현황</h2>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-danger"></div> 만료/긴급</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-warning"></div> 재신청 권고</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success"></div> 정상</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[11px] font-mono uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">부품 번호 / 명칭</th>
                <th className="px-6 py-3">수출국</th>
                <th className="px-6 py-3">만료일</th>
                <th className="px-6 py-3 text-center">심사/버퍼</th>
                <th className="px-6 py-3">재신청 권고일</th>
                <th className="px-6 py-3 text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockELs.map((el, idx) => {
                const part = mockParts.find(p => p.id === el.partId);
                const expirationDate = new Date(el.expirationDate);
                const diff = differenceInDays(expirationDate, today);
                
                // Re-application date = Expiration - (Review + Buffer)
                const totalLead = el.reviewPeriodDays + el.bufferDays;
                const reApplyDate = format(new Date(expirationDate.getTime() - totalLead * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

                return (
                  <motion.tr 
                    key={el.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-medium text-sm group-hover:text-primary transition-colors">{part?.partNumber}</span>
                        <span className="text-[11px] text-slate-500">{part?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{el.country}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono">{el.expirationDate}</span>
                        <span className={cn(
                          "text-[10px] font-bold",
                          diff < 30 ? "text-danger" : diff < 90 ? "text-warning" : "text-slate-500"
                        )}>
                          D-{diff}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-slate-400">
                        <span>{el.reviewPeriodDays}d</span>
                        <span className="text-slate-600">|</span>
                        <span>{el.bufferDays}d</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-primary">{reApplyDate}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {el.status === 'Expired' && <ShieldAlert size={16} className="text-danger" />}
                        {el.status === 'Expiring' && <Clock size={16} className="text-warning" />}
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter",
                          el.status === 'Expired' ? "bg-danger/20 text-danger border border-danger/30" : 
                          el.status === 'Expiring' ? "bg-warning/20 text-warning border border-warning/30" : 
                          "bg-success/20 text-success border border-success/30"
                        )}>
                          {el.status}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-primary">
          <h3 className="text-sm font-medium text-slate-400 mb-2">행정 버퍼 가이드</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            방산 수출 통제 규정에 따라 최소 30일의 행정 버퍼 기간을 설정할 것을 권고합니다. 특히 미주 지역(ITAR/EAR)의 경우 심사 지연이 빈번하므로 주의가 필요합니다.
          </p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-warning">
          <h3 className="text-sm font-medium text-slate-400 mb-2">심사 소요 기간 최신화</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            최근 6개월간의 실제 승인 기간 데이터를 기반으로 자동 업데이트됩니다. 현재 독일향 엔진 부품의 경우 심사 기간이 15일 증가 추세에 있습니다.
          </p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-danger">
          <h3 className="text-sm font-medium text-slate-400 mb-2">긴급 조치 사항</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            만료 30일 미만 항목은 즉시 구매팀 및 규제준수팀에 자동 알림이 발송되며, 생산 스케줄 조정 회의 안건으로 상정됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
