export default function Loading() {
  return <div className="container loading-page" aria-busy="true" aria-label="Loading products"><div className="loading-title" /><div className="loading-grid">{Array.from({ length: 6 }, (_, index) => <div className="product-skeleton" key={index} />)}</div></div>;
}
