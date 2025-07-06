'use client';

import {
    CarOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    SendOutlined,
    StarOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Row,
    Statistic,
    Typography
} from 'antd';
import { AntdProvider } from '../../providers/AntdProvider';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

function AntdExampleContent() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    message.success('Message sent successfully!');
    form.resetFields();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '32px 0'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Title level={1} style={{ marginBottom: 16 }}>
            Ant Design Example
          </Title>
          <Paragraph style={{ fontSize: 18, color: '#666' }}>
            Modern, enterprise-level design with Ant Design
          </Paragraph>
        </div>

        {/* Stats Grid */}
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Active Buses"
                value={150}
                suffix="+"
                prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Cities"
                value={25}
                prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Support"
                value="24/7"
                prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Happy Users"
                value={10000}
                suffix="+"
                prefix={<TeamOutlined style={{ color: '#fa8c16' }} />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Feature Cards */}
        <Row gutter={[32, 32]} style={{ marginBottom: 48 }}>
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ height: '100%' }}
              actions={[
                <Button type="primary" key="learn">
                  Learn More
                </Button>
              ]}
            >
              <Card.Meta
                avatar={
                  <Avatar 
                    size={48} 
                    icon={<CarOutlined />} 
                    style={{ backgroundColor: '#1890ff' }}
                  />
                }
                title="Easy Booking"
                description="Book your bus tickets in just a few clicks with our intuitive interface."
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ height: '100%' }}
              actions={[
                <Button type="primary" key="learn">
                  Learn More
                </Button>
              ]}
            >
              <Card.Meta
                avatar={
                  <Avatar 
                    size={48} 
                    icon={<EnvironmentOutlined />} 
                    style={{ backgroundColor: '#52c41a' }}
                  />
                }
                title="Real-time Tracking"
                description="Track your bus location in real-time and get live updates on your journey."
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ height: '100%' }}
              actions={[
                <Button type="primary" key="learn">
                  Learn More
                </Button>
              ]}
            >
              <Card.Meta
                avatar={
                  <Avatar 
                    size={48} 
                    icon={<StarOutlined />} 
                    style={{ backgroundColor: '#fa8c16' }}
                  />
                }
                title="Premium Service"
                description="Enjoy premium amenities and comfortable travel with our luxury buses."
              />
            </Card>
          </Col>
        </Row>

        {/* Contact Form */}
        <Card style={{ maxWidth: 600, margin: '0 auto' }}>
          <Title level={3} style={{ marginBottom: 8 }}>
            Get in Touch
          </Title>
          <Paragraph style={{ marginBottom: 24, color: '#666' }}>
            Have questions? We&apos;d love to hear from you.
          </Paragraph>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true, message: 'Please enter your first name!' }]}
                >
                  <Input placeholder="Enter your first name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true, message: 'Please enter your last name!' }]}
                >
                  <Input placeholder="Enter your last name" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: 'Please enter your message!' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="Enter your message"
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                icon={<SendOutlined />}
                style={{ width: '100%' }}
              >
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default function AntdExample() {
  return (
    <AntdProvider>
      <AntdExampleContent />
    </AntdProvider>
  );
} 