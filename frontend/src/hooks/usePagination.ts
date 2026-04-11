import { useState, useCallback } from 'react';

interface UsePaginationProps {
    initialPage?: number;
    pageSize?: number;
    totalItems?: number;
}

export const usePagination = ({ 
    initialPage = 1, 
    pageSize = 15, 
    totalItems = 0 
}: UsePaginationProps = {}) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const totalPages = Math.ceil(totalItems / pageSize);

    const nextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const prevPage = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
    }, [totalPages]);

    const reset = useCallback(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);

    return {
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        reset,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
};