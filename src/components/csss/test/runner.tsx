"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  csssSections,
  sectionIndexForQuestion,
} from "@/data/csss-questions";
import type { CsssTestDefinition } from "@/data/csss-tests";
import { Instructions } from "@/components/csss/test/instructions";
import { SectionBrief } from "@/components/csss/test/section-brief";
import { TestScreen } from "@/components/csss/test/test-screen";
import { SubmitModal, type SubmitSummary } from "@/components/csss/test/submit-modal";
import { Analysis } from "@/components/csss/test/analysis";
import { scoreAttempt } from "@/lib/csss-scoring";
import { saveAttempt } from "@/lib/attempts";

type Stage = "instructions" | "test" | "analysis";

export function TestRunner({
  test,
  studentName,
}: {
  test: CsssTestDefinition;
  studentName?: string;
}) {
  const totalSeconds = test.durationMinutes * 60;
  const totalQuestions = test.questions.length;
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("instructions");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });
  const [startedSections, setStartedSections] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [showSubmit, setShowSubmit] = useState(false);
  const secondsRef = useRef(secondsLeft);
  const answersRef = useRef(answers);
  const savedRef = useRef(false);

  const activeSection = sectionIndexForQuestion(current);
  const showBrief = stage === "test" && !startedSections[activeSection];

  useEffect(() => {
    secondsRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const persistResult = useCallback(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    const score = scoreAttempt(
      test.questions,
      answersRef.current,
      test.marksCorrect,
      test.marksWrong,
    );
    void saveAttempt({
      testId: test.id,
      testTitle: test.title,
      score,
    }).catch(() => {
      savedRef.current = false;
    });
  }, [test]);

  useEffect(() => {
    if (stage !== "test" || showBrief) return;
    const id = setInterval(() => {
      const nextValue = secondsRef.current - 1;
      if (nextValue <= 0) {
        clearInterval(id);
        setSecondsLeft(0);
        persistResult();
        setStage("analysis");
        return;
      }
      secondsRef.current = nextValue;
      setSecondsLeft(nextValue);
    }, 1000);
    return () => clearInterval(id);
  }, [stage, showBrief, persistResult]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setVisited((prev) => ({ ...prev, [index]: true }));
  }, []);

  const next = useCallback(() => {
    const target = Math.min(current + 1, totalQuestions - 1);
    setCurrent(target);
    setVisited((prev) => ({ ...prev, [target]: true }));
  }, [current, totalQuestions]);

  const advanceOrFinish = useCallback(() => {
    if (current >= totalQuestions - 1) {
      persistResult();
      setStage("analysis");
      return;
    }
    next();
  }, [current, next, persistResult, totalQuestions]);

  const handleSelect = useCallback((questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  }, []);

  const handleMarkForReviewNext = useCallback(() => {
    setMarked((prev) => ({ ...prev, [current]: true }));
    next();
  }, [current, next]);

  const handleClearResponse = useCallback(() => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[current];
      return copy;
    });
  }, [current]);

  const resetTest = useCallback(() => {
    setAnswers({});
    setMarked({});
    setVisited({ 0: true });
    setStartedSections({});
    setCurrent(0);
    setSecondsLeft(totalSeconds);
    setShowSubmit(false);
    answersRef.current = {};
    savedRef.current = false;
  }, [totalSeconds]);

  const summary: SubmitSummary = useMemo(() => {
    let answered = 0;
    let notAnswered = 0;
    let markedForReview = 0;
    let notVisited = 0;
    test.questions.forEach((_, index) => {
      if (marked[index]) {
        markedForReview += 1;
        return;
      }
      if (answers[index] !== undefined) {
        answered += 1;
        return;
      }
      if (visited[index]) {
        notAnswered += 1;
        return;
      }
      notVisited += 1;
    });
    return {
      questions: totalQuestions,
      answered,
      notAnswered,
      markedForReview,
      notVisited,
    };
  }, [answers, marked, visited, test.questions, totalQuestions]);

  if (stage === "instructions") {
    return (
      <Instructions
        title={test.title}
        durationMinutes={test.durationMinutes}
        maxMarks={totalQuestions * test.marksCorrect}
        totalQuestions={totalQuestions}
        marksCorrect={test.marksCorrect}
        marksWrong={test.marksWrong}
        studentName={studentName}
        onBack={() => router.push("/csss")}
        onBegin={() => setStage("test")}
      />
    );
  }

  if (stage === "analysis") {
    return (
      <Analysis
        title={test.title}
        questions={test.questions}
        answers={answers}
        marksCorrect={test.marksCorrect}
        marksWrong={test.marksWrong}
        onReattempt={() => {
          resetTest();
          setStage("test");
        }}
        onExit={() => {
          resetTest();
          router.push("/csss");
        }}
      />
    );
  }

  if (showBrief) {
    return (
      <SectionBrief
        section={csssSections[activeSection]}
        totalSections={csssSections.length}
        onBegin={() =>
          setStartedSections((prev) => ({ ...prev, [activeSection]: true }))
        }
      />
    );
  }

  return (
    <>
      <TestScreen
        title={test.title}
        questions={test.questions}
        secondsLeft={secondsLeft}
        marksCorrect={test.marksCorrect}
        marksWrong={test.marksWrong}
        current={current}
        answers={answers}
        marked={marked}
        visited={visited}
        onSelect={handleSelect}
        onNavigate={goTo}
        onMarkForReviewNext={handleMarkForReviewNext}
        onClearResponse={handleClearResponse}
        onSaveAndNext={advanceOrFinish}
        onSubmit={() => setShowSubmit(true)}
      />

      {showSubmit && (
        <SubmitModal
          summary={summary}
          onClose={() => setShowSubmit(false)}
          onSubmit={() => {
            setShowSubmit(false);
            persistResult();
            setStage("analysis");
          }}
        />
      )}
    </>
  );
}
