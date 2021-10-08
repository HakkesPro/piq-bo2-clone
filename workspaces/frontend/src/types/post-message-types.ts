export enum eventTypes {
  PIQ_BO_SET_MID = 'PIQ_BO_SET_MID',
  PIQ_BO_SET_PATH = 'PIQ_BO_SET_PATH',
  OPEN_SUPPORT_WIDGET = 'OPEN_SUPPORT_WIDGET'
}

export interface BasePostMessagePayload {
  eventType: eventTypes;
}

export interface NotifyLegacyBoSetMid extends BasePostMessagePayload {
  mId: number;
}

// Add | NotifySomeThingElse when new types are added
export interface SetNewBoPath extends BasePostMessagePayload {
  path: string;
}
