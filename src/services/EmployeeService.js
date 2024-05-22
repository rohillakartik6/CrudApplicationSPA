import axios from "axios";

export const GetEmployees = async () => {
    const headers = {
        Authorization: localStorage.getItem("token")
    }

    const data = await axios.get("http://localhost:5005/api/Employee/Employees", {
        headers: headers
    });
    return data;
}

export const SaveEmployee = async (data) => {
    const headers = {
        Authorization: localStorage.getItem("token")
    }
    const response = await axios.post("http://localhost:5005/api/Employee/Employee", data, {
        headers: headers
    });
    return response;
}

export const DeleteEmployee = async (id) => {
    const headers = {
        Authorization: localStorage.getItem("token")
    }
    const response = await axios.delete(`http://localhost:5005/api/Employee/Employee/${id}`, {
        headers: headers
    });
    return response;
}

export const UploadProfileImage = async (body) => {
    const headers = {
        Authorization: localStorage.getItem("token")
    }
    const response = await axios.post("http://localhost:5005/api/Employee/UploadProfileImage", body, {
        headers: headers
    })
    return response;
}

export const CheckDuplicate = async (fieldName, value) => {
    const headers = {
        Authorization: localStorage.getItem("token")
    }
    const queryParams = {
        fieldName: fieldName,
        value: value
    }
    const response = await axios.get(`http://localhost:5005/api/Employee/CheckDuplicate`, { params: queryParams, headers: headers })
    return response;
}

export const GetEmployeeById = async (id) => {
    const headers = {
        Authorization: localStorage.getItem("token")
    }
    const data = await axios.get(`http://localhost:5005/api/Employee/Employee/${id}`, { headers: headers });
    return data;
}