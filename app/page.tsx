'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QueryString from 'query-string';
import '../styles/Subscrip.css';

import { SessionIdDisplay, Last4Display, ProductDetails, TransactionStatus, CheckoutForm } from '@/components/billing';
import { Product } from '@/components/billing/productDetails';

const HomePage: React.FC = () => {
  const searchParams = useSearchParams();
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const values = QueryString.parse(searchParams.toString());
    const success = values.success === 'true';
    const session_id = values.session_id as string;

    console.log('session_id:', session_id);

    if (success) {
      setTransactionStatus('Transaction Successful');
    } else if (values.canceled) {
      setTransactionStatus('Transaction Canceled');
    }

    if (session_id) {
      setSessionId(session_id);
      fetchSessionDetails(session_id);
    }
  }, [searchParams]);

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/stripe/get-session-details?session_id=${sessionId}`);
      const data = await response.json();
      console.log('Session details:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      setSessionDetails(data);
    } catch (error) {
      console.error('Error fetching session details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative">
      <TransactionStatus status={transactionStatus} />
      <SessionIdDisplay sessionId={sessionId} />
      {loading ? (
        <p className="text-center mt-8">Loading session details...</p>
      ) : (
        <>
          <div className="session-details">
            <p><strong>Customer Name:</strong> {sessionDetails?.customer_name}</p>
            <p><strong>Customer Email:</strong> {sessionDetails?.customer_email}</p>
            <p><strong>Status:</strong> {sessionDetails?.status}</p>
            <p><strong>Amount Total:</strong> {sessionDetails?.amount_total / 100} {sessionDetails?.currency.toUpperCase()}</p>
            <p><strong>Payment Status:</strong> {sessionDetails?.payment_status}</p>
            <p><strong>Invoice:</strong> {sessionDetails?.invoice}</p>
            <p><strong>Subscription:</strong> {sessionDetails?.subscription}</p>
            <p><strong>Created At:</strong> {new Date(sessionDetails?.created * 1000).toLocaleString()}</p>
            <p><strong>Expires At:</strong> {new Date(sessionDetails?.expiration * 1000).toLocaleString()}</p>
            <p><strong>Success URL:</strong> <a href={sessionDetails?.success_url}>{sessionDetails?.success_url}</a></p>
            <p><strong>Cancel URL:</strong> <a href={sessionDetails?.cancel_url}>{sessionDetails?.cancel_url}</a></p>
          </div>

          <ProductDetails product={sessionDetails?.product} />
        </>
      )}
      <CheckoutForm />
    </section>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
};

export default Page;