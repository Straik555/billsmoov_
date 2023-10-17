const providersSelected = user => ['CONTACTING_PROVIDERS', 'MANUAL_INVOICE_SEND'].includes(user.status)
  || (user.providers.length && !user.providers.every(provider => provider.status === 'NEW'));

export const signupInProgress = user => !user || !user.emailVerified || !providersSelected(user);
