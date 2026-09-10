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
  TextField,
  Grid,
  Container,
  Stack,
  Badge,
  CircularProgress,
  Alert,
} from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { paths } from '@/routes/paths';
import { getMyInfo, updateMyInfo } from '@/actions/profile';
import { useToast } from 'src/components/toast';
import type { MyInfo } from '@/types/auth';

const fieldKeys = [
  'name',
  'company',
  'phone',
  'email',
  'sector',
  'tax_number',
  'commercial_record',
  'company_address',
  'city',
] as const;

function profileToForm(profile: MyInfo): Record<(typeof fieldKeys)[number], string> {
  return {
    name: profile.name ?? '',
    company: profile.legalCompanyName ?? '',
    phone: profile.phoneNumber ?? '',
    email: profile.email ?? '',
    sector: profile.sector ?? '',
    tax_number: profile.taxNumber ?? '',
    commercial_record: profile.commercialRecord ?? '',
    company_address: profile.companyAddress ?? '',
    city: profile.city ?? '',
  };
}

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

export default function EditProfile() {
  const router = useRouter();
  const t = useTranslations('Profile');
  const toast = useToast();

  const [profile, setProfile] = useState<MyInfo | null>(null);
  const [form, setForm] = useState<Record<(typeof fieldKeys)[number], string>>(
    Object.fromEntries(fieldKeys.map((key) => [key, ''])) as Record<(typeof fieldKeys)[number], string>
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setLoadError(null);
      const res = await getMyInfo();
      if (!res.success) {
        setLoadError(res.error ?? t('load_error'));
        setIsLoading(false);
        return;
      }
      setProfile(res.data);
      setForm(profileToForm(res.data));
      setIsLoading(false);
    };
    loadProfile();
  }, [t]);

  const handleRetry = async () => {
    setIsLoading(true);
    setLoadError(null);
    const res = await getMyInfo();
    if (!res.success) {
      setLoadError(res.error ?? t('load_error'));
      setIsLoading(false);
      return;
    }
    setProfile(res.data);
    setForm(profileToForm(res.data));
    setIsLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateMyInfo({
        name: form.name,
        legalCompanyName: form.company,
        phoneNumber: form.phone,
        email: form.email,
        sector: form.sector,
        taxNumber: form.tax_number,
        commercialRecord: form.commercial_record,
        city: form.city,
        companyAddress: form.company_address,
      });

      if (!res.success) {
        toast.error(res.error ?? t('load_error'));
        return;
      }
      toast.success(t('save_success'));
      router.push(paths.profile.view);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('load_error'));
    } finally {
      setIsSaving(false);
    }
  };

  const avatarPreview = profile?.profileImageUrl;
  const coverPreview = profile?.coverImageUrl;
  const initials = getInitials(profile?.name);

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
        {loadError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                {t('retry')}
              </Button>
            }
          >
            {loadError}
          </Alert>
        ) : (
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
                <Box
                  sx={{
                    height: 140,
                    backgroundImage: coverPreview
                      ? `url("${coverPreview}")`
                      : 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <Box sx={{ px: { xs: 3, md: 4 }, pb: 3, position: 'relative' }}>
                  <Box sx={{ mt: -5, mb: 2 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: '#8BC34A',
                          color: '#8BC34A',
                          boxShadow: '0 0 0 2px #fff',
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                        },
                      }}
                    >
                      <Avatar
                        src={avatarPreview}
                        sx={{
                          width: 96,
                          height: 96,
                          bgcolor: '#2C5E4B',
                          border: '4px solid #ffffff',
                          fontSize: '1.8rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {initials}
                      </Avatar>
                    </Badge>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: '800', color: '#1A1A1A' }}>
                    {profile?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#889892' }}>
                    {profile?.city}
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {/* Main: Form fields */}
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
                <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
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

                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress size={32} sx={{ color: '#1B8354' }} />
                  </Box>
                ) : (
                  <Grid container spacing={2.5}>
                    {fieldKeys.map((key) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={key}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 'medium',
                            color: 'text.secondary',
                            mb: 0.8,
                            display: 'block',
                            textAlign: 'start',
                          }}
                        >
                          {t(`fields.${key}`)}
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={form[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          slotProps={{
                            input: {
                              sx: {
                                borderRadius: 2,
                                bgcolor: '#FAFAFA',
                                fontSize: '0.875rem',
                                '& input': { textAlign: 'start' },
                                '& fieldset': { borderColor: '#E5E7EB' },
                                '&:hover fieldset': { borderColor: '#1B8354' },
                                '&.Mui-focused fieldset': { borderColor: '#1B8354' },
                              },
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Card>
            </Grid>

            {/* Sidebar: Save / Cancel */}
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
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1A1A1A', mb: 2 }}>
                  {t('quick_actions')}
                </Typography>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={isLoading || isSaving}
                    onClick={handleSave}
                    sx={{
                      bgcolor: '#1B8354',
                      '&:hover': { bgcolor: '#146440' },
                      borderRadius: 2.5,
                      py: 1.2,
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      boxShadow: 'none',
                      textTransform: 'none',
                      gap: 1,
                    }}
                  >
                    <SaveOutlinedIcon sx={{ fontSize: 18 }} />
                    {isSaving ? t('saving') : t('save')}
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => router.push(paths.profile.view)}
                    sx={{
                      bgcolor: '#D94141',
                      '&:hover': { bgcolor: '#B83232' },
                      borderRadius: 2.5,
                      py: 1.2,
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      boxShadow: 'none',
                      textTransform: 'none',
                      gap: 1,
                    }}
                  >
                    <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                    {t('cancel')}
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}