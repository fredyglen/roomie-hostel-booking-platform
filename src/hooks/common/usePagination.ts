import { useState, useCallback, useMemo } from 'react';
import { config } from '@/config';

interface UsePaginationProps {
  totalItems: number;
  initialPage?: number;
  initialPageSize?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  canNextPage: boolean;
  canPrevPage: boolean;
  pageItems: number[];
  startIndex: number;
  endIndex: number;
}

export function usePagination({
  totalItems,
  initialPage = 1,
  initialPageSize = config.app.defaultPageSize,
}: UsePaginationProps): UsePaginationReturn {
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(
    Math.min(initialPageSize, config.app.maxPageSize)
  );

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  // Ensure page is within valid range
  const setValidPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      setPage(validPage);
    },
    [totalPages]
  );

  // Navigation functions
  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const firstPage = useCallback(() => {
    setPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  // Calculate if can navigate
  const canNextPage = useMemo(() => page < totalPages, [page, totalPages]);
  const canPrevPage = useMemo(() => page > 1, [page]);

  // Calculate page items for pagination display
  const pageItems = useMemo(() => {
    const maxPageItems = 5;
    const items: number[] = [];

    if (totalPages <= maxPageItems) {
      // Show all pages if total pages is less than max items
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust if at the beginning or end
      if (page <= 2) {
        endPage = 3;
      } else if (page >= totalPages - 1) {
        startPage = totalPages - 2;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        items.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        items.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      items.push(totalPages);
    }

    return items;
  }, [page, totalPages]);

  // Calculate start and end indices
  const startIndex = useMemo(() => (page - 1) * pageSize, [page, pageSize]);
  const endIndex = useMemo(
    () => Math.min(startIndex + pageSize - 1, totalItems - 1),
    [startIndex, pageSize, totalItems]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      const validSize = Math.min(newSize, config.app.maxPageSize);
      setPageSize(validSize);
      // Adjust current page to maintain approximate position
      const newPage = Math.floor((startIndex / validSize) + 1);
      setValidPage(newPage);
    },
    [startIndex, setValidPage]
  );

  return {
    page,
    pageSize,
    totalPages,
    setPage: setValidPage,
    setPageSize: handlePageSizeChange,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    canNextPage,
    canPrevPage,
    pageItems,
    startIndex,
    endIndex,
  };
}