import React, { useCallback, useEffect, useState } from "react";
import { Color, fetchHandColorMap } from "./data";
import Quiz from "./components/Quiz";
import Result from "./components/Result";

interface Question {
  hand: string;
  correctColor: Color;
}

interface Answer {
  hand: string;
  correctColor: Color;
  selectedColor: Color;
  isCorrect: boolean;
}

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [phase, setPhase] = useState<"quiz" | "result">("quiz");

  // タイマー関連
  const [totalTime, setTotalTime] = useState(0); // 質問回答に要した総ミリ秒
  const [currentStartTime, setCurrentStartTime] = useState<number | null>(null); // 現在進行中の質問開始時刻
  const [now, setNow] = useState(Date.now()); // リアルタイム更新用

  // 100ms ごとに now を更新し、表示をリアルタイムでリフレッシュ
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  // 初期化またはリトライ
  const initQuiz = useCallback(async () => {
    // CSV から読み込み (失敗時はデフォルト)
    const map = await fetchHandColorMap();
    const shuffled = [...map].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 100).map(({ hand, color }) => ({
      hand,
      correctColor: color,
    }));
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setPhase("quiz");

    // タイマーリセット
    setTotalTime(0);
    setCurrentStartTime(Date.now());
  }, []);

  useEffect(() => {
    initQuiz();
  }, [initQuiz]);

  const handleAnswer = useCallback(
    (selected: Color) => {
      const current = questions[currentIndex];
      if (!current) return;

      // 現在の質問に要した時間を加算
      if (currentStartTime !== null) {
        const delta = Date.now() - currentStartTime;
        setTotalTime((prev) => prev + delta);
      }

      // タイマーを一時停止
      setCurrentStartTime(null);

      const isCorrect = selected === current.correctColor;
      setAnswers((prev: Answer[]) => [
        ...prev,
        {
          hand: current.hand,
          correctColor: current.correctColor,
          selectedColor: selected,
          isCorrect,
        },
      ]);

      // 1秒後に次へ
      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          setPhase("result");
        } else {
          setCurrentIndex((idx: number) => idx + 1);
          // 次の質問を開始しタイマー再開
          setCurrentStartTime(Date.now());
        }
      }, 1000);
    },
    [currentIndex, questions, currentStartTime]
  );

  // リアルタイム経過ミリ秒
  const elapsedMs = totalTime + (currentStartTime ? now - currentStartTime : 0);

  if (phase === "result") {
    return (
      <Result answers={answers} onRetry={initQuiz} elapsedMs={totalTime} />
    );
  }

  return (
    <Quiz
      question={questions[currentIndex]}
      qIndex={currentIndex}
      total={questions.length}
      onAnswer={handleAnswer}
      elapsedMs={elapsedMs}
    />
  );
}
