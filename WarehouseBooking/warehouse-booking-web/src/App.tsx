import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import WarehouseList from './pages/WarehouseList';
import WarehouseDetail from './pages/WarehouseDetail';
import MyBookings from './pages/MyBookings';
import BookingModal from './components/BookingModal';
import AuthModal from './components/AuthModal';
import LanguageSwitcher from './components/LanguageSwitcher';
import type { WarehouseUnitDto } from './types/warehouse';
import type { BookingData } from './components/BookingModal';
import { useAuth } from './context/AuthContext';
import { bookingApi } from './services/api';
import './App.css';

type Page = 'list' | 'detail' | 'bookings';

function App() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<{ unit: WarehouseUnitDto; warehouseName: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleViewDetails = (warehouseId: string) => {
    setSelectedWarehouseId(warehouseId);
    setCurrentPage('detail');
  };

  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedWarehouseId(null);
  };

  const handleBookUnit = (unit: WarehouseUnitDto, warehouseName: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSelectedUnit({ unit, warehouseName });
  };

  const handleCloseBooking = () => {
    setSelectedUnit(null);
  };

  const handleConfirmBooking = async (bookingData: BookingData) => {
    try {
      // Convert dates to UTC ISO 8601 format
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);

      // Set to start/end of day in UTC
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(23, 59, 59, 999);

      const response = await bookingApi.createBooking({
        warehouseUnitId: bookingData.unitId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalAmount: bookingData.totalAmount,
      });

      if (response.success) {
        alert(`${t('booking.bookingConfirmed')}\n\nUnit: ${selectedUnit?.unit.unitNumber}\nStart: ${bookingData.startDate}\nEnd: ${bookingData.endDate}\nTotal: $${bookingData.totalAmount.toFixed(2)}\n\n${t('booking.viewInMyBookings')}`);
        setSelectedUnit(null);
      } else {
        alert(response.message || t('booking.failedToCreate'));
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t('booking.failedToCreate'));
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div
            className="navbar-brand"
            onClick={handleBackToList}
            style={{ cursor: 'pointer' }}
          >
            <h2>🏢 {t('common.appName')}</h2>
          </div>
          <div className="navbar-menu">
            <a
              href="#"
              className={currentPage === 'list' ? 'nav-link active' : 'nav-link'}
              onClick={(e) => {
                e.preventDefault();
                handleBackToList();
              }}
            >
              {t('nav.warehouses')}
            </a>
            <a
              href="#"
              className={currentPage === 'bookings' ? 'nav-link active' : 'nav-link'}
              onClick={(e) => {
                e.preventDefault();
                if (!isAuthenticated) {
                  setShowAuthModal(true);
                } else {
                  setCurrentPage('bookings');
                }
              }}
            >
              {t('nav.myBookings')}
            </a>
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-name">{user?.firstName} {user?.lastName}</span>
                <button onClick={logout} className="nav-link">
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <a
                href="#"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAuthModal(true);
                }}
              >
                {t('nav.signIn')}
              </a>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'list' && (
          <WarehouseList onViewDetails={handleViewDetails} />
        )}
        {currentPage === 'detail' && selectedWarehouseId && (
          <WarehouseDetail
            warehouseId={selectedWarehouseId}
            onBack={handleBackToList}
            onBookUnit={handleBookUnit}
          />
        )}
        {currentPage === 'bookings' && <MyBookings />}
      </main>

      {selectedUnit && (
        <BookingModal
          unit={selectedUnit.unit}
          warehouseName={selectedUnit.warehouseName}
          onClose={handleCloseBooking}
          onConfirm={handleConfirmBooking}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 {t('common.appName')}. {t('common.allRightsReserved')}.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
