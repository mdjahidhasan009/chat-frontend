import { Page } from "../utils/styles";
import { LoginForm } from "../components/forms/LoginForm";

export const LoginPage = () => {
    return <Page display="flex" justifyContent="center" alignItems="center">
            <LoginForm />
    </Page>
};