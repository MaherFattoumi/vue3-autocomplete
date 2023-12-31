
import component from '@/autocomplete.vue';

export default (() => {
  const installable = component;

  installable.install = (app) => {
    app.component('Autocomplete', installable);
  };
  return installable;
})();
