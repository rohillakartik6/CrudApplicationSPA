import { Flex } from "antd";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../schema/UserDetails";

export default function Layout() {
    const { token } = useContext(UserContext);
    return (
        <>
            <Navbar token={token} />
            <Flex justify='center' align='center'>
                <Outlet />
            </Flex>
        </>
    )
}