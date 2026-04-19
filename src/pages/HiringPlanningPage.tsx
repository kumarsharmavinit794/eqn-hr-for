import React, { Component, type ErrorInfo, type ReactNode, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, TrendingUp, Users, DollarSign, Sparkles, GitBranch, Plus, ChevronRight, Loader2,
  Check, AlertCircle, Wand2, ArrowRight, Copy, Brain, Zap, Target, Activity, Shield, Globe,
  BarChart3, Radar, Cpu, Network, Layers, Bot, Workflow, Radio, Satellite, FlaskConical, Scale,
  Leaf, Infinity as InfinityIcon, Timer, Fingerprint, Link as LinkIcon, Award, Eye, Gem, Crown,
  Download, MessageSquare, X, Play, RefreshCw, ChevronDown, Calendar, Search, Map, CheckCircle2,
  AlertTriangle, HeartPulse, UserPlus, Gauge, Compass, Gavel, FileText
} from "lucide-react";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, FunnelChart, Funnel, ComposedChart
} from "recharts";

// ─── UTILS & MOCK DATA ────────────────────────────────────────────────────────
const gd = (n: number, map: (x: any, i: number) => any) => Array.from({length: n}).map(map);
const rnd = (min: number, max: number) => Math.floor(Math.random()*(max-min)+min);

const MOCK_REQUIREMENTS = [
  { id: 1, job_title: "Senior Frontend Engineer", department: "Engineering", positions: 3, budget: "$360K", status: "high", created_at: "2026-04-01T10:00:00.000Z" },
  { id: 2, job_title: "Product Designer", department: "Design", positions: 2, budget: "$180K", status: "medium", created_at: "2026-04-02T10:00:00.000Z" },
  { id: 3, job_title: "Growth Marketing Manager", department: "Marketing", positions: 1, budget: "$120K", status: "medium", created_at: "2026-04-03T10:00:00.000Z" },
];
const MOCK_STATS = { openPositions: 7, totalBudget: "$755K", headcountTarget: 148, avgTimeToFill: 32 };
const MOCK_FORECAST = gd(6, (_,i) => ({ month: `M${i+1}`, current: i < 4 ? rnd(110,130) : null, projected: 120 + i*4 }));
const MOCK_BUDGET = [{ dept: "Eng", salary: 420, hiring: 95 }, { dept: "Design", salary: 155, hiring: 35 }, { dept: "Mktg", salary: 130, hiring: 24 }];
const MOCK_ORG = { name: "CEO", children: [{ name: "CTO", children: [{ name: "Eng" }, { name: "Prod" }] }, { name: "COO", children: [{ name: "Ops" }] }] };
const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Sales", "HR", "Product", "Operations"];
const priorityColors: Record<string, string> = { high: "border-red-500/50 bg-red-500/10 text-red-400", medium: "border-amber-500/50 bg-amber-500/10 text-amber-400", low: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" };

// 50 Features Mock Data
const skillsRadar = gd(6, (_,i) => ({ subject: ['React','Cloud','Lead','Data','UI','Sec'][i], cur: rnd(40,100), req: rnd(60,100) }));
const heatGrid = gd(30, () => rnd(10, 100));
const pipelineData = [{ name: 'Applied', value: 1200, fill: '#10b981' }, { name: 'Screened', value: 800, fill: '#059669' }, { name: 'Interviewed', value: 300, fill: '#047857' }, { name: 'Offered', value: 50, fill: '#064e3b' }, { name: 'Joined', value: 42, fill: '#022c22' }];
const emoData = gd(12, (_,i) => ({ week: `W${i+1}`, pos: rnd(60,90), neu: rnd(10,30), neg: rnd(0,10) }));
const salaryData = gd(5, (_,i) => ({ role: ['SDE1','SDE2','PM','Des','HR'][i], internal: rnd(10,30), market: rnd(12,35) }));
const esgData = [{ name: 'Env', value: 85, fill: '#10b981' }, { name: 'Soc', value: 92, fill: '#3b82f6' }, { name: 'Gov', value: 88, fill: '#8b5cf6' }];
const neuroData = [{ name: 'Neurotypical', value: 82, fill: '#3b82f6' }, { name: 'Neurodiverse', value: 18, fill: '#10b981' }];

const DEFAULT_DEPT = {
  overviewFocus: "deliver high-quality work, partner closely with stakeholders, and contribute to continuous team improvement",
  responsibilities: ["Own key deliverables.", "Collaborate with cross-functional teams.", "Identify process improvements."],
  requirements: ["Relevant experience.", "Strong communication skills.", "Ability to manage priorities."],
  benefits: ["Growth-oriented environment.", "Competitive compensation."]
};

function buildJobDescription(title: string, dept: string, extra = "") {
  return { description: `Job Overview\n${title} in ${dept} will ${DEFAULT_DEPT.overviewFocus}.\n\nResponsibilities\n${DEFAULT_DEPT.responsibilities.join('\n')}\n\nRequirements\n${DEFAULT_DEPT.requirements.join('\n')}\n${extra}\n\nBenefits\n${DEFAULT_DEPT.benefits.join('\n')}`, guidance: "" };
}

async function generateJDWithClaude(t: string, d: string, e: string) {
  await new Promise(r => setTimeout(r, 250)); return buildJobDescription(t, d, e).description;
}

// ─── REUSABLE PREMIUM UI ──────────────────────────────────────────────────────
const PCard = ({ title, icon: Icon, children, className="", badge="", glow=false }: any) => (
  <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className={`bg-gray-900/80 border border-white/10 backdrop-blur-xl rounded-3xl p-5 ${glow ? 'shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500/30' : ''} ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2"><Icon className="w-5 h-5 text-emerald-400" /><h3 className="text-white font-semibold text-sm">{title}</h3></div>
      {badge && <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px]">{badge}</Badge>}
    </div>
    {children}
  </motion.div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function HiringPlanningPage() {
  return <PageErrorBoundary><HiringPlanningPageContent /></PageErrorBoundary>;
}

function HiringPlanningPageContent() {
  const [requirements, setRequirements] = useState(MOCK_REQUIREMENTS);
  const [connected, setConnected] = useState<string[]>([]);
  const [jobCreateOpen, setJobCreateOpen] = useState(false);
  const [prefilled, setPrefilled] = useState<any>(null);
  
  // Section D specific state
  const [vacancyCost, setVacancyCost] = useState(42000000);
  const [attritionRate, setAttritionRate] = useState([12]);
  
  // F50 Executive Teleport
  const [teleportOpen, setTeleportOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    const int = setInterval(() => setVacancyCost(c => c + 145), 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="space-y-8 bg-gray-950 min-h-screen text-gray-100 p-4 lg:p-8 selection:bg-emerald-500/30 font-sans relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* HEADER & F32 EXPORT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Hiring War Room <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">2030 Edition</Badge>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Strategic AI workforce intelligence dashboard</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <JDGeneratorDialog onUseJD={(d: any) => { setPrefilled(d); setJobCreateOpen(true); }} departments={DEPARTMENTS} />
          <JobCreateDialog open={jobCreateOpen} onOpenChange={setJobCreateOpen} prefilled={prefilled} departments={DEPARTMENTS} />
          <motion.div whileHover={{scale:1.05}} whileTap={{scale:0.95}}>
            <Button variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20">
              <Download className="w-4 h-4 mr-2" /> Export 2030 Report
            </Button>
          </motion.div>
        </div>
      </div>

      {/* SECTION A - CORE AI INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* F1 & F4: AI Banner & Oracle */}
        <div className="lg:col-span-2 relative p-6 rounded-3xl bg-gray-900/80 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4"><Sparkles className="text-emerald-400"/> AI Hiring Intelligence</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[ {l:"Sourcing", v:"Optimal"}, {l:"Bias Score", v:"Low"}, {l:"Velocity", v:"+12%"}, {l:"Acceptance", v:"94%"} ].map((t, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-400">{t.l}</span>
                  <span className="text-sm font-bold text-emerald-400">{t.v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input className="bg-black/50 border-emerald-500/30 text-emerald-100 placeholder:text-emerald-700/50 rounded-xl flex-1" placeholder="Ask Oracle a hiring question..." />
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"><Brain className="w-4 h-4 mr-2"/> Ask</Button>
            </div>
            <p className="text-[10px] text-gray-500 mt-3 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin"/> Updated 2 mins ago</p>
          </div>
        </div>

        {/* F3: Autonomous Agents */}
        <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Bot className="w-4 h-4 text-emerald-400"/> Swarm Agents</h3>
          <div className="space-y-3">
            {["Sourcing Agent", "Screening Agent", "Negotiator Agent"].map(a => (
              <div key={a} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <motion.div animate={{scale:[1,2,1], opacity:[0.8,0,0.8]}} transition={{repeat:Infinity, duration:2}} className="absolute inset-0 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-200">{a}</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Active</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS GRID with F2 Acceptance Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[ 
          { l: "Open Positions", v: "7", i: Briefcase },
          { l: "Total Budget", v: "$755K", i: DollarSign },
          { l: "Headcount Target", v: "148", i: Users },
          { l: "Avg Time to Fill", v: "32d", i: TrendingUp }
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-gray-900/80 border-white/10">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2"><span className="text-xs text-gray-400 uppercase">{s.l}</span><s.i className="w-4 h-4 text-emerald-400/60" /></div>
                <p className="text-2xl font-bold text-white">{s.v}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {/* F2: Predictive Offer Gauge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gray-900/80 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden">
            <CardContent className="p-4 h-full flex flex-col justify-center items-center">
              <span className="text-xs text-gray-400 uppercase w-full text-left absolute top-4 left-4">Acceptance Prob</span>
              <div className="h-[80px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="100%" innerRadius="100%" outerRadius="140%" barSize={8} data={[{name: 'Accept', value: 68, fill: '#10b981'}]} startAngle={180} endAngle={0}>
                    <RadialBar background={{ fill: '#ffffff10' }} dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute bottom-4 flex flex-col items-center">
                <span className="text-xl font-bold text-emerald-400">68%</span>
                <Badge className="bg-amber-500/20 text-amber-400 border-none text-[9px] mt-1">Warning Drop</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* SECTION B & C - ANALYTICS & TALENT INTEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* F5 & F14: Quantum Match / Gap Radar */}
        <PCard title="Quantum Skill Match" icon={Radar} glow>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsRadar}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="subject" tick={{fill:'#9ca3af', fontSize:10}} />
                <RechartsRadar name="Current" dataKey="cur" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <RechartsRadar name="Required" dataKey="req" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                <Legend wrapperStyle={{fontSize:10, paddingTop:10}}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </PCard>

        {/* F7: What-If Simulator */}
        <PCard title="What-If Simulator" icon={Activity}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Attrition</span><span>{attritionRate[0]}%</span></div>
              <Slider value={attritionRate} onValueChange={setAttritionRate} max={30} step={1} className="[&>span]:bg-emerald-500" />
            </div>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_FORECAST}>
                  <XAxis dataKey="month" tick={{fill:'#6b7280', fontSize:10}} />
                  <Tooltip contentStyle={{backgroundColor:'#111827', borderColor:'#10b981'}} />
                  <Line type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={3} dot={{r:4, fill:'#10b981'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </PCard>

        {/* F8: Pipeline Velocity */}
        <PCard title="Pipeline Velocity" icon={Workflow}>
          <div className="h-[240px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} layout="vertical" margin={{left: 20}}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill:'#9ca3af', fontSize:10}} />
                <Tooltip contentStyle={{backgroundColor:'#111827', borderColor:'#10b981'}} />
                <Bar dataKey="value" radius={[0,4,4,0]}>
                  {pipelineData.map((e,i)=><Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PCard>

        {/* F9: Resonance Graph */}
        <PCard title="Emotional Resonance" icon={HeartPulse}>
           <div className="h-[200px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emoData}>
                  <defs>
                    <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="pos" stroke="#10b981" fill="url(#colorPos)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </PCard>

        {/* F11 & F12: Candidate Twin & Mobility */}
        <PCard title="AI Talent Twins" icon={Users}>
          <div className="space-y-3">
            {[ {n:"Alice M.", r:"Sr Engineer", m:94}, {n:"Bob T.", r:"Designer", m:89}, {n:"Carol K.", r:"PM", m:85} ].map(t => (
              <div key={t.n} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10 hover:border-emerald-500/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">{t.n[0]}</div>
                  <div><p className="text-sm font-medium text-white">{t.n}</p><p className="text-xs text-gray-400">{t.r}</p></div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400">{t.m}% Match</Badge>
              </div>
            ))}
          </div>
        </PCard>

        {/* F15 & F16: Collective IQ / Neural Comp */}
        <PCard title="Collective IQ Delta" icon={Brain} badge="Team Harmony: 87%">
           <div className="h-[200px]">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gd(6, (_,i)=>({m:`M${i+1}`, iq: 110+i*rnd(1,3)}))}>
                  <Line type="stepAfter" dataKey="iq" stroke="#8b5cf6" strokeWidth={3} dot={{r:4}} />
                </LineChart>
             </ResponsiveContainer>
           </div>
        </PCard>
      </div>

      {/* SECTION D - FINANCIALS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* F17: Vacancy Cost */}
        <PCard title="Live Vacancy Cost" icon={DollarSign} glow className="lg:col-span-1">
          <div className="flex flex-col items-center justify-center h-full space-y-4 py-6">
            <span className="text-4xl font-black text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]">
              ₹{(vacancyCost / 100000).toFixed(2)} Cr
            </span>
            <p className="text-xs text-gray-400">Ticking daily loss</p>
          </div>
        </PCard>

        {/* F19: ESG Meter */}
        <PCard title="ESG Hiring Impact" icon={Leaf} className="lg:col-span-2">
          <div className="flex justify-around items-center h-full py-4">
            {esgData.map(e => (
              <div key={e.name} className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={[e]} startAngle={90} endAngle={-270}>
                       <RadialBar background={{fill:'#ffffff10'}} dataKey="value" cornerRadius={10} fill={e.fill} />
                     </RadialBarChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">{e.value}%</div>
                </div>
                <span className="text-xs text-gray-400">{e.name}</span>
              </div>
            ))}
          </div>
        </PCard>

        {/* F32: Regulatory Shield */}
        <PCard title="Regulatory Shield" icon={Shield} badge="EU Alert">
          <div className="space-y-3">
            {[ {r:"India", v:98, c:"bg-emerald-500"}, {r:"USA", v:95, c:"bg-emerald-500"}, {r:"EU", v:87, c:"bg-amber-500"} ].map(r => (
              <div key={r.r}>
                <div className="flex justify-between text-xs mb-1"><span>{r.r}</span><span>{r.v}%</span></div>
                <Progress value={r.v} className="h-1.5 [&>div]:bg-emerald-500" />
              </div>
            ))}
          </div>
        </PCard>
      </div>

      {/* SECTION E & F - DEI, HEATMAP, INFINITE LOOP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* F21 & F23: DEI & Neuro */}
        <PCard title="DEI Intelligence" icon={Scale}>
          <div className="h-[140px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={neuroData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                  {neuroData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor:'#111827', borderColor:'#10b981'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-gray-400">Neuro-diversity Mix (18%)</div>
        </PCard>

        {/* F25: Global Talent Heatmap */}
        <PCard title="Global Talent Topology" icon={Globe} className="lg:col-span-1">
          <div className="grid grid-cols-6 gap-1 h-32 opacity-70">
            {heatGrid.map((v, i) => (
              <div key={i} className="rounded-sm" style={{backgroundColor: `rgba(16,185,129,${v/100})`}} />
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-center">Simulated Regional Density</p>
        </PCard>

        {/* F31: Infinite Loop Optimizer */}
        <PCard title="Infinite Hiring Loop" icon={InfinityIcon} glow>
          <div className="flex flex-col items-center py-4">
            <motion.div animate={{rotate:360}} transition={{repeat:Infinity, duration:8, ease:"linear"}}>
               <InfinityIcon className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </motion.div>
            <div className="mt-4 space-y-2 w-full">
               <div className="text-xs bg-emerald-500/10 text-emerald-300 p-2 rounded-lg text-center">-8 days Time-to-Hire (Auto)</div>
               <div className="text-xs bg-emerald-500/10 text-emerald-300 p-2 rounded-lg text-center">+12% Offer Accept (Auto)</div>
            </div>
          </div>
        </PCard>
      </div>

      {/* EXISTING REQUIREMENTS CARDS (styled up) */}
      <PCard title="Department Reqs" icon={Briefcase}>
        <div className="space-y-3">
          {requirements.map((r) => (
            <div key={r.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
              <div><p className="font-semibold text-sm">{r.job_title}</p><p className="text-xs text-gray-400">{r.department} · {r.positions} pos</p></div>
              <Badge className={priorityColors[r.status]}>{r.status}</Badge>
            </div>
          ))}
        </div>
      </PCard>

      {/* F50 CEO DECISION TELEPORT OVERLAY TRIGGER */}
      <div className="mt-12 w-full p-8 rounded-3xl border border-emerald-500/50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-[0_0_40px_rgba(16,185,129,0.2)] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <Crown className="w-12 h-12 text-emerald-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
        <h2 className="text-3xl font-black text-white mb-2">CEO War Room</h2>
        <p className="text-gray-400 mb-6">Simulate all 2030 hiring scenarios instantly.</p>
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8 py-6 text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]" onClick={() => setTeleportOpen(true)}>
          <Zap className="w-5 h-5 mr-2" /> Enter Decision Teleport
        </Button>
      </div>

      {/* MODALS & FLOATING */}
      <AnimatePresence>
        {teleportOpen && (
          <Dialog open={teleportOpen} onOpenChange={setTeleportOpen}>
            <DialogContent className="max-w-4xl bg-gray-950 border-emerald-500/40 text-white">
              <DialogHeader><DialogTitle className="text-2xl flex items-center gap-2"><Crown className="text-emerald-400"/> Executive Teleport</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <PCard title="Scenario A: Hyper-Growth" icon={TrendingUp} glow>
                  <p className="text-xs text-gray-300">Revenue Unlock: +₹142Cr</p>
                  <p className="text-xs text-gray-300 mt-2">Cost: ₹12Cr</p>
                  <Button className="w-full mt-4 bg-emerald-600">Execute</Button>
                </PCard>
                <PCard title="Scenario B: Lean Efficiency" icon={Scale}>
                   <p className="text-xs text-gray-300">Revenue Unlock: +₹60Cr</p>
                   <p className="text-xs text-gray-300 mt-2">Cost: ₹3Cr</p>
                   <Button variant="outline" className="w-full mt-4 border-emerald-500 text-emerald-400">Execute</Button>
                </PCard>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Floating Copilot */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {copilotOpen && (
             <motion.div initial={{opacity:0, scale:0.9, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.9, y:20}} className="w-80 bg-gray-900/95 border border-emerald-500/40 backdrop-blur-xl rounded-2xl shadow-2xl p-4 mb-4">
               <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                 <h4 className="text-sm font-bold text-white flex items-center gap-2"><Bot className="w-4 h-4 text-emerald-400"/> AI Copilot</h4>
                 <button onClick={()=>setCopilotOpen(false)}><X className="w-4 h-4 text-gray-400 hover:text-white"/></button>
               </div>
               <div className="space-y-3">
                 <div className="bg-white/5 p-2 text-xs rounded-lg text-gray-300">How can I optimize the current pipeline?</div>
                 <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 text-xs rounded-lg text-emerald-100">I recommend activating the Swarm Agents for Engineering roles. It will boost velocity by 14%.</div>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>setCopilotOpen(!copilotOpen)} className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
          <MessageSquare className="w-6 h-6 text-white" />
        </motion.button>
      </div>

    </div>
  );
}

// ─── DIALOGS ──────────────────────────────────────────────────────────────────
function JDGeneratorDialog({ onUseJD, departments }: any) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const gen = async () => {
    setLoading(true);
    const text = await generateJDWithClaude(title, dept, "");
    setOutput(text);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10"><Wand2 className="w-4 h-4 mr-2"/> JD Generator</Button></DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-950 border-emerald-500/30 text-white">
        <DialogHeader><DialogTitle className="text-emerald-400 flex items-center gap-2"><Wand2/> AI JD Generator</DialogTitle></DialogHeader>
        <Tabs defaultValue="gen" className="mt-4">
          <TabsList className="bg-gray-900 border border-white/10">
            <TabsTrigger value="gen" className="data-[state=active]:bg-emerald-600">Generate</TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-emerald-600">Bias Auditor</TabsTrigger>
          </TabsList>
          <TabsContent value="gen" className="space-y-4 mt-4">
             <div className="grid grid-cols-2 gap-4">
               <div><Label className="text-gray-300">Job Title</Label><Input className="bg-gray-900 border-white/10 text-white mt-1" value={title} onChange={e=>setTitle(e.target.value)} /></div>
               <div><Label className="text-gray-300">Department</Label>
                 <Select value={dept} onValueChange={setDept}>
                   <SelectTrigger className="bg-gray-900 border-white/10 text-white mt-1"><SelectValue/></SelectTrigger>
                   <SelectContent className="bg-gray-900 border-white/10 text-white">{departments.map((d:any)=><SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                 </Select>
               </div>
             </div>
             <Button className="w-full bg-emerald-600 hover:bg-emerald-500" onClick={gen} disabled={loading}>{loading?<Loader2 className="animate-spin mr-2"/>:"Generate JD"}</Button>
             {output && (
               <div className="relative">
                 <Textarea value={output} readOnly className="h-40 bg-gray-900 border-emerald-500/30 text-sm p-4" />
                 <div className="flex gap-2 mt-2">
                   <Button variant="outline" className="flex-1 border-emerald-500/30 text-emerald-400" onClick={()=>setOutput(output + "\n\n[Auto-Evolved: +23% match prob]")}><Zap className="w-4 h-4 mr-2"/> Auto-Evolve JD</Button>
                   <Button className="flex-1 bg-emerald-600" onClick={()=>{onUseJD({title,department:dept,description:output}); setOpen(false);}}><ArrowRight className="w-4 h-4 mr-2"/> Use JD</Button>
                 </div>
               </div>
             )}
          </TabsContent>
          <TabsContent value="audit" className="mt-4 space-y-4">
             <div className="p-6 bg-gray-900 rounded-xl border border-white/10 text-center">
               <Shield className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
               <h3 className="text-lg font-bold text-white">Bias Score: 94/100</h3>
               <p className="text-sm text-gray-400 mt-2">No significant bias detected in generated text.</p>
               <Badge className="mt-4 bg-emerald-500/20 text-emerald-400">Fairness Rating: A+</Badge>
             </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function JobCreateDialog({ open, onOpenChange, prefilled, departments }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild><Button className="bg-emerald-600 hover:bg-emerald-500"><Plus className="w-4 h-4 mr-2"/> Create Job</Button></DialogTrigger>
      <DialogContent className="bg-gray-950 border-emerald-500/30 text-white">
        <DialogHeader><DialogTitle className="text-emerald-400">Create New Job</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-4">
          <Input defaultValue={prefilled?.title} placeholder="Title" className="bg-gray-900 border-white/10" />
          <Select defaultValue={prefilled?.department}>
             <SelectTrigger className="bg-gray-900 border-white/10 text-white mt-1"><SelectValue placeholder="Dept"/></SelectTrigger>
             <SelectContent className="bg-gray-900 border-white/10 text-white">{departments.map((d:any)=><SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Textarea defaultValue={prefilled?.description} placeholder="Description" className="bg-gray-900 border-white/10 h-32" />
          <Button className="w-full bg-emerald-600 hover:bg-emerald-500" onClick={()=>onOpenChange(false)}>Submit Job</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

class PageErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? <div className="p-8 text-red-500">Error rendering War Room.</div> : this.props.children; }
}
