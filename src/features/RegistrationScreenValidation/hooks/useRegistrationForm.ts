import { useState } from 'react';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors extends Partial<FormValues> {}

const initialValues: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

export const useRegistrationForm = () => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!values.email) newErrors.email = 'Email is required';
    if (!values.password) newErrors.password = 'Password is required';
    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log('Registration successful:', values);
      // Perform registration API call here
    }
  };

  return { values, errors, handleChange, handleSubmit };
};
