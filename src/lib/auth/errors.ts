export function mapAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('already registered') || lower.includes('already exists')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  if (lower.includes('invalid login credentials') || lower.includes('invalid email or password')) {
    return 'Invalid email or password.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Could not sign in. Please try again or contact support.';
  }
  if (lower.includes('password') && lower.includes('weak')) {
    return 'Password is too weak. Use at least 8 characters.';
  }
  if (lower.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  return message || 'Something went wrong. Please try again.';
}
