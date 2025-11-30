import axios from "axios";

const urlBase = "https://terrenos-rouge.vercel.app";

const Api = axios.create({
  baseURL: urlBase,
});

export { urlBase, Api };
