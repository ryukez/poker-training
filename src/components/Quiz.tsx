import React, { useState, useEffect, useMemo } from "react";
import { Color } from "../data";
import { getCardImagePaths } from "../utils/cardUtils";

interface Props {
  question?: {
    hand: string;
    correctColor: Color;
  };
  qIndex: number;
  total: number;
  onAnswer: (color: Color) => void;
  elapsedMs: number;
}

const COLORS: Color[] = [
  "紺",
  "赤",
  "黄",
  "緑",
  "水色",
  "白",
  "ピンク",
  "グレー",
];

// 色の説明
const COLOR_DESCRIPTION: Record<Color, string> = {
  紺: "UTG（後ろに8人）の強ハンド",
  赤: "UTG（後ろに8人）のハンド",
  黄: "EP（後ろに6〜7人）のハンド",
  緑: "LJ、HJ（後ろに4〜5人）のハンド",
  水色: "CO（後ろに3人）のハンド",
  白: "BTN（後ろに0〜2人）のハンド",
  ピンク: "BBのみBTNのレイズにコールOK",
  グレー: "フォールド",
};

export default function Quiz({
  question,
  qIndex,
  total,
  onAnswer,
  elapsedMs,
}: Props) {
  const [selected, setSelected] = useState<Color | null>(null);

  // reset when question changes
  useEffect(() => {
    setSelected(null);
  }, [question]);

  const cardImages = useMemo(() => {
    if (!question) return [];
    return getCardImagePaths(question.hand);
  }, [question]);

  // 経過時間フォーマット
  const formatTime = (ms: number): string => {
    const totalSec = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSec % 60).toString().padStart(2, "0");
    const centiseconds = Math.floor((ms % 1000) / 10)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}.${centiseconds}`;
  };

  if (!question) return <p>読み込み中…</p>;

  const handleClick = (c: Color) => {
    if (selected) return; // already answered
    setSelected(c);
    onAnswer(c);
  };

  const isCorrect = selected ? selected === question.correctColor : null;

  return (
    <div>
      <h1>ヨコサワレンジクイズ</h1>
      <h2>
        問 {qIndex + 1} / {total}
      </h2>

      {/* 経過時間 */}
      <p
        style={{ textAlign: "center", margin: "0.5rem 0", fontSize: "1.2rem" }}
      >
        時間: {formatTime(elapsedMs)}
      </p>

      {/* ハンドをカード画像で表示 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          margin: "2rem 0",
        }}
      >
        {cardImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={question.hand}
            style={{ width: "80px", height: "auto" }}
          />
        ))}
      </div>
      <div className="button-grid">
        {COLORS.map((c) => (
          <button
            key={c}
            className="color-btn"
            style={{
              backgroundColor: colorToHex(c),
              opacity: selected && c !== question.correctColor ? 0.6 : 1,
            }}
            disabled={!!selected}
            onClick={() => handleClick(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div
        className="feedback"
        style={{
          color: selected ? (isCorrect ? "green" : "red") : "transparent",
          minHeight: "1.5rem",
        }}
      >
        {selected
          ? isCorrect
            ? "正解！"
            : `不正解。正解は ${question.correctColor}`
          : ""}
      </div>

      {/* カラー凡例 */}
      <div
        style={{
          marginTop: "2rem",
          fontSize: "0.8rem",
          opacity: 0.8,
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem 1rem",
          justifyContent: "center",
        }}
      >
        {COLORS.map((c) => (
          <div key={c} style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                backgroundColor: colorToHex(c),
                marginRight: 4,
                borderRadius: 2,
              }}
            ></span>
            <span>{COLOR_DESCRIPTION[c]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function colorToHex(color: Color): string {
  switch (color) {
    case "紺":
      return "#2c3e50";
    case "赤":
      return "#e74c3c";
    case "黄":
      return "#f1c40f";
    case "緑":
      return "#27ae60";
    case "水色":
      return "#3498db";
    case "白":
      return "#bdc3c7";
    case "ピンク":
      return "#ff69b4";
    case "グレー":
      return "#7f8c8d";
    default:
      return "#95a5a6";
  }
}
