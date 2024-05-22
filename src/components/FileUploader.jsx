import { PlusOutlined } from '@ant-design/icons';
import { Button, Image, Upload } from 'antd';
import useMessage from 'antd/es/message/useMessage';
import React, { useEffect, useState } from 'react';
import { validateFileSize } from '../schema/ImageBase64';
const { Dragger } = Upload;


const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 0);
};

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const FileUploader = ({ fileUploader, url, handleImageDelete }) => {
    const [messageApi, contextHolder] = useMessage();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const defaultFile = {
        uid: '',
        name: '',
        status: '',
        url: ''
    }
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (url?.length > 0) {
            defaultFile.url = url
            setFileList([defaultFile])
        }
    }, [url])

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = async (file) => {
        if (validateFileSize(file)) {
            const fileBase64 = await getBase64(file)
            await fileUploader(fileBase64?.substring(fileBase64?.indexOf(",") + 1));
            defaultFile.url = fileBase64;
            setFileList([defaultFile])
        } else {
            await messageApi.warning('Maximum size of uploaded image should be 200 KB');
        }
    };
    const handleRemove = async () => {
        try {
            const response = await handleImageDelete();
            if (response === 204) {
                setFileList([]);
            } else {
                return;
            }
        }
        catch (error) {
            console.warn("Some error occured");
        }
    }
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    return (
        <>
            <Upload
                customRequest={dummyRequest}
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                beforeUpload={handleChange}
                onRemove={handleRemove}
            >
                {fileList.length > 0 ? null : uploadButton}
            </Upload>
            {contextHolder}
            {previewImage && (
                <Image
                    wrapperStyle={{
                        display: 'none',
                    }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};
export default FileUploader;