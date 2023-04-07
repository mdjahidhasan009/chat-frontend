import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'
import { RegisterPage } from '../pages/RegisterPage';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form field', () => {
    const view = render(
      <Router>
        <RegisterPage />
      </Router>
    );

    //previous snapsort create error so before run this test remove previous snapshot(__snapshots__ folder)
    expect(view).toMatchSnapshot();
  });

  it('should display all errors when submitting with all empty fields', async() => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const submitButton = screen.getByRole('button', { name: 'Create My Account' });
    submitButton.click();
    
    const usernameError = await screen.findByText('Username is Required');
    const firstNameError = await screen.findByText('First Name is Required');
    const lastNameError = await screen.findByText('Last Name is Required');
    const passwordError = await screen.findByText('Password is Required');
    await waitFor(() => {
      expect(usernameError).toBeInTheDocument();
    });
    expect(firstNameError).toBeInTheDocument();
    expect(lastNameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });

  it('should submit empty username field then remove error after typing and leaving focus', async() => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const submitButton = screen.getByRole('button');
    submitButton.click();
    const usernameError = await screen.findByText('Username is Required');
    await waitFor(() => {
      expect(usernameError).toBeInTheDocument();
    });
    const usernameField = screen.getByLabelText('Username');
    const firstNameField = screen.getByLabelText('First Name');
    expect(usernameField).toBeInTheDocument();
    expect(firstNameField).toBeInTheDocument();
    userEvent.type(usernameField, 'helloworld');
    userEvent.click(firstNameField);
    await waitForElementToBeRemoved(() => screen.queryByText('Username is Required'));
  });
})