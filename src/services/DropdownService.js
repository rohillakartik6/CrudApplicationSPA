import axios from "axios";

export const GetCountries = async () => {
    const response = await axios.get("http://localhost:5005/api/Dropdown/Countries")
    return response;
}

export const GetStates = async (countryId) => {
    const response = await axios.get(`http://localhost:5005/api/Dropdown/States?countryId=${countryId}`)
    return response;
}
export const GetCities = async (stateId) => {
    const response = await axios.get(`http://localhost:5005/api/Dropdown/Cities?stateId=${stateId}`)
    return response;
}