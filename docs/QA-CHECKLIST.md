# Checklist de qualidade — Stremio PS4

Este checklist separa o que pode ser verificado na prévia web do que exige um console e um runtime homebrew compatível.

## Prévia de interface (navegador)

- [ ] Abrir `prototype/index.html` em tela 16:9.
- [ ] Conferir layout em 1080p e em resolução menor.
- [ ] Navegar pelos cards com setas do teclado.
- [ ] Conectar um controle compatível e verificar se o navegador/runtime expõe Gamepad API.
- [ ] Testar direcional, X (selecionar), O/Options (voltar) e L1/R1 (atalhos de abas) via Gamepad API.
- [ ] Confirmar o comportamento quando o controle é conectado/desconectado durante a execução.
- [ ] Abrir detalhes com Enter/X e fechar com Escape/O.
- [ ] Abrir busca com `/` ou `F` e filtrar títulos fictícios.
- [ ] Alternar Início, Descobrir e Minha biblioteca.
- [ ] Confirmar que o aviso de demonstração permanece visível.
- [ ] Confirmar que a tela de conexão não solicita senha, token ou dados pessoais.

## Integração real (ainda não implementada)

- [ ] Confirmar runtime e APIs disponíveis no firmware/dispositivo de teste.
- [ ] Usar somente fluxo de autenticação suportado e documentado pelo Stremio.
- [ ] Verificar armazenamento seguro e expiração/revogação de sessão.
- [ ] Sincronizar biblioteca e progresso com conta de teste.
- [ ] Tratar erros de rede, timeout, respostas inválidas e ausência de add-ons.
- [ ] Restringir a integração a conteúdo e fontes que o usuário tenha autorização para acessar.

## Reprodução e console (ainda não implementadas)

- [ ] Testar codecs, contêineres, HLS/DASH, legendas e faixas de áudio.
- [ ] Testar pausa, retomada, seek, troca de faixa e falhas de conexão.
- [ ] Testar foco e navegação apenas com DualShock 4.
- [ ] Medir inicialização, uso de memória, estabilidade e tempo de resposta.
- [ ] Repetir testes separadamente em cada modelo e firmware declarado como compatível.

## Regra de release

Não marcar uma versão como funcional nem publicar um PKG como pronto até que o artefato seja reproduzível e os testes de instalação, inicialização, navegação, autenticação e reprodução tenham sido executados em hardware compatível. Registre modelo, firmware, versão do runtime e resultado de cada teste.
