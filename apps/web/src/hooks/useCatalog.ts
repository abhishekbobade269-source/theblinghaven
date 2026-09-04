'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductDto, CategoryDto } from '@theblinghaven/shared';
import { getProducts, getCategories, CatalogFilterParams } from '@/services/catalog.service';

export function useCatalog(initialFilters?: CatalogFilterParams) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [filters, setFilters] = useState<CatalogFilterParams>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalogData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        getProducts(filters),
        getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: any) {
      setError(err?.message || 'Unable to load catalog.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCatalogData();
  }, [fetchCatalogData]);

  const updateFilters = useCallback((newFilters: Partial<CatalogFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const totalCount = useMemo(() => products.length, [products]);

  return {
    products,
    categories,
    filters,
    isLoading,
    error,
    updateFilters,
    clearFilters,
    refresh: fetchCatalogData,
    totalCount,
  };
}
