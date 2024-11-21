import { useState } from "react";
import { PostUrlShorten } from "../services/UrlShortnerService";
import { Button, Col, Form, Input, Row } from "antd";
import { CopyToClipboard } from 'react-copy-to-clipboard';

function UrlShortner() {
    const [data, setData] = useState({
        url: ""
    });
    const [longUrl, setLongUrl] = useState("");
    // const suffix = <CopyOutlined />

    const handleShortUrl = async () => {
        try {
            // debugger
            // const body = `https://github.com/sameerkumar18/corporate-bs-generator-api/deployments/corporatebs-generator`;
            const body = data.url;
            console.log(body)
            const response = await PostUrlShorten(body);
            if (response.status === 200) {
                setLongUrl(response?.data?.result?.shortUrl)
            } else {
                console.error('Some error occured.')
            }
            console.log(response);
        }
        catch (error) {
            console.error(error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    return <>
        <Row align="middle">
            <Col span={12} offset={5}>
                <h1>URL Shortner</h1>
            </Col>
        </Row>
        <Row align="middle">
            <Col span={12} offset={5}>
                <Form onFinish={handleShortUrl}>
                    <Form.Item label="Please type the URL.">
                        <Input value={data.url} placeholder="URL" name="url" onChange={handleInputChange} />
                    </Form.Item>
                    <Button htmlType='submit'>Shorten</Button>
                </Form>
            </Col>
        </Row>
        <Row>
            <Col span={12} offset={5}>
                <Input readOnly value={longUrl} />
                <CopyToClipboard text={longUrl}>
                    <Button>Copy</Button>
                </CopyToClipboard>
            </Col>
        </Row>
    </>
}

export default UrlShortner;