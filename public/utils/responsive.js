// responsive mobile view
const appHeight = () => document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
appHeight();

// We listen to the resize event
window.addEventListener('resize', appHeight);