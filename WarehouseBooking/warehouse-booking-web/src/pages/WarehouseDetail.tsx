import { useState, useEffect } from 'react';
import { warehouseApi } from '../services/api';
import type { WarehouseDto, WarehouseUnitDto } from '../types/warehouse';
import { PricingType } from '../types/warehouse';

interface WarehouseDetailProps {
  warehouseId: string;
  onBack: () => void;
  onBookUnit: (unit: WarehouseUnitDto, warehouseName: string) => void;
}

const WarehouseDetail = ({ warehouseId, onBack, onBookUnit }: WarehouseDetailProps) => {
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
        setError(response.message || 'Failed to load warehouse details');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      case PricingType.Hourly: return '/hour';
      case PricingType.Daily: return '/day';
      case PricingType.Monthly: return '/month';
      case PricingType.Yearly: return '/year';
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
          <p>Loading warehouse details...</p>
        </div>
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Error Loading Warehouse</h2>
          <p>{error || 'Warehouse not found'}</p>
          <button className="btn-primary" onClick={onBack}>
            Back to Warehouses
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
        ← Back to Warehouses
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
              <span className="stat-label">Total Units</span>
              <span className="stat-value">{warehouse.units.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Available</span>
              <span className="stat-value">
                {warehouse.units.filter((u) => u.isAvailable).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Units */}
      <div className="units-section">
        <h2>Available Units</h2>
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
                      {unit.features.climateControl && <span className="feature">❄️ Climate Control</span>}
                      {unit.features.security && <span className="feature">🔒 Security</span>}
                      {unit.features.access24x7 && <span className="feature">🕒 24/7 Access</span>}
                      {unit.features.cctv && <span className="feature">📹 CCTV</span>}
                      {unit.features.fireSafety && <span className="feature">🔥 Fire Safety</span>}
                      {unit.features.insurance && <span className="feature">🛡️ Insurance</span>}
                    </div>
                  )}

                  {/* Pricing */}
                  {monthlyPrice && (
                    <div className="unit-pricing">
                      {monthlyPrice.discount > 0 && (
                        <>
                          <span className="price-original">${monthlyPrice.original.toFixed(2)}</span>
                          <span className="price-discount">{monthlyPrice.discount}% OFF</span>
                        </>
                      )}
                      <div className="price-final">
                        <span className="price-amount">${monthlyPrice.final.toFixed(2)}</span>
                        <span className="price-period">/month</span>
                      </div>
                    </div>
                  )}

                  <button
                    className="btn-primary btn-block"
                    onClick={() => onBookUnit(unit, warehouse.name)}
                  >
                    Book This Unit
                  </button>
                </div>
              );
            })}
        </div>

        {warehouse.units.filter((u) => u.isAvailable && u.isActive).length === 0 && (
          <div className="empty-state">
            <p>No units currently available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseDetail;
