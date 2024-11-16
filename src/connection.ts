import { encode, decode } from "@msgpack/msgpack";

import { useDisplayNames } from "./systems/DisplayNameStore";
import { myPeerId } from "./systems/peerId";
import { usePeersStore } from "./systems/PeerStore";
import {
  DisplaynamePackets,
  EpermeralPacket,
  EpermeralPayload,
  Payload,
  PingPackets,
  StatusPacket,
} from "./types";

const RealtimeChannel = window.webxdc.joinRealtimeChannel();

RealtimeChannel.setListener((raw_data) => {
  const packet = decode(raw_data) as EpermeralPayload;
  // sort packets to to right handler
  // ts is not smart enough yet, so we need to handle the type conversion ourselves

  if (packet.payload.type.startsWith("ping.")) {
    usePeersStore.getState().processPackage(packet as Payload<PingPackets>);
  }

  if (packet.payload.type.startsWith("displayname.")) {
    useDisplayNames
      .getState()
      .processPackage(packet as Payload<DisplaynamePackets>);
  }

  console.debug("[IN]", packet.peerId, packet.payload.type, packet.payload);
});

export function sendPacket(packet: EpermeralPacket) {
  console.debug("[OUT]", packet.type, packet);
  RealtimeChannel.send(encode({ peerId: myPeerId, payload: packet }));
}

export const StatusUpdateReadyPromise =
  window.webxdc?.setUpdateListener((update) => {
    const packet = update.payload;
    // sort packets to to right handler
    // note: ts is not smart enough yet, so we need to handle the type conversion ourselves

    console.debug("{IN}", packet.peerId, packet.payload.type, packet.payload);
  }) || Promise.reject("webxdc does not exist");

export function sendUpdate(packet: StatusPacket) {
  console.debug("{OUT}", packet.type, packet);
  window.webxdc.sendUpdate(
    { payload: { peerId: myPeerId, payload: packet } },
    packet.type,
  );
}
