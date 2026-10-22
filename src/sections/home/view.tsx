'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Fade } from '@mui/material';
import StatsCards from './StatsCards';
import CategoriesGrid from './CategoriesGrid';
import RecentOrdersTable from './RecentOrdersTable';
import { getDashboardMetrics } from 'src/actions/dashboard';
import { getOrdersCatalog, getOrders } from 'src/actions/orders';
import type { DashboardMetrics } from 'src/types/dashboard';
import type { OrderCatalogItem, Order } from 'src/types/order';

export default function HomePage() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [categories, setCategories] = useState<OrderCatalogItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;

    const fetchHomeData = async () => {
      try {
        const [metricsRes, categoriesRes, ordersRes] = await Promise.allSettled([
          getDashboardMetrics(),
          getOrdersCatalog(),
          getOrders({ skipCount: 0, maxResultCount: 5 }),
        ]);

        if (!active) return;

        if (metricsRes.status === 'fulfilled' && metricsRes.value.success && metricsRes.value.data) {
          setMetrics(metricsRes.value.data);
        }
        if (categoriesRes.status === 'fulfilled' && categoriesRes.value.success && categoriesRes.value.data) {
          const list = Array.isArray(categoriesRes.value.data) ? categoriesRes.value.data : [];
          setCategories(list);
        }
        if (ordersRes.status === 'fulfilled' && ordersRes.value.success && ordersRes.value.data) {
          setOrders(ordersRes.value.data.items ?? []);
        }
      } catch (error) {
        console.error('Failed to load home page data:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchHomeData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box
      sx={{
        bgcolor: '#F3F6F5',
        py: { xs: 2, md: 4 },
        px: { xs: 1, md: 2 },
        fontFamily: 'sans-serif',
      }}
    >
      <Container maxWidth="xl">
        {/* Top Summary Metric Cards */}
        <Fade in={visible} timeout={500} style={{ transitionDelay: '50ms' }}>
          <Box sx={{ mb: 4 }}>
            <StatsCards metrics={metrics} loading={loading} />
          </Box>
        </Fade>

        {/* Middle Section Categories */}
        <Fade in={visible} timeout={600} style={{ transitionDelay: '180ms' }}>
          <Box>
            <CategoriesGrid categories={categories} loading={loading} />
          </Box>
        </Fade>

        {/* Bottom Section Orders Data Table */}
        <Fade in={visible} timeout={700} style={{ transitionDelay: '300ms' }}>
          <Box>
            <RecentOrdersTable orders={orders} loading={loading} />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}