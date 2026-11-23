# Plano técnico — Stremio PS4

## 1. Alvo

- Modelos: PS4 Fat, Slim e Pro.
- Firmware pretendido: 13.00–14.02.
- Controles: DualShock 4.
- Saída: pacote instalável apenas após validar toolchain, runtime e ambiente homebrew compatíveis.

## 2. Decisões ainda abertas

1. **Runtime:** app nativo Orbis ou interface web encapsulada. A escolha depende de APIs disponíveis, suporte a mídia e toolchain legalmente acessível.
2. **Empacotamento:** gerar PKG apenas depois de uma compilação reproduzível e teste em console compatível.
3. **Autenticação:** confirmar um fluxo Stremio suportado para vinculação por QR. A existência de textos de QR em traduções do Stremio não prova que exista uma API pública de pairing utilizável por este projeto.
4. **Reprodução:** validar codecs, HLS/DASH, legendas, áudio e limitações do runtime. Não prometer compatibilidade universal.

## 3. Etapas

- [ ] Inspecionar o ambiente e as APIs/runtime disponíveis para o alvo (bloqueador para decidir o empacotamento).
- [x] Criar primeira prévia visual de interface de TV com navegação por teclado. O mapeamento para DualShock 4 e a execução no PS4 ainda não foram testados. Ainda é uma demonstração com dados fictícios, sem login ou reprodução.
- [ ] Validar autenticação e sincronização com métodos suportados pelo Stremio.
- [ ] Integrar catálogos/add-ons confiáveis.
- [ ] Validar reprodução de conteúdo autorizado.
- [ ] Automatizar build e empacotamento.
- [ ] Testar separadamente em Fat, Slim e Pro e registrar firmware/runtime usados.

## 4. Critérios de aceite

- Toda navegação principal funciona sem mouse ou teclado.
- Login não exige inserir credenciais em telas de terceiros nem expor tokens.
- Biblioteca e estado de reprodução sincronizam corretamente.
- O player informa formatos não suportados em vez de travar.
- O PKG é reproduzível a partir do código e só é anunciado como funcional após teste real.

## 5. Referências técnicas iniciais

- Stremio Web: https://github.com/Stremio/stremio-web
- Stremio API Client: https://github.com/Stremio/stremio-api-client
