import React from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { Button, ConfigProvider, Space } from 'antd';
import { DollarTwoTone } from '@ant-design/icons';
const colors3 = ['#40e495', '#30dd8a', '#2bb673'];
const getHoverColors = (colors) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());
const DonateButton = () => (
    <Space>
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: `linear-gradient(116deg,  ${colors3.join(', ')})`,
                        colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(colors3).join(', ')})`,
                        colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(colors3).join(', ')})`,
                        lineWidth: 0,
                        fontSize: "30px"
                    },
                },
            }}
        >
            <Button type="primary" size="large">
                <DollarTwoTone style={{ "fontSize": "30px" }} />
                Donate Now
            </Button>
        </ConfigProvider>
    </Space>
);
export default DonateButton;