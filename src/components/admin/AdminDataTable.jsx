import Button from '@/components/ui/Button'
import AdminEmptyState from './AdminEmptyState'
import AdminLoadingState from './AdminLoadingState'
import { cn } from '@/utils/cn'

export default function AdminDataTable({ columns, rows = [], isLoading, emptyTitle = 'No records found', emptyDescription, getRowKey, pagination, className }) {
  if (isLoading) {
    return <AdminLoadingState rows={6} />
  }

  if (!rows.length) {
    return <AdminEmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={cn('px-5 py-4 font-semibold', column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {rows.map((row, index) => (
              <tr key={getRowKey?.(row) ?? row.id ?? row.userId ?? index} className="transition hover:bg-white/[0.035]">
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-5 py-4 align-middle text-slate-300', column.cellClassName)}>
                    {column.render ? column.render(row, index) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Page {pagination.page + 1}{pagination.totalPages ? ` of ${pagination.totalPages}` : ''}</p>
          <div className="flex gap-2">
            <Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" disabled={pagination.page <= 0} onClick={() => pagination.onPageChange(pagination.page - 1)}>Previous</Button>
            <Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" disabled={pagination.isLastPage} onClick={() => pagination.onPageChange(pagination.page + 1)}>Next</Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
