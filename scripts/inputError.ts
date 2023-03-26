export class inputError extends Error {
  public constructor(msg: string, public domain?: string) {
    super(msg);
  }
}
