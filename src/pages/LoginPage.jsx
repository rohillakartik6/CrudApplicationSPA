import { Button, Checkbox, Form, Input } from 'antd';
import useMessage from 'antd/es/message/useMessage';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from '../services/LoginService';
import Loader from '../components/Loader';
import Cookies from "js-cookie";
import { useForm } from 'antd/es/form/Form';
import { useContext } from 'react';
import { UserContext } from '../schema/UserDetails';

export default function LoginPage() {
  const [messageApi, contextHolder] = useMessage();
  const [isLoader, setIsLoader] = useState(false);
  const navigate = useNavigate();
  const [form] = useForm();
  const { setToken } = useContext(UserContext);


  const loginUser = async (body) => {
    setIsLoader(true)
    try {
      const response = await Login(body);
      if (!response?.data.isError) {
        setToken(response?.data?.result?.token);
        localStorage.setItem("token", response?.data?.result?.token)
        await messageApi.loading("Signing in...");
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

  const onFinish = (values) => {
    handleRememberMe(values);
    const body = {
      emailAddress: values?.emailAddress,
      password: values?.password
    }
    loginUser(body);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleRememberMe = (values) => {
    try {
      if (values?.remember) {
        Cookies.set("email", values?.emailAddress, { expires: 7 }); // Expires in 7 days
        Cookies.set("password", values?.password, { expires: 7 });
      } else {
        Cookies.remove("email");
        Cookies.remove("password");
      }
    } catch (error) {
      console.warn("No credentials found");
    }
  }

  const getRememberMe = () => {
    try {
      const email = Cookies.get("email");
      const password = Cookies.get("password");
      if (email && password) {
        form.setFieldsValue({
          emailAddress: email,
          password: password,
          remember: true
        })
      }
    }
    catch (error) {
      console.warn("Some error occured")
    }
  }

  useEffect(() => {
    getRememberMe();
  },[])


  return (
    <>
      {contextHolder}
      {isLoader && <Loader />}
      <div className="page-body">
        <div className="container-fluid">
          <div className="col-lg-12 d-flex justify-content-center align-items-center">
            <div
              className="card shadow-sm  p-4 p-md-5 mt-5"
              style={{ width: "32rem" }}>
              <Form
                form={form}
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Email"
                  name="emailAddress"
                  rules={[{
                    type: "email",
                    message: "Please input a valid email!",
                  },
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Checkbox defaultChecked={false}>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};