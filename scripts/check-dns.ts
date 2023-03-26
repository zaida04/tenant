import "dotenv/config";
import process from "node:process";
import chalk from "chalk";
import {
  getAllDomains,
  getAllRecords,
  publishRecord,
} from "./cloudflare/cloudflare.js";
import { loadDomainsFile } from "./load-domains-file.js";
import { inputError } from "./inputError.js";

if (!process.env.CF_API_KEY) throw new Error("Missing cloudflare API key!");
if (!process.env.DOMAIN) throw new Error("Missing domain env var!");

const domain = process.env.DOMAIN.toLowerCase();

const findRecordsNotAdded = (localRecords: string[], dnsRecords: string[]) => {
  const needToAdd: string[] = [];

  for (const record of localRecords) {
    if (!dnsRecords.includes(`${record}.${domain}`)) needToAdd.push(record);
  }

  return needToAdd;
};

const main = async () => {
  const loadedRecords = await loadDomainsFile();
  if (!loadedRecords) {
    console.log(chalk.yellow("Exiting due to no domains/records to add."));
    return;
  }

  const allDomains = await getAllDomains();
  const workingDomain = allDomains?.find(
    (x) => x.name.toLowerCase() === domain
  );

  if (!workingDomain) {
    console.log(
      chalk.red(
        `No domain under this account/token with the name ${domain}. Existing domains are: ${
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          allDomains?.map((x) => x.name).join(", ") || "NONE"
        }`
      )
    );

    return;
  }

  const allRecords = await getAllRecords(workingDomain.id);
  if (!allRecords) {
    console.log(chalk.red(`No records, likey an error.`));
    return;
  }

  const subdomainsToAdd = findRecordsNotAdded(
    Object.keys(loadedRecords),
    allRecords.map((x) => x.name)
  );

  if (!subdomainsToAdd.length) {
    console.log(chalk.yellow("No records to sync, up-to-date!"));
    return;
  }

  console.log(
    chalk.yellow(`Adding records for subdomains: ${subdomainsToAdd}`)
  );

  let anyFail = false;
  for (const subdomain of subdomainsToAdd) {
    console.log(chalk.yellow(`Adding record for subdomain "${subdomain}"`));
    const addSubdomain = await publishRecord(
      workingDomain.id,
      subdomain,
      loadedRecords[subdomain]
    ).catch(() => null);

    if (!addSubdomain) {
      console.log(
        chalk.red(
          `Error adding subdomain "${subdomain}" with destination "${loadedRecords[subdomain]}".`
        )
      );
      anyFail = true;
      continue;
    }

    console.log(chalk.green(`Successfully added subdomain "${subdomain}"`));
  }

  console.log(chalk.green("Subdomain sync complete."));
  if (process.env.CI && anyFail) {
    throw new inputError(
      "At least one domain failed. Throwing error to fail this workflow."
    );
  }
};

void main();
