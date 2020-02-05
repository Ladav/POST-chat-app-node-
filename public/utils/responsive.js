// responsive mobile view
const appHeight = () => document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
window.addEventListener('resize', appHeight);
appHeight();

// We listen to the resize event
window.addEventListener('resize', () => {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  });