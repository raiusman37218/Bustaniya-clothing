import { mapAuthError } from '@/src/lib/auth/errors';
import { createSupabaseServerClient } from '@/src/lib/supabase/auth-server';

export type RegisterInput = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type RegisterResult =
  | { ok: true }
  | { ok: false; error: string; status: number };

export async function registerUser(
  input: RegisterInput,
): Promise<RegisterResult> {
  const email = input.email.trim().toLowerCase();

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email,
      password: input.password,
      options: {
        data: {
          first_name: input.firstname.trim(),
          last_name: input.lastname.trim(),
        },
      },
    });

    if (error) {
      const message = mapAuthError(error.message);
      const status =
        error.message.toLowerCase().includes('already') ||
        error.message.toLowerCase().includes('registered')
          ? 409
          : 400;
      return { ok: false, error: message, status };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: mapAuthError('Could not register. Please try again.'),
      status: 500,
    };
  }
}
