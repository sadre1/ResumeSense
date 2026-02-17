import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

// Setup for server-side environments
if (typeof window === 'undefined') {
  // @ts-ignore
  await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
}

export async function parsePdf(data: Uint8Array) {
  const loadingTask = pdfjs.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
  });

  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // @ts-ignore
    const strings = content.items.map((item) => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}
