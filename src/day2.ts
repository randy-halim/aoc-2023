import { Scanner, getContents } from "./helpers";

interface Game {
  red: number;
  green: number;
  blue: number;
}

const parseLine = (line: string) => {
  const [idRaw, gamesRaw] = line.split(":").map((s) => s.trim()) as [
    string,
    string
  ];
  const id = parseInt(idRaw.substring(5));

  const games = gamesRaw.split(";").map((s) => s.trim());
  const blocks = games
    .map((game) => game.split(",").map((s) => s.trim()) as string[])
    .map((games) => games.map((block) => block.split(" ") as [string, string]))
    .map((blocks) =>
      blocks.map(
        ([count, color]) => [parseInt(count), color] as [number, string]
      )
    );

  const parsedGames: Game[] = [];

  for (const block of blocks) {
    const game: Game = {
      red: 0,
      green: 0,
      blue: 0,
    };

    for (const [count, color] of block) {
      if (color === "red") {
        game.red += count;
      } else if (color === "green") {
        game.green += count;
      } else if (color === "blue") {
        game.blue += count;
      }
    }

    parsedGames.push(game);
  }

  return {
    id,
    games: parsedGames,
  };
};

const main = async () => {
  // get input
  const input = await getContents("https://adventofcode.com/2023/day/2/input");

  const TOTAL_RED = 12;
  const TOTAL_GREEN = 13;
  const TOTAL_BLUE = 14;

  // part 1
  const scanner1 = new Scanner(input);
  let total1 = 0;

  while (scanner1.hasNext()) {
    const line = scanner1.next();
    if (line === "") {
      continue;
    }
    const { id, games } = parseLine(line);
    let valid = true;

    for (const { red, green, blue } of games) {
      if (red > TOTAL_RED || green > TOTAL_GREEN || blue > TOTAL_BLUE) {
        valid = false;
        break;
      }
    }

    if (valid) {
      total1 += id;
    }
  }

  console.log(`Part 1: ${total1}`);

  // part 2

  const scanner2 = new Scanner(input);
  let total2 = 0;

  while (scanner2.hasNext()) {
    const line = scanner2.next();
    if (line === "") {
      continue;
    }

    const { games } = parseLine(line);

    let red = 0;
    let green = 0;
    let blue = 0;

    for (const { red: r, green: g, blue: b } of games) {
      if (r > red) {
        red = r;
      }
      if (g > green) {
        green = g;
      }
      if (b > blue) {
        blue = b;
      }
    }

    total2 += red * green * blue;
  }

  console.log(`Part 2: ${total2}`);
};

main();
