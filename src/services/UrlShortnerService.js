import axios from "axios"

export const PostUrlShorten = async (body) => {
    console.log(body, 4)
    const response = await axios.get(`http://localhost:5005/api/Url/ShortenUrl`, {
        params: {
            url: body
        },
    });
    return response;
}