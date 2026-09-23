'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'src/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import {
  Box,
  Card,
  Avatar,
  Typography,
  Button,
  Container,
  Stack,
  Badge,
  Alert,
  Dialog,
  Grid,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import MonitorOutlinedIcon from '@mui/icons-material/MonitorOutlined';
import CardTravelOutlinedIcon from '@mui/icons-material/CardTravelOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { useToast } from 'src/components/toast';
import { Loader } from 'src/components/Loader/Loader';
import { getCounterpartyDetails } from 'src/actions/orders';
import type { CounterpartyProfile } from 'src/types/order';

function getInitials(name?: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

const coverFallback =
  'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop")';

interface Props {
  orderId: string;
  offerId?: string;
  from?: 'supplier' | 'buyer';
}

export default function CounterpartyProfileView({ orderId, offerId, from }: Props) {
  const router = useRouter();
  const t = useTranslations('Profile');
  const locale = useLocale();
  const toast = useToast();

  const [profile, setProfile] = useState<CounterpartyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      const res = await getCounterpartyDetails(orderId);
      if (!res.success) {
        setError(res.error ?? t('load_error'));
        setIsLoading(false);
        return;
      }
      setProfile(res.data);
      setIsLoading(false);
    };
    loadProfile();
  }, [orderId, t]);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    const res = await getCounterpartyDetails(orderId);
    if (!res.success) {
      toast.error(res.error ?? t('load_error'));
      setIsLoading(false);
      return;
    }
    setProfile(res.data);
    setIsLoading(false);
  };

  const handleBack = () => {
    if (offerId) {
      if (from === 'supplier') {
        router.push(`/orders/${orderId}/${offerId}?role=supplier`);
      } else {
        router.push(`/orders/${orderId}/${offerId}`);
      }
    } else {
      router.push(`/orders/${orderId}`);
    }
  };

  if (isLoading) {
    return <Loader variant="fullscreen" label={t('loading')} />;
  }

  if (error || !profile) {
    return (
      <Box
        sx={{
          bgcolor: '#F3F6F5',
          minHeight: '100vh',
          py: 4,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              {t('retry')}
            </Button>
          }
        >
          {error ?? t('load_error')}
        </Alert>
      </Box>
    );
  }

  const initials = getInitials(profile.name);
  const roleLabel = profile.role === 'Supplier' ? t('role_supplier') : t('role_buyer');
  const accountTypeLabel =
    profile.accountType === 'Company' ? t('account_company') : t('account_individual');

  const accountData = [
    { label: t('fields.name'), value: profile.name, icon: <PersonOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.company'), value: profile.legalCompanyName, icon: <BusinessOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.phone'), value: profile.phoneNumber, icon: <PhoneOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.email'), value: profile.email, icon: <MailOutlineOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.commercial_record'), value: profile.commercialRecord, icon: <CardTravelOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.tax_number'), value: profile.taxNumber, icon: <AccountBalanceOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.city'), value: profile.city, icon: <LocationOnOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.company_address'), value: profile.companyAddress, icon: <BadgeOutlinedIcon sx={{ fontSize: 20 }} /> },
  ];

  return (
    <Box
      sx={{
        bgcolor: '#F3F6F5',
        minHeight: '100vh',
        py: 4,
        px: { xs: 2, lg: 3 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}
        >
          <Typography variant="h5" sx={{ fontWeight: '800', color: '#1A1A1A' }}>
            {from === 'supplier' ? t('counterparty_buyer') : t('counterparty_supplier')}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              borderColor: '#1E8057',
              color: '#1E8057',
              borderRadius: '8px',
              fontWeight: 600,
              px: 2.5,
              py: 1,
              textTransform: 'none',
              gap: 1,
              '&:hover': { borderColor: '#166343', bgcolor: 'rgba(30,128,87,0.04)' },
            }}
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />
            {t('back')}
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {/* Header / Hero Card */}
          <Grid size={12}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                bgcolor: '#ffffff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              {/* Cover */}
              <Box sx={{ position: 'relative', height: { xs: 140, sm: 190 } }}>
                <Box
                  sx={{
                    height: { xs: 140, sm: 190 },
                    backgroundImage: profile.coverImageUrl
                      ? `url("${profile.coverImageUrl}")`
                      : coverFallback,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </Box>

              {/* Avatar and Hero content */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 3 }}
                sx={{
                  px: { xs: 3, md: 4 },
                  pb: 3,
                  mt: { xs: -5, md: -6 },
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <Box>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#7CB342',
                        color: '#7CB342',
                        boxShadow: '0 0 0 2px #fff',
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                      },
                      cursor: profile.profileImageUrl ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (profile.profileImageUrl) setPreviewImage(profile.profileImageUrl);
                    }}
                  >
                    <Avatar
                      src={profile.profileImageUrl ?? undefined}
                      sx={{
                        width: { xs: 80, md: 96 },
                        height: { xs: 80, md: 96 },
                        bgcolor: '#2E6D59',
                        border: '3px solid #ffffff',
                        fontSize: '1.6rem',
                        fontWeight: 'bold',
                        color: '#ffffff',
                      }}
                    >
                      {initials}
                    </Avatar>
                  </Badge>
                </Box>

                {/* Hero text content */}
                <Box sx={{ flex: 1, pt: { xs: 0, sm: 6, md: 7 } }}>
                  <Typography variant="h5" sx={{ fontWeight: '800', color: '#1A1A1A' }}>
                    {profile.name}
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 0.5, sm: 2 }}
                    sx={{ color: '#889892', fontSize: '0.8rem', alignItems: { xs: 'flex-start', sm: 'center' }, mt: 0.5 }}
                  >
                    {profile.city && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: '#889892' }}>
                          {profile.city}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#889892' }}>
                        {roleLabel}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Main: Account Information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                p: { xs: 2.5, md: 4 },
                bgcolor: '#ffffff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 3, alignItems: 'center' }}
              >
                <Box
                  sx={{
                    bgcolor: '#EAF3EF',
                    p: 0.8,
                    borderRadius: 2,
                    display: 'flex',
                    color: '#1E8057',
                  }}
                >
                  <PersonOutlinedIcon sx={{ fontSize: 22 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  {t('account_info')}
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                {accountData.map((item) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: '#F7F9F8',
                        border: '1px solid #EDF1F0',
                        height: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: '#EAF3EF',
                          p: 1,
                          borderRadius: 2,
                          display: 'flex',
                          color: '#1E8057',
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="caption"
                          sx={{ color: '#A0ABA6', display: 'block', mb: 0.3, fontSize: '0.75rem' }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: '700', color: '#262626', fontSize: '0.9rem', wordBreak: 'break-word' }}
                        >
                          {item.value || '—'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}

                <Grid size={12}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      bgcolor: '#F7F9F8',
                      border: '1px solid #EDF1F0',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: '#EAF3EF',
                        p: 1,
                        borderRadius: 2,
                        display: 'flex',
                        color: '#1E8057',
                        flexShrink: 0,
                      }}
                    >
                      <MonitorOutlinedIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: '#A0ABA6', display: 'block', mb: 1, fontSize: '0.75rem' }}
                      >
                        {t('fields.category')}
                      </Typography>
                      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        {(profile.categories ?? []).map((c) => (
                          <Box
                            key={c.code}
                            sx={{
                              bgcolor: '#EAF3EF',
                              color: '#1E8057',
                              borderRadius: 2,
                              px: 1.5,
                              py: 0.6,
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}
                          >
                            {locale === 'ar' ? c.nameAr : c.nameEn}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Sidebar: Account summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                p: 3,
                bgcolor: '#ffffff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 2.5, alignItems: 'center' }}
              >
                <Avatar
                  src={profile.profileImageUrl ?? undefined}
                  sx={{ width: 52, height: 52, bgcolor: '#2E6D59', fontWeight: 700 }}
                >
                  {initials}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                    {profile.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#889892' }}>
                    {roleLabel}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ bgcolor: '#F7F9F8', borderRadius: 2.5, p: 2, border: '1px solid #EDF1F0' }}>
                <Typography variant="caption" sx={{ color: '#A0ABA6', display: 'block', mb: 0.3 }}>
                  {t('account_type')}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#262626' }}>
                  {accountTypeLabel}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Image Preview Dialog */}
        <Dialog open={Boolean(previewImage)} onClose={() => setPreviewImage(null)} maxWidth="md">
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              alt={t('view_image')}
              sx={{ maxWidth: '100%', display: 'block' }}
            />
          )}
        </Dialog>
      </Container>
    </Box>
  );
}