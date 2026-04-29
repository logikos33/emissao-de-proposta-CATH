# Integração Google Drive API

## Visão geral

Usamos a Drive API para dois fins:

1. **Duplicar** o template Slides (via `files.copy`)
2. **Exportar** o Slides como PDF (via `files.export`)

## Dependência

```bash
pnpm add googleapis
```

## Export do Slides para PDF

```typescript
import { google } from 'googleapis'

/**
 * Exporta um Google Slides como PDF e retorna o buffer do arquivo.
 * O PDF é gerado pelo Drive — não requer conversão local.
 *
 * @param presentationId - ID do Slides no Drive
 * @param accessToken - OAuth2 access token do usuário
 */
export async function exportSlidesAsPdf(
  presentationId: string,
  accessToken: string,
): Promise<Buffer> {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  const drive = google.drive({ version: 'v3', auth })

  const response = await drive.files.export(
    { fileId: presentationId, mimeType: 'application/pdf' },
    { responseType: 'arraybuffer' },
  )

  return Buffer.from(response.data as ArrayBuffer)
}
```

## Salvar PDF na pasta de saída

```typescript
/**
 * Faz upload do buffer PDF para a pasta de saída no Drive.
 * Retorna o ID do arquivo criado e o link compartilhável.
 *
 * @param pdfBuffer - Buffer do PDF gerado
 * @param fileName - Nome do arquivo (ex: "Proposta - Cliente - 2026-04-29.pdf")
 * @param folderId - ID da pasta de destino (GOOGLE_DRIVE_OUTPUT_FOLDER_ID)
 * @param accessToken - OAuth2 access token do usuário
 */
export async function uploadPdfToFolder(
  pdfBuffer: Buffer,
  fileName: string,
  folderId: string,
  accessToken: string,
): Promise<{ fileId: string; webViewLink: string }> {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  const drive = google.drive({ version: 'v3', auth })

  const file = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
      mimeType: 'application/pdf',
    },
    media: { mimeType: 'application/pdf', body: Readable.from(pdfBuffer) },
    fields: 'id, webViewLink',
  })

  return {
    fileId: file.data.id ?? '',
    webViewLink: file.data.webViewLink ?? '',
  }
}
```

## Permissões necessárias no Google Cloud

Scopes OAuth2 necessários:

- `https://www.googleapis.com/auth/drive.file` — criar e acessar arquivos do app
- `https://www.googleapis.com/auth/presentations` — ler/editar Slides
