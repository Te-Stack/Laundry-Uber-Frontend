export const queryKeys = {
  // Payments
  payments: {
    all: ['payments'] as const,
    list: () => [...queryKeys.payments.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.payments.all, 'detail', id] as const,
  },

  // Messages
  messages: {
    all: ['messages'] as const,
    conversations: () => [...queryKeys.messages.all, 'conversations'] as const,
    thread: (userId: string) => [...queryKeys.messages.all, 'thread', userId] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: (filter?: string) => [...queryKeys.notifications.all, 'list', filter] as const,
    count: () => [...queryKeys.notifications.all, 'count'] as const,
  },

  // Services
  services: {
    all: ['services'] as const,
    list: (filters?: { category?: string; providerId?: string }) =>
      [...queryKeys.services.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.services.all, 'detail', id] as const,
    myServices: () => [...queryKeys.services.all, 'my'] as const,
  },

  // Providers
  providers: {
    all: ['providers'] as const,
    nearby: (params: { latitude: number; longitude: number; radius?: number }) =>
      [...queryKeys.providers.all, 'nearby', params] as const,
    detail: (id: string) => [...queryKeys.providers.all, 'detail', id] as const,
    schedule: (id: string) => [...queryKeys.providers.all, 'schedule', id] as const,
  },

  // Requests
  requests: {
    all: ['requests'] as const,
    list: () => [...queryKeys.requests.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.requests.all, 'detail', id] as const,
    customer: () => [...queryKeys.requests.all, 'customer'] as const,
    provider: () => [...queryKeys.requests.all, 'provider'] as const,
    pending: () => [...queryKeys.requests.all, 'pending'] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
} as const;
