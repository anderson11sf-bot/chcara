/* ============================================================================
 * portal3d.js — Compatibilidade da Sessão 2
 * ----------------------------------------------------------------------------
 * As animações da Sessão 2 (Pomar e Porteira) agora são gerenciadas
 * de forma unificada pelo ScrollEngine e FrameLayer a 120 FPS / 100 Hz.
 * ==========================================================================*/

export function iniciarPortal3d() {
  return { definirProgresso, destruir };
}

export function definirProgresso() {
  // Gerenciado diretamente pelas layers no ScrollEngine
}

export function destruir() {
  // No-op
}

export default { iniciarPortal3d, definirProgresso, destruir };
