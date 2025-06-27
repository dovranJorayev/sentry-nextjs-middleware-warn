import { envConfig } from '@shared/config';
import { Instrumentation } from 'next';

export const onRequestError: Instrumentation.onRequestError = async (
  ...args
) => {
  if (envConfig.sentryDisabled) return;

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { onRequestError } = await import('./instrumentation.node');
    return onRequestError(...args);
  }
};

export const register = async () => {
  if (envConfig.sentryDisabled) return;

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { register } = await import('./instrumentation.node');
    return register();
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    const { register } = await import('./instrumentation.edge');
    return register();
  }
};
