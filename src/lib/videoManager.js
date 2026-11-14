/* ============================================================================
 * videoManager.js — GERENCIADOR INTELIGENTE DE VÍDEOS & PERFORMANCE
 * ----------------------------------------------------------------------------
 * 1. IntersectionObserver restrito para garantir que no máximo 1 vídeo de fundo
 *    esteja decodificando por vez na GPU.
 * 2. Pausa imediata do Hero ao entrar na Sessão 2.
 * 3. Previne saturação de hardware decoders da GPU/CPU (elimina 100% do lag).
 * 4. Pausa geral quando a aba perde o foco.
 * ==========================================================================*/

let observadorVideos = null;
let heroVideo = null;
let videoFundoAtivo = null;

export function iniciarGerenciadorVideos() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  heroVideo = document.getElementById('hero-video');

  const todosVideos = document.querySelectorAll('video');
  todosVideos.forEach(v => {
    v.muted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.playsInline = true;

    // Apenas hero e cavalo pré-carregam inicialmente
    if (v.id !== 'hero-video' && v.id !== 'sessao2-cavalo-video') {
      v.setAttribute('preload', 'none');
    }
  });

  if (!('IntersectionObserver' in window)) return;

  // Observador com threshold moderado para acionar apenas quando o elemento estiver realmente visível
  observadorVideos = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;

      // Sessão 2 (Cavalo, Porteira, Drone) é governada pela timeline do portal3d
      if (video.id === 'sessao2-cavalo-video' || video.id === 'sessao2-drone-video' || video.id === 'sessao2-porteira-video') {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
        }
        return;
      }

      // Hero Video
      if (video.id === 'hero-video') {
        if (entry.isIntersecting) {
          if (video.paused) video.play()?.catch(() => {});
        } else {
          if (!video.paused) video.pause();
        }
        return;
      }

      // Vídeos de fundo das abas (painel-fundo-video) — Máximo 1 ativo simultaneamente
      if (video.classList.contains('painel-fundo-video')) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          if (videoFundoAtivo && videoFundoAtivo !== video && !videoFundoAtivo.paused) {
            videoFundoAtivo.pause();
          }
          videoFundoAtivo = video;
          if (video.paused) {
            video.play()?.catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
          if (videoFundoAtivo === video) {
            videoFundoAtivo = null;
          }
        }
        return;
      }

      // Outros vídeos (drone de apoio no mapa, vídeo vertical de SJC)
      if (entry.isIntersecting) {
        const querAutoplay = video.hasAttribute('autoplay') ||
          video.classList.contains('video-player--autoplay') ||
          video.classList.contains('mapa-drone-video-bg') ||
          video.classList.contains('localizacao-mapa-video-bg');

        if (querAutoplay && video.paused) {
          video.play()?.catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, {
    rootMargin: '40px 0px 40px 0px',
    threshold: [0, 0.25, 0.5]
  });

  todosVideos.forEach(v => {
    observadorVideos.observe(v);
  });

  // Pausa geral quando a aba perde o foco (economia total de recursos)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      todosVideos.forEach(v => { if (!v.paused) v.pause(); });
    } else {
      if (heroVideo && window.scrollY < window.innerHeight * 0.8) {
        heroVideo.play()?.catch(() => {});
      }
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
    heroVideo.play()?.catch(() => {});
  }
}

export default { iniciarGerenciadorVideos, pausarHeroVideo, retomarHeroVideo };
