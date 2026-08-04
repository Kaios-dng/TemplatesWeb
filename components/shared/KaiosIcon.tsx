"use client";

import {
  ArrowDownRight,
  ArrowRight,
  Eye,
  MessageSquareText,
  Search,
} from "lucide-react";

const icons = {
  arrowDownRight: ArrowDownRight,
  arrowRight: ArrowRight,
  eye: Eye,
  message: MessageSquareText,
  search: Search,
} as const;

export type KaiosIconName = keyof typeof icons;

export function KaiosIcon({
  name,
  className,
}: {
  name: KaiosIconName;
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" />;
}
