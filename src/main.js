import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    name: "Stuck in a (drum) loop",
  },
});

export default app;
