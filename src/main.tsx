import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import "./systems/peerId";
import { StatusUpdateReadyPromise } from "./connection";
import { HeaderStats } from "./DebugUI/HeaderStats";
import { useDisplayNames } from "./systems/DisplayNameStore";
import PingGraph from "./DebugUI/PingGraph";
import { PingTable } from "./DebugUI/PingTable";
import { usePeersStore } from "./systems/PeerStore";

export function App() {
  const [readyStatusUpdate, setReadyStatusUpdate] = useState(false);
  const [hideGraphLabel, setHideGraphLabel] = useState(false);
  const lastSentPing = usePeersStore(({ lastSentPing }) => lastSentPing);

  useEffect(() => {
    useDisplayNames.getState().requestNames();
    StatusUpdateReadyPromise.then(() => setReadyStatusUpdate(true));
  }, []);

  return (
    <div className="main-view">
      <h2>Realtime Check</h2>
      <HeaderStats />

      {readyStatusUpdate || "Processing old updates"}
      <PingTable />
      <PingGraph hideLabel={hideGraphLabel} />
      <div>
        <button onClick={() => setHideGraphLabel(!hideGraphLabel)}>
          {`${hideGraphLabel ? "Show" : "Hide"} Graph Node Label`}
        </button>
        <div style={{ float: "right" }}>{lastSentPing?.ts}</div>
      </div>
    </div>
  );
}

window.onload = () => {
  const root = createRoot(document.getElementById("app")!);
  root.render(<App />);
};
