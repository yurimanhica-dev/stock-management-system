export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  baseURL: process.env.AUTH0_BASE_URL,
}

export const ROLES = {
  EVENT_MANAGER: 'event_manager',
  SALES_PERSON: 'sales_person',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
