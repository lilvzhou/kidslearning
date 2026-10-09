import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Tag } from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { mockStudentStats } from '../mockData';

const { Title, Text } = Typography;

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];

const Dashboard: React.FC = () => {
  const stats = mockStudentStats;

  return (
    <div className="p-4">
      <Title level={3} className="mb-4!">
        📊 学习概览
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title="总错题数"
              value={stats.totalQuestions}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title="已掌握"
              value={stats.masteredQuestions}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title="正确率"
              value={stats.accuracyRate}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title="本周进步"
              value={12}
              suffix="%"
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="📈 本周练习趋势" className="shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.recentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#1890ff"
                  name="总题数"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="correct"
                  stroke="#52c41a"
                  name="正确数"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="📚 科目分布" className="shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.subjectDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="subject"
                  label={({ subject, count }) => `${subject}: ${count}题`}
                >
                  {stats.subjectDistribution.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 掌握进度 */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <Card title="🎯 各科掌握进度" className="shadow-sm">
            <div className="space-y-4">
              {stats.subjectDistribution.map((item, index) => (
                <div key={item.subject} className="flex items-center gap-4">
                  <Text className="w-16">{item.subject}</Text>
                  <Progress
                    percent={Math.round((item.count / stats.totalQuestions) * 100)}
                    strokeColor={COLORS[index]}
                    className="flex-1"
                  />
                  <Tag color={COLORS[index]}>{item.count}题</Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 鼓励语 */}
      <Card className="mt-6 text-center bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="py-4">
          <Text className="text-lg font-bold text-blue-600">
            🌟 太棒了！你已经掌握了 {stats.masteredQuestions} 道错题，继续加油！
          </Text>
          <br />
          <Text type="secondary" className="mt-2">
            每天进步一点点，积少成多变聪明！💪
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
