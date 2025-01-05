import { Page } from "../utils/styles";
import { LoginForm } from "../components/forms/login";

export const LoginPage = () => {
    return (
        <Page display="flex" justifyContent="center" alignItems="center">
            <LoginForm />
        </Page>
    )
};