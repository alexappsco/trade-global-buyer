'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

interface CategoryDropAnimationProps {
  categoryName: string;
  categoryImg?: string;
  isRtl?: boolean;
  onComplete?: () => void;
}

export default function CategoryDropAnimation({
  categoryName,
  categoryImg,
  isRtl = true,
  onComplete,
}: CategoryDropAnimationProps) {
  const [stage, setStage] = useState<'flying' | 'landed' | 'finished'>('flying');

  useEffect(() => {
    // Stage 1: Flying down (0 to 650ms)
    // Stage 2: Landed with shockwave and particles (650ms to 1250ms)
    const tLanded = setTimeout(() => {
      setStage('landed');
    }, 650);

    // Stage 3: Finished, remove overlay
    const tFinish = setTimeout(() => {
      setStage('finished');
      onComplete?.();
    }, 1300);

    return () => {
      clearTimeout(tLanded);
      clearTimeout(tFinish);
    };
  }, [onComplete]);

  if (stage === 'finished') return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      {/* 1. Flying / Thrown 3D Capsule */}
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          px: 2,
          py: 0.9,
          borderRadius: '50px',
          background: 'linear-gradient(135deg, #1E8E59 0%, #136a3e 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.45)',
          boxShadow: '0 16px 36px rgba(27, 131, 84, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          color: '#ffffff',
          willChange: 'transform, opacity',
          animation: `${isRtl ? 'throwAndSlamRtl' : 'throwAndSlamLtr'} 0.75s cubic-bezier(0.25, 1, 0.35, 1) forwards`,
          transformOrigin: 'center center',
          '@keyframes throwAndSlamRtl': {
            '0%': {
              transform: 'translate3d(-220px, -260px, 0) scale(1.75) rotate(18deg)',
              opacity: 0,
              filter: 'drop-shadow(0 25px 40px rgba(27, 131, 84, 0.6))',
            },
            '15%': {
              opacity: 1,
            },
            '55%': {
              transform: 'translate3d(-40px, -50px, 0) scale(1.2) rotate(-5deg)',
              opacity: 1,
            },
            '80%': {
              /* Impact */
              transform: 'translate3d(0, 0, 0) scale(0.92) rotate(0deg)',
              opacity: 1,
            },
            '92%': {
              transform: 'translate3d(0, 0, 0) scale(1.04) rotate(0deg)',
              opacity: 0.9,
            },
            '100%': {
              transform: 'translate3d(0, 0, 0) scale(0.8) rotate(0deg)',
              opacity: 0,
            },
          },
          '@keyframes throwAndSlamLtr': {
            '0%': {
              transform: 'translate3d(220px, -260px, 0) scale(1.75) rotate(-18deg)',
              opacity: 0,
              filter: 'drop-shadow(0 25px 40px rgba(27, 131, 84, 0.6))',
            },
            '15%': {
              opacity: 1,
            },
            '55%': {
              transform: 'translate3d(40px, -50px, 0) scale(1.2) rotate(5deg)',
              opacity: 1,
            },
            '80%': {
              /* Impact */
              transform: 'translate3d(0, 0, 0) scale(0.92) rotate(0deg)',
              opacity: 1,
            },
            '92%': {
              transform: 'translate3d(0, 0, 0) scale(1.04) rotate(0deg)',
              opacity: 0.9,
            },
            '100%': {
              transform: 'translate3d(0, 0, 0) scale(0.8) rotate(0deg)',
              opacity: 0,
            },
          },
        }}
      >
        {categoryImg ? (
          <Box
            component="img"
            src={categoryImg}
            alt={categoryName}
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
        ) : (
          <AutoAwesomeRoundedIcon sx={{ fontSize: 20, color: '#FCD34D' }} />
        )}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '13.5px',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }}
        >
          {categoryName}
        </Typography>
      </Box>

      {/* 2. Impact Shockwave Ripple */}
      {stage === 'landed' && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            border: '2px solid #1E8E59',
            animation: 'shockwaveRipple 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            '@keyframes shockwaveRipple': {
              '0%': {
                transform: 'scale(0.85)',
                opacity: 1,
                boxShadow: '0 0 0 0 rgba(30, 142, 89, 0.7)',
              },
              '100%': {
                transform: 'scale(1.25)',
                opacity: 0,
                boxShadow: '0 0 24px 8px rgba(30, 142, 89, 0)',
              },
            },
          }}
        />
      )}

      {/* 3. Radial Particle Burst (Sparks) */}
      {stage === 'landed' && (
        <Box sx={{ position: 'absolute', width: 0, height: 0 }}>
          {[
            { id: 1, anim: 'sparkP1', color: '#10B981', size: 7 },
            { id: 2, anim: 'sparkP2', color: '#FBBF24', size: 6 },
            { id: 3, anim: 'sparkP3', color: '#34D399', size: 8 },
            { id: 4, anim: 'sparkP4', color: '#10B981', size: 6 },
            { id: 5, anim: 'sparkP5', color: '#FCD34D', size: 7 },
            { id: 6, anim: 'sparkP6', color: '#6EE7B7', size: 6 },
          ].map((spark) => (
            <Box
              key={spark.id}
              sx={{
                position: 'absolute',
                width: spark.size,
                height: spark.size,
                borderRadius: '50%',
                bgcolor: spark.color,
                boxShadow: `0 0 8px ${spark.color}`,
                animation: `${spark.anim} 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
                '@keyframes sparkP1': {
                  '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                  '30%': { opacity: 1 },
                  '100%': { transform: 'translate(-42px, -30px) scale(1)', opacity: 0 },
                },
                '@keyframes sparkP2': {
                  '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                  '30%': { opacity: 1 },
                  '100%': { transform: 'translate(42px, -30px) scale(1)', opacity: 0 },
                },
                '@keyframes sparkP3': {
                  '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                  '30%': { opacity: 1 },
                  '100%': { transform: 'translate(-48px, 22px) scale(1)', opacity: 0 },
                },
                '@keyframes sparkP4': {
                  '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                  '30%': { opacity: 1 },
                  '100%': { transform: 'translate(48px, 22px) scale(1)', opacity: 0 },
                },
                '@keyframes sparkP5': {
                  '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                  '30%': { opacity: 1 },
                  '100%': { transform: 'translate(0px, -42px) scale(1)', opacity: 0 },
                },
                '@keyframes sparkP6': {
                  '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                  '30%': { opacity: 1 },
                  '100%': { transform: 'translate(0px, 36px) scale(1)', opacity: 0 },
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
