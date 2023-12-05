import { getContents } from "./helpers";

const input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

const $trim = (input: string): string => input.trim();

interface Spread {
  src: number;
  dest: number;
  range: number;
}
type SpreadMap = Spread[];

const getNextLocation = (key: number, map: SpreadMap): number => {
  for (const { src, dest, range } of map) {
    const lX = src,
      rX = src + range - 1;
    if (key >= lX && key <= rX) {
      return dest + (key - lX);
    }
  }
  return key;
};

type Input = string[];

// return seeds, plus split lines
const parseSeeds = (input: string): [number[], string[]] => {
  const [seeds, ...lines] = input.split("\n").map($trim);

  const seedNumbers = seeds.split(": ")[1].split(" ").map(Number);

  lines.shift(); // removes extra newline

  return [seedNumbers, lines];
};

const parseMap = (input: Input): SpreadMap => {
  input.shift(); // removes header

  const map: SpreadMap = [];

  while (input.length > 0 && input[0] !== "") {
    const [dest, src, range] = input.shift()!.split(" ").map(Number);
    map.push({ src, dest, range });
  }

  return map;
};

interface Types {
  toSoil: SpreadMap;
  toFertilizer: SpreadMap;
  toWater: SpreadMap;
  toLight: SpreadMap;
  toTemperature: SpreadMap;
  toHumidity: SpreadMap;
  toLocation: SpreadMap;
}

const parse = (input: string): [number[], Types] => {
  const [seeds, lines] = parseSeeds(input);
  const maps: SpreadMap[] = [];

  while (lines.length > 0) {
    maps.push(parseMap(lines));
  }

  return [
    seeds,
    {
      toSoil: maps[0],
      toFertilizer: maps[1],
      toWater: maps[2],
      toLight: maps[3],
      toTemperature: maps[4],
      toHumidity: maps[5],
      toLocation: maps[6],
    },
  ];
};

// actual code

const commonSolution = (seeds: number[], types: Types) => {
  const soil = seeds.map((seed) => getNextLocation(seed, types.toSoil));
  const fertilizer = soil.map((soil) =>
    getNextLocation(soil, types.toFertilizer)
  );
  const water = fertilizer.map((fertilizer) =>
    getNextLocation(fertilizer, types.toWater)
  );
  const light = water.map((water) => getNextLocation(water, types.toLight));
  const temperature = light.map((light) =>
    getNextLocation(light, types.toTemperature)
  );
  const humidity = temperature.map((temperature) =>
    getNextLocation(temperature, types.toHumidity)
  );
  const location = humidity.map((humidity) =>
    getNextLocation(humidity, types.toLocation)
  );

  const min = Math.min(...location);
  return min;
};

const part1 = async () => {
  const [seeds, types] = parse(
    await getContents("https://adventofcode.com/2023/day/5/input")
  );

  // this is the simple part
  // because just 4 seeds (for part 1)
  const min = commonSolution(seeds, types);

  console.log(`Part 1: ${min}`);
};

const part2 = async () => {
  const [initSeeds, types] = parse(
    await getContents("https://adventofcode.com/2023/day/5/input")
  );

  const seedPairs: [number, number][] = initSeeds.reduce(
    (acc: [number, number][], seed: number, index: number) => {
      if (index % 2 === 0) {
        acc.push([seed, initSeeds[index + 1]]);
      }
      return acc;
    },
    []
  );

  let min = Infinity;

  for (const pair of seedPairs) {
    for (let i = 0; i < pair[1]; i++) {
      const seed = pair[0] + i;
      const localMin = commonSolution([seed], types);
      if (localMin < min) {
        min = localMin;
      }
    }
  }
};

part1();
part2();
