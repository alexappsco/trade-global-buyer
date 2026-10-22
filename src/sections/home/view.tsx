'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Grow } from '@mui/material';
import StatsCards from './StatsCards';
import CategoriesGrid from './CategoriesGrid';
import RecentOrdersTable from './RecentOrdersTable';

export default function HomePage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
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
        <Grow in={visible} timeout={600}>
          <Box>
            {/* Top Summary Metric Cards */}
            <StatsCards />
          </Box>
        </Grow>

        <Grow in={visible} timeout={700}>
          <Box>
            {/* Middle Section Categories */}
            <CategoriesGrid />
          </Box>
        </Grow>

        <Grow in={visible} timeout={800}>
          <Box>
            {/* Bottom Section Orders Data Table */}
            <RecentOrdersTable />
          </Box>
        </Grow>
      </Container>
    </Box>
  );
}