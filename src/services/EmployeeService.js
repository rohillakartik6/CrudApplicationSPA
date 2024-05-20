import axios from "axios";

export const GetEmployees = async () => {
    const data = await axios.get("http://localhost:5005/api/Employee/Employees");
    return data;
}

export const SaveEmployee = async (data) => {
    const response = await axios.post("http://localhost:5005/api/Employee/Employee", data);
    return response;
}

export const DeleteEmployee = async (id) => {
    const response = await axios.delete(`http://localhost:5005/api/Employee/Employee/${id}`);
    return response;
}

export const UploadProfileImage = async (body) => {
    const response = await axios.post("http://localhost:5005/api/Employee/UploadProfileImage", body)
    return response;
}

export const CheckDuplicate = async (fieldName, value) => {
    const queryParams = {
        fieldName: fieldName,
        value: value
    }
    const response = await axios.get(`http://localhost:5005/api/Employee/CheckDuplicate`, { params: queryParams })
    return response;
}

export const GetEmployeeById = async (id) => {
    const data = await axios.get(`http://localhost:5005/api/Employee/Employee/${id}`);
    return data;
}