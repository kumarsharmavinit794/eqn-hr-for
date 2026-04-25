import { useEffect, useState } from "react";

import {
  fallbackMarketingContent,
  loadMarketingContent,
  type MarketingContent,
} from "@/lib/marketingContent";

type MarketingContentState = {
  data: MarketingContent;
  error: string | null;
  loading: boolean;
};

export function useMarketingContent(): MarketingContentState {
  const [state, setState] = useState<MarketingContentState>({
    data: fallbackMarketingContent,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await loadMarketingContent();
        if (!active) {
          return;
        }

        setState({
          data,
          error: null,
          loading: false,
        });
      } catch {
        if (!active) {
          return;
        }

        setState({
          data: fallbackMarketingContent,
          error: "Showing fallback demo content right now.",
          loading: false,
        });
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return state;
}
