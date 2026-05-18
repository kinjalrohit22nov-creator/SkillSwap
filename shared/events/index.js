// Event names for Redis Pub/Sub
export const EVENTS = {
  // User events
  USER_REGISTERED: 'user:registered',
  USER_PROFILE_UPDATED: 'user:profile:updated',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',

  // Match events
  MATCH_FOUND: 'match:found',
  MATCH_ACCEPTED: 'match:accepted',
  MATCH_REJECTED: 'match:rejected',

  // Session events
  SESSION_BOOKED: 'session:booked',
  SESSION_STARTED: 'session:started',
  SESSION_ENDED: 'session:ended',
  SESSION_CANCELLED: 'session:cancelled',

  // Token events
  TOKENS_EARNED: 'tokens:earned',
  TOKENS_SPENT: 'tokens:spent',
  TRANSACTION_COMPLETED: 'transaction:completed',

  // Notification events
  NOTIFICATION_SENT: 'notification:sent',
} as const

export type EventKey = keyof typeof EVENTS
export type EventValue = (typeof EVENTS)[EventKey]
