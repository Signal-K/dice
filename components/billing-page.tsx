import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, ArrowUpRight } from 'lucide-react'
import { Sidebar } from "./sidebar"

export default function BillingPage() {
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
              {/* Current Plan */}
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

              {/* Payment Method */}
              <Card className="border border-gray-100 bg-gray-50/50 shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Image
                      src="/placeholder.svg"
                      alt="Mastercard"
                      width={32}
                      height={20}
                      className="h-5 w-8"
                    />
                    <div className="grid gap-1">
                      <p className="text-sm text-gray-500">Card number</p>
                      <p className="font-medium">•••• •••• •••• 4454</p>
                      <p className="text-sm text-gray-500">05/2027</p>
                    </div>
                  </div>
                  <Button 
                    variant="link" 
                    className="mt-4 h-auto p-0 text-gray-500 hover:text-gray-600"
                  >
                    Update Payment Method
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Billing History */}
            <Card className="border border-gray-100 bg-gray-50/50 shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Billing History</CardTitle>
              </CardHeader>
              <CardContent>
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
                    {[
                      { id: 1, description: "Team Plan - July 2024", date: "July 28, 2024", amount: "$275.00" },
                      { id: 2, description: "Team Plan - June 2024", date: "July 28, 2024", amount: "$275.00" },
                      { id: 3, description: "Team Plan - April 2024", date: "July 28, 2024", amount: "$275.00" },
                    ].map((invoice) => (
                      <TableRow key={invoice.id} className="border-gray-100 hover:bg-gray-50">
                        <TableCell className="text-gray-700">{invoice.description}</TableCell>
                        <TableCell className="text-gray-500">{invoice.date}</TableCell>
                        <TableCell className="text-gray-700">{invoice.amount}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Auto-renewal Notice */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50/50 p-4">
              <p className="text-sm text-gray-500">
                Your subscription is set to auto-renew in 12 days.
              </p>
              <Button 
                variant="destructive" 
                size="sm"
                className="bg-red-500 text-sm hover:bg-red-600"
              >
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};