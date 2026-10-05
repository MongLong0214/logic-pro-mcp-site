"use client";

import { useState } from "react";
import Link from "next/link";
import { CopyCommand } from "./copy-command";
import { productFacts, doctorCommand } from "../content/product-facts";
import { pageRecords } from "../content/page-records";

const clients = [
  { id: "claude-code", name: "Claude Code", route: "/install/claude-code", location: "User-scoped CLI registration", step: 1 },
  { id: "claude-desktop", name: "Claude Desktop", route: "/install/claude-desktop", location: "claude_desktop_config.json · merge with existing servers", step: 2 },
  { id: "cursor", name: "Cursor", route: "/install/cursor", location: ".cursor/mcp.json · project or global scope", step: 2 },
  { id: "vscode", name: "VS Code", route: "/install/vscode", location: ".vscode/mcp.json · uses servers, not mcpServers", step: 2 },
] as const;

export function InstallDesk() {
  const [selected, setSelected] = useState(0);
  const client = clients[selected];
  const registrationStep = pageRecords[client.route].steps[client.step];
  const registration = "command" in registrationStep ? registrationStep.command : undefined;
  const items = [
    { title: "Install the local server", command: productFacts.installCommand, step: "install" as const },
    { title: client.location, command: registration, step: "register" as const },
    { title: "Inspect permissions and readiness", command: productFacts.permissionCommand + "\n" + doctorCommand(client.id), step: "doctor" as const },
  ];
  return <div className="install-desk">
    <div className="client-switch" role="group" aria-label="Choose your MCP client">
      {clients.map((item, index) => <button key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.name}</button>)}
    </div>
    <div className="install-columns">{items.map((item, index) => <article key={item.step}>
      <div className="install-step-heading"><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3></div>
      {item.command ? <CopyCommand key={client.id + item.step} command={item.command} label="Copy command" event={{ name: "install_command_copied", page: "/", placement: "workflow", destination_host: "", client: client.id, command_step: item.step }} /> : <p>Use the complete setup guide below for this registration step.</p>}
    </article>)}</div>
    <div className="install-after"><p>Grant permissions to the application that launches the server. A connected client is discovery—not proof of a verified Logic write.</p><Link href={client.route}>Complete {client.name} setup</Link></div>
  </div>;
}
