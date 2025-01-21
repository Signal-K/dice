'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QueryString from 'query-string';
import { API_URL } from '@/config';
import WarningRibbon from '@/components/billing/warning';

const SessionDetailsPage: React.FC = () => {
    const searchParams = useSearchParams();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [sessionDetails, setSessionDetails] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
  
    useEffect(() => {
      const values = QueryString.parse(searchParams.toString());
      const session_id = values.session_id as string || 'cs_test_a1vnIsQTvh9sm6VTykjzIE3fQS5uoVh8VHgGWDgUCt7lcrHGUaiN4BlmY3'; // Default session ID
  
      setSessionId(session_id);
      fetchSessionDetails(session_id);
    }, [searchParams]);
  
    async function fetchSessionDetails(sessionId: string) {
      const response = await fetch(`${API_URL}/api/stripe/get-session-details?session_id=${sessionId}`);
      const data = await response.json();
  
      if (response.ok) {
        setSessionDetails(data);
        setLoading(false);
        calculateExpiryDate(data.created);
      } else {
        console.error('Error fetching session details:', data.error);
      };
    };
  
    function calculateExpiryDate(createdAt: number) {
      const createdDate = new Date(createdAt * 1000); 
      const expiryDate = new Date(createdDate.setMonth(createdDate.getMonth() + 1)); 
  
      const currentDate = new Date();
      const timeDifference = expiryDate.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24)); 
  
      setDaysLeft(daysRemaining);
    }
  
    return (
      <section className="relative">
        {loading ? (
          <p className="text-center mt-8">Loading session details...</p>
        ) : (
          <>
            <div className="session-details">
              <p><strong>Session ID:</strong> {sessionId}</p>
              <p><strong>Created At:</strong> {sessionDetails?.created ? new Date(sessionDetails.created * 1000).toLocaleString() : 'N/A'}</p>
              <p><strong>Expiry Date:</strong> {sessionDetails?.created ? new Date(sessionDetails.created * 1000).setMonth(new Date(sessionDetails.created * 1000).getMonth() + 1).toLocaleString() : 'N/A'}</p>
              <p><strong>Current Date:</strong> {new Date().toLocaleString()}</p>
            </div>
  
            {daysLeft !== null && <WarningRibbon daysLeft={daysLeft} />}
          </>
        )}
      </section>
    );
};
  
const ExpiryNotificationPage: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SessionDetailsPage />
        </Suspense>
    );
};
  
export default ExpiryNotificationPage;