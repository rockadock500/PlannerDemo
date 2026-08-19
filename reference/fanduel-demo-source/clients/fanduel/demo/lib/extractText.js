(function () {
  const MAX_CHARS = 50000;

  function normaliseKind(filename) {
    const lower = String(filename || "").toLowerCase();
    if (lower.endsWith(".pdf")) return "pdf";
    if (lower.endsWith(".docx")) return "docx";
    if (lower.endsWith(".md") || lower.endsWith(".markdown")) return "md";
    if (lower.endsWith(".txt")) return "txt";
    return null;
  }

  function wordCount(text) {
    return String(text || "").split(/\s+/).filter(Boolean).length;
  }

  async function extractText(file) {
    const kind = normaliseKind(file && file.name);
    if (!kind) {
      throw new Error(`Unsupported file type: ${file?.name || "upload"}. Accepted: PDF, DOCX, MD, TXT.`);
    }

    if (kind === "pdf" || kind === "docx") {
      throw new Error(`${kind.toUpperCase()} extraction needs the post-Karl document libraries. Upload TXT or MD in this static demo.`);
    }

    const raw = await file.text();
    const truncated = raw.length > MAX_CHARS ? raw.slice(0, MAX_CHARS) : raw;
    const text = truncated.trim();
    return {
      name: file.name,
      kind,
      text,
      charCount: text.length,
      wordCount: wordCount(text)
    };
  }

  window.extractText = extractText;
})();
