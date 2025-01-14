'use client'; // Ensures client-side rendering for this component

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QueryString from 'query-string';
import { API_URL } from '../config';
import '../styles/Subscrip.css';

const HomePage: React.FC = () => {
  const searchParams = useSearchParams();
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const values = QueryString.parse(searchParams.toString());
    const success = values.success === 'true';
    const session_id = values.session_id as string;

    if (success) {
      setTransactionStatus('Transaction Successful');
    } else if (values.canceled) {
      setTransactionStatus("Transaction Canceled");
    }

    if (session_id) {
      setSessionId(session_id);
    }
  }, [searchParams]);

  return (
    <section className="relative">
      {/* Transaction Notification */}
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

      {/* Session ID Ribbon */}
      {sessionId && (
        <div className="absolute top-20 left-0 transform rotate-45 origin-top-left bg-blue-500 text-white px-4 py-2 w-auto">
          <span className="text-sm">Session ID: {sessionId}</span>
        </div>
      )}

      {/* Product Details */}
      <div className="product mt-16 flex justify-between items-center w-[480px] h-[150px] bg-gray-100 shadow-md p-4 mx-auto">
        {/* <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
          className="w-[200px] h-[150px] object-cover"
        /> */}
        <div className="description pl-4">
          <h3 className="text-xl font-semibold">Stubborn Attachments</h3>
          <h5 className="text-lg text-gray-700">$20.00</h5>
        </div>
      </div>

      {/* Checkout Form */}
      <form action={`${API_URL}/api/stripe/create-checkout-session`} method="POST" className="mt-8">
        <button className="button w-full py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300">
          Checkout
        </button>
      </form>
    </section>
  );
};

export default HomePage;