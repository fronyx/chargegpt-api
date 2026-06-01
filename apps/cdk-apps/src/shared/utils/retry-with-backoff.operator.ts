import { delay, mergeMap, Observable, of, retryWhen, throwError } from 'rxjs';

const DEFAULT_MAX_RETRY = 5;
const DEFAULT_BACKOFF = 1000;

export function retryWithBackoffOperator(delayMs: number, maxRetry: number = DEFAULT_MAX_RETRY, backoffMs: number = DEFAULT_BACKOFF) {
  let retries = maxRetry;

  return (src: Observable<any>) =>
    src.pipe(
      retryWhen((errors: Observable<any>) => errors.pipe(
        mergeMap(error => {
          if (retries-- > 0) {
            const backoffTime = delayMs + (maxRetry - retries) * backoffMs;
            return of(error).pipe(delay(backoffTime));
          }

          return throwError(() => new Error(getErrorMessage(maxRetry)));
        })
      ))
    );
}

function getErrorMessage(maxRetry: number) {
  return `Tried to load Resource over XHR for ${maxRetry} times without success. Giving up.`;
}
