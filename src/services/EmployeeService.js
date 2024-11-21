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

export const DeleteProfileImage = async (fileName) => {
    const headers = {
        Authorization: localStorage.getItem("token")
    }
    const queryParams = {
        fileName: fileName
    }
    const response = await axios.delete(`http://localhost:5005/api/Employee/DeleteProfileImage`, {
        params: queryParams,
        headers: headers
    });
    return response;
}

export const GetParallelApiCalls = async () => {
    const headers = {
        Authorization: localStorage.getItem("token")
    }
    const userWithId16 = axios.get(`http://localhost:5005/api/Employee/Employee/16`, { headers: headers });
    const userWithId17 = axios.get(`http://localhost:5005/api/Employee/Employee/17`, { headers: headers });
    const userWithId18 = axios.get(`http://localhost:5005/api/Employee/Employee/18`, { headers: headers });
    const userWithId19 = axios.get(`http://localhost:5005/api/Employee/Employee/19`, { headers: headers });
    const userWithId20 = axios.get(`http://localhost:5005/api/Employee/Employee/20`, { headers: headers });
    const userWithId21 = axios.get(`http://localhost:5005/api/Employee/Employee/21`, { headers: headers });
    const userWithId22 = axios.get(`http://localhost:5005/api/Employee/Employee/22`, { headers: headers });
    const endPoints = [userWithId16, userWithId17, userWithId18, userWithId19, userWithId20, userWithId21, userWithId22];
    const response = await axios.all(endPoints);
    response.map((d, i) => console.log(d));
    return response;
}