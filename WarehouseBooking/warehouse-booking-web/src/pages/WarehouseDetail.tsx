import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { warehouseApi } from '../services/api';
import type { WarehouseDto, WarehouseUnitDto } from '../types/warehouse';
import { PricingType } from '../types/warehouse';

interface WarehouseDetailProps {
  warehouseId: string;
  onBack: () => void;
  onBookUnit: (unit: WarehouseUnitDto, warehouseName: string) => void;
}

const WarehouseDetail = ({ warehouseId, onBack, onBookUnit }: WarehouseDetailProps) => {
  const { t } = useTranslation();
  const [warehouse, setWarehouse] = useState<WarehouseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchWarehouseDetails();
  }, [warehouseId]);

  const fetchWarehouseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseApi.getWarehouseById(warehouseId);

      if (response.success && response.data) {
        setWarehouse(response.data);
      } else {
        setError(response.message || t('warehouses.errorLoading'));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('common.error'));
      console.error('Error fetching warehouse details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (unit: WarehouseUnitDto, pricingType: PricingType) => {
    const pricing = unit.pricing.find((p) => p.pricingType === pricingType && p.isActive);
    if (!pricing) return null;

    const discount = pricing.discountPercentage || 0;
    const finalPrice = pricing.price * (1 - discount / 100);
    return { original: pricing.price, final: finalPrice, discount };
  };

  const getPricingLabel = (type: PricingType) => {
    switch (type) {
      case PricingType.Hourly: return t('units.perHour');
      case PricingType.Daily: return t('units.perDay');
      case PricingType.Monthly: return t('units.perMonth');
      case PricingType.Yearly: return t('units.perYear');
      default: return '';
    }
  };

  const getImageUrl = (url: string | undefined) => {
    if (!url) return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&fit=crop';
    if (url.includes('unsplash.com') && !url.includes('?')) {
      return `${url}?w=800&fit=crop`;
    }
    return url;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&fit=crop';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t('warehouses.loadingDetails')}</p>
        </div>
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>{t('warehouses.errorLoading')}</h2>
          <p>{error || t('warehouses.warehouseNotFound')}</p>
          <button className="btn-primary" onClick={onBack}>
            {t('warehouses.backToWarehouses')}
          </button>
        </div>
      </div>
    );
  }

  const images = warehouse.media.sort((a, b) => a.displayOrder - b.displayOrder);
  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <div className="container">
      <button className="btn-back" onClick={onBack}>
        ← {t('warehouses.backToWarehouses')}
      </button>

      <div className="warehouse-detail">
        {/* Image Gallery */}
        <div className="detail-gallery">
          <div className="main-image">
            <img
              src={getImageUrl(currentImage?.url)}
              alt={currentImage?.title || warehouse.name}
              onError={handleImageError}
            />
          </div>
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <img
                  key={img.id}
                  src={getImageUrl(img.url)}
                  alt={img.title || `${warehouse.name} ${index + 1}`}
                  className={selectedImageIndex === index ? 'active' : ''}
                  onClick={() => setSelectedImageIndex(index)}
                  onError={handleImageError}
                />
              ))}
            </div>
          )}
        </div>

        {/* Warehouse Info */}
        <div className="detail-info">
          <h1>{warehouse.name}</h1>
          <div className="detail-location">
            <span>📍</span>
            <span>{warehouse.location}</span>
          </div>
          <p className="detail-address">{warehouse.address}</p>
          {warehouse.description && (
            <p className="detail-description">{warehouse.description}</p>
          )}

          <div className="detail-stats">
            <div className="stat-item">
              <span className="stat-label">{t('warehouses.totalUnits')}</span>
              <span className="stat-value">{warehouse.units.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('warehouses.available')}</span>
              <span className="stat-value">
                {warehouse.units.filter((u) => u.isAvailable).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Units */}
      <div className="units-section">
        <h2>{t('warehouses.availableUnits')}</h2>
        <div className="units-grid">
          {warehouse.units
            .filter((unit) => unit.isAvailable && unit.isActive)
            .map((unit) => {
              const monthlyPrice = getPrice(unit, PricingType.Monthly);

              return (
                <div key={unit.id} className="unit-card">
                  <div className="unit-header">
                    <h3>{unit.unitNumber}</h3>
                    <span className="unit-size">{unit.squareMeters} m²</span>
                  </div>

                  {unit.description && (
                    <p className="unit-description">{unit.description}</p>
                  )}

                  {/* Features */}
                  {unit.features && (
                    <div className="unit-features">
                      {unit.features.climateControl && <span className="feature">❄️ {t('features.climateControl')}</span>}
                      {unit.features.security && <span className="feature">🔒 {t('features.security')}</span>}
                      {unit.features.access24x7 && <span className="feature">🕒 {t('features.access24x7')}</span>}
                      {unit.features.cctv && <span className="feature">📹 {t('features.cctv')}</span>}
                      {unit.features.fireSafety && <span className="feature">🔥 {t('features.fireSafety')}</span>}
                      {unit.features.insurance && <span className="feature">🛡️ {t('features.insurance')}</span>}
                    </div>
                  )}

                  {/* Pricing */}
                  {monthlyPrice && (
                    <div className="unit-pricing">
                      {monthlyPrice.discount > 0 && (
                        <>
                          <span className="price-original">${monthlyPrice.original.toFixed(2)}</span>
                          <span className="price-discount">{monthlyPrice.discount}% {t('units.off')}</span>
                        </>
                      )}
                      <div className="price-final">
                        <span className="price-amount">${monthlyPrice.final.toFixed(2)}</span>
                        <span className="price-period">{t('units.perMonth')}</span>
                      </div>
                    </div>
                  )}

                  <button
                    className="btn-primary btn-block"
                    onClick={() => onBookUnit(unit, warehouse.name)}
                  >
                    {t('units.bookThisUnit')}
                  </button>
                </div>
              );
            })}
        </div>

        {warehouse.units.filter((u) => u.isAvailable && u.isActive).length === 0 && (
          <div className="empty-state">
            <p>{t('warehouses.noUnitsAvailable')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseDetail;
