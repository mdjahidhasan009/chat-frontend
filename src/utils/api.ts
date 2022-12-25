import axios, { AxiosRequestConfig } from 'axios';
import {CreateUserParams, User, UserCredentialsParams} from "./types";

const { REACT_APP_API_URL } = process.env;
const config: AxiosRequestConfig = { withCredentials: true };

////TODO:I will make it async => in tutorial it is not async
export const postRegisterUser = ( data: CreateUserParams ) => {
  axios.post(`${REACT_APP_API_URL}/auth/register`, data, config);
}

////TODO:I will make it async => in tutorial it is not async
export const postLoginUser = (data: UserCredentialsParams) => {
  axios.post(`${REACT_APP_API_URL}/auth/login`, data, config);
}

////TODO:I will make it async => in tutorial it is not async
export const getAuthUser = () => axios.get<User>(`${REACT_APP_API_URL}/auth/status`, config);