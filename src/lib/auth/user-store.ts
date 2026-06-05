import { randomUUID, scryptSync, timingSafeEqual } from 'crypto';

export type StoredUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
};

type CreateUserInput = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

const globalStore = globalThis as typeof globalThis & {
  __bustaniyaUsers?: Map<string, StoredUser>;
};

function users(): Map<string, StoredUser> {
  if (!globalStore.__bustaniyaUsers) {
    globalStore.__bustaniyaUsers = new Map();
  }
  return globalStore.__bustaniyaUsers;
}

function hashPassword(password: string): string {
  const salt = randomUUID();
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, expectedHex] = stored.split(':');
  if (!salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  return Array.from(users().values()).find((u) => u.email === normalized);
}

export function createUser(input: CreateUserInput): StoredUser {
  const email = input.email.trim().toLowerCase();
  if (findUserByEmail(email)) {
    throw new Error('USER_EXISTS');
  }

  const user: StoredUser = {
    id: randomUUID(),
    email,
    firstName: input.firstname.trim(),
    lastName: input.lastname.trim(),
    passwordHash: hashPassword(input.password),
  };
  users().set(user.id, user);
  return user;
}

export function verifyUserCredentials(
  email: string,
  password: string,
): StoredUser | null {
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return user;
}

export function toPublicProfile(user: StoredUser) {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}
