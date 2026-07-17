import { useState, useMemo } from 'react';
import { mockParts, generateForecast } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { TrendingUp, Calendar, AlertCircle, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function ForecastView() {
  const [selectedPartId, setSelectedPartId] = useState(mockParts[0].id);
  
  const selectedPart = useMemo(() => mockParts.find(p => p.id === selectedPartId), [selectedPartId]);
  const forecastData = useMemo(() => generateForecast(selectedPartId), [selectedPartId]);

  // Calculate depletion point (heuristic)
  const burnRate = selectedPart?.burnRate || 0;
  const currentStock = selectedPart?.currentStock || 0;
  const safetyStock = selectedPart?.safetyStock || 0;
  const monthsUntilSafety = (currentStock - safetyStock) / burnRate;
  const monthsUntilZero = currentStock / burnRate;

  return (
    <div className="space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">수요 예측 및 발주 권고</h1>
        <p className="text-slate-400 mt-1">Class A 품목 집중 관리 및 재고 고갈 시점 시뮬레이션</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-80 space-y-4">
          <h3 className="text-sm font-mono uppercase text-slate-500 tracking-wider">Class A Item List</h3>
          <div className="space-y-2">
            {mockParts.filter(p => p.class === 'A').map(part => (
              <button
                key={part.id}
                onClick={() => setSelectedPartId(part.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all",
                  selectedPartId === part.id 
                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(249,115,22,0.2)]" 
                    : "bg-surface/50 border-border hover:border-slate-500"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-sm font-bold">{part.partNumber}</span>
                  <span className="text-[10px] bg-slate-700 px-1.5 rounded uppercase">Class A</span>
                </div>
                <p className="text-xs text-slate-400 truncate">{part.name}</p>
              </button>
            ))}
          </div>

          <div className="glass-panel p-6 space-y-4 mt-8">
            <div className="flex items-center gap-2 text-warning">
              <ShoppingCart size={18} />
              <h4 className="text-sm font-bold uppercase">PR 발행 권고</h4>
            </div>
            <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <p className="text-xs text-warning-foreground leading-relaxed">
                리드타임({selectedPart?.leadTimeDays}일) 고려 시, <span className="font-bold underline">지금 즉시</span> 구매요구(PR) 발행이 필요합니다.
              </p>
            </div>
            <button className="w-full py-2 bg-primary text-background font-bold text-sm rounded-lg hover:bg-primary/90 transition-colors">
              ERP PR 연동
            </button>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6">
              <span className="text-[10px] text-slate-500 font-mono uppercase">Avg. Monthly Burn</span>
              <p className="text-2xl font-bold mt-1">{selectedPart?.burnRate} units</p>
              <div className="flex items-center gap-1 mt-2 text-success text-xs">
                <TrendingUp size={12} />
                <span>+4.2% vs Prev Year</span>
              </div>
            </div>
            <div className="glass-panel p-6">
              <span className="text-[10px] text-slate-500 font-mono uppercase">Est. Stockout (Safety)</span>
              <p className={cn(
                "text-2xl font-bold mt-1",
                monthsUntilSafety < 1 ? "text-danger" : "text-warning"
              )}>
                {monthsUntilSafety < 0 ? 'Exceeded' : `${monthsUntilSafety.toFixed(1)} Months`}
              </p>
              <div className="flex items-center gap-1 mt-2 text-slate-500 text-xs">
                <Calendar size={12} />
                <span>Target: 2026-09-15</span>
              </div>
            </div>
            <div className="glass-panel p-6">
              <span className="text-[10px] text-slate-500 font-mono uppercase">Lead Time Buffer</span>
              <p className="text-2xl font-bold mt-1">{(selectedPart!.leadTimeDays / 30).toFixed(1)} Months</p>
              <div className="flex items-center gap-1 mt-2 text-danger text-xs">
                <AlertCircle size={12} />
                <span>Risk: Supply chain lag</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 h-[450px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-semibold text-lg">재고 소모 및 수요 예측 시계열 (12개월)</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-primary"></div> <span className="text-[11px] text-slate-400">실제 소모</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-slate-500 border-dashed border-t"></div> <span className="text-[11px] text-slate-400">예측 수요</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-danger"></div> <span className="text-[11px] text-slate-400">안전 재고</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  label={{ value: 'Units', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 10 } }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: '#f97316' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#94a3b8" 
                  fillOpacity={1} 
                  fill="url(#colorPred)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <ReferenceLine y={selectedPart?.safetyStock ? selectedPart.safetyStock / 6 : 0} stroke="#ef5350" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}
