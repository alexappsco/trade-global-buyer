import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';

import Iconify from 'src/components/iconify';

export default function LandingServices() {
  const t = useTranslations('Landing');

  const trustItems = [
    t('services.trust.free_registration'),
    t('services.trust.no_hidden_fees'),
    t('services.trust.support_24_7'),
  ];

  return (
    <Box id="features" sx={{ bgcolor: '#fff', py: { xs: 7, md: 10 } }}>
      <Container>
        <Stack spacing={2} sx={{ mb: 5, textAlign: 'center', alignItems: 'center' }}>
          <Typography
            variant="h2"
            sx={{ color: '#1A1B22', fontSize: { xs: 28, md: 40 }, lineHeight: 1.5 }}
          >
            {t('services.title')}
          </Typography>
          <Box sx={{ width: 80, height: 4, borderRadius: 2, bgcolor: '#DBA102' }} />
          <Typography sx={{ color: '#767676', fontSize: { xs: 16, md: 20 } }}>
            {t('services.description')}
          </Typography>
        </Stack>

        <Box
          sx={{
            overflow: 'hidden',
            border: '1px solid #F0F0F0',
            borderRadius: 2,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{ minHeight: { md: 210 }, position: 'relative' }}
          >
            <Box
              sx={{
                flex: 1,
                px: { xs: 3, md: 8 },
                py: { xs: 6, md: 7 },
                textAlign: 'center',
                bgcolor: '#fff',
              }}
            >
              <Typography variant="h3" sx={{ color: '#111C2D', fontSize: { xs: 26, md: 32 } }}>
                {t('services.buyers.title')}
              </Typography>
              <Typography sx={{ color: '#5F5E5E', mt: 1, mb: 3 }}>
                {t('services.buyers.desc')}
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#108558', px: 4, py: 1.25 }}>
                {t('services.buyers.btn')}
              </Button>
            </Box>

            <Box
              sx={{
                flex: 1,
                px: { xs: 3, md: 8 },
                py: { xs: 6, md: 7 },
                textAlign: 'center',
                bgcolor: 'rgba(27,131,84,.1)',
              }}
            >
              <Typography variant="h3" sx={{ color: '#111C2D', fontSize: { xs: 26, md: 32 } }}>
                {t('services.suppliers.title')}
              </Typography>
              <Typography sx={{ color: '#5F5E5E', mt: 1, mb: 3 }}>
                {t('services.suppliers.desc')}
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#108558', px: 4, py: 1.25 }}>
                {t('services.suppliers.btn')}
              </Button>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
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
                  width: { xs: 120, md: 140 },
                  height: { xs: 120, md: 140 },
                  borderRadius: 2,
                  border: '4px solid #fff',
                  boxShadow: '0 10px 20px -3px rgba(0,0,0,.15)',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 6 }}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              borderTop: '1px solid #BDCABF',
              py: 1.5,
              bgcolor: '#fff',
              position: 'relative',
              zIndex: 3,
            }}
          >
            {trustItems.map((item) => (
              <Stack key={item} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Iconify icon="solar:check-circle-bold" width={18} sx={{ color: '#108558' }} />
                <Typography sx={{ color: '#108558', fontWeight: 600 }}>{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}