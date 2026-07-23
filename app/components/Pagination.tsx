import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface paginationProps {
  currentPages: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string>;
}
const Pagination = ({
  currentPages,
  totalPages,
  baseUrl,
  searchParams,
}: paginationProps) => {
  if (totalPages <= 1) return null;
    const getPageUrl = (page: number) => {
      const params = new URLSearchParams({
        ...searchParams,
        page: String(page),
      });
      return `${baseUrl}?${params.toString()}`;
    };
  const getvisiblePages = () => {
    const data = 2;
    const range = [];
    const rangeWidthDots = [];
    for(let i = Math.max(2, currentPages - data); i <= Math.min(totalPages - 1, currentPages + data); i++) {
      range.push(i);

    
    }
    if
    (currentPages - data > 2) {
      rangeWidthDots.push(1,"...");
    } else{
      rangeWidthDots.push(1);
    }

    rangeWidthDots.push(...range);

        if (currentPages + data< totalPages - 1) {
          rangeWidthDots.push("..." ,totalPages);
        } else {
          rangeWidthDots.push(totalPages);
        }

    return rangeWidthDots;
  }

  const visiblePages = getvisiblePages();
  
  return (
    <nav className="flex items-center justify-center gap-1">
      <Link
        href=""
        className={`flex items-center px-3 py-2 text-sm font-meium rounded-lg ${
          currentPages <= 1
            ? "text-gray-400 cursor-not-allowed bg-gray-100"
            : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
        }`}
        aria-disabled={currentPages <= 1}
      >
        <ChevronLeft /> Prevous
      </Link>

      {visiblePages.map((page, _key) => {

      if (page === "...") {
        return (
          <span key={_key} className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }
        const pageNumber = page as number;
        const isCurrentPage = pageNumber === currentPages;

        return (
          <Link
            key={_key}
            href={`${baseUrl}?page=${pageNumber}`}
            className={`px-3 py-2 text-sm font-medium border rounded-lg ${
              isCurrentPage
                ? "bg-purple-600 text-white border-purple-600"
                : "text-gray-700 hover:bg-gray-100 bg-white border-gray-300"
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}

      <Link
        href={getPageUrl(currentPages + 1)}
        className={`flex items-center px-3 py-2 text-sm font-meium rounded-lg ${
          currentPages >= totalPages
            ? "text-gray-400 cursor-not-allowed bg-gray-100"
            : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
        }`}
        aria-disabled={currentPages >= totalPages}
      >
        Next
        <ChevronRight />
      </Link>
    </nav>
  );
};

export default Pagination;
