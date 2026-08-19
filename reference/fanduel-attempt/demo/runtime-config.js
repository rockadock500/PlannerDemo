// Chat backend intentionally not built yet — disabled so the UI falls back to its
// deterministic/local narration mode instead of calling a /api/chat that doesn't exist.
// Flip "enabled" to true once a real chat endpoint is wired up.
window.FANDUEL_LLM_CONFIG = {"enabled":false,"endpoint":"/api/chat","model":"claude-haiku-4-5-20251001","timeoutMs":20000};
