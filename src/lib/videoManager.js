/* ============================================================================
 * videoManager.js — GERENCIADOR INTELIGENTE DE VÍDEOS & PERFORMANCE
 * ----------------------------------------------------------------------------
 * 1. IntersectionObserver para pausar imediatamente qualquer vídeo fora do viewport.
 * 2. Pausa do vídeo do Hero quando o usuário rolar para as seções abaixo.
 * 3. Prevenção de decodificação simultânea excessiva (evita travamento de GPU/CPU).
 * 4. Pausa automática de todos os vídeos quando a aba estiver em segundo plano.
 * ==========================================================================*/

let observadorVideos = null;
let videosRegistrados = new Set();
let heroVideo = null;

export function iniciarGerenciadorVideos() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  heroVideo = document.getElementById('hero-video');

  const todosVideos = document.querySelectorAll('video');
  todosVideos.forEach(v => {
    // Garante atributos de reprodução eficiente e sem bloqueio
    v.muted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.playsInline = true;

    // Evita preload excessivo nos vídeos abaixo da dobra
    if (v.id !== 'hero-video' && v.id !== 'sessao2-cavalo-video') {
      if (!v.getAttribute('preload') || v.getAttribute('preload') === 'auto') {
        v.setAttribute('preload', 'none');
      }
    }
  });

  if (!('IntersectionObserver' in window)) return;

  observadorVideos = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;

      // Sessão 2 (Cavalo e Drone) tem controle próprio via timeline do portal3d
      if (video.id === 'sessao2-cavalo-video' || video.id === 'portal-video-3d') {
        if (!entry.isIntersecting) {
          video.pause();
        }
        return;
      }

      if (entry.isIntersecting) {
        // Entrou na área visível: inicia se for vídeo com autoplay
        const querAutoplay = video.hasAttribute('autoplay') ||
          video.classList.contains('video-player--autoplay') ||
          video.classList.contains('painel-fundo-video') ||
          video.classList.contains('mapa-drone-video-bg') ||
          video.classList.contains('localizacao-mapa-video-bg');

        if (querAutoplay && video.paused) {
          video.play?.().catch(() => {});
        }
      } else {
        // Saiu da área visível: pausa IMEDIATAMENTE para liberar GPU/CPU
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, {
    rootMargin: '100px 0px 100px 0px',
    threshold: 0.05
  });

  todosVideos.forEach(v => {
    observadorVideos.observe(v);
    videosRegistrados.add(v);
  });

  // Pausa geral quando a aba perde o foco
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      todosVideos.forEach(v => { if (!v.paused) v.pause(); });
    } else {
      // Reativa apenas os vídeos que estão visíveis no viewport
      todosVideos.forEach(v => {
        const ret = v.getBoundingClientRect();
        const visivel = ret.top < window.innerHeight && ret.bottom > 0;
        const querAutoplay = v.hasAttribute('autoplay') || v.id === 'hero-video';
        if (visivel && querAutoplay && v.paused) {
          v.play?.().catch(() => {});
        }
      });
    }
  }, { passive: true });
}

export function pausarHeroVideo() {
  if (heroVideo && !heroVideo.paused) {
    heroVideo.pause();
  }
}

export function retomarHeroVideo() {
  if (heroVideo && heroVideo.paused) {
    heroVideo.play?.().catch(() => {});
  }
}

export default { iniciarGerenciadorVideos, pausarHeroVideo, retomarHeroVideo };
