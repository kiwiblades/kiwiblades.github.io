import { useEffect, useMemo, useState } from "react";

type BgStep = {
  id: string; // must match an anchor element id in the page
  src: string; // image path
};

export default function BackgroundStack({
  steps,
  dim = 0.6, // 0..1 darkness overlay
  feather = 0.28, // 0..0.5 roughly; how much top/bottom fade
}: {
  steps: BgStep[];
  dim?: number;
  feather?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // preload images once
  useEffect(() => {
    steps.forEach(({ src }) => {
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
    });
  }, [steps]);

  // observe anchors to decide which background should be active
  useEffect(() => {
    const els = steps
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry closest to the top / most visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (!visible?.target) return;

        const idx = els.indexOf(visible.target as HTMLElement);
        if (idx !== -1) setActiveIndex(idx);
      },
      {
        // when an anchor is around the middle-ish of the viewport, consider it active
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [steps]);

  // mask to feather the top/bottom edges so transitions are never harsh
  const maskStyle = useMemo(() => {
    const top = Math.max(0.01, feather);
    const bottom = Math.max(0.01, feather);
    return {
      WebkitMaskImage: `linear-gradient(to bottom,
        transparent 0%,
        black ${top * 100}%,
        black ${(1 - bottom) * 100}%,
        transparent 100%)`,
      maskImage: `linear-gradient(to bottom,
        transparent 0%,
        black ${top * 100}%,
        black ${(1 - bottom) * 100}%,
        transparent 100%)`,
    } as const;
  }, [feather]);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      {/* image layers */}
      {steps.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 will-change-[opacity]"
          style={{
            backgroundImage: `url(${s.src})`,
            opacity: i === activeIndex ? 1 : 0,
            ...maskStyle,
          }}
        />
      ))}

      {/* subtle tint/gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
}
