import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/src/lib/auth/register-user';

export async function POST(req: NextRequest) {
  try {
    const { firstname, lastname, email, password } = (await req.json()) as {
      firstname?: string;
      lastname?: string;
      email?: string;
      password?: string;
    };

    if (!firstname?.trim() || !lastname?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 },
      );
    }

    const result = await registerUser({
      firstname,
      lastname,
      email,
      password,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(
      { message: 'Account created. Please sign in.' },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Could not register. Please try again.' },
      { status: 500 },
    );
  }
}
