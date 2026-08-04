"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type PreviewContextValue = {
  activeId: string | null;
  requestPreview: (id: string) => void;
  releasePreview: (id: string) => void;
};

const PreviewContext = createContext<PreviewContextValue | null>(null);

export function PreviewCoordinator({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const requestPreview = useCallback((id: string) => setActiveId(id), []);
  const releasePreview = useCallback(
    (id: string) => setActiveId((active) => (active === id ? null : active)),
    [],
  );
  const value = useMemo(
    () => ({ activeId, requestPreview, releasePreview }),
    [activeId, requestPreview, releasePreview],
  );
  return (
    <PreviewContext.Provider value={value}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreviewCoordinator() {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error("usePreviewCoordinator requires PreviewCoordinator");
  }
  return context;
}

