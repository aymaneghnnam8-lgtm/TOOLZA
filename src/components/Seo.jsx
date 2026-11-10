import { useEffect } from 'react';

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function Seo({ title, description }) {
  useEffect(() => {
    const fullTitle = title ? `${title} · TOOLZA` : 'TOOLZA — All Your Online Tools in One Place';
    document.title = fullTitle;
    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
      upsertMeta('name', 'twitter:description', description);
    }
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('name', 'twitter:title', fullTitle);
  }, [title, description]);

  return null;
}
