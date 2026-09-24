'use client';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { headCellType } from './types';

type Props = {
  tableHead: headCellType[];
  rowCount?: number;
  enableActions?: boolean;
};

export default function TableSkeleton({ tableHead, rowCount = 5, enableActions = false }: Props) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          {tableHead.map((col, colIndex) => (
            <TableCell key={col.id || colIndex} align={col.align || 'left'} sx={{ py: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start',
                }}
              >
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={colIndex === 0 ? '40%' : colIndex === 1 ? '75%' : '60%'}
                  height={22}
                  sx={{ borderRadius: '6px', bgcolor: 'rgba(0, 0, 0, 0.04)' }}
                />
              </Box>
            </TableCell>
          ))}
          {enableActions && (
            <TableCell align="center" sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={28}
                  height={28}
                  sx={{ borderRadius: '50%', bgcolor: 'rgba(0, 0, 0, 0.04)' }}
                />
              </Box>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
}
