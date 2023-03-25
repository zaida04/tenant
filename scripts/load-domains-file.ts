import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { URL } from "node:url";
import chalk from "chalk";

export const loadDomainsFile = async () => {
  const domainFilePath = new URL(join("..", "domains.json"), import.meta.url);
  const file = await readFile(domainFilePath, "utf8");

  let parsedFile: Record<string, string>;
  try {
    parsedFile = JSON.parse(file);
  } catch (error) {
    console.log(
      chalk.red(
        `There was an error parsing your domains.json file. ${
          (error as Error).message
        }`
      )
    );

    return;
  }

  return parsedFile;
};
