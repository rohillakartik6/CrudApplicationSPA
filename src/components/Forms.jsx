import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    Radio,
    Select
} from 'antd';
import moment from 'moment';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { convertToBase64, validateFileSize } from '../schema/ImageBase64';
import { GetCities, GetCountries, GetStates } from '../services/DropdownService';
import { CheckDuplicate, GetEmployeeById, SaveEmployee, UploadProfileImage } from '../services/EmployeeService';
import DragAndDropFileUpload from './DragAndDropFileUpload';
import Loader from './Loader';


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
    const [isPanNumberUnique, setIsPanNumberUnique] = useState(true);
    const [isPassportNumberUnique, setIsPassportNumberUnique] = useState(true);
    const [isLoader, setIsLoader] = useState(false);
    const [image, setImage] = useState({ documentName: "", base64: "" });
    const uniqueFields = {
        pan: "panNumber",
        passport: "passportNumbers"
    }
    const [form] = useForm();
    const navigate = useNavigate();
    const today = new Date();
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
    const { id } = useParams();

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

    const getEmployeeById = async (id) => {
        try {
            setIsLoader(true)
            const response = await GetEmployeeById(id);
            if (response?.status === 200) {
                const data = response?.data?.result;
                const imageTemp = {
                    documentName: "Image",
                    base64: data.profileImage.slice(24)
                }
                setImage(imageTemp)
                form.setFieldsValue({
                    firstName: data?.firstName,
                    lastName: data?.lastName,
                    emailAddress: data?.emailAddress,
                    mobileNumber: data?.mobileNumber,
                    panNumber: data?.panNumber,
                    passportNumber: data?.passportNumber,
                    profileImage: data?.profileImage,
                    countryId: data?.countryId,
                    stateId: data?.stateId,
                    cityId: data?.cityId,
                    gender: data?.gender,
                    isActive: data?.isActive,
                    dateOfBirth: moment(data?.dateOfBirth),
                    dateOfJoinee: moment(data?.dateOfJoinee)
                })
                setData(response?.data?.result);
                setIsLoader(false)
            } else {
                console.error("Something went wrong. Please try again later");

            }
        } catch (error) {
            console.error("Something went wrong. Please try again later");
        }
    }

    const handleImageDelete = () => {
        setData({ ...data, profileImage: "" });
        setImage("");
    }

    const handleImageChange = async (e) => {
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
        // getStates(e);
    }

    const setState = (e) => {
        setData({ ...data, stateId: e, cityId: "" });
        // getCities(e);
    }

    const setDate = (e, field) => {
        const date = e.$d.toISOString().slice(0, 19);
        setData({ ...data, [field]: date });
    }

    useEffect(() => {
        getCountries();
        if (id !== undefined) {
            getEmployeeById(id);
        }
    }, [])


    useEffect(() => {
        getStates(data.countryId);
    }, [data.countryId])

    useEffect(() => {
        getCities(data.stateId);
    }, [data.stateId])



    const setRequestBody = (request) => {
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

    const duplicateChecker = async (field, value) => {
        try {
            const response = await CheckDuplicate(field, value);
            if (response?.data?.statusCode === 409) {
                if (field === "panNumber") {
                    setIsPanNumberUnique(false)
                }
                if (field === "passportNumber") {
                    setIsPassportNumberUnique(false)
                }
            }
            if (response?.data?.statusCode === 204) {
                if (field === "panNumber") {
                    setIsPanNumberUnique(true)
                }
                if (field === "passportNumber") {
                    setIsPassportNumberUnique(true)
                }
            }
        } catch (error) {
            toast.error("Something went wrong.")
        }
    }

    return (
        <div>
            {/* <Alerts type={"success"} message={"Saved"} /> */}
            <div className='container-flex'>
                {isLoader && <Loader />}
                <ToastContainer />
                <div className='container border border-3 rounded p-2'>
                    <Form onSubmitCapture={handleClick}
                        form={form}
                        layout='horizontal'>
                        <Form.Item label="First Name"
                            name="firstName"
                            rules={[
                                {
                                    required: true,
                                    message: 'First Name is mandatory!',
                                },
                            ]}>
                            <Input value={data?.firstName} name='firstName' onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Last Name" >
                            <Input value={data?.lastName} name='lastName' onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Email Address" name="emailAddress" rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid email!',
                            },
                            {
                                required: true,
                                message: 'Email address is required',
                            },
                        ]}>
                            <Input value={data?.emailAddress} name='emailAddress' onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Mobile Number" name='mobileNumber' rules={[
                            {
                                len: 10,
                                required: true,
                                message: "Mobile number is not valid"
                            },
                            {
                                required: true,
                                message: 'Mobile address is required',
                            },
                        ]}>
                            <Input type='number' addonBefore={"+91"} maxLength={10} minLength={10} value={data?.mobileNumber} name='mobileNumber' onChange={(e) =>
                                setData({ ...data, mobileNumber: e.target.value })
                            } />
                        </Form.Item>
                        <Form.Item label="Pan Number" name='panNumber' rules={[{ type: "regexp", required: true, message: "Pan Number is not valid" }, { required: true, message: "Pan number is required!" }, {
                            len: 10,
                            message: "Pan number is not valid"
                        }]}>
                            <Input value={data?.panNumber} pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" maxLength={10} minLength={10} onBlur={(e) => duplicateChecker(uniqueFields.pan, e.target.value)} name='panNumber' onChange={(e) => setData({ ...data, panNumber: e.target.value.toUpperCase() })} />
                        </Form.Item>
                        <Form.Item label="Passport Number" name="passportNumber" rules={[{ type: "regexp", required: true, message: "Passport Number is not valid" }, { required: true, message: "Passport number is required!" }]} validateStatus={isPassportNumberUnique ? 'success' : 'error'}>
                            <Input value={data?.passportNumber} pattern="^[A-Z][0-9]{7}$" maxLength={8} minLength={8} name='passportNumber' onBlur={(e) => duplicateChecker(uniqueFields.passport, e.target.value)} onChange={(e) => setData({ ...data, passportNumber: e.target.value.toUpperCase() })} />
                        </Form.Item>
                        <Form.Item label="Date of Birth" name='dateOfBirth' required>
                            <DatePicker name='dateOfBirth' maxDate={dayjs(today.toISOString(), 'YYYY-MM-DD')} onChange={(e) => setDate(e, "dateOfBirth")} />
                        </Form.Item>
                        <Form.Item label="Date of Joining" name='dateOfJoinee' required>
                            <DatePicker name='dateOfJoinee' onChange={(e) => setDate(e, "dateOfJoinee")} />
                        </Form.Item>
                        <Form.Item label="Country" name="countryId" rules={[{ required: true, message: "Country is required" }]}>
                            <Select value={data?.countryId} onChange={setCountry} name="countryId">
                                {
                                    countries.map((d) => (
                                        <Select.Option key={d?.countryId} value={d?.countryId}>{d?.countryName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="State" name="stateId" rules={[{ required: true, message: "State is required" }]}>
                            <Select value={data?.stateId} onChange={setState} name="stateId">
                                {
                                    states.map((d) => (
                                        <Select.Option key={d?.stateId} value={d?.stateId}>{d?.stateName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="City" name="cityId" rules={[{ required: true, message: "City is required" }]}>
                            <Select value={data?.cityId}
                                name="cityId" onChange={(e) => setData({ ...data, cityId: e })}>
                                {
                                    cities.map((d) => (
                                        <Select.Option key={d?.cityId} value={d?.cityId}>{d?.cityName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                            <DragAndDropFileUpload
                                url={image}
                                handleDelete={handleImageDelete}
                                onChange={(e) => handleImageChange(e)}
                            />
                        </Form.Item>
                        <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Gender is required" }]}>
                            <Radio.Group>
                                <Radio value={1} name='gender' onChange={(e) => setData({ ...data, gender: e.target.value })}> Male </Radio>
                                <Radio value={2} name='gender' onChange={(e) => setData({ ...data, gender: e.target.value })}> Female </Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="isActive" label="Is Active" valuePropName='checked'>
                            <Checkbox checked={data.isActive} name='isActive' onChange={(e) => setData({ ...data, isActive: e.target.checked })} > IsActive </Checkbox>
                        </Form.Item>
                        <Button htmlType='submit'>Submit</Button>
                    </Form >
                </div>
            </div>
        </div>
    );
};
export default () => <FormDisabledDemo />;