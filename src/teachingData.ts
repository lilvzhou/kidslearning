import { TeachingQuestion, TeachingStep, TeachingSession } from './types';

// 模拟教学数据
export const mockTeachingHistory: TeachingSession[] = [
  {
    id: 't1',
    question: '一个水池有甲乙两个进水管，单开甲管6小时可以注满，单开乙管8小时可以注满。如果两管同时开，几小时可以注满？',
    subject: '数学',
    grade: '五年级',
    createdAt: '2024-01-15',
    isCompleted: true,
    stepsCount: 5,
  },
  {
    id: 't2',
    question: '"小鸟在树上唱歌"这句话用了什么修辞手法？',
    subject: '语文',
    grade: '三年级',
    createdAt: '2024-01-14',
    isCompleted: true,
    stepsCount: 4,
  },
  {
    id: 't3',
    question: '为什么天空是蓝色的？',
    subject: '科学',
    grade: '四年级',
    createdAt: '2024-01-13',
    isCompleted: true,
    stepsCount: 6,
  },
];

// 模拟AI分步讲解
export const mockTeachingSteps: TeachingStep[] = [
  {
    stepNumber: 1,
    title: '🔍 理解题目',
    content: '这是一道关于"工程问题"的应用题。题目告诉我们有两个水管，分别有不同的注水速度，问一起开需要多久。',
    hint: '先别急着算，让我们把题目中的关键信息找出来！',
    interactive: {
      type: 'question',
      question: '题目中有哪些关键信息？（提示：想想有哪些数字和条件）',
      answer: '关键信息有：甲管6小时注满，乙管8小时注满，两管同时开。',
    },
  },
  {
    stepNumber: 2,
    title: '💡 核心思路',
    content: '我们可以把整个水池看作"1"（就是100%满了）。那么：\n• 甲管每小时注入 1/6 的水\n• 乙管每小时注入 1/8 的水',
    hint: '把整体看作"1"是解这类题的关键技巧哦！',
    interactive: {
      type: 'question',
      question: '如果甲管每小时注入 1/6，那么3小时注入了多少呢？',
      answer: '3小时注入了 3 × 1/6 = 3/6 = 1/2，也就是一半的水。',
    },
  },
  {
    stepNumber: 3,
    title: '🧮 列式计算',
    content: '两管同时开，每小时一共注入：\n1/6 + 1/8 = 4/24 + 3/24 = 7/24\n\n所以每小时注入 7/24 的水。',
    hint: '分数加法要先通分哦！找6和8的最小公倍数是24。',
    interactive: {
      type: 'choice',
      question: '1/6 + 1/8 等于多少？',
      options: ['A. 2/14', 'B. 7/24', 'C. 1/12', 'D. 2/24'],
      correctAnswer: 'B',
    },
  },
  {
    stepNumber: 4,
    title: '🎯 求出答案',
    content: '既然每小时注入 7/24，那么注满整个水池（也就是1）需要：\n\n1 ÷ 7/24 = 1 × 24/7 = 24/7 = 3又3/7 小时\n\n约等于 3小时26分钟',
    hint: '除以一个分数等于乘以它的倒数，记住这个口诀！',
    interactive: {
      type: 'question',
      question: '1 ÷ 7/24 怎么计算？',
      answer: '1 ÷ 7/24 = 1 × 24/7 = 24/7 = 3又3/7（小时）',
    },
  },
  {
    stepNumber: 5,
    title: '✅ 总结与拓展',
    content: '📝 解题总结：\n1. 把总量看作"1"\n2. 算出各自的工作效率\n3. 求合作效率（相加）\n4. 用总量÷合作效率=时间\n\n🌟 类似题目：打印稿件、修路、做零件等都可以用这个方法！',
    hint: '记住这个公式：合作时间 = 总量 ÷ 合作效率',
    interactive: {
      type: 'similar',
      question: '来试试这道类似的题目吧！',
      similarProblem: '一项工程，甲单独做10天完成，乙单独做15天完成。两人合作几天可以完成？',
      answer: '甲效率 1/10，乙效率 1/15，合作效率 1/10+1/15=1/6，所以 1÷1/6=6天',
    },
  },
];
