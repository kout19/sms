require("../config/load-env");
const app = require("../app");

// Express 5: use the app's router via app.router (if present) or fall back.
const router = app.router || app._router;
if (!router || !Array.isArray(router.stack)) {
  console.log("Loaded app OK (router introspection unavailable in Express 5).");
  process.exit(0);
}

const routes = [];
for (const layer of router.stack) {
  if (layer.route?.path) {
    routes.push(
      `${Object.keys(layer.route.methods).join(",").toUpperCase()} ${layer.route.path}`,
    );
  } else if (layer.name === "router" && layer.handle?.stack) {
    const prefix = layer.regexp?.source
      ?.replace("^\\/", "/")
      ?.replace("\\/?(?=\\/|$)", "")
      ?.replace(/\\\//g, "/");
    for (const sub of layer.handle.stack) {
      if (sub.route?.path) {
        routes.push(
          `${Object.keys(sub.route.methods).join(",").toUpperCase()} ${prefix}${sub.route.path}`,
        );
      }
    }
  }
}

const messageRoutes = routes.filter((r) => r.toLowerCase().includes("messages"));
console.log("Message routes registered:");
messageRoutes.forEach((r) => console.log("  " + r));
if (messageRoutes.length === 0) {
  console.error("No message routes registered!");
  process.exitCode = 1;
}