import { getContents } from "./helpers";

const _solution = async () => {
  //   const input = `Time:      7  15   30
  // Distance:  9  40  200`;

  const input = await getContents("https://adventofcode.com/2023/day/6/input");

  const lines = input.split("\n");
  const times = lines[0]
    .split(" ")
    .filter((v) => v.length > 0)
    .slice(1)
    .map(Number);
  const distances = lines[1]
    .split(" ")
    .filter((v) => v.length > 0)
    .slice(1)
    .map(Number);

  let collect: number[] = [];
  for (let i = 0; i < times.length; i++) {
    let possibleCount = 0;

    for (let j = 0; j < times[i]; j++) {
      const travelled = j * (times[i] - j);
      if (travelled > distances[i]) {
        possibleCount++;
      }
    }

    console.log(`Possible count: ${possibleCount}`);
    collect.push(possibleCount);
  }

  const total = collect.reduce((a, b) => a * b);
  console.log(`Total: ${total}`);
};

_solution();
