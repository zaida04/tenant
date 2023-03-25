import chalk from "chalk";

export type RequestOptions = {
  body?: Record<string, any>;
  header?: Record<string, any>;
  method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
  path: string;
};

export const cf = (user_token: string) => {
  return {
    fetch: async <T = Record<string, any>>(options: RequestOptions) => {
      const fullUrl = "https://api.cloudflare.com/client/v4" + options.path;
      const fullHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
        ...options.header,
      };
      const convertedBody = options.body && JSON.stringify(options.body);

      let res: Response;
      try {
        res = await fetch(fullUrl, {
          method: options.method,
          body: convertedBody,
          headers: fullHeaders,
        });
      } catch (error) {
        console.log(
          chalk.red(
            `There was an error ${options.method}'ing ${fullUrl}. ${
              (error as Error).message
            }`
          )
        );

        throw error;
      }

      if (!res.ok) {
        const parsedError = (await res.text()) as string;

        console.log(
          chalk.red(
            `${options.method}'ing ${fullUrl} returned a not OK response. ${parsedError}`
          )
        );
        return;
      }

      return res.json() as Promise<T>;
    },
  };
};
