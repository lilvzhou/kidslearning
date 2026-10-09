import React, { useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Tag,
  Space,
  Progress,
  Radio,
  Result,
  Alert,
  Divider,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  StarFilled,
  FireOutlined,
} from '@ant-design/icons';
import { PracticeQuestion, AnalysisResult, WrongQuestion } from '../types';

const { Title, Text, Paragraph } = Typography;

interface PracticeGeneratorProps {
  analysisResult: AnalysisResult | null;
  wrongQuestion: WrongQuestion | null;
  onBack: () => void;
}

const PracticeGenerator: React.FC<PracticeGeneratorProps> = ({
  analysisResult,
  wrongQuestion,
  onBack,
}) => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>(
    analysisResult?.practiceQuestions || []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQuestion,
      isAnswered: true,
      isCorrect,
      studentAnswer: selectedAnswer,
    };
    setQuestions(updatedQuestions);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevQ = questions[currentIndex - 1];
      setSelectedAnswer(prevQ.studentAnswer || '');
      setShowResult(prevQ.isAnswered);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setIsCompleted(false);
    setCorrectCount(0);
    setQuestions(
      questions.map((q) => ({
        ...q,
        isAnswered: false,
        isCorrect: undefined,
        studentAnswer: undefined,
      }))
    );
  };

  // 完成页面
  if (isCompleted) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;

    return (
      <div className="p-4">
        <Card className="shadow-sm">
          <Result
            icon={
              <div className="text-6xl">
                {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
              </div>
            }
            title={
              <span className="text-2xl">
                {accuracy >= 80
                  ? '太棒了！你已经掌握了！'
                  : accuracy >= 60
                  ? '做得不错，继续加油！'
                  : '别灰心，多练习就会进步！'}
              </span>
            }
            subTitle={
              <div className="space-y-2">
                <Text className="text-lg">
                  你答对了 {correctCount}/{questions.length} 题，正确率 {accuracy}%
                </Text>
                <div className="flex justify-center gap-1 mt-2">
                  {[1, 2, 3].map((i) => (
                    <StarFilled
                      key={i}
                      className={`text-3xl ${
                        i <= stars ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            }
            extra={
              <Space>
                <Button type="primary" onClick={handleRestart} icon={<ReloadOutlined />}>
                  再练一次
                </Button>
                <Button onClick={onBack}>返回分析</Button>
              </Space>
            }
          />

          {/* 答题详情 */}
          <Divider />
          <Title level={5}>📋 答题详情</Title>
          <div className="space-y-3 mt-4">
            {questions.map((q, index) => (
              <Card
                key={q.id}
                size="small"
                className={
                  q.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Text strong>
                      第{index + 1}题：
                    </Text>
                    <Text className="ml-2">{q.questionContent.slice(0, 40)}...</Text>
                  </div>
                  {q.isCorrect ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                      正确
                    </Tag>
                  ) : (
                    <Tag color="error" icon={<CloseCircleOutlined />}>
                      错误
                    </Tag>
                  )}
                </div>
                {!q.isCorrect && (
                  <div className="mt-2">
                    <Text type="secondary" className="text-sm">
                      正确答案：{q.correctAnswer} | 你的答案：{q.studentAnswer}
                    </Text>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // 无练习题时的空状态
  if (!analysisResult || questions.length === 0) {
    return (
      <div className="p-4">
        <Card className="shadow-sm text-center py-12">
          <Result
            status="info"
            title="暂无练习题"
            subTitle="请先在AI分析模块中分析错题，然后生成练习题"
            extra={
              <Button type="primary" onClick={onBack}>
                返回
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* 顶部信息栏 */}
      <Card className="mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
              返回
            </Button>
            <Title level={4} className="mb-0!">
              🎯 针对性练习
            </Title>
            {wrongQuestion && (
              <Tag color="blue">{wrongQuestion.subject}</Tag>
            )}
          </Space>
          <Space>
            <Statistic
              title="进度"
              value={`${currentIndex + 1}/${questions.length}`}
              valueStyle={{ fontSize: 16 }}
            />
            <Statistic
              title="正确"
              value={correctCount}
              valueStyle={{ fontSize: 16, color: '#52c41a' }}
            />
          </Space>
        </div>
        <Progress
          percent={progress}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          className="mt-3"
        />
      </Card>

      {/* 题目卡片 */}
      {currentQuestion && (
        <Card
          className="shadow-sm mb-4"
          title={
            <Space>
              <FireOutlined className="text-orange-500" />
              <span>第 {currentIndex + 1} 题</span>
              <Tag
                color={
                  currentQuestion.difficulty === 'easy'
                    ? 'green'
                    : currentQuestion.difficulty === 'medium'
                    ? 'orange'
                    : 'red'
                }
              >
                {currentQuestion.difficulty === 'easy'
                  ? '基础'
                  : currentQuestion.difficulty === 'medium'
                  ? '进阶'
                  : '挑战'}
              </Tag>
            </Space>
          }
        >
          {/* 题目内容 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Paragraph className="text-lg mb-0">
              {currentQuestion.questionContent}
            </Paragraph>
          </div>

          {/* 选项 */}
          {currentQuestion.options && (
            <Radio.Group
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              className="w-full space-y-3"
              disabled={showResult}
            >
              {currentQuestion.options.map((option, index) => {
                const optionLetter = option.charAt(0);
                let optionClass = 'w-full p-3 rounded-lg border-2 transition-all';

                if (showResult) {
                  if (optionLetter === currentQuestion.correctAnswer) {
                    optionClass += ' border-green-500 bg-green-50';
                  } else if (
                    optionLetter === selectedAnswer &&
                    optionLetter !== currentQuestion.correctAnswer
                  ) {
                    optionClass += ' border-red-500 bg-red-50';
                  } else {
                    optionClass += ' border-gray-200';
                  }
                } else {
                  optionClass +=
                    selectedAnswer === optionLetter
                      ? ' border-blue-500 bg-blue-50'
                      : ' border-gray-200 hover:border-blue-300 hover:bg-blue-50/50';
                }

                return (
                  <div key={index} className={optionClass}>
                    <Radio value={optionLetter} className="w-full">
                      <span className="text-base">{option}</span>
                    </Radio>
                  </div>
                );
              })}
            </Radio.Group>
          )}

          {/* 答题结果 */}
          {showResult && (
            <div className="mt-4">
              <Alert
                message={
                  currentQuestion.isCorrect
                    ? '✅ 回答正确！太棒了！'
                    : `❌ 回答错误，正确答案是 ${currentQuestion.correctAnswer}`
                }
                type={currentQuestion.isCorrect ? 'success' : 'error'}
                showIcon={false}
                className="mb-3"
              />
              <Card size="small" className="bg-yellow-50 border-yellow-200">
                <Text strong>💡 解析：</Text>
                <Paragraph className="mb-0 mt-1">
                  {currentQuestion.explanation}
                </Paragraph>
              </Card>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              icon={<ArrowLeftOutlined />}
            >
              上一题
            </Button>

            {!showResult ? (
              <Button
                type="primary"
                onClick={handleAnswer}
                disabled={!selectedAnswer}
                size="large"
              >
                提交答案
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleNext}
                size="large"
                icon={<ArrowRightOutlined />}
              >
                {currentIndex === questions.length - 1 ? '查看结果' : '下一题'}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* 题目导航 */}
      <Card className="shadow-sm" size="small">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {questions.map((q, index) => (
            <Button
              key={q.id}
              type={index === currentIndex ? 'primary' : 'default'}
              size="small"
              className={`w-8 h-8 rounded-full ${
                q.isAnswered
                  ? q.isCorrect
                    ? '!bg-green-500 !border-green-500 !text-white'
                    : '!bg-red-500 !border-red-500 !text-white'
                  : ''
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setSelectedAnswer(q.studentAnswer || '');
                setShowResult(q.isAnswered);
              }}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PracticeGenerator;
