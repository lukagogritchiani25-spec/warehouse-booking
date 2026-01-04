import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { WarehouseFilters } from '../types/warehouse';

interface FilterPanelProps {
  filters: WarehouseFilters;
  onFilterChange: (filters: WarehouseFilters) => void;
  onReset: () => void;
}

const FilterPanel = ({ filters, onFilterChange, onReset }: FilterPanelProps) => {
  const { t } = useTranslation();
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
        <h3>🔍 {t('filters.searchAndFilter')}</h3>
        {hasActiveFilters() && (
          <button className="btn-clear-filters" onClick={onReset}>
            {t('common.clearAll')}
          </button>
        )}
      </div>

      {/* Search and Location */}
      <div className="filter-section">
        <div className="filter-group">
          <label>{t('filters.searchWarehouses')}</label>
          <input
            type="text"
            placeholder={t('filters.searchPlaceholder')}
            value={filters.searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>{t('filters.location')}</label>
          <input
            type="text"
            placeholder={t('filters.locationPlaceholder')}
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="filter-section">
        <div className="filter-group">
          <label>{t('filters.sortBy')}</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as WarehouseFilters['sortBy'])}
            className="filter-select"
          >
            <option value="name">{t('filters.nameAZ')}</option>
            <option value="price-asc">{t('filters.priceLowHigh')}</option>
            <option value="price-desc">{t('filters.priceHighLow')}</option>
            <option value="availability">{t('filters.mostAvailable')}</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        className="btn-advanced-toggle"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? '▼' : '▶'} {t('filters.advancedFilters')}
      </button>

      {showAdvanced && (
        <div className="advanced-filters">
          {/* Price Range */}
          <div className="filter-section">
            <label className="filter-section-title">{t('filters.priceRange')}</label>
            <div className="filter-row">
              <div className="filter-group">
                <label>{t('filters.minPrice')}</label>
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
                <label>{t('filters.maxPrice')}</label>
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
            <label className="filter-section-title">{t('filters.unitSize')}</label>
            <div className="filter-row">
              <div className="filter-group">
                <label>{t('filters.minSize')}</label>
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
                <label>{t('filters.maxSize')}</label>
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
            <label className="filter-section-title">{t('features.title')}</label>
            <div className="feature-checkboxes">
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.climateControl}
                  onChange={() => handleFeatureToggle('climateControl')}
                />
                <span>🌡️ {t('features.climateControl')}</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.security}
                  onChange={() => handleFeatureToggle('security')}
                />
                <span>🔒 {t('features.security')}</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.access24x7}
                  onChange={() => handleFeatureToggle('access24x7')}
                />
                <span>🕐 {t('features.access24x7')}</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.cctv}
                  onChange={() => handleFeatureToggle('cctv')}
                />
                <span>📹 {t('features.cctv')}</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.fireSafety}
                  onChange={() => handleFeatureToggle('fireSafety')}
                />
                <span>🔥 {t('features.fireSafety')}</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.loadingDock}
                  onChange={() => handleFeatureToggle('loadingDock')}
                />
                <span>🚛 {t('features.loadingDock')}</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.forkliftAccess}
                  onChange={() => handleFeatureToggle('forkliftAccess')}
                />
                <span>🏗️ {t('features.forkliftAccess')}</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.insurance}
                  onChange={() => handleFeatureToggle('insurance')}
                />
                <span>🛡️ {t('features.insurance')}</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.powerSupply}
                  onChange={() => handleFeatureToggle('powerSupply')}
                />
                <span>⚡ {t('features.powerSupply')}</span>
              </label>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={filters.features.pestControl}
                  onChange={() => handleFeatureToggle('pestControl')}
                />
                <span>🐛 {t('features.pestControl')}</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
