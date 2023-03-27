# Tenant

> Lease subdomains with ease.

## About

Inspired by [JS.org](http://js.org), Tenant allows you to have your own Github repository where users can request a subdomain linked to a CNAME DNS value. Users request subdomains by opening up a PR in the repo with an edited `domains.json`. The changes are only actually published when you merge the PR.

The only actually required step of this process is the editing of `domains.json`, and updating the version in the main branch.

## Setup

> Prerequisite: A cool domain that is [set up with Cloudflare](https://community.cloudflare.com/t/step-1-adding-your-domain-to-cloudflare/64309)

You can get started with using Tenant in 3 steps.

1. Fork this repository.
2. Add your [repository secrets](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/managing-encrypted-secrets-for-your-repository-and-organization-for-github-codespaces#adding-secrets-for-a-repository). You can find the required secrets [here](#secrets)
3. Test it out by creating a PR with an edited `domains.json` value.

## Secrets

| Name       | Description                                                                                                                                        | Example                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| CF_API_KEY | Your [Cloudflare API Key](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/), used to retrieve and publish DNS records. | aXXXXXXXXXXXXXXXXXXXXXXXi |
| DOMAIN     | The domain you are using with the project. Do not add a protocol or trailing slash.                                                                | example-domain.com        |

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

> **Guilded.JS** © [zaida04](https://github.com/zaida04). Released under [MIT](https://github.com/zaida04/tenant/blob/main/LICENSE).

Maintained by: [zaida04](https://github.com/zaida04).
