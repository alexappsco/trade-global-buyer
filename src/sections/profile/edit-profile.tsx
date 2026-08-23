'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { profileData } from '@/mocks/profile-data';

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

export default function EditProfile() {
  const t = useTranslations('Profile');
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(fieldKeys.map((key) => [key, profileData[key] || '']))
  );

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box
      sx={{
        bgcolor: '#E2ECE9',
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#ffffff',
            mb: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          }}
        >
          <Box
            sx={{
              height: 180,
              backgroundImage:
                'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          />

          <Box sx={{ px: 3, pb: 3, pt: 0, position: 'relative' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mt: -6,
                mb: 2,
              }}
            >
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
                  sx={{
                    width: 90,
                    height: 90,
                    bgcolor: '#2C5E4B',
                    border: '4px solid #ffffff',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                  }}
                >
                  {profileData.initials}
                </Avatar>
              </Badge>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  {profileData.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.85rem', alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">{profileData.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption">{t('member_since', { year: profileData.memberSince })}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Button
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                sx={{
                  bgcolor: '#1B8354',
                  '&:hover': { bgcolor: '#146440' },
                  borderRadius: 2,
                  px: 2.5,
                  py: 0.8,
                  fontSize: '0.875rem',
                  boxShadow: 'none',
                  textTransform: 'none',
                }}
              >
                {t('edit_profile')}
              </Button>
            </Stack>
          </Box>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            p: 4,
            bgcolor: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 4, justifyContent: 'center', alignItems: 'center' }}
          >
            <Box
              sx={{
                bgcolor: '#EAF3EF',
                p: 0.8,
                borderRadius: '50%',
                display: 'flex',
                color: '#1B8354',
              }}
            >
              <PersonOutlinedIcon fontSize="small" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
              {t('account_info')}
            </Typography>
          </Stack>

          <Grid container spacing={2.5}>
            {fieldKeys.map((key) => (
              <Grid size={{ xs: 12 }} key={key}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 'medium',
                      color: 'text.secondary',
                      mb: 0.8,
                      display: 'block',
                      textAlign: 'right',
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
                          '& input': { textAlign: 'right' },
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#1B8354' },
                          '&.Mui-focused fieldset': { borderColor: '#1B8354' },
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 3, justifyContent: 'center' }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: '#1B8354',
              '&:hover': { bgcolor: '#146440' },
              borderRadius: 2,
              px: 6,
              py: 1,
              fontSize: '0.9rem',
              boxShadow: 'none',
            }}
          >
            {t('save')}
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#D94141',
              '&:hover': { bgcolor: '#B83232' },
              borderRadius: 2,
              px: 6,
              py: 1,
              fontSize: '0.9rem',
              boxShadow: 'none',
            }}
          >
            {t('cancel')}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
