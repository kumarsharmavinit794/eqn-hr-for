import {
  memo,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export type SafeDotProps = Omit<
  ComponentPropsWithoutRef<"circle">,
  "cx" | "cy" | "r"
> & {
  cx?: number | string | null;
  cy?: number | string | null;
  r?: number | string | null;
  dataKey?: string | number;
  index?: number;
};

type SafeChartFallbackProps = {
  message?: string;
  className?: string;
  minHeightClassName?: string;
};

type SafeChartContainerProps = {
  children: ReactNode;
  className?: string;
  minHeightClassName?: string;
};

type SafeChartProps = SafeChartContainerProps & {
  hasData: boolean;
  emptyMessage?: string;
};

type TooltipEntry = {
  color?: string;
  fill?: string;
  name?: string | number;
  dataKey?: string | number;
  value?: unknown;
};

type SafeChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: unknown;
};

type RechartsDotProps = SafeDotProps & {
  dataKey?: string | number;
  height?: number;
  index?: number;
  key?: string | number;
  name?: string;
  payload?: unknown;
  points?: unknown;
  value?: unknown;
  width?: number;
};

const DEFAULT_CHART_HEIGHT_CLASS =
  "h-[260px] sm:h-[320px] lg:h-[360px]";

const toSafeCoordinate = (value: unknown): number => {
  if (value === null || value === undefined || value === "") {
    return Number.NaN;
  }

  return Number(value);
};

const toSafeRadius = (value: unknown): number => {
  if (value === null || value === undefined || value === "") {
    return 4;
  }

  return Number(value);
};

const formatTooltipValue = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString("en-IN");
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return "N/A";
};

export const SafeChartFallback = memo(
  ({
    message = "Unable to load section.",
    className,
    minHeightClassName = "min-h-[260px]",
  }: SafeChartFallbackProps) => (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-3xl border border-dashed border-zinc-300/70 bg-zinc-50/80 p-6 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-400",
        minHeightClassName,
        className,
      )}
      role="status"
    >
      {message}
    </div>
  ),
);

SafeChartFallback.displayName = "SafeChartFallback";

export const SafeChartContainer = memo(
  ({
    children,
    className,
    minHeightClassName = DEFAULT_CHART_HEIGHT_CLASS,
  }: SafeChartContainerProps) => (
    <div className="w-full max-w-full overflow-x-hidden">
      <div
        className={cn(
          "dashboard-chart-shell w-full min-w-0 overflow-hidden",
          minHeightClassName,
          className,
        )}
      >
        {children}
      </div>
    </div>
  ),
);

SafeChartContainer.displayName = "SafeChartContainer";

export const SafeChart = memo(
  ({
    hasData,
    children,
    className,
    emptyMessage = "Unable to load section.",
    minHeightClassName,
  }: SafeChartProps) =>
    hasData ? (
      <SafeChartContainer
        className={className}
        minHeightClassName={minHeightClassName}
      >
        {children}
      </SafeChartContainer>
    ) : (
      <SafeChartFallback
        className={className}
        message={emptyMessage}
        minHeightClassName={minHeightClassName?.replace(/^h-/, "min-h-")}
      />
    ),
);

SafeChart.displayName = "SafeChart";

export const SafeChartTooltip = memo(
  ({ active, payload, label }: SafeChartTooltipProps) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const entries = Array.isArray(payload) ? payload.filter(Boolean) : [];

    if (!active || entries.length === 0) {
      return null;
    }

    const safeLabel =
      typeof label === "string" && label.trim().length > 0 ? label : "Details";

    return (
      <div
        className={cn(
          "pointer-events-none min-w-[180px] rounded-3xl border p-4 text-sm shadow-2xl backdrop-blur-2xl",
          isDark
            ? "border-white/20 bg-zinc-900 text-white"
            : "border-zinc-200 bg-white/95 text-zinc-900",
        )}
      >
        <p
          className={cn(
            "mb-3 break-words text-sm font-medium",
            isDark ? "text-emerald-400" : "text-emerald-700",
          )}
        >
          {safeLabel}
        </p>
        {entries.map((entry, index) => (
          <div
            key={`${String(entry.dataKey ?? entry.name ?? "tooltip-entry")}-${index}`}
            className="mb-1 flex items-center justify-between gap-4 last:mb-0"
          >
            <div className="min-w-0 flex items-center gap-2">
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{
                  backgroundColor: entry.color ?? entry.fill ?? "#22C55E",
                }}
              />
              <span
                className={cn(
                  "min-w-0 break-words",
                  isDark ? "text-zinc-400" : "text-zinc-600",
                )}
              >
                {String(entry.name ?? entry.dataKey ?? `Series ${index + 1}`)}
              </span>
            </div>
            <span
              className={cn(
                "shrink-0 font-semibold",
                isDark ? "text-white" : "text-zinc-900",
              )}
            >
              {formatTooltipValue(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  },
);

SafeChartTooltip.displayName = "SafeChartTooltip";

export const SafeDot = ({
  cx,
  cy,
  r = 4,
  dataKey: _dataKey,
  index: _index,
  fill,
  stroke,
  strokeWidth,
  className,
  opacity,
  style,
  ...restProps
}: SafeDotProps) => {
  const safeCx = toSafeCoordinate(cx);
  const safeCy = toSafeCoordinate(cy);
  const safeRadius = toSafeRadius(r ?? 4);

  if (!Number.isFinite(safeCx) || !Number.isFinite(safeCy)) {
    return null;
  }

  return (
    <circle
      {...restProps}
      className={className}
      cx={safeCx}
      cy={safeCy}
      fill={fill}
      opacity={opacity}
      r={Number.isFinite(safeRadius) && safeRadius > 0 ? safeRadius : 4}
      stroke={stroke}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
};

export const createSafeDotRenderer =
  (defaults: Partial<SafeDotProps> = {}) =>
  (props?: RechartsDotProps) => {
    if (!props) {
      return null;
    }

    const {
      key: dotKey,
      dataKey,
      height,
      index,
      name,
      payload,
      points,
      value,
      width,
      cx,
      cy,
      r,
      fill,
      stroke,
      strokeWidth,
      className,
      opacity,
      style,
      ...circleProps
    } = props;

    const safeProps: SafeDotProps = {
      ...circleProps,
      className,
      cx,
      cy,
      fill: fill ?? defaults.fill,
      opacity,
      r: r ?? defaults.r ?? 4,
      stroke: stroke ?? defaults.stroke,
      strokeWidth: strokeWidth ?? defaults.strokeWidth,
      style,
    };

    const safeKey =
      dotKey ?? `${String(dataKey ?? defaults.dataKey ?? "dot")}-${index ?? 0}`;

    return (
      <SafeDot
        key={safeKey}
        {...safeProps}
      />
    );
  };

export const hasChartData = (value: unknown): boolean =>
  Array.isArray(value) && value.length > 0;
