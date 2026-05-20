import { h } from 'preact';
import { useRegisterSW } from 'virtual:pwa-register/preact';

export function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

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
