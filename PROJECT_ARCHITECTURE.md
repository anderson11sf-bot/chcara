# PROJECT_ARCHITECTURE.md — Paraíso das Águas
**Documentação Técnica Permanente da Arquitetura e Engenharia do Site**

*Versão:* 3.0 (Reconstrução Completa: Scroll Animado Hero & Sessão 2, Abertura Central 3D e Mídias Novas)  
*Repositório:* `https://github.com/anderson11sf-bot/chcara`  
*Local:* `C:\Users\ander\OneDrive\Desktop\SITES\chcara`  
*Produção Vercel:* `https://chcara.vercel.app`  
*ZIP Hostinger:* `C:\Users\ander\OneDrive\Desktop\ZIPS_HOSTINGER\Paraiso_das_Aguas_Hostinger_Completo.zip` & `C:\Users\ander\OneDrive\Desktop\lagoa site.zip`

---

## 1. Visão Geral e Posicionamento
* **Empreendimento:** Paraíso das Águas — São José dos Campos / SP
* **Categoria:** Propriedades rurais particulares de grande dimensão (~20.000 m² a 22.300 m² / 2 hectares)
* **Conceito Central:** *"O NOVO LUXO MUDOU DE ENDEREÇO. A ROÇA É O NOVO LUXO."*
* **Pilares de Comunicação:** Exclusividade, Liberdade, Autossuficiência e Proximidade (20 min do centro e 2 km da Represa Jaguari).
* **Diretriz de Imagens e Glebas:** Visão panorâmica e autêntica do todo (grande lago central compartilhado, mina de água na parte alta, mata preservada e topografia com platôs), sem subdivisão pontual individual com fotos falsas.

---

## 2. Pilha Tecnológica (Stack) & Dependências
* **Core:** HTML5 Semântico, CSS3 Moderno (Custom Properties, Grid, Flexbox, Clamp), Vanilla JavaScript (ES Modules).
* **Build Tool:** Vite 5.4.x (empacotador estático ultra-rápido com tree-shaking).
* **Animação & Scroll:** GSAP 3.12.x + ScrollTrigger (orquestração por progresso normalizado 0 a 1).
* **Rolagem:** Rolagem nativa ultra-responsiva no mobile; inércia suave com Lenis no desktop (`syncTouch: false`).
* **Canvas de Animação Scroll:**
  * **Hero:** Canvas 60 FPS com 94 frames WebP (`/media/frames/hero/hero_0001.webp` a `0094.webp`) e vídeo H.264 `hero-scroll.mp4` com faststart e keyframe a cada frame.
  * **Sessão 2:** Canvas 60 FPS com 104 frames WebP (`/media/frames/sessao2/s2_0001.webp` a `0104.webp`) sincronizado ao scroll da natureza.
* **Mídias Otimizadas:** WebP para imagens estáticas com `loading="lazy"` e `decoding="async"`; MP4 H.264 para vídeos com poster imediato.

---

## 3. Ordem Arquitetural das 13 Seções (Master Blueprint)
1. **`#hero` — Hero Cinematográfica com Animação de Scroll:**
   - Wordmark em texto estilizado "Paraíso das Águas • São José dos Campos - SP".
   - Headline: *"Seu paraíso de 2 hectares com lago, água mineral e segurança"*.
   - Subheadline: *"a 20 minutos do centro de São José dos Campos e a 2 km da Represa Jaguari"*.
   - 3 Selos SVG: Documentação em ordem • Financia direto com o proprietário • Aceita imóvel na troca.
   - 4 Emblemas da Prova Rápida: 20 mil m² por chácara • Grande lago no coração da comunidade • Asfalto, fibra e trifásica • 20 min do centro.
   - Canvas de scroll integrado com o vídeo da chácara.
2. **`#secao-cenas` — Sessão 2: O Novo Luxo & Abertura Cinematográfica do Vídeo 3D:**
   - Transição da natureza e caminhada pela mata com canvas de 104 frames.
   - Carrossel 3D com mensagens narrativas da marca.
   - Clímax: Abertura horizontal pelo centro da tela (duas metades se afastando com feixe de luz central dourado), revelando o player tridimensional do terreno (`terreno-3d-cima.mp4`), que inicia reprodução automática suave.
3. **`#efeito-paraiso` — Apresentação Oficial (VSL):**
   - Player com moldura de TV LED contendo o vídeo oficial da VSL (`vsl-oficial.mp4`), comparativo dos ritmos da cidade e do campo.
4. **`#propriedades` — As Propriedades (Visão Geral 2 Hectares):**
   - Mapa oficial de demarcação de alta resolução (`mapa-oficial-terreno.webp`).
   - Vídeo de sobrevoo aéreo (`mapa-sobrevoo.mp4`).
   - Destaques de metragem (20.000 m² a 22.300 m²), grande lago central e referência de valor (a partir de R$ 475 mil*).
5. **`#infraestrutura` — Infraestrutura Completa:**
   - 8 cards interativos com rotação suave e ícones SVG: asfalto até a portaria, portaria/segurança, energia trifásica, fibra óptica 500MB, grande lago central, mina de água mineral, APP preservada, 2 km da Represa Jaguari.
6. **`#possibilidades` — Uma Terra, Inúmeras Possibilidades (Projetos Ilustrativos):**
   - Galeria com 5 imagens arquitetônicas conceituais e 2 vídeos de simulação 3D (`proj-mansao-campo.mp4` e `proj-chale-lago.mp4`).
   - Selo obrigatório `"PROJETO ILUSTRATIVO"` em cada foto e vídeo.
   - Disclaimer legal de transparência.
7. **`#autossuficiencia` — Vida Autossustentável (O Quintal Produtivo):**
   - Galeria com fotos reais do solo fértil e das águas da serra.
   - 4 pilares: horta/pomar, criação de animais/cavalos, água mineral na torneira, energia solar.
8. **`#compartilhar` — Uma Propriedade para Compartilhar:**
   - Conceito de aquisição compartilhada em família ou entre sócios (10.000 m² exclusivos para cada residência).
9. **`#sao-jose` — São José dos Campos & Represa Jaguari:**
   - Destaque náutico: 2 km da Represa Jaguari para passeios de jetski, lancha e pesca.
   - 20 min do Centro de SJC e Shopping Colinas; ~1h de São Paulo.
   - Vídeo panorâmico da cidade.
10. **`#aquisicao` — Condições de Aquisição & Segurança Jurídica:**
    - 4 acordeões detalhados: documentação em ordem, financiamento direto sem banco, aceitação de imóveis/carros na troca, agendamento de visita VIP.
11. **`#localizacao` — Localização & Distâncias Reais:**
    - Tabela de distâncias e botão para traçar rota direta no Google Maps.
12. **`#contato` — Conversão & Agendamento VIP:**
    - Formulário dinâmico com escolha do dia de preferência (sábado, domingo, dia útil) integrado ao WhatsApp.
13. **`#rodape` — Rodapé Institucional:**
    - FAQ interativo com 6 perguntas essenciais, avisos legais, copyright 2026, termos de privacidade e cookies.

---

## 4. Botão Flutuante de WhatsApp (`src/lib/whatsapp.js`)
* Posicionado fixo no canto inferior direito (`bottom: 24px; right: 22px;`) em verde oficial WhatsApp (`#25D366`) com anel pulsante.
* Arrastável pelo usuário via Pointer Events apenas quando o deslocamento supera 6px, mantendo clique limpo que abre a conversa com o número `5512983208335`.
* Limites rígidos de tela para nunca vazar ou subir para o topo `(0, 0)`.

---

## 5. Rotas de Publicação
* **Vercel:** Deploy contínuo via GitHub (`anderson11sf-bot/chcara` -> `https://chcara.vercel.app`).
* **Hostinger:** Arquivo estático `.zip` compilado pronto para upload em `public_html`:
  - `C:\Users\ander\OneDrive\Desktop\ZIPS_HOSTINGER\Paraiso_das_Aguas_Hostinger_Completo.zip`
  - `C:\Users\ander\OneDrive\Desktop\lagoa site.zip`
