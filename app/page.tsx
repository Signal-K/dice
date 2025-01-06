'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import QueryString from 'query-string';
import { API_URL } from '../config'; // Ensure API_URL points to your Next.js backend
import '../styles/Subscrip.css';

interface Product {
  name: string;
  price: number;
  image: string;
}

const HomePage: React.FC = () => {
  const searchParams = useSearchParams();
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [last4, setLast4] = useState<string | null>(null); // Store last 4 digits
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const values = QueryString.parse(searchParams.toString());
    const success = values.success === 'true';
    const session_id = values.session_id as string;

    console.log("session_id:", session_id); // Log the session_id to ensure it's correct

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
      const text = await response.text(); // Get the raw response
      console.log("Raw response:", text); // Log it to inspect the raw response
      const data = JSON.parse(text); // Parse the JSON after inspecting the response

      if (data?.line_items && data.line_items.length > 0) {
        const item = data.line_items[0];
        setProduct({
          name: item.name,
          price: item.amount_total / 100, // Convert cents to dollars
          image: item.image_url || 'default_image_url.jpg',
        });
      }

      // Set the last 4 card digits from the payment method
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
      {transactionStatus && (
        <div
          className={`absolute top-0 left-0 w-full p-4 text-white ${
            transactionStatus === 'Transaction Successful'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        >
          <p className="text-center text-lg">{transactionStatus}</p>
        </div>
      )}
      {sessionId && (
        <div className="absolute top-20 left-0 transform rotate-45 origin-top-left bg-blue-500 text-white px-4 py-2 w-auto">
          <span className="text-sm">Session ID: {sessionId}</span>
        </div>
      )}
      {loading ? (
        <p className="text-center mt-8">Loading product details...</p>
      ) : product ? (
        <div className="product mt-16 flex justify-between items-center w-[480px] h-[150px] bg-gray-100 shadow-md p-4 mx-auto">
          <img
            src={product.image}
            alt={product.name}
            className="w-[200px] h-[150px] object-cover"
          />
          <div className="description pl-4">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <h5 className="text-lg text-gray-700">${product.price}</h5>
          </div>
        </div>
      ) : (
        <p className="text-center mt-8">No product details available.</p>
      )}

      {/* Display last 4 digits of the card */}
      {last4 && (
        <div className="mt-4 text-center">
          <p className="text-lg text-gray-800">Last 4 digits of the card: **** **** **** {last4}</p>
        </div>
      )}

      <form action={`${API_URL}/api/stripe/create-checkout-session`} method="POST" className="mt-8">
        <button className="button w-full py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300">
          Checkout
        </button>
      </form>
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