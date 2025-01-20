'use client';

import React, { useEffect, useState } from 'react';
import { API_URL } from '@/config';

type InvoiceDetails = {
  id: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  amount_due?: number;
  amount_paid?: number;
  currency?: string;
  customer_name?: string;
  customer_email?: string;
  created?: number;
  status?: string;
};

interface InvoiceProps {
  invoiceId: string;
}

const InvoiceDetailsComponent: React.FC<InvoiceProps> = ({ invoiceId }) => {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoiceDetails() {
      try {
        const response = await fetch(`${API_URL}/api/stripe/get-invoice-details?invoice_id=${invoiceId}`);
        const data = await response.json();

        if (response.ok) {
          setInvoiceDetails(data);
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch invoice details.');
        }
      } catch (err) {
        setError('An error occurred while fetching the invoice details.');
      } finally {
        setLoading(false);
      }
    }

    fetchInvoiceDetails();
  }, [invoiceId]);

  if (loading) return <p>Loading invoice details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="invoice-details">
      <h2>Invoice Details</h2>
      <p><strong>Invoice ID:</strong> {invoiceDetails?.id || 'N/A'}</p>
      <p><strong>Customer Name:</strong> {invoiceDetails?.customer_name || 'N/A'}</p>
      <p><strong>Customer Email:</strong> {invoiceDetails?.customer_email || 'N/A'}</p>
      <p><strong>Status:</strong> {invoiceDetails?.status || 'N/A'}</p>
      <p><strong>Amount Due:</strong> {(invoiceDetails?.amount_due || 0) / 100} {invoiceDetails?.currency || ''}</p>
      <p><strong>Amount Paid:</strong> {(invoiceDetails?.amount_paid || 0) / 100} {invoiceDetails?.currency || ''}</p>
      <p><strong>Created At:</strong> {invoiceDetails?.created ? new Date(invoiceDetails.created * 1000).toLocaleString() : 'N/A'}</p>
      <p><strong>Hosted Invoice:</strong> <a href={invoiceDetails?.hosted_invoice_url} target="_blank" rel="noopener noreferrer">View Invoice</a></p>
      <p><strong>Invoice PDF:</strong> <a href={invoiceDetails?.invoice_pdf} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
    </div>
  );
};

export default InvoiceDetailsComponent;