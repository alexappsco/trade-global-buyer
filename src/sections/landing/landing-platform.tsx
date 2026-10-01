'use client';

import { useRef, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  Box,
  Stack,
  Accordion,
  Container,
  Typography,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { useTranslations } from 'next-intl';

import Iconify from 'src/components/iconify';

interface CountUpProps {
  value: string;
}

function CountUp({ value }: CountUpProps) {
  const countRef = useRef<HTMLSpanElement | null>(null);
  const match = value.replace(/,/g, '').match(/\d+/);
  const targetNumber = match ? parseInt(match[0], 10) : null;
  const [displayValue, setDisplayValue] = useState(targetNumber === null ? value : '0');

  useEffect(() => {
    if (targetNumber === null) return;

    const prefix = value.startsWith('+') ? '+' : '';
    const suffix = value.split(String(targetNumber))[1] || '';

    let animationFrameId: number;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * targetNumber);

            const formatted = currentCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            setDisplayValue(`${prefix}${formatted}${suffix}`);

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(animate);
            } else {
              setDisplayValue(value);
            }
          };

          animationFrameId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetNumber, value]);

  return <span ref={countRef}>{displayValue}</span>;
}

const partners = [
  '/landing/partners/partner-1.jpg',
  '/landing/partners/partner-2.png',
  '/landing/partners/partner-3.png',
  '/landing/partners/partner-4.png',
  '/landing/partners/partner-5.png',
  '/landing/partners/partner-6.png',
  '/landing/partners/partner-7.png',
  '/landing/partners/partner-8.jpg',
];

export default function LandingPlatformSections() {
  const t = useTranslations('Landing');

  const valueCards = [
    {
      title: t('platform.cards.procurement.title'),
      description: t('platform.cards.procurement.desc'),
      icon: 'solar:clipboard-list-bold-duotone',
      highlighted: false,
    },
    {
      title: t('platform.cards.security.title'),
      description: t('platform.cards.security.desc'),
      icon: 'solar:shield-check-bold-duotone',
      highlighted: false,
    },
    {
      title: t('platform.cards.suppliers.title'),
      description: t('platform.cards.suppliers.desc'),
      icon: 'solar:users-group-rounded-bold-duotone',
      highlighted: false,
    },
    {
      title: t('platform.cards.speed.title'),
      description: t('platform.cards.speed.desc'),
      icon: 'solar:rocket-2-bold-duotone',
      highlighted: true,
    },
  ];

  const stats = [
    ['+700', t('platform.stats.labels.suppliers')],
    ['+4,000', t('platform.stats.labels.orders')],
    ['+50', t('platform.stats.labels.cities')],
    ['24/7', t('platform.stats.labels.support')],
  ];

  const questions = [
    [t('platform.faq.q1.q'), t('platform.faq.q1.a')],
    [t('platform.faq.q2.q'), t('platform.faq.q2.a')],
    [t('platform.faq.q3.q'), t('platform.faq.q3.a')],
    [t('platform.faq.q4.q'), t('platform.faq.q4.a')],
  ];

  return (
    <>
      <Box id="about" sx={{ py: { xs: 7, md: 10 }, bgcolor: '#fff' }}>
        <Container>
          <Grid container spacing={{ xs: 3, md: 5 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="h2"
                sx={{ color: '#111C2D', fontSize: { xs: 36, md: 48 }, lineHeight: 1.25 }}
              >
                {t('platform.why_title')}
                <br />
                <Box component="span" sx={{ color: '#078354' }}>
                  {t('platform.why_brand')}
                </Box>
              </Typography>
              <Typography sx={{ mt: 3, color: '#5F5E5E', fontSize: 16, lineHeight: 1.9 }}>
                {t('platform.why_description')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  gap: 4,
                  alignItems: 'start',
                }}
              >
                {valueCards.map(({ title, description, icon, highlighted }, index) => (
                  <Box
                    key={title}
                    sx={{
                      transform: { sm: index % 2 ? 'translateY(64px)' : 'none', xs: 'none' },
                    }}
                  >
                    <Box
                      sx={{
                        minHeight: { xs: 210, md: 225 },
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        bgcolor: highlighted ? '#078354' : '#fff',
                        color: highlighted ? '#fff' : '#111C2D',
                        boxShadow: highlighted
                          ? '0 4px 16px rgba(16,133,88,.2)'
                          : '0 4px 16px rgba(167,167,167,.25)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          bgcolor: highlighted ? 'rgba(255,255,255,.16)' : 'rgba(27,131,84,.1)',
                          border: highlighted
                            ? '1px solid rgba(255,255,255,.3)'
                            : '1px solid rgba(0,106,68,.1)',
                        }}
                      >
                        <Iconify
                          icon={icon}
                          width={28}
                          sx={{ color: highlighted ? '#fff' : '#108558' }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 1.5 }}>
                        {title}
                      </Typography>
                      <Typography
                        sx={{
                          color: highlighted ? 'rgba(255,255,255,.9)' : '#3E4942',
                          fontSize: 14,
                          lineHeight: 1.8,
                        }}
                      >
                        {description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 7, md: 9 }, bgcolor: '#fff' }}>
        <Container>
          <Typography variant="h3" align="center" sx={{ mb: 5, color: '#1A1B22' }}>
            {t('platform.stats.title')}
          </Typography>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {stats.map(([value, label]) => (
              <Grid size={{ xs: 6, sm: 3 }} key={label}>
                <Stack spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#1B8354', fontWeight: 700 }}>
                    <CountUp value={value} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {label}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box id="partners" sx={{ py: { xs: 7, md: 9 }, bgcolor: '#fff', overflow: 'hidden' }}>
        <Container>
          <Typography variant="h3" align="center" sx={{ mb: 5, color: '#1A1B22' }}>
            {t('platform.partners.title')}
          </Typography>
        </Container>

        <Box
          dir="ltr"
          sx={{
            overflow: 'hidden',
            width: '100%',
            display: 'flex',
            position: 'relative',
            '&:before, &:after': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: { xs: 50, md: 120 },
              zIndex: 2,
              pointerEvents: 'none',
            },
            '&:before': {
              left: 0,
              background: 'linear-gradient(to right, #fff, transparent)',
            },
            '&:after': {
              right: 0,
              background: 'linear-gradient(to left, #fff, transparent)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '24px',
              animation: 'marquee 30s linear infinite',
              '@keyframes marquee': {
                '0%': { transform: 'translateX(0px)' },
                '100%': { transform: 'translateX(-1552px)' },
              },
              '&:hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {[...partners, ...partners, ...partners, ...partners].map((logo, idx) => (
              <Box
                key={`${logo}-${idx}`}
                sx={{
                  width: 170,
                  height: 96,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: 2,
                  p: 2.5,
                }}
              >
                <Box
                  component="img"
                  src={logo}
                  alt="Customer Logo"
                  sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box id="faq" sx={{ py: { xs: 7, md: 9 }, bgcolor: '#F4F4F4' }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" sx={{ mb: 1, color: '#1A1B22' }}>
            {t('platform.faq.title')}
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
            {t('platform.faq.subtitle')}
          </Typography>
          {questions.map(([question, answer]) => (
            <Accordion key={question} disableGutters sx={{ mb: 1, bgcolor: '#fff', borderRadius: 1 }}>
              <AccordionSummary expandIcon={<Iconify icon="eva:chevron-down-fill" />}>
                <Typography sx={{ fontWeight: 600 }}>{question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>
    </>
  );
}