import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Badge, Dropdown, ConfigProvider } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  RobotOutlined,
  EditOutlined,
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Dashboard from './components/Dashboard';
import WrongQuestionRecord from './components/WrongQuestionRecord';
import AIAnalysis from './components/AIAnalysis';
import PracticeGenerator from './components/PracticeGenerator';
import TeachingModule from './components/TeachingModule';
import { AnalysisResult, WrongQuestion } from './types';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('dashboard');
  const [practiceData, setPracticeData] = useState<{
    analysisResult: AnalysisResult | null;
    wrongQuestion: WrongQuestion | null;
  }>({
    analysisResult: null,
    wrongQuestion: null,
  });

  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '学习概览',
    },
    {
      key: 'wrong-questions',
      icon: <FileTextOutlined />,
      label: '错题记录',
    },
    {
      key: 'ai-analysis',
      icon: <RobotOutlined />,
      label: 'AI智能分析',
    },
    {
      key: 'practice',
      icon: <EditOutlined />,
      label: '针对性练习',
    },
    {
      key: 'teaching',
      icon: <ReadOutlined />,
      label: 'AI教学讲解',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setCurrentMenu(e.key);
  };

  const handleGeneratePractice = (result: AnalysisResult, question: WrongQuestion) => {
    setPracticeData({
      analysisResult: result,
      wrongQuestion: question,
    });
    setCurrentMenu('practice');
  };

  const handleBackFromPractice = () => {
    setCurrentMenu('ai-analysis');
  };

  const userMenuItems = [
    { key: 'profile', label: '个人信息' },
    { key: 'settings', label: '设置' },
    { type: 'divider' as const },
    { key: 'logout', label: '退出登录' },
  ];

  const renderContent = () => {
    switch (currentMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'wrong-questions':
        return <WrongQuestionRecord />;
      case 'ai-analysis':
        return <AIAnalysis onGeneratePractice={handleGeneratePractice} />;
      case 'practice':
        return (
          <PracticeGenerator
            analysisResult={practiceData.analysisResult}
            wrongQuestion={practiceData.wrongQuestion}
            onBack={handleBackFromPractice}
          />
        );
      case 'teaching':
        return <TeachingModule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
        },
      }}
    >
      <Layout className="min-h-screen">
        {/* 侧边栏 */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={240}
          className="shadow-lg overflow-y-auto"
          style={{
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            background: '#fff',
          }}
        >
          {/* Logo区域 */}
          <div className="h-16 flex items-center justify-center border-b border-gray-100 px-4">
            {collapsed ? (
              <span className="text-2xl">📚</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <Title level={4} className="mb-0! text-blue-600">
                  小学错题宝
                </Title>
              </div>
            )}
          </div>

          {/* 菜单 */}
          <Menu
            mode="inline"
            selectedKeys={[currentMenu]}
            items={menuItems}
            onClick={handleMenuClick}
            className="border-r-0 mt-2"
            style={{ fontSize: 14 }}
          />

          {/* 底部信息 */}
          {!collapsed && (
            <div className="px-4 pb-4 mt-2">
              <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <Text className="text-xs text-gray-500 block text-center">
                  🌟 每天进步一点点
                </Text>
              </div>
            </div>
          )}
        </Sider>

        {/* 主内容区 */}
        <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s' }}>
          {/* 顶部导航 */}
          <Header className="bg-white shadow-sm px-6 flex items-center justify-between h-16 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <Badge count={0}>
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="text-lg p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>
              </Badge>
              <div className="hidden sm:block">
                <Text type="secondary">
                  {currentMenu === 'dashboard' && '📊 学习概览 - 查看学习进度和统计'}
                  {currentMenu === 'wrong-questions' && '📝 错题记录 - 记录和管理错题'}
                  {currentMenu === 'ai-analysis' && '🤖 AI智能分析 - 分析错题原因'}
                  {currentMenu === 'practice' && '🎯 针对性练习 - 巩固薄弱环节'}
                  {currentMenu === 'teaching' && '📚 AI教学讲解 - 不会的题慢慢学'}
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge count={3} size="small">
                <BellOutlined className="text-lg cursor-pointer hover:text-blue-500 transition-colors" />
              </Badge>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-lg transition-colors">
                  <Avatar
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<UserOutlined />}
                    size="small"
                  />
                  <span className="hidden sm:inline">
                    <Text className="text-sm">小明同学</Text>
                  </span>
                </div>
              </Dropdown>
            </div>
          </Header>

          {/* 内容区 */}
          <Content className="m-4 min-h-[calc(100vh-96px)] bg-gray-50 rounded-xl">
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
