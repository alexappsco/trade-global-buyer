'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useLocale } from 'next-intl';

import Iconify from 'src/components/iconify';
import { getLandingHero } from 'src/actions/landing';
import type { LandingHeroLocale } from 'src/types/landing';

export default function LandingHero() {
  const locale = useLocale();
  const [data, setData] = useState<LandingHeroLocale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLandingHero().then((res) => {
      if (res.success && res.data) {
        const localeKey = locale === 'ar' ? 'ar' : 'en';
        setData(res.data[localeKey]);
      }
      setLoading(false);
    });
  }, [locale]);

  return (
    <Box
      id="hero"
      sx={{
        color: '#fff',
        backgroundImage:
          'linear-gradient(rgba(26, 27, 34, 0.75), rgba(26, 27, 34, 0.55)), url(/costFRQ-Riyadh.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Custom styles to keep the graphic cards fixed regardless of text direction */}
      <style>{`
        #hero-card-1 { right: 4% !important; left: auto !important; }
        @media (min-width: 900px) { #hero-card-1 { right: 0px !important; left: auto !important; } }
        #hero-card-2 { left: 8% !important; right: auto !important; }
        @media (min-width: 900px) { #hero-card-2 { left: 40px !important; right: auto !important; } }
        #hero-card-2-stack { justify-content: flex-start !important; }
        [dir="rtl"] #hero-card-2-stack { justify-content: flex-end !important; }
      `}</style>

      <Container sx={{ py: { xs: 8, md: 10 }, px: { xs: 3, md: 10 } }}>
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          spacing={{ xs: 7, md: 5 }}
          sx={{ alignItems: 'center' }}
        >
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            {loading ? (
              <>
                <Skeleton variant="text" width="90%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }} />
                <Skeleton variant="text" width="70%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
                <Skeleton variant="text" width="100%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
                <Skeleton variant="text" width="85%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
              </>
            ) : (
              <>
                <Typography
                  variant="h1"
                  sx={{ fontSize: { xs: 32, md: 48 }, lineHeight: 1.25, color: '#fff', mb: 2 }}
                >
                  {data?.title}
                </Typography>
                <Typography sx={{ color: '#D2D6DB', fontSize: { xs: 16, md: 18 }, lineHeight: 1.8 }}>
                  {data?.description}
                </Typography>
              </>
            )}
          </Box>

          <Box
            id="hero-graphic-container"
            sx={{
              position: 'relative',
              width: { xs: '100%', md: 560 },
              height: { xs: 300, md: 460 },
              flexShrink: 0,
            }}
          >
            <Box
              style={{ position: 'absolute', left: '30px', top: '40px' }}
              sx={{
                width: 280,
                height: 280,
                borderRadius: '50%',
                bgcolor: '#1B8354',
                filter: 'blur(100px)',
                opacity: 0.45,
                zIndex: 0,
              }}
            />

            <Box
              style={{ position: 'absolute', right: '40px', bottom: '40px' }}
              sx={{
                width: 240,
                height: 240,
                borderRadius: '50%',
                bgcolor: '#DBA102',
                filter: 'blur(100px)',
                opacity: 0.35,
                zIndex: 0,
              }}
            />

            <Box
              id="hero-card-2"
              sx={{
                position: 'absolute',
                bottom: { xs: 0, md: 24 },
                width: { xs: 250, md: 280 },
                p: 3,
                borderRadius: 5,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                zIndex: 1,
              }}
            >
              <Stack
                id="hero-card-2-stack"
                dir="ltr"
                direction="row"
                spacing={1}
                sx={{ mb: 1, alignItems: 'center' }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#DBA102',
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                  {loading ? <Skeleton width={120} sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} /> : data?.verifiedSuppliersTitle}
                </Typography>
              </Stack>
              <Typography sx={{ color: '#EBEBEB', fontSize: 12, lineHeight: 1.8 }}>
                {loading ? <Skeleton width="100%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} /> : data?.verifiedSuppliersDescription}
              </Typography>
            </Box>

            <Box
              id="hero-card-1"
              dir="ltr"
              sx={{
                position: 'absolute',
                top: { xs: 0, md: 40 },
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  bgcolor: '#1B8354',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                <Iconify icon="solar:shield-check-bold" width={24} />
              </Box>

              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>
                  {loading ? <Skeleton width={80} sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} /> : data?.successfulTradesValue}
                </Typography>
                <Typography sx={{ color: '#EBEBEB', fontSize: 11, fontWeight: 500 }}>
                  {loading ? <Skeleton width={120} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} /> : data?.successfulTradesLabel}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}