'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Fade } from '@mui/material';
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
        {/* Top Summary Metric Cards */}
        <Fade in={visible} timeout={500} style={{ transitionDelay: '50ms' }}>
          <Box>
            <StatsCards />
          </Box>
        </Fade>

        {/* Middle Section Categories */}
        <Fade in={visible} timeout={600} style={{ transitionDelay: '180ms' }}>
          <Box>
            <CategoriesGrid />
          </Box>
        </Fade>

        {/* Bottom Section Orders Data Table */}
        <Fade in={visible} timeout={700} style={{ transitionDelay: '300ms' }}>
          <Box>
            <RecentOrdersTable />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}