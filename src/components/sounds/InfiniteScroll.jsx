import React, { useEffect, useRef } from 'react';

export default function InfiniteScroll({ children, hasMore, loadMore, loading }) {
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    }, options);

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadMore, loading]);

  return (
    <div>
      {children}
      <div ref={loaderRef} className="h-10 mt-4" />
    </div>
  );
}