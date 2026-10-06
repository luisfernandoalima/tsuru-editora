import app from "./main.js";

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Online na porta: ${PORT}`);
});
