import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, message, Input, Spin, Typography, Tag, Divider } from 'antd';
import { getInterfaceInfoByIdUsingGET, invokeInterfaceInfoUsingPOST } from '@/services/WuJieAPI-backend/interfaceInfoController';
import { useParams } from '@@/exports';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);
  const params = useParams();

  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPOST({
        id: params.id,
        ...values,
      });
      setInvokeRes(res.data);
      message.success('请求成功');
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    } finally {
      setInvokeLoading(false);
    }
  };

  const formatJson = (jsonString: string) => {
    try {
      const json = JSON.parse(jsonString);
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  const defaultRequestParams = formatJson(data?.requestParams || '{}');

  return (
    <PageContainer>
      <Spin spinning={loading}>
        {data ? (
          <div>
            {/* 接口详情卡片 */}
            <Card
              title={<Title level={4} style={{ color: '#1890ff', margin: 0 }}>接口详情</Title>}
              bodyStyle={{ padding: '16px', backgroundColor: '#f6f8fa' }}
              bordered={true}
              style={{ borderRadius: '8px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <Descriptions column={1} bordered size="small" style={{ marginBottom: 0 }}>
                <Descriptions.Item label="接口名称" labelStyle={{ fontWeight: 500 }}>
                  <Title level={5} style={{ margin: 0 }}>{data?.name || '接口文档'}</Title>
                </Descriptions.Item>
                <Descriptions.Item label="状态" labelStyle={{ fontWeight: 500 }}>
                  <Tag color={data?.status ? 'green' : 'red'}>{data?.status ? '开启' : '关闭'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="描述" labelStyle={{ fontWeight: 500 }}>
                  <Text type="secondary">{data?.description}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="请求地址" labelStyle={{ fontWeight: 500 }}>
                  <Text copyable>{data?.url}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="请求方法" labelStyle={{ fontWeight: 500 }}>
                  <Tag color="blue">{data?.method}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="请求参数" labelStyle={{ fontWeight: 500 }}>
                  <pre style={{ background: '#f6f8fa', padding: '8px', borderRadius: '4px', margin: 0 }}>
                    {defaultRequestParams}
                  </pre>
                </Descriptions.Item>
                <Descriptions.Item label="请求头" labelStyle={{ fontWeight: 500 }}>
                  <pre style={{ background: '#f6f8fa', padding: '8px', borderRadius: '4px', margin: 0 }}>
                    {formatJson(data?.requestHeader || '{}')}
                  </pre>
                </Descriptions.Item>
                <Descriptions.Item label="响应头" labelStyle={{ fontWeight: 500 }}>
                  <pre style={{ background: '#f6f8fa', padding: '8px', borderRadius: '4px', margin: 0 }}>
                    {formatJson(data?.responseHeader || '{}')}
                  </pre>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间" labelStyle={{ fontWeight: 500 }}>
                  {dayjs(data?.createTime).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间" labelStyle={{ fontWeight: 500 }}>
                  {dayjs(data?.updateTime).format('YYYY-MM-DD')}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 在线调用卡片 */}
            <Card
              title={<Title level={4} style={{ color: '#52c41a', margin: 0 }}>在线调用</Title>}
              style={{ marginBottom: 16, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              bodyStyle={{ padding: '16px', backgroundColor: '#f6f8fa' }}
              bordered={true}
            >
              <Form name="invoke" layout="vertical" onFinish={onFinish}>
                <Form.Item label="请求参数" name="userRequestParams" initialValue={defaultRequestParams}>
                  <Input.TextArea rows={6} placeholder="请输入请求参数..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={invokeLoading}>
                    调用
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Divider />

            {/* 返回结果卡片 */}
            <Card
              title={<Title level={4} style={{ color: '#faad14', margin: 0 }}>返回结果</Title>}
              bodyStyle={{ padding: '16px', backgroundColor: '#f6f8fa' }}
              bordered={true}
              style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <Spin spinning={invokeLoading}>
                <pre style={{ background: '#f6f8fa', padding: '8px', borderRadius: '4px', margin: 0 }}>
                  {invokeRes ? formatJson(invokeRes) : '无返回结果'}
                </pre>
              </Spin>
            </Card>
          </div>
        ) : (
          <Text type="danger">接口不存在</Text>
        )}
      </Spin>
    </PageContainer>
  );
};

export default Index;
