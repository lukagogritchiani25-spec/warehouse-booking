import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { warehouseApi } from '../services/api';
import type { WarehouseDto, WarehouseFilters } from '../types/warehouse';
import { PricingType } from '../types/warehouse';
import WarehouseCard from '../components/WarehouseCard';
import FilterPanel from '../components/FilterPanel';

interface WarehouseListProps {
  onViewDetails: (id: string) => void;
}

const defaultFilters: WarehouseFilters = {
  searchText: '',
  location: '',
  minPrice: undefined,
  maxPrice: undefined,
  minSize: undefined,
  maxSize: undefined,
  features: {
    climateControl: false,
    security: false,
    access24x7: false,
    loadingDock: false,
    forkliftAccess: false,
    cctv: false,
    fireSafety: false,
    insurance: false,
    powerSupply: false,
    pestControl: false,
  },
  sortBy: 'name',
};

const WarehouseList = ({ onViewDetails }: WarehouseListProps) => {
  const { t } = useTranslation();
  const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<WarehouseFilters>(defaultFilters);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseApi.getAllWarehouses(
        undefined, // fetch all, we'll filter client-side
        true // only active warehouses
      );

      if (response.success && response.data) {
        setWarehouses(response.data);
      } else {
        setError(response.message || t('warehouses.errorLoading'));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('common.error'));
      console.error('Error fetching warehouses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Client-side filtering and sorting
  const filteredAndSortedWarehouses = useMemo(() => {
    let filtered = [...warehouses];

    // Text search (name and description)
    if (filters.searchText) {
      const search = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(search) ||
          w.description?.toLowerCase().includes(search)
      );
    }

    // Location filter
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.location.toLowerCase().includes(location) ||
          w.address.toLowerCase().includes(location)
      );
    }

    // Price filter (based on lowest monthly price)
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filtered = filtered.filter((w) => {
        const monthlyPrices = w.units
          .flatMap((unit) => unit.pricing)
          .filter((p) => p.pricingType === PricingType.Monthly && p.isActive)
          .map((p) => {
            const discount = p.discountPercentage || 0;
            return p.price * (1 - discount / 100);
          });

        if (monthlyPrices.length === 0) return false;

        const lowestPrice = Math.min(...monthlyPrices);

        if (filters.minPrice !== undefined && lowestPrice < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && lowestPrice > filters.maxPrice) {
          return false;
        }

        return true;
      });
    }

    // Size filter
    if (filters.minSize !== undefined || filters.maxSize !== undefined) {
      filtered = filtered.filter((w) => {
        return w.units.some((unit) => {
          if (filters.minSize !== undefined && unit.squareMeters < filters.minSize) {
            return false;
          }
          if (filters.maxSize !== undefined && unit.squareMeters > filters.maxSize) {
            return false;
          }
          return true;
        });
      });
    }

    // Feature filters
    const activeFeatures = Object.entries(filters.features).filter(([, value]) => value);
    if (activeFeatures.length > 0) {
      filtered = filtered.filter((w) => {
        return w.units.some((unit) => {
          if (!unit.features) return false;

          return activeFeatures.every(([feature]) => {
            return unit.features![feature as keyof typeof unit.features];
          });
        });
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);

        case 'price-asc':
        case 'price-desc': {
          const getPriceForWarehouse = (w: WarehouseDto) => {
            const monthlyPrices = w.units
              .flatMap((unit) => unit.pricing)
              .filter((p) => p.pricingType === PricingType.Monthly && p.isActive)
              .map((p) => {
                const discount = p.discountPercentage || 0;
                return p.price * (1 - discount / 100);
              });
            return monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : Infinity;
          };

          const priceA = getPriceForWarehouse(a);
          const priceB = getPriceForWarehouse(b);

          return filters.sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
        }

        case 'availability': {
          const availableA = a.units.filter((u) => u.isAvailable).length;
          const availableB = b.units.filter((u) => u.isAvailable).length;
          return availableB - availableA;
        }

        default:
          return 0;
      }
    });

    return filtered;
  }, [warehouses, filters]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t('warehouses.loadingWarehouses')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>{t('warehouses.errorLoading')}</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchWarehouses}>
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1>{t('warehouses.title')}</h1>
        <p>{t('warehouses.subtitle')}</p>
      </header>

      <div className="warehouse-list-layout">
        <aside className="filters-sidebar">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />
        </aside>

        <div className="warehouse-results">
          <div className="results-header">
            <p className="results-count">
              {filteredAndSortedWarehouses.length} {t('nav.warehouses').toLowerCase()}
              {' '}{t('common.filter').toLowerCase()}
            </p>
          </div>

          {filteredAndSortedWarehouses.length === 0 ? (
            <div className="empty-state">
              <p>{t('warehouses.noMatch')}</p>
              <p>{t('warehouses.tryAdjusting')}</p>
              <button className="btn-primary" onClick={() => setFilters(defaultFilters)}>
                {t('warehouses.resetFilters')}
              </button>
            </div>
          ) : (
            <div className="warehouse-grid">
              {filteredAndSortedWarehouses.map((warehouse) => (
                <WarehouseCard
                  key={warehouse.id}
                  warehouse={warehouse}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseList;
