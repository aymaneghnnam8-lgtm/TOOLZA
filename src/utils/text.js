export function analyzeText(text) {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = countSentences(trimmed);
  const paragraphs = trimmed ? text.split(/\n+/).filter((part) => part.trim()).length : 0;
  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTime: readingTimeLabel(words),
  };
}

function countSentences(text) {
  if (!text) return 0;
  const matches = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  if (!matches) return 0;
  return matches.filter((part) => /[\p{L}\p{N}]/u.test(part)).length;
}

export function readingTimeLabel(words) {
  if (!words) return '0 min';
  if (words < 200) {
    const seconds = Math.max(1, Math.round((words / 200) * 60));
    return `${seconds} sec`;
  }
  return `${Math.ceil(words / 200)} min`;
}

export function toUpperCase(text) {
  return text.toLocaleUpperCase();
}

export function toLowerCase(text) {
  return text.toLocaleLowerCase();
}

export function toTitleCase(text) {
  return text.replace(/\p{L}[\p{L}\p{N}'’-]*/gu, (word) => {
    return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase();
  });
}

export function removeExtraSpaces(text) {
  return text
    .split('\n')
    .map((line) => line.replace(/[^\S\n]+/g, ' ').trim())
    .join('\n');
}

export function removeEmptyLines(text) {
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

export function reverseText(text) {
  return Array.from(text).reverse().join('');
}
