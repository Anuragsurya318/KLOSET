// api/user.js
import app from "../setup.js";
import { productRouter } from "../src/routes/product.js";

app.use("/product", productRouter);

export default app;
