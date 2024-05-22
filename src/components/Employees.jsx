import { Button, Checkbox, Flex, Popconfirm, Space, Table } from 'antd';
import useMessage from 'antd/es/message/useMessage';
import Search from 'antd/es/transfer/search';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteEmployee, GetEmployees } from '../services/EmployeeService';
import Loader from './Loader';
const Employees = () => {
    const [data, setData] = useState([]);
    const [tabelData, setTableData] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [messageApi, contextHolder] = useMessage();
    const navigate = useNavigate();
    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: (a, b) => a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase()),
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'emailAddress',
            key: 'emailAddress',
            sorter: (a, b) => a.emailAddress.toLowerCase().localeCompare(b.emailAddress.toLowerCase()),
        },
        {
            title: 'Country',
            dataIndex: 'countryName',
            key: 'countryId',
            sorter: (a, b) => a.countryName.toLowerCase().localeCompare(b.countryName.toLowerCase()),
        },
        {
            title: 'State',
            dataIndex: 'stateName',
            key: 'stateId',
            sorter: (a, b) => a.stateName.toLowerCase().localeCompare(b.stateName.toLowerCase()),
        },
        {
            title: 'City',
            dataIndex: 'cityName',
            key: 'cityId',
            sorter: (a, b) => a.cityName.toLowerCase().localeCompare(b.cityName.toLowerCase()),
        },
        {
            title: 'Pan No',
            dataIndex: 'panNumber',
            key: 'panNumber',
        },
        {
            title: 'Passport No',
            dataIndex: 'passportNumber',
            key: 'passportNumber',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            sorter: (a, b) => a.gender.toLowerCase().localeCompare(b.gender.toLowerCase()),
            render: (a, record) => (
                <p>{record?.gender === 1 ? 'Male' : 'Female'}</p>
            ),
        },
        {
            title: 'Profile Image',
            dataIndex: 'profileImage',
            key: 'profileImage',
            render: (_, record) => (
                <img src={record?.profileImage} style={{ "height": "50px", "width": "50px" }} />
            ),
        },
        {
            title: 'IsActive',
            key: 'isActive',
            dataIndex: 'isactive',
            render: (_, record) => (
                <Checkbox checked={record?.isActive} disabled />
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/edit/${record.row_Id}`}>
                        <Button type='primary' >Edit</Button>
                    </Link>
                    <Popconfirm
                        title="Delete user"
                        description="Are you sure to delete this user?"
                        okText="Yes"
                        onConfirm={() => deleteEmployee(record?.row_Id)}
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const checkToken = async () => {
        setIsLoader(true)
        if (!localStorage.getItem("token")) {
            await messageApi.warning("Session expired. Please sign in again.")
            return navigate("/");
        }
    };
    useEffect(() => {
        checkToken();
    }, []);

    const handleGlobalSearch = (searchTerm) => {
        setSearchText(searchTerm);
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const tempData = data.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(lowerCaseSearchTerm)
            );
        });
        setTableData(tempData);
    }

    useEffect(() => {
        setTableData(data)
    }, [data])

    const getEmployees = async () => {
        setIsLoader(true)
        try {
            const response = await GetEmployees();
            if (response?.status === 200) {
                setData(response?.data?.result);
                setIsLoader(false)
            } else {
                console.error("Something went wrong. Please try again later");
            }
        } catch (error) {
            console.error("Something went wrong. Please try again later");
        } finally {
            setIsLoader(false)
        }
    }

    const deleteEmployee = async (id) => {
        setIsLoader(true)
        try {
            const response = await DeleteEmployee(id);
            if (response?.status === 204) {
                await messageApi.success("User deleted successfully");
                getEmployees();
            } else {
                await messageApi.error("Something went wrong. Please try again later");
            }
        } catch (error) {
            await messageApi.error("Something went wrong. Please try again later");
        }
        finally {
            setIsLoader(false)
        }
    }

    useEffect(() => {
        getEmployees();
    }, [])
    return (
        <>
            {contextHolder}
            <div className="page-body px-0 py-lg-2 py-1 mt-0 mt-lg-3 ms-3">
                <div className="container-fluid p-0">
                    <div className="row g-3">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-4 col-sm-3">
                                                    <Search placeholder="search..." value={searchText} loading enterButton="Search" size="large" onChange={(e) => handleGlobalSearch(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mt-1">
                            {isLoader && <Loader />}
                            <div className="card">
                                <div className="card-body">
                                    <div
                                        id="DataTables_Table_2_wrapper"
                                        className="dataTables_wrapper dt-bootstrap5 no-footer">
                                        <div className="row">
                                            <div className="col-sm-12 px-0 table-responsive">
                                                <div className="col-sm-12 px-0 table-responsive">
                                                    <Flex>
                                                        <Table bordered columns={columns} dataSource={tabelData} showSorterTooltip={{ target: 'sorter-icon' }} />
                                                    </Flex>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default Employees;