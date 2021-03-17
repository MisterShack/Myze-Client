import axios from "axios";

let customInstance = axios.create({
  baseURL: "http://myze.ca:1337/api",
  headers: {
    Accept: "application/json",
  },
});

export default customInstance;
