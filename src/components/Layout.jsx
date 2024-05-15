import { Flex } from "antd";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <Navbar />
            <Flex justify='center' align='center'>
                <Outlet />
            </Flex>
        </>
    )
}