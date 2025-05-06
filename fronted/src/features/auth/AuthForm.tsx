import { useState } from 'react';
import { TextField, Button, Typography, Paper, Snackbar, Alert, Link } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, signInSchema } from './AuthSchema';
import type { SignInInput, User, userInfo } from './authTypes';
import { useCreateUserMutation, useSignInMutation } from './authAPI';
import { setCookie } from 'typescript-cookie';
import { jwtDecode } from "jwt-decode";

const AuthForm = () => {
  const [createUser] = useCreateUserMutation();
  const [signIn] = useSignInMutation();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const signUpForm = useForm<User>({
    mode: 'onChange',
    resolver: zodResolver(signUpSchema),
  });

  const signInForm = useForm<SignInInput>({
    mode: 'onChange',
    resolver: zodResolver(signInSchema),
  });

  const isSignUp = mode === 'signUp';

  const onSubmit: SubmitHandler<User | SignInInput> = async (data: User | SignInInput) => {
    try {
      let response: { token: string } | undefined;

      if (isSignUp) {
        response = await createUser(data).unwrap();
      } else {
        const { email, password } = data as SignInInput;
        response = await signIn({ email, password }).unwrap();
      }

      const token: string | undefined = response?.token;
      if (!token) throw new Error("Token is undefined");

      setCookie('token', token, { expires: 1, path: '/' });
      const decoded = jwtDecode<userInfo>(token);
      console.log("Decoded:", decoded);
      setOpenSnackbar(true);
      isSignUp ? signUpForm.reset() : signInForm.reset();
    } catch (error: any) {
      console.error("Error:", error);
      setErrorMessage(error?.data?.message || error?.message || "משהו השתבש, נסה שוב.");
      setErrorSnackbar(true);
    }
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'signUp' ? 'signIn' : 'signUp'));
    signUpForm.reset();
    signInForm.reset();
  };

  return (
    <div>
      <Paper elevation={3} sx={{ padding: 3, width: '400px' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Typography>

        {isSignUp ? (
          <form onSubmit={signUpForm.handleSubmit(onSubmit)}>
            <TextField fullWidth label="Name" margin="normal" {...signUpForm.register("name")} error={!!signUpForm.formState.errors.name} helperText={signUpForm.formState.errors.name?.message} />
            <TextField fullWidth label="Email" margin="normal" type="email" {...signUpForm.register("email")} error={!!signUpForm.formState.errors.email} helperText={signUpForm.formState.errors.email?.message} />
            <TextField fullWidth label="Phone" margin="normal" {...signUpForm.register("phone")} error={!!signUpForm.formState.errors.phone} helperText={signUpForm.formState.errors.phone?.message} />
            <TextField fullWidth label="Password" margin="normal" type="password" {...signUpForm.register("password")} error={!!signUpForm.formState.errors.password} helperText={signUpForm.formState.errors.password?.message} autoComplete="new-password" />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
          </form>
        ) : (
          <form onSubmit={signInForm.handleSubmit(onSubmit)}>
            <TextField fullWidth label="Email" margin="normal" type="email" {...signInForm.register("email")} error={!!signInForm.formState.errors.email} helperText={signInForm.formState.errors.email?.message} />
            <TextField fullWidth label="Password" margin="normal" type="password" {...signInForm.register("password")} error={!!signInForm.formState.errors.password} helperText={signInForm.formState.errors.password?.message} autoComplete="current-password" />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Sign In</Button>
          </form>
        )}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <Link onClick={toggleMode} sx={{ cursor: 'pointer', ml: 1 }}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </Link>
        </Typography>
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {isSignUp ? 'User registered successfully!' : 'Signed in successfully!'}
        </Alert>
      </Snackbar>

      <Snackbar open={errorSnackbar} autoHideDuration={6000} onClose={() => setErrorSnackbar(false)}>
        <Alert onClose={() => setErrorSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AuthForm;
