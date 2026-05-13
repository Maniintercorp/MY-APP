import React, { useState } from 'react';
import { useUserProfile, useUpdateUserProfile } from '../hooks';

const UserProfile: React.FC = () => {
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
  const { mutate: updateUserProfile, isLoading: isUpdating } = useUpdateUserProfile();
  const [username, setUsername] = useState(userProfile?.username || '');
  const [email, setEmail] = useState(userProfile?.email || '');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateUserProfile({ username, email });
  };

  if (isProfileLoading) return <div>Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-4">
        <label className="block mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border"
        />
      </div>
      <button type="submit" className="p-2 bg-green-500 text-white" disabled={isUpdating}>
        {isUpdating ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

export default UserProfile;