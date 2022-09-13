import { describe, expect, it } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import SignUp from './SignUp';
import userEvent from '@testing-library/user-event';

describe('Sign up page', () => {
  describe('Layout', () => {
    it('Has header', () => {
      render(<SignUp />);
      const header = screen.queryByRole('heading', { name: 'Sign up' });
      expect(header).toBeInTheDocument();
    });

    // just for example how find element in container
    it('Has username input', () => {
      const renderResult = render(<SignUp />);
      // container have same API as document
      const userNameInput = renderResult.container.querySelector('input[name="name"]');
      expect(userNameInput).toBeInTheDocument();
    });

    // this variant much better
    it('Has email input', () => {
      render(<SignUp />);
      // container have same API as document
      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toBeInTheDocument();
    });

    it('Has password input', () => {
      render(<SignUp />);
      // container have same API as document
      const passwordInput = screen.getByPlaceholderText('Enter you password');
      expect(passwordInput).toBeInTheDocument();
    });

    it('Has password type for password input', () => {
      render(<SignUp />);
      // container have same API as document
      const passwordInput = screen.getByPlaceholderText('Enter you password') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });

    it('Has repeat password input', () => {
      render(<SignUp />);
      // container have same API as document
      const passwordInput = screen.getByPlaceholderText('Repeat your password');
      expect(passwordInput).toBeInTheDocument();
    });

    it('Has password type for repeat password input', () => {
      render(<SignUp />);
      // container have same API as document
      const passwordInput = screen.getByPlaceholderText('Enter you password') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });

    it('Has Sign Up button', () => {
      render(<SignUp />);
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    });

    it('Should button disabled initially', () => {
      render(<SignUp />);
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    let button: HTMLButtonElement | null;
    const fillOutSignUpForm = () => {
      render(<SignUp />);
      const usernameInput = screen.getByLabelText('Name') as HTMLInputElement;
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText('Enter you password');
      const repeatPasswordInput = screen.getByPlaceholderText('Repeat your password');
      userEvent.type(usernameInput, 'username');
      userEvent.type(emailInput, 'test@email.com');
      userEvent.type(passwordInput, 'password');
      userEvent.type(repeatPasswordInput, 'password');
      button = screen.queryByRole('button', { name: 'Sign Up' });
    }

    const fillOutFormWithError = () => {
      render(<SignUp />);
      const usernameInput = screen.getByLabelText('Name') as HTMLInputElement;
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText('Enter you password');
      const repeatPasswordInput = screen.getByPlaceholderText('Repeat your password');
      userEvent.type(usernameInput, '');
      userEvent.type(emailInput, '');
      userEvent.type(passwordInput, 'pass');
      userEvent.type(repeatPasswordInput, 'pass');
      button = screen.queryByRole('button', { name: 'Sign Up' });
    }

    it('Enable the button when password and password repeat fields have same value', () => {
      render(<SignUp />);
      const passwordInput = screen.getByPlaceholderText('Enter you password') as HTMLInputElement;
      const repeatPasswordInput = screen.getByPlaceholderText('Repeat your password');
      userEvent.type(passwordInput, 'password');
      userEvent.type(repeatPasswordInput, 'password');
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeEnabled();
    });

    it('Sends username, email and password to backend after clicking a button', () => {
      fillOutSignUpForm();
      userEvent.click(button!);
    });

    it('Disables button when there is an ongoing API call', () => {
      fillOutSignUpForm();
      userEvent.click(button!);
      expect(button).toBeDisabled();
    });

    it('Displays spinner while API request in progress', () => {
      fillOutSignUpForm();
      // why we use queryByRole https://testing-library.com/docs/react-testing-library/cheatsheet/
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      userEvent.click(button!);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('Displays account activation notification after successfully sign up request', async () => {
      const message = 'Please check your e-mail to activate your account';
      fillOutSignUpForm();
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      userEvent.click(button!);
      // because findBy, try to find async elements
      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });

    it('Hides sign up form after successfully sign up request', async () => {
      fillOutSignUpForm();
      const form = screen.getByTestId('signup-form');
      userEvent.click(button!);
      await waitForElementToBeRemoved(form);
    });

    it('Displays validation message for username', async () => {
       fillOutFormWithError();
       userEvent.click(button!);
       const validationError = await screen.findByText('Username cannot be null');
       expect(validationError).toBeInTheDocument();
    })

    it('Hides spinner and enable submit button after error received', async () => {
      fillOutFormWithError();
      userEvent.click(button!);
      // specially wait error, because test not pass if we don't wait
      await screen.findByText('Username cannot be null');
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    })
  });
});
