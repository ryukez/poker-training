import React from "react";
import { Color } from "../data";

interface Answer {
  hand: string;
  correctColor: Color;
  selectedColor: Color;
  isCorrect: boolean;
}

interface Props {
  answers: Answer[];
  onRetry: () => void;
  elapsedMs: number;
}

export default function Result({ answers, onRetry, elapsedMs }: Props) {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const incorrectList = answers.filter((a) => !a.isCorrect);
  const accuracy = ((correct / total) * 100).toFixed(1);

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

  return (
    <div>
      <h1>結果</h1>
      <h2>
        正解率: {correct} / {total} ({accuracy}%)
      </h2>

      <h3>回答時間: {formatTime(elapsedMs)}</h3>

      {incorrectList.length > 0 ? (
        <div>
          <h3>間違えたハンド</h3>
          <ul className="result-list">
            {incorrectList.map((a, idx) => (
              <li key={idx}>
                {a.hand}: 正解 <strong>{a.correctColor}</strong> / あなたの回答{" "}
                {a.selectedColor}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>全問正解おめでとうございます！</p>
      )}

      <button style={{ marginTop: "1.5rem" }} onClick={onRetry}>
        もう一度挑戦
      </button>
    </div>
  );
}
