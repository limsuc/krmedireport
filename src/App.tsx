/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Activity, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  Database,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MedicalDevice {
  id: number;
  name: string;
  company: string;
  grade: string;
  date: string;
  hira: string;
  price: string;
  category: string;
}

interface DashboardSummary {
  total: number;
  topCategory: string;
  highRisk: number;
  insuranceRate: number;
}

export default function App() {
  const [data, setData] = useState<MedicalDevice[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const months = [
    { label: '2026년 05월', value: '2026-05' },
    { label: '2026년 04월', value: '2026-04' },
    { label: '2026년 03월', value: '2026-03' },
    { label: '2026년 02월', value: '2026-02' },
    { label: '2026년 01월', value: '2026-01' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/monthly-report?month=${selectedMonth}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        
        if (json && json.status === 'success') {
          setData(json.data || []);
          setSummary(json.summary || null);
        } else {
          console.error('Invalid API response format:', json);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation - Geometric Balance Style */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:rotate-12 transition-transform duration-300">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900">MediReport</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink active>Home Dashboard</NavLink>
            <NavLink>Data Analysis</NavLink>
            <NavLink>System Logs</NavLink>
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm ring-1 ring-slate-200" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-14 animate-in fade-in duration-700">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">System MVP</span>
              <div className="h-px bg-slate-200 flex-1 min-w-[40px] md:hidden" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              월간 의료기기 <br className="sm:hidden" /> 허가 리포트
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-xl">
              식품의약품안전처 & 건강보험심사평가원의 데이터를 실시간으로 연계하여 <br className="hidden lg:block" /> 
              보험 급여 현황과 인허가 트렌드를 분석하는 통합 대시보드입니다.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center hover:border-blue-400 transition-all cursor-pointer group w-full sm:w-[220px]"
              >
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Calendar size={10} /> Select Period</span>
                  <ChevronDown size={12} className={cn("transition-transform", isMonthPickerOpen && "rotate-180")} />
                </span>
                <span className="font-black text-blue-600 text-lg tracking-tight tabular-nums flex items-center justify-between">
                  {months.find(m => m.value === selectedMonth)?.label}
                </span>
              </button>

              <AnimatePresence>
                {isMonthPickerOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-20"
                  >
                    {months.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => {
                          setSelectedMonth(m.value);
                          setIsMonthPickerOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-5 py-3 text-sm font-bold transition-colors hover:bg-slate-50",
                          selectedMonth === m.value ? "text-blue-600 bg-blue-50/50" : "text-slate-600"
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl shadow-slate-200 flex items-center justify-center gap-2 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-95 group">
              <Download size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-sm tracking-wide">리포트 다운로드</span>
            </button>
          </div>
        </header>

        {/* Stats Grid - Celebrated Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            icon={<FileText size={22}/>} 
            label="신규 허가 건수" 
            value={summary ? summary.total + "건" : "-"} 
            trend="+12.4%"
            isPositive
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard 
            icon={<TrendingUp size={22}/>} 
            label="최다 허가 분야" 
            value={summary?.topCategory || "-"} 
            trend="Softwares"
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />
          <StatCard 
            icon={<ShieldCheck size={22}/>} 
            label="4등급 (고위험)" 
            value={summary ? summary.highRisk + "건" : "-"} 
            trend="-2 items"
            isPositive={false}
            color="text-rose-600"
            bgColor="bg-rose-50"
          />
          <StatCard 
            icon={<CreditCard size={22}/>} 
            label="보험 등재율" 
            value={summary ? summary.insuranceRate + "%" : "-"} 
            trend="+5.4% YoY"
            isPositive
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Table Section - The core data-grid */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Database className="text-blue-600" size={24} />
                {months.find(m => m.value === selectedMonth)?.label} 상세 허가 품목 리스트
              </h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-9">
                Latest MFDS & HIRA Integrated Records
              </p>
            </div>

            <div className="flex items-center space-x-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="품목명 또는 업체명으로 필터링..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 placeholder:text-slate-300 transition-all shadow-sm"
                />
              </div>
              <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm hover:shadow-md">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Medical Product & Manufacturer</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Benefit Status</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Price Cap (KRW)</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredData.map((item) => (
                      <motion.tr 
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-slate-50/80 transition-all cursor-pointer relative"
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-300 uppercase tracking-tighter mb-0.5">PERMIT</span>
                            <span className="text-[13px] font-black text-slate-900 tabular-nums tracking-tight">{item.date}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{item.name}</span>
                              <ArrowUpRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.company}</span>
                              <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                              <span className={cn(
                                "text-[9px] px-2 py-0.5 rounded font-black tracking-widest uppercase transition-all",
                                getGradeStyles(item.grade)
                              )}>
                                {item.grade}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-center">
                          <span className={cn(
                            "inline-flex items-center justify-center min-w-[60px] px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase",
                            item.hira === '급여' 
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                              : "bg-slate-100 text-slate-400"
                          )}>
                            {item.hira}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                          <span className="text-sm font-black text-slate-900 tabular-nums tracking-tighter">
                            {item.price}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-200 group-hover:text-blue-600 group-hover:shadow-md transition-all">
                            <ChevronRight size={18} strokeWidth={3} />
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <Search size={32} />
                          </div>
                          <p className="font-black text-slate-300 uppercase tracking-widest text-sm">No Results matching your search</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer / Pagination - Geometric Style */}
            <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page 01 of 12</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300">Prev</button>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm border-b-4 active:border-b-0 active:translate-y-0.5 transition-all">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// NavLink Helper
function NavLink({ children, active = false }: { children: React.ReactNode, active?: boolean }) {
  return (
    <button className={cn(
      "text-xs font-black uppercase tracking-widest transition-all relative py-1",
      active ? "text-slate-900" : "text-slate-400 hover:text-blue-600"
    )}>
      {children}
      {active && <motion.div layoutId="navline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
    </button>
  );
}

// Subcomponents - Geometric Balance Refinement
function StatCard({ icon, label, value, trend, isPositive, color, bgColor }: { icon: React.ReactNode, label: string, value: string, trend: string, isPositive?: boolean, color: string, bgColor: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 group transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className={cn(bgColor, color, "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12")}>
          {icon}
        </div>
        <div className={cn(
          "px-2 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase",
          isPositive === true ? "bg-emerald-50 text-emerald-600" : isPositive === false ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400"
        )}>
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">{value}</p>
      </div>
      
      {/* Background Decor - Geometric Pattern */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

function getGradeStyles(grade: string) {
  switch (grade) {
    case '1등급': return 'bg-slate-100 text-slate-400 border border-slate-200';
    case '2등급': return 'bg-blue-50 text-blue-600 border border-blue-200';
    case '3등급': return 'bg-amber-50 text-amber-600 border border-amber-200';
    case '4등급': return 'bg-rose-50 text-rose-600 border border-rose-200';
    default: return 'bg-slate-100 text-slate-400';
  }
}
