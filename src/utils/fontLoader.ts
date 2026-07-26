const loadedFamilies = new Set<string>();

export function loadGoogleFont(family: string): void {
  if (loadedFamilies.has(family)) {
    return;
  }

  if (document.querySelector(`link[data-font-family="${family}"]`)) {
    loadedFamilies.add(family);
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.dataset.fontFamily = family;
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  ).replace(/%20/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;

  document.head.appendChild(link);
  loadedFamilies.add(family);
}
