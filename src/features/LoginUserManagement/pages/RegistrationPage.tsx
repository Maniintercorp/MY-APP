import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

interface RegistrationFormInputs {
  username: string;
  password: string;
  email: string;
}

const RegistrationPage: React.FC = () => {
  const { registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormInputs>();

  const onSubmit: SubmitHandler<RegistrationFormInputs> = data => {
    registerUser(data);
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
      <div className="mb-4">
        <label>Email</label>
        <input type="email" {...register('email', { required: 'Email is required' })} className="input" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <button type="submit" className="btn">Register</button>
    </form>
  );
};

export default RegistrationPage;
