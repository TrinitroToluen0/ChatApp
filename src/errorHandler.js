process.on("unhandledRejection", (reason) => {
    console.error(`${reason.stack}`);
});
process.on("uncaughtException", (error) => {
    console.error(`${error.stack}`);
});
process.on("uncaughtExceptionMonitor", (error) => {
    console.error(`${error.stack}`);
});

console.log("Error handler funcionando.")