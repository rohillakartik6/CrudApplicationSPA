import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <>
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
                                        className="btn btn-outline-warning text-dark"
                                    >
                                        View All
                                    </Link>
                                </p>
                            </li>
                            <li className="nav-item">
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