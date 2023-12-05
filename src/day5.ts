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

interface SpreadMap {
  type: string;
  mapping: [number, number][];
}

const parseOneMap = (type: string, lines: string[], prev: number[]) => {
  const max = prev.reduce((acc, cur) => (cur > acc ? cur : acc), 0);

  const map: SpreadMap = {
    type,
    mapping: [],
  };

  for (let i = 0; i < max; i++) {
    // flash fill
    map.mapping.push([i, i]);
  }

  lines.shift(); // remove heading
  while (lines[0] !== "" && lines.length > 0) {
    const [dest, src, range] = lines.shift().split(" ").map(Number);

    for (let j = 0; j < range; j++) {
      map.mapping[src + j - 1] = [src + j, dest + j];
    }
  }
  lines.shift(); // remove whitespace

  map.mapping.sort(([a], [b]) => a - b);

  return map;
};

const common = async () => {
  const lines = input.split("\n").map((line) => line.trim());
  // const lines = (await getContents("https://adventofcode.com/2023/day/5/input"))
  //   .split("\n")
  //   .map((line) => line.trim());

  const seeds = lines.shift().split(" ").slice(1).map(Number);
  lines.shift(); // remove whitespace

  const seedToSoil = parseOneMap("seed-to-soil", lines, seeds);
  const soilToFertilizer = parseOneMap(
    "soil-to-fertilizer",
    lines,
    seedToSoil.mapping.map(([_, dest]) => dest)
  );
  const fertilizerToWater = parseOneMap(
    "fertilizer-to-water",
    lines,
    soilToFertilizer.mapping.map(([_, dest]) => dest)
  );
  const waterToLight = parseOneMap(
    "water-to-light",
    lines,
    fertilizerToWater.mapping.map(([_, dest]) => dest)
  );
  const lightToTemperature = parseOneMap(
    "light-to-temperature",
    lines,
    waterToLight.mapping.map(([_, dest]) => dest)
  );
  const temperatureToHumidity = parseOneMap(
    "temperature-to-humidity",
    lines,
    lightToTemperature.mapping.map(([_, dest]) => dest)
  );
  const humidityToLocation = parseOneMap(
    "humidity-to-location",
    lines,
    temperatureToHumidity.mapping.map(([_, dest]) => dest)
  );

  return {
    seeds,
    seedToSoil: seedToSoil.mapping,
    soilToFertilizer: soilToFertilizer.mapping,
    fertilizerToWater: fertilizerToWater.mapping,
    waterToLight: waterToLight.mapping,
    lightToTemperature: lightToTemperature.mapping,
    temperatureToHumidity: temperatureToHumidity.mapping,
    humidityToLocation: humidityToLocation.mapping,
  };
};

const part1 = async () => {
  const data = await common();

  let lowest = Infinity;
  for (const seed of data.seeds) {
    const soil = data.seedToSoil.find(([src]) => src === seed);
    const fertilizer = data.soilToFertilizer.find(([src]) => src === soil[1]);
    const water = data.fertilizerToWater.find(([src]) => src === fertilizer[1]);
    const light = data.waterToLight.find(([src]) => src === water[1]);
    const temperature = data.lightToTemperature.find(
      ([src]) => src === light[1]
    );
    const humidity = data.temperatureToHumidity.find(
      ([src]) => src === temperature[1]
    );
    const location = data.humidityToLocation.find(
      ([src]) => src === humidity[1]
    );

    if (location[1] < lowest) {
      lowest = location[1];
    }
  }

  console.log(`Part 1: ${lowest}`);
};

part1();
