'use client';



import React, {

  useState,

  useContext,

  PropsWithChildren,

  useEffect,

  useCallback,

  useMemo,

} from 'react';

import { useRouter } from 'next/navigation';

import { createContext } from 'react';

import { toast } from 'react-toastify';



interface FormValues {

  email: string;

  password: string;

}



export interface RegisterValues {

  firstname: string;

  lastname: string;

  email: string;

  password: string;

}



type SessionUser = {

  email: string;

  firstName: string;

  lastName: string;

};



interface AuthContextType {

  login: (dataForm: FormValues) => Promise<boolean>;

  register: (dataForm: RegisterValues) => Promise<{ ok: boolean; error?: string }>;

  errorMessage: string;

  setErrorMessage: (message: string) => void;

  isLoggedIn: boolean;

  authReady: boolean;

  logout: () => Promise<void>;

  userInfoFirstName: string;

  userInfoLastName: string;

  userInfoEmail: string;

}



const AuthContext = createContext<AuthContextType | null>(null);



function applySessionUser(

  user: SessionUser | null,

  setters: {

    setIsLoggedIn: (v: boolean) => void;

    setUserInfoFirstName: (v: string) => void;

    setUserInfoLastName: (v: string) => void;

    setUserInfoEmail: (v: string) => void;

  },

) {

  if (user) {

    setters.setIsLoggedIn(true);

    setters.setUserInfoFirstName(user.firstName);

    setters.setUserInfoLastName(user.lastName);

    setters.setUserInfoEmail(user.email);

  } else {

    setters.setIsLoggedIn(false);

    setters.setUserInfoFirstName('');

    setters.setUserInfoLastName('');

    setters.setUserInfoEmail('');

  }

}



const AuthProvider = ({ children }: PropsWithChildren) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [authReady, setAuthReady] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [userInfoFirstName, setUserInfoFirstName] = useState('');

  const [userInfoLastName, setUserInfoLastName] = useState('');

  const [userInfoEmail, setUserInfoEmail] = useState('');

  const router = useRouter();



  const setters = useMemo(

    () => ({

      setIsLoggedIn,

      setUserInfoFirstName,

      setUserInfoLastName,

      setUserInfoEmail,

    }),

    [setIsLoggedIn, setUserInfoFirstName, setUserInfoLastName, setUserInfoEmail],

  );



  const syncSession = useCallback(async () => {

    const res = await fetch('/api/auth/me', { credentials: 'include' });

    const data = await res.json().catch(() => ({}));

    applySessionUser(data.user ?? null, setters);

    return Boolean(data.user);

  }, [setters]);



  useEffect(() => {

    syncSession().finally(() => setAuthReady(true));

  }, [syncSession]);



  async function login(dataForm: FormValues): Promise<boolean> {

    try {

      const res = await fetch('/api/login', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        credentials: 'include',

        body: JSON.stringify({

          email: dataForm.email.trim(),

          password: dataForm.password,

        }),

      });



      const data = await res.json().catch(() => ({}));



      if (res.ok) {

        setErrorMessage('');

        await syncSession();

        if (data.user) {

          setUserInfoFirstName(data.user.firstName ?? '');

          setUserInfoLastName(data.user.lastName ?? '');

          setUserInfoEmail(data.user.email ?? dataForm.email.trim());

        }

        toast.success('Sign in successful');

        router.push('/shop');

        return true;

      }



      setErrorMessage(

        data.error ?? 'Password or email is incorrect. Please try again.',

      );

      return false;

    } catch {

      setErrorMessage('An error occurred. Please try again later.');

      return false;

    }

  }



  async function register(

    dataForm: RegisterValues,

  ): Promise<{ ok: boolean; error?: string }> {

    try {

      const res = await fetch('/api/register', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        credentials: 'include',

        body: JSON.stringify({

          firstname: dataForm.firstname,

          lastname: dataForm.lastname,

          email: dataForm.email.trim(),

          password: dataForm.password,

        }),

      });



      const data = await res.json().catch(() => ({}));



      if (res.ok) {

        setErrorMessage('');

        applySessionUser(null, setters);

        router.push('/login?registered=1');

        return { ok: true };

      }



      return {

        ok: false,

        error: data.error ?? 'Registration failed. Please try again.',

      };

    } catch {

      return {

        ok: false,

        error: 'Something went wrong. Please try again.',

      };

    }

  }



  async function logout() {

    try {

      await fetch('/api/logout', {

        method: 'POST',

        credentials: 'include',

      });

      applySessionUser(null, setters);

      router.push('/');

    } catch {

      setErrorMessage('Could not sign out. Please try again.');

    }

  }



  return (

    <AuthContext.Provider

      value={{

        isLoggedIn,

        authReady,

        login,

        register,

        errorMessage,

        setErrorMessage,

        logout,

        userInfoFirstName,

        userInfoLastName,

        userInfoEmail,

      }}

    >

      {children}

    </AuthContext.Provider>

  );

};



export default AuthProvider;



export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error('useAuth must be used within an AuthProvider');

  }

  return context;

};

