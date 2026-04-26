
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Share2, Mail, TrendingUp, Calendar, Info, CheckCircle2, ShieldCheck, Zap, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useScans } from '@/hooks/useScans';
import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";

const ReportsPage = () => {
  const { scans } = useScans();
  const { profile } = useProfile();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showFullReport, setShowFullReport] = useState(false);

  const dummyReports = [
    {
      title: "Hormonal Health Summary",
      date: "Apr 20, 2026",
      type: "Hormonal Analysis",
      status: "Ready",
      insights: [
        "Risk Indicator: 42%",
        "Skin Status: Improving",
        "Phase: Follicular"
      ]
    },
    {
      title: "AI Facial Integration",
      date: "Apr 15, 2026",
      type: "Mirror Scan",
      status: "Ready",
      insights: [
        "Acne Severity: Moderate",
        "Facial Hair Index: Low",
        "Inflammation: Reduced"
      ]
    },
    {
      title: "Initial Wellness Baseline",
      date: "Apr 10, 2026",
      type: "Comprehensive",
      status: "Archive",
      insights: [
        "Baseline Score: 68%",
        "Internal Health: Normal",
        "Initial Assessment Complete"
      ]
    }
  ];

  const normalizedProfileScore = (profile?.pcos_risk_score ?? 0) / 6 * 100;

  const reports = scans.length > 0
    ? scans.map((scan, index) => {
      const isSweat = scan.facial_hair_score === 0 && scan.acne_score > 0;
      const faceAvg = !isSweat ? (scan.acne_score + scan.facial_hair_score + scan.pigmentation_score) / 3 : 20;
      const sweatAvg = isSweat ? scan.acne_score : 20;

      const overall = Math.round((faceAvg + sweatAvg + normalizedProfileScore) / 3);

      return {
        title: isSweat ? `Health Strip Check #${scans.length - index}` : `Mirror Face Scan #${scans.length - index}`,
        date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: isSweat ? "Strip Test" : "Face Scan",
        status: "Done",
        insights: [
          `Overall Health Score: ${100 - overall}%`,
          `PCOS Risk Level: ${overall}%`,
          `Status: Analyzed`
        ],
        data: { ...scan, overall, faceAvg, sweatAvg, recommendations: ["Maintain consistent monitoring to track hormonal shifts.", "Incorporate anti-inflammatory foods into your daily regimen."] }
      };
    })
    : dummyReports;

  const upcomingReports = [
    { title: "Monthly Hormone Summary", dueDate: "May 1, 2026" },
    { title: "Quarterly Wellness Review", dueDate: "June 15, 2026" }
  ];

  const dummyChartData = [
    { date: 'Apr 18', overall: 48, acne: 45 },
    { date: 'Apr 19', overall: 45, acne: 40 },
  ];

  const latestFaceScan = scans.find(s => s.facial_hair_score > 0);
  const latestStripScan = scans.find(s => s.facial_hair_score === 0 && s.acne_score > 0);
  
  const getCyclePhase = () => {
    if (!(profile as any)?.last_period_date) return 'Not Tracked';
    const lastDate = new Date((profile as any).last_period_date);
    const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    const cycle = parseInt(profile?.cycle_length?.split('-')[1] || '28');
    
    if (diffDays < 6) return 'Menstruation';
    if (diffDays < 14) return 'Follicular Phase';
    if (diffDays < 17) return 'Ovulation Window';
    if (diffDays < cycle) return 'Luteal Phase';
    return 'Cycle Overdue';
  };

  const chartData = scans.length > 0
    ? scans.slice(0, 15).map(scan => {
      const isSweat = scan.facial_hair_score === 0 && scan.acne_score > 0;
      const faceAvg = !isSweat ? (scan.acne_score + scan.facial_hair_score + scan.pigmentation_score) / 3 : 25;
      const sweatAvg = isSweat ? scan.acne_score : 25;
      const combinedRisk = Math.round((faceAvg + sweatAvg + normalizedProfileScore) / 3);

      return {
        date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        risk: combinedRisk,
        face: Math.round(faceAvg),
        sweat: Math.round(sweatAvg),
        wellness: 100 - combinedRisk
      };
    }).reverse()
    : dummyChartData;

  if (showFullReport) {
    return (
      <div className="min-h-screen bg-white pb-24 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 p-4 flex justify-between items-center">
           <Button variant="ghost" size="sm" onClick={() => setShowFullReport(false)} className="text-slate-400 hover:text-slate-900 font-bold">
              <X className="w-5 h-5 mr-2" /> Close Report
           </Button>
           <Button variant="outline" size="sm" onClick={() => window.print()} className="border-purple-200 text-purple-600 font-bold">
              <Download className="w-4 h-4 mr-2" /> Save PDF
           </Button>
        </div>

        <div className="p-6 md:p-12 max-w-4xl mx-auto">
           <div className="flex justify-between items-center border-b-4 border-purple-600 pb-8 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-purple-100 p-2 shadow-sm">
                  <img src="/images/logo.png" alt="GYNORA" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-slate-800 tracking-tighter">GYNORA</h1>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Health Summary Report</h2>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient</p>
                      <p className="text-lg font-black text-slate-800">{profile?.full_name || 'Wellness User'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Cycle Phase</p>
                      <p className="text-lg font-black text-orange-400">{getCyclePhase()}</p>
                    </div>
                 </div>
              </div>
              <div className="bg-sky-500 p-6 rounded-[32px] text-white flex flex-col justify-center text-center shadow-lg shadow-sky-100">
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-70 mb-1">Overall Risk</p>
                 <p className="text-4xl font-black tracking-tighter text-white">
                   {scans.length > 0 ? Math.max(0, Math.min(100, Math.round(((scans[0].acne_score + scans[0].facial_hair_score + scans[0].pigmentation_score) / 3) - (scans[0].overall_improvement || 0)))) : '42'}%
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="p-8 bg-purple-50/50 rounded-[40px] border border-purple-100 shadow-sm">
                 <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.4em] mb-6 flex items-center">
                   <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div> Mirror Face Scan Result
                 </h3>
                 {latestFaceScan ? (
                   <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white/60 rounded-3xl border border-purple-50 text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Acne</p>
                        <p className="text-2xl font-black text-purple-600">{latestFaceScan.acne_score}%</p>
                      </div>
                      <div className="p-4 bg-white/60 rounded-3xl border border-purple-50 text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Hair</p>
                        <p className="text-2xl font-black text-purple-600">{latestFaceScan.facial_hair_score}%</p>
                      </div>
                      <div className="p-4 bg-white/60 rounded-3xl border border-purple-50 text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Spots</p>
                        <p className="text-2xl font-black text-purple-600">{latestFaceScan.pigmentation_score}%</p>
                      </div>
                   </div>
                 ) : <p className="text-xs text-slate-400 italic text-center p-8">No face scan data recorded.</p>}
              </div>


              <div className="p-8 bg-emerald-50/50 rounded-[40px] border border-emerald-100 shadow-sm">
                 <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-6 flex items-center">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div> Health Strip Check
                 </h3>
                 {latestStripScan ? (
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/60 rounded-3xl border border-cyan-50 flex items-center space-x-4">
                         <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Zap className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stress (Cortisol)</p>
                            <p className="text-xl font-black text-slate-800">{Math.round(latestStripScan.acne_score * 0.8)}%</p>
                         </div>
                      </div>
                      <div className="p-4 bg-white/60 rounded-3xl border border-cyan-50 flex items-center space-x-4">
                         <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Info className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sugar (Glucose)</p>
                            <p className="text-xl font-black text-slate-800">{Math.round(latestStripScan.acne_score * 1.1)}%</p>
                         </div>
                      </div>
                      <div className="p-4 bg-white/60 rounded-3xl border border-cyan-50 flex items-center space-x-4">
                         <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <TrendingUp className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">pH Balance</p>
                            <p className="text-xl font-black text-slate-800">{Math.min(100, Math.round(latestStripScan.acne_score * 0.9))}%</p>
                         </div>
                      </div>
                      <div className="p-4 bg-white/60 rounded-3xl border border-cyan-50 flex items-center space-x-4">
                         <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fluid (Salt)</p>
                            <p className="text-xl font-black text-slate-800">{Math.round(latestStripScan.acne_score * 0.7)}%</p>
                         </div>
                      </div>
                   </div>
                 ) : <p className="text-xs text-slate-400 italic text-center p-8">No health strip data recorded.</p>}
              </div>
           </div>

           <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">AI Coach Recommendations</h4>
              <p className="text-sm italic leading-relaxed text-slate-600">
                 "{scans[0]?.recommendations?.[0] || 'Maintain regular tracking for deeper clinical insights.'}"
              </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6 pb-20 no-print">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl border border-purple-50 p-2.5">
          <img src="/images/logo.png" alt="GYNORA" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Health Reports</h2>
        <p className="text-gray-500 text-sm font-medium mt-1">Track your progress and share with your doctor</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Button variant="outline" className="h-20 flex-col space-y-2 border-purple-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all" onClick={() => setShowFullReport(true)}>
          <FileText className="w-5 h-5 text-purple-600" />
          <span className="text-[10px] font-black uppercase tracking-widest">Full Dossier</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2 border-purple-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all" onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert('Report link copied to clipboard!');
        }}>
          <Share2 className="w-5 h-5 text-purple-600" />
          <span className="text-[10px] font-black uppercase tracking-widest">Share Link</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2 border-purple-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all" onClick={() => {
          const doctorSearchLink = "https://www.justdial.com/Delhi/Gynaecologist-Obstetrician-Doctors-Near-Me-in-Rohini-Sector-7/nct-10551087?trkid=33349-delhi&term=gynac&asnm=1&cbflg=2";
          window.location.href = `mailto:doctor@example.com?subject=Gynora Health Report - ${profile?.full_name || 'User'}&body=Hello Doctor, here is my latest health update and PCOS scan analysis. For reference, I found local specialists here: ${doctorSearchLink}`;
        }}>
          <Mail className="w-5 h-5 text-purple-600" />
          <span className="text-[10px] font-black uppercase tracking-widest">Email Dr.</span>
        </Button>
      </div>

      {/* Available Reports */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 px-2">Clinical Archive</h3>
        <div className="space-y-4">
          {reports.length > 0 ? reports.map((report, index) => (
            <Card key={index} className="p-6 rounded-3xl border border-purple-50 shadow-lg shadow-purple-50/30 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500 opacity-50"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-black text-slate-800 text-lg tracking-tight leading-none">{report.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{report.date} • {report.type}</p>
                  </div>
                  <span className="px-3 py-1.5 bg-pink-50 text-pink-600 text-[9px] rounded-xl font-black uppercase tracking-widest border border-pink-100">
                    {report.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {report.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-center text-[11px] text-slate-600 font-bold bg-purple-50/50 p-3 rounded-xl border border-purple-100/30">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                      {insight}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <Button size="sm" className="flex-1 h-11 bg-white border-purple-100 text-purple-600 hover:bg-purple-50 rounded-xl font-black text-[10px] uppercase tracking-widest" onClick={() => setSelectedReport(report)}>
                    View Full Details
                  </Button>
                </div>
              </div>
            </Card>
          )) : (
            <div className="p-12 bg-white rounded-3xl border border-dashed border-purple-200 text-center">
              <FileText className="w-12 h-12 text-purple-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold text-sm">No clinical reports available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Overview Chart */}
      <Card className="p-8 rounded-3xl border border-purple-50 shadow-xl shadow-purple-50/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Clinical Progress</h3>
            <p className="text-lg font-black text-slate-800 tracking-tight">Wellness Trajectory</p>
          </div>
          <TrendingUp className="w-6 h-6 text-purple-600" />
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 20px 50px rgba(124,58,237,0.15)',
                  padding: '12px'
                }}
                itemStyle={{ fontWeight: 800, fontSize: '11px', textTransform: 'uppercase' }}
                labelStyle={{ fontWeight: 800, fontSize: '12px', marginBottom: '4px', color: '#1e293b' }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: '10px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  paddingTop: '20px'
                }}
              />
                <Line type="monotone" dataKey="wellness" name="Wellness Index" stroke="#a855f7" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="face" name="Skin Mirror" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="sweat" name="Biomarkers" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-white rounded-3xl border border-purple-100 shadow-sm">
            <div className="text-3xl font-black text-purple-600 mb-1 tracking-tighter">
              {scans.length > 0
                ? Math.max(0, Math.min(100, Math.round(((scans[0].acne_score + scans[0].facial_hair_score + scans[0].pigmentation_score) / 3) - (scans[0].overall_improvement || 0))))
                : '82'}%
            </div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Wellness Score</p>
          </div>
          <div className="text-center p-5 bg-gradient-to-br from-pink-50 to-white rounded-3xl border border-pink-100 shadow-sm">
            <div className="text-3xl font-black text-pink-600 mb-1 tracking-tighter">
              {scans.length > 0 ? scans.length : '7'}
            </div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Total Scans</p>
          </div>
        </div>
      </Card>

      {/* Upcoming Reports */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-600" />
          Upcoming Reports
        </h3>
        <div className="space-y-3">
          {upcomingReports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-50">
              <div>
                <p className="font-medium text-sm">{report.title}</p>
                <p className="text-xs text-gray-600">Due: {report.dueDate}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-purple-600">
                Set Reminder
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Doctor Sync */}
      <Card className="p-6 gradient-gentle text-white">
        <h3 className="font-semibold mb-2">Sync with Your Doctor</h3>
        <p className="text-sm opacity-90 mb-4">
          Share your progress reports directly with your healthcare provider or find specialists in your area.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => {
            window.location.href = `mailto:doctor@example.com?subject=Gynora Health Report - ${profile?.full_name || 'User'}&body=Hello Doctor, here is my latest health update and PCOS scan analysis.`;
          }}>
            Share via Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/40 hover:bg-white/30 text-white"
            onClick={() => window.open("https://www.justdial.com/Delhi/Gynaecologist-Obstetrician-Doctors-Near-Me-in-Rohini-Sector-7/nct-10551087?trkid=33349-delhi&term=gynac&asnm=1&cbflg=2", "_blank")}
          >
            Find Specialists
          </Button>
        </div>
      </Card>
    </div> 

    {/* Details Modal */}
    <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
      <DialogContent className="max-w-md w-[95%] rounded-[32px] border-0 p-0 overflow-hidden shadow-2xl bg-white no-print">
        <div className="relative">
          {/* Header Gradient */}
          <div className="h-32 bg-gradient-to-br from-purple-600 to-pink-500 p-6 flex flex-col justify-end">
             <button 
               onClick={() => setSelectedReport(null)}
               className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
             >
               <X className="w-4 h-4" />
             </button>
             <h3 className="text-white font-black text-xl tracking-tight">{selectedReport?.title}</h3>
             <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{selectedReport?.date} • {selectedReport?.type}</p>
          </div>

          <div className="p-6 space-y-6">
             {/* Scores Grid */}
             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
                   <p className="text-2xl font-black text-purple-600">{100 - (selectedReport?.data?.overall || 0)}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">PCOS Risk</p>
                   <p className="text-2xl font-black text-pink-500">{selectedReport?.data?.overall || 0}%</p>
                </div>
             </div>

             {/* Metric Breakdown */}
             <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                   <Zap className="w-3 h-3 mr-2 text-yellow-500" /> Metric Breakdown
                </h4>
                <div className="space-y-2">
                   {selectedReport?.data?.facial_hair_score > 0 || selectedReport?.type === "Face Scan" ? (
                     <>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50/50">
                           <span className="text-xs font-bold text-slate-600">Acne/Pimple Level</span>
                           <span className="text-xs font-black text-purple-600">{selectedReport?.data?.acne_score}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50/50">
                           <span className="text-xs font-bold text-slate-600">Facial Hair Level</span>
                           <span className="text-xs font-black text-purple-600">{selectedReport?.data?.facial_hair_score}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50/50">
                           <span className="text-xs font-bold text-slate-600">Skin Dark Spots</span>
                           <span className="text-xs font-black text-purple-600">{selectedReport?.data?.pigmentation_score}%</span>
                        </div>
                     </>
                   ) : (
                     <>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-cyan-50/50">
                           <span className="text-xs font-bold text-slate-600">Stress Signs (Cortisol)</span>
                           <span className="text-xs font-black text-cyan-600">{Math.round((selectedReport?.data?.acne_score || 0) * 0.8)}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-cyan-50/50">
                           <span className="text-xs font-bold text-slate-600">Sugar Signs (Glucose)</span>
                           <span className="text-xs font-black text-cyan-600">{Math.round((selectedReport?.data?.acne_score || 0) * 1.1)}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-cyan-50/50">
                           <span className="text-xs font-bold text-slate-600">pH Balance</span>
                           <span className="text-xs font-black text-cyan-600">{Math.min(100, Math.round((selectedReport?.data?.acne_score || 0) * 0.9))}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-cyan-50/50">
                           <span className="text-xs font-bold text-slate-600">Fluid Balance (Salt)</span>
                           <span className="text-xs font-black text-cyan-600">{Math.round((selectedReport?.data?.acne_score || 0) * 0.7)}%</span>
                        </div>
                     </>
                   )}
                </div>
             </div>

             {/* AI Recommendations */}
             <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                   <ShieldCheck className="w-3 h-3 mr-2 text-green-500" /> AI Coach Guidance
                </h4>
                <div className="p-4 rounded-2xl bg-green-50/30 border border-green-100 text-xs text-slate-600 leading-relaxed italic font-medium">
                   {selectedReport?.data?.recommendations?.[0] || "Continue tracking your progress for deeper insights."}
                </div>
             </div>

             <Button 
               onClick={() => setSelectedReport(null)}
               className="w-full h-14 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl"
             >
               Close Analysis
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* HIDDEN PRINTABLE REPORT TEMPLATE */}
      <div id="printable-report-container" className="hidden print:block p-12 bg-white text-slate-900 font-sans border-[12px] border-purple-50">
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-purple-600 pb-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-purple-100 p-2 shadow-sm">
              <img src="/images/logo.png" alt="GYNORA" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-800 tracking-tighter">GYNORA</h1>
              <p className="text-xs font-black text-pink-500 uppercase tracking-[0.4em]">Aesthetic Wellness Systems</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Health Summary Report</h2>
            <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Report Date: {new Date().toLocaleDateString()}</p>
            <p className="text-xs text-purple-400 font-bold uppercase tracking-[0.3em] mt-1">ID: GYN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>

        {/* Profile & Menstrual Section */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="col-span-2 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center">
             <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-xl font-black text-slate-800">{profile?.full_name || 'Wellness User'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Age / Weight</p>
                  <p className="text-xl font-black text-slate-800">{profile?.age || 'N/A'} yrs • {profile?.weight || 'N/A'}kg</p>
                </div>
             </div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 rounded-3xl text-white flex flex-col items-center justify-center text-center shadow-lg">
             <Calendar className="w-6 h-6 mb-2 opacity-50" />
             <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Cycle Phase</p>
             <p className="text-lg font-black mb-2">{getCyclePhase()}</p>
             <div className="pt-2 border-t border-white/20 w-full">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Next Prediction</p>
                <p className="text-xs font-bold">
                  {(() => {
                    if (!(profile as any)?.last_period_date) return 'TBD';
                    const lastDate = new Date((profile as any).last_period_date);
                    const cycle = parseInt(profile?.cycle_length?.split('-')[1] || '28');
                    const nextDate = new Date(lastDate);
                    nextDate.setDate(lastDate.getDate() + cycle);
                    return nextDate.toLocaleDateString();
                  })()}
                </p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-10">
          {/* Section 1: Mirror Face Scan */}
          <div className="space-y-6">
             <h3 className="text-[12px] font-black text-purple-600 uppercase tracking-[0.3em] flex items-center border-b border-purple-100 pb-2">
               <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div> Mirror Face Scan
             </h3>
             {latestFaceScan ? (
               <div className="space-y-4">
                  <div className="flex justify-between p-4 bg-purple-50/50 rounded-2xl">
                     <span className="font-bold text-slate-700">Acne/Pimple Level</span>
                     <span className="font-black text-purple-600">{latestFaceScan.acne_score}%</span>
                  </div>
                  <div className="flex justify-between p-4 bg-purple-50/50 rounded-2xl">
                     <span className="font-bold text-slate-700">Facial Hair Level</span>
                     <span className="font-black text-purple-600">{latestFaceScan.facial_hair_score}%</span>
                  </div>
                  <div className="flex justify-between p-4 bg-purple-50/50 rounded-2xl">
                     <span className="font-bold text-slate-700">Skin Dark Spots</span>
                     <span className="font-black text-purple-600">{latestFaceScan.pigmentation_score}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Latest scan: {new Date(latestFaceScan.created_at).toLocaleDateString()}</p>
               </div>
             ) : (
               <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center text-slate-400 text-sm">
                 Face scan data pending
               </div>
             )}
          </div>

          {/* Section 2: Health Strip Check */}
          <div className="space-y-6">
             <h3 className="text-[12px] font-black text-cyan-600 uppercase tracking-[0.3em] flex items-center border-b border-cyan-100 pb-2">
               <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div> Hormonal Health Strips
             </h3>
             {latestStripScan ? (
               <div className="space-y-4">
                  <div className="flex justify-between p-4 bg-cyan-50/50 rounded-2xl">
                     <span className="font-bold text-slate-700">Cortisol (Stress)</span>
                     <span className="font-black text-cyan-600">{Math.round(latestStripScan.acne_score * 0.8)}%</span>
                  </div>
                  <div className="flex justify-between p-4 bg-cyan-50/50 rounded-2xl">
                     <span className="font-bold text-slate-700">Glucose (Sugar)</span>
                     <span className="font-black text-cyan-600">{Math.round(latestStripScan.acne_score * 1.1)}%</span>
                  </div>
                  <div className="flex justify-between p-4 bg-cyan-50/50 rounded-2xl">
                     <span className="font-bold text-slate-700">pH Balance</span>
                     <span className="font-black text-cyan-600">{Math.min(100, Math.round(latestStripScan.acne_score * 0.9))}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Latest test: {new Date(latestStripScan.created_at).toLocaleDateString()}</p>
               </div>
             ) : (
               <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center text-slate-400 text-sm">
                 Health strip test pending
               </div>
             )}
          </div>
        </div>

        {/* Aggregate Summary */}
        <div className="bg-slate-900 p-10 rounded-[40px] text-white">
           <div className="flex justify-between items-center mb-8">
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400 mb-2">Aggregate PCOS Risk</h4>
                 <p className="text-6xl font-black tracking-tighter">
                   {scans.length > 0 ? Math.max(0, Math.min(100, Math.round(((scans[0].acne_score + scans[0].facial_hair_score + scans[0].pigmentation_score) / 3) - (scans[0].overall_improvement || 0)))) : '42'}%
                 </p>
              </div>
              <div className="text-right max-w-sm">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">AI Coach Guidance</p>
                 <p className="text-sm italic leading-relaxed text-slate-300">
                    "{scans[0]?.recommendations?.[0] || 'Continue regular monitoring for higher clinical accuracy.'}"
                 </p>
              </div>
           </div>
           <div className="mt-12 pt-8 border-t border-slate-100 text-center">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">
                © 2026 GYNORA • EMPOWERING EVERY PHASE • HEALTH SUMMARY
              </p>
           </div>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
