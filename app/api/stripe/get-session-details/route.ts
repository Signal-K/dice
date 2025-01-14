import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe('');

export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get('session_id');

  if (!session_id) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const line_items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });

    if (line_items.data.length === 0) {
      return NextResponse.json({ error: 'No items found in session' }, { status: 400 });
    }

    const item = line_items.data[0];
    const productData = {
      name: item.description || 'No description available',
      price: item.amount_total / 100,
    };

    return NextResponse.json({ product: productData });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Failed to retrieve session details', details: errorMessage }, { status: 500 });
  }
}