import { createDirectus, graphql } from '@directus/sdk';

// const directus = createDirectus("http://localhost:8055").with(rest());
const directus = createDirectus('http://localhost:8055').with(graphql());

export default defineNuxtPlugin(() => {
  return {
    provide: { directus },
  };
});
