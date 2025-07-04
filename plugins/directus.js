// import { createDirectus, graphql } from "@directus/sdk";
import { createDirectus, rest, readItems } from "@directus/sdk";

// const directus = createDirectus("http://localhost:8055").with(rest());
// const directus = createDirectus("http://localhost:8055").with(graphql());

const directus = createDirectus("https://cms.base.staging.optical.gov.sg").with(
  rest(),
);

// const directus = createDirectus("https://cms.base.staging.optical.gov.sg").with(
//   graphql(),
// );

export default defineNuxtPlugin(() => {
  return {
    provide: { directus, rest, readItems },
  };
});
