import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select
} from 'antd';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { convertToBase64, validateFileSize } from '../schema/ImageBase64';
import { GetCities, GetCountries, GetStates } from '../services/DropdownService';
import { SaveEmployee, UploadProfileImage } from '../services/EmployeeService';
import DragAndDropFileUpload from './DragAndDropFileUpload';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';


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
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();
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
            setIsLoader(true)
            if (validateFileSize(e) == true) {
                const base64 = await convertToBase64(e, "image");
                uploadProfileImage(base64);

            } else toast.error("File exceeds 1 MB");
        }
        catch (error) {
            toast.error("Something went wrong. Please try again later")
        }
        setIsLoader(false)
    };

    const handleInputChange = (e) => {
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
        // request.mobileNumber = request.mobileNumber.toString();
        return request
    }

    const saveEmployee = async (body) => {
        setIsLoader(true)
        try {
            const response = await SaveEmployee(body);
            if (!response?.data.isError) {
                toast.success(response?.data?.message);
                navigate("/list");
            } else {
                toast.error(response?.data?.message);
            }
        }
        catch (error) {
            console.error("Something went wrong");
        }
        setIsLoader(false)
    }

    const handleClick = () => {
        const body = setRequestBody(data);
        saveEmployee(body);
    }

    return (
        <div>
            {/* <Alerts type={"success"} message={"Saved"} /> */}
            <div className='container-flex'>
                {isLoader && <Loader />}
                <ToastContainer />
                <div className='container border border-3 rounded p-2'>
                    <Form onSubmitCapture={handleClick}>
                        <Form.Item label="First Name" required>
                            <Input value={data?.firstName} required name='firstName' onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Last Name" >
                            <Input value={data?.lastName} name='lastName' onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Email Address" required >
                            <Input required type='email' value={data?.emailAddress} name='emailAddress' onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Mobile Number" required>
                            <Input type='number' style={{
                                "-webkit-appearance": 'none',
                                "-moz-appearance": 'textfield',
                            }} required addonBefore={"+91"} maxLength={10} minLength={10} value={data?.mobileNumber} name='mobileNumber' onChange={(e) =>
                                setData({ ...data, mobileNumber: e.target.value })
                            } />
                        </Form.Item>
                        <Form.Item label="Pan Number" required>
                            <Input value={data?.panNumber} pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" maxLength={10} minLength={10} required name='panNumber' onChange={(e) => setData({ ...data, panNumber: e.target.value.toUpperCase() })} />
                        </Form.Item>
                        <Form.Item label="Passport Number" required>
                            <Input value={data?.passportNumber} pattern="^[A-Z][0-9]{7}$" maxLength={8} minLength={8} name='passportNumber' onChange={(e) => setData({ ...data, passportNumber: e.target.value.toUpperCase() })} />
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
            </div>
        </div>
    );
};
export default () => <FormDisabledDemo />;