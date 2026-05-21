import { h } from 'preact';
import { useRegisterSW } from 'virtual:pwa-register/preact';

export function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;

      // Comprueba actualizaciones cada vez que la app vuelve al primer plano
      // (esencial para PWA instalada en móvil — no hace navegación real)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update();
        }
      });

      // Comprobación periódica cada 60 segundos como respaldo
      setInterval(() => registration.update(), 60_000);
    },
  });

  if (!needRefresh) return null;

  return (
    <div class="update-banner" role="alert">
      <span class="update-banner__text">
        🎉 Nueva versión disponible
      </span>
      <button
        class="update-banner__btn"
        onClick={() => updateServiceWorker(true)}
      >
        Actualizar
      </button>
    </div>
  );
}
