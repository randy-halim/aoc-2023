import "dotenv/config";

export const getContents = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      cookie: `session=${process.env.SESSION_TOKEN}`,
    },
  });
  return await response.text();
};

export class Scanner {
  private tokens: string[];

  constructor(original: string) {
    this.tokens = original.split("\n");
  }

  public hasNext(): boolean {
    return this.tokens.length > 0;
  }

  public next(): string {
    return this.tokens.shift() || "";
  }
}
