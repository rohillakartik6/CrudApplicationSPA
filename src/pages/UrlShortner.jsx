import { Button, Form, Input } from "antd"
import { useState } from "react";

function UrlShortner() {
    const [data, setData] = useState({
        url: ""
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    return <>
        <h1>URL Shortner</h1>
        <Form>
            <Form.Item label="Please type the URL.">
                <Input value={data.url} placeholder="URL" name="url" onChange={handleInputChange} />
            </Form.Item>
            <Button htmlType='submit'>Shorten</Button>
        </Form>
    </>
}

export default UrlShortner;