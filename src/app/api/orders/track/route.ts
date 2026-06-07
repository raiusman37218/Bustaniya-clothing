import { NextRequest, NextResponse } from 'next/server';
import { trackSupabaseOrder } from '@/src/lib/orders/supabase-store';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    if (!orderNumber?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Please provide both order number and email.' },
        { status: 400 },
      );
    }

    const order = await trackSupabaseOrder(orderNumber, email);
    if (!order) {
      return NextResponse.json(
        { error: 'No order found with the provided details.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('GET /api/orders/track:', err);
    return NextResponse.json(
      { error: 'Could not track order. Please try again later.' },
      { status: 500 },
    );
  }
}
