import { API_URL } from '@/config';
import React, { useState } from 'react';

type Invoice = {
  id: string;
  hosted_invoice_url: string;
  status: string;
  amount_due: number;
  currency: string;
};

const InvoiceButtons: React.FC<{ customerId: string }> = ({ customerId }) => {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/stripe/get-customer-invoices?customer_id=${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data: Invoice[] = await response.json();
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={fetchInvoices}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Fetch Invoices
      </button>

      {loading && <p>Loading invoices...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {invoices && ( 
        <div className="mt-4 space-y-2">
          {invoices.map((invoice) => (
            <a
              key={invoice.id}
              href={invoice.hosted_invoice_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
            >
              Invoice #{invoice.id} - {invoice.amount_due} {invoice.currency} ({invoice.status})
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceButtons;