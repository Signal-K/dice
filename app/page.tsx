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
  const [product, setProduct] = useState<Product | null>(null);
  const [last4, setLast4] = useState<string | null>(null);
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
      const text = await response.text();
      console.log('Raw response:', text);
      const data = JSON.parse(text);

      if (data?.line_items && data.line_items.length > 0) {
        const item = data.line_items[0];
        setProduct({
          name: item.name,
          price: item.amount_total / 100,
          image: item.image_url || 'default_image_url.jpg',
        });
      }

      if (data?.payment_intent?.payment_method_details?.card?.last4) {
        setLast4(data.payment_intent.payment_method_details.card.last4);
      }
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
        <p className="text-center mt-8">Loading product details...</p>
      ) : (
        <ProductDetails product={product} />
      )}
      <Last4Display last4={last4} />
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