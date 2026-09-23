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
        gap: 1.5,
        bgcolor: '#FFFFFF',
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #F4F9F6 100%)',
        border: '1px solid #E4ECE7',
        borderRadius: '14px',
        boxShadow: '0 1px 2px rgba(16, 117, 78, 0.05)',
        paddingInlineStart: '20px',
        paddingInlineEnd: { xs: 1.5, sm: 2.5 },
        py: 1.25,
        minHeight: 68,
      }}
    >
      {/* Accent bar */}
      <Box
        sx={{
          position: 'absolute',
          insetInlineStart: 0,
          top: 8,
          bottom: 8,
          width: 4,
          borderRadius: '0 4px 4px 0',
          bgcolor: '#10754E',
        }}
      />

      {/* Left: breadcrumb + title */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.25, sm: 0.5 }, minWidth: 0 }}>
        {/* Breadcrumb */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
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

          {crumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.href ? (
                <Box
                  component={Link}
                  href={crumb.href}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
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
                  {crumb.label}
                </Box>
              ) : (
                <Typography
                  sx={{
                    color: '#6B7A74',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {crumb.label}
                </Typography>
              )}
              {index < crumbs.length - 1 && separator}
            </React.Fragment>
          ))}
        </Box>

        {/* Title row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          {back !== null && (
            <IconButton
              onClick={handleBack}
              aria-label={t('back')}
              size="small"
              sx={{
                width: 34,
                height: 34,
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
                width={17}
                sx={{ transform: isRtl ? 'rotate(180deg)' : 'none' }}
              />
            </IconButton>
          )}

          <Typography
            sx={{
              color: '#13201A',
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 700,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Actions */}
      {action && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {action}
        </Box>
      )}
    </Box>
  );
}