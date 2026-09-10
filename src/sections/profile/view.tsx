'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Box,
  Card,
  Avatar,
  Typography,
  Button,
  Container,
  Stack,
  Badge,
  CircularProgress,
  Alert,
  Dialog,
  Tooltip,
  IconButton,
  Grid,
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import MonitorOutlinedIcon from '@mui/icons-material/MonitorOutlined';
import CardTravelOutlinedIcon from '@mui/icons-material/CardTravelOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { paths } from '@/routes/paths';
import { getMyInfo, updateMyInfo } from '@/actions/profile';
import { useToast } from 'src/components/toast';
import type { MyInfo } from '@/types/auth';

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

export default function ProfileView() {
  const router = useRouter();
  const t = useTranslations('Profile');
  const toast = useToast();

  const [profile, setProfile] = useState<MyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      const res = await getMyInfo();
      if (!res.success) {
        setError(res.error ?? t('load_error'));
        setIsLoading(false);
        return;
      }
      setProfile(res.data);
      setIsLoading(false);
    };
    loadProfile();
  }, [t]);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    const res = await getMyInfo();
    if (!res.success) {
      setError(res.error ?? t('load_error'));
      setIsLoading(false);
      return;
    }
    setProfile(res.data);
    setIsLoading(false);
  };

  const handleImageEdit = async (type: 'profile' | 'cover', file?: File | null) => {
    if (!file || !profile || isUploading) return;
    setIsUploading(true);
    try {
      const res = await updateMyInfo({
        name: profile.name,
        legalCompanyName: profile.legalCompanyName,
        phoneNumber: profile.phoneNumber,
        email: profile.email,
        sector: profile.sector,
        taxNumber: profile.taxNumber,
        commercialRecord: profile.commercialRecord,
        city: profile.city,
        companyAddress: profile.companyAddress,
        profileImage: type === 'profile' ? file : undefined,
        coverImage: type === 'cover' ? file : undefined,
      });

      if (!res.success) {
        toast.error(res.error ?? t('load_error'));
        return;
      }
      toast.success(t('image_updated'));
      if (res.data) setProfile(res.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('load_error'));
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
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
        <CircularProgress size={40} sx={{ color: '#1E8057' }} />
      </Box>
    );
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
  const memberYear = profile.profileCompletedAt
    ? new Date(profile.profileCompletedAt).getFullYear()
    : undefined;
  const roleLabel = profile.role === 'Supplier' ? t('role_supplier') : t('role_buyer');
  const accountTypeLabel =
    profile.accountType === 'Company' ? t('account_company') : t('account_individual');

  const accountData = [
    { label: t('fields.name'), value: profile.name, icon: <PersonOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.company'), value: profile.legalCompanyName, icon: <BusinessOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.phone'), value: profile.phoneNumber, icon: <PhoneOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.email'), value: profile.email, icon: <MailOutlineOutlinedIcon sx={{ fontSize: 20 }} /> },
    { label: t('fields.sector'), value: profile.sector, icon: <MonitorOutlinedIcon sx={{ fontSize: 20 }} /> },
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
              {/* Cover with hover actions */}
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
                <input
                  accept="image/*"
                  type="file"
                  id="cover-edit-input"
                  hidden
                  onChange={(e) => {
                    handleImageEdit('cover', e.target.files?.[0]);
                    e.currentTarget.value = '';
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    bgcolor: 'rgba(0,0,0,0.35)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  {profile.coverImageUrl && (
                    <Button
                      size="small"
                      variant="contained"
                      disabled={isUploading}
                      onClick={() => setPreviewImage(profile.coverImageUrl ?? null)}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.92)',
                        color: '#1A1A1A',
                        '&:hover': { bgcolor: '#ffffff' },
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        gap: 0.5,
                      }}
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                      {t('view_image')}
                    </Button>
                  )}
                  <label htmlFor="cover-edit-input">
                    <Button
                      component="span"
                      size="small"
                      variant="contained"
                      disabled={isUploading}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.92)',
                        color: '#1A1A1A',
                        '&:hover': { bgcolor: '#ffffff' },
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        gap: 0.5,
                      }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: 16 }} />
                      {t('edit_image')}
                    </Button>
                  </label>
                </Box>
              </Box>

              {/* Avatar with hover actions */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 100, sm: 155 },
                  right: { xs: 20, md: 32 },
                }}
              >
                <input
                  accept="image/*"
                  type="file"
                  id="profile-image-edit-input"
                  hidden
                  onChange={(e) => {
                    handleImageEdit('profile', e.target.files?.[0]);
                    e.currentTarget.value = '';
                  }}
                />
                <Box sx={{ position: 'relative' }}>
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
                    }}
                  >
                    <Avatar
                      src={profile.profileImageUrl}
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

                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                      bgcolor: 'rgba(0,0,0,0.35)',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    {profile.profileImageUrl && (
                      <Tooltip title={t('view_image')}>
                        <IconButton
                          size="small"
                          disabled={isUploading}
                          onClick={() => setPreviewImage(profile.profileImageUrl ?? null)}
                          sx={{ bgcolor: 'rgba(255,255,255,0.92)', '&:hover': { bgcolor: '#ffffff' } }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={t('edit_image')}>
                      <span>
                        <label htmlFor="profile-image-edit-input">
                          <IconButton
                            component="span"
                            size="small"
                            disabled={isUploading}
                            sx={{ bgcolor: 'rgba(255,255,255,0.92)', '&:hover': { bgcolor: '#ffffff' } }}
                          >
                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </label>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              {/* Hero content */}
              <Stack
                direction={{ xs: 'column-reverse', sm: 'row' }}
                sx={{ px: { xs: 3, md: 4 }, pt: { xs: 8, sm: 3 }, pb: 3, gap: 2 }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: '800', color: '#1A1A1A' }}>
                    {profile.name}
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 0.5, sm: 2 }}
                    sx={{ color: '#889892', fontSize: '0.8rem', alignItems: 'center', mt: 0.5 }}
                  >
                    {profile.city && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: '#889892' }}>
                          {profile.city}
                        </Typography>
                      </Box>
                    )}
                    {memberYear && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption" sx={{ color: '#889892' }}>
                          {t('member_since', { year: memberYear })}
                        </Typography>
                      </Box>
                    )}
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          {/* Sidebar: Account summary + actions */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
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
                    src={profile.profileImageUrl}
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

              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 3,
                  bgcolor: '#ffffff',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1A1A1A', mb: 2 }}>
                  {t('quick_actions')}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => router.push(paths.profile.edit)}
                  sx={{
                    bgcolor: '#1E8057',
                    '&:hover': { bgcolor: '#166343' },
                    borderRadius: 2.5,
                    py: 1.2,
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    boxShadow: 'none',
                    textTransform: 'none',
                    gap: 1,
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 18 }} />
                  {t('edit_profile')}
                </Button>
              </Card>
            </Stack>
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