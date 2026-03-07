import buildApp from "./app";

const app = buildApp();

const port = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await app.listen({ port: port, host: "0.0.0.0" });

    console.log("✨ SERVER RUNNING ✨");
  } catch (e) {
    app.log.error(e);
    process.exit(1);
  }
};

start();
