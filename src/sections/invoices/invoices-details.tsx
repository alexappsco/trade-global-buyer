'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'src/i18n/routing';
import {
  Box,
  Card,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  Typography,
  CircularProgress,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useToast } from 'src/components/toast';
import { getInvoiceDetails, downloadInvoicePdf } from 'src/actions/invoices';
import type { InvoiceDetail } from 'src/types/invoice';

interface Props {
  id: string;
}

export default function InvoicesDetailsView({ id }: Props) {
  const t = useTranslations('Invoices');
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const isRtl = locale === 'ar';

  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString(locale) : '—';

  const formatAmount = (value?: number) =>
    (value ?? 0).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const currencyText = isRtl ? 'ر.س' : 'SAR';

  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      const res = await getInvoiceDetails(id);
      if (!res.success) {
        toast.error(res.error || t('table.load_error'));
        setInvoice(null);
      } else {
        setInvoice(res.data);
      }
      setIsLoading(false);
    };
    fetchInvoice();
  }, [id, toast, t]);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await downloadInvoicePdf(id);
      if (!res.success) {
        toast.error(res.error || t('table.pdf_download_error'));
        return;
      }
      const binary = atob(res.data.base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice?.invoiceNumber || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(t('table.pdf_download_success'));
    } catch {
      toast.error(t('table.pdf_download_error'));
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', py: 8 }}>
        <Iconify icon="solar:danger-triangle-bold" width={48} sx={{ color: '#FFAB00' }} />
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {t('not_found')}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/invoices')}
          sx={{
            bgcolor: '#10754E',
            color: 'white',
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            py: 1,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#0B5337', boxShadow: 'none' },
          }}
        >
          {t('back_to_invoices')}
        </Button>
      </Box>
    );
  }

  const items =
    invoice.items && invoice.items.length > 0
      ? invoice.items
      : [{ id: '0', orderItemId: '0', name: invoice.orderTitle, details: '', quantity: 1, unitPrice: invoice.quotationGrandTotal, itemTotal: invoice.quotationGrandTotal }];

  const grandTotal = invoice.quotationGrandTotal || 0;

  const statusLabel = invoice.status === 'unpaid' ? t('status.unpaid') : invoice.status;
  const categoryName = isRtl || !invoice.categoryNameEn
    ? invoice.categoryNameAr || invoice.categoryNameEn
    : invoice.categoryNameEn;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Upper Main Invoice Card */}
      <Card
        sx={{
          borderRadius: 2,
          p: { xs: 3, md: 5 },
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
          border: '1px solid #F4F6F8',
          bgcolor: '#FFFFFF',
        }}
      >
        {/* Header: Logo & Title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          {/* Sub Header info: Date & Company Name */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#161C24' }}>
              {t('details.info.issued_at')}:{' '}
              <Box component="span" sx={{ color: '#10754E' }}>
                {formatDate(invoice.issuedAt)}
              </Box>
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#161C24' }}>
              {t('details.info.requested_from')}:{' '}
              <Box component="span" sx={{ color: '#10754E' }}>
                {invoice.buyer?.legalCompanyName || '—'}
              </Box>
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#161C24' }}>
                {invoice.invoiceNumber}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#161C24' }}>
                {t('title')}
              </Typography>
            </Box>
            {/* Logo Image */}
            <Box
              component="img"
              src="/logo.png"
              alt="TradeGlobal Logo"
              sx={{ height: 48, objectFit: 'contain' }}
            />
          </Box>
        </Box>

        {/* Invoice Items Table */}
        <TableContainer sx={{ mb: 4 }}>
          <Table sx={{ borderCollapse: 'separate', borderSpacing: '0' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
                  #
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
                  {t('details.table.item')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
                  {t('details.table.qty')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
                  {t('details.table.unit_price')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
                  {t('details.table.total')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row, index) => (
                <TableRow key={row.id ?? index} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
                    {row.name}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
                    {row.quantity}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
                    {formatAmount(row.unitPrice)}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
                    {formatAmount(row.itemTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Total Amount Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#161C24' }}>
            {t('details.total')}:
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#10754E' }}>
            {formatAmount(grandTotal)} {currencyText}
          </Typography>
        </Box>

        {/* Action Button: Download PDF */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleDownloadPdf}
            disabled={downloading}
            startIcon={downloading ? undefined : <Iconify icon="solar:download-bold" width={18} />}
            sx={{
              bgcolor: '#10754E',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '8px',
              px: 5,
              py: 1.2,
              boxShadow: 'none',
              gap: 1,
              '&:hover': { bgcolor: '#0B5337', boxShadow: 'none' },
            }}
          >
            {downloading ? t('details.downloading') : t('details.download_pdf')}
          </Button>
        </Box>
      </Card>

      {/* Order Details Header Banner */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: 2,
          p: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#161C24' }}>
          {t('details.order_header', { number: invoice.orderNumber })}
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push(`/orders/${invoice.orderId}/1`)}
          sx={{
            bgcolor: '#10754E',
            color: 'white',
            fontWeight: 700,
            borderRadius: '8px',
            px: 2.5,
            py: 0.8,
            boxShadow: 'none',
            gap: 1,
            '&:hover': { bgcolor: '#0B5337', boxShadow: 'none' },
          }}
        >
          <Iconify icon="solar:eye-bold" width={18} />
          {t('details.view_order')}
        </Button>
      </Box>

      {/* Order Meta Info Card */}
      <Card
        sx={{
          borderRadius: 2,
          p: 3,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
          border: '1px solid #F4F6F8',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
            textAlign: 'center',
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.city')}
            </Typography>
            <Typography variant="body1" sx={{ color: '#919EAB', fontWeight: 500 }}>
              {invoice.buyer?.city || '—'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.company_address')}
            </Typography>
            <Typography variant="body1" sx={{ color: '#919EAB', fontWeight: 500 }}>
              {invoice.buyer?.companyAddress || '—'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.creation_time')}
            </Typography>
            <Typography variant="body1" sx={{ color: '#919EAB', fontWeight: 500 }}>
              {formatDate(invoice.orderCreationTime)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.status')}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 700, color: invoice.status === 'unpaid' ? '#FF3B30' : '#10754E' }}
            >
              {statusLabel}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Offer Details Section Header */}
      <Box sx={{ borderRight: '4px solid #10754E', pr: 1.5, my: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#161C24' }}>
          {t('details.offer_section_header')}
        </Typography>
      </Box>

      {/* Offer Meta Banner */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: 2,
          p: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 700, color: '#212B36' }}>
          {t('details.info.order_title')}:{' '}
          <Box component="span" sx={{ color: '#10754E', ml: 0.5 }}>
            {invoice.orderTitle}
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: 700, color: '#212B36' }}>
          {t('details.info.category')}:{' '}
          <Box component="span" sx={{ color: '#10754E', ml: 0.5 }}>
            {categoryName}
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: 700, color: '#212B36' }}>
          {t('details.info.date')}:{' '}
          <Box component="span" sx={{ color: '#10754E', ml: 0.5 }}>
            {formatDate(invoice.deliveryDate)}
          </Box>
        </Typography>
      </Box>

      {/* Offer Items Table Card */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
          border: '1px solid #DFE3E8',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.item')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.qty')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.unit_price')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.total')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row, index) => (
                <TableRow hover key={row.id ?? index}>
                  <TableCell sx={{ fontWeight: 700, color: '#10754E' }}>
                    {row.name}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#212B36' }}>
                    {row.quantity}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#212B36' }}>
                    {formatAmount(row.unitPrice)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#212B36' }}>
                    {formatAmount(row.itemTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}