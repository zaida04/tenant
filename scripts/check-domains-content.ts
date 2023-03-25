import chalk from "chalk";
import { inputError } from "./inputError.js";
import { loadDomainsFile } from "./load-domains-file.js";

const domainRegex =
  // eslint-disable-next-line unicorn/no-unsafe-regex
  /^(?:[\dA-Za-z](?:[\dA-Za-z-]{0,61}[\dA-Za-z])?\.)?[\dA-Za-z]{1,2}(?:[\dA-Za-z-]{0,252}[\dA-Za-z])?\.[A-Za-z]{2,63}$/g;
const bannedWords = ["shit"];

const checkFormat = (subdomain: string, value: string) => {
  if (typeof value !== "string")
    throw new inputError(
      "subdomain does not correspond to proper string value",
      subdomain
    );
};

const flagImproperURLs = (subdomain: string, value: string) => {
  if (!domainRegex.test(value))
    throw new inputError(
      "subdomain corresponding value is not a proper CNAME value.",
      subdomain
    );

  const bannedWordExists = bannedWords.find((word) => subdomain.includes(word));
  if (bannedWordExists)
    throw new inputError(
      `subdomain has forbidden word "${bannedWordExists}" in it.`,
      subdomain
    );
};

const main = async () => {
  const loadedRecords = await loadDomainsFile();
  if (!loadedRecords) {
    console.log(chalk.yellow("Exiting due to no domains/records to add."));
    return;
  }

  const records = Object.keys(loadDomainsFile);
  if (records.length === 0) {
    console.log(chalk.yellow("No records found in file!"));
    return;
  }

  let noRecordFailing = false;
  for (const record of records) {
    const content = loadedRecords[record];

    try {
      checkFormat(record, content);
      flagImproperURLs(record, content);
    } catch (error) {
      noRecordFailing = true;

      if (error instanceof inputError) {
        console.log(
          chalk.red(
            `Improper content for subdomain "${error.domain}". ${error.message}`
          )
        );
        continue;
      }

      console.log(chalk.red(`Error! ${(error as Error).message}`));
    }
  }

  if (!noRecordFailing) console.log(chalk.green("domains.json check complete"));
};

void main();
