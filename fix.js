const fs = require('fs');
let content = fs.readFileSync('src/pages/DashboardPage.tsx', 'utf-8');

// 1. Imports
content = content.replace(
  'import {\n  Component,\n  useEffect,\n  useMemo,\n  useState,\n  type ComponentPropsWithoutRef,\n  type ErrorInfo,\n  type ReactNode,\n} from "react";',
  'import {\n  Component,\n  useEffect,\n  useMemo,\n  useState,\n  Suspense,\n  lazy,\n  type ComponentPropsWithoutRef,\n  type ErrorInfo,\n  type ReactNode,\n} from "react";'
);
content = content.replace(
  'import { AIHRCommandCockpit2027 } from "@/components/AIHRCommandCockpit2027";',
  'const AIHRCommandCockpit2027 = lazy(() =>\n  import("@/components/AIHRCommandCockpit2027")\n    .then((m) => ({ default: m.AIHRCommandCockpit2027 }))\n    .catch(() => ({ default: () => null }))\n);'
);

// 2. Types
content = content.replace(
  'type DashboardErrorBoundaryState = {\n  hasError: boolean;\n};',
  'type DashboardErrorBoundaryState = {\n  hasError: boolean;\n};\n\ntype CustomTooltipEntry = {\n  color?: string;\n  fill?: string;\n  name?: string | number;\n  dataKey?: string | number;\n  value?: string | number;\n};\n\ntype CustomTooltipProps = {\n  active?: boolean;\n  payload?: CustomTooltipEntry[];\n  label?: string | number;\n};'
);

// 3. CustomTooltip
content = content.replace(
  'const CustomTooltip = ({ active, payload, label }: any) => {',
  'const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {'
);
content = content.replace(
  'payload.filter(Boolean).map((entry: any, index: number) => (',
  'payload.filter(Boolean).map((entry, index: number) => ('
);

// 4. ChartContainer
content = content.replace(
  'const ChartContainer = ({\n  children,\n  className = "",\n}: {\n  children: ReactNode;\n  className?: string;\n}) => (\n  <div className={`w-full h-[260px] sm:h-[320px] lg:h-[360px] min-w-0 overflow-hidden ${className}`}>\n    {children}\n  </div>\n);',
  'const ChartContainer = ({\n  children,\n  className = "",\n}: {\n  children: ReactNode;\n  className?: string;\n}) => (\n  <div className={`w-full aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9] min-w-0 overflow-hidden ${className}`}>\n    {children}\n  </div>\n);'
);

// 5. renderSafeDot
content = content.replace(
  '  const {\n    index,\n    dataKey,\n    key,\n    name,\n    width,\n    height,\n    value,\n    payload,\n    points,\n    ...restProps\n  } = props as any;',
  '  const {\n    index,\n    dataKey,\n    key,\n    name,\n    width,\n    height,\n    value,\n    payload,\n    points,\n    ...restProps\n  } = props as SafeDotProps & Record<string, unknown>;'
);

// 6. SafeAIHRCommandCockpit
content = content.replace(
  'const SafeAIHRCommandCockpit = () => {\n  if (typeof AIHRCommandCockpit2027 !== "function") {\n    return <ChartFallback message="Unable to load this section." className="min-h-[220px] flex items-center justify-center" />;\n  }\n\n  return (\n    <DashboardErrorBoundary\n      resetKey="ai-cockpit"\n      fallback={<ChartFallback message="Unable to load this section." className="min-h-[220px] flex items-center justify-center" />}\n    >\n      <AIHRCommandCockpit2027 />\n    </DashboardErrorBoundary>\n  );\n};',
  'const SafeAIHRCommandCockpit = ({ resetKey }: { resetKey: string }) => {\n  return (\n    <DashboardErrorBoundary\n      resetKey={resetKey}\n      fallback={<ChartFallback message="Unable to load this section." className="min-h-[220px] flex items-center justify-center" />}\n    >\n      <Suspense fallback={<ChartFallback message="Loading AI Cockpit..." className="min-h-[220px] flex items-center justify-center" />}>\n        <AIHRCommandCockpit2027 />\n      </Suspense>\n    </DashboardErrorBoundary>\n  );\n};'
);

// 7. DashboardPage state
content = content.replace(
  '  const [data, setData] = useState<DashboardData | null>(null);\n  const [currentTime, setCurrentTime] = useState(new Date());',
  '  const [data, setData] = useState<DashboardData>(fallbackDashboardData);\n  const [retryCount, setRetryCount] = useState(0);\n  const [currentTime, setCurrentTime] = useState(new Date());'
);

// 8. useEffect for api
content = content.replace(
  '  useEffect(() => {\n    let mounted = true;\n\n    api\n      .get("/dashboard")\n      .then((res) => {\n        if (!mounted) return;\n        if (import.meta.env.DEV) console.debug("Dashboard API:", res.data);\n        setData(res.data?.data || fallbackDashboardData);\n      })\n      .catch(() => {\n        if (mounted) {\n          setData(fallbackDashboardData);\n        }\n      });\n\n    return () => {\n      mounted = false;\n    };\n  }, []);',
  '  useEffect(() => {\n    let mounted = true;\n    const controller = new AbortController();\n    const timeout = setTimeout(() => controller.abort(), 5000);\n\n    api\n      .get("/dashboard", { signal: controller.signal })\n      .then((res) => {\n        if (!mounted) return;\n        if (import.meta.env.DEV) console.debug("Dashboard API:", res.data);\n        setData(res.data?.data || fallbackDashboardData);\n        setRetryCount((c) => c + 1);\n      })\n      .catch(() => {\n        if (mounted) {\n          setData(fallbackDashboardData);\n          setRetryCount((c) => c + 1);\n        }\n      })\n      .finally(() => clearTimeout(timeout));\n\n    return () => {\n      mounted = false;\n      controller.abort();\n    };\n  }, []);'
);

// 9. remove if (!data) block
content = content.replace(
  '  if (!data) {\n    return (\n      <div className={`${pageWrapperClass} w-full max-w-[100vw] overflow-x-hidden`}>\n        <div className="flex min-h-[60vh] w-full items-center justify-center overflow-hidden">\n          <p className="text-sm text-muted-foreground">Loading executive HR command center...</p>\n        </div>\n      </div>\n    );\n  }\n\n  return (\n    <div className={`${pageWrapperClass} w-full max-w-[100vw] overflow-x-hidden`}>\n      <motion.div',
  '  return (\n    <div className={`${pageWrapperClass} w-full max-w-[100vw] overflow-x-hidden`}>\n      <motion.div'
);

// 10. safe arrays any replacements
content = content.replace(/\(item: any, index: number\)/g, '(item: Record<string, unknown>, index: number)');
content = content.replace(/\(dept: any\)/g, '(dept: Record<string, unknown>)');

// 11. SectionGuards and SafeAIHRCommandCockpit resetKeys
content = content.replace(/resetKey="([^"]+)"/g, 'resetKey={`$1-${retryCount}`}');
content = content.replace('<SafeAIHRCommandCockpit />', '<SafeAIHRCommandCockpit resetKey={`ai-cockpit-${retryCount}`} />');

// 12. avatars
content = content.replace(
  /className="h-12 w-12 rounded-3xl ring-2 ring-zinc-200\/70 dark:ring-white\/10" \/>/g,
  'loading="lazy" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`; }} className="h-12 w-12 rounded-3xl ring-2 ring-zinc-200/70 dark:ring-white/10" />'
);
content = content.replace(
  /className="h-9 w-9 shrink-0 rounded-3xl" \/>/g,
  'loading="lazy" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(req.name)}&background=random`; }} className="h-9 w-9 shrink-0 rounded-3xl" />'
);

// 13. Mini calendar Array.from
content = content.replace(
  'Array.from({ length: 35 })',
  'Array.from({ length: new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate() })'
);

fs.writeFileSync('src/pages/DashboardPage.tsx', content, 'utf-8');
console.log('Script done');