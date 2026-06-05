/** Shared landing / storefront visual tokens (Bustaniya) */

export const brand = {
  sage: '#5A6D57',
  sageLight: '#748C70',
  sageMuted: '#8fa38c',
  ink: '#111111',
  charcoal: '#2a2a2a',
  muted: '#6b6b6b',
  border: '#e8e8e8',
  surface: '#fafafa',
  white: '#ffffff',
  imageBg: '#f3f3f3',
} as const;

export const fonts = {
  sans: "'Inter', 'Montserrat', system-ui, sans-serif",
  display: "'Cormorant Garamond', Georgia, serif",
} as const;

export const radius = {
  button: '2px',
  product: '8px',
  editorial: '12px',
} as const;

export const shadows = {
  card: '0 2px 20px rgba(0,0,0,0.06)',
  cardHover: '0 10px 36px rgba(0,0,0,0.1)',
  section: '0 20px 64px rgba(0,0,0,0.06)',
} as const;

export const sectionSpacing = {
  py: { xs: 5, md: 7 },
  pyCompact: { xs: 3, md: 5 },
  gap: { xs: 4, md: 6 },
} as const;

export const containerPadding = {
  px: { xs: 2, sm: 3, md: 4 },
} as const;

/** Nav / promo bar — matches SectionContainer horizontal rhythm */
export const navBar = {
  height: { xs: 64, md: 76 },
  inner: {
    maxWidth: 'xl',
    mx: 'auto',
    width: '100%',
    ...containerPadding,
  },
} as const;

export const imageHover = {
  transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
  hoverScale: 1.04,
} as const;

export const gradients = {
  imageBottom:
    'linear-gradient(180deg, transparent 42%, rgba(0,0,0,0.52) 100%)',
  imageBottomStrong:
    'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.58) 100%)',
  sustainability:
    'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 52%, transparent 100%)',
} as const;
