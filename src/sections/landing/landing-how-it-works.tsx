import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';

export default function LandingHowItWorks() {
  const t = useTranslations('Landing');

  const steps = [
    { title: t('how.step_1.title'), description: t('how.step_1.desc'), image: '/landing/how-it-works/1.jpg' },
    { title: t('how.step_2.title'), description: t('how.step_2.desc'), image: '/landing/how-it-works/2.jpg' },
    { title: t('how.step_3.title'), description: t('how.step_3.desc'), image: '/landing/how-it-works/3.jpg' },
    { title: t('how.step_4.title'), description: t('how.step_4.desc'), image: '/landing/how-it-works/4.jpg' },
  ];

  return (
    <Box
      id="how-it-works"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(145deg, #0F1C2E 0%, #1A2F4C 100%)',
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          top: { xs: '50%', md: '52%' },
          height: 2,
          background: 'linear-gradient(90deg, transparent, #108558, transparent)',
          opacity: 0.7,
        },
      }}
    >
      <Container sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 9 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 32, md: 48 },
              lineHeight: 1.5,
              backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #92F7C0 50%, #FFFFFF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              display: 'inline-block',
            }}
          >
            {t('how.title')}
          </Typography>
          <Box
            sx={{
              width: 128,
              height: 3,
              mx: 'auto',
              my: 2,
              borderRadius: 1.5,
              backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #92F7C0 50%, #FFFFFF 100%)',
            }}
          />
          <Typography sx={{ color: '#D0DAF2', fontSize: { xs: 15, md: 20 } }}>
            {t('how.subtitle')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'center',
            gap: { xs: 3, md: 4.5 },
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={step.title}
              sx={{
                position: 'relative',
                width: { xs: 'min(100%, 360px)', md: 190 },
                minHeight: { xs: 390, md: 416 },
                mt: { md: index % 2 ? 6 : 0 },
                px: { xs: 3, md: 2.5 },
                pt: { xs: 3, md: 3.5 },
                pb: 3,
                textAlign: 'center',
                border: '1px solid rgba(16,133,88,.3)',
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,.05)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 30px rgba(16,133,88,.1)',
              }}
            >
              <Typography
                sx={{
                  position: 'absolute',
                  top: -22,
                  left: -9,
                  color: 'rgba(255,255,255,.05)',
                  fontSize: 76,
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </Typography>
              <Box
                sx={{
                  width: 144,
                  height: 144,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: '#F7F8FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0,0,0,.3)',
                }}
              >
                <Box
                  component="img"
                  src={step.image}
                  alt=""
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Typography sx={{ color: '#fff', fontSize: 20, fontWeight: 700, mb: 1.5 }}>
                {step.title}
              </Typography>
              <Box sx={{ height: 1, bgcolor: 'rgba(16,133,88,.45)', mb: 1.5 }} />
              <Typography sx={{ color: '#D0DAF2', fontSize: 14, lineHeight: 1.85 }}>
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}