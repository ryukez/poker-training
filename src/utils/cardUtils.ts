export type Suit = "spades" | "hearts" | "diamonds" | "clubs";

const SUITS: Suit[] = ["spades", "hearts", "diamonds", "clubs"];

const RANK_MAP: Record<string, string> = {
  A: "ace",
  K: "king",
  Q: "queen",
  J: "jack",
  T: "10",
  9: "9",
  8: "8",
  7: "7",
  6: "6",
  5: "5",
  4: "4",
  3: "3",
  2: "2",
};

function randomSuit(): Suit {
  return SUITS[Math.floor(Math.random() * SUITS.length)];
}

function randomDifferentSuit(exclude: Suit): Suit {
  let suit: Suit = randomSuit();
  while (suit === exclude) {
    suit = randomSuit();
  }
  return suit;
}

/**
 * 与えられたハンド表記 (例: "AKs", "J8o", "99") から、
 * public/images 配下に置かれたトランプ画像へのパスを 2 枚分返す。
 *
 * アルゴリズムはユーザ要望に従う:
 *  - スート (末尾が s) またはポケット (同一ランク) の場合は同じマーク
 *  - オフスート (末尾が o) の場合は異なるマーク
 */
export function getCardImagePaths(hand: string): string[] {
  const trimmed = hand.trim().toUpperCase();

  // ポケット判定
  const isPocket = trimmed.length === 2 && trimmed[0] === trimmed[1];
  const isOffSuit = !isPocket && trimmed.endsWith("O");

  const ranks: string[] = [trimmed[0], trimmed[1]];

  const rankNames = ranks.map((r) => RANK_MAP[r]);

  // スート決定
  let suit1: Suit = randomSuit();
  let suit2: Suit = suit1;

  if (isOffSuit || isPocket) {
    suit2 = randomDifferentSuit(suit1);
  }

  // pocket で同ランクなので rankNames[1] === rankNames[0]
  const base = import.meta.env.BASE_URL;
  const card1 = `${base}images/${rankNames[0]}_of_${suit1}.png`;
  const card2 = `${base}images/${rankNames[1]}_of_${suit2}.png`;

  return [card1, card2];
}
