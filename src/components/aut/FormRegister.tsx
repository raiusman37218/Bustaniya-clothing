import Image from 'next/image';
import { PAKISTANI_FASHION } from '@/src/data/pakistaniFashionImages';
import { Alert, Box } from '@mui/material';
import { IconButton } from '@mui/material';
import { Container } from '@mui/material';
import { Typography } from '@mui/material';
import { Stack } from '@mui/material';
import { Grid } from '@mui/material';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import FormFieldRegister from '../layout/FormFieldRegister';
import { useAuth } from '@/src/context/authContext';
import * as yup from 'yup';

interface formValue {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const validationSchema = yup.object({
  firstname: yup
    .string()
    .trim()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters long'),

  lastname: yup
    .string()
    .trim()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters long'),

  email: yup
    .string()
    .email('Email must be a valid email')
    .required('Email address is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address format'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-zA-Z0-9]{8,}/, 'Password is invalid'),
});

function FormRegister() {
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerAccount } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(validationSchema),
  });

  async function onSubmit(dataForm: formValue) {
    setSubmitError('');
    setIsSubmitting(true);
    const result = await registerAccount(dataForm);
    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error ?? 'Registration failed. Please try again.');
    }
  }

  const errorAlert = submitError ? (
    <Alert severity="error" sx={{ width: '100%' }}>
      {submitError}
    </Alert>
  ) : null;

  return (
    <>
      <Container>
        <Box
          sx={{
            mb: 10,
            mt: 5,
            display: { xs: 'none', sm: 'none', md: 'block' },
          }}
        >
          <Grid container>
            <Grid item xs={6} md={6} gap={12}>
              <Image
                width={500}
                height={600}
                alt="Create account"
                src={PAKISTANI_FASHION.login}
                style={{ objectFit: 'cover' }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Box>
                <Stack alignItems={'center'} gap={5}>
                  <Typography
                    fontWeight="600"
                    variant="h5"
                    fontFamily="inherit"
                  >
                    Create Account
                  </Typography>
                  {errorAlert}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      width: '80%',
                      flexDirection: 'column',
                    }}
                  >
                    <FormFieldRegister
                      onSubmit={handleSubmit(onSubmit)}
                      errors={errors}
                      control={control}
                      isSubmitting={isSubmitting}
                    />

                    <Box
                      sx={{
                        display: 'flex',
                        gap: '9px',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography>Already have an account? </Typography>
                      <Link href="/login" style={{ color: '#748C70' }}>
                        Log In
                      </Link>
                    </Box>
                  </Box>
                  <Typography>Or</Typography>
                  <Typography
                    sx={{
                      fontSize: '15px',
                      textAlign: 'center',
                      width: '450px',
                    }}
                  >
                    by clicking register now you agree to{' '}
                    <Link
                      href="/"
                      style={{ color: '#748C70', textDecoration: 'underline' }}
                    >
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/"
                      style={{ color: '#748C70', textDecoration: 'underline' }}
                    >
                      Privacy Policy.
                    </Link>
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Box
        sx={{
          display: { xs: 'block', sm: 'block', md: 'none' },
          pb: { xs: 3 },
        }}
      >
        <Image
          src={PAKISTANI_FASHION.login}
          width={300}
          height={400}
          style={{ objectFit: 'cover', width: '100%' }}
          alt="Create account"
        />
        <Container>
          <Stack gap={5}>
            <Typography
              fontWeight="600"
              textAlign="center"
              variant="h6"
              fontFamily="inherit"
            >
              Create Account
            </Typography>
            {errorAlert}
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                flexDirection: 'column',
              }}
            >
              <FormFieldRegister
                onSubmit={handleSubmit(onSubmit)}
                errors={errors}
                control={control}
                isSubmitting={isSubmitting}
              />

              <Box
                sx={{
                  display: 'flex',
                  gap: '9px',
                  justifyContent: 'center',
                }}
              >
                <Typography>Already have an account? </Typography>
                <Link href="/login" style={{ color: '#748C70' }}>
                  Log In
                </Link>
              </Box>
            </Box>
            <Typography textAlign={'center'}>Or</Typography>
            <Typography
              sx={{
                fontSize: '15px',
                textAlign: 'center',
                width: { md: '450px', xs: '400px' },
                margin: { xs: '0 auto' },
              }}
            >
              by clicking register now you agree to{' '}
              <Link
                href="/"
                style={{ color: '#748C70', textDecoration: 'underline' }}
              >
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link
                href="/"
                style={{ color: '#748C70', textDecoration: 'underline' }}
              >
                Privacy Policy.
              </Link>
            </Typography>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default FormRegister;
