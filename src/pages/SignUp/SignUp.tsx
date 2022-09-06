import React, { useState, useEffect, MouseEvent } from 'react';
import axios from 'axios';
import {
  IconButton,
  InputAdornment,
  TextField,
  OutlinedInput,
  FormControl,
  InputLabel,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SignUp = () => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isApiRequestInProgress, setIsApiRequestInProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  useEffect(() => {
    if (password && repeatPassword) {
      setIsSubmitDisabled(password !== repeatPassword);
    }
  }, [repeatPassword]);

  const onSubmit = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const body = {
      username: name,
      email,
      password
    };
    setIsApiRequestInProgress(true);
    await axios.post('/api/1.0/users', body);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Typography variant="h3" textAlign="center" mb={3}>Sign up</Typography>
      <Box sx={{ display: 'grid', gridGap: '10px' }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          name="name" />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
        />
        <FormControl>
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            label="Password"
            placeholder="Enter you password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            name="password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="password">Password repeat</InputLabel>
          <OutlinedInput
            placeholder="Repeat your password"
            label="Password repeat"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            type={showRepeatPassword ? 'text' : 'password'}
            name="password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  edge="end"
                >
                  {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <LoadingButton
          loading={isApiRequestInProgress}
          variant="contained"
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitDisabled || isApiRequestInProgress}
        >
          Sign Up
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default SignUp;
