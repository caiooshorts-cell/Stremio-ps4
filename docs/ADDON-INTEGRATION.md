# Integração inicial com add-ons Stremio

## Escopo implementado

O protótipo agora consegue:

1. Receber o endereço HTTPS de um `manifest.json`.
2. Validar os campos essenciais do manifesto e as definições de catálogo.
3. Consultar um catálogo no formato HTTP do protocolo Stremio.
4. Exibir somente itens de metadados válidos (`id`, `type` e `name`).
5. Recusar URLs que não usem HTTPS ou que incluam credenciais, query string ou fragmento.
6. Fazer requisições sem cookies/credenciais, sem seguir redirecionamentos e com limite de tempo.

A interface não consulta o recurso `stream`, não inicia reprodução e não autentica uma conta Stremio. O usuário deve adicionar somente endereços de add-ons em que confia. A compatibilidade depende de o servidor permitir CORS e responder ao protocolo.

## Formato do protocolo

O protocolo Stremio usa um manifesto em `/manifest.json` e rotas de recursos como `/catalog/{type}/{id}.json`. O manifesto declara os tipos e catálogos oferecidos pelo add-on. Consulte a especificação oficial antes de ampliar a implementação.

## Limitações conhecidas

- CORS pode impedir a leitura no navegador mesmo quando o servidor está online.
- O suporte a HTTPS e Fetch no navegador/runtime do PS4 ainda não foi verificado.
- A versão atual carrega metadados sem paginação, filtros avançados ou cache persistente.
- Não existe ainda autenticação, biblioteca sincronizada, descoberta automática da central de add-ons ou player.
- Os testes automatizados usam respostas simuladas; não comprovam interoperabilidade com serviços reais nem execução no console.

## Segurança e privacidade

- Nunca cole senha, chave de sessão, token ou URL privada.
- Não salve credenciais no repositório.
- O cliente usa `credentials: "omit"` e só faz GET de manifesto e catálogo.
- Metadados recebidos são inseridos na interface via `textContent`, não como HTML confiável.
- A lista de add-ons é consultada apenas durante a sessão atual.

## Referências oficiais

- Stremio Add-on Protocol: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/protocol.md
- Stremio Add-on SDK: https://github.com/Stremio/stremio-addon-sdk
