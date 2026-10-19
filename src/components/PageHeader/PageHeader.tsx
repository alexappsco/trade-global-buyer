'use client';

import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from 'src/i18n/routing';
import Iconify from 'src/components/iconify';

export type Crumb = {
  label: React.ReactNode;
  href?: string;
};

type PageHeaderProps = {
  title: React.ReactNode;
  crumbs?: Crumb[];
  action?: React.ReactNode;
  back?: string | (() => void) | null;
  showHome?: boolean;
};

export default function PageHeader({
  title,
  crumbs = [],
  action,
  back,
  showHome = true,
}: PageHeaderProps) {
  const t = useTranslations('Global.PageHeader');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const separator = (
    <Iconify
      icon="eva:chevron-right-fill"
      width={11}
      sx={{ color: '#AAB7B0', flexShrink: 0, transform: isRtl ? 'rotate(180deg)' : 'none' }}
    />
  );

  const handleBack = () => {
    if (typeof back === 'function') {
      back();
    } else if (typeof back === 'string') {
      router.push(back);
    } else {
      router.back();
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: { xs: 1, sm: 1.5 },
        bgcolor: '#FFFFFF',
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #F4F9F6 100%)',
        border: '1px solid #E4ECE7',
        borderRadius: { xs: '12px', sm: '14px' },
        boxShadow: '0 1px 2px rgba(16, 117, 78, 0.05)',
        paddingInlineStart: { xs: '14px', sm: '20px' },
        paddingInlineEnd: { xs: 1.25, sm: 2.5 },
        py: { xs: 1, sm: 1.25 },
        minHeight: { xs: 56, sm: 68 },
      }}
    >
      {/* Accent bar */}
      <Box
        sx={{
          position: 'absolute',
          insetInlineStart: 0,
          top: 8,
          bottom: 8,
          width: { xs: 3, sm: 4 },
          borderRadius: '0 4px 4px 0',
          bgcolor: '#10754E',
        }}
      />

      {/* Left: breadcrumb + title */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 0.25, sm: 0.5 },
          minWidth: 0,
          flex: '1 1 auto',
        }}
      >
        {/* Breadcrumb */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            overflow: 'hidden',
            gap: 0.75,
            minHeight: 18,
          }}
        >
          {showHome && (
            <>
              <Box
                component={Link}
                href="/"
                title={t('home')}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: '#6B7A74',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: '#10754E' },
                }}
              >
                <Iconify icon="solar:home-2-bold" width={13} />
                {t('home')}
              </Box>
              {crumbs.length > 0 && separator}
            </>
          )}

          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const isMiddle = !isLast && index > 0;
            return (
              <React.Fragment key={index}>
                {crumb.href ? (
                  <Box
                    component={Link}
                    href={crumb.href}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '#6B7A74',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      fontWeight: 500,
                      lineHeight: 1.2,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'color 0.15s ease',
                      ...(isMiddle && { display: { xs: 'none', sm: 'inline-flex' } }),
                      '&:hover': { color: '#10754E' },
                    }}
                  >
                    {crumb.label}
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      color: '#6B7A74',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      fontWeight: 500,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      ...(isMiddle && { display: { xs: 'none', sm: 'block' } }),
                    }}
                  >
                    {crumb.label}
                  </Typography>
                )}
                {!isMiddle && index < crumbs.length - 1 && separator}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Title row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
          {back !== null && (
            <IconButton
              onClick={handleBack}
              aria-label={t('back')}
              size="small"
              sx={{
                width: { xs: 28, sm: 34 },
                height: { xs: 28, sm: 34 },
                flexShrink: 0,
                borderRadius: '50%',
                bgcolor: '#10754E',
                color: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(16, 117, 78, 0.28)',
                p: 0.25,
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: '#0C5B3C' },
                '&:active': { transform: 'scale(0.94)' },
              }}
            >
              <Iconify
                icon="solar:arrow-left-bold"
                sx={{ width: { xs: 15, sm: 17 }, height: { xs: 15, sm: 17 }, transform: isRtl ? 'rotate(180deg)' : 'none' }}
              />
            </IconButton>
          )}

          <Typography
            sx={{
              color: '#13201A',
              fontSize: { xs: '0.95rem', sm: '1.125rem' },
              fontWeight: 700,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word',
              minWidth: 0,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Actions */}
      {action && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            '& > *': { flex: { xs: '1 1 100%', sm: '0 0 auto' } },
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  );
}