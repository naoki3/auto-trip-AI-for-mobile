import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/db';
import { encodeSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  const usernameStr = String(username ?? '').trim();
  const passwordStr = String(password ?? '');

  if (usernameStr.length < 2) {
    return NextResponse.json({ error: 'Username must be at least 2 characters' }, { status: 400 });
  }
  if (passwordStr.length < 4) {
    return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
  }

  const { data: exists } = await supabase
    .from('users')
    .select('id')
    .eq('username', usernameStr)
    .single();

  if (exists) {
    return NextResponse.json({ error: 'That username is already taken' }, { status: 409 });
  }

  const hash = bcrypt.hashSync(passwordStr, 10);
  const id = crypto.randomUUID();

  const { error } = await supabase.from('users').insert({
    id,
    username: usernameStr,
    password_hash: hash,
    is_admin: 0,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }

  const sessionData = { userId: id, username: usernameStr, isAdmin: false };
  const token = encodeSession(sessionData);

  return NextResponse.json({ token, userId: id, username: usernameStr }, { status: 201 });
}
