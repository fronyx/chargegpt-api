export async function waitPromise(args: { duration: number; }): Promise<void> {
  const duration = args.duration ?? 300;
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}
