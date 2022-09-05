import React, { useState, useEffect, MouseEvent } from 'react';
import axios from 'axios';

const SignUp = () => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  useEffect(() => {
    if (password && repeatPassword) {
      setIsSubmitDisabled(password !== repeatPassword);
    }
  }, [repeatPassword]);

  const onSubmit = async (evt:  MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const body = {
      name,
      email,
      password
    };
    await axios.post('/api/1.0/users', body);
  };

  return (
    <div>
      <form>
        <h1>Sign up</h1>
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
          />
        </label>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
          />
        </label>
        <label>
          Password repeat
          <input
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            type="password"
            name="password-repeat"
          />
        </label>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
