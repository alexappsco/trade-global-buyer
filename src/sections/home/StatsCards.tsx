'use client';

import React, { useEffect, useState } from 'react';
import { Grid, Card, Typography, Box, Skeleton, Fade } from '@mui/material';
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

interface StatsCardsProps {
  metrics?: DashboardMetrics | null;
  loading?: boolean;
}

export default function StatsCards({
  metrics: propMetrics,
  loading: propLoading,
}: StatsCardsProps = {}) {
  const t = useTranslations('Home');
  const toast = useToast();

  const isControlled = propMetrics !== undefined || propLoading !== undefined;
  const [internalMetrics, setInternalMetrics] = useState<DashboardMetrics | null>(null);
  const [internalLoading, setInternalLoading] = useState(true);

  const metrics = isControlled ? propMetrics ?? null : internalMetrics;
  const isLoading = isControlled ? Boolean(propLoading) : internalLoading;

  useEffect(() => {
    if (isControlled) return;

    const loadMetrics = async () => {
      setInternalLoading(true);
      const res = await getDashboardMetrics();
      if (!res.success) {
        toast.error(res.error ?? t('stats.load_error'));
        setInternalLoading(false);
        return;
      }
      setInternalMetrics(res.data);
      setInternalLoading(false);
    };
    loadMetrics();
  }, [isControlled, t, toast]);

  const getCount = (field: keyof DashboardMetrics) => (metrics ? metrics[field] : 0);

  // Unified Skeleton Loader matching the cards layout (replaces circular spinner)
  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid size={{ xs: 6, sm: 6, md: 3 }} key={item}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: '#ffffff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                border: '1px solid rgba(0, 0, 0, 0.04)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  animation="wave"
                  sx={{ bgcolor: '#edf3f0' }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 1 }}>
                <Skeleton
                  variant="text"
                  width="50%"
                  height={28}
                  animation="wave"
                  sx={{ bgcolor: '#e2ece7' }}
                />
                <Skeleton
                  variant="text"
                  width="70%"
                  height={18}
                  animation="wave"
                  sx={{ bgcolor: '#edf3f0' }}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Fade in={!isLoading} timeout={400}>
      <Grid container spacing={2}>
        {statKeys.map((stat) => (
          <Grid size={{ xs: 6, sm: 6, md: 3 }} key={stat.key}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: '#ffffff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                border: '1px solid rgba(0, 0, 0, 0.04)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                  transform: 'translateY(-2px)',
                },
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
                  {t('stats.orders_count', { count: getCount(stat.field) })}
                </Typography>
                <Typography variant="caption" sx={{ color: '#889892' }}>
                  {t(`stats.${stat.key}`)}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Fade>
  );
}