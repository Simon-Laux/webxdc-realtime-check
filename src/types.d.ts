import { Webxdc } from "@webxdc/types";
import { PeerId } from "./systems/peerId";

// types

export interface PeerPingState {
  peerId: string;
  ping?: number;
  receivedTime: number;
}

export type PeerPingReport = PeerPingState[];

//#region packets

export interface Packet {
  type: `${string}.${string}`;
}

//#region Ping system for PeerStore

export interface PingSystemPacket extends Packet {
  type: `ping.${string}`;
}

/** ping all other peers
 * @sent over p2p channel
 */
export interface PingPacket extends PingSystemPacket {
  type: "ping.ping";
  pingId: string;
}

/** pong the person that pinged
 * @sent over p2p channel
 * @todo if we have whispering implement it for there
 */
export interface PongPacket {
  type: "ping.pong";
  pingId: string;
}

/** when other peer reports it's ping results
 * @sent over p2p channel
 */
export interface PingReportPacket {
  type: "ping.report";
  report: PeerPingReport;
}

export type PingPackets = AllPackets & PingSystemPacket;

//#endregion

//#region displayname
export interface DisplaynameSystemPacket extends Packet {
  type: `displayname.${string}`;
}
export interface DisplaynameRequestPacket {
  type: "displayname.request";
  myName: string;
}
export interface DisplaynameResponsePacket {
  type: "displayname.response";
  myName: string;
}

export type DisplaynamePackets = AllPackets & DisplaynameSystemPacket;

//#endregion

//#region matchmaking
export interface MatchmakingSystemPacket extends Packet {
  type: `match.${string}`;
}

//#endregion

type EpermeralPacket =
  // Ping
  | PingPacket
  | PongPacket
  | PingReportPacket
  // Displayname
  | DisplaynameRequestPacket
  | DisplaynameResponsePacket;
type StatusPacket = Packet;

type AllPackets = EpermeralPacket; // | StatusPacket;

//#endregion

export interface Payload<P extends Packet> {
  peerId: PeerId;
  payload: P;
}

export type StatusPayload = Payload<StatusPacket>;
export type EpermeralPayload = Payload<EpermeralPacket>;

declare global {
  interface Window {
    webxdc: Webxdc<StatusPayload>;
  }
}
