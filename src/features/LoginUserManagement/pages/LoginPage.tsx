import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = data => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <label>Username</label>
        <input {...register('username', { required: 'Username is required' })} className="input" />
        {errors.username && <p>{errors.username.message}</p>}
      </div>
      <div className="mb-4">
        <label>Password</label>
        <input type="password" {...register('password', { required: 'Password is required' })} className="input" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <button type="submit" className="btn">Login</button>
    </form>
  );
};

export default LoginPage;
