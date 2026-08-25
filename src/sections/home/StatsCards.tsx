'use client';

import React from 'react';
import { Grid, Card, Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

const statKeys = [
  { key: 'total_orders', icon: AssignmentOutlinedIcon, bgColor: '#EAF8F3', iconColor: '#2EB88A' },
  { key: 'completed_orders', icon: CheckCircleOutlineOutlinedIcon, bgColor: '#EAF8F3', iconColor: '#2EB88A' },
  { key: 'price_quotes', icon: LocalOfferOutlinedIcon, bgColor: '#FFF8EC', iconColor: '#EAA123' },
  { key: 'active_orders', icon: AccessTimeOutlinedIcon, bgColor: '#FFF8EC', iconColor: '#EAA123' },
] as const;

const counts = [11, 44, 44, 44];

export default function StatsCards() {
  const t = useTranslations('Home');

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {statKeys.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.key}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: '#ffffff',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box
                sx={{
                  bgcolor: stat.bgColor,
                  p: 1,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <stat.icon sx={{ color: stat.iconColor }} />
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                {t('stats.orders_count', { count: counts[index] })}
              </Typography>
              <Typography variant="caption" sx={{ color: '#889892' }}>
                {t(`stats.${stat.key}`)}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
