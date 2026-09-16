"use client";

import { useSyncExternalStore } from "react";
import type { NewsTopic } from "@/content/company";

export type TopicFilter = "All" | NewsTopic;

let topic: TopicFilter = "All";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Current newsroom topic filter (shared between the hero pills and the feed). */
export function useTopic(): TopicFilter {
  return useSyncExternalStore(subscribe, () => topic, () => "All");
}

export function setTopic(next: TopicFilter) {
  if (next === topic) return;
  topic = next;
  listeners.forEach((l) => l());
}
