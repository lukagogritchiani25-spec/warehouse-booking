import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { WarehouseUnitDto } from '../types/warehouse';
import { PricingType } from '../types/warehouse';

interface BookingModalProps {
  unit: WarehouseUnitDto;
  warehouseName: string;
  onClose: () => void;
  onConfirm: (bookingData: BookingData) => void;
}

export interface BookingData {
  unitId: string;
  startDate: string;
  endDate: string;
  pricingType: PricingType;
  totalAmount: number;
}

const BookingModal = ({ unit, warehouseName, onClose, onConfirm }: BookingModalProps) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pricingType, setPricingType] = useState<PricingType>(PricingType.Monthly);

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;

    const pricing = unit.pricing.find((p) => p.pricingType === pricingType && p.isActive);
    if (!pricing) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    let quantity = 1;
    switch (pricingType) {
      case PricingType.Hourly:
        quantity = days * 24;
        break;
      case PricingType.Daily:
        quantity = days;
        break;
      case PricingType.Monthly:
        quantity = Math.ceil(days / 30);
        break;
      case PricingType.Yearly:
        quantity = Math.ceil(days / 365);
        break;
    }

    const discount = pricing.discountPercentage || 0;
    const pricePerUnit = pricing.price * (1 - discount / 100);
    return pricePerUnit * quantity;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert(t('booking.selectDates'));
      return;
    }

    const total = calculateTotal();
    if (total <= 0) {
      alert(t('booking.invalidCalculation'));
      return;
    }

    onConfirm({
      unitId: unit.id,
      startDate,
      endDate,
      pricingType,
      totalAmount: total,
    });
  };

  const availablePricingTypes = unit.pricing
    .filter((p) => p.isActive)
    .map((p) => p.pricingType);

  const totalAmount = calculateTotal();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('booking.bookUnit', { unitNumber: unit.unitNumber })}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="booking-info">
            <p><strong>{t('booking.warehouse')}:</strong> {warehouseName}</p>
            <p><strong>{t('units.unitSize')}:</strong> {unit.squareMeters} m²</p>
            {unit.description && <p><strong>{t('units.description')}:</strong> {unit.description}</p>}
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="startDate">{t('booking.startDate')}</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">{t('booking.endDate')}</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pricingType">{t('booking.pricingType')}</label>
              <select
                id="pricingType"
                value={pricingType}
                onChange={(e) => setPricingType(Number(e.target.value) as PricingType)}
                required
              >
                {availablePricingTypes.includes(PricingType.Hourly) && (
                  <option value={PricingType.Hourly}>{t('booking.hourly')}</option>
                )}
                {availablePricingTypes.includes(PricingType.Daily) && (
                  <option value={PricingType.Daily}>{t('booking.daily')}</option>
                )}
                {availablePricingTypes.includes(PricingType.Monthly) && (
                  <option value={PricingType.Monthly}>{t('booking.monthly')}</option>
                )}
                {availablePricingTypes.includes(PricingType.Yearly) && (
                  <option value={PricingType.Yearly}>{t('booking.yearly')}</option>
                )}
              </select>
            </div>

            {totalAmount > 0 && (
              <div className="booking-summary">
                <h3>{t('booking.bookingSummary')}</h3>
                <div className="summary-row">
                  <span>{t('booking.totalAmount')}:</span>
                  <span className="summary-total">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                {t('common.cancel')}
              </button>
              <button type="submit" className="btn-primary">
                {t('booking.confirmBooking')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
