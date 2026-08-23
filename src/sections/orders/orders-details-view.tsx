'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'src/i18n/routing';
import {
  Box,
  Card,
  Table,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Collapse,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { getOrderById, OfferItem } from './orders-mock';

interface Props {
  id: string;
}

export default function OrdersDetailsView({ id }: Props) {
  const t = useTranslations('Orders');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const order = useMemo(() => getOrderById(id), [id]);

  // Alert State
  const [showAlert, setShowAlert] = useState(true);

  // Offers Table State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Dropdown Anchors
  const [priceAnchor, setPriceAnchor] = useState<null | HTMLElement>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);
  const [deliveryAnchor, setDeliveryAnchor] = useState<null | HTMLElement>(null);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);

  // Localized Values Helpers
  const translateValue = (val: string) => {
    if (locale === 'en') {
      switch (val) {
        case 'لابتوب': return 'Laptop';
        case 'ماوس': return 'Mouse';
        case 'كيبورد': return 'Keyboard';
        case 'التفاصيل': return 'Details';
        case 'مورد ١': return 'Supplier 1';
        case 'مورد ٢': return 'Supplier 2';
        case 'مورد ٣': return 'Supplier 3';
        case 'الرياض': return 'Riyadh';
        case 'مجاني': return 'Free';
        case 'مفتوح': return 'Open';
        case 'مغلق': return 'Closed';
        default: return val;
      }
    }
    return val;
  };

  const getStatusText = (status: 'accepted' | 'rejected' | 'closed') => {
    switch (status) {
      case 'accepted':
        return t('details.offers.accepted');
      case 'rejected':
        return t('details.offers.rejected');
      case 'closed':
        return t('details.offers.closed');
      default:
        return status;
    }
  };

  const getStatusColor = (status: 'accepted' | 'rejected' | 'closed') => {
    switch (status) {
      case 'accepted':
        return '#00B8D9'; // Blue / Info
      case 'rejected':
        return '#FF3B30'; // Red / Error
      case 'closed':
        return '#637381'; // Grey
      default:
        return 'text.primary';
    }
  };

  // Filtered Offers
  const filteredOffers = useMemo(() => {
    if (!order.offers) return [];

    return order.offers.filter((offer) => {
      const matchesSearch =
        offer.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translateValue(offer.supplier).toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translateValue(offer.address).toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPrice = !selectedPrice || String(offer.total) === selectedPrice;
      const matchesDate = !selectedDate || offer.date.startsWith(selectedDate);
      const matchesDelivery =
        !selectedDelivery ||
        (selectedDelivery === 'free' && offer.delivery === 'مجاني') ||
        (selectedDelivery === 'paid' && offer.delivery !== 'مجاني');
      const matchesStatus = !selectedStatus || offer.status === selectedStatus;

      return matchesSearch && matchesPrice && matchesDate && matchesDelivery && matchesStatus;
    });
  }, [order.offers, searchQuery, selectedPrice, selectedDate, selectedDelivery, selectedStatus, locale]);

  // Checkbox row select
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredOffers.map((o) => o.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (offerId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, offerId]);
    } else {
      setSelectedRows((prev) => prev.filter((rid) => rid !== offerId));
    }
  };

  const isAllSelected =
    filteredOffers.length > 0 && selectedRows.length === filteredOffers.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Alert Warning Box */}
      <Collapse in={showAlert}>
        <Box
          sx={{
            bgcolor: '#FFF9E6',
            border: '1px solid #FFE699',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Iconify
              icon="solar:danger-triangle-bold"
              width={24}
              sx={{ color: '#FFAB00', mt: 0.25 }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#7A4100', mb: 0.5 }}>
                {t('details.alert_title')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7A4100', lineHeight: 1.6 }}>
                {t('details.alert_message')}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setShowAlert(false)} sx={{ color: '#7A4100' }}>
            <Iconify icon="eva:close-fill" width={18} />
          </IconButton>
        </Box>
      </Collapse>

      {/* Order Title Banner */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: 2,
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#161C24',
          }}
        >
          {t('details.title', { id: order.id })}
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push('/orders')}
          sx={{
            bgcolor: '#FF3B30',
            color: 'white',
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#d32f2f',
              boxShadow: 'none',
            },
          }}
        >
          {t('details.close')}
        </Button>
      </Box>

      {/* Order Info Card */}
      <Card
        sx={{
          borderRadius: 3,
          p: 3,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #F4F6F8',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 120 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.order_id')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36' }}>
              {order.orderNumber}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 120 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.created_at')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36' }}>
              {order.creationDate}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 120 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.delivery_date')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36' }}>
              {order.deliveryDate}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 120 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.status')}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: '#006838',
              }}
            >
              {order.status === 'open' ? t('status.open') : t('status.closed')}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Order Items Table Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #F4F6F8',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.item')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.qty')}
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.details')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items?.map((item, idx) => (
                <TableRow key={idx} hover>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#006838', textDecoration: 'underline', cursor: 'pointer' }}>
                    {translateValue(item.name)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {item.qty}
                  </TableCell>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ color: 'text.secondary' }}>
                    {t('details.table.detail_link')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Submitted Offers Section Title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRight: isRtl ? '4px solid #10754E' : 'none',
          borderLeft: isRtl ? 'none' : '4px solid #10754E',
          pr: isRtl ? 1.5 : 0,
          pl: isRtl ? 0 : 1.5,
          mt: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#161C24' }}>
          {t('details.offers_title')}
        </Typography>
      </Box>

      {/* Offers Card (Search & Filters + Table) */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #F4F6F8',
          overflow: 'visible',
        }}
      >
        
        {/* Offers Search & Filters Row */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Search Input (DOM first so it aligns on the right in RTL) */}
          <TextField
            size="small"
            placeholder={t('search')}
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
                bgcolor: '#F9FAFB',
                '& fieldset': { borderColor: '#EAEFEA' },
                '&:hover fieldset': { borderColor: '#DFE3E8' },
              },
            }}
          />

          {/* Filters List */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            
            {/* Price Filter */}
            <Button
              variant="outlined"
              onClick={(e) => setPriceAnchor(e.currentTarget)}
              startIcon={<Iconify icon="solar:filter-bold-duotone" width={16} />}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={14} />}
              sx={{
                borderRadius: '24px',
                borderColor: '#DFE3E8',
                color: '#212B36',
                fontWeight: 500,
                fontSize: '0.875rem',
                px: 2,
                py: 0.75,
                textTransform: 'none',
                '&:hover': { borderColor: '#C4CDD5', bgcolor: '#F4F6F8' },
              }}
            >
              {selectedPrice ? selectedPrice : t('details.filters.price')}
            </Button>
            <Menu
              anchorEl={priceAnchor}
              open={Boolean(priceAnchor)}
              onClose={() => setPriceAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setSelectedPrice(null);
                  setPriceAnchor(null);
                }}
                selected={selectedPrice === null}
              >
                {locale === 'ar' ? 'الكل' : 'All'}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedPrice('5000');
                  setPriceAnchor(null);
                }}
                selected={selectedPrice === '5000'}
              >
                5000
              </MenuItem>
            </Menu>

            {/* Date Filter */}
            <Button
              variant="outlined"
              onClick={(e) => setDateAnchor(e.currentTarget)}
              startIcon={<Iconify icon="solar:calendar-minimum-outline" width={16} />}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={14} />}
              sx={{
                borderRadius: '24px',
                borderColor: '#DFE3E8',
                color: '#212B36',
                fontWeight: 500,
                fontSize: '0.875rem',
                px: 2,
                py: 0.75,
                textTransform: 'none',
                '&:hover': { borderColor: '#C4CDD5', bgcolor: '#F4F6F8' },
              }}
            >
              {selectedDate ? selectedDate : t('filter_date')}
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
                selected={selectedDate === null}
              >
                {locale === 'ar' ? 'الكل' : 'All'}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedDate('2025-11-10');
                  setDateAnchor(null);
                }}
                selected={selectedDate === '2025-11-10'}
              >
                2025-11-10
              </MenuItem>
            </Menu>

            {/* Delivery Filter */}
            <Button
              variant="outlined"
              onClick={(e) => setDeliveryAnchor(e.currentTarget)}
              startIcon={<Iconify icon="solar:filter-bold-duotone" width={16} />}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={14} />}
              sx={{
                borderRadius: '24px',
                borderColor: '#DFE3E8',
                color: '#212B36',
                fontWeight: 500,
                fontSize: '0.875rem',
                px: 2,
                py: 0.75,
                textTransform: 'none',
                '&:hover': { borderColor: '#C4CDD5', bgcolor: '#F4F6F8' },
              }}
            >
              {selectedDelivery
                ? selectedDelivery === 'free'
                  ? t('details.offers.free_delivery')
                  : locale === 'ar'
                  ? 'مدفوع'
                  : 'Paid'
                : t('details.filters.delivery')}
            </Button>
            <Menu
              anchorEl={deliveryAnchor}
              open={Boolean(deliveryAnchor)}
              onClose={() => setDeliveryAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setSelectedDelivery(null);
                  setDeliveryAnchor(null);
                }}
                selected={selectedDelivery === null}
              >
                {locale === 'ar' ? 'الكل' : 'All'}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedDelivery('free');
                  setDeliveryAnchor(null);
                }}
                selected={selectedDelivery === 'free'}
              >
                {t('details.offers.free_delivery')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedDelivery('paid');
                  setDeliveryAnchor(null);
                }}
                selected={selectedDelivery === 'paid'}
              >
                {locale === 'ar' ? 'مدفوع' : 'Paid'}
              </MenuItem>
            </Menu>

            {/* Status Filter */}
            <Button
              variant="outlined"
              onClick={(e) => setStatusAnchor(e.currentTarget)}
              startIcon={<Iconify icon="solar:filter-bold-duotone" width={16} />}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={14} />}
              sx={{
                borderRadius: '24px',
                borderColor: '#DFE3E8',
                color: '#212B36',
                fontWeight: 500,
                fontSize: '0.875rem',
                px: 2,
                py: 0.75,
                textTransform: 'none',
                '&:hover': { borderColor: '#C4CDD5', bgcolor: '#F4F6F8' },
              }}
            >
              {selectedStatus ? getStatusText(selectedStatus as 'accepted') : t('filter_status')}
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
                selected={selectedStatus === null}
              >
                {locale === 'ar' ? 'الكل' : 'All'}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedStatus('accepted');
                  setStatusAnchor(null);
                }}
                selected={selectedStatus === 'accepted'}
              >
                {t('details.offers.accepted')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedStatus('rejected');
                  setStatusAnchor(null);
                }}
                selected={selectedStatus === 'rejected'}
              >
                {t('details.offers.rejected')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedStatus('closed');
                  setStatusAnchor(null);
                }}
                selected={selectedStatus === 'closed'}
              >
                {t('details.offers.closed')}
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Offers Table */}
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{ color: '#C4CDD5', '&.Mui-checked': { color: '#006838' } }}
                  />
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#637381' }}>
                  {t('details.offers.supplier')}
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#637381' }}>
                  {t('details.offers.address')}
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#637381' }}>
                  {t('details.offers.total')}
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#637381' }}>
                  {t('details.offers.total_tax')}
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#637381' }}>
                  {t('details.offers.offer_date')}
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#637381' }}>
                  {t('details.offers.delivery')}
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#637381' }}>
                  {t('details.offers.status')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#637381' }}>
                  {t('table.actions')}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOffers.map((row) => {
                const isSelected = selectedRows.includes(row.id);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={isSelected}
                    sx={{
                      '&:hover': { bgcolor: '#F9FAFB' },
                      '&.Mui-selected': { bgcolor: 'rgba(0, 104, 56, 0.04)' },
                      '&.Mui-selected:hover': { bgcolor: 'rgba(0, 104, 56, 0.08)' },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        sx={{ color: '#C4CDD5', '&.Mui-checked': { color: '#006838' } }}
                      />
                    </TableCell>

                    <TableCell align={isRtl ? 'right' : 'left'}>{translateValue(row.supplier)}</TableCell>
                    
                    <TableCell align={isRtl ? 'right' : 'left'}>{translateValue(row.address)}</TableCell>
                    
                    <TableCell align={isRtl ? 'right' : 'left'}>{row.total}</TableCell>
                    
                    <TableCell align={isRtl ? 'right' : 'left'}>{row.totalWithTax}</TableCell>
                    
                    <TableCell align={isRtl ? 'right' : 'left'}>{row.date}</TableCell>
                    
                    <TableCell align={isRtl ? 'right' : 'left'}>
                      {row.delivery === 'مجاني' ? t('details.offers.free_delivery') : row.delivery}
                    </TableCell>
                    
                    <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: getStatusColor(row.status) }}>
                      {getStatusText(row.status)}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton size="small" sx={{ color: '#637381' }}>
                        <Iconify icon="solar:eye-outline" width={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredOffers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {locale === 'ar' ? 'لا توجد عروض مطابقة' : 'No matching offers found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
