import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { createEmptyVocabularyImportRow, getVocabularyImportRowErrors } from '@/features/vocabulary/vocabularyImportUtils'

const columns = [
  { key: 'term', label: 'term', required: true },
  { key: 'meaning', label: 'meaning', required: true },
  { key: 'vietnameseMeaning', label: 'vietnameseMeaning' },
  { key: 'partOfSpeech', label: 'partOfSpeech' },
  { key: 'pronunciation', label: 'pronunciation' },
  { key: 'exampleSentence', label: 'exampleSentence' },
  { key: 'note', label: 'note' },
]

export default function VocabularyPreviewTable({ rows, onChangeRows, disabled = false }) {
  const validCount = rows.filter((row) => !Object.keys(getVocabularyImportRowErrors(row)).length).length

  const updateCell = (rowIndex, key, value) => {
    onChangeRows(rows.map((row, index) => (index === rowIndex ? { ...row, [key]: value } : row)))
  }

  const removeRow = (rowIndex) => {
    onChangeRows(rows.filter((row, index) => index !== rowIndex))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">{rows.length} rows</Badge>
          <Badge variant={validCount === rows.length && rows.length ? 'success' : 'warning'}>{validCount} valid</Badge>
        </div>
        <Button variant="secondary" size="sm" disabled={disabled} onClick={() => onChangeRows([...rows, createEmptyVocabularyImportRow()])}>
          <FiPlus aria-hidden="true" /> Add Row
        </Button>
      </div>

      <div className="max-h-[46vh] overflow-auto rounded-card border border-border bg-card">
        <table className="min-w-[1120px] table-fixed text-left text-sm">
          <thead className="sticky top-0 z-[1] border-b border-border bg-muted text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="w-12 px-3 py-2">#</th>
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2">
                  {column.label}{column.required ? <span className="text-destructive"> *</span> : null}
                </th>
              ))}
              <th className="w-24 px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, rowIndex) => {
              const errors = getVocabularyImportRowErrors(row)
              const hasErrors = Object.keys(errors).length > 0

              return (
                <tr key={rowIndex} className={hasErrors ? 'bg-warning/5' : 'bg-card'}>
                  <td className="px-3 py-2 align-top">
                    <Badge variant={hasErrors ? 'warning' : 'success'}>{rowIndex + 1}</Badge>
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-2 align-top">
                      <input
                        value={row[column.key] || ''}
                        disabled={disabled}
                        onChange={(event) => updateCell(rowIndex, column.key, event.target.value)}
                        className={`h-9 w-full rounded-xl border bg-background px-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60 ${errors[column.key] ? 'border-destructive' : 'border-input'}`}
                        aria-label={`${column.label} row ${rowIndex + 1}`}
                      />
                      {errors[column.key] ? <p className="mt-1 text-xs font-semibold text-destructive">{errors[column.key]}</p> : null}
                    </td>
                  ))}
                  <td className="px-3 py-2 align-top text-right">
                    <Button variant="ghost" className="h-9 w-9 px-0" disabled={disabled} onClick={() => removeRow(rowIndex)} aria-label={`Remove row ${rowIndex + 1}`}>
                      <FiTrash2 aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {!rows.length ? (
        <div className="rounded-card border border-dashed border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
          No preview rows yet. Paste JSON, paste a word list, or normalize text with AI.
        </div>
      ) : null}
    </div>
  )
}
