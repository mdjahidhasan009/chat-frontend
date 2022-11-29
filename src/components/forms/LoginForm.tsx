import { InputContainer, InputField, InputLabel, Button } from "../../utils/styles";

import styles from './index.module.scss';
import {Link} from "react-router-dom";
import React from "react";
export const LoginForm = () => {

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <InputContainer>
                <InputLabel htmlFor="email">Email</InputLabel>
                <InputField type="email" id="email"/>
            </InputContainer>

            <InputContainer className={styles.loginFormPassword}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <InputField type="password" id="password" />
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