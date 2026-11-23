const DEFAULT_TIMEOUT_MS = 12000;

export function normalizeManifestUrl(input) {
  if (typeof input !== "string" || !input.trim()) {
    throw new TypeError("Informe o endereço do manifest.");
  }

  let url;
  try {
    url = new URL(input.trim());
  } catch {
    throw new TypeError("O endereço do manifest não é válido.");
  }

  if (url.protocol !== "https:") {
    throw new TypeError("Por segurança, somente endereços HTTPS são aceitos.");
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new TypeError("O endereço não pode conter credenciais, parâmetros ou fragmentos.");
  }

  if (!url.pathname.endsWith("/manifest.json")) {
    url.pathname = url.pathname.endsWith("/")
      ? url.pathname + "manifest.json"
      : url.pathname + "/manifest.json";
  }
  return url.href;
}

export function validateManifest(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new TypeError("O servidor não retornou um manifest JSON válido.");
  }
  for (const field of ["id", "name", "version"]) {
    if (typeof manifest[field] !== "string" || !manifest[field].trim()) {
      throw new TypeError(`Manifest inválido: campo "${field}" ausente.`);
    }
  }
  if (!Array.isArray(manifest.types) || !Array.isArray(manifest.catalogs)) {
    throw new TypeError("Manifest inválido: tipos e catálogos precisam ser listas.");
  }
  if (manifest.catalogs.length > 100) {
    throw new TypeError("Manifest recusado: quantidade excessiva de catálogos.");
  }

  const catalogs = manifest.catalogs.filter((catalog) =>
    catalog &&
    typeof catalog.type === "string" &&
    typeof catalog.id === "string" &&
    typeof catalog.name === "string"
  );

  if (catalogs.length !== manifest.catalogs.length) {
    throw new TypeError("Manifest contém uma definição de catálogo inválida.");
  }
  if (catalogs.some((catalog) => catalog.type.length > 40 || catalog.id.length > 160 || catalog.name.length > 120)) {
    throw new TypeError("Manifest contém campos de catálogo muito longos.");
  }
  return { ...manifest, catalogs };
}

function withTimeout(timeoutMs, externalSignal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("Tempo limite excedido.")), timeoutMs);
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort(externalSignal.reason);
    else externalSignal.addEventListener("abort", () => controller.abort(externalSignal.reason), { once: true });
  }
  return { signal: controller.signal, cleanup: () => clearTimeout(timer) };
}

async function getJson(url, { fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS, signal } = {}) {
  const timeout = withTimeout(timeoutMs, signal);
  try {
    const response = await fetchImpl(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      signal: timeout.signal
    });
    if (!response || !response.ok) {
      throw new Error(`Servidor respondeu com status ${response?.status ?? "desconhecido"}.`);
    }
    const contentType = response.headers?.get?.("content-type") || "";
    if (contentType && !contentType.toLowerCase().includes("json")) {
      throw new TypeError("O servidor não retornou conteúdo JSON.");
    }
    return await response.json();
  } finally {
    timeout.cleanup();
  }
}

export async function fetchAddonManifest(input, options = {}) {
  const manifestUrl = normalizeManifestUrl(input);
  const manifest = validateManifest(await getJson(manifestUrl, options));
  if (!manifest.resources?.includes?.("catalog") &&
      !manifest.resources?.some?.((resource) => resource && resource.name === "catalog")) {
    throw new TypeError("Este add-on não oferece o recurso de catálogo.");
  }
  return { manifestUrl, manifest };
}

export function buildCatalogUrl(manifestUrl, catalog) {
  const safeManifestUrl = normalizeManifestUrl(manifestUrl);
  if (!catalog || typeof catalog.type !== "string" || typeof catalog.id !== "string") {
    throw new TypeError("Definição de catálogo inválida.");
  }
  const base = new URL(safeManifestUrl);
  base.pathname = base.pathname.slice(0, -"manifest.json".length);
  base.pathname += `catalog/${encodeURIComponent(catalog.type)}/${encodeURIComponent(catalog.id)}.json`;
  return base.href;
}

export async function fetchAddonCatalog(manifestUrl, catalog, options = {}) {
  const payload = await getJson(buildCatalogUrl(manifestUrl, catalog), options);
  if (!payload || !Array.isArray(payload.metas)) {
    throw new TypeError("Resposta do catálogo inválida: a lista metas não foi encontrada.");
  }
  return payload.metas.filter((meta) =>
    meta &&
    typeof meta.id === "string" &&
    typeof meta.type === "string" &&
    typeof meta.name === "string"
  );
}
