'use client';

import { API_URL } from '@/config';
import { useState, useEffect } from 'react';

interface InvoiceProps {
    invoiceId: string;
}

const InvoiceProductIds = ({ invoiceId }: InvoiceProps) => {
    const [lineItems, setLineItems] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLineItems = async () => {
            try {
                const response = await fetch(`${API_URL}/api/stripe/invoice-line-items?invoice_id=${invoiceId}`);
                const data = await response.json();

                if (response.ok) {
                    // Set the full line item details from the API response
                    setLineItems(data.line_items);
                    setError(null);
                } else {
                    setError(data.error || 'Failed to fetch line items.');
                }
            } catch (error) {
                setError('Error fetching line items');
                console.error('Error fetching line items:', error);
            }
        };

        fetchLineItems();
    }, [invoiceId]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h3>Line Items for Invoice {invoiceId}</h3>
            {lineItems.length > 0 ? (
                <ul>
                    {lineItems.map((item) => (
                        <li key={item.id}>
                            <p><strong>Line Item ID:</strong> {item.id}</p>
                            <p><strong>Description:</strong> {item.description}</p>
                            <p><strong>Amount:</strong> {(item.amount / 100).toFixed(2)} {item.currency.toUpperCase()}</p>
                            <p><strong>Product:</strong> {item.product_name} (ID: {item.product_id})</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Subscription:</strong> {item.subscription}</p>
                            <p><strong>Plan Details:</strong> {JSON.stringify(item.plan)}</p>
                            <p><strong>Unit Amount (Excluding Tax):</strong> {(item.unit_amount_excluding_tax / 100).toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No line items found.</p>
            )}
        </div>
    );
};

export default InvoiceProductIds;