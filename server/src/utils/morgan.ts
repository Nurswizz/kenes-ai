import morgan, { StreamOptions } from "morgan";
import chalk from "chalk";
import { Request, Response } from "express";
const getStatusColor = (status: number) => {
  if (status >= 500) return chalk.red;
  if (status >= 400) return chalk.yellow;
  if (status >= 300) return chalk.cyan;
  if (status >= 200) return chalk.green;
  return chalk.white;
};

morgan.token("statusColored", (req: Request, res: Response) => {
  const status = res.statusCode;
  return getStatusColor(status)(status.toString());
});

morgan.token("time", () => chalk.gray(new Date().toISOString()));

morgan.token("method", (req: Request) => chalk.bold.cyan(req.method));
morgan.token("url", (req: Request) => chalk.white(req.originalUrl));

export const prettyMorgan = morgan(
  ":time :method :url :statusColored :response-time ms"
);
