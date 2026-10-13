export const users = {
  standard: {
    username: 'jean_dupont',
    password: 'Baguette42!',
  },

  locked: {
    username: 'compte_banni',
    password: 'Baguette42!',
  },

  problem: {
    username: 'client_chaos',
    password: 'Baguette42!',
  },

  performance: {
    username: 'tortue_du_web',
    password: 'Baguette42!',
  },
} as const;

export type User = (typeof users)[keyof typeof users];