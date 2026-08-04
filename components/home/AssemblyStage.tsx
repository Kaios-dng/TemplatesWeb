"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BrowserFrame } from "@/components/shared/BrowserFrame";

export function AssemblyStage({ label }: { label: string }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stage.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 767px)").matches;
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline.set(".assembly-stage", { opacity: 1 });
      if (reduce) {
        timeline.fromTo(
          ".assembly-block",
          { opacity: 0 },
          { opacity: 1, duration: 0.2, stagger: 0.03 },
        );
        return;
      }
      timeline
        .from(".assembly-nav", {
          x: compact ? -40 : -150,
          opacity: 0,
          duration: 0.48,
        })
        .from(
          ".assembly-title",
          { y: compact ? -24 : -110, opacity: 0, duration: 0.5 },
          "-=0.3",
        )
        .from(
          ".assembly-media",
          { x: compact ? 36 : 170, opacity: 0, duration: 0.58 },
          "-=0.36",
        )
        .from(
          ".assembly-price",
          { y: compact ? 32 : 120, opacity: 0, duration: 0.46 },
          "-=0.34",
        );
      if (!compact) {
        timeline.from(
          ".assembly-footer",
          { x: -120, opacity: 0, duration: 0.42 },
          "-=0.26",
        );
      }
    }, stage);
    return () => ctx.revert();
  }, []);

  return (
    <div className="assembly-wrap" id="assembled-demo" ref={stage}>
      <span className="assembly-measure measure-top" aria-hidden="true">
        1280
      </span>
      <span className="assembly-measure measure-side" aria-hidden="true">
        760
      </span>
      <BrowserFrame label={label} address="kaios.preview/assembled">
        <div className="assembly-stage">
          <div className="assembly-page">
            <div className="assembly-block assembly-nav">
              <strong>STUDIO NORTH</strong>
              <span>Work</span>
              <span>Contact</span>
            </div>
            <div className="assembly-block assembly-title">
              <p>Independent spaces</p>
              <h2>Built for daily life.</h2>
            </div>
            <div className="assembly-block assembly-media">
              <div className="assembly-image">
                <span>Project preview</span>
              </div>
            </div>
            <div className="assembly-block assembly-price">
              <span>Selected work</span>
              <strong>Courtyard House</strong>
              <small>View project</small>
            </div>
            <div className="assembly-block assembly-footer">
              <span>Architecture and interiors</span>
              <span>Enquire</span>
            </div>
          </div>
        </div>
      </BrowserFrame>
    </div>
  );
}

