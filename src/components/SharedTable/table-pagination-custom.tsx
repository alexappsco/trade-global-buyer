import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { useTranslations } from 'next-intl';
import { Theme, SxProps } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import TablePagination, { TablePaginationProps } from '@mui/material/TablePagination';

import { tableRowsPerPageOptions } from '../constant';

// ----------------------------------------------------------------------

type Props = {
  dense?: boolean;
  onChangeDense?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps<Theme>;
};

export default function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = tableRowsPerPageOptions,
  sx,
  ...other
}: Props & TablePaginationProps) {
  const t = useTranslations();
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        {...other}
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        sx={{
          borderTopColor: 'transparent',
          flexWrap: 'wrap',
          '& .MuiTablePagination-toolbar': {
            flexWrap: 'wrap',
            gap: 0.5,
            minHeight: { xs: 40, sm: 52 },
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          },
          '& .MuiTablePagination-select': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          },
        }}
      />

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} size="small" />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            display: { xs: 'none', lg: 'flex' },
            position: {
              lg: 'absolute',
            },
          }}
        />
      )}
    </Box>
  );
}
