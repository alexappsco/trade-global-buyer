'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Grid,
  IconButton,
  Fade,
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'src/i18n/routing';
import { useToast } from 'src/components/toast';
import { getOrdersCatalog } from 'src/actions/orders';
import type { OrderCatalogItem } from 'src/types/order';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperCore } from 'swiper';
import 'swiper/css';

interface CategoriesGridProps {
  categories?: OrderCatalogItem[];
  loading?: boolean;
}

export default function CategoriesGrid({
  categories: propCategories,
  loading: propLoading,
}: CategoriesGridProps = {}) {
  const t = useTranslations('Home');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { role } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const isBuyer = role === 'buyer';

  const isControlled = propCategories !== undefined || propLoading !== undefined;
  const [internalCategories, setInternalCategories] = useState<OrderCatalogItem[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);

  const categories = isControlled ? propCategories ?? [] : internalCategories;
  const loading = isControlled ? Boolean(propLoading) : internalLoading;

  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const autoSwipeDoneRef = React.useRef(false);

  const handleCategoryClick = (cat: OrderCatalogItem) => {
    if (role !== 'buyer') return;
    const catName = (locale === 'ar' ? cat.nameAr : cat.nameEn) || cat.code;
    toast.success(
      locale === 'ar'
        ? `تم تحديد الفئة "${catName}"`
        : `Category "${catName}" selected`
    );
    const params = new URLSearchParams({
      categoryCode: cat.code,
      categoryName: catName,
      ...(cat.imageUrl ? { categoryImg: cat.imageUrl } : {}),
    });
    router.push(`/orders/create?${params.toString()}`);
  };

  const updateSwiperState = useCallback((s: SwiperCore) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
    setIsLocked(s.isLocked);
  }, []);

  useEffect(() => {
    if (isControlled) return;
    let active = true;

    const fetchCategories = async () => {
      try {
        const res = await getOrdersCatalog();
        if (active && res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          setInternalCategories(list);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        if (active) {
          setInternalLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, [isControlled]);

  // Auto-swipe teaser: once swiper is ready and categories are loaded, nudge forward then back
  useEffect(() => {
    if (!swiper || loading || isLocked || autoSwipeDoneRef.current) return;
    // Nothing to slide if already at the end
    if (swiper.isEnd) return;

    autoSwipeDoneRef.current = true;

    // slideNext moves to the next index — Swiper handles RTL direction internally
    const t1 = setTimeout(() => {
      swiper.slideNext(550);
      // After the forward slide completes, slide back
      const t2 = setTimeout(() => {
        swiper.slidePrev(450);
      }, 900);
      // Store t2 ref for cleanup (closure captures it)
      return t2; // not used for cleanup but keeps linter happy
    }, 800);

    return () => {
      clearTimeout(t1);
    };
  }, [swiper, loading, isLocked]);

  // Left button logic (visually points Left: <)
  // In RTL, moving to the left means advancing forward (slideNext).
  // In LTR, moving to the left means going backward (slidePrev).
  const handleLeftClick = () => {
    if (!swiper) return;
    if (isRtl) {
      swiper.slideNext();
    } else {
      swiper.slidePrev();
    }
  };
  const isLeftDisabled = isLocked || (isRtl ? isEnd : isBeginning);

  // Right button logic (visually points Right: >)
  // In RTL, moving to the right means going backward (slidePrev).
  // In LTR, moving to the right means advancing forward (slideNext).
  const handleRightClick = () => {
    if (!swiper) return;
    if (isRtl) {
      swiper.slidePrev();
    } else {
      swiper.slideNext();
    }
  };
  const isRightDisabled = isLocked || (isRtl ? isBeginning : isEnd);

  const navButtonSx = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: '50%',
    bgcolor: 'rgba(255, 255, 255, 0.96)',
    color: '#1B8354',
    border: '1px solid rgba(27, 131, 84, 0.2)',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      bgcolor: '#1B8354',
      color: '#ffffff',
      borderColor: '#1B8354',
      boxShadow: '0 6px 20px rgba(27, 131, 84, 0.35)',
      transform: 'translateY(-50%) scale(1.08)',
    },
    '&:active': {
      transform: 'translateY(-50%) scale(0.94)',
    },
    '&.Mui-disabled, &:disabled': {
      opacity: 0,
      pointerEvents: 'none',
      transform: 'translateY(-50%) scale(0.8)',
    },
  };

  // Skeleton Loader while fetching categories (preserves exact dimensions to prevent layout shifts)
  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#1A1A1A',
              borderInlineStart: '4px solid #1B8354',
              paddingInlineStart: 1.5,
            }}
          >
            {t('categories.title')}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ pb: '10px' }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid
              size={{ xs: 6, sm: 4, md: 3 }}
              key={item}
              sx={{
                display: {
                  xs: item > 2 ? 'none' : 'block',
                  sm: item > 3 ? 'none' : 'block',
                  md: 'block',
                },
              }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: '#ffffff',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  height: '100%',
                }}
              >
                <Skeleton
                  variant="rectangular"
                  sx={{
                    height: { xs: 130, sm: 165 },
                    bgcolor: '#edf3f0',
                  }}
                  animation="wave"
                />
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Skeleton
                    variant="text"
                    width="65%"
                    height={18}
                    animation="wave"
                    sx={{ bgcolor: '#e2ece7' }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <Fade in={!loading} timeout={400}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#1A1A1A',
              borderInlineStart: '4px solid #1B8354',
              paddingInlineStart: 1.5,
            }}
          >
            {t('categories.title')}
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {/* Left Arrow Button (Chevron pointing Left) */}
          <IconButton
            onClick={handleLeftClick}
            disabled={isLeftDisabled}
            aria-label={isRtl ? 'Next categories' : 'Previous categories'}
            sx={{
              ...navButtonSx,
              left: { xs: 2, sm: -18 },
            }}
          >
            <ChevronLeftRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>

          <Swiper
            dir={isRtl ? 'rtl' : 'ltr'}
            onSwiper={(s) => {
              setSwiper(s);
              updateSwiperState(s);
            }}
            onSlideChange={updateSwiperState}
            onResize={updateSwiperState}
            onTouchEnd={updateSwiperState}
            spaceBetween={16}
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
                  onClick={() => handleCategoryClick(cat)}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.04)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    height: '100%',
                    cursor: isBuyer ? 'pointer' : 'default',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': isBuyer ? {
                      borderColor: 'rgba(27, 131, 84, 0.25)',
                      boxShadow: '0 6px 22px rgba(27, 131, 84, 0.1)',
                      transform: 'translateY(-3px)',
                    } : {},
                    '&:hover .category-image': isBuyer ? {
                      transform: 'scale(1.06)',
                    } : {},
                  }}
                >
                  <Box
                    sx={{
                      overflow: 'hidden',
                      height: { xs: 130, sm: 165 },
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
                          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <CardContent sx={{ textAlign: locale === 'ar' ? 'right' : 'left', py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        color: '#1A1A1A',
                        lineHeight: 1.3,
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

          {/* Right Arrow Button (Chevron pointing Right) */}
          <IconButton
            onClick={handleRightClick}
            disabled={isRightDisabled}
            aria-label={isRtl ? 'Previous categories' : 'Next categories'}
            sx={{
              ...navButtonSx,
              right: { xs: 2, sm: -18 },
            }}
          >
            <ChevronRightRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
      </Box>
    </Fade>
  );
}
