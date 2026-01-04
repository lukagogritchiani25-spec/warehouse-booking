import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { bookingApi } from '../services/api';
import type { BookingDto } from '../types/booking';
import { BookingStatus } from '../types/booking';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingApi.getMyBookings();

      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setError(response.message || t('myBookings.errorLoading'));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('common.error'));
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm(t('myBookings.confirmCancel'))) return;

    try {
      const response = await bookingApi.cancelBooking(bookingId);
      if (response.success) {
        alert(t('myBookings.cancelSuccess'));
        fetchBookings(); // Refresh the list
      } else {
        alert(response.message || t('myBookings.cancelFailed'));
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t('myBookings.cancelFailed'));
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Pending:
        return <span className="status-badge status-pending">{t('status.pending')}</span>;
      case BookingStatus.Confirmed:
        return <span className="status-badge status-confirmed">{t('status.confirmed')}</span>;
      case BookingStatus.Cancelled:
        return <span className="status-badge status-cancelled">{t('status.cancelled')}</span>;
      case BookingStatus.Completed:
        return <span className="status-badge status-completed">{t('status.completed')}</span>;
      default:
        return <span className="status-badge">{t('status.unknown')}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'ka' ? 'ka-GE' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>{t('myBookings.pleaseSignIn')}</h2>
          <p>{t('myBookings.signInRequired')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t('myBookings.loadingBookings')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>{t('myBookings.errorLoading')}</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchBookings}>
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t('myBookings.title')}</h1>
        <p>{t('myBookings.subtitle')}</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>{t('myBookings.noBookings')}</p>
          <p>{t('myBookings.browseWarehouses')}</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div>
                  <h3>
                    {booking.warehouseUnit?.warehouse?.name || t('nav.warehouses')} - {t('myBookings.unit')}{' '}
                    {booking.warehouseUnit?.unitNumber}
                  </h3>
                  <p className="booking-location">
                    📍 {booking.warehouseUnit?.warehouse?.location}
                  </p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="booking-details">
                <div className="detail-item">
                  <span className="detail-label">{t('units.unitSize')}:</span>
                  <span className="detail-value">
                    {booking.warehouseUnit?.squareMeters} m²
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('myBookings.startDate')}:</span>
                  <span className="detail-value">{formatDate(booking.startDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('myBookings.endDate')}:</span>
                  <span className="detail-value">{formatDate(booking.endDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('myBookings.totalAmount')}:</span>
                  <span className="detail-value booking-amount">
                    ${booking.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('myBookings.bookedOn')}:</span>
                  <span className="detail-value">{formatDate(booking.createdAt)}</span>
                </div>
              </div>

              {booking.warehouseUnit?.warehouse?.address && (
                <p className="booking-address">
                  {booking.warehouseUnit.warehouse.address}
                </p>
              )}

              {booking.status === BookingStatus.Confirmed && (
                <div className="booking-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    {t('myBookings.cancelBooking')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
