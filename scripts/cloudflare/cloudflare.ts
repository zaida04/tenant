/* eslint-disable promise/prefer-await-to-then */
import process from "node:process";
import { cf } from "./fetch.js";
import type { paths } from "./types.js";

if (!process.env.CF_API_KEY) throw new Error("Missing cloudflare API key!");
const { fetch } = cf(process.env.CF_API_KEY);

export const getAllDomains = async () =>
  fetch<
    paths["/zones"]["get"]["responses"]["200"]["content"]["application/json"]
  >({
    path: "/zones",
    method: "GET",
  }).then((x) => x?.result);

export const getAllRecords = async (zone_id: string) =>
  fetch<
    paths["/zones/{zone_identifier}/dns_records"]["get"]["responses"]["200"]["content"]["application/json"]
  >({
    path: `/zones/${zone_id}/dns_records`,
    method: "GET",
  }).then((x) => x?.result);

export const publishRecord = async (
  zone_id: string,
  subdomain: string,
  destination: string
) =>
  fetch<
    paths["/zones/{zone_identifier}/dns_records"]["post"]["responses"]["200"]["content"]["application/json"]
  >({
    path: `/zones/${zone_id}/dns_records`,
    method: "POST",
    body: {
      name: subdomain,
      content: destination,
      type: "CNAME",
      proxied: true,
    },
  }).then((x) => x?.result);
