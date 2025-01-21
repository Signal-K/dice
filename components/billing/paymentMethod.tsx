import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default function PaymentMethod() {
    return (
        <Card className="border border-gray-100 bg-gray-50/50 shadow-none">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4">
                    <Image
                        src="/placeholder.svg"
                        alt="Mastercard/Visa"
                        width={32}
                        height={20}
                        className="h-5 w-8"
                    />
                    <div className="grid gap-1">
                        <p className="text-sm text-gray-500">Card number</p>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">06/2069</p>
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
    );
};