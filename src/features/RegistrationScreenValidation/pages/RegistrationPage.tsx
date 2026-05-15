import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrationForm } from '@/features/RegistrationScreenValidation/hooks';
import { Button, Input } from '@/components/ui';
import { Facebook, Instagram } from 'lucide-react';

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { values, errors, handleChange, handleSubmit } = useRegistrationForm();

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        <Button type="submit" variant="primary">Register</Button>
      </form>
      <div className="flex justify-around mt-4">
        <Button
          variant="ghost"
          onClick={() => window.open('https://facebook.com', '_blank')}
        >
          Open Facebook&nbsp;<Facebook />
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.open('https://instagram.com', '_blank')}
        >
          Open Instagram&nbsp;<Instagram />
        </Button>
      </div>
      <Button
        variant="secondary"
        className="mt-4"
        onClick={() => navigate('/login')}
      >
        Sign In
      </Button>
    </div>
  );
};
