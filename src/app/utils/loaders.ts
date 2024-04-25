import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

export function setLoaders<T>(store: BehaviorSubject<Record<string, any>>, actionName: string, identifer?: string) {
  return (source: Observable<T>) => {
    const setLoaderValue = (value: boolean, isError?: boolean) => {
      return { isLoading: value, isError, ...(identifer ? { [identifer]: { isLoading: value, isError } } : null) };
    };

    const currentActionState = store.value[actionName] || {};
    const currentLoaderCount = currentActionState.loaderCount || 0;
    store.next({
      ...store.value,
      [actionName]: { ...currentActionState, ...setLoaderValue(true), loaderCount: currentLoaderCount + 1 },
    });

    return source.pipe(
      catchError(error => {
        if (identifer) {
          store.next({
            ...store.value,
            [actionName]: {
              ...currentActionState,
              ...setLoaderValue(true, error ? true : false),
              loaderCount: 0,
              isLoading: false,
            },
          });
        }

        return throwError(error);
      }),
      tap(() => {
        const finalActionState = store.value[actionName];
        const finalLoaderCount = (finalActionState.loaderCount || 1) - 1;

        // Only set the loader state to false when the count reaches zero
        if (finalLoaderCount === 0) {
          store.next({
            ...store.value,
            [actionName]: { ...finalActionState, ...setLoaderValue(false), loaderCount: 0 },
          });
        } else {
          store.next({
            ...store.value,
            [actionName]: { ...finalActionState, loaderCount: finalLoaderCount },
          });
        }
      })
    );
  };
}
