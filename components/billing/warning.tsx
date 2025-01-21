'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WarningRibbon: React.FC<{ daysLeft: number }> = ({ daysLeft }) => {
  if (daysLeft > 7) {
    console.log('More than 7 days left, no warning displayed');
    return null; // No warning if days left > 7
  }

  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-t-0 border-b-4 px-4 py-3 sm:px-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="ml-2 text-sm font-medium sm:text-base">Warning</AlertTitle>
      <AlertDescription className="ml-2 text-sm sm:text-base">
        Your plan expires in {daysLeft} days.{' '}
        <a href="#" className="font-semibold underline hover:text-destructive-foreground">
          Renew now
        </a>{' '}
        to avoid service interruption.
      </AlertDescription>
    </Alert>
  );
};

export default WarningRibbon;