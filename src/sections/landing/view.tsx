import Box from '@mui/material/Box';

import LandingHeader from './landing-header';
import LandingHero from './landing-hero';
import LandingServices from './landing-services';
import LandingHowItWorks from './landing-how-it-works';
import LandingPlatform from './landing-platform';
import LandingFooter from './landing-footer';
import LandingScrollProgress from './landing-scroll-progress';

export default function LandingView() {
  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingScrollProgress />
      <LandingHeader />
      <LandingHero />
      <LandingServices />
      <LandingHowItWorks />
      <LandingPlatform />
      <LandingFooter />
    </Box>
  );
}