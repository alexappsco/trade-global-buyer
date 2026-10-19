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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        gap: 1,
        px: { xs: 1, sm: 2 },
        py: 0.5,
        borderTop: '1px solid rgba(145, 158, 171, 0.12)',
        ...sx,
      }}
    >
      {onChangeDense && (
        <FormControlLabel
          label={t('Global.Sections.Table.dense') || 'Dense'}
          control={<Switch checked={dense} onChange={onChangeDense} size="small" />}
          sx={{
            m: 0,
            display: 'flex',
            alignItems: 'center',
            '& .MuiFormControlLabel-label': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            },
          }}
        />
      )}

      <TablePagination
        {...other}
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        sx={{
          flex: 1,
          borderTop: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          '& .MuiTablePagination-toolbar': {
            minHeight: { xs: 40, sm: 48 },
            padding: 0,
            gap: { xs: 0.5, sm: 1 },
            flexWrap: 'nowrap',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiTablePagination-spacer': {
            flex: { xs: 0, sm: 'none' },
            display: { xs: 'none', sm: 'block' },
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            whiteSpace: 'nowrap',
            m: 0,
          },
          '& .MuiTablePagination-select': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          },
          '& .MuiTablePagination-actions': {
            flexShrink: 0,
          },
        }}
      />
    </Box>
  );
}
