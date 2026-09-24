import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LocaleLoading() {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, pointerEvents: 'none' }}>
      <LinearProgress
        sx={{
          height: 3,
          bgcolor: 'transparent',
          '& .MuiLinearProgress-bar': { bgcolor: '#10754E' },
        }}
      />
    </Box>
  );
}