'use client';

import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { alpha } from '@mui/material/styles';
import { useTranslations, useLocale } from 'next-intl';

import { Link } from 'src/i18n/routing';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import LandingHeader from 'src/sections/landing/landing-header';
import LandingFooter from 'src/sections/landing/landing-footer';
import { getStaticPage } from 'src/actions/pages';
import type { StaticPage } from 'src/types/pages';

interface StaticPageViewProps {
  slug: string;
  initialData?: StaticPage | null;
}

const TABS = [
  { slug: 'about-us', href: paths.pages.aboutUs, key: 'about_us', icon: 'solar:buildings-bold-duotone' },
  { slug: 'terms-and-conditions', href: paths.pages.termsAndConditions, key: 'terms', icon: 'solar:document-text-bold-duotone' },
  { slug: 'privacy-policy', href: paths.pages.privacyPolicy, key: 'privacy', icon: 'solar:shield-check-bold-duotone' },
  { slug: 'platform-policy', href: paths.pages.platformPolicy, key: 'platform_policy', icon: 'solar:hand-shake-bold-duotone' },
];

export default function StaticPageView({ slug, initialData }: StaticPageViewProps) {
  const t = useTranslations('StaticPages');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [pageData, setPageData] = useState<StaticPage | null>(initialData ?? null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStaticPage(slug);
      if (res.success && res.data) {
        setPageData(res.data);
      } else {
        const errMsg = 'error' in res && typeof res.error === 'string' ? res.error : 'Failed to load page';
        setError(errMsg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching page');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!initialData) {
      fetchPage();
    } else {
      setPageData(initialData);
    }
  }, [slug, initialData, fetchPage]);

  const activeTab = TABS.find((tab) => tab.slug === slug);
  const fallbackTitle = activeTab ? t(`tabs.${activeTab.key}`) : slug;
  const title = (isRtl ? pageData?.titleAr : pageData?.titleEn) || pageData?.titleAr || pageData?.titleEn || fallbackTitle;

  const content = pageData
    ? (isRtl ? pageData.contentAr : pageData.contentEn) || pageData.contentAr || pageData.contentEn
    : '';

  const formattedDate = (() => {
    if (!pageData?.lastModificationTime) return null;
    try {
      const date = new Date(pageData.lastModificationTime);
      return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return pageData.lastModificationTime;
    }
  })();

  const brandGreen = '#006838';

  return (
    <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingHeader />

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="md">
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<Iconify icon={isRtl ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} width={14} />}
            sx={{ mb: 3, fontSize: 14, color: 'text.secondary' }}
          >
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': { color: brandGreen },
                }}
              >
                <Iconify icon="solar:home-2-bold" width={16} />
                {t('back_to_home')}
              </Box>
            </Link>
            <Typography variant="body2" sx={{ color: brandGreen, fontWeight: 700 }}>
              {title}
            </Typography>
          </Breadcrumbs>

          {/* Clean Tabs Switcher */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: 'auto',
              pb: 1.5,
              mb: 4,
              '::-webkit-scrollbar': { height: 4 },
              '::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 2 },
            }}
          >
            {TABS.map((tab) => {
              const active = tab.slug === slug;
              return (
                <Link key={tab.slug} href={tab.href} style={{ textDecoration: 'none' }}>
                  <Button
                    variant={active ? 'contained' : 'outlined'}
                    sx={{
                      borderRadius: 2.5,
                      px: 2.5,
                      py: 0.9,
                      gap: 2,
                      whiteSpace: 'nowrap',
                      fontWeight: active ? 700 : 500,
                      textTransform: 'none',
                      bgcolor: active ? brandGreen : '#fff',
                      color: active ? '#fff' : 'text.primary',
                      borderColor: active ? brandGreen : '#E5E7EB',
                      boxShadow: active ? `0 4px 12px ${alpha(brandGreen, 0.2)}` : 'none',
                      '&:hover': {
                        bgcolor: active ? '#00532c' : alpha(brandGreen, 0.05),
                        borderColor: brandGreen,
                      },
                    }}
                  >
                    <Iconify icon={tab.icon} width={18} />
                    {t(`tabs.${tab.key}`)}
                  </Button>
                </Link>
              );
            })}
          </Stack>

          {/* Main Content Card */}
          <Card
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.03)',
              border: '1px solid #E5E7EB',
              bgcolor: '#fff',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: '#111827',
                fontWeight: 800,
                fontSize: { xs: 24, sm: 28, md: 32 },
                lineHeight: 1.3,
                mb: formattedDate ? 1.5 : 3,
              }}
            >
              {loading ? <Skeleton width={220} /> : title}
            </Typography>

            {formattedDate && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', color: '#6B7280', fontSize: 13, mb: 3 }}
              >
                <Iconify icon="solar:calendar-date-bold" width={16} color={brandGreen} />
                <span>{t('last_updated', { date: formattedDate })}</span>
              </Stack>
            )}

            <Divider sx={{ mb: 4, borderColor: '#F3F4F6' }} />

            {/* Content Body */}
            {loading ? (
              <Stack spacing={2}>
                <Skeleton variant="text" width="100%" height={26} />
                <Skeleton variant="text" width="95%" height={26} />
                <Skeleton variant="text" width="80%" height={26} />
                <Skeleton variant="text" width="60%" height={26} />
              </Stack>
            ) : error ? (
              <Box sx={{ p: 4, bgcolor: '#FEF2F2', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: '#DC2626', mb: 2, fontWeight: 500 }}>
                  {t('error_loading')}
                </Typography>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={fetchPage}
                  sx={{ bgcolor: brandGreen, '&:hover': { bgcolor: '#00532c' } }}
                >
                  {t('retry')}
                </Button>
              </Box>
            ) : (
              <Box sx={{ minHeight: 160 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#1F2937',
                    fontSize: { xs: 16, md: 17 },
                    lineHeight: 2,
                    fontWeight: 400,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {content || '—'}
                </Typography>
              </Box>
            )}
          </Card>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}
