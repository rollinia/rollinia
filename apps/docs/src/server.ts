import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const engine = new AngularAppEngine();

export const reqHandler = createRequestHandler(req => engine.handle(req));

export default {
  fetch: createRequestHandler(
    async req =>
      (await engine.handle(req)) ?? new Response('Not Found', { status: 404 }),
  ),
};
