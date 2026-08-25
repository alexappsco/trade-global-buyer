'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import StatsCards from './StatsCards';
import CategoriesGrid from './CategoriesGrid';
import RecentOrdersTable from './RecentOrdersTable';

export default function HomePage() {
  return (
    <Box
      dir="rtl"
      sx={{
        bgcolor: '#F3F6F5',
        // minHeight: '100vh',
        py: 4,
        px: 2,
        fontFamily: 'sans-serif',
      }}
    >
      <Container maxWidth="xl">
        {/* Top Summary Metric Cards */}
        <StatsCards />

        {/* Middle Section Categories */}
        <CategoriesGrid />

        {/* Bottom Section Orders Data Table */}
        <RecentOrdersTable />
      </Container>
    </Box>
  );
}