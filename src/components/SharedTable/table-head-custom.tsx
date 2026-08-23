import { useTranslations } from 'next-intl';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

import { headCellType } from './types';

// ----------------------------------------------------------------------

type Props = {
  headLabel: headCellType[];
  enableActions?: boolean;
};

export default function TableHeadCustom({ headLabel, enableActions = false }: Props) {
  const t = useTranslations();
  return (
    <TableHead>
      <TableRow sx={{ bgcolor: '#F4F6F8' }}>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sx={{
              width: headCell.width,
              whiteSpace: 'nowrap',
              borderBottom: 'none',
              color: '#6b7280',
              fontWeight: 600,
            }}
          >
            {headCell?.label ? t(headCell?.label) : ''}
          </TableCell>
        ))}
        {enableActions && <TableCell sx={{ whiteSpace: 'nowrap', borderBottom: 'none' }} />}
      </TableRow>
    </TableHead>
  );
}
