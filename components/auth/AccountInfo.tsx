'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/services/authInstance';

interface User {
  email: string;
  name: string;
  customer_id: string;
}

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unauthenticated, setUnauthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/profile');
        setUser(response.data);
        setUnauthenticated(false);  
      } catch (err: any) {
        if (err.response?.status === 401) {
          setUnauthenticated(true); 
        } else {
          setError('Unable to fetch user data.');
        }
      }
    };

    fetchUserData();
  }, []);

  if (unauthenticated) {
    return <div>You are not authenticated. Please log in.</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Account Details</h1>
      <p>Email: {user.email}</p>
      <p>Name: {user.name}</p>
      <p>Customer ID: {user.customer_id}</p>
    </div>
  );
};

export default Account;