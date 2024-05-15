import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Upload
} from 'antd';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { GetCities, GetCountries, GetStates } from '../services/DropdownService';
import { SaveEmployee, UploadProfileImage } from '../services/EmployeeService';
import { PlusOutlined } from '@ant-design/icons';
import { convertToBase64, validateFileSize } from '../schema/ImageBase64';
import DragAndDropFileUpload from './DragAndDropFileUpload';
import { upload } from '@testing-library/user-event/dist/upload';

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const FormDisabledDemo = () => {
    const [countries, setCountries] = useState([{ countryId: 0, countryName: "" }]);
    const [states, setStates] = useState([{ stateId: 0, stateName: "" }]);
    const [cities, setCities] = useState([{ cityId: 0, cityName: "" }]);
    const [data, setData] = useState({
        row_Id: 0,
        employeeCode: "",
        firstName: "",
        lastName: "",
        emailAddress: "",
        mobileNumber: "",
        panNumber: "",
        passportNumber: "",
        profileImage: "",
        countryId: 0,
        stateId: 0,
        cityId: 0,
        gender: 0,
        isActive: false,
        dateOfBirth: "",
        dateOfJoinee: ""
    });
    const genderOptions = [{
        key: 1,
        value: "Male"
    }, {
        key: 2,
        value: 'Female'
    }]

    const uploadProfileImage = async (base64) => {
        try {
            const body = {
                base64: base64.base64
            }
            const response = await UploadProfileImage(body);
            if (response.data.statusCode = 201) {
                setData({ ...data, profileImage: response?.data?.result?.fileName });
            } else {
                toast.error("Something went wrong.")
            }
        }
        catch (error) {
            toast.error("Something went wrong.")
        }
    }

    const handleImageChange = async (e) => {
        debugger;
        try {
            if (validateFileSize(e) == true) {
                const base64 = await convertToBase64(e, "image");
                uploadProfileImage(base64);
            } else toast.error("File exceeds 1 MB");
        }
        catch (error) {
            toast.error("Something went wrong. Please try again later")
        }
    };

    useEffect(() => {
        // //console.log(data);
    }, [data])

    const handleInputChange = (e) => {
        //  //debugger
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const getCountries = async () => {
        try {
            const response = await GetCountries();
            setCountries(response?.data?.result);
        }
        catch (error) {
            console.error(error);
        }
    }
    const getStates = async (countryId) => {
        //debugger
        try {
            const response = await GetStates(countryId);
            setStates(response?.data?.result);
        }
        catch (error) {
            console.error(error);
        }
    }
    const getCities = async (stateId) => {
        try {
            const response = await GetCities(stateId);
            setCities(response?.data?.result)
        }
        catch (error) {
            console.error(error);
        }
    }

    const setCountry = (e) => {
        setData({ ...data, countryId: e, stateId: "", cityId: "" });
        getStates(e);
    }

    const setState = (e) => {
        setData({ ...data, stateId: e, cityId: "" });
        getCities(e);
    }

    const setDate = (e, field) => {
        const date = e.$d.toISOString().slice(0, 19);
        setData({ ...data, [field]: date });
    }

    useEffect(() => {
        getCountries();
    }, [])

    const setRequestBody = (request) => {
        request.mobileNumber = request.mobileNumber.toString();
        return request
    }

    const saveEmployee = async (body) => {
        try {
            const response = await SaveEmployee(body);
            if (!response?.data.isError) {
                toast.success(response?.data?.message);
            } else {
                toast.error(response?.data?.message);
            }
        }
        catch (error) {
            console.error("Something went wrong");
        }
    }

    const handleClick = () => {
        const body = setRequestBody(data);
        saveEmployee(body);
    }

    return (
        <div>
            {/* <Alerts type={"success"} message={"Saved"} /> */}
            <ToastContainer />
            <Form onSubmitCapture={handleClick}>
                <Form.Item label="First Name" required>
                    <Input value={data?.firstName} required name='firstName' onChange={handleInputChange} />
                </Form.Item>
                <Form.Item label="Last Name" >
                    <Input value={data?.lastName} name='lastName' onChange={handleInputChange} />
                </Form.Item>
                <Form.Item label="Email Address" required validateStatus='error'>
                    <Input required type='email' value={data?.emailAddress} name='emailAddress' onChange={handleInputChange} />
                </Form.Item>
                <Form.Item label="Mobile Number" required>
                    <InputNumber type='number' required addonBefore={"+91"} value={data?.mobileNumber} name='mobileNumber' onChange={(e) => setData({ ...data, mobileNumber: e })} />
                </Form.Item>
                <Form.Item label="Pan Number" required>
                    <Input value={data?.panNumber} pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" len={10} required name='panNumber' onChange={handleInputChange} />
                </Form.Item>
                <Form.Item label="Passport Number" required>
                    <Input value={data?.passportNumber} pattern="^[A-Z][0-9]{7}$" len={8} name='passportNumber' onChange={handleInputChange} />
                </Form.Item>
                <Form.Item label="Date of Birth" required>
                    <DatePicker name='dateOfBirth' required onChange={(e) => setDate(e, "dateOfBirth")} />
                </Form.Item>
                <Form.Item label="Date of Joining">
                    <DatePicker name='dateOfJoining' onChange={(e) => setDate(e, "dateOfJoinee")} />
                </Form.Item>
                <Form.Item label="Country">
                    <Select value={data?.countryId} onChange={setCountry} >
                        {
                            countries.map((d) => (
                                <Select.Option key={d?.countryId} value={d?.countryId}>{d?.countryName}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="State">
                    <Select value={data?.stateId} onChange={setState} >
                        {
                            states.map((d) => (
                                <Select.Option key={d?.stateId} value={d?.stateId}>{d?.stateName}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="City">
                    <Select value={data?.cityId} onChange={(e) => setData({ ...data, cityId: e })}>
                        {
                            cities.map((d) => (
                                <Select.Option key={d?.cityId} value={d?.cityId}>{d?.cityName}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                    <DragAndDropFileUpload
                        // url={data?.profileImage}
                        // id="image1"
                        // number="1"
                        // handleDelete={handleImage1Delete}
                        onChange={(e) => handleImageChange(e)}
                    />
                </Form.Item>
                <Form.Item label="Gender">
                    <Radio.Group>
                        <Radio value={1} name='gender' onChange={(e) => setData({ ...data, gender: e.target.value })}> Male </Radio>
                        <Radio value={2} name='gender' onChange={(e) => setData({ ...data, gender: e.target.value })}> Female </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="IsActive" >
                    <Checkbox checked={data.isActive} name='isActive' onChange={(e) => setData({ ...data, isActive: e.target.checked })}> IsActive </Checkbox>
                </Form.Item>
                <Button htmlType='submit'>Submit</Button>
            </Form >
        </div>
    );
};
export default () => <FormDisabledDemo />;