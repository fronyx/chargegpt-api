export function axiosRetryDelayFunction(args: {
  maxRetry: number;
}): (retries: number) => number {
  const delayMs = 10000;
  const backoffMs = 5000;
  return (retries) => {
    return delayMs + (args.maxRetry - retries) * backoffMs;
  }
}
