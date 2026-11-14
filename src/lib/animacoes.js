/* ============================================================================
 * animacoes.js — ANIMAÇÕES DE ENTRADA SUAVES (INTERSECTION OBSERVER)
 * ----------------------------------------------------------------------------
 * Aplica fade-in suave, deslocamento vertical discreto e stagger em títulos,
 * cards, imagens e botões de todas as seções (Seções 3 a 13).
 * Respeita prefers-reduced-motion e garante fallback visível imediato.
 * ==========================================================================*/

export function iniciarAnimacoesEntrada() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Seletores de elementos narrativos para animação suave
  const seletores = [
    '.secao__titulo',
    '.secao__apoio',
    '.rotulo-secao',
    '.painel',
    '.card-profundidade',
    '.card-infra-pdf',
    '.quadro-projeto-pdf',
    '.card-patrimonio-item',
    '.card-sjc',
    '.card-condicao-pdf',
    '.card-distancia-pdf',
    '.quadro-autossuf__item',
    '.video-moldura',
    '.secao__cta'
  ];

  const elementos = document.querySelectorAll(seletores.join(', '));

  if (semMovimento || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => {
      el.classList.add('visivel');
    });
    return;
  }

  // Prepara elementos para animação
  elementos.forEach((el) => {
    el.classList.add('animar-entrada');
  });

  const observador = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel');
        observador.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elementos.forEach((el) => {
    observador.observe(el);
  });
}

export default { iniciarAnimacoesEntrada };
