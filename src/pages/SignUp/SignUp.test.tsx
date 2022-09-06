import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUp from './SignUp';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

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
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toBeInTheDocument();
    });

    it('Has password type for password input', () => {
      render(<SignUp />);
      // container have same API as document
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });

    it('Has repeat password input', () => {
      render(<SignUp />);
      // container have same API as document
      const passwordInput = screen.getByLabelText('Password repeat');
      expect(passwordInput).toBeInTheDocument();
    });

    it('Has password type for repeat password input', () => {
      render(<SignUp />);
      // container have same API as document
      const passwordInput = screen.getByLabelText('Password repeat') as HTMLInputElement;
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
    it('Enable the button when password and password repeat fields have same value', () => {
      render(<SignUp />);
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const repeatPasswordInput = screen.getByLabelText('Password repeat') as HTMLInputElement;
      userEvent.type(passwordInput, 'password');
      userEvent.type(repeatPasswordInput, 'password');
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeEnabled();
    });

    it('Sends username, email and password to backend after clicking a button', async () => {
      // create fake server for this request
      let requestBody;
      const server = setupServer(rest.post('/api/1.0/users', (req, res, ctx) => {
         requestBody = req.body;
         return res(ctx.status(200));
      }));
      // enable server, when user click submit,
      // msw server will intercept the real request and return status 200
      server.listen();
      render(<SignUp />);
      const usernameInput = screen.getByLabelText('Name') as HTMLInputElement;
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const repeatPasswordInput = screen.getByLabelText('Password repeat') as HTMLInputElement;
      userEvent.type(usernameInput, 'username');
      userEvent.type(emailInput, 'test@email.com');
      userEvent.type(passwordInput, 'password');
      userEvent.type(repeatPasswordInput, 'password');
      const button = screen.queryByRole('button', { name: 'Sign Up' });

      userEvent.click(button!);
      // imitation server response with 500ms
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(requestBody).toEqual({
        email: 'test@email.com',
        username: 'username',
        password: 'password'
      });
    });
  });
});
