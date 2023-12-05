import { getContents } from "./helpers";

const _solution = async () => {
  type Spread = [dest: number, src: number, range: number];
  type Spreads = Spread[][];

  interface $Parse {
    seeds: number[];
    spreads: Spreads;
  }

  const $trim = (input: string) => input.trim();
  const $parse = (input: string): $Parse => {
    const lines = input.split("\n\n");

    const seeds = lines
      .shift()
      .substring("seeds: ".length)
      .split(" ")
      .map(Number);

    const spreads: Spread[][] = [];

    lines.forEach((line) => {
      const i = line.indexOf(":") + 2;
      const map = line
        .substring(i)
        .split("\n")
        .map((row) => row.split(" ").map(Number) as Spread);
      spreads.push([...map]);
    });

    return { seeds, spreads };
  };

  const input = await getContents("https://adventofcode.com/2023/day/5/input");
  const { seeds, spreads } = $parse($trim(input));

  type $LookupMemo = Record<number, number>;

  const lookupMemo: $LookupMemo = {};
  const $lookup = (spreads: Spreads, value: number): number => {
    if (lookupMemo[value]) {
      return lookupMemo[value];
    }

    let result = value;
    for (const spread of spreads) {
      for (const [dest, src, range] of spread) {
        if (result >= src && result < src + range) {
          const diff = result - src;
          result = dest + diff;
          break;
        }
      }
    }

    lookupMemo[value] = result;
    return result;
  };

  const inverseLookupMemo: $LookupMemo = {};
  const $inverseLookup = (spreadsOrig: Spreads, value: number): number => {
    if (inverseLookupMemo[value]) {
      return inverseLookupMemo[value];
    }

    const spreads = spreadsOrig
      .map((spread) =>
        spread.map(([dest, src, range]) => [src, dest, range] as Spread)
      )
      .reverse();

    const answer = $lookup(spreads, value);
    inverseLookupMemo[value] = answer;
    return answer;
  };

  const $isValidSeed = (seed: number, seeds: number[]): boolean => {
    for (let i = 0; i < seeds.length; i += 2) {
      if (seed >= seeds[i] && seed <= seeds[i] + seeds[i + 1]) {
        return true;
      }
    }
    return false;
  };

  const potentials = spreads
    .flatMap((innerSpreads, i) => {
      const arr: number[] = [];
      innerSpreads.forEach(([dest, src, range]) => {
        arr.push($inverseLookup(spreads.slice(0, i + 1), src));
        arr.push($inverseLookup(spreads.slice(0, i + 1), dest));
      });
      return arr;
    })
    .filter((i) => $isValidSeed(i, seeds));

  console.log(potentials);

  let min = Infinity;
  for (const potential of potentials) {
    const res = $lookup(spreads, potential);
    if (res < min) {
      min = res;
    }
  }

  console.log(`Part 2: ${min}`);
};

_solution();
