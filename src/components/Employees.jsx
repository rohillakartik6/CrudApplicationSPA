import { Button, Checkbox, Flex, Popconfirm, Space, Table } from 'antd';
import Search from 'antd/es/transfer/search';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DeleteEmployee, GetEmployees } from '../services/EmployeeService';
import Loader from './Loader';
const Employees = () => {
    const [data, setData] = useState([]);
    const [tabelData, setTableData] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [searchText, setSearchText] = useState("");
    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            defaultSortOrder: 'descend',
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
        },
        {
            title: 'State',
            dataIndex: 'stateName',
            key: 'stateId',
        },
        {
            title: 'City',
            dataIndex: 'cityName',
            key: 'cityId',
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

    const handleGlobalSearch = (searchTerm) => {
        setSearchText(searchTerm);
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const tempData = data.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(lowerCaseSearchTerm)
            );
        });
        setTableData(tempData)
    }

    useEffect(() => {
        if (data.length > 0) {
            const updatedEmployees = data?.map(e => ({
                ...e,
                gender: e.gender === 1 ? 'Male' : 'Female'
            }));
            setTableData(updatedEmployees)
        } else {
            setTableData(data)
        }
    }, [data])

    const getEmployees = async () => {
        try {
            setIsLoader(true)
            const response = await GetEmployees();
            if (response?.status === 200) {
                setData(response?.data?.result);
                setIsLoader(false)
            } else {
                console.error("Something went wrong. Please try again later");

            }
        } catch (error) {
            console.error("Something went wrong. Please try again later");
        }
    }

    const deleteEmployee = async (id) => {
        try {
            const response = await DeleteEmployee(id);
            if (response?.status === 204) {
                toast.success(response?.data?.message);
                getEmployees();
            } else {
                toast.error("Something went wrong. Please try again later");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again later");
        }
    }

    useEffect(() => {
        getEmployees();
    }, [])
    return (
        <>
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