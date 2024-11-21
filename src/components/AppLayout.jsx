import { Button, Flex, Layout, Menu } from "antd";
import Navbar from "./Navbar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../schema/UserDetails";
import { Content, Footer, Header } from "antd/es/layout/layout";
import UrlShortner from "../pages/UrlShortner";
import useMessage from 'antd/es/message/useMessage';


export default function AppLayout() {
    const navigate = useNavigate();
    const [isLoader, setIsLoader] = useState(false);
    const [messageApi, contextHolder] = useMessage();
    const headerMenu = [
        {
            key: "list",
            link: "list",
            label: "View All",
            onclick: () => navigate("/list")
        },
        {
            key: "add",
            label: "Add New",
            link: "add",
            onclick: () => navigate("/add")
        },
        {
            key: "about-us",
            label: "About Us",
            link: "about-us",
            onclick: () => navigate("/about-us")
        },
        {
            key: "url-shortner",
            label: "URL Shortner",
            link: "url-shortner",
            onclick: () => navigate("/url-shortner")
        }
    ]
    const headerStyle = {
        // textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        height: 64,
        paddingInline: 48,
        lineHeight: '64px',
        backgroundColor: '#4096ff',
    };
    const contentStyle = {
        textAlign: 'center',
        minHeight: 120,
        lineHeight: '120px',
        color: '#fff',
        backgroundColor: '#0958d9',
    };
    const siderStyle = {
        textAlign: 'center',
        lineHeight: '120px',
        color: '#fff',
        backgroundColor: '#1677ff',
    };
    const footerStyle = {
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#4096ff',
    };
    const layoutStyle = {
        borderRadius: 8,
        overflow: 'hidden',
        width: 'calc(50% - 8px)',
        maxWidth: 'calc(50% - 8px)',
    };

    const checkToken = async () => {
        setIsLoader(true)
        console.log("checkToken", 78)
        if (!localStorage.getItem("token")) {
            await messageApi.warning("Session expired. Please sign in again.")
            return navigate("/");
        }
        setIsLoader(false)
    };

    useEffect(() => {
        checkToken();
    }, [window.location.href])

    return (
        <Layout >
            {/* <Navbar theme={theme} setTheme={setTheme} /> */}
            <Header style={headerStyle}>
                <div className="demo-logo" >CRUD</div>
                <Menu
                    onClick={(e) => navigate(`/${e.key}`)}
                    theme="dark"
                    items={headerMenu}
                    mode="horizontal"
                />
                <Button onClick={() => window.location.replace("/")}> Redirect</Button>
            </Header>
            <Content style={contentStyle}>
                {/* <Flex> */}
                <Outlet loader={isLoader}/>
                {/* </Flex> */}
            </Content>
            <Footer style={footerStyle} />
        </Layout>
    )
}