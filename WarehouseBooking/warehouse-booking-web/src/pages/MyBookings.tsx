import { useState, useEffect } from 'react';
import { bookingApi } from '../services/api';
import type { BookingDto } from '../types/booking';
import { BookingStatus } from '../types/booking';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
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
        setError(response.message || 'Failed to load bookings');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await bookingApi.cancelBooking(bookingId);
      if (response.success) {
        alert('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
      } else {
        alert(response.message || 'Failed to cancel booking');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Pending:
        return <span className="status-badge status-pending">Pending</span>;
      case BookingStatus.Confirmed:
        return <span className="status-badge status-confirmed">Confirmed</span>;
      case BookingStatus.Cancelled:
        return <span className="status-badge status-cancelled">Cancelled</span>;
      case BookingStatus.Completed:
        return <span className="status-badge status-completed">Completed</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Please Sign In</h2>
          <p>You need to be signed in to view your bookings</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Error Loading Bookings</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchBookings}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Manage your warehouse unit bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any bookings yet</p>
          <p>Browse warehouses to make your first booking</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div>
                  <h3>
                    {booking.warehouseUnit?.warehouse?.name || 'Warehouse'} - Unit{' '}
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
                  <span className="detail-label">Unit Size:</span>
                  <span className="detail-value">
                    {booking.warehouseUnit?.squareMeters} m²
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Start Date:</span>
                  <span className="detail-value">{formatDate(booking.startDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">End Date:</span>
                  <span className="detail-value">{formatDate(booking.endDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Amount:</span>
                  <span className="detail-value booking-amount">
                    ${booking.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Booked On:</span>
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
                    Cancel Booking
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
