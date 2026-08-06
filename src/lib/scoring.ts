export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  byTopic: Record<string, { total: number; correct: number }>;
}

export function calculateScore(result: QuizResult): number {
  if (result.totalQuestions === 0) return 0;
  return Math.round((result.correctAnswers / result.totalQuestions) * 100);
}

export function isPassing(score: number, cutoff: number = 70): boolean {
  return score >= cutoff;
}

export function getWeakTopics(
  result: QuizResult,
  threshold: number = 60
): string[] {
  return Object.entries(result.byTopic)
    .filter(([, data]) => {
      if (data.total === 0) return false;
      const topicScore = (data.correct / data.total) * 100;
      return topicScore < threshold;
    })
    .map(([topicId]) => topicId);
}
