import { Scanner, getContents } from "./helpers";

const main1 = async () => {
  const input = await getContents("https://adventofcode.com/2023/day/4/input");
  const scanner = new Scanner(input);

  let total = 0;
  while (scanner.hasNext()) {
    const line = scanner.next();
    if (line === "") {
      continue;
    }
    const raw = line.split(":").map((x) => x.trim()) as [string, string] | [];

    const [rawCard, rawNumbers] = raw;

    const cardId = parseInt(rawCard.substring(5));
    const [rawCardNumbers, rawWinningNumbers] = rawNumbers
      .split("|")
      .map((x) => x.trim()) as [string, string];

    const cardNumbers = rawCardNumbers
      .split(" ")
      .map((x) => x.trim())
      .filter((x) => x !== "")
      .map((x) => parseInt(x));
    const winningNumbers = rawWinningNumbers
      .split(" ")
      .map((x) => x.trim())
      .filter((x) => x !== "")
      .map((x) => parseInt(x));

    let count = 0;
    for (const winningNumber of winningNumbers) {
      if (cardNumbers.includes(winningNumber)) {
        count++;
      }
    }

    let toAdd = 0;
    if (count > 0) {
      toAdd = 1;
      count--;

      while (count > 0) {
        toAdd *= 2;
        count--;
      }
    }

    total += toAdd;
  }

  console.log(`Part 1: ${total}`);
};

const main2 = async () => {
  const input = await getContents("https://adventofcode.com/2023/day/4/input");
  // const input = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  // Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
  // Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
  // Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
  // Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
  // Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;
  const scanner = new Scanner(input);

  const getTotalWinning = (cardNumbers: number[], winningNumbers: number[]) => {
    let count = 0;
    for (const winningNumber of winningNumbers) {
      if (cardNumbers.includes(winningNumber)) {
        count++;
      }
    }
    return count;
  };

  interface Card {
    id: number;
    cardNumbers: number[];
    winningNumbers: number[];
  }

  const originalCards: Card[] = [];
  while (scanner.hasNext()) {
    const line = scanner.next();
    if (line === "") {
      continue;
    }
    const raw = line.split(":").map((x) => x.trim()) as [string, string] | [];

    const [rawCard, rawNumbers] = raw;

    const cardId = parseInt(rawCard.substring(5));
    const [rawCardNumbers, rawWinningNumbers] = rawNumbers
      .split("|")
      .map((x) => x.trim()) as [string, string];

    const cardNumbers = rawCardNumbers
      .split(" ")
      .map((x) => x.trim())
      .filter((x) => x !== "")
      .map((x) => parseInt(x));
    const winningNumbers = rawWinningNumbers
      .split(" ")
      .map((x) => x.trim())
      .filter((x) => x !== "")
      .map((x) => parseInt(x));

    originalCards.push({
      id: cardId - 1,
      cardNumbers,
      winningNumbers,
    });
  }

  let total = 0;

  const matrix = originalCards.map((card) => [card]);
  for (let i = 0; i < matrix.length; i++) {
    const card = matrix[i][0];
    total++;
    const count = getTotalWinning(card.cardNumbers, card.winningNumbers);

    if (count === 0) {
      matrix[i] = [];
      continue; // doesn't slow down
    }

    const subset = originalCards.slice(card.id + 1, card.id + count + 1);

    for (const card2 of subset) {
      for (let j = 0; j < matrix[i].length; j++) {
        matrix[card2.id].push(card2);
        total++;
      }
    }
  }

  console.log(`Part 2: ${total}`);
};

main1();
main2();
