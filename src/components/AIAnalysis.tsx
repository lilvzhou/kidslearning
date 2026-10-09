import React, { useState } from 'react';
import {
  Card,
  Button,
  Select,
  Typography,
  Tag,
  Space,
  Steps,
  Alert,
  List,
  Divider,
  Spin,
  Empty,
  Row,
  Col,
} from 'antd';
import {
  RobotOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  FileSearchOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { WrongQuestion, AnalysisResult } from '../types';
import { mockWrongQuestions, mockAnalysisResult } from '../mockData';

const { Title, Text, Paragraph } = Typography;

const AIAnalysis: React.FC<{
  onGeneratePractice: (result: AnalysisResult, question: WrongQuestion) => void;
}> = ({ onGeneratePractice }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<WrongQuestion | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const pendingQuestions = mockWrongQuestions.filter(
    (q) => q.status === 'pending' || q.status === 'analyzed'
  );

  const handleAnalyze = () => {
    if (!selectedQuestion) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setCurrentStep(0);

    // 模拟AI分析过程
    const steps = [
      { step: 0, delay: 800 },
      { step: 1, delay: 1500 },
      { step: 2, delay: 2200 },
      { step: 3, delay: 3000 },
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => setCurrentStep(step), delay);
    });

    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
      setIsAnalyzing(false);
    }, 3500);
  };

  const handleSelectQuestion = (id: string) => {
    const question = mockWrongQuestions.find((q) => q.id === id);
    setSelectedQuestion(question || null);
    setAnalysisResult(null);
    setCurrentStep(0);
  };

  return (
    <div className="p-4">
      <Title level={3} className="mb-4!">
        🤖 AI智能分析
      </Title>

      <Row gutter={[16, 16]}>
        {/* 左侧：选择错题 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <span>
                <FileSearchOutlined className="mr-2" />
                选择错题进行分析
              </span>
            }
            className="shadow-sm h-full"
          >
            <Select
              placeholder="选择一道待分析的错题"
              className="w-full mb-4"
              onChange={handleSelectQuestion}
              value={selectedQuestion?.id}
              options={pendingQuestions.map((q) => ({
                value: q.id,
                label: `${q.subject} - ${q.questionContent.slice(0, 20)}...`,
              }))}
            />

            {selectedQuestion && (
              <Card
                size="small"
                className="bg-gray-50 mb-4"
                title={
                  <Space>
                    <Tag color="blue">{selectedQuestion.subject}</Tag>
                    <Text type="secondary">{selectedQuestion.grade}</Text>
                  </Space>
                }
              >
                <Paragraph className="mb-2">
                  <Text strong>题目：</Text>
                  {selectedQuestion.questionContent}
                </Paragraph>
                <Paragraph className="mb-2">
                  <Text strong>我的答案：</Text>
                  <Text type="danger">{selectedQuestion.studentAnswer}</Text>
                </Paragraph>
                <Paragraph className="mb-0">
                  <Text strong>正确答案：</Text>
                  <Text type="success">{selectedQuestion.correctAnswer}</Text>
                </Paragraph>
              </Card>
            )}

            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={handleAnalyze}
              disabled={!selectedQuestion || isAnalyzing}
              block
              size="large"
              className="mt-2"
            >
              {isAnalyzing ? 'AI分析中...' : '开始AI分析'}
            </Button>
          </Card>
        </Col>

        {/* 右侧：分析结果 */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <span>
                <ExperimentOutlined className="mr-2" />
                分析结果
              </span>
            }
            className="shadow-sm"
          >
            {/* 分析进度 */}
            {isAnalyzing && (
              <div className="mb-6">
                <Steps
                  current={currentStep}
                  items={[
                    {
                      title: '读取题目',
                      icon: currentStep === 0 ? <LoadingOutlined /> : <CheckCircleOutlined />,
                    },
                    {
                      title: '识别知识点',
                      icon: currentStep === 1 ? <LoadingOutlined /> : <CheckCircleOutlined />,
                    },
                    {
                      title: '分析错误原因',
                      icon: currentStep === 2 ? <LoadingOutlined /> : <CheckCircleOutlined />,
                    },
                    {
                      title: '生成建议',
                      icon: currentStep === 3 ? <LoadingOutlined /> : <CheckCircleOutlined />,
                    },
                  ]}
                />
                <div className="text-center mt-6">
                  <Spin size="large" />
                  <Paragraph className="mt-4 text-gray-500">
                    AI正在认真分析这道错题，请稍候...
                  </Paragraph>
                </div>
              </div>
            )}

            {/* 分析结果展示 */}
            {analysisResult && !isAnalyzing && (
              <div className="space-y-6">
                {/* 错误类型 */}
                <Alert
                  message={
                    <span>
                      <ThunderboltOutlined className="mr-2 text-yellow-500" />
                      错误类型：<Tag color="red">{analysisResult.errorType}</Tag>
                    </span>
                  }
                  type="warning"
                  showIcon={false}
                  className="mb-4"
                />

                {/* 知识点 */}
                <div>
                  <Title level={5}>
                    <BulbOutlined className="mr-2 text-yellow-500" />
                    涉及知识点
                  </Title>
                  <Space wrap>
                    {analysisResult.knowledgePoints.map((kp, i) => (
                      <Tag key={i} color="cyan" className="text-sm py-1 px-3">
                        {kp}
                      </Tag>
                    ))}
                  </Space>
                </div>

                <Divider />

                {/* 详细分析 */}
                <div>
                  <Title level={5}>
                    <FileSearchOutlined className="mr-2 text-blue-500" />
                    错误分析
                  </Title>
                  <Card className="bg-blue-50 border-blue-200">
                    <Paragraph className="mb-0 text-gray-700">
                      {analysisResult.analysis}
                    </Paragraph>
                  </Card>
                </div>

                {/* 改进建议 */}
                <div>
                  <Title level={5}>
                    <BulbOutlined className="mr-2 text-green-500" />
                    改进建议
                  </Title>
                  <List
                    size="small"
                    dataSource={analysisResult.suggestions}
                    renderItem={(item, index) => (
                      <List.Item>
                        <Space>
                          <Tag color="green">{index + 1}</Tag>
                          <Text>{item}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </div>

                <Divider />

                {/* 生成练习题按钮 */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-center">
                  <Title level={5} className="mb-2">
                    🎯 根据分析结果，为你准备了 {analysisResult.practiceQuestions.length} 道针对性练习题
                  </Title>
                  <Paragraph type="secondary" className="mb-4">
                    这些练习题专门针对你的薄弱环节设计，帮助你巩固知识点
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ThunderboltOutlined />}
                    onClick={() =>
                      selectedQuestion && onGeneratePractice(analysisResult, selectedQuestion)
                    }
                    className="bg-gradient-to-r from-purple-500 to-blue-500 border-none"
                  >
                    开始针对性练习
                  </Button>
                </Card>
              </div>
            )}

            {/* 空状态 */}
            {!analysisResult && !isAnalyzing && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-400">
                    {selectedQuestion
                      ? '点击"开始AI分析"按钮，让AI帮你分析这道错题'
                      : '请先选择一道错题进行分析'}
                  </span>
                }
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AIAnalysis;
