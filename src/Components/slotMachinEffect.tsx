import React, { useEffect, useRef, useState } from "react";

/**
 * SlotMachineEffect
 * Animates an integer value so that digits "roll" in a cascading slot-machine fashion.
 * Sequence (per spec):
 * 1. All digits start at 0.
 * 2. Units place rolls quickly 0 -> 9.
 * 3. As soon as it first reaches 9, next (tens) digit starts rolling 0 -> 9 while units slows and settles to its target digit.
 * 4. Repeat up the chain until the most significant digit finishes; it then settles to its target.
 * 5. Optional callback on completion.
 */

export interface SlotMachineEffectProps {
  value: number; // Non-negative integer to display
  spinSpeedMs?: number; // Interval for fast rolling (default 40ms)
  settleSpeedMs?: number; // Interval while settling to target (default 150ms)
  className?: string; // Wrapper classes
  digitClassName?: string; // Digit span classes
  onComplete?: () => void; // Fired once all digits settled
  restartOnValueChange?: boolean; // If false and value changes mid-animation, jump directly
  direction?: "forward" | "back"; // Settle direction after reaching 9 (default forward via 0)
  monospace?: boolean; // Apply monospace font family
  /**
   * Leftmost digit easing strength expressed as number of final increments that should use settleSpeedMs.
   * Example: target digit 7 & leftmostEasingSteps=3 -> fast: 0..3, slow: 4,5,6,7
   * Clamped to [1, targetDigit]. Default 3.
   */
  leftmostEasingSteps?: number;
  /** Show thousands separators (commas by default) when value >= 1000 */
  useGrouping?: boolean;
  /** Separator character to use when grouping (default ",") */
  separator?: string;
  /** Optional class for separator spans */
  separatorClassName?: string;
}

type DigitStatus = "pending" | "spinning" | "settling" | "done";

interface DigitState {
  status: DigitStatus;
  current: number; // currently displayed digit 0-9
}

const DEFAULT_SPIN_SPEED = 40;
const DEFAULT_SETTLE_SPEED = 150;

const clearTimers = (timers: React.MutableRefObject<NodeJS.Timeout[]>) => {
  timers.current.forEach((t) => clearTimeout(t));
  timers.current = [];
};

const SlotMachinEffect: React.FC<SlotMachineEffectProps> = ({
  value,
  spinSpeedMs = DEFAULT_SPIN_SPEED,
  settleSpeedMs = DEFAULT_SETTLE_SPEED,
  className,
  digitClassName,
  onComplete,
  restartOnValueChange = true,
  direction = "forward",
  monospace = true,
  leftmostEasingSteps = 6,
  useGrouping = true,
  separator = ",",
  separatorClassName,
}) => {
  const positive = Math.max(0, Math.floor(isFinite(value) ? value : 0));
  const valueDigits = positive
    .toString()
    .split("")
    .map((d) => parseInt(d, 10));
  const digitCount = valueDigits.length;

  const [digits, setDigits] = useState<DigitState[]>(() =>
    Array.from({ length: digitCount }, (_, i) => ({
      status: i === digitCount - 1 ? "spinning" : "pending", // start with least significant (rightmost visual) spinning
      current: 0,
    }))
  );

  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const completedRef = useRef(false);
  const prevValueRef = useRef<number>(positive);

  // Utility to schedule a timeout and track it
  const schedule = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  // Index mapping: we store digits array left->right for display, but logic easier with least significant first.
  // We'll manage digits as most significant first for rendering, but access target digits with index.
  const targetDigits = valueDigits; // MSB -> LSB

  // Helper to run cascade
  const startCascade = () => {
    clearTimers(timersRef);
    completedRef.current = false;
    // Initialize state
    setDigits(
      targetDigits.map((_, idx) => ({
        // Leftmost (most significant) gets special handling: if its target is 0 mark done immediately
        status:
          idx === 0 && targetDigits[0] === 0
            ? "done"
            : idx === targetDigits.length - 1
            ? "spinning"
            : "pending", // last index (LS digit) starts spinning
        current: 0,
      }))
    );
  };

  // Restart when digit count changes / value changes
  useEffect(() => {
    if (!restartOnValueChange && prevValueRef.current !== positive) {
      // Just snap to value
      setDigits(
        targetDigits.map((d) => ({
          status: "done",
          current: d,
        }))
      );
      prevValueRef.current = positive;
      return;
    }
    if (prevValueRef.current !== positive) {
      prevValueRef.current = positive;
      startCascade();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positive, digitCount, restartOnValueChange]);

  // Core animation effect
  useEffect(() => {
    // Always clear timers when unmounting
    return () => clearTimers(timersRef);
  }, []);

  // Ref to always have latest digits in async callbacks
  const liveDigitsRef = useRef<DigitState[]>(digits);
  useEffect(() => {
    liveDigitsRef.current = digits;
  }, [digits]);

  useEffect(() => {
    const run = () => {
      setDigits((prev) => {
        const next = [...prev];
        let changed = false;
        for (let i = next.length - 1; i >= 0; i--) {
          const ds = next[i];
          if (ds.status === "spinning") {
            const targetDigit = targetDigits[i];
            const isMostSignificant = i === 0; // leftmost
            if (isMostSignificant) {
              // New behavior: mimic two-phase (spin then settle) but only up to target (no full 0-9 cycle)
              if (targetDigit === 0) {
                ds.status = "done";
                changed = true;
              } else {
                const easing = Math.max(1, Math.min(leftmostEasingSteps, targetDigit));
                const fastThreshold = targetDigit - easing; // last 'easing' steps go slow
                if (ds.current < fastThreshold) {
                  ds.current += 1; // fast phase
                  changed = true;
                  if (ds.current >= fastThreshold) {
                    ds.status = "settling"; // enter slow phase
                    changed = true;
                  }
                } else {
                  // Already in or beyond threshold -> ensure settling
                  if (ds.current < targetDigit) {
                    ds.status = "settling";
                    changed = true;
                  }
                }
              }
            } else {
              if (ds.current < 9) {
                ds.current += 1;
                changed = true;
                if (ds.current === 9) {
                  ds.status = "settling";
                  if (i - 1 >= 0 && next[i - 1].status === "pending") {
                    next[i - 1].status = "spinning";
                    next[i - 1].current = 0;
                  }
                }
              }
            }
          } else if (ds.status === "settling") {
            const targetDigit = targetDigits[i];
            if (ds.current === targetDigit) {
              ds.status = "done";
              changed = true;
            } else {
              if (i === 0) {
                // Leftmost: simple direct increment to target (single slower step)
                ds.current = Math.min(targetDigit, ds.current + 1);
              } else {
                ds.current =
                  direction === "forward" ? (ds.current + 1) % 10 : (ds.current + 9) % 10;
              }
              changed = true;
            }
          }
        }
        if (!changed) return prev;
        return next.map((d) => ({ ...d }));
      });

      const state = liveDigitsRef.current;
      const anySpinning = state.some((d) => d.status === "spinning");
      const anySettling = state.some((d) => d.status === "settling");
      if (anySpinning || anySettling) {
        schedule(run, anySpinning ? spinSpeedMs : settleSpeedMs);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    };

    const active = digits.some((d) => d.status === "spinning" || d.status === "settling");
    if (active && timersRef.current.length === 0) {
      schedule(run, spinSpeedMs);
    }
    // Cleanup when digits array resets (value change)
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits, spinSpeedMs, settleSpeedMs, direction, targetDigits.join(":")]);

  // Style helpers
  const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");
  const baseDigitClass = cx(
    "inline-flex items-center justify-center select-none",
    monospace && "font-mono",
    digitClassName
  );

  const showGrouping = useGrouping && digitCount >= 4;

  return (
    <div className={cx("flex items-center", className)} aria-label={`value-${positive}`}>
      {digits.map((d, idx) => {
        const elements: React.ReactNode[] = [];
        elements.push(
          <span
            key={`d-${idx}`}
            className={baseDigitClass}
            data-status={d.status}
            style={{
              minWidth: "0.75em",
              transition: "color 300ms, transform 200ms",
              fontVariantNumeric: "tabular-nums",
              opacity: d.status === "pending" ? 0.3 : 1,
            }}
          >
            {d.current}
          </span>
        );

        // Insert separator after this digit when appropriate
        if (showGrouping && idx !== digitCount - 1 && (digitCount - (idx + 1)) % 3 === 0) {
          elements.push(
            <span
              key={`s-${idx}`}
              className={cx("px-1 select-none", separatorClassName)}
              aria-hidden
            >
              {separator}
            </span>
          );
        }
        return elements;
      })}
    </div>
  );
};

export default SlotMachinEffect;
