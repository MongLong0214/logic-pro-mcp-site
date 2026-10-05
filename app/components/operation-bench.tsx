"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";

const workflows = [
  { name: "Compose", number: "01", title: "Give an idea a place to play.", intent: "Create an instrument track, import the MIDI, then inspect the resulting region.",
    tools: ["logic_tracks", "logic_midi"], read: "logic://tracks", path: "/use-cases/compose-midi",
    steps: ["Inspect the project and instrument track.", "Name the destination before importing.", "Wait for the import result.", "Read the created region where supported."],
    boundary: "Sending MIDI is not proof of an audible region. Send-only operations retain State B; unverified GM Device or External MIDI lanes cannot establish an audible bounce." },
  { name: "Mix", number: "02", title: "A target, not a guess.", intent: "Inspect a track and plugin slot, apply a supported change, then read the parameter back.",
    tools: ["logic_mixer", "logic_plugins"], read: "logic://mixer", path: "/use-cases/mixer-automation",
    steps: ["Inspect project, strip and plugin identity.", "Bind the requested track and slot.", "Apply only a supported parameter.", "Compare the post-write observation."],
    boundary: "Arrange track ordinals and mixer-strip ordinals are not interchangeable. Unsupported plugin parameters cannot become verified writes." },
  { name: "Deliver", number: "03", title: "The file is the result.", intent: "Audit the project, review an export plan, then inspect the audio files Logic writes.",
    tools: ["logic_project", "logic_audio"], read: "logic://system/operations", path: "/use-cases/batch-export",
    steps: ["Audit the project and destination.", "Review the export plan before running it.", "Complete the required Logic bounce settings.", "Inspect the produced audio artifacts."],
    boundary: "Opening the Bounce dialog is not an exported artifact. File existence alone does not establish that an external MIDI instrument was audible." },
] as const;
const outcomes = [
  { state: "A", name: "Confirmed", detail: "The supported write and its independent readback agree. Confirmation applies to that operation and target—not the whole session.", tone: "confirmed" },
  { state: "B", name: "Uncertain", detail: "The action was attempted, but the result could not be independently verified. Keep the reason; do not turn uncertainty into success.", tone: "uncertain" },
  { state: "C", name: "Failed", detail: "The operation failed or was refused. Inspect the typed error and whether a write was attempted before choosing a recovery.", tone: "failed" },
] as const;

export function OperationBench() {
  const [selected, setSelected] = useState(0);
  const [outcome, setOutcome] = useState(0);
  const flow = workflows[selected];
  function choose(index: number) {
    if (index === selected) return;
    if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const transition = document.startViewTransition(() => flushSync(() => setSelected(index)));
      void transition.finished.catch(() => {});
    } else setSelected(index);
  }
  return <div className="operation-bench">
    <div className="bench-top"><div className="workflow-switch" role="group" aria-label="Explore a workflow">
      {workflows.map((item, index) => <button key={item.name} onClick={() => choose(index)} aria-pressed={selected === index}><span aria-hidden="true">{item.number}</span>{item.name}</button>)}
    </div><span className="example-label">INTERACTIVE EXAMPLE / NOT LIVE</span></div>
    <div className="bench-body">
      <div className="bench-narrative" key={flow.name}><p className="bench-label">INTENT / {flow.name.toUpperCase()}</p><h3>{flow.title}</h3><p>{flow.intent}</p>
        <ol className="flow-steps">{flow.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>
        <Link className="bench-guide" href={flow.path}>Read the {flow.name.toLowerCase()} workflow</Link>
      </div>
      <div className="bench-contract"><p className="bench-label">PUBLIC SURFACE</p>
        <div className="surface-row"><span>ACT</span><div>{flow.tools.map(tool => <code key={tool}>{tool}</code>)}</div></div>
        <div className="surface-row"><span>READ</span><code>{flow.read}</code></div>
        <p className="bench-label result-label">EXPLORE THE OUTCOME CONTRACT</p>
        <div className="outcome-switch" role="group" aria-label="Outcome contract">
          {outcomes.map((item, index) => <button key={item.state} className={item.tone} aria-pressed={outcome === index} onClick={() => setOutcome(index)}><span>{item.state}</span>{item.name}</button>)}
        </div>
        <div className="outcome-explanation" aria-live="polite"><p>{outcomes[outcome].detail}</p></div>
        <div className="boundary-note"><span>THE BOUNDARY</span><p>{flow.boundary}</p></div>
      </div>
    </div>
  </div>;
}
