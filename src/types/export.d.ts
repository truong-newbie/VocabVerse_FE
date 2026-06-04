export type PdfExportResponse = {
  blob: Blob
  filename: string
}

export type ExportCollectionPdfParams = {
  collectionId: string | number
}
