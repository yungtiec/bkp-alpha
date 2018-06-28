import axios from "axios";

export const getUsers = () => axios.get("/api/users").then(res => res.data);
