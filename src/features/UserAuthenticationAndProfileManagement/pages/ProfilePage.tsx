import React, { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/authService';
import { ProfileRequest } from '../types';

const ProfilePage: React.FC = () => {
  const { token } = useAuth();
  const mutation = useMutation((profile: ProfileRequest) => updateUserProfile(profile));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      username: formData.get('username') as string,
    };
    mutation.mutate(data);
  };

  useEffect(() => {
    if (!token) {
      // redirect to login if not authenticated, assuming a router utility exists
    }
  }, [token]);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username" className="border p-2 w-full" />
        <input type="email" name="email" placeholder="Email" className="border p-2 w-full" />
        <input type="password" name="password" placeholder="Password" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
