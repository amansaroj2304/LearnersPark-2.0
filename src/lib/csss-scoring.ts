import {
  csssSectionStarts,
  csssSections,
  type CsssQuestion,
} from "@/data/csss-questions";

export type SectionScore = {
  code: string;
  name: string;
  questions: number;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
};

export type TestScore = {
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
  maxScore: number;
  accuracy: number;
  sections: SectionScore[];
};

export function scoreAttempt(
  questions: (CsssQuestion | null)[],
  answers: Record<number, number>,
  marksCorrect: number,
  marksWrong: number,
): TestScore {
  let attempted = 0;
  let correct = 0;

  questions.forEach((question, index) => {
    if (!question || answers[index] === undefined) return;
    attempted += 1;
    if (answers[index] === question.answer) correct += 1;
  });

  const wrong = attempted - correct;
  const score = correct * marksCorrect - wrong * marksWrong;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const maxScore = questions.length * marksCorrect;

  const sections: SectionScore[] = csssSections.map((section, sectionIndex) => {
    const start = csssSectionStarts[sectionIndex];
    let sectionAttempted = 0;
    let sectionCorrect = 0;

    for (let offset = 0; offset < section.questionCount; offset += 1) {
      const questionIndex = start + offset;
      const question = questions[questionIndex];
      const selected = answers[questionIndex];
      if (!question || selected === undefined) continue;
      sectionAttempted += 1;
      if (selected === question.answer) sectionCorrect += 1;
    }

    const sectionWrong = sectionAttempted - sectionCorrect;
    return {
      code: section.code,
      name: section.name,
      questions: section.questionCount,
      attempted: sectionAttempted,
      correct: sectionCorrect,
      wrong: sectionWrong,
      score: sectionCorrect * marksCorrect - sectionWrong * marksWrong,
    };
  });

  return { attempted, correct, wrong, score, maxScore, accuracy, sections };
}
