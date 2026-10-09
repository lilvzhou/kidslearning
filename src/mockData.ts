import { WrongQuestion, PracticeQuestion, AnalysisResult } from './types';

// 模拟错题数据
export const mockWrongQuestions: WrongQuestion[] = [
  {
    id: '1',
    subject: '数学',
    grade: '三年级',
    questionContent: '小明有15个苹果，给了小红8个，又买了6个，现在小明有多少个苹果？',
    studentAnswer: '23',
    correctAnswer: '13',
    errorType: '计算错误',
    knowledgePoints: ['加减混合运算', '应用题理解'],
    analysis: '学生在进行加减混合运算时，没有正确理解"给了"表示减少，"买了"表示增加。应该先算15-8=7，再算7+6=13。',
    createdAt: '2024-01-15',
    status: 'analyzed'
  },
  {
    id: '2',
    subject: '数学',
    grade: '三年级',
    questionContent: '一个长方形的长是8厘米，宽是5厘米，求它的周长。',
    studentAnswer: '40厘米',
    correctAnswer: '26厘米',
    errorType: '公式运用错误',
    knowledgePoints: ['长方形周长', '乘法运算'],
    analysis: '学生将长和宽直接相乘再乘以2，混淆了周长和面积的计算方法。周长应该是(长+宽)×2=(8+5)×2=26厘米。',
    createdAt: '2024-01-14',
    status: 'analyzed'
  },
  {
    id: '3',
    subject: '语文',
    grade: '三年级',
    questionContent: '把下面的句子补充完整："春天来了，花儿____。"',
    studentAnswer: '春天来了，花儿开了。',
    correctAnswer: '春天来了，花儿绽放了。（或"开了"也可）',
    errorType: '表达不够丰富',
    knowledgePoints: ['词语运用', '句子补充'],
    analysis: '学生的答案基本正确，但可以尝试使用更丰富的词汇，如"绽放"、"盛开"等，提高语言表达能力。',
    createdAt: '2024-01-13',
    status: 'practiced'
  },
  {
    id: '4',
    subject: '数学',
    grade: '三年级',
    questionContent: '36÷4=？',
    studentAnswer: '8',
    correctAnswer: '9',
    errorType: '计算错误',
    knowledgePoints: ['除法运算', '乘法口诀'],
    analysis: '学生在运用乘法口诀时出现错误，4×8=32≠36，正确答案应该是4×9=36，所以36÷4=9。',
    createdAt: '2024-01-12',
    status: 'analyzed'
  },
  {
    id: '5',
    subject: '英语',
    grade: '三年级',
    questionContent: '选择正确的答案：I ___ a student. (am/is/are)',
    studentAnswer: 'is',
    correctAnswer: 'am',
    errorType: '语法错误',
    knowledgePoints: ['be动词用法', '主谓一致'],
    analysis: '学生没有掌握be动词与主语的对应关系。I后面应该用am，he/she/it后面用is，you/we/they后面用are。',
    createdAt: '2024-01-11',
    status: 'pending'
  }
];

// 模拟AI分析结果
export const mockAnalysisResult: AnalysisResult = {
  errorType: '计算错误',
  knowledgePoints: ['加减混合运算', '应用题理解'],
  analysis: '学生在进行加减混合运算时，没有正确理解"给了"表示减少，"买了"表示增加。需要加强对应用题中关键词的理解。',
  suggestions: [
    '建议多练习带有"给了"、"买了"、"吃了"等关键词的应用题',
    '可以通过画图的方式帮助理解题意',
    '建议每天练习5道类似的混合运算题目',
    '注意审题，先确定是加还是减，再计算'
  ],
  practiceQuestions: [
    {
      id: 'p1',
      relatedWrongQuestionId: '1',
      questionContent: '小红有20颗糖，吃了5颗，妈妈又给了她8颗，现在小红有多少颗糖？',
      options: ['A. 23颗', 'B. 15颗', 'C. 33颗', 'D. 12颗'],
      correctAnswer: 'A',
      explanation: '20-5=15（吃了减少），15+8=23（妈妈给增加），所以答案是23颗。',
      difficulty: 'easy',
      isAnswered: false
    },
    {
      id: 'p2',
      relatedWrongQuestionId: '1',
      questionContent: '书架上有30本书，借走了12本，又买来7本，现在书架上有多少本书？',
      options: ['A. 49本', 'B. 18本', 'C. 25本', 'D. 11本'],
      correctAnswer: 'C',
      explanation: '30-12=18（借走减少），18+7=25（买来增加），所以答案是25本。',
      difficulty: 'easy',
      isAnswered: false
    },
    {
      id: 'p3',
      relatedWrongQuestionId: '1',
      questionContent: '停车场有45辆车，开走了18辆，又开来12辆，现在停车场有多少辆车？',
      options: ['A. 75辆', 'B. 27辆', 'C. 39辆', 'D. 15辆'],
      correctAnswer: 'C',
      explanation: '45-18=27（开走减少），27+12=39（开来增加），所以答案是39辆。',
      difficulty: 'medium',
      isAnswered: false
    },
    {
      id: 'p4',
      relatedWrongQuestionId: '1',
      questionContent: '小明存钱罐里有50元，买文具花了15元，过生日收到20元红包，现在存钱罐里有多少元？',
      options: ['A. 85元', 'B. 35元', 'C. 55元', 'D. 45元'],
      correctAnswer: 'C',
      explanation: '50-15=35（花费减少），35+20=55（红包增加），所以答案是55元。',
      difficulty: 'medium',
      isAnswered: false
    },
    {
      id: 'p5',
      relatedWrongQuestionId: '1',
      questionContent: '果园里有80棵苹果树，砍掉了15棵老树，又种了20棵新树，现在果园里有多少棵苹果树？',
      options: ['A. 115棵', 'B. 45棵', 'C. 85棵', 'D. 75棵'],
      correctAnswer: 'C',
      explanation: '80-15=65（砍掉减少），65+20=85（种新树增加），所以答案是85棵。',
      difficulty: 'hard',
      isAnswered: false
    }
  ]
};

// 模拟学生统计数据
export const mockStudentStats = {
  totalQuestions: 48,
  masteredQuestions: 32,
  accuracyRate: 78,
  subjectDistribution: [
    { subject: '数学', count: 25 },
    { subject: '语文', count: 13 },
    { subject: '英语', count: 10 }
  ],
  recentTrend: [
    { date: '周一', correct: 4, total: 5 },
    { date: '周二', correct: 3, total: 5 },
    { date: '周三', correct: 5, total: 5 },
    { date: '周四', correct: 4, total: 6 },
    { date: '周五', correct: 5, total: 5 },
    { date: '周六', correct: 3, total: 4 },
    { date: '周日', correct: 4, total: 5 }
  ]
};
