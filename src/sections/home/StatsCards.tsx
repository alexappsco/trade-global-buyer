'use client';

import React, { useEffect, useState } from 'react';
import { Grid, Card, Typography, Box, CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { getDashboardMetrics } from 'src/actions/dashboard';
import { useToast } from 'src/components/toast';
import type { DashboardMetrics } from 'src/types/dashboard';

const statKeys = [
  { key: 'total_orders', field: 'totalOrders', icon: AssignmentOutlinedIcon, bgColor: '#EAF8F3', iconColor: '#2EB88A' },
  { key: 'completed_orders', field: 'completedOrders', icon: CheckCircleOutlineOutlinedIcon, bgColor: '#EAF8F3', iconColor: '#2EB88A' },
  { key: 'price_quotes', field: 'priceQuotes', icon: LocalOfferOutlinedIcon, bgColor: '#FFF8EC', iconColor: '#EAA123' },
  { key: 'active_orders', field: 'activeOrders', icon: AccessTimeOutlinedIcon, bgColor: '#FFF8EC', iconColor: '#EAA123' },
] as const satisfies ReadonlyArray<{
  key: string;
  field: keyof DashboardMetrics;
  icon: typeof AssignmentOutlinedIcon;
  bgColor: string;
  iconColor: string;
}>;

export default function StatsCards() {
  const t = useTranslations('Home');
  const toast = useToast();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      setIsLoading(true);
      const res = await getDashboardMetrics();
      if (!res.success) {
        toast.error(res.error ?? t('stats.load_error'));
        setIsLoading(false);
        return;
      }
      setMetrics(res.data);
      setIsLoading(false);
    };
    loadMetrics();
  }, [t, toast]);

  const getCount = (field: keyof DashboardMetrics) => (metrics ? metrics[field] : 0);

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {statKeys.map((stat) => (
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
                {isLoading ? (
                  <CircularProgress size={18} sx={{ color: '#889892' }} />
                ) : (
                  t('stats.orders_count', { count: getCount(stat.field) })
                )}
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