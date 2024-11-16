import React from "react";
import { Name } from "../components/Name";
import { myPeerId } from "../systems/peerId";
import { usePeersStore } from "../systems/PeerStore";
import { name2Color } from "../util";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { DateTime } from "luxon";

export function PingTable() {
  const { knownPeers, lastSentPing: _ } = usePeersStore(
    ({ knownPeers, lastSentPing }) => ({ knownPeers, lastSentPing })
  );
  const now = DateTime.now();

  return (
    <table className="pingtable" style={{ margin: 4 }}>
      <thead>
        <tr>
          <td>Peer Id</td>
          <td>Last Seen</td>
          <td style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Ping</span> <ChartBarIcon height={"1em"} />
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ color: name2Color(myPeerId, true), maxWidth: "30vh" }}>
            {window.webxdc.selfName} [me] <br /> <small>({myPeerId})</small>
          </td>
          <td>-</td>
          <td style={{ textAlign: "end" }}>-</td>
        </tr>
        {Object.keys(knownPeers).map((peerId) => {
          const peer = knownPeers[peerId];
          return (
            <tr>
              <td
                style={{
                  color: name2Color(peer.peerId, false),
                  maxWidth: "30vh",
                }}
              >
                <Name peerId={peer.peerId} /> <br />{" "}
                <small>({peer.peerId})</small>
              </td>
              <td>
                {
                  now
                    .diff(DateTime.fromMillis(peer.last_seen))
                    .shiftTo("seconds").seconds
                }s
                <br />
                <small>({DateTime.fromMillis(peer.last_seen).toFormat("tt")})</small>
              </td>
              <td style={{ textAlign: "end" }}>{peer.lastPing?.ping}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
