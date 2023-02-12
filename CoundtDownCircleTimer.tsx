import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";

// v
const reactEffectBasedOnWindow =
  typeof window == "undefined" ? useEffect : useLayoutEffect;

// I
const ElapsedTime = ({
  isPlaying,
  duration,
  startAt = 0,
  updateInterval = 0,
  onComplete,
  onUpdate,
}) => {
  const [startAtState, setStartAtState] = useState(startAt);
  const l = useRef(0);
  const p = useRef(startAt);
  const d = useRef(startAt * -1e3);
  const s = useRef(null);
  const c = useRef(null);
  const C = useRef(null);
  const h = useCallback(
    (f) => {
      let a = f / 1e3;
      if (c.current === null) {
        (c.current = a), (s.current = requestAnimationFrame(h));
        return;
      }
      let $ = a - c.current,
        g = l.current + $;
      (c.current = a), (l.current = g);
      let R =
          p.current +
          (updateInterval === 0
            ? g
            : ((g / updateInterval) | 0) * updateInterval),
        D = p.current + g,
        P = typeof duration == "number" && D >= duration;
      setStartAtState(P ? duration : R),
        P || (s.current = requestAnimationFrame(h));
    },
    [duration, updateInterval]
  );
  const y = () => {
    s.current && cancelAnimationFrame(s.current),
      C.current && clearTimeout(C.current),
      (c.current = null);
  };
  const b = useCallback(
    (f) => {
      y(), (l.current = 0);
      let a = typeof f == "number" ? f : startAt;
      (p.current = a),
        setStartAtState(a),
        isPlaying && (s.current = requestAnimationFrame(h));
    },
    [h, isPlaying, startAt]
  );
  return (
    reactEffectBasedOnWindow(() => {
      if (
        (onUpdate == null || onUpdate(startAtState),
        duration && startAtState >= duration)
      ) {
        d.current += duration * 1e3;
        let {
          shouldRepeat: f = !1,
          delay: a = 0,
          newStartAt: $,
        } = (onComplete == null ? void 0 : onComplete(d.current / 1e3)) || {};
        f && (C.current = setTimeout(() => b($), a * 1e3));
      }
    }, [startAtState, duration]),
    reactEffectBasedOnWindow(
      () => (isPlaying && (s.current = requestAnimationFrame(h)), y),
      [isPlaying, duration, updateInterval]
    ),
    { elapsedTime: startAtState, reset: b }
  );
};
// A
const Circle = (o, e, n) => {
  let t = o / 2,
    i = e / 2,
    r = t - i,
    u = 2 * r,
    m = n === "clockwise" ? "1,0" : "0,1",
    l = 2 * Math.PI * r;
  return {
    path: `m ${t},${i} a ${r},${r} 0 ${m} 0,${u} a ${r},${r} 0 ${m} 0,-${u}`,
    pathLength: l,
  };
};
// T
const StyleComp = (o) => ({ position: "relative", width: o, height: o });
// B
const B: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};
// W
const MyCountDownCircleTimer = (o) => {
  let { children: e, strokeLinecap: n, trailColor: t, trailStrokeWidth: i } = o,
    {
      path,
      pathLength,
      stroke,
      strokeDashoffset,
      remainingTime,
      elapsedTime,
      size,
      strokeWidth,
    } = CountDown(o);
  return React.createElement(
    "div",
    { style: StyleComp(size) },
    React.createElement(
      "svg",
      {
        viewBox: `0 0 ${size} ${size}`,
        width: size,
        height: size,
        xmlns: "http://www.w3.org/2000/svg",
      },
      React.createElement("path", {
        d: path,
        fill: "none",
        stroke: t != null ? t : "#d9d9d9",
        strokeWidth: i != null ? i : strokeWidth,
      }),
      React.createElement("path", {
        d: path,
        fill: "none",
        stroke: stroke,
        strokeLinecap: n != null ? n : "round",
        strokeWidth: strokeWidth,
        strokeDasharray: pathLength,
        strokeDashoffset: strokeDashoffset,
      })
    ),
    typeof e == "function" &&
      React.createElement(
        "div",
        { style: B },
        e({
          remainingTime: remainingTime,
          elapsedTime: elapsedTime,
          color: stroke,
        })
      )
  );
};
// j
const Stroke = (o, e) => {
  let { colors, colorsTime, isSmoothColorTransition = !0 } = o;
  const d =
    colorsTime == null
      ? void 0
      : colorsTime.findIndex((s, c) => s >= e && e >= colorsTime[c + 1]);
  if (typeof colors == "string") return colors;
  const r = d !== null ? d : -1;
  if (!colorsTime || r === -1) return colors[0];
  if (!isSmoothColorTransition) return colors[r];
  let u = colorsTime[r] - e,
    m = colorsTime[r] - colorsTime[r + 1],
    l = F(colors[r]),
    p = F(colors[r + 1]);
  return `rgb(${l
    .map((s, c) => StrokeDashOffset(u, s, p[c] - s, m) | 0)
    .join(",")})`;
};

// G
const StrokeDashOffset = (
  elapsedTime: number,
  e: number,
  pathLength: number,
  duration: number
) => {
  if (duration === 0) return e;
  let i = elapsedTime / duration;
  return e + pathLength * i;
};

const F = (isPlaying) => {
  var e, n;
  return (n =
    (e = isPlaying
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (t, i, r, u) => `#${i}${i}${r}${r}${u}${u}`
      )
      .substring(1)
      .match(/.{2}/g)) == null
      ? void 0
      : e.map((t) => parseInt(t, 16))) != null
    ? n
    : [];
};
// k
const NewStartAt = (o, e) =>
  o === 0 || o === e ? 0 : typeof e == "number" ? o - e : 0;
// S
const CountDown = (o) => {
  let {
      duration,
      initialRemainingTime,
      updateInterval,
      size = 180,
      strokeWidth = 12,
      trailStrokeWidth,
      isPlaying = !1,
      rotation = "clockwise",
      onComplete,
      onUpdate,
    } = o,
    s = useRef(0),
    c = Math.max(strokeWidth, trailStrokeWidth != null ? trailStrokeWidth : 0),
    { path, pathLength } = Circle(size, c, rotation),
    { elapsedTime } = ElapsedTime({
      isPlaying,
      duration,
      startAt: NewStartAt(duration, initialRemainingTime),
      updateInterval: updateInterval,
      onUpdate:
        typeof onUpdate == "function"
          ? (f) => {
              let a = Math.ceil(duration - f);
              a !== s.current && ((s.current = a), onUpdate(a));
            }
          : void 0,
      onComplete:
        typeof onComplete == "function"
          ? (f) => {
              var R;
              let {
                shouldRepeat = false,
                delay = 0,
                newInitialRemainingTime = 0,
              } = (R = onComplete(f)) != null ? R : {};
              if (shouldRepeat)
                return {
                  shouldRepeat,
                  delay: delay,
                  newStartAt: NewStartAt(duration, newInitialRemainingTime),
                };
            }
          : void 0,
    }),
    b = duration - elapsedTime;
  return {
    elapsedTime,
    path: path,
    pathLength,
    remainingTime: Math.ceil(b),
    rotation,
    size,
    stroke: Stroke(o, b),
    strokeDashoffset: StrokeDashOffset(elapsedTime, 0, pathLength, duration),
    strokeWidth,
  };
};
MyCountDownCircleTimer.displayName = "CountdownCircleTimer";
export default MyCountDownCircleTimer;
