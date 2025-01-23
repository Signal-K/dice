'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QueryString from 'query-string';
import '../styles/Subscrip.css';

import { SessionIdDisplay, ProductDetails, TransactionStatus, CheckoutForm } from '@/components/billing';
import { API_URL } from '@/config';
import InvoiceDetailsComponent from '@/components/billing/détails_facture';
import InvoiceButtons from '@/components/billing/toutes_facture';
import InvoiceProductIds from '@/components/billing/productId';

type Product = {
  name: string;
  description: string;
  price: number;  
};

type SessionDetails = {
  customer_name: string;
  customer_id: string;
  customer_email: string;
  status: string;
  amount_total?: number;
  currency: string;
  payment_status: string;
  invoice: string;
  subscription: string;
  created?: number;
  expiration?: number;
  success_url: string;
  cancel_url: string;
  current_transaction_date: string;
  next_transaction_date: string;
  product?: Product; 
};

const HomePage: React.FC = () => {
  const searchParams = useSearchParams();
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
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
    };

    if (session_id) {
      setSessionId(session_id);
      fetchSessionDetails(session_id);
    }
  }, [searchParams]);

  async function fetchSessionDetails(sessionId: string) {
    const response = await fetch(`${API_URL}/api/stripe/get-session-details?session_id=${sessionId}`);
    const data = await response.json();
    
    if (response.ok) {
      setSessionDetails({
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_id: data.customer_id,
        status: data.status,
        amount_total: data.amount_total,
        currency: data.currency,
        payment_status: data.payment_status,
        invoice: data.invoice,
        subscription: data.subscription,
        created: data.created,
        expiration: data.expiration,
        success_url: data.success_url,
        cancel_url: data.cancel_url,
        current_transaction_date: data.current_transaction_date,
        next_transaction_date: data.next_transaction_date,
        product: data.product, // Assuming product data is part of the response
      });
      setLoading(false); // Set loading to false once data is fetched
    } else {
      console.error('Error fetching session details:', data.error);
    }
  }

  return (
    <section className="relative">
      {loading ? (
        <p className="text-center mt-8">Loading session details...</p>
      ) : (
        <>
          <div className="session-details">
            <p><strong>Customer Name:</strong> {sessionDetails?.customer_name}</p>
            <p><strong>Customer Email:</strong> {sessionDetails?.customer_email}</p>
            <p><strong>Customer Id:</strong>{sessionDetails?.customer_id}</p>
            <p><strong>Status:</strong> {sessionDetails?.status}</p>
            <p><strong>Amount Total:</strong> {sessionDetails?.amount_total ? sessionDetails.amount_total / 100 : 'N/A'} {sessionDetails?.currency.toUpperCase()}</p>
            <p><strong>Payment Status:</strong> {sessionDetails?.payment_status}</p>
            <p><strong>Invoice:</strong> {sessionDetails?.invoice}</p>
            <p><strong>Subscription:</strong> {sessionDetails?.subscription}</p>
            <p><strong>Created At:</strong> {sessionDetails?.created ? new Date(sessionDetails.created * 1000).toLocaleString() : 'N/A'}</p>
            <p><strong>Expires At:</strong> {sessionDetails?.expiration ? new Date(sessionDetails.expiration * 1000).toLocaleString() : 'N/A'}</p>
            <p><strong>Success URL:</strong> <a href={sessionDetails?.success_url}>{sessionDetails?.success_url}</a></p>
            <p><strong>Cancel URL:</strong> <a href={sessionDetails?.cancel_url}>{sessionDetails?.cancel_url}</a></p>
            <p><strong>Current Transaction Date:</strong> {sessionDetails?.current_transaction_date}</p>
            <p><strong>Next Transaction Date:</strong> {sessionDetails?.next_transaction_date}</p>
          </div>

          <p>{sessionDetails?.invoice}</p>

          {sessionDetails && (<InvoiceButtons customerId={sessionDetails?.customer_id} /> )}

          {sessionDetails && ( <InvoiceDetailsComponent invoiceId={sessionDetails.invoice} /> )}

          {sessionDetails?.product && (
            <>
              <ProductDetails product={sessionDetails.product} />
            </>
          )}
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