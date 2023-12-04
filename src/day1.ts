import { Scanner, getContents } from "./helpers";

const main = async () => {
  const input = await getContents("https://adventofcode.com/2023/day/1/input");

  // part 1

  const scanner1 = new Scanner(input);
  let total1 = 0;

  while (scanner1.hasNext()) {
    const line = scanner1.next().split("");
    const digits = line.filter((char) => /\d/.test(char));
    const numbers = digits.map((digit) => parseInt(digit, 10));

    if (numbers.length !== 0) {
      total1 += numbers[0] * 10;
      total1 += numbers[numbers.length - 1];
    }
  }

  console.log(`The total (not including string numbers) is ${total1}`);

  // part 2

  const scanner2 = new Scanner(input);
  let total2 = 0;

  while (scanner2.hasNext()) {
    const line = scanner2.next();
    const numbers: number[] = [];

    for (let i = 0; i < line.length; i++) {
      if (/\d/.test(line[i])) {
        numbers.push(parseInt(line[i], 10));
      } else if (/one/.test(line.slice(i, i + 3))) {
        numbers.push(1);
      } else if (/two/.test(line.slice(i, i + 3))) {
        numbers.push(2);
      } else if (/three/.test(line.slice(i, i + 5))) {
        numbers.push(3);
      } else if (/four/.test(line.slice(i, i + 4))) {
        numbers.push(4);
      } else if (/five/.test(line.slice(i, i + 4))) {
        numbers.push(5);
      } else if (/six/.test(line.slice(i, i + 3))) {
        numbers.push(6);
      } else if (/seven/.test(line.slice(i, i + 5))) {
        numbers.push(7);
      } else if (/eight/.test(line.slice(i, i + 5))) {
        numbers.push(8);
      } else if (/nine/.test(line.slice(i, i + 4))) {
        numbers.push(9);
      } else if (/zero/.test(line.slice(i, i + 4))) {
        numbers.push(0);
      }
    }

    console.log(numbers);

    if (numbers.length !== 0) {
      total2 += numbers[0] * 10;
      total2 += numbers[numbers.length - 1];
    }
  }

  console.log(`The total (including string numbers) is ${total2}`);
};

main();
