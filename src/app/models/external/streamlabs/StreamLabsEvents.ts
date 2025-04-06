// Docs: https://dev.streamlabs.com/docs/socket-api

export enum EStreamLabsEventType {
  DONATION = "donation",
  FOLLOW = "follow",
  SUBSCRIPTION = "subscription",
  HOST = "host",
  BITS = "bits",
  RAIDS = "raids",
  SUPERCHAT = "superchat",
}

export enum EStreamLabsEventFor {
  STREAMLABS = "streamlabs",
  TWITCH_ACCOUNT = "twitch_account",
  YOUTUBE_ACCOUNT = "youtube_account",
  MIXER_ACCOUNT = "mixer_account",
}

export type EventEntry = {
  eventType: EStreamLabsEventType;
  eventFor: EStreamLabsEventFor;
  event: string;
};

export type StreamLabsEvent = {
  eventType: EStreamLabsEventType;
  eventFor: EStreamLabsEventFor;
}

export const streamlabs_events: EventEntry[] = [
  { eventType: EStreamLabsEventType.DONATION, eventFor: EStreamLabsEventFor.STREAMLABS, event: "Donations" },
  { eventType: EStreamLabsEventType.FOLLOW, eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT, event: "Twitch Follow" },
  { eventType: EStreamLabsEventType.SUBSCRIPTION, eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT, event: "Twitch Subscription" },
  { eventType: EStreamLabsEventType.HOST, eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT, event: "Twitch Host" },
  { eventType: EStreamLabsEventType.BITS, eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT, event: "Twitch Bits" },
  { eventType: EStreamLabsEventType.RAIDS, eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT, event: "Twitch Raids" },
  { eventType: EStreamLabsEventType.FOLLOW, eventFor: EStreamLabsEventFor.YOUTUBE_ACCOUNT, event: "YouTube Subscription" },
  { eventType: EStreamLabsEventType.SUBSCRIPTION, eventFor: EStreamLabsEventFor.YOUTUBE_ACCOUNT, event: "YouTube Subscriber" },
  { eventType: EStreamLabsEventType.SUPERCHAT, eventFor: EStreamLabsEventFor.YOUTUBE_ACCOUNT, event: "YouTube Superchats" },
  { eventType: EStreamLabsEventType.FOLLOW, eventFor: EStreamLabsEventFor.MIXER_ACCOUNT, event: "Mixer Follow" },
  { eventType: EStreamLabsEventType.SUBSCRIPTION, eventFor: EStreamLabsEventFor.MIXER_ACCOUNT, event: "Mixer Subscription" },
  { eventType: EStreamLabsEventType.HOST, eventFor: EStreamLabsEventFor.MIXER_ACCOUNT, event: "Mixer Host" },
];

export function getEventLabel(eventType: EStreamLabsEventType, eventFor: EStreamLabsEventFor): string {
  return streamlabs_events.find((e: EventEntry) => e.eventType === eventType && e.eventFor === eventFor)?.event ?? "Unknown Event";
}
