// configureStore.ts
import { createStore, applyMiddleware, Middleware, Store } from "redux";

type ReducersMapObject = Record<string, any>;

const thunk: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState);
    }
    return next(action);
  };

function getDefaultMiddleware() {
  return [thunk];
}

export function configureStore({
  reducer,
  middleware = getDefaultMiddleware(),
  preloadedState,
  enhancers = [],
}: {
  reducer: any;
  middleware?: Middleware[];
  preloadedState?: any;
  enhancers?: any[];
}) {
  const chain = [...middleware, ...enhancers].reduceRight(
    (current, enhancer) => enhancer(current),
    (next: any) => next
  );

  const store = createStore(reducer, preloadedState, applyMiddleware(...chain));

  return {
    ...store,
    reducer,
    middleware,
    dispatch: store.dispatch as any,
  };
}
