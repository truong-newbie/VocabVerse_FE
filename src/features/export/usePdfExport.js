import { useMutation } from '@tanstack/react-query'
import { exportService } from './export.service'
import { downloadBlob } from './downloadUtils'

export function useExportCollectionPdf() {
  return useMutation({
    mutationFn: exportService.exportCollectionPdf,
    onSuccess: ({ blob, filename }) => {
      downloadBlob(blob, filename)
    },
  })
}

export function useExportAllVocabulariesPdf() {
  return useMutation({
    mutationFn: exportService.exportAllVocabulariesPdf,
    onSuccess: ({ blob, filename }) => {
      downloadBlob(blob, filename)
    },
  })
}
