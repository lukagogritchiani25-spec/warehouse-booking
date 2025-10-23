import { useState } from 'react';
import WarehouseList from './pages/WarehouseList';
import WarehouseDetail from './pages/WarehouseDetail';
import MyBookings from './pages/MyBookings';
import BookingModal from './components/BookingModal';
import AuthModal from './components/AuthModal';
import type { WarehouseUnitDto } from './types/warehouse';
import type { BookingData } from './components/BookingModal';
import { useAuth } from './context/AuthContext';
import { bookingApi } from './services/api';
import './App.css';

type Page = 'list' | 'detail' | 'bookings';

function App() {
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
        alert(`Booking confirmed!\n\nUnit: ${selectedUnit?.unit.unitNumber}\nStart: ${bookingData.startDate}\nEnd: ${bookingData.endDate}\nTotal: $${bookingData.totalAmount.toFixed(2)}\n\nYou can view your booking in "My Bookings"`);
        setSelectedUnit(null);
      } else {
        alert(response.message || 'Failed to create booking');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create booking');
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
            <h2>🏢 Warehouse Booking</h2>
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
              Warehouses
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
              My Bookings
            </a>
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-name">{user?.fullName}</span>
                <button onClick={logout} className="nav-link">
                  Sign Out
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
                Sign In
              </a>
            )}
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
          <p>&copy; 2025 Warehouse Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
