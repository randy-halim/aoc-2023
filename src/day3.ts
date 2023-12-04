import { getContents } from "./helpers";

interface NumberLocation {
  x: number;
  y: number;
  digits: number; // how many digits long
  num: number;
}

interface SymbolLocation {
  x: number;
  y: number;
  symbol: string;
}

const resolveMap = (map: string[][]) => {
  const IGNORE_CHAR = ".";
  const numberLocations: NumberLocation[] = [];
  // nodejs moment
  map = map.map((row) => row.filter((char) => char.trim().length > 0));

  // find all number locations
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      let char = row[x];

      if (char !== IGNORE_CHAR && !isNaN(parseInt(char))) {
        const loc: NumberLocation = { x, y, digits: 0, num: 0 };

        while (char !== IGNORE_CHAR && !isNaN(parseInt(row[x]))) {
          loc.digits++;
          loc.num = loc.num * 10 + parseInt(char);

          char = row[++x];
        }

        numberLocations.push(loc);
      }
    }
  }

  // find coordinates of each non ignored char (not numbers)
  const symbolLocations: SymbolLocation[] = [];

  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== IGNORE_CHAR && isNaN(parseInt(row[x]))) {
        symbolLocations.push({ x, y, symbol: row[x] });
      }
    }
  }

  return {
    numbers: numberLocations,
    symbols: symbolLocations,
    width: map[0].length,
    height: map.length,
  };
};

const getEligibleLocations = (
  width: number,
  height: number,
  { x, y }: SymbolLocation,
  symbol: string = ""
) => {
  const eligibleLocations: SymbolLocation[] = [];

  const xBoundValid = (x: number) => x >= 0 && x < width;
  const yBoundValid = (y: number) => y >= 0 && y < height;

  if (xBoundValid(x - 1) && yBoundValid(y - 1)) {
    eligibleLocations.push({ x: x - 1, y: y - 1, symbol });
  }
  if (xBoundValid(x) && yBoundValid(y - 1)) {
    eligibleLocations.push({ x, y: y - 1, symbol });
  }
  if (xBoundValid(x + 1) && yBoundValid(y - 1)) {
    eligibleLocations.push({ x: x + 1, y: y - 1, symbol });
  }
  if (xBoundValid(x - 1) && yBoundValid(y)) {
    eligibleLocations.push({ x: x - 1, y, symbol });
  }
  if (xBoundValid(x + 1) && yBoundValid(y)) {
    eligibleLocations.push({ x: x + 1, y, symbol });
  }
  if (xBoundValid(x - 1) && yBoundValid(y + 1)) {
    eligibleLocations.push({ x: x - 1, y: y + 1, symbol });
  }
  if (xBoundValid(x) && yBoundValid(y + 1)) {
    eligibleLocations.push({ x, y: y + 1, symbol });
  }
  if (xBoundValid(x + 1) && yBoundValid(y + 1)) {
    eligibleLocations.push({ x: x + 1, y: y + 1, symbol });
  }

  return eligibleLocations;
};

const main = async () => {
  const input = await getContents("https://adventofcode.com/2023/day/3/input");

  const map = input.split("\n").map((row) => row.split(""));
  const { numbers, symbols, width, height } = resolveMap(map);

  const validNumbers: NumberLocation[] = [];
  const eligibleLocations: SymbolLocation[] = [];
  for (const { x, y, symbol } of symbols) {
    eligibleLocations.push(
      ...getEligibleLocations(width, height, { x, y, symbol })
    );
  }

  // part 1

  for (const n of numbers) {
    const { x: nX, y: nY } = n;
    const endX = n.x + n.digits - 1;

    for (const { x: eX, y: eY } of eligibleLocations) {
      if (eY === nY && eX >= nX && eX <= endX) {
        validNumbers.push(n);
        break;
      }
    }
  }

  let sum1 = 0;
  for (const { num } of validNumbers) {
    sum1 += num;
  }

  console.log(`Part 1: ${sum1}`);

  // part 2

  const gears = symbols.filter((s) => s.symbol === "*");
  let sum2 = 0;

  for (const gear of gears) {
    const { x: gX, y: gY } = gear;
    let numbersAroundGear: number[] = [];

    const eligibleLocations = getEligibleLocations(width, height, gear, "*");

    for (const location of eligibleLocations) {
      for (const { num, x: nX, y: nY, digits: dX } of numbers) {
        const endX = nX + dX - 1;
        if (location.y === nY && location.x >= nX && location.x <= endX) {
          numbersAroundGear.push(num);
        }
      }
    }

    numbersAroundGear = numbersAroundGear.filter(
      (n, i) => numbersAroundGear.indexOf(n) === i
    );

    if (numbersAroundGear.length === 2) {
      sum2 += numbersAroundGear[0] * numbersAroundGear[1];
    }
  }

  console.log(`Part 2: ${sum2}`);
};

main();
