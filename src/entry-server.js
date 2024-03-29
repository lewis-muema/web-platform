/* eslint consistent-return: "error" */
/* eslint no-param-reassign: "error" */
import { createApp } from './app';

export default context => new Promise((resolve, reject) => {
  const { app, router, store } = createApp();

  router.push(context.url);

  router.onReady(() => {
    const matchedComponents = router.getMatchedComponents();
    if (matchedComponents.length > 0) {
      // call `asyncData()` on all matched route components
      Promise.all(
        matchedComponents.map((Component) => {
          if (Component.asyncData) {
            return Component.asyncData({
              store,
              route: router.currentRoute,
            });
          }
          return false;
        }),
      )
        .then(() => {
          // After all preFetch hooks are resolved, our store is now
          // filled with the state needed to render the app.
          // When we attach the state to the context, and the `template` option
          // is used for the renderer, the state will automatically be
          // serialized and injected into the HTML as `window.__INITIAL_STATE__`.
          context.state = store.state;

          resolve(app);
        })
        .catch(reject);
    }
  }, reject);
});
