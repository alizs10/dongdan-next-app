import { ChevronDown, Loader2 } from 'lucide-react';
import { FC } from 'react';

interface LoadMoreProps {
    currentPage: number;
    totalPages: number;
    onLoadMore: (page: number) => void;
    loading: boolean;
}

const LoadMore: FC<LoadMoreProps> = ({ currentPage, totalPages, onLoadMore, loading }) => {
    const hasMorePages = currentPage < totalPages;

    return (
        <div className="flex items-center justify-center">
            {hasMorePages && (
                <button
                    onClick={() => onLoadMore(currentPage + 1)}
                    className="primary_text_color flex flex-row items-center gap-x-2 hover:opacity-80 transition-opacity"
                >
                    <span className='text-base'>
                        {loading ? "در حال دریافت..." : "بیشتر"}
                    </span>
                    {loading ? <Loader2 className='size-5 animate-spin' /> : <ChevronDown className='size-5' />}
                </button>
            )}
        </div>
    );
};

export default LoadMore;
