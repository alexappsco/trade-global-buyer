'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import { getOrdersCatalog } from 'src/actions/orders';
import type { OrderCatalogItem } from 'src/types/order';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function CategoriesGrid() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const [categories, setCategories] = useState<OrderCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getOrdersCatalog();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return null;
  }

  if (!categories.length) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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

      <Box
        sx={{
          position: 'relative',
          '& .swiper-button-next, & .swiper-button-prev': {
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
            color: '#000000',
            '&:after': {
              fontSize: '16px',
              fontWeight: 'bold',
            },
          },
          '& .swiper-button-next': {
            right: '-10px',
          },
          '& .swiper-button-prev': {
            left: '-10px',
          },
        }}
      >
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        navigation
        loop={false}
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          600: {
            slidesPerView: 3,
          },
          900: {
            slidesPerView: 4,
          },
        }}
        style={{ paddingBottom: '10px' }}
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat.code}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: '#ffffff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transform: 'translateY(-4px)',
                },
                '&:hover .category-image': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                sx={{
                  overflow: 'hidden',
                  height: { xs: 100, sm: 140 },
                  position: 'relative',
                  bgcolor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cat.imageUrl ? (
                  <CardMedia
                    component="img"
                    className="category-image"
                    sx={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease-in-out',
                    }}
                    image={cat.imageUrl}
                    alt={locale === 'ar' ? cat.nameAr : cat.nameEn}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      width: '100%',
                      background: 'linear-gradient(135deg, #e8f5f0 0%, #f8fafc 100%)',
                    }}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 16L8.58579 11.4142C9.36683 10.6332 10.6332 10.6332 11.4142 11.4142L16 16M14 14L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
                        stroke="#1B8354"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Box>
                )}
              </Box>
              <CardContent sx={{ textAlign: 'right', pb: 2, px: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1A1A1A',
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={locale === 'ar' ? cat.nameAr : cat.nameEn}
                >
                  {locale === 'ar' ? cat.nameAr : cat.nameEn}
                </Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
        </Swiper>
      </Box>
    </Box>
  );
}
