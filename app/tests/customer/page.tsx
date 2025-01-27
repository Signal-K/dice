'use client';

import { API_URL } from '@/config';
import { useState, useEffect } from 'react';

interface SetCustomerIdFormProps {
  userId: number
};

const SetCustomerIdForm: React.FC<SetCustomerIdFormProps> = ({ userId }) => {
  const [customerId, setCustomerId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Fetch the current customerId if it exists
  useEffect(() => {
    const fetchCustomerId = async () => {
      try {
        const res = await fetch(`${API_URL}/api/accounts/update-customer-id/${userId}/`);
        if (res.ok) {
          const data = await res.json();
          if (data.customer_id) {
            setCustomerId(data.customer_id);
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchCustomerId();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/accounts/update-customer-id/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, customerId }),
      });

      if (!res.ok) {
        throw new Error('Failed to update customer ID');
      }

      setSuccess(true);
      setError(null);
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div>
      <h3>Set Customer ID for User {userId}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerId">Customer ID:</label>
          <input
            id="customerId"
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Customer ID updated successfully!</p>}
    </div>
  );
};

export default function Page() {
  return (
    <div>
      <h1>Set Customer ID for User</h1>
      <SetCustomerIdForm userId={1} />
    </div>
  );
};