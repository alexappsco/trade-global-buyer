'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

export type LoaderVariant = 'fullscreen' | 'section' | 'inline';

type LoaderProps = {
  variant?: LoaderVariant;
  size?: number;
  minHeight?: number | string;
  label?: string;
  color?: string;
  sx?: SxProps<Theme>;
};

const DEFAULT_COLOR = '#1E8057';
const BRAND_LOGO = '/logo_2.png';

function BrandSpinner({
  size,
  color,
  center,
}: {
  size: number;
  color: string;
  center?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <CircularProgress
        size={size}
        thickness={2.6}
        sx={{ color, position: 'absolute', opacity: 0.16 }}
      />
      <CircularProgress
        size={size}
        thickness={2.8}
        sx={{
          color,
          position: 'absolute',
          animationDuration: '0.9s',
          '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
        }}
      />
      {center}
    </Box>
  );
}

export function Loader({
  variant = 'section',
  size,
  minHeight,
  label,
  color = DEFAULT_COLOR,
  sx,
}: LoaderProps) {
  if (variant === 'inline') {
    return <CircularProgress size={size ?? 18} thickness={4.4} sx={{ color }} />;
  }

  if (variant === 'fullscreen') {
    return (
      <Box
        sx={{
          minHeight: minHeight ?? '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          bgcolor: '#F3F6F5',
          ...sx,
        }}
      >
        <BrandSpinner
          size={size ?? 84}
          color={color}
          center={
            <Box
              component="img"
              src={BRAND_LOGO}
              alt="Trade Global"
              sx={{
                width: size ? size * 0.55 : 46,
                height: size ? size * 0.55 : 46,
                borderRadius: '50%',
                objectFit: 'cover',
                bgcolor: '#ffffff',
              }}
            />
          }
        />
        {label && (
          <Typography variant="body2" sx={{ color: '#63706A', fontWeight: 600 }}>
            {label}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: minHeight ? undefined : 6,
        minHeight,
        ...sx,
      }}
    >
      <BrandSpinner size={size ?? 44} color={color} />
      {label && (
        <Typography variant="body2" sx={{ color: '#7A8882', fontWeight: 500 }}>
          {label}
        </Typography>
      )}
    </Box>
  );
}