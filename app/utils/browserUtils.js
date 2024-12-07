export const isBrowser = () => typeof window !== 'undefined';

export const registerLoaders = () => {
  if (isBrowser()) {
    const { ripples, quantum } = require('ldrs');
    ripples.register();
    quantum.register();
  }
};