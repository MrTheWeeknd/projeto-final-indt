import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://projeto-final-indt-production.up.railway.app/api",
    video: false,
    screenshotOnRunFailure: false,
    supportFile: false,
    setupNodeEvents(on, config) {
    },
  },
});