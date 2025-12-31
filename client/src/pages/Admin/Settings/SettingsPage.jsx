import React, { useState, useEffect } from 'react';
import { Tabs, Form, Input, Button, Card, Switch, Select, message, ColorPicker, Row, Col } from 'antd';
import axios from '../../../utils/axios';

const { TabPane } = Tabs;
const { Option } = Select;

const SettingsPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/settings/admin');
            setSettings(data);

            // Flatten logic if needed, but our API returns grouped: { general: { ... }, ... }
            // Antd form needs flat keys if we use 'general.store_name' as name
            const flatValues = {};
            Object.keys(data).forEach(group => {
                Object.keys(data[group]).forEach(key => {
                    flatValues[key] = data[group][key];
                });
            });
            form.setFieldsValue(flatValues);
        } catch (error) {
            message.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (group) => {
        setLoading(true);
        try {
            const values = form.getFieldsValue();

            // Filter values belonging to this group
            const groupValues = {};
            Object.keys(values).forEach(key => {
                if (key.startsWith(`${group}.`)) {
                    groupValues[key] = values[key];
                }
            });

            // Convert Color object to hex string if needed
            if (group === 'storefront' && groupValues['storefront.theme_primary_color'] && typeof groupValues['storefront.theme_primary_color'] === 'object') {
                groupValues['storefront.theme_primary_color'] = groupValues['storefront.theme_primary_color'].toHexString();
            }

            await axios.put(`/api/settings/admin/${group}`, groupValues);
            message.success('Settings saved');
            fetchSettings(); // Reload to ensure sync
        } catch (error) {
            message.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: 24, marginBottom: 24 }}>Settings</h1>

            <Tabs defaultActiveKey="general">
                <TabPane tab="General" key="general">
                    <Card title="Store Information" extra={<Button type="primary" onClick={() => handleSave('general')}>Save</Button>}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="general.store_name" label="Store Name">
                                <Input />
                            </Form.Item>
                            <Form.Item name="general.store_email" label="Store Contact Email">
                                <Input />
                            </Form.Item>
                            <Form.Item name="general.timezone" label="Timezone">
                                <Select>
                                    <Option value="Asia/Tokyo">Asia/Tokyo</Option>
                                    <Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</Option>
                                    <Option value="UTC">UTC</Option>
                                    <Option value="America/New_York">America/New_York</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane tab="Storefront" key="storefront">
                    <Card title="Appearance" extra={<Button type="primary" onClick={() => handleSave('storefront')}>Save</Button>}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="storefront.logo_url" label="Logo URL">
                                <Input placeholder="https://..." />
                            </Form.Item>
                            <Form.Item name="storefront.theme_primary_color" label="Primary Color">
                                <ColorPicker showText />
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane tab="Localization" key="localization">
                    <Card title="Regional Settings" extra={<Button type="primary" onClick={() => handleSave('localization')}>Save</Button>}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="localization.default_language" label="Default Language">
                                <Select>
                                    <Option value="en">English (en)</Option>
                                    <Option value="ja">Japanese (ja)</Option>
                                    <Option value="vi">Vietnamese (vi)</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="localization.currency" label="Currency">
                                <Select>
                                    <Option value="JPY">Japanese Yen (JPY)</Option>
                                    <Option value="USD">US Dollar (USD)</Option>
                                    <Option value="VND">Vietnamese Dong (VND)</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane tab="Checkout" key="checkout">
                    <Card title="Checkout Rules" extra={<Button type="primary" onClick={() => handleSave('checkout')}>Save</Button>}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="checkout.allow_guest" label="Allow Guest Checkout" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane tab="Email" key="email">
                    <Card title="Email Configuration (Private)" extra={<Button type="primary" onClick={() => handleSave('email')}>Save</Button>}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="email.from_name" label="From Name">
                                <Input />
                            </Form.Item>
                            <Form.Item name="email.from_email" label="From Email">
                                <Input />
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default SettingsPage;
