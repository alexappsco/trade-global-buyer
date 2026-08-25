'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Box,
  Card,
  Menu,
  Button,
  MenuItem,
  Checkbox,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { cellAlignment } from 'src/components/SharedTable/types';
import { MOCK_QUOTATION_REQUESTS, QuotationRequest } from './quotations-mock';

export default function QuotationsListView() {
  const t = useTranslations('Quotations');
  const tOrders = useTranslations('Orders');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Dropdown Anchors
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [classificationAnchor, setClassificationAnchor] = useState<null | HTMLElement>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);

  // Localized values mapping helper
  const translateValue = (val: string) => {
    if (locale === 'en') {
      switch (val) {
        case 'شاشات كمبيوتر': return 'Computer Screens';
        case 'أجهزة كمبيوتر': return 'Computers';
        case 'شاشات': return 'Screens';
        case 'مفتوح': return 'Open';
        case 'مغلق': return 'Closed';
        case 'تقديم عرض سعر': return 'Submit Quote';
        case 'لا يمكن تقديم عرض': return 'Cannot Submit';
        case 'اطلاع على العرض الذي قدمته': return 'View Submitted Offer';
        case 'الكل': return 'All';
        default: return val;
      }
    }
    return val;
  };

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    return MOCK_QUOTATION_REQUESTS.filter((req) => {
      // Search matches
      const matchesSearch =
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.orderNumber.includes(searchQuery);

      // Dropdown matches
      const matchesCategory =
        !selectedCategory || selectedCategory === 'الكل' || req.category === selectedCategory;

      const matchesClassification =
        !selectedClassification ||
        selectedClassification === 'الكل' ||
        req.classification === selectedClassification;

      const matchesDate =
        !selectedDate || selectedDate === 'الكل' || req.creationDate.startsWith(selectedDate);

      const matchesStatus =
        !selectedStatus ||
        selectedStatus === 'الكل' ||
        (selectedStatus === 'مفتوح' && req.status === 'open') ||
        (selectedStatus === 'مغلق' && req.status === 'closed');

      return matchesSearch && matchesCategory && matchesClassification && matchesDate && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedClassification, selectedDate, selectedStatus]);

  // Headers for SharedTable
  const tableHead = [
    { id: 'select', label: '', align: cellAlignment.left },
    { id: 'orderNumber', label: 'Orders.table.order_id', align: cellAlignment.center },
    { id: 'title', label: 'Orders.table.order_title', align: cellAlignment.left },
    { id: 'category', label: 'Orders.table.category', align: cellAlignment.left },
    { id: 'classification', label: 'Orders.table.classification', align: cellAlignment.left },
    { id: 'quantity', label: 'Quotations.table.quantity', align: cellAlignment.center },
    { id: 'deliveryDate', label: 'Orders.table.delivery_date', align: cellAlignment.left },
    { id: 'creationDate', label: 'Orders.table.creation_date', align: cellAlignment.left },
    { id: 'status', label: 'Orders.table.status', align: cellAlignment.left },
    { id: 'actions_cell', label: 'Quotations.table.actions', align: cellAlignment.center },
  ];

  // Custom cell renders for SharedTable
  const customRender = {
    select: (row: QuotationRequest) => (
      <Checkbox
        size="small"
        checked={selectedRows.includes(row.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRows((prev) => [...prev, row.id]);
          } else {
            setSelectedRows((prev) => prev.filter((id) => id !== row.id));
          }
        }}
        sx={{ color: '#C4CDD5', '&.Mui-checked': { color: '#006838' } }}
      />
    ),
    title: (row: QuotationRequest) => translateValue(row.title),
    category: (row: QuotationRequest) => translateValue(row.category),
    classification: (row: QuotationRequest) => translateValue(row.classification),
    status: (row: QuotationRequest) => (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          px: 1.5,
          py: 0.5,
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 700,
          bgcolor: row.status === 'open' ? 'rgba(0, 104, 56, 0.08)' : 'rgba(255, 59, 48, 0.08)',
          color: row.status === 'open' ? '#006838' : '#FF3B30',
        }}
      >
        {row.status === 'open' ? tOrders('status.open') : tOrders('status.closed')}
      </Box>
    ),
    actions_cell: (row: QuotationRequest) => {
      if (row.actionType === 'submit') {
        return (
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#10754E',
              color: 'white',
              fontWeight: 700,
              borderRadius: '4px',
              fontSize: '0.75rem',
              px: 2,
              py: 0.75,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0c5b3c', boxShadow: 'none' },
            }}
          >
            {t('table.submit_quote')}
          </Button>
        );
      }
      if (row.actionType === 'cannot_submit') {
        return (
          <Typography
            variant="subtitle2"
            sx={{
              color: '#FF3B30',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            {t('table.cannot_submit')}
          </Typography>
        );
      }
      return (
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#0B5A3C',
            color: 'white',
            fontWeight: 700,
            borderRadius: '4px',
            fontSize: '0.75rem',
            px: 2,
            py: 0.75,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#094730', boxShadow: 'none' },
          }}
        >
          {t('table.view_quote')}
        </Button>
      );
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Banner */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: 2,
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#161C24' }}>
          {t('title')}
        </Typography>
      </Box>

      {/* Filter and Table Card */}
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #F4F6F8',
        }}
      >
        {/* Filter Toolbar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap-reverse',
            gap: 2,
            mb: 3,
          }}
        >
          {/* Filter Dropdowns (Left in RTL) */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            
            {/* Category Dropdown */}
            <Button
              variant="outlined"
              onClick={(e) => setCategoryAnchor(e.currentTarget)}
              endIcon={<Iconify icon="eva:chevron-down-fill" width={16} sx={{ ml: 1.5 }} />}
              sx={{
                borderColor: '#EAEFEA',
                color: '#637381',
                borderRadius: '8px',
                px: 2.5,
                py: 1,
                fontWeight: 600,
                '&:hover': { borderColor: '#B7CBB7', bgcolor: 'transparent' },
              }}
            >
              {selectedCategory ? translateValue(selectedCategory) : tOrders('filter_category')}
            </Button>
            <Menu
              anchorEl={categoryAnchor}
              open={Boolean(categoryAnchor)}
              onClose={() => setCategoryAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setSelectedCategory(null);
                  setCategoryAnchor(null);
                }}
              >
                {translateValue('الكل')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedCategory('أجهزة كمبيوتر');
                  setCategoryAnchor(null);
                }}
              >
                {translateValue('أجهزة كمبيوتر')}
              </MenuItem>
            </Menu>

            {/* Classification Dropdown */}
            <Button
              variant="outlined"
              onClick={(e) => setClassificationAnchor(e.currentTarget)}
              endIcon={<Iconify icon="eva:chevron-down-fill" width={16} sx={{ ml: 1.5 }} />}
              sx={{
                borderColor: '#EAEFEA',
                color: '#637381',
                borderRadius: '8px',
                px: 2.5,
                py: 1,
                fontWeight: 600,
                '&:hover': { borderColor: '#B7CBB7', bgcolor: 'transparent' },
              }}
            >
              {selectedClassification ? translateValue(selectedClassification) : tOrders('filter_classification')}
            </Button>
            <Menu
              anchorEl={classificationAnchor}
              open={Boolean(classificationAnchor)}
              onClose={() => setClassificationAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setSelectedClassification(null);
                  setClassificationAnchor(null);
                }}
              >
                {translateValue('الكل')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedClassification('شاشات');
                  setClassificationAnchor(null);
                }}
              >
                {translateValue('شاشات')}
              </MenuItem>
            </Menu>

            {/* Date Dropdown */}
            <Button
              variant="outlined"
              onClick={(e) => setDateAnchor(e.currentTarget)}
              startIcon={<Iconify icon="solar:calendar-bold" width={18} sx={{ mr: 1.5 }} />}
              endIcon={<Iconify icon="eva:chevron-down-fill" width={16} sx={{ ml: 1.5 }} />}
              sx={{
                borderColor: '#EAEFEA',
                color: '#637381',
                borderRadius: '8px',
                px: 2.5,
                py: 1,
                fontWeight: 600,
                '&:hover': { borderColor: '#B7CBB7', bgcolor: 'transparent' },
              }}
            >
              {selectedDate ? translateValue(selectedDate) : tOrders('filter_date')}
            </Button>
            <Menu
              anchorEl={dateAnchor}
              open={Boolean(dateAnchor)}
              onClose={() => setDateAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setSelectedDate(null);
                  setDateAnchor(null);
                }}
              >
                {translateValue('الكل')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedDate('2025-11-10');
                  setDateAnchor(null);
                }}
              >
                2025-11-10
              </MenuItem>
            </Menu>

            {/* Status Dropdown */}
            <Button
              variant="outlined"
              onClick={(e) => setStatusAnchor(e.currentTarget)}
              endIcon={<Iconify icon="eva:chevron-down-fill" width={16} sx={{ ml: 1.5 }} />}
              sx={{
                borderColor: '#EAEFEA',
                color: '#637381',
                borderRadius: '8px',
                px: 2.5,
                py: 1,
                fontWeight: 600,
                '&:hover': { borderColor: '#B7CBB7', bgcolor: 'transparent' },
              }}
            >
              {selectedStatus ? translateValue(selectedStatus) : tOrders('filter_status')}
            </Button>
            <Menu
              anchorEl={statusAnchor}
              open={Boolean(statusAnchor)}
              onClose={() => setStatusAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setSelectedStatus(null);
                  setStatusAnchor(null);
                }}
              >
                {translateValue('الكل')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedStatus('مفتوح');
                  setStatusAnchor(null);
                }}
              >
                {translateValue('مفتوح')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedStatus('مغلق');
                  setStatusAnchor(null);
                }}
              >
                {translateValue('مغلق')}
              </MenuItem>
            </Menu>

          </Box>

          {/* Search Box (Right in RTL) */}
          <TextField
            size="small"
            placeholder={tOrders('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" width={20} sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: { xs: '100%', sm: 260 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                borderColor: '#EAEFEA',
              },
            }}
          />
        </Box>

        {/* Table wrapper */}
        <SharedTable
          data={filteredRequests}
          tableHead={tableHead}
          count={1000}
          customRender={customRender}
        />
      </Card>
    </Box>
  );
}
