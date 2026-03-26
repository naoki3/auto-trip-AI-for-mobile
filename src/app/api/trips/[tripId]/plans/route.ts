import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { tripId } = await params;

  // Verify ownership
  const { data: trip } = await supabase
    .from('trips')
    .select('id')
    .eq('id', tripId)
    .eq('user_id', session.userId)
    .single();

  if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

  const { data: plans, error } = await supabase
    .from('plans')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ plans: plans ?? [] });
}
