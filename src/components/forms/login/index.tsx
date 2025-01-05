import {InputContainer, InputField, InputLabel, Button, InputError} from "../../../utils/styles";
import styles from '../index.module.scss';
import {Link, useNavigate} from "react-router-dom";
import React, {useContext} from "react";
import { useForm } from "react-hook-form";
import { UserCredentialsParams } from "../../../utils/types";
import {postLoginUser} from "../../../utils/api";
import {SocketContext} from "../../../utils/context/SocketContext";
import Loader from '../../ui/Loader'
import axios from "axios";

export const LoginForm = () => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [serverErrorMsg, setServerMsg] = React.useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UserCredentialsParams>();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const onSubmit = async (data: UserCredentialsParams) => {
        try {
          setIsSubmitting(true);
          await postLoginUser(data);
          socket.connect()
          navigate('/conversations');
        } catch (e) {
          console.error(e);
            if (axios.isAxiosError(e)) {
                const message = e.response?.data?.message || e?.message;
                console.error("Error Message:", message);
                setServerMsg(message);
            } else {
                console.error("An unexpected error occurred:", e);
            }
        } finally {
          setIsSubmitting(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <InputContainer>
                <InputLabel htmlFor="username">Username</InputLabel>
                <InputField
                    type="text"
                    id="username"
                    {...register('username', {
                        required: true
                    })}
                />
            </InputContainer>

            <InputContainer className={styles.loginFormPassword}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <InputField
                    type="password"
                    id="password"
                    {...register('password', {
                        required: true
                    })}
                />
            </InputContainer>

            {serverErrorMsg && <InputError>{serverErrorMsg}</InputError>}

            <Button
                className={styles.button}
                type="submit"
                disabled={isSubmitting}
            >
                <div>
                    {isSubmitting ? <span><Loader /></span> : ""}
                    <span>Login</span>
                </div>
            </Button>

            <div className={styles.footerText}>
                <span>Don't have an account? </span>
                <Link to="/register">
                    <span>Register</span>
                </Link>
            </div>
        </form>
    )
}