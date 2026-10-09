import React, { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Typography,
  Tag,
  Space,
  Steps,
  Alert,
  Divider,
  Row,
  Col,
  Timeline,
  Collapse,
  Upload,
  message,
  Empty,
  List,
  Avatar,
} from 'antd';
import {
  RobotOutlined,
  BulbOutlined,
  BookOutlined,
  HistoryOutlined,
  CameraOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
  StarOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { TeachingStep, TeachingSession } from '../types';
import { mockTeachingSteps, mockTeachingHistory } from '../teachingData';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const TeachingModule: React.FC = () => {
  const [inputMode, setInputMode] = useState<'text' | 'photo'>('text');
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [isTeaching, setIsTeaching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [teachingSteps, setTeachingSteps] = useState<TeachingStep[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [history, setHistory] = useState<TeachingSession[]>(mockTeachingHistory);

  const handleStartTeaching = () => {
    if (!question.trim()) {
      message.warning('请输入题目内容');
      return;
    }
    if (!subject) {
      message.warning('请选择科目');
      return;
    }

    setIsTeaching(true);
    setCurrentStep(0);
    setTeachingSteps(mockTeachingSteps);
    setShowHint(false);
    setUserAnswer('');
    setShowAnswer(false);
    setSelectedChoice('');

    // 添加到历史记录
    const newSession: TeachingSession = {
      id: Date.now().toString(),
      question: question,
      subject: subject,
      grade: grade || '未选择',
      createdAt: new Date().toISOString().split('T')[0],
      isCompleted: false,
      stepsCount: mockTeachingSteps.length,
    };
    setHistory([newSession, ...history]);
  };

  const handleNextStep = () => {
    if (currentStep < teachingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
      setUserAnswer('');
      setShowAnswer(false);
      setSelectedChoice('');
    } else {
      message.success('🎉 太棒了！你已经完成了这道题的学习！');
      // 标记历史为已完成
      const updatedHistory = history.map((h) =>
        h.id === history[0]?.id ? { ...h, isCompleted: true } : h
      );
      setHistory(updatedHistory);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHint(false);
      setUserAnswer('');
      setShowAnswer(false);
      setSelectedChoice('');
    }
  };

  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) {
      message.warning('请先输入你的答案');
      return;
    }
    setShowAnswer(true);
  };

  const handleCheckChoice = () => {
    if (!selectedChoice) {
      message.warning('请先选择一个答案');
      return;
    }
    setShowAnswer(true);
  };

  const handleReset = () => {
    setIsTeaching(false);
    setQuestion('');
    setSubject('');
    setGrade('');
    setCurrentStep(0);
    setTeachingSteps([]);
  };

  const currentTeachingStep = teachingSteps[currentStep];

  return (
    <div className="p-4">
      <Title level={3} className="mb-4!">
        📚 AI教学讲解
      </Title>

      {!isTeaching ? (
        // 输入界面
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <span>
                  <RobotOutlined className="mr-2 text-blue-500" />
                  告诉我你不会的题目
                </span>
              }
              className="shadow-sm"
            >
              <Space direction="vertical" className="w-full" size="large">
                <div>
                  <Text strong className="mb-2 block">
                    选择输入方式：
                  </Text>
                  <Space>
                    <Button
                      type={inputMode === 'text' ? 'primary' : 'default'}
                      icon={<EditOutlined />}
                      onClick={() => setInputMode('text')}
                    >
                      文字输入
                    </Button>
                    <Button
                      type={inputMode === 'photo' ? 'primary' : 'default'}
                      icon={<CameraOutlined />}
                      onClick={() => setInputMode('photo')}
                    >
                      拍照识别
                    </Button>
                  </Space>
                </div>

                {inputMode === 'text' ? (
                  <div>
                    <Text strong className="mb-2 block">
                      题目内容：
                    </Text>
                    <TextArea
                      rows={6}
                      placeholder="请输入你不会的题目，例如：一个水池有甲乙两个进水管，单开甲管6小时可以注满..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="text-base"
                    />
                  </div>
                ) : (
                  <div>
                    <Upload.Dragger
                      name="file"
                      multiple={false}
                      action="#"
                      accept="image/*"
                      showUploadList={false}
                      onChange={(info) => {
                        if (info.file.status === 'done') {
                          message.success('图片上传成功！正在识别...');
                          setTimeout(() => {
                            setQuestion(
                              '[识别结果] 一个水池有甲乙两个进水管，单开甲管6小时可以注满，单开乙管8小时可以注满。如果两管同时开，几小时可以注满？'
                            );
                            setSubject('数学');
                            setGrade('五年级');
                            message.info('识别完成，请确认题目内容');
                          }, 1500);
                        }
                      }}
                      className="bg-blue-50"
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                      </p>
                      <p className="ant-upload-text text-lg">点击或拖拽上传图片</p>
                      <p className="ant-upload-hint">
                        支持拍照上传题目，系统将自动识别内容
                      </p>
                    </Upload.Dragger>
                  </div>
                )}

                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong className="mb-2 block">
                      科目：
                    </Text>
                    <Select
                      placeholder="选择科目"
                      className="w-full"
                      value={subject || undefined}
                      onChange={(value) => setSubject(value)}
                      options={[
                        { value: '数学', label: '📐 数学' },
                        { value: '语文', label: '📖 语文' },
                        { value: '英语', label: '🔤 英语' },
                        { value: '科学', label: '🔬 科学' },
                      ]}
                    />
                  </Col>
                  <Col span={12}>
                    <Text strong className="mb-2 block">
                      年级（可选）：
                    </Text>
                    <Select
                      placeholder="选择年级"
                      className="w-full"
                      value={grade || undefined}
                      onChange={(value) => setGrade(value)}
                      allowClear
                      options={[
                        { value: '一年级', label: '一年级' },
                        { value: '二年级', label: '二年级' },
                        { value: '三年级', label: '三年级' },
                        { value: '四年级', label: '四年级' },
                        { value: '五年级', label: '五年级' },
                        { value: '六年级', label: '六年级' },
                      ]}
                    />
                  </Col>
                </Row>

                <Button
                  type="primary"
                  size="large"
                  icon={<RobotOutlined />}
                  onClick={handleStartTeaching}
                  block
                  className="h-12 text-lg"
                >
                  开始AI讲解
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={
                <span>
                  <HistoryOutlined className="mr-2 text-purple-500" />
                  学习历史
                </span>
              }
              className="shadow-sm"
            >
              <List
                size="small"
                dataSource={history.slice(0, 5)}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor:
                              item.subject === '数学'
                                ? '#1890ff'
                                : item.subject === '语文'
                                ? '#52c41a'
                                : item.subject === '英语'
                                ? '#722ed1'
                                : '#faad14',
                          }}
                          icon={<BookOutlined />}
                        />
                      }
                      title={
                        <Space>
                          <Tag color="blue">{item.subject}</Tag>
                          <Text type="secondary" className="text-xs">
                            {item.createdAt}
                          </Text>
                        </Space>
                      }
                      description={
                        <Text className="text-sm">
                          {item.question.slice(0, 30)}...
                        </Text>
                      }
                    />
                    {item.isCompleted && (
                      <Tag color="success" icon={<CheckCircleOutlined />}>
                        已学会
                      </Tag>
                    )}
                  </List.Item>
                )}
              />
            </Card>

            <Card className="mt-4 shadow-sm bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <div className="text-center">
                <TrophyOutlined className="text-4xl text-yellow-500 mb-2" />
                <Title level={5} className="mb-1">
                  学习小贴士
                </Title>
                <Paragraph type="secondary" className="mb-0 text-sm">
                  遇到不会的题不要怕，跟着AI老师一步一步学，你一定能学会！💪
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        // 教学讲解界面
        <div>
          {/* 顶部进度条 */}
          <Card className="mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Space>
                <Button icon={<ArrowLeftOutlined />} onClick={handleReset}>
                  返回
                </Button>
                <Title level={4} className="mb-0!">
                  AI正在为你讲解
                </Title>
                {subject && <Tag color="blue">{subject}</Tag>}
              </Space>
              <Text type="secondary">
                第 {currentStep + 1} / {teachingSteps.length} 步
              </Text>
            </div>
            <Steps
              current={currentStep}
              size="small"
              items={teachingSteps.map((step, index) => ({
                title: `第${index + 1}步`,
                status: index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait',
              }))}
            />
          </Card>

          {/* 当前步骤内容 */}
          {currentTeachingStep && (
            <Card
              title={
                <Space>
                  <BulbOutlined className="text-yellow-500" />
                  <span>{currentTeachingStep.title}</span>
                </Space>
              }
              className="shadow-sm mb-4"
            >
              {/* 讲解内容 */}
              <div className="p-4 bg-blue-50 rounded-lg mb-4">
                <Paragraph className="text-base whitespace-pre-line mb-0">
                  {currentTeachingStep.content}
                </Paragraph>
              </div>

              {/* 提示 */}
              <Alert
                message={
                  <Space>
                    <QuestionCircleOutlined className="text-blue-500" />
                    <Text strong>小提示：</Text>
                    <Text>{currentTeachingStep.hint}</Text>
                  </Space>
                }
                type="info"
                showIcon={false}
                className="mb-4"
              />

              {/* 互动环节 */}
              {currentTeachingStep.interactive && (
                <div className="mt-6">
                  <Divider>
                    <Space>
                      <StarOutlined className="text-yellow-500" />
                      <Text strong>互动练习</Text>
                    </Space>
                  </Divider>

                  <Card className="bg-green-50 border-green-200">
                    <Text strong className="text-base block mb-3">
                      {currentTeachingStep.interactive.question}
                    </Text>

                    {/* 问答题 */}
                    {currentTeachingStep.interactive.type === 'question' && (
                      <div>
                        <TextArea
                          rows={3}
                          placeholder="输入你的答案..."
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          disabled={showAnswer}
                          className="mb-3"
                        />
                        {!showAnswer ? (
                          <Button
                            type="primary"
                            onClick={handleCheckAnswer}
                            icon={<CheckCircleOutlined />}
                          >
                            提交答案
                          </Button>
                        ) : (
                          <Alert
                            message={
                              <div>
                                <Text strong className="text-green-600">
                                  ✅ 参考答案：
                                </Text>
                                <Paragraph className="mb-0 mt-1">
                                  {currentTeachingStep.interactive.answer}
                                </Paragraph>
                              </div>
                            }
                            type="success"
                            showIcon={false}
                          />
                        )}
                      </div>
                    )}

                    {/* 选择题 */}
                    {currentTeachingStep.interactive.type === 'choice' && (
                      <div>
                        <Space direction="vertical" className="w-full">
                          {currentTeachingStep.interactive.options?.map((option, index) => {
                            const optionLetter = option.charAt(0);
                            const isCorrect =
                              showAnswer &&
                              optionLetter === currentTeachingStep.interactive?.correctAnswer;
                            const isWrong =
                              showAnswer &&
                              optionLetter === selectedChoice &&
                              optionLetter !== currentTeachingStep.interactive?.correctAnswer;

                            return (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  isCorrect
                                    ? 'border-green-500 bg-green-50'
                                    : isWrong
                                    ? 'border-red-500 bg-red-50'
                                    : selectedChoice === optionLetter
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                                }`}
                                onClick={() => !showAnswer && setSelectedChoice(optionLetter)}
                              >
                                <Text>{option}</Text>
                              </div>
                            );
                          })}
                        </Space>
                        <div className="mt-3">
                          {!showAnswer ? (
                            <Button
                              type="primary"
                              onClick={handleCheckChoice}
                              disabled={!selectedChoice}
                              icon={<CheckCircleOutlined />}
                            >
                              提交答案
                            </Button>
                          ) : (
                            <Alert
                              message={
                                selectedChoice === currentTeachingStep.interactive.correctAnswer
                                  ? '🎉 回答正确！你真聪明！'
                                  : `❌ 答案是 ${currentTeachingStep.interactive.correctAnswer}，再想想为什么哦！`
                              }
                              type={
                                selectedChoice === currentTeachingStep.interactive.correctAnswer
                                  ? 'success'
                                  : 'error'
                              }
                              showIcon={false}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* 类似题目 */}
                    {currentTeachingStep.interactive.type === 'similar' && (
                      <div>
                        <Card size="small" className="bg-white mb-3">
                          <Text strong>类似题目：</Text>
                          <Paragraph className="mb-0 mt-2">
                            {currentTeachingStep.interactive.similarProblem}
                          </Paragraph>
                        </Card>
                        <TextArea
                          rows={3}
                          placeholder="试着解答这道类似的题目..."
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          disabled={showAnswer}
                          className="mb-3"
                        />
                        {!showAnswer ? (
                          <Button
                            type="primary"
                            onClick={handleCheckAnswer}
                            icon={<CheckCircleOutlined />}
                          >
                            查看答案解析
                          </Button>
                        ) : (
                          <Alert
                            message={
                              <div>
                                <Text strong className="text-green-600">
                                  ✅ 参考答案：
                                </Text>
                                <Paragraph className="mb-0 mt-1">
                                  {currentTeachingStep.interactive.answer}
                                </Paragraph>
                              </div>
                            }
                            type="success"
                            showIcon={false}
                          />
                        )}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* 导航按钮 */}
              <div className="flex justify-between mt-6">
                <Button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  icon={<ArrowLeftOutlined />}
                >
                  上一步
                </Button>
                <Button
                  type="primary"
                  onClick={handleNextStep}
                  icon={<ArrowRightOutlined />}
                >
                  {currentStep === teachingSteps.length - 1 ? '完成学习' : '下一步'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TeachingModule;
