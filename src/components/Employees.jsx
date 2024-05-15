import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Space, Table, Tag } from 'antd';
import { DeleteEmployee, GetEmployees } from '../services/EmployeeService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loader from './Loader';
const Employees = () => {
    const [data, setData] = useState([]);
    const [tabelData, setTableData] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
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
            sorter: (a, b) => a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase()),
        },
        {
            title: 'Email',
            dataIndex: 'emailAddress',
            key: 'emailAddress',
        },
        {
            title: 'Country',
            dataIndex: 'countryName',
            key: 'countryId',
            sorter: (a, b) => a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase()),
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
                <Checkbox value={record?.isActive} disabled className={record.isActive ? "bg-success" : "bg-danger"} />
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type='primary'>Edit</Button>
                    <Button onClick={() => deleteEmployee(record?.row_Id)} danger>Delete</Button>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        const updatedEmployees = data.map(e => ({
            ...e,
            gender: e.gender === 1 ? 'Male' : 'Female'
        }));
        setTableData(updatedEmployees)
    }, [data])
    const getEmployees = async () => {
        try {
            setIsLoader(true)
            const response = await GetEmployees();
            if (response?.status === 200) {
                //console.log(response?.data?.result);
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
        //console.log(id)
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
            {/* <img src={}/> */}
        </>
    )
};
export default Employees;