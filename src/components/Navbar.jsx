import { Button } from "antd";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <nav class="navbar navbar-expand-lg navbar-light bg-light mb-5">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">CRUD</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mx-2 ">
                            <li class="nav-item">
                                <p>

                                    <Link
                                        to={"/list"}
                                        className="btn btn-outline-warning text-dark"
                                    >
                                        View All
                                    </Link>
                                </p>
                            </li>
                            <li class="nav-item">
                                <p>

                                    <Link
                                        to={"/add"}
                                        className="btn btn-outline-warning text-dark"
                                    >
                                        Add New
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