import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ResponsiveTable = ({
  columns = [],
  data = [],
  keyExtractor = (item) => item.id,
  emptyMessage = 'No records found',
  renderMobileCard, // optional custom renderer for mobile view
  pagination,
  className = '',
}) => {
  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Mobile Card View (shown below md screen) if renderMobileCard provided */}
      {renderMobileCard && (
        <div className="block md:hidden space-y-3">
          {data.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 glass-card rounded-2xl">
              {emptyMessage}
            </div>
          ) : (
            data.map((item, index) => (
              <div key={keyExtractor(item) || index}>
                {renderMobileCard(item, index)}
              </div>
            ))
          )}
        </div>
      )}

      {/* Desktop & Tablet Table with Horizontal Scroll Overflow Container */}
      <div className={`${renderMobileCard ? 'hidden md:block' : 'block'} w-full overflow-x-auto rounded-2xl border border-slate-800 bg-[#111827]/40 backdrop-blur-xl shadow-xl`}>
        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider sticky top-0 z-10">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 sm:px-6 whitespace-nowrap ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr
                  key={keyExtractor(item) || rowIdx}
                  className="hover:bg-indigo-600/[0.04] transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-3.5 px-4 sm:px-6 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(item, rowIdx) : item[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 px-2">
          <span>
            Showing <strong className="text-white">{pagination.from || 1}</strong> to <strong className="text-white">{pagination.to || data.length}</strong> of <strong className="text-white">{pagination.total || data.length}</strong> results
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.currentPage <= 1}
              onClick={pagination.onPrev}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 font-semibold text-white">
              {pagination.currentPage || 1}
            </span>
            <button
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={pagination.onNext}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
