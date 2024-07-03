import useMessage from "antd/es/message/useMessage";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import {useState } from "react";

export default function Navbar({ token }) {
    const [messageApi, contextHolder] = useMessage();
    const navigate = useNavigate();
    const [isLoader, setIsLoader] = useState(false);
    const logout = async () => {
        setIsLoader(true)
        await messageApi.loading("Signing off...")
        localStorage.clear();
        navigate("/");
    };
    return (
        <>
            {contextHolder}
            {isLoader && <Loader />}
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
                <div className="container-fluid">
                    <a className="navbar-brand">CRUD</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mx-2 ">
                            <li className="nav-item">
                                <p>

                                    <Link
                                        to={"/list"}
                                        className="btn btn-outline-warning mx-2 text-dark"
                                    >
                                        View All
                                    </Link>
                                </p>
                            </li>
                            <li className="nav-item">
                                <p>

                                    <Link
                                        to={"/add"}
                                        className="btn btn-outline-warning mx-2 text-dark"
                                    >
                                        Add New
                                    </Link>
                                </p>
                            </li>
                            <li className="nav-item">
                                <p>

                                    <Link
                                        to={"/about-us"}
                                        className="btn btn-outline-warning mx-2 text-dark"
                                    >
                                        About Us
                                    </Link>
                                </p>
                            </li>
                            <li className="nav-item">
                                <p>
                                    <Link
                                        onClick={logout}
                                        className="btn btn-outline-dark border mx-2 float-right border-rounded-0">
                                        Sign out
                                    </Link>
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}