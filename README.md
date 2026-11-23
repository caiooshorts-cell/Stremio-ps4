# Stremio PS4

Projeto experimental de um cliente de mídia com interface para TV e navegação pelo DualShock 4.

## Objetivo

Investigar uma implementação para PS4 Fat, Slim e Pro, com uma faixa inicial de compatibilidade pretendida entre os firmwares 13.00 e 14.02. Primeiro alvo de validação informado: PS4 no firmware 13.52. A faixa 13.00–14.02 é apenas uma meta futura, **não uma garantia de instalação ou execução**.

## Recursos planejados

- Interface em tela cheia, adequada a televisores.
- Navegação por direcional, X, O, Options e touchpad do DualShock 4 quando suportados pelo runtime.
- Integração com conta e biblioteca Stremio.
- Fluxo de vinculação por QR Code somente se houver um fluxo oficial/compatível e documentado.
- Catálogos e reprodução por fontes autorizadas e add-ons confiáveis.

## Estado atual

Este repositório acabou de ser criado e ainda não contém um aplicativo funcional nem um arquivo PKG. O primeiro passo é validar a arquitetura e as limitações do ambiente PS4 antes de escolher o empacotamento.

## Arquitetura em avaliação

O Stremio Web oficial usa uma interface React, stremio-core compilado para WebAssembly e uma camada de reprodução própria. O funcionamento completo depende também dos serviços necessários no dispositivo. Um simples WebView/HTML não garante que todos esses componentes, codecs ou protocolos funcionem no PS4.

## Segurança da conta

- Nunca coloque senha, authKey, token de sessão ou QR pessoal em issues, commits ou arquivos deste repositório.
- Não implemente autenticação por endpoints privados ou não documentados sem validação.
- A vinculação por QR ainda precisa ser confirmada; não está implementada.

## Referências

- [Stremio Web (código oficial)](https://github.com/Stremio/stremio-web)
- [Stremio API Client (código oficial)](https://github.com/Stremio/stremio-api-client)

## Licença

O código original deste projeto deverá ter uma licença definida antes da primeira distribuição. Componentes de terceiros mantêm suas próprias licenças.
