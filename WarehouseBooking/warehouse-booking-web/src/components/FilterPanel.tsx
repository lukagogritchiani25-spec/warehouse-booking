import { useState } from 'react';
import type { WarehouseFilters } from '../types/warehouse';

interface FilterPanelProps {
  filters: WarehouseFilters;
  onFilterChange: (filters: WarehouseFilters) => void;
  onReset: () => void;
}

const FilterPanel = ({ filters, onFilterChange, onReset }: FilterPanelProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, searchText: value });
  };

  const handleLocationChange = (value: string) => {
    onFilterChange({ ...filters, location: value });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleSizeChange = (min?: number, max?: number) => {
    onFilterChange({ ...filters, minSize: min, maxSize: max });
  };

  const handleFeatureToggle = (feature: keyof WarehouseFilters['features']) => {
    onFilterChange({
      ...filters,
      features: {
        ...filters.features,
        [feature]: !filters.features[feature],
      },
    });
  };

  const handleSortChange = (sortBy: WarehouseFilters['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const hasActiveFilters = () => {
    return (
      filters.searchText ||
      filters.location ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.minSize !== undefined ||
      filters.maxSize !== undefined ||
      Object.values(filters.features).some((v) => v)
    );
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>🔍 Search & Filter</h3>
        {hasActiveFilters() && (
          <button className="btn-clear-filters" onClick={onReset}>
            Clear All
          </button>
        )}
      </div>

      {/* Search and Location */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Search Warehouses</label>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={filters.searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="City or region..."
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as WarehouseFilters['sortBy'])}
            className="filter-select"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="availability">Most Available Units</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        className="btn-advanced-toggle"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? '▼' : '▶'} Advanced Filters
      </button>

      {showAdvanced && (
        <div className="advanced-filters">
          {/* Price Range */}
          <div className="filter-section">
            <label className="filter-section-title">Price Range (per month)</label>
            <div className="filter-row">
              <div className="filter-group">
                <label>Min Price ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handlePriceChange(
                      e.target.value ? Number(e.target.value) : undefined,
                      filters.maxPrice
                    )
                  }
                  className="filter-input-small"
                  min="0"
                />
              </div>
              <div className="filter-group">
                <label>Max Price ($)</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    handlePriceChange(
                      filters.minPrice,
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="filter-input-small"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Size Range */}
          <div className="filter-section">
            <label className="filter-section-title">Unit Size (m²)</label>
            <div className="filter-row">
              <div className="filter-group">
                <label>Min Size</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minSize || ''}
                  onChange={(e) =>
                    handleSizeChange(
                      e.target.value ? Number(e.target.value) : undefined,
                      filters.maxSize
                    )
                  }
                  className="filter-input-small"
                  min="0"
                />
              </div>
              <div className="filter-group">
                <label>Max Size</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.maxSize || ''}
                  onChange={(e) =>
                    handleSizeChange(
                      filters.minSize,
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="filter-input-small"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="filter-section">
            <label className="filter-section-title">Features</label>
            <div className="feature-checkboxes">
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.climateControl}
                  onChange={() => handleFeatureToggle('climateControl')}
                />
                <span>🌡️ Climate Control</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.security}
                  onChange={() => handleFeatureToggle('security')}
                />
                <span>🔒 Security</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.access24x7}
                  onChange={() => handleFeatureToggle('access24x7')}
                />
                <span>🕐 24/7 Access</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.cctv}
                  onChange={() => handleFeatureToggle('cctv')}
                />
                <span>📹 CCTV</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.fireSafety}
                  onChange={() => handleFeatureToggle('fireSafety')}
                />
                <span>🔥 Fire Safety</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.loadingDock}
                  onChange={() => handleFeatureToggle('loadingDock')}
                />
                <span>🚛 Loading Dock</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.forkliftAccess}
                  onChange={() => handleFeatureToggle('forkliftAccess')}
                />
                <span>🏗️ Forklift Access</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.insurance}
                  onChange={() => handleFeatureToggle('insurance')}
                />
                <span>🛡️ Insurance</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.powerSupply}
                  onChange={() => handleFeatureToggle('powerSupply')}
                />
                <span>⚡ Power Supply</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.pestControl}
                  onChange={() => handleFeatureToggle('pestControl')}
                />
                <span>🐛 Pest Control</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
