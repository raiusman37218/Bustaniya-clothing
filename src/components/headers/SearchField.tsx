import {
  FormControl,
  InputAdornment,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter, useSearchParams } from 'next/navigation';
import { brand, fonts } from '@/src/lib/designTokens';

export default function SearchField({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>('');
  const queryEl = searchParams.get('q') || '';

  const hanldeChangeSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim() || queryEl;
    if (!term) return;
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  return (
    <form onSubmit={hanldeChangeSearch}>
      <TextField
        defaultValue={initialQuery ?? queryEl}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        fullWidth
        variant="standard"
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: brand.muted, fontSize: 22 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiInput-root': {
            fontFamily: fonts.sans,
            fontSize: { xs: '15px', md: '16px' },
            color: brand.ink,
            pb: 1,
            '&:before': { borderBottomColor: brand.border },
            '&:hover:not(.Mui-disabled):before': { borderBottomColor: brand.muted },
            '&:after': { borderBottomColor: brand.sage },
          },
          '& .MuiInput-input': {
            pl: 0.5,
          },
        }}
      />
    </form>
  );
}
