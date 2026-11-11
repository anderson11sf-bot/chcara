# PROJECT_ARCHITECTURE.md — Paraíso das Águas
**Documentação Técnica Permanente da Arquitetura e Engenharia do Site**

*Versão:* 2.0 (Reformulação Conforme Especificação Mestre de 117 Páginas)  
*Repositório:* `https://github.com/anderson11sf-bot/chcara`  
*Local:* `C:\Users\ander\OneDrive\Desktop\SITES\chcara`  

---

## 1. Visão Geral e Posicionamento
* **Empreendimento:** Paraíso das Águas — São José dos Campos / SP
* **Categoria:** Propriedades rurais de grande dimensão (~20.000 m² a 22.300 m² / 2 hectares)
* **Conceito Central:** *"O NOVO LUXO MUDOU DE ENDEREÇO. A ROÇA É O NOVO LUXO."*
* **Pilares de Comunicação:** Exclusividade, Liberdade, Autossuficiência e Proximidade.
* **Diretriz de Imagens e Glebas:** Apresentação integrada e panorâmica do todo (lago, riacho, mata e topografia), sem subdivisão pontual individual que possa gerar confusão ou que dependa de fotos inexistentes por unidade.

---

## 2. Pilha Tecnológica (Stack) & Dependências
* **Core:** HTML5 Semântico, CSS3 Moderno (Custom Properties, Grid, Flexbox, Clamp), Vanilla JavaScript (ES Modules).
* **Build Tool:** Vite 5.4.x (empacotador rápido com tree-shaking e suporte a assets modernos).
* **Animação & Scroll:** GSAP 3.12.x + ScrollTrigger (orquestração por progresso normalizado 0 a 1).
* **Rolagem:** Rolagem nativa ultra-responsiva no mobile; inércia suave com Lenis no desktop.
* **Canvas:** Contexto 2D nativo com desenho procedural (fundo dinâmico, partículas e névoa).
* **Mídias:** WebP / AVIF para imagens estáticas com `loading="lazy"` e `decoding="async"`; MP4 com carregamento progressivo e poster para vídeos.

---

## 3. Ordem Arquitetural das 13 Seções (Master Spec)
1. **`#hero` — Hero Cinematográfica:** Apresentação da marca, chamada de impacto ("O novo luxo é ter espaço para viver"), selos de garantia e botão de descoberta.
2. **`#novo-luxo` — O Novo Luxo (Profundidade & Emoção):** Cena da família na varanda com camadas de profundidade controladas pelo scroll (transição cidade x campo).
3. **`#efeito-paraiso` — O Efeito Paraíso das Águas:** Vídeo curto (12-20s) com vistas aéreas de drone, lagos e riacho.
4. **`#propriedades` — As Propriedades (Visão Geral):** Panorama dos terrenos de 2 hectares, recursos hídricos e mapa esquemático geral.
5. **`#infraestrutura` — Infraestrutura (Cards Animados):** Preservação e reposicionamento da animação existente de cards com rotação e entrada/saída suaves.
6. **`#possibilidades` — Uma Terra, Inúmeras Possibilidades:** Galeria de projetos arquitetônicos com selo obrigatório `PROJETO ILUSTRATIVO`.
7. **`#autossuficiencia` — Vida Autossuficiente (O Quintal Produtivo):** Horta, pomar, galinheiro, energia solar e sustentabilidade rural.
8. **`#compartilhar` — Uma Propriedade para Compartilhar:** Estratégia de aquisição em conjunto para famílias e sócios.
9. **`#sao-jose` — São José dos Campos (A Cidade por Trás do Paraíso):** Destaque de localização, acesso a serviços, saúde, tecnologia e segurança.
10. **`#aquisicao` — Condições de Aquisição:** Acordeões informativos sobre escritura individual, financiamento direto e processo de compra.
11. **`#localizacao` — Localização & Mapa:** Distâncias reais confirmadas e atalho para o Google Maps.
12. **`#contato` — Conversão & Agendamento:** Formulário simplificado de interesse e integração direta via WhatsApp.
13. **`#rodape` — Rodapé Institucional:** Logotipo, avisos legais, política de privacidade e LGPD.

---

## 4. Sistema Centralizado de Dados (`src/config.js`)
Todo o conteúdo textual, comercial, mídias e parâmetros de scroll são controlados exclusivamente através de `src/config.js`:
* `whatsapp`: Número (`5512983208335`), mensagem base e mensagens personalizadas por origem de clique.
* `scroll`: Régua mestre de svh, parâmetros do Lenis e pontos de corte das etapas.
* `hero`: Headlines, selos e CTAs.
* `infraestrutura`: Lista de diferenciais e cards animados.
* `projetos`: Itens da galeria ilustrativa com legenda e identificador visual.
* `saoJose`: Distâncias verificadas e marcos urbanos.
* `aquisicao`: Tópicos de documentação e financiamento.

---

## 5. Regras de Performance e Mobile-First
1. **Prioridade Mobile:** Nenhum efeito pode bloquear o scroll nativo ou exigir precisão excessiva do dedo no celular.
2. **GPU Acceleration:** Transformações CSS restritas a `translate3d`, `scale` e `opacity`.
3. **Zero Layout Shifts:** Todas as imagens possuem dimensões e aspect-ratio definidos.
4. **Carregamento Progressivo:** Vídeos e mapas são carregados sob demanda (lazy) sem travar a abertura inicial do site.
5. **Acessibilidade:** Suporte total a `prefers-reduced-motion` com desativação graciosa de efeitos cinéticos complexos.
