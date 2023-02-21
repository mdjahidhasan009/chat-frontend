import axios, { AxiosRequestConfig } from 'axios';
import {CreateMessageParams, CreateUserParams, User, UserCredentialsParams} from './types';

const API_URL = process.env.REACT_APP_API_URL;
const config: AxiosRequestConfig = { withCredentials: true };

////TODO:I will make it async => in tutorial it is not async
export const postRegisterUser = (data: CreateUserParams) =>
  axios.post(`${API_URL}/auth/register`, data, config);

////TODO:I will make it async => in tutorial it is not async
export const postLoginUser = (data: UserCredentialsParams) =>
  axios.post(`${API_URL}/auth/login`, data, config);

////TODO:I will make it async => in tutorial it is not async
export const getAuthUser = () =>
  axios.get<User>(`${API_URL}/auth/status`, config);

export const getConversations = () =>
  axios.get(`${API_URL}/conversations`, config);

export const getConversationMessages = (id: number) =>
  axios.get(`${API_URL}/messages/${id}`, config);

export const postNewMessage = (data: CreateMessageParams) =>
  axios.post(`${API_URL}/messages`, data, config);