export interface WrongQuestion {
  id: string;
  subject: string;
  grade: string;
  questionContent: string;
  studentAnswer: string;
  correctAnswer: string;
  imageUrl?: string;
  errorType: string;
  knowledgePoints: string[];
  analysis: string;
  createdAt: string;
  status: 'pending' | 'analyzed' | 'practiced';
}

export interface PracticeQuestion {
  id: string;
  relatedWrongQuestionId: string;
  questionContent: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isAnswered: boolean;
  isCorrect?: boolean;
  studentAnswer?: string;
}

export interface AnalysisResult {
  errorType: string;
  knowledgePoints: string[];
  analysis: string;
  suggestions: string[];
  practiceQuestions: PracticeQuestion[];
}

export interface StudentStats {
  totalQuestions: number;
  masteredQuestions: number;
  accuracyRate: number;
  subjectDistribution: { subject: string; count: number }[];
  recentTrend: { date: string; correct: number; total: number }[];
}

// 教学模块相关类型
export interface TeachingQuestion {
  id: string;
  content: string;
  subject: string;
  grade: string;
  imageUrl?: string;
}

export interface TeachingStep {
  stepNumber: number;
  title: string;
  content: string;
  hint: string;
  interactive?: {
    type: 'question' | 'choice' | 'similar';
    question: string;
    answer?: string;
    options?: string[];
    correctAnswer?: string;
    similarProblem?: string;
  };
}

export interface TeachingSession {
  id: string;
  question: string;
  subject: string;
  grade: string;
  createdAt: string;
  isCompleted: boolean;
  stepsCount: number;
}
