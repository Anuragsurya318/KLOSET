// api/user.js
import app from "../setup.js";
import { userRouter } from "../src/routes/user.js";

app.use("/user", userRouter);

export default app;
