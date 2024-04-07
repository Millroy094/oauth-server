import axios from "axios";

const login = async(email: string, password: string): Promise<void> => {
    const url = process.env.REACT_APP_API_ENDPOINT ?? ""
    await axios.post( url, {email, password})
}

export default login