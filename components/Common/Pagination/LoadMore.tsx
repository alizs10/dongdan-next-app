import { ChevronDown, Loader2 } from 'lucide-react';
import { FC } from 'react';
import { Pagination } from '@/types/globals';

interface LoadMoreProps {
    pagination: Pagination;
    onLoadMore: (cursor: string) => void;
    loading: boolean;
}

const LoadMore: FC<LoadMoreProps> = ({ pagination, onLoadMore, loading }) => {

    const hasMorePages = pagination.has_more;
    return (
        <div className="flex items-center justify-center">
            {hasMorePages && (
                <button
                    onClick={() => onLoadMore(pagination.next_cursor!)}
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
