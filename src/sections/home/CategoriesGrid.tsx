'use client';

import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { useTranslations } from 'next-intl';

const categories = [
  {
    titleKey: 'computers',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
  },
  {
    titleKey: 'networking',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop',
  },
  {
    titleKey: 'printers',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&h=400&auto=format&fit=crop',
  },
  {
    titleKey: 'services',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
  },
];

export default function CategoriesGrid() {
  const t = useTranslations('Home');

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#1A1A1A',
            borderRight: '4px solid #1B8354',
            pr: 1.5,
          }}
        >
          {t('categories.title')}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {categories.map((cat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={cat.titleKey}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: '#ffffff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <CardMedia component="img" height="140" image={cat.image} alt={cat.titleKey} />
              <CardContent sx={{ textAlign: 'right', pb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1A1A1A', mb: 0.5 }}>
                  {t(`categories.items.${cat.titleKey}`)}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: '#1B8354',
                    '&:hover': { bgcolor: '#146440' },
                    borderRadius: 2,
                    py: 0.8,
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    boxShadow: 'none',
                    textTransform: 'none',
                  }}
                >
                  {t('categories.view_section')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
