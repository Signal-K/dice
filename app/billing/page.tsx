'use client';

import React, { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import PaymentMethod from "@/components/billing/paymentMethod";
import { API_URL } from "@/config";
import { useSearchParams } from "next/navigation";

type Invoice = {
  id: string;
  hosted_invoice_url: string;
  description: string;
  create: number; // Unix timestamp
  amount_due: number;
  currency: string;
};

type InvoiceDetails = {
  id: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  amount_due?: number;
  amount_paid?: number;
  currency?: string;
  customer_name?: string;
  customer_email?: string;
  create?: number;
  status?: string;
};

const BillingPageComp: React.FC = () => {
  const searchParams = useSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionDetailsAndInvoices = async () => {
      setLoading(true);
      setError(null);

      try {
        const session_id = searchParams.get("session_id");
        if (!session_id) {
          throw new Error("Missing session_id in query parameters.");
        }

        const sessionResponse = await fetch(`${API_URL}/api/stripe/get-session-details?session_id=${session_id}`);
        if (!sessionResponse.ok) {
          throw new Error("Failed to fetch session details.");
        }

        const sessionData = await sessionResponse.json();
        const fetchedCustomerId = sessionData.customer_id;

        if (!fetchedCustomerId) {
          throw new Error("Customer ID not found in session details.");
        }
        setCustomerId(fetchedCustomerId);

        const invoiceResponse = await fetch(`${API_URL}/api/stripe/get-customer-invoices?customer_id=${fetchedCustomerId}`);
        if (!invoiceResponse.ok) {
          throw new Error("Failed to fetch invoices.");
        }

        const invoiceData: Invoice[] = await invoiceResponse.json();
        setInvoices(invoiceData);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetailsAndInvoices();
  }, [searchParams]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <Sidebar />
      <div className="ml-16 p-4 md:p-8">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-semibold">Lichen Viewer</h1>
          <span className="text-gray-500">MN</span>
        </div>
        <Card className="mx-auto max-w-4xl border border-gray-100 shadow-sm">
          <CardContent className="grid gap-6 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border border-gray-100 bg-gray-50/50 shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500">Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div>
                    <h3 className="flex items-center justify-between font-semibold">
                      Team Plan
                      <span>$275/mth</span>
                    </h3>
                    <ul className="mt-2 space-y-1 text-sm text-gray-500">
                      <li>3 Projects, 10 Users</li>
                      <li>Advanced Search and Filters</li>
                      <li>Priority Email Support</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="h-8 px-3 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      Change Plan
                    </Button>
                    <span className="text-sm text-gray-500">Next payment Aug 28, 2024</span>
                  </div>
                </CardContent>
              </Card>
              <PaymentMethod />
            </div>

            <Card className="border border-gray-100 bg-gray-50/50 shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading && <p>Loading billing history...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                {!loading && !error && (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-100 hover:bg-transparent">
                        <TableHead className="text-gray-500">Description</TableHead>
                        <TableHead className="text-gray-500">Date</TableHead>
                        <TableHead className="text-gray-500">Amount</TableHead>
                        <TableHead className="text-gray-500">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id} className="border-gray-100 hover:bg-gray-50">
                          <TableCell className="text-gray-700">{invoice.description}</TableCell>
                          <TableCell className="text-gray-700">{formatDate(invoice.create)}</TableCell>
                          <TableCell className="text-gray-700">
                            {invoice.amount_due} {invoice.currency.toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                              onClick={() => window.open(invoice.hosted_invoice_url, "_blank")}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const BillingPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillingPageComp />
    </Suspense>
  );
};

export default BillingPage;