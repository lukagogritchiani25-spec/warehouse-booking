import type { WarehouseDto } from '../types/warehouse';
import { PricingType } from '../types/warehouse';

interface WarehouseCardProps {
  warehouse: WarehouseDto;
  onViewDetails: (id: string) => void;
}

const WarehouseCard = ({ warehouse, onViewDetails }: WarehouseCardProps) => {
  const getImageUrl = (url: string | undefined) => {
    if (!url) return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800';
    // Add Unsplash parameters if missing
    if (url.includes('unsplash.com') && !url.includes('?')) {
      return `${url}?w=800&fit=crop`;
    }
    return url;
  };

  const primaryImage = getImageUrl(
    warehouse.media.find((m) => m.isPrimary)?.url || warehouse.media[0]?.url
  );

  const availableUnits = warehouse.units.filter((u) => u.isAvailable).length;

  const getLowestPrice = () => {
    const monthlyPrices = warehouse.units
      .flatMap((unit) => unit.pricing)
      .filter((p) => p.pricingType === PricingType.Monthly && p.isActive)
      .map((p) => {
        const discount = p.discountPercentage || 0;
        return p.price * (1 - discount / 100);
      });

    return monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : null;
  };

  const lowestPrice = getLowestPrice();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&fit=crop';
  };

  return (
    <div className="warehouse-card">
      <div className="warehouse-image">
        <img
          src={primaryImage}
          alt={warehouse.name}
          onError={handleImageError}
        />
        <div className="warehouse-badge">
          {availableUnits} units available
        </div>
      </div>

      <div className="warehouse-content">
        <div className="warehouse-header">
          <h3>{warehouse.name}</h3>
          <div className="warehouse-location">
            <span>📍</span>
            <span>{warehouse.location}</span>
          </div>
        </div>

        <p className="warehouse-address">{warehouse.address}</p>

        {warehouse.description && (
          <p className="warehouse-description">
            {warehouse.description.length > 120
              ? `${warehouse.description.substring(0, 120)}...`
              : warehouse.description}
          </p>
        )}

        <div className="warehouse-footer">
          {lowestPrice && (
            <div className="warehouse-price">
              <span className="price-label">From</span>
              <span className="price-amount">${lowestPrice.toFixed(2)}</span>
              <span className="price-period">/month</span>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={() => onViewDetails(warehouse.id)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseCard;
