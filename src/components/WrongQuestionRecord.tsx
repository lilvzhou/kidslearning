import React, { useState } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Tag,
  Table,
  Modal,
  Typography,
  Tabs,
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  CameraOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { WrongQuestion } from '../types';
import { mockWrongQuestions } from '../mockData';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const WrongQuestionRecord: React.FC = () => {
  const [questions, setQuestions] = useState<WrongQuestion[]>(mockWrongQuestions);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<WrongQuestion | null>(null);
  const [inputMode, setInputMode] = useState<'manual' | 'photo'>('manual');
  const [searchText, setSearchText] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('');
  const [form] = Form.useForm();

  const handleAddQuestion = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    const newQuestion: WrongQuestion = {
      id: Date.now().toString(),
      subject: values.subject,
      grade: values.grade,
      questionContent: values.questionContent,
      studentAnswer: values.studentAnswer,
      correctAnswer: values.correctAnswer,
      errorType: values.errorType || '待分析',
      knowledgePoints: values.knowledgePoints
        ? values.knowledgePoints.split(',').map((k: string) => k.trim())
        : [],
      analysis: '',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setQuestions([newQuestion, ...questions]);
    setIsModalVisible(false);
    message.success('错题添加成功！');
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这道错题吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setQuestions(questions.filter((q) => q.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleViewDetail = (question: WrongQuestion) => {
    setSelectedQuestion(question);
    setIsDetailVisible(true);
  };

  const handlePhotoUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success('图片上传成功！正在识别中...');
      // 模拟OCR识别
      setTimeout(() => {
        setInputMode('manual');
        form.setFieldsValue({
          questionContent: '[识别结果] 小明有15个苹果，给了小红8个，又买了6个，现在小明有多少个苹果？',
          subject: '数学',
        });
        message.info('图片识别完成，请确认并补充信息');
      }, 1500);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      !searchText ||
      q.questionContent.includes(searchText) ||
      q.knowledgePoints.some((k) => k.includes(searchText));
    const matchSubject = !filterSubject || q.subject === filterSubject;
    return matchSearch && matchSubject;
  });

  const columns: ColumnsType<WrongQuestion> = [
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      width: 80,
      render: (subject: string) => {
        const colorMap: Record<string, string> = {
          '数学': 'blue',
          '语文': 'green',
          '英语': 'purple',
        };
        return <Tag color={colorMap[subject] || 'default'}>{subject}</Tag>;
      },
    },
    {
      title: '题目内容',
      dataIndex: 'questionContent',
      key: 'questionContent',
      ellipsis: true,
    },
    {
      title: '错误类型',
      dataIndex: 'errorType',
      key: 'errorType',
      width: 120,
      render: (type: string) => (
        <Tag color={type === '计算错误' ? 'red' : type === '公式运用错误' ? 'orange' : 'default'}>
          {type}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: 'gold', text: '待分析' },
          analyzed: { color: 'blue', text: '已分析' },
          practiced: { color: 'green', text: '已练习' },
        };
        const s = statusMap[status] || { color: 'default', text: status };
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: '日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Title level={3} className="mb-0!">
          📝 错题记录
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuestion}>
          添加错题
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <Card className="mb-4 shadow-sm">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Input
              placeholder="搜索题目内容或知识点..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              placeholder="按科目筛选"
              value={filterSubject || undefined}
              onChange={(value) => setFilterSubject(value || '')}
              allowClear
              className="w-full"
              options={[
                { value: '数学', label: '数学' },
                { value: '语文', label: '语文' },
                { value: '英语', label: '英语' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* 错题列表 */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredQuestions}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: false }}
          size="middle"
        />
      </Card>

      {/* 添加错题弹窗 */}
      <Modal
        title="添加错题"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Tabs
          activeKey={inputMode}
          onChange={(key) => setInputMode(key as 'manual' | 'photo')}
          items={[
            {
              key: 'photo',
              label: (
                <span>
                  <CameraOutlined /> 拍照上传
                </span>
              ),
              children: (
                <div className="py-4">
                  <Dragger
                    name="file"
                    multiple={false}
                    action="#"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    showUploadList={false}
                    className="bg-blue-50"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text text-lg">点击或拖拽上传图片</p>
                    <p className="ant-upload-hint">
                      支持拍照上传错题图片，系统将自动识别题目内容
                    </p>
                  </Dragger>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Text type="warning">
                      💡 提示：拍照时请确保题目清晰、光线充足，避免阴影遮挡
                    </Text>
                  </div>
                </div>
              ),
            },
            {
              key: 'manual',
              label: (
                <span>
                  <EditOutlined /> 手动输入
                </span>
              ),
              children: (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="mt-4"
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="subject"
                        label="科目"
                        rules={[{ required: true, message: '请选择科目' }]}
                      >
                        <Select
                          placeholder="选择科目"
                          options={[
                            { value: '数学', label: '📐 数学' },
                            { value: '语文', label: '📖 语文' },
                            { value: '英语', label: '🔤 英语' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="grade"
                        label="年级"
                        rules={[{ required: true, message: '请选择年级' }]}
                      >
                        <Select
                          placeholder="选择年级"
                          options={[
                            { value: '一年级', label: '一年级' },
                            { value: '二年级', label: '二年级' },
                            { value: '三年级', label: '三年级' },
                            { value: '四年级', label: '四年级' },
                            { value: '五年级', label: '五年级' },
                            { value: '六年级', label: '六年级' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="questionContent"
                    label="题目内容"
                    rules={[{ required: true, message: '请输入题目内容' }]}
                  >
                    <TextArea rows={3} placeholder="请输入完整的题目内容..." />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="studentAnswer"
                        label="我的答案"
                        rules={[{ required: true, message: '请输入你的答案' }]}
                      >
                        <Input placeholder="输入你的答案" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="correctAnswer"
                        label="正确答案"
                        rules={[{ required: true, message: '请输入正确答案' }]}
                      >
                        <Input placeholder="输入正确答案" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="errorType" label="错误类型">
                    <Select
                      placeholder="选择错误类型（可选）"
                      allowClear
                      options={[
                        { value: '计算错误', label: '计算错误' },
                        { value: '概念理解错误', label: '概念理解错误' },
                        { value: '公式运用错误', label: '公式运用错误' },
                        { value: '审题不清', label: '审题不清' },
                        { value: '粗心大意', label: '粗心大意' },
                        { value: '语法错误', label: '语法错误' },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item name="knowledgePoints" label="知识点">
                    <Input placeholder="用逗号分隔多个知识点，如：加法,减法,应用题" />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                        保存错题
                      </Button>
                      <Button onClick={() => setIsModalVisible(false)}>取消</Button>
                    </Space>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Modal>

      {/* 错题详情弹窗 */}
      <Modal
        title="错题详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedQuestion && (
          <div className="space-y-4">
            <div>
              <Text strong>科目：</Text>
              <Tag color="blue">{selectedQuestion.subject}</Tag>
              <Text strong className="ml-4">年级：</Text>
              <Text>{selectedQuestion.grade}</Text>
            </div>
            <div>
              <Text strong>题目内容：</Text>
              <Paragraph className="mt-1 p-3 bg-gray-50 rounded">
                {selectedQuestion.questionContent}
              </Paragraph>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>我的答案：</Text>
                <div className="mt-1 p-2 bg-red-50 rounded text-red-600">
                  {selectedQuestion.studentAnswer}
                </div>
              </Col>
              <Col span={12}>
                <Text strong>正确答案：</Text>
                <div className="mt-1 p-2 bg-green-50 rounded text-green-600">
                  {selectedQuestion.correctAnswer}
                </div>
              </Col>
            </Row>
            {selectedQuestion.errorType && (
              <div>
                <Text strong>错误类型：</Text>
                <Tag color="red" className="ml-2">{selectedQuestion.errorType}</Tag>
              </div>
            )}
            {selectedQuestion.knowledgePoints.length > 0 && (
              <div>
                <Text strong>知识点：</Text>
                <div className="mt-1">
                  {selectedQuestion.knowledgePoints.map((kp, i) => (
                    <Tag key={i} color="cyan" className="mr-1 mb-1">{kp}</Tag>
                  ))}
                </div>
              </div>
            )}
            {selectedQuestion.analysis && (
              <div>
                <Text strong>错误分析：</Text>
                <Paragraph className="mt-1 p-3 bg-blue-50 rounded border border-blue-100">
                  {selectedQuestion.analysis}
                </Paragraph>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WrongQuestionRecord;
