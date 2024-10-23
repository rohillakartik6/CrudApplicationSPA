import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    Radio,
    Select
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import useMessage from 'antd/es/message/useMessage';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetCities, GetCountries, GetStates } from '../services/DropdownService';
import { CheckDuplicate, DeleteProfileImage, GetEmployeeById, SaveEmployee, UploadProfileImage } from '../services/EmployeeService';
import FileUploader from '../components/FileUploader';
import Loader from '../components/Loader';


const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const AddEditForm = () => {
    const [countries, setCountries] = useState([{ countryId: 0, countryName: "" }]);
    const [states, setStates] = useState([{ stateId: 0, stateName: "" }]);
    const [cities, setCities] = useState([{ cityId: 0, cityName: "" }]);
    const [isPanNumberUnique, setIsPanNumberUnique] = useState(true);
    const [isPassportNumberUnique, setIsPassportNumberUnique] = useState(true);
    const [isLoader, setIsLoader] = useState(false);
    const [uploadedImage, setUploadedImage] = useState("");
    const [messageApi, contextHolder] = useMessage();
    const uniqueFields = {
        pan: "panNumber",
        passport: "passportNumbers"
    }
    const [form] = useForm();
    const navigate = useNavigate();
    const today = dayjs();
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
                base64: base64
            }
            const response = await UploadProfileImage(body);
            if (response.data.statusCode = 201) {
                setData({ ...data, profileImage: response?.data?.result?.fileName });
            } else {
                await messageApi.error("Something went wrong.")
            }
        }
        catch (error) {
            await messageApi.error("Something went wrong.")
        }
    }

    const checkToken = async () => {
        setIsLoader(true)
        if (!localStorage.getItem("token")) {
            await messageApi.warning("Session expired. Please sign in again.")
            return navigate("/");
        }
        setIsLoader(false)
    };
    useEffect(() => {
        checkToken();
    }, []);

    const getEmployeeById = async (id) => {
        try {
            setIsLoader(true)
            const response = await GetEmployeeById(id);
            if (response?.status === 200) {
                const data = response?.data?.result;
                setUploadedImage(data?.profileImageBase64)
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

    const handleImageDelete = async () => {
        try {
            setIsLoader(true)
            let response;
            if (data?.profileImage.length > 100) {
                response = await DeleteProfileImage(data.row_Id.toString());
            } else {
                response = await DeleteProfileImage(data.profileImage);
            }
            if (response?.status === 204) {
                setData({ ...data, profileImage: "" })
                setUploadedImage("");
                return 204;
            }
            else {
                await messageApi.error("Some error occured while deleting the image");
                return 500;
            }
        }
        catch (error) {
            await messageApi.error("Something went wrong. Please try again later")
            return 500;
        } finally {
            setIsLoader(false)
        }
    }

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
        setData({ ...data, countryId: e, stateId: 0, cityId: 0 });
        form.setFieldValue("stateId", undefined);
        form.setFieldValue("cityId", undefined);
        getStates(e);
    }

    const setState = (e) => {
        setData({ ...data, stateId: e, cityId: 0 });
        form.setFieldValue("cityId", undefined);
        getCities(e);
    }

    const setDate = (e, field) => {
        const date = e?.$d?.toISOString().slice(0, 19);
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
                await messageApi.success(response?.data?.message);
                navigate("/list");
            } else {
                await messageApi.error(response?.data?.message);
            }
        }
        catch (error) {
            await messageApi.error("Something went wrong");
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
            await messageApi.error("Something went wrong.")
        }
    }


    return (
        <div>
            <div className='container-flex'>
                {isLoader && <Loader />}
                {contextHolder}
                <div className='container border border-3 rounded p-2'>
                    <Form onFinish={handleClick}
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
                            <Input value={data?.firstName} placeholder='First Name' maxLength={20} name='firstName' onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Last Name" >
                            <Input value={data?.lastName} placeholder='Last Name' maxLength={20} name='lastName' onChange={handleInputChange} />
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
                            <Input value={data?.emailAddress} placeholder='Email Address' maxLength={30} name='emailAddress' onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Mobile Number" name='mobileNumber' rules={[
                            {
                                type: "regexp",
                                message: "Mobile number is not valid"
                            },
                            {
                                required: true,
                                message: 'Mobile number is required',
                            },
                        ]}>
                            <Input type='number' addonBefore={"+91"} maxLength={10} placeholder='Mobile Name'
                                pattern="[6-9]{1}[0-9]{9}" minLength={10} value={data?.mobileNumber} name='mobileNumber' onChange={(e) =>
                                    setData({ ...data, mobileNumber: e.target.value })
                                } />
                        </Form.Item>
                        <Form.Item label="Pan Number" name='panNumber' rules={[{ type: "regexp", required: true, message: "Pan Number is not valid" }, { required: true, message: "Pan number is required!" }, {
                            len: 10,
                            message: "Pan number is not valid"
                        }]}>
                            <Input value={data?.panNumber} placeholder='Pan Number' pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" maxLength={10} minLength={10} onBlur={(e) => duplicateChecker(uniqueFields.pan, e.target.value)} name='panNumber' onChange={(e) => setData({ ...data, panNumber: e.target.value.toUpperCase() })} />
                        </Form.Item>
                        <Form.Item label="Passport Number" name="passportNumber" rules={[{ type: "regexp", required: true, message: "Passport Number is not valid" }, { required: true, message: "Passport number is required!" }]} validateStatus={isPassportNumberUnique ? 'success' : 'error'}>
                            <Input value={data?.passportNumber} placeholder='Passport Name' pattern="^[A-Z][0-9]{7}$" maxLength={8} minLength={8} name='passportNumber' onBlur={(e) => duplicateChecker(uniqueFields.passport, e.target.value)} onChange={(e) => setData({ ...data, passportNumber: e.target.value.toUpperCase() })} />
                        </Form.Item>
                        <Form.Item label="Date of Birth" name='dateOfBirth' rules={[{ required: true, message: "Date of birth is required" }]}>
                            <DatePicker name='dateOfBirth' maxDate={dayjs(today.subtract(18, 'year').toISOString(), 'YYYY-MM-DD')} onChange={(e) => setDate(e, "dateOfBirth")} />
                        </Form.Item>
                        <Form.Item label="Date of Joining" name='dateOfJoinee' rules={[{ required: true, message: "Date of Joining is required" }]}>
                            <DatePicker name='dateOfJoinee' onChange={(e) => setDate(e, "dateOfJoinee")} />
                        </Form.Item>
                        <Form.Item label="Country" name="countryId" rules={[{ required: true, message: "Country is required" }]}>
                            <Select value={data?.countryId} placeholder="Select Country" onChange={setCountry} name="countryId">
                                {
                                    countries.map((d) => (
                                        <Select.Option key={d?.countryId} value={d?.countryId}>{d?.countryName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="State" name="stateId" rules={[{ required: true, message: "State is required" }]}>
                            <Select value={data?.stateId} placeholder="Select State" onChange={setState} name="stateId">
                                {
                                    states.map((d) => (
                                        <Select.Option key={d?.stateId} value={d?.stateId}>{d?.stateName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="City" name="cityId" rules={[{ required: true, message: "City is required" }]}>
                            <Select value={data?.cityId}
                                name="cityId" placeholder="Select City" onChange={(e) => setData({ ...data, cityId: e })}>
                                {
                                    cities.map((d) => (
                                        <Select.Option key={d?.cityId} value={d?.cityId}>{d?.cityName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="Profile Picture" valuePropName="fileList" getValueFromEvent={normFile}>
                            <FileUploader url={uploadedImage} fileUploader={uploadProfileImage} handleImageDelete={handleImageDelete} />
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
export default () => <AddEditForm />;