// Docs: https://dev.streamlabs.com/docs/socket-api

export enum EStreamLabsEventType {
  DONATION = "donation",
  FOLLOW = "follow",
  SUBSCRIPTION = "subscription",
  BITS = "bits",
  RAID = "raid",
  TWITCH_CHARITY_DONATION = "twitchcharitydonation",
  SUPERCHAT = "superchat",
  MEMBERSHIP_GIFT = "membershipGift"
}

export enum EStreamLabsEventFor {
  STREAMLABS = "streamlabs",
  TWITCH_ACCOUNT = "twitch_account",
  YOUTUBE_ACCOUNT = "youtube_account",
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
  { eventFor: EStreamLabsEventFor.STREAMLABS, eventType: EStreamLabsEventType.DONATION, event: "Donations" },

  { eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT, eventType: EStreamLabsEventType.FOLLOW, event: "Twitch Follow" },
  { eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT, eventType: EStreamLabsEventType.SUBSCRIPTION, event: "Twitch Subscription" },
  { eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT, eventType: EStreamLabsEventType.BITS, event: "Twitch Bits" },
  { eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT, eventType: EStreamLabsEventType.RAID, event: "Twitch Raid" },
  { eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT, eventType: EStreamLabsEventType.TWITCH_CHARITY_DONATION, event: "Twitch Charity Donation" },

  { eventFor: EStreamLabsEventFor.YOUTUBE_ACCOUNT, eventType: EStreamLabsEventType.FOLLOW, event: "YouTube Subscription" },
  { eventFor: EStreamLabsEventFor.YOUTUBE_ACCOUNT, eventType: EStreamLabsEventType.SUBSCRIPTION, event: "YouTube Subscriber" },
  { eventFor: EStreamLabsEventFor.YOUTUBE_ACCOUNT, eventType: EStreamLabsEventType.SUPERCHAT, event: "YouTube Superchats" },
  { eventFor: EStreamLabsEventFor.YOUTUBE_ACCOUNT, eventType: EStreamLabsEventType.MEMBERSHIP_GIFT, event: "YouTube Membership Gift" },
];

export function getEventLabel(eventType: EStreamLabsEventType, eventFor: EStreamLabsEventFor): string {
  return streamlabs_events.find((e: EventEntry) => e.eventType === eventType && e.eventFor === eventFor)?.event ?? "Unknown Event";
}
