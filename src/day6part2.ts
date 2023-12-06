import { getContents } from "./helpers";

const _solution = async () => {
  // const input = `Time:      7  15   30
  // Distance:  9  40  200`;

  const input = await getContents("https://adventofcode.com/2023/day/6/input");

  const lines = input.split("\n");
  const timesRaw = lines[0]
    .split(" ")
    .filter((v) => v.length > 0)
    .slice(1)
    .join("");
  const distancesRaw = lines[1]
    .split(" ")
    .filter((v) => v.length > 0)
    .slice(1)
    .join("");

  const time = parseInt(timesRaw);
  const distance = parseInt(distancesRaw);

  let total = 0;

  for (let j = 0; j < time; j++) {
    const travelled = j * (time - j);
    if (travelled > distance) {
      total++;
    }
  }

  console.log(`Total: ${total}`);
};

_solution();
