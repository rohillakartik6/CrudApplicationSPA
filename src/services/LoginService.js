import axios from "axios";

export const Login = async (body) => {
    const response = await axios.post("http://localhost:5005/api/Login/Login", body)
    return response;
}