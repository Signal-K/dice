import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51OoZttBTr6htJNMLfQTJv8IvKT5vdbtbtg9GPPp9BlgmFNEmQMUANsPgMOPJTWRFOrQHF6qXCcWKCb65KQdY3Nfp00EXEf5ZNP');

export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get('session_id');
  console.log("Received session_id:", session_id);

  if (!session_id) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session.payment_intent) {
      return NextResponse.json({ error: 'Payment intent not found in session' }, { status: 400 });
    }

    const paymentIntentId = session.payment_intent as string;
    const charges = await stripe.charges.list({ payment_intent: paymentIntentId });

    if (charges.data.length === 0) {
      return NextResponse.json({ error: 'No charges found for this payment intent' }, { status: 400 });
    }

    const charge = charges.data[0];
    const last4 = charge?.payment_method_details?.card?.last4 || 'N/A';

    const line_items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });

    if (line_items.data.length === 0) {
      return NextResponse.json({ error: 'No items found in session' }, { status: 400 });
    }

    const item = line_items.data[0];
    const productData = {
      name: item.description || 'No description available',
      price: item.amount_total / 100,
      last4: last4,
    };

    return NextResponse.json({ product: productData });
  } catch (error) {
    console.error('Error fetching session details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Failed to retrieve session details', details: errorMessage }, { status: 500 });
  }
}