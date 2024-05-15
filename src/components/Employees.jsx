import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag } from 'antd';
import { DeleteEmployee, GetEmployees } from '../services/EmployeeService';
import { toast } from 'react-toastify';
const Employees = () => {
    const [data, setData] = useState([]);
    const [tabelData, setTableData] = useState([]);
    const columns = [
        {
            title: 'Email',
            dataIndex: 'emailAddress',
            key: 'emailAddress',
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
        },
        {
            title: 'Profile Image',
            dataIndex: 'profileImage',
            key: 'profileImage',
        },
        {
            title: 'IsActive',
            key: 'isActive',
            dataIndex: 'isactive',
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
            const response = await GetEmployees();
            if (response?.status === 200) {
                //console.log(response?.data?.result);
                setData(response?.data?.result);
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
            <Table columns={columns} dataSource={tabelData} />
        </>
    )
};
export default Employees;