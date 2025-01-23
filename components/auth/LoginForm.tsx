'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/services/authInstance';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
            const response = await axiosInstance.post('http://127.0.0.1:8000/api/auth/login/', { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            const { accessToken } = response.data;
    
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                router.push('/account');
            } else {
                setError('Failed to retrieve access token.');
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
            console.error('Login failed', error);
        }
    };    

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default LoginForm;