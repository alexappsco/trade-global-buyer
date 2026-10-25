'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTranslations, useLocale } from 'next-intl';

import { useRouter } from 'src/i18n/routing';
import { useAuth } from 'src/contexts/AuthContext';
import Iconify from 'src/components/iconify';
import LandingRoleDialog, { type LandingUserRole } from './landing-role-dialog';

export default function LandingServices() {
  const t = useTranslations('Landing');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();
  const { isAuthenticated, logout, role: sessionRole } = useAuth();

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    target: LandingUserRole;
  }>({ open: false, target: 'buyer' });

  const handleRoleCta = (target: LandingUserRole) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?role=${target}`);
      return;
    }

    if (sessionRole === target) {
      router.push('/');
      return;
    }

    setDialogState({ open: true, target });
  };

  const handleGoHome = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
    router.push('/');
  };

  const handleSwitchRole = async () => {
    const target = dialogState.target;
    setDialogState((prev) => ({ ...prev, open: false }));
    await logout();
    router.push(`/auth/login?role=${target}`);
  };

  const trustItems = [
    t('services.trust.free_registration'),
    t('services.trust.no_hidden_fees'),
    t('services.trust.support_24_7'),
  ];

  const arrowIcon = isRtl ? 'solar:arrow-left-linear' : 'solar:arrow-right-linear';

  return (
    <Box
      id="features"
      component="section"
      sx={{
        bgcolor: '#FFFFFF',
        py: { xs: 6, sm: 8, md: 11 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1280px',
          height: '100%',
          background:
            'radial-gradient(ellipse 70% 30% at 50% 0%, rgba(16, 133, 88, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Section Header */}
        <Stack
          spacing={{ xs: 1.5, md: 2 }}
          sx={{ mb: { xs: 4, sm: 5, md: 7 }, textAlign: 'center', alignItems: 'center' }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#0F172A',
              fontWeight: 800,
              fontSize: { xs: '1.5rem', sm: '2.1rem', md: '2.5rem' },
              lineHeight: { xs: 1.35, md: 1.3 },
              letterSpacing: '-0.02em',
              maxWidth: 720,
            }}
          >
            {t('services.title')}
          </Typography>

          <Box
            sx={{
              width: { xs: 64, md: 80 },
              height: 4,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #DBA102 0%, #F5C544 100%)',
            }}
          />

          <Typography
            sx={{
              color: '#64748B',
              fontSize: { xs: 14.5, sm: 16.5, md: 18 },
              lineHeight: 1.7,
              maxWidth: 680,
              pt: 0.5,
            }}
          >
            {t('services.description')}
          </Typography>
        </Stack>

        {/* Dual Role Card Container */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: { xs: 3.5, sm: 4 },
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            boxShadow: {
              xs: '0 8px 25px -5px rgba(0, 0, 0, 0.06)',
              md: '0 20px 45px -10px rgba(0, 0, 0, 0.08)',
            },
            overflow: 'hidden',
          }}
        >
          {/* Main Dual Card Row (Row on tablet sm+ and desktop md+, column on mobile xs) */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              position: 'relative',
              alignItems: 'stretch',
              minHeight: { sm: 280, md: 320 },
            }}
          >
            {/* Buyers Card */}
            <Box
              sx={{
                flex: 1,
                px: { xs: 3, sm: 3.5, md: 7 },
                py: { xs: 4.5, sm: 5, md: 6.5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                bgcolor: '#FFFFFF',
                position: 'relative',
                transition: 'background-color 0.25s ease',
                '&:hover': {
                  bgcolor: 'rgba(16, 133, 88, 0.015)',
                },
              }}
            >
              {/* Buyer Icon */}
              <Box
                sx={{
                  width: { xs: 46, md: 52 },
                  height: { xs: 46, md: 52 },
                  borderRadius: 2.5,
                  bgcolor: 'rgba(16, 133, 88, 0.1)',
                  color: '#108558',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: { xs: 1.75, md: 2.25 },
                  boxShadow: '0 4px 12px rgba(16, 133, 88, 0.1)',
                }}
              >
                <Iconify icon="solar:cart-large-4-bold-duotone" width={26} />
              </Box>

              <Typography
                variant="h3"
                sx={{
                  color: '#0F172A',
                  fontSize: { xs: 22, sm: 24, md: 30 },
                  fontWeight: 800,
                  mb: 1,
                }}
              >
                {t('services.buyers.title')}
              </Typography>

              <Typography
                sx={{
                  color: '#64748B',
                  fontSize: { xs: 14.5, sm: 15, md: 16 },
                  lineHeight: 1.65,
                  mb: { xs: 3, md: 3.5 },
                  maxWidth: { xs: 280, sm: 260, md: 340 },
                }}
              >
                {t('services.buyers.desc')}
              </Typography>

              <Box sx={{ mt: 'auto', width: { xs: '100%', sm: 'auto' } }}>
                <Button
                  variant="contained"
                  onClick={() => handleRoleCta('buyer')}
                  sx={{
                    width: { xs: '50%', sm: 170, md: 200 },
                    minHeight: 46,
                    bgcolor: '#108558',
                    gap: 1,
                    color: '#FFFFFF',
                    fontSize: { xs: 14.5, md: 15 },
                    fontWeight: 700,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(16, 133, 88, 0.28)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: '#0D6F49',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 18px rgba(16, 133, 88, 0.38)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {t('services.buyers.btn')}
                </Button>
              </Box>
            </Box>

            {/* Mobile Visual Bridge (Visible only on xs) */}
            <Box
              sx={{
                display: { xs: 'flex', sm: 'none' },
                alignItems: 'center',
                justifyContent: 'center',
                py: 1,
                position: 'relative',
                bgcolor: 'rgba(27, 131, 84, 0.05)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 24,
                  right: 24,
                  top: '50%',
                  height: '1px',
                  bgcolor: '#E2E8F0',
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  p: 0.5,
                  borderRadius: 3,
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src="/landing/services.jpg"
                  alt="Services"
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2.5,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
            </Box>

            {/* Center Floating Medallion (Visible on tablet sm & desktop md+) */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Box
                sx={{
                  // p: 0.20,
                  borderRadius: { sm: 3, md: 3.5 },
                  bgcolor: '#FFFFFF',
                  border: '4px solid #FFFFFF',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.06)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <Box
                  component="img"
                  src="/landing/services.jpg"
                  alt="Services"
                  sx={{
                    width: { sm: 100, md: 136 },
                    height: { sm: 100, md: 136 },
                    borderRadius: { sm: 2.5, md: 3 },
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
            </Box>

            {/* Suppliers Card */}
            <Box
              sx={{
                flex: 1,
                px: { xs: 3, sm: 3.5, md: 7 },
                py: { xs: 4.5, sm: 5, md: 6.5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                bgcolor: 'rgba(27, 131, 84, 0.05)',
                borderLeft: { sm: isRtl ? 'none' : '1px solid #E2E8F0' },
                borderRight: { sm: isRtl ? '1px solid #E2E8F0' : 'none' },
                position: 'relative',
                transition: 'background-color 0.25s ease',
                '&:hover': {
                  bgcolor: 'rgba(27, 131, 84, 0.08)',
                },
              }}
            >
              {/* Supplier Icon */}
              <Box
                sx={{
                  width: { xs: 46, md: 52 },
                  height: { xs: 46, md: 52 },
                  borderRadius: 2.5,
                  bgcolor: 'rgba(219, 161, 2, 0.15)',
                  color: '#B38100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: { xs: 1.75, md: 2.25 },
                  boxShadow: '0 4px 12px rgba(219, 161, 2, 0.12)',
                }}
              >
                <Iconify icon="solar:shop-2-bold-duotone" width={26} />
              </Box>

              <Typography
                variant="h3"
                sx={{
                  color: '#0F172A',
                  fontSize: { xs: 22, sm: 24, md: 30 },
                  fontWeight: 800,
                  mb: 1,
                }}
              >
                {t('services.suppliers.title')}
              </Typography>

              <Typography
                sx={{
                  color: '#64748B',
                  fontSize: { xs: 14.5, sm: 15, md: 16 },
                  lineHeight: 1.65,
                  mb: { xs: 3, md: 3.5 },
                  maxWidth: { xs: 280, sm: 260, md: 340 },
                }}
              >
                {t('services.suppliers.desc')}
              </Typography>

              <Box sx={{ mt: 'auto', width: { xs: '100%', sm: 'auto' } }}>
                <Button
                  variant="contained"
                  onClick={() => handleRoleCta('supplier')}
                  sx={{
                    width: { xs: '50%', sm: 170, md: 200 },
                    minHeight: 46,
                    bgcolor: '#108558',
                    gap: 1,
                    color: '#FFFFFF',
                    fontSize: { xs: 14.5, md: 15 },
                    fontWeight: 700,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(16, 133, 88, 0.28)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: '#0D6F49',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 18px rgba(16, 133, 88, 0.38)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {t('services.suppliers.btn')}
                </Button>
              </Box>
            </Box>
          </Stack>

          {/* Trust Guarantees Bar */}
          <Box
            sx={{
              borderTop: '1px solid #E2E8F0',
              bgcolor: '#FBFDFB',
              py: { xs: 2.25, sm: 2 },
              px: { xs: 2, sm: 3, md: 4 },
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.25, sm: 4, md: 6 }}
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                rowGap: 1.25,
              }}
            >
              {trustItems.map((item) => (
                <Box
                  key={item}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.25,
                    px: { xs: 2, sm: 0 },
                    py: { xs: 1, sm: 0 },
                    borderRadius: { xs: 2, sm: 0 },
                    bgcolor: { xs: '#FFFFFF', sm: 'transparent' },
                    border: { xs: '1px solid #E2E8F0', sm: 'none' },
                    boxShadow: { xs: '0 2px 6px rgba(0, 0, 0, 0.03)', sm: 'none' },
                    width: { xs: '100%', sm: 'auto' },
                    justifyContent: { xs: 'center', sm: 'center' },
                  }}
                >
                  <Iconify icon="solar:check-circle-bold" width={18} sx={{ color: '#108558', flexShrink: 0 }} />
                  <Typography
                    sx={{
                      color: '#1E293B',
                      fontSize: { xs: 13.5, sm: 14, md: 15 },
                      fontWeight: 600,
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Role Dialog */}
      <LandingRoleDialog
        open={dialogState.open}
        currentRole={(sessionRole ?? 'buyer') as LandingUserRole}
        targetRole={dialogState.target}
        onClose={() => setDialogState((prev) => ({ ...prev, open: false }))}
        onGoHome={handleGoHome}
        onSwitchRole={handleSwitchRole}
      />
    </Box>
  );
}