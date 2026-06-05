import { apiClient } from '@/services/apiClient'
import { getFilenameFromContentDisposition } from './downloadUtils'

const EXPORT_BASE = '/export'

/**
 * @typedef {import('@/types/export').PdfExportResponse} PdfExportResponse
 */

function getContentDisposition(headers) {
  if (typeof headers?.get === 'function') {
    return headers.get('content-disposition') || headers.get('Content-Disposition')
  }
  return headers?.['content-disposition'] || headers?.['Content-Disposition']
}

export const exportService = {
  /** @param {string | number} collectionId @returns {Promise<PdfExportResponse>} */
  async exportCollectionPdf(collectionId) {
    const fallbackFilename = `vocabverse-collection-${collectionId}.pdf`
    const response = await apiClient.get(`${EXPORT_BASE}/collections/${collectionId}/pdf`, {
      responseType: 'blob',
    })

    return {
      blob: response.data,
      filename: getFilenameFromContentDisposition(getContentDisposition(response.headers), fallbackFilename),
    }
  },

  /** @returns {Promise<PdfExportResponse>} */
  async exportAllVocabulariesPdf() {
    const fallbackFilename = 'vocabverse-vocabularies.pdf'
    const response = await apiClient.get(`${EXPORT_BASE}/vocabularies/pdf`, {
      responseType: 'blob',
    })

    return {
      blob: response.data,
      filename: getFilenameFromContentDisposition(getContentDisposition(response.headers), fallbackFilename),
    }
  },
}
