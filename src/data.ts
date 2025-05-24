export type Color =
  | "紺"
  | "赤"
  | "黄"
  | "緑"
  | "水色"
  | "白"
  | "ピンク"
  | "グレー";

export interface HandEntry {
  hand: string;
  color: Color;
}

// 仮データ: 実際は169ハンドすべてを定義する
export const HAND_COLOR_MAP: HandEntry[] = [
  { hand: "AA", color: "紺" },
  { hand: "AKs", color: "紺" },
  { hand: "AQs", color: "赤" },
  { hand: "KQo", color: "黄" },
  { hand: "T9s", color: "緑" },
  { hand: "65s", color: "白" },
  { hand: "22", color: "水色" },
  { hand: "QJo", color: "水色" },
  { hand: "A2s", color: "緑" },
];

// CSV ローダ（hand,color）
export async function fetchHandColorMap(): Promise<HandEntry[]> {
  try {
    // import.meta.env.BASE_URL は Vite のベースパス (開発時は "/", 本番 GitHub Pages では "/poker-training/") に解決される
    const res = await fetch(`${import.meta.env.BASE_URL}hands.csv`);
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/);
    // skip header
    return lines.slice(1).map((line) => {
      const [hand, color] = line.split(",");
      return { hand, color: color as Color };
    });
  } catch (e) {
    console.error("CSV 読み込み失敗", e);
    return HAND_COLOR_MAP; // fallback
  }
}
