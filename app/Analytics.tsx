"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/* ============================================================================
   PostHog analytics.

   1) Make a free account at https://posthog.com
   2) Project Settings → copy your "Project API Key" (starts with phc_)
      and your region host (US: https://us.i.posthog.com, EU: https://eu.i.posthog.com)
   3) Paste them below. This key is a PUBLIC client-side key — safe to commit.

   Until a real key is filled in, tracking is simply disabled (site works fine).
   ========================================================================== */
const POSTHOG_KEY = "phc_mEM2GLs8pXvQkuwcL9EmUbPQ47UE3aUL99BsdsR9e42t";
const POSTHOG_HOST = "https://us.i.posthog.com";

const enabled = POSTHOG_KEY.startsWith("phc_") && !POSTHOG_KEY.includes("PASTE_YOUR_KEY");

let started = false;

export default function Analytics() {
  useEffect(() => {
    if (started || !enabled) return;
    started = true;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true, // counts visits
      autocapture: true, // auto-tracks every click/button, no extra code
      persistence: "localStorage+cookie",
    });

    // Self-tagging: visit the site with ?me=1 once on each of your devices to
    // mark this browser as internal. It persists, so every future event on this
    // device carries internal=true — filter it out in PostHog's "internal users".
    const params = new URLSearchParams(window.location.search);
    if (params.get("me") === "1") {
      posthog.register({ internal: true }); // super property → on every event
      posthog.setPersonProperties({ internal: true }); // person-level property
    }
  }, []);
  return null;
}

/** Fire a named event (safe to call even if analytics is disabled). */
export function track(event: string, props?: Record<string, unknown>) {
  if (!enabled || typeof window === "undefined") return;
  try {
    posthog.capture(event, props);
  } catch {
    /* no-op */
  }
}
