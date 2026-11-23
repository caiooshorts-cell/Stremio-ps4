import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeManifestUrl,
  validateManifest,
  buildCatalogUrl,
  fetchAddonManifest,
  fetchAddonCatalog
} from "../prototype/stremio-addon-client.mjs";

test("normaliza URL HTTPS para manifest.json", () => {
  assert.equal(
    normalizeManifestUrl("https://example.org/addon"),
    "https://example.org/addon/manifest.json"
  );
  assert.equal(
    normalizeManifestUrl("https://example.org/addon/manifest.json"),
    "https://example.org/addon/manifest.json"
  );
});

test("recusa esquemas inseguros e URLs com credenciais", () => {
  assert.throws(() => normalizeManifestUrl("http://example.org/addon"), /HTTPS/);
  assert.throws(() => normalizeManifestUrl("javascript:alert(1)"));
  assert.throws(() => normalizeManifestUrl("https://user:pass@example.org/addon"));
  assert.throws(() => normalizeManifestUrl("https://example.org/addon?token=abc"));
});

test("valida manifest e catálogo", () => {
  const manifest = validateManifest({
    id: "org.example.catalog",
    name: "Catálogo de exemplo",
    version: "1.0.0",
    types: ["movie"],
    catalogs: [{ type: "movie", id: "recent", name: "Recentes" }],
    resources: ["catalog"]
  });
  assert.equal(manifest.catalogs[0].id, "recent");
  assert.throws(() => validateManifest({ name: "Sem ID" }));
  assert.throws(() => validateManifest({
    id: "bad", name: "Bad", version: "1", types: [], catalogs: [{}]
  }));
});

test("monta endpoint de catálogo preservando subdiretório", () => {
  assert.equal(
    buildCatalogUrl("https://example.org/stremio/manifest.json", {
      type: "movie", id: "recent"
    }),
    "https://example.org/stremio/catalog/movie/recent.json"
  );
});

test("carrega manifest sem enviar credenciais", async () => {
  let request;
  const fetchImpl = async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: async () => ({
        id: "org.example",
        name: "Example",
        version: "1.0.0",
        types: ["movie"],
        catalogs: [{ type: "movie", id: "recent", name: "Recentes" }],
        resources: ["catalog"]
      })
    };
  };
  const result = await fetchAddonManifest("https://example.org/addon", { fetchImpl });
  assert.equal(result.manifest.id, "org.example");
  assert.equal(request.options.credentials, "omit");
  assert.equal(request.options.redirect, "error");
  assert.equal(request.options.headers.Accept, "application/json");
});

test("carrega somente metadados válidos do catálogo", async () => {
  const metas = await fetchAddonCatalog(
    "https://example.org/addon/manifest.json",
    { type: "movie", id: "recent" },
    {
      fetchImpl: async () => ({
        ok: true,
        status: 200,
        headers: { get: () => "application/json" },
        json: async () => ({
          metas: [
            { id: "tt1", type: "movie", name: "Filme permitido" },
            { id: "invalid" }
          ]
        })
      })
    }
  );
  assert.deepEqual(metas, [{ id: "tt1", type: "movie", name: "Filme permitido" }]);
});
