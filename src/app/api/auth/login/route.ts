import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/db';
import { encodeSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, username, password_hash, is_admin')
    .eq('username', String(username).trim())
    .single();

  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const sessionData = { userId: user.id, username: user.username, isAdmin: user.is_admin === 1 };
  const token = encodeSession(sessionData);

  return NextResponse.json({ token, userId: user.id, username: user.username });
}
