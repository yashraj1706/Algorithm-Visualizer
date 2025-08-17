import React, { useState, useEffect, useRef } from "react";
import { AlgorithmRegistry } from "./Algorithms.js";
import "./SortComp.css";

const PRIMARY_COLOR = "#f8d7a3"; // bar base color (soft sand)
const SECONDARY_COLOR = "#22d3ee"; // highlight (cyan)

const algorithmOptions = Object.keys(AlgorithmRegistry);

// Time complexities for display
const complexities = {
  "Merge Sort": "O(n log n)",
  "Quick Sort": "O(n log n) avg, O(n²) worst",
  "Heap Sort": "O(n log n)",
  "Bubble Sort": "O(n²)",
  "Insertion Sort": "O(n²)",
  "Selection Sort": "O(n²)",
  "Shell Sort": "≈ O(n^(3/2))",
  "Cocktail Sort": "O(n²)",
};

const formatTime = (ms) => {
  if (ms == null) return "—";
  const total = Math.max(0, Math.round(ms));
  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const millis = total % 1000;
  if (minutes > 0)
    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(
      millis
    ).padStart(3, "0")}`;
  return `${seconds}.${String(millis).padStart(3, "0")}s`;
};

const SortComp = () => {
  const [array, setArray] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [noOfElems, setNoOfElems] = useState(30);
  const [speed, setSpeed] = useState(60); // 1..100, higher = faster
  const [disabledOrNot, setDisabledOrNot] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState(algorithmOptions[0]);
  const [maxHeight, setMaxHeight] = useState(
    Math.max(120, (window.visualViewport?.height || window.innerHeight) - 160)
  );

  // Timer + stats
  const [currentAlgo, setCurrentAlgo] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [lastAlgo, setLastAlgo] = useState(null);
  const [lastElapsedMs, setLastElapsedMs] = useState(null);

  // Track timeouts to enable Stop
  const timeoutsRef = useRef([]);
  const controlsRef = useRef(null);
  const timerStartRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    resetArray();
    // Load persisted last-run stats
    try {
      const la = localStorage.getItem("algoVis:lastAlgo");
      const lm = localStorage.getItem("algoVis:lastMs");
      if (la) setLastAlgo(la);
      if (lm) setLastElapsedMs(Number(lm));
    } catch {}
    const update = () => {
      setWidth(window.innerWidth);
      const headerH = controlsRef.current
        ? controlsRef.current.offsetHeight
        : 120;
      const vh = window.visualViewport?.height || window.innerHeight;
      // Leave a small bottom safety gap (12px desktop, 20px mobile)
      const bottomGap = vh <= 600 ? 20 : 12;
      setMaxHeight(Math.max(120, vh - headerH - bottomGap));
      const max = getMaxElements(window.innerWidth);
      setNoOfElems((prev) => Math.min(prev, max));
    };
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const getMaxElements = (w) => {
    const approxBar = 10; // px per bar incl. gap
    const usable = Math.max(320, Math.floor(w * 0.9));
    return Math.max(8, Math.floor(usable / approxBar));
  };

  // Map slider (1 slow .. 100 fast) to delay milliseconds
  const mapSpeedToDelay = (s) => {
    const minDelay = 5; // fastest
    const maxDelay = 120; // slowest
    const clamped = Math.max(1, Math.min(100, s));
    // linear inverse mapping
    return Math.round(maxDelay - (clamped - 1) * ((maxDelay - minDelay) / 99));
  };

  const startAnimation = () => setDisabledOrNot(true);
  const endAnimation = () => setDisabledOrNot(false);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  const resetBarColors = () => {
    const bars = document.getElementsByClassName("array-bar");
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.backgroundColor = PRIMARY_COLOR;
    }
  };

  // Timer helpers
  const startTimer = (algoName) => {
    // Move previous complete run to last if available
    if (currentAlgo && !disabledOrNot && elapsedMs > 0) {
      setLastAlgo(currentAlgo);
      setLastElapsedMs(elapsedMs);
    }
    setCurrentAlgo(algoName);
    setElapsedMs(0);
    timerStartRef.current = performance.now();
    const tick = () => {
      setElapsedMs(performance.now() - timerStartRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };
  const stopTimer = (recordFinal = true) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (recordFinal) {
      const final = performance.now() - timerStartRef.current;
      setElapsedMs(final);
      // Persist the most recent completed run for next session
      try {
        if (currentAlgo) {
          localStorage.setItem("algoVis:lastAlgo", currentAlgo);
          localStorage.setItem("algoVis:lastMs", String(final));
        }
      } catch {}
    }
  };

  const resetArray = () => {
    clearAllTimeouts();
    resetBarColors();
    const newArray = Array.from({ length: noOfElems }, () =>
      randomIntFromInterval(20, 420)
    );
    setArray(newArray);
    endAnimation();
  };

  const stopSorting = () => {
    clearAllTimeouts();
    resetBarColors();
    stopTimer(false);
    endAnimation();
  };
  const scheduleEnd = (stepsCount, delayMs) => {
    const id = setTimeout(() => {
      stopTimer(true);
      endAnimation();
    }, Math.max(0, stepsCount * delayMs + 10));
    timeoutsRef.current.push(id);
  };

  // Runner for step format
  const runSteps = (steps) => {
    startAnimation();
    const delayMs = mapSpeedToDelay(speed);
    const maxVal = Math.max(1, ...array);
    const scale = maxHeight / maxVal;
    steps.forEach((step, i) => {
      const id = setTimeout(() => {
        const bars = document.getElementsByClassName("array-bar");
        switch (step.type) {
          case "highlight": {
            const [a, b] = step.indices;
            if (bars[a]) bars[a].style.backgroundColor = SECONDARY_COLOR;
            if (bars[b]) bars[b].style.backgroundColor = SECONDARY_COLOR;
            break;
          }
          case "unhighlight": {
            const [a, b] = step.indices;
            if (bars[a]) bars[a].style.backgroundColor = PRIMARY_COLOR;
            if (bars[b]) bars[b].style.backgroundColor = PRIMARY_COLOR;
            break;
          }
          case "set": {
            const idx = step.index;
            if (bars[idx]) {
              const h = Math.max(2, Math.round(step.value * scale));
              bars[idx].style.height = `${h}px`;
              bars[idx].textContent = step.value;
            }
            break;
          }
          case "mark": {
            const idx = step.index;
            const color = step.color || SECONDARY_COLOR;
            if (bars[idx]) bars[idx].style.backgroundColor = color;
            break;
          }
          default:
            break;
        }
      }, i * delayMs);
      timeoutsRef.current.push(id);
    });
    scheduleEnd(steps.length, delayMs);
  };

  const handleSort = () => {
    const fn = AlgorithmRegistry[selectedAlgo];
    if (!fn) return;
    // Move previous completed run to last right before a new run starts
    if (currentAlgo && !disabledOrNot && elapsedMs > 0) {
      setLastAlgo(currentAlgo);
      setLastElapsedMs(elapsedMs);
    }
    startTimer(selectedAlgo);
    runSteps(fn(array.slice()));
  };

  const maxVal = Math.max(1, ...array);
  const scale = maxHeight / maxVal;
  const barWidth = Math.max(
    4,
    Math.floor((width * 0.9) / Math.max(1, noOfElems)) - 2
  );

  const deltaMs = lastElapsedMs != null ? elapsedMs - lastElapsedMs : null;

  return (
    <div className="container">
      <div ref={controlsRef} className="controls">
        <div className="control-group">
          <label htmlFor="algo-select">Algorithm</label>
          <select
            id="algo-select"
            className="select"
            value={selectedAlgo}
            disabled={disabledOrNot}
            onChange={(e) => setSelectedAlgo(e.target.value)}
          >
            {algorithmOptions.map((name) => (
              <option key={name} value={name} title={complexities[name] || ""}>
                {name} — {complexities[name] || "—"}
              </option>
            ))}
          </select>
        </div>
        <div className="input-container">
          <div className="control-group">
            <label>Elements: {noOfElems}</label>
            <input
              type="range"
              min={8}
              max={getMaxElements(width)}
              value={noOfElems}
              disabled={disabledOrNot}
              onChange={(e) => setNoOfElems(Number(e.target.value))}
              onMouseUp={resetArray}
              onTouchEnd={resetArray}
            />
          </div>

          <div className="control-group ">
            <label>Speed: {speed}</label>
            <input
              type="range"
              min={1}
              max={100}
              value={speed}
              disabled={disabledOrNot}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <div className="speed-scale">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        <div className="stats">
          <div
            className="stat-line"
            title={currentAlgo ? complexities[currentAlgo] || "" : ""}
          >
            <span className="muted">Current:</span>{" "}
            <strong>{currentAlgo || "—"}</strong>
            {currentAlgo && (
              <span className="complexity">({complexities[currentAlgo]})</span>
            )}
            <span className="time">
              {formatTime(
                disabledOrNot ? elapsedMs : currentAlgo ? elapsedMs : null
              )}
            </span>
          </div>
          <div className="stat-line">
            <span className="muted">Last:</span>{" "}
            <strong>{lastAlgo || "—"}</strong>
            {lastAlgo && (
              <span className="complexity">
                ({complexities[lastAlgo] || "?"})
              </span>
            )}
            <span className="time">{formatTime(lastElapsedMs)}</span>
            {lastElapsedMs != null && currentAlgo && (
              <span className={`delta ${deltaMs < 0 ? "faster" : "slower"}`}>
                {deltaMs < 0 ? "−" : "+"}
                {formatTime(Math.abs(deltaMs))}
              </span>
            )}
          </div>
        </div>

        <div className="buttons">
          <button
            onClick={resetArray}
            disabled={disabledOrNot}
            className="btn secondary"
          >
            Shuffle
          </button>
          <button
            onClick={handleSort}
            disabled={disabledOrNot}
            className="btn primary"
          >
            Sort
          </button>
          <button onClick={stopSorting} className="btn danger">
            Stop
          </button>
        </div>
      </div>

      <div className="arr-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              height: `${Math.max(2, Math.round(value * scale))}px`,
              width: `${barWidth}px`,
              fontSize: "9px",
              color: "black",
              fontWeight: "bold",
              writingMode: "vertical-rl",
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

//Function to generate number of elements to sort.
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SortComp;
