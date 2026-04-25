import { Component, type ErrorInfo, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  resetKey?: string | number;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

type SectionFallbackProps = {
  message?: string;
  className?: string;
  minHeightClassName?: string;
};

type SectionGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  message?: string;
  resetKey?: string | number;
  className?: string;
  minHeightClassName?: string;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary] Section render failed", error, info);
    }

    this.props.onError?.(error, info);
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <SectionFallback />;
    }

    return this.props.children;
  }
}

export const SectionFallback = ({
  message = "Unable to load section.",
  className,
  minHeightClassName = "min-h-[220px]",
}: SectionFallbackProps) => (
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
);

export const SectionGuard = ({
  children,
  fallback,
  message = "Unable to load section.",
  resetKey,
  className,
  minHeightClassName,
}: SectionGuardProps) => (
  <ErrorBoundary
    resetKey={resetKey}
    fallback={
      fallback ?? (
        <SectionFallback
          message={message}
          className={className}
          minHeightClassName={minHeightClassName}
        />
      )
    }
  >
    {children}
  </ErrorBoundary>
);
