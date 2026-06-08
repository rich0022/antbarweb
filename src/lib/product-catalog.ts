import {
  PRODUCT_CATALOG_ITEMS,
  type ProductCatalogFamily,
  type ProductCatalogItem,
} from '../data/product-catalog';

export type ProductCatalogTab = {
  id: 'all' | ProductCatalogFamily;
  label: string;
  cards: ProductCatalogItem[];
};

export function getProductCatalogTabs(): ProductCatalogTab[] {
  const disposable = PRODUCT_CATALOG_ITEMS.filter((item) => item.family === 'disposable');
  const podSys = PRODUCT_CATALOG_ITEMS.filter((item) => item.family === 'pod-sys');

  return [
    { id: 'all', label: 'All Products', cards: PRODUCT_CATALOG_ITEMS },
    { id: 'disposable', label: 'Disposable', cards: disposable },
    { id: 'pod-sys', label: 'Closed Pod system', cards: podSys },
  ];
}
