import { format } from "date-fns";
import { v4 } from "uuid";

import fs from "fs";
import path from "path";
import { appendFile, mkdir } from "fs/promises";

const logEvent = async (message, logFile) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd\t HH:mm:ss")}`;
  const logItem = `${dateTime}\t ${v4()}\t ${message}\n`;

  const __dirname = path.resolve();

  try {
    if (!fs.existsSync(__dirname, "src", "logs")) {
      await mkdir(path.join(__dirname, "src", "logs"));
    } else {
      await appendFile(path.join(__dirname, "src", "logs", logFile), logItem);
    }
  } catch (err) {
    console.error(err);
  }
};

export default logEvent;
