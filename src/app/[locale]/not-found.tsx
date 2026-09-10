import { getTranslations } from 'next-intl/server';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'src/i18n/routing';

export default async function LocaleNotFound() {
  const t = await getTranslations('NotFound');

  return (
    <Container maxWidth="xl">
      <Box
        dir="ltr"
        sx={{
          minHeight: '65vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 1.5,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 900, color: '#1E8057' }}>
          404
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
          {t('title')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {t('description')}
        </Typography>
        <Link href="/" passHref>
          <Button
            component="a"
            variant="contained"
            sx={{
              bgcolor: '#1E8057',
              '&:hover': { bgcolor: '#166343' },
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              boxShadow: 'none',
            }}
          >
            {t('back_home')}
          </Button>
        </Link>
      </Box>
    </Container>
  );
}