import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';

import Iconify from 'src/components/iconify';

const socials = [
  { value: 'instagram', icon: 'mdi:instagram', color: '#E1306C' },
  { value: 'linkedin', icon: 'mdi:linkedin', color: '#0077B5' },
  { value: 'x', icon: 'ri:twitter-x-fill', color: '#000000' },
];

const linkSx = {
  fontSize: 14,
  color: '#5F5E5E',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'color 0.2s',
  '&:hover': { color: '#108558' },
} as const;

export default function LandingFooter() {
  const t = useTranslations('Landing');

  return (
    <Box
      component="footer"
      sx={{ py: { xs: 6, md: 8 }, bgcolor: '#fff', color: '#1A1B22', borderTop: '1px solid #E8ECEB' }}
    >
      <Container>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{
            pb: 5,
            borderBottom: '1px solid #E8ECEB',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src="/landing/logo.png"
            alt="TradeGlobal Logo"
            sx={{ height: { xs: 48, md: 60 }, width: 'auto', objectFit: 'contain' }}
          />

          <Stack direction="row" spacing={1.5}>
            {socials.map((social) => (
              <IconButton
                key={social.value}
                component="a"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: 'rgba(0,0,0,0.04)',
                  color: social.color,
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
                }}
              >
                <Iconify icon={social.icon} width={24} />
              </IconButton>
            ))}
          </Stack>
        </Stack>

        <Grid container spacing={4} sx={{ pt: 6, pb: 4 }}>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Typography variant="h6" sx={{ color: '#1A1B22', fontWeight: 700, mb: 3 }}>
              {t('footer.company.title')}
            </Typography>
            <Stack spacing={1.5}>
              <Box component="a" href="#about" sx={linkSx}>{t('footer.company.about')}</Box>
              <Box component="a" href="#how-it-works" sx={linkSx}>{t('footer.company.how_it_works')}</Box>
              <Box component="a" href="#faq" sx={linkSx}>{t('footer.company.contact')}</Box>
              <Box component="a" href="#features" sx={linkSx}>{t('footer.company.join_supplier')}</Box>
              <Box component="a" href="#features" sx={linkSx}>{t('footer.company.join_merchant')}</Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="h6" sx={{ color: '#1A1B22', fontWeight: 700, mb: 3 }}>
              {t('footer.services.title')}
            </Typography>
            <Stack spacing={1.5}>
              <Box component="a" href="#features" sx={linkSx}>{t('footer.services.new_rfq')}</Box>
              <Box component="a" href="#features" sx={linkSx}>{t('footer.services.receive_quotes')}</Box>
              <Box component="a" href="#features" sx={linkSx}>{t('footer.services.corporate_requests')}</Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="h6" sx={{ color: '#1A1B22', fontWeight: 700, mb: 3 }}>
              {t('footer.support.title')}
            </Typography>
            <Stack spacing={1.5}>
              <Box component="a" href="#faq" sx={linkSx}>{t('footer.support.terms')}</Box>
              <Box component="a" href="#faq" sx={linkSx}>{t('footer.support.privacy')}</Box>
              <Box component="a" href="#faq" sx={linkSx}>{t('footer.support.cookies')}</Box>
              <Box component="a" href="#faq" sx={linkSx}>{t('footer.support.faq')}</Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#161B26',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
                {t('footer.subscribe.title')}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#fff',
                  borderRadius: 1,
                  overflow: 'hidden',
                  p: 0.5,
                  mb: 2,
                  border: '1px solid #E2E8F0',
                }}
              >
                <Box
                  component="input"
                  type="email"
                  placeholder={t('footer.subscribe.placeholder')}
                  sx={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    px: 1.5,
                    py: 1,
                    fontSize: 14,
                    color: '#000',
                    '&::placeholder': { color: '#8E8E93' },
                  }}
                />
                <IconButton sx={{ bgcolor: '#0A84FF', color: '#fff', borderRadius: 1, p: 1, '&:hover': { bgcolor: '#0066CC' } }}>
                  <Iconify icon="eva:arrow-forward-fill" width={18} />
                </IconButton>
              </Box>

              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6 }}>
                {t('footer.subscribe.description')}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#E8ECEB' }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="caption" sx={{ color: '#8E8E93' }}>
            © 2026 Trade Global. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}