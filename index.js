const morgan = require("morgan");
const dotenv = require("dotenv");
const express = require("express");
const { errorLogger, infoLogger } = require("./startup/errorLogging");
const { mongodb } = require("./startup/db");
const app = express();

dotenv.config();
errorLogger();

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

require("./startup/routes")(app);
mongodb();
require("./startup/config")();
require("./startup/prod")(app);

const port = process.env.PORT || 3006;
app.listen(port, () => infoLogger(`Listening on port ${port}...`));
