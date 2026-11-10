import { useEffect, useId, useState } from 'react';
import { cx } from '../utils/files';

export function usePreventFileNavigation() {
  useEffect(() => {
    const prevent = (event) => event.preventDefault();
    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', prevent);
    return () => {
      window.removeEventListener('dragover', prevent);
      window.removeEventListener('drop', prevent);
    };
  }, []);
}

export function FileDropzone({
  accept,
  multiple = false,
  onFiles,
  disabled = false,
  title,
  detail,
}) {
  const [over, setOver] = useState(false);
  const inputId = useId();

  function emit(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    onFiles(files);
  }

  return (
    <label
      htmlFor={inputId}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) {
          event.dataTransfer.dropEffect = 'copy';
          setOver(true);
        }
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        if (!disabled) emit(event.dataTransfer.files);
      }}
      className={cx(
        'block cursor-pointer rounded-2xl border border-dashed px-6 py-12 text-center transition',
        over
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
          : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-900',
        disabled && 'pointer-events-none opacity-60',
      )}
    >
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          emit(event.target.files);
          event.target.value = '';
        }}
      />
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-card dark:bg-slate-800 dark:text-violet-300">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M12 16V6" strokeLinecap="round" />
          <path d="M8 9.5 12 5.5l4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 19h14" strokeLinecap="round" />
        </svg>
      </span>
      <span className="mt-4 block text-base font-semibold text-slate-900 dark:text-white">
        {over ? 'Drop to add' : title}
      </span>
      <span className="mx-auto mt-2 block max-w-md text-sm leading-6 text-slate-500">{detail}</span>
      <span className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
        Browse files
      </span>
    </label>
  );
}
