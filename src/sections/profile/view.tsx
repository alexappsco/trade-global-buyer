'use client';

import React from 'react';
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
  Divider,
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import MonitorOutlinedIcon from '@mui/icons-material/MonitorOutlined';
import CardTravelOutlinedIcon from '@mui/icons-material/CardTravelOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { paths } from '@/routes/paths';

export default function ProfileView() {
  const router = useRouter();
  const t = useTranslations('Profile');

  const accountData = [
    {
      label: t('fields.name'),
      value: 'محمد أحمد',
      icon: <PersonOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: t('fields.company'),
      value: 'شركة نون للتجارة الإلكترونية المحدودة',
      icon: <BusinessOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: t('fields.phone'),
      value: '+966 12456 1564',
      icon: <PhoneOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: t('fields.email'),
      value: 'user@domain.com',
      icon: <MailOutlineOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: t('fields.sector'),
      value: 'تجارة إلكترونية',
      icon: <MonitorOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: t('fields.commercial_record'),
      value: '1010654321',
      icon: <CardTravelOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: t('fields.tax_number'),
      value: '300123456700003',
      icon: <AccountBalanceOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: t('fields.company_address'),
      value: 'طريق الملك فهد، حي العليا',
      icon: <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: t('fields.password'),
      value: '●●●●●●●●●',
      icon: <LockOutlinedIcon sx={{ fontSize: 18 }} />,
    },
  ];

  return (

    <Box
      dir="ltr"
      sx={{
        bgcolor: '#E4ECE8',
        minHeight: '100vh',
        py: 4,
        px: 2,
        fontFamily: 'sans-serif',
      }}
    >
      <Container maxWidth="xl">
        {/* Header Profile Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: '#ffffff',
            mb: 3,
            position: 'relative',
          }}
        >
          {/* Cover Image */}
          <Box
            sx={{
              height: 190,
              backgroundImage:
                'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Avatar Positioned Over Cover */}
          <Box
            sx={{
              position: 'absolute',
              top: 135,
              right: 32,
            }}
          >
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
                sx={{
                  width: 86,
                  height: 86,
                  bgcolor: '#2E6D59',
                  border: '3px solid #ffffff',
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                م.أ
              </Avatar>
            </Badge>
          </Box>

          {/* User Details & Header Button */}
          <Box sx={{ px: 4, pt: 3, pb: 3 }}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
              <Button
                variant="contained"
                startIcon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
                onClick={() => router.push(paths.profile.edit)}
                sx={{
                  bgcolor: '#1E8057',
                  '&:hover': { bgcolor: '#166343' },
                  borderRadius: 2,
                  px: 2.5,
                  py: 0.8,
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  textTransform: 'none',
                }}
              >
                {t('edit_profile')}
              </Button>

              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: '800', color: '#1A1A1A', mb: 0.5 }}
                >
                  محمد أحمد
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ color: '#889892', fontSize: '0.8rem', alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: '#889892' }}>
                      الرياض، المملكة العربية السعودية
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ color: '#889892' }}>
                      {t('member_since', { year: 2020 })}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Card>

        {/* Account Details Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 4,
            bgcolor: '#ffffff',
            mb: 3,
          }}
        >
          {/* Section Header */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 4, alignItems: 'center', justifyContent: 'center' }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
            >
              {t('account_info')}
            </Typography>
            <Box
              sx={{
                bgcolor: '#EAF3EF',
                p: 0.6,
                borderRadius: '50%',
                display: 'flex',
                color: '#1E8057',
              }}
            >
              <PersonOutlinedIcon sx={{ fontSize: 18 }} />
            </Box>
          </Stack>

          {/* Read-Only Info List */}
          <Stack spacing={2.5}>
            {accountData.map((item, index) => (
              <React.Fragment key={index}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {/* Left-side Icon Box */}
                  <Box
                    sx={{
                      bgcolor: '#EAF3EF',
                      p: 1,
                      borderRadius: 2,
                      display: 'flex',
                      color: '#1E8057',
                    }}
                  >
                    {item.icon}
                  </Box>

                  {/* Right-side Label & Value */}
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#A0ABA6',
                        display: 'block',
                        mb: 0.3,
                        fontSize: '0.75rem',
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: '700',
                        color: '#262626',
                        fontSize: '0.9rem',
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>
                {index < accountData.length - 1 && (
                  <Divider sx={{ borderColor: '#F4F6F5' }} />
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Card>

        {/* Bottom Full-Width Action Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={() => router.push(paths.profile.edit)}
          sx={{
            bgcolor: '#1E8057',
            '&:hover': { bgcolor: '#166343' },
            borderRadius: 2,
            py: 1.2,
            fontSize: '0.95rem',
            fontWeight: 'bold',
            boxShadow: 'none',
            textTransform: 'none',
          }}
        >
          {t('edit_profile')}
        </Button>
      </Container>
    </Box>

  );
}