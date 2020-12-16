import { chainable } from './wrappers';
export function makeChainable<T extends (...args: unknown[]) => unknown>(fn: T) {
  function wrapper(...args: any[]) {
    return {
      fn,
      args,
    };
  }
  return wrapper.bind({ fn }) as (...pams: Parameters<T>) => chainable;
}
