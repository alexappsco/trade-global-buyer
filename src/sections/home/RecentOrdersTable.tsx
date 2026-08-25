'use client';

import React from 'react';
import { Box, Card, Typography, Button, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

import SharedTable from '@/components/SharedTable/SharedTable';
import { headCellType, cellAlignment, Action } from '@/components/SharedTable/types';
import { ordersMock, Order } from '@/mocks/orders-data';

const statusColors: Record<string, { bg: string; color: string }> = {
  open: { bg: '#EBF7F2', color: '#1B8354' },
  closed: { bg: '#FCEAEA', color: '#D94141' },
};

export default function RecentOrdersTable() {
  const tHome = useTranslations('Home');
  const tOrders = useTranslations('Orders');

  const tableHead: headCellType[] = [
    { id: 'id', label: tOrders('table.order_id'), align: cellAlignment.right, width: 100 },
    { id: 'title', label: tOrders('table.order_title'), align: cellAlignment.right },
    { id: 'category', label: tOrders('table.category'), align: cellAlignment.right },
    { id: 'classification', label: tOrders('table.classification'), align: cellAlignment.right },
    { id: 'deliveryDate', label: tOrders('table.delivery_date'), align: cellAlignment.right },
    { id: 'createdAt', label: tOrders('table.creation_date'), align: cellAlignment.right },
    { id: 'status', label: tOrders('table.status'), align: cellAlignment.center },
  ];

  const customRender = {
    status: (row: Order) => {
      const styles = statusColors[row.status] ?? statusColors.open;
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={tOrders(`status.${row.status}`)}
            size="small"
            sx={{
              bgcolor: styles.bg,
              color: styles.color,
              fontWeight: 'bold',
              borderRadius: 1.5,
            }}
          />
        </Box>
      );
    },
  };

  const actions: Action<Order>[] = [
    {
      label: tOrders('table.action_view'),
      icon: <RemoveRedEyeOutlinedIcon sx={{ fontSize: 18 }} />,
      onClick: (row) => {
        console.log('View order', row.id);
      },
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          bgcolor: '#E4ECE8',
          p: 2,
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#1B8354',
            '&:hover': { bgcolor: '#146440' },
            borderRadius: 2,
            px: 3,
            boxShadow: 'none',
            fontWeight: 'bold',
          }}
        >
          {tHome('recent_orders.add_new')}
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
          {tHome('recent_orders.title')}
        </Typography>
      </Box>

      <Card elevation={0} sx={{ borderRadius: 3, p: 2, bgcolor: '#ffffff' }}>
        <SharedTable
          data={ordersMock}
          tableHead={tableHead}
          actions={actions}
          customRender={customRender}
          count={ordersMock.length}
        />
      </Card>
    </Box>
  );
}
