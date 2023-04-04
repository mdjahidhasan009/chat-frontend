import { InputContainer, InputField, InputLabel, Button } from "../../../utils/styles";
import styles from '../index.module.scss';
import {Link, useNavigate} from "react-router-dom";
import React, {useContext} from "react";
import { useForm } from "react-hook-form";
import { UserCredentialsParams } from "../../../utils/types";
import {postLoginUser} from "../../../utils/api";
import {SocketContext} from "../../../utils/context/SocketContext";
export const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UserCredentialsParams>();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const onSubmit = async (data: UserCredentialsParams) => {
        // event.preventDefault();
        try {
          await postLoginUser(data);
          socket.connect()
          navigate('/conversations');
        } catch (e) {
          console.log(e);
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
            <Button className={styles.button}>Login</Button>
            <div className={styles.footerText}>
                <span>Don't have an account? </span>
                <Link to="/register">
                    <span>Register</span>
                </Link>
            </div>
        </form>
    )
}