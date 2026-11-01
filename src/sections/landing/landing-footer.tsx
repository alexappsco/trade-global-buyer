'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';

import Iconify from 'src/components/iconify';
import { Link } from 'src/i18n/routing';
import { paths } from 'src/routes/paths';

const socials = [
  {
    value: 'x',
    icon: 'ri:twitter-x-fill',
    color: '#000000',
    href: 'https://x.com/costfrq?s=11&t=Vo9v9D_ZXeqHbjiIhM40fA',
  },
  {
    value: 'linkedin',
    icon: 'mdi:linkedin',
    color: '#0077B5',
    href: 'http://www.linkedin.com/in/costfrq-b2b-142624417',
  },
  {
    value: 'tiktok',
    icon: 'ic:baseline-tiktok',
    color: '#000000',
    href: 'https://www.tiktok.com/@costfrq',
  },
];

const contactEmail = 'info@costfrq.sa';

const linkSx = {
  fontSize: 14,
  color: '#5F5E5E',
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'inline-block',
  transition: 'color 0.2s',
  '&:hover': { color: '#108558' },
} as const;

export default function LandingFooter() {
  const t = useTranslations('Landing');

  const handleAnchorClick = (e: React.MouseEvent, id: string) => {
    const element = document.getElementById(id);
    if (element) {
      e.preventDefault();
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

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
            flexWrap: 'wrap',
            px: 4,
          }}
        >
          <Box
            component="a"
            href="/"
            onClick={(e) => handleAnchorClick(e, 'hero')}
            sx={{ display: 'inline-flex', cursor: 'pointer', textDecoration: 'none' }}
          >
            <Box
              component="img"
              src="/frq_logo.svg"
              alt="COST FRQ Logo"
              sx={{ height: { xs: 48, md: 60 }, width: 'auto', objectFit: 'contain' }}
            />
          </Box>

          <Stack spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              component="img"
              src="/public.avif"
              alt="COST FRQ"
              sx={{ height: { xs: 40, md: 48 }, width: 'auto', objectFit: 'contain' }}
            />
            <Typography sx={{ fontWeight: 700, textAlign: 'center', color: '#1A1B22' }}>
              7054959049
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center'}}
          >
            {/* <Box
              component="a"
              href={`mailto:${contactEmail}`}
              aria-label={contactEmail}
              sx={{ ...linkSx, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <Iconify icon="mdi:email-outline" width={20} />
              {contactEmail}
            </Box> */}
            {socials.map((social) => (
              <IconButton
                key={social.value}
                component="a"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.value}
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
              <Link href={paths.pages.aboutUs} style={{ textDecoration: 'none' }}>
                <Box component="span" sx={linkSx}>{t('footer.company.about')}</Box>
              </Link>
              <Box component="a" href="/#how-it-works" onClick={(e) => handleAnchorClick(e, 'how-it-works')} sx={linkSx}>{t('footer.company.how_it_works')}</Box>
              <Box component="a" href={`mailto:${contactEmail}`} sx={linkSx}>{t('footer.company.contact')}</Box>
              <Box component="a" href="/#features" onClick={(e) => handleAnchorClick(e, 'features')} sx={linkSx}>{t('footer.company.join_supplier')}</Box>
              <Box component="a" href="/#features" onClick={(e) => handleAnchorClick(e, 'features')} sx={linkSx}>{t('footer.company.join_merchant')}</Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="h6" sx={{ color: '#1A1B22', fontWeight: 700, mb: 3 }}>
              {t('footer.services.title')}
            </Typography>
            <Stack spacing={1.5}>
              <Box component="a" href="/#features" onClick={(e) => handleAnchorClick(e, 'features')} sx={linkSx}>{t('footer.services.new_rfq')}</Box>
              <Box component="a" href="/#features" onClick={(e) => handleAnchorClick(e, 'features')} sx={linkSx}>{t('footer.services.receive_quotes')}</Box>
              <Box component="a" href="/#features" onClick={(e) => handleAnchorClick(e, 'features')} sx={linkSx}>{t('footer.services.corporate_requests')}</Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="h6" sx={{ color: '#1A1B22', fontWeight: 700, mb: 3 }}>
              {t('footer.support.title')}
            </Typography>
            <Stack spacing={1.5}>
              <Link href={paths.pages.termsAndConditions} style={{ textDecoration: 'none' }}>
                <Box component="span" sx={linkSx}>{t('footer.support.terms')}</Box>
              </Link>
              <Link href={paths.pages.privacyPolicy} style={{ textDecoration: 'none' }}>
                <Box component="span" sx={linkSx}>{t('footer.support.privacy')}</Box>
              </Link>
              <Link href={paths.pages.platformPolicy} style={{ textDecoration: 'none' }}>
                <Box component="span" sx={linkSx}>{t('footer.support.platform_policy')}</Box>
              </Link>
              <Box component="a" href="/#faq" onClick={(e) => handleAnchorClick(e, 'faq')} sx={linkSx}>{t('footer.support.faq')}</Box>
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
                component="a"
                href={`mailto:${contactEmail}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: '#fff',
                  borderRadius: 1,
                  p: 1,
                  mb: 2,
                  border: '1px solid #E2E8F0',
                  color: '#000',
                  textDecoration: 'none',
                  '&:hover': { bgcolor: '#F5F7FA' },
                }}
              >
                <Typography component="span" sx={{ px: 0.5, fontSize: 14 }}>
                  {contactEmail}
                </Typography>
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    display: 'inline-flex',
                    bgcolor: '#0A84FF',
                    color: '#fff',
                    borderRadius: 1,
                    p: 1,
                    '&:hover': { bgcolor: '#0066CC' },
                  }}
                >
                  <Iconify icon="eva:arrow-forward-fill" width={18} />
                </Box>
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
            © 2026 COST FRQ. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
