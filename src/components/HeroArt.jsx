export function HeroArt() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[440px] sm:h-[460px]" aria-hidden="true">
      <div className="absolute right-2 top-16 w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-lift dark:border-slate-700 dark:bg-slate-900 sm:right-0 sm:w-64">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>report.pdf</span>
          <span>4 pages</span>
        </div>
        <div className="mt-3 space-y-2">
          {['Page 1', 'Page 2', 'Page 3'].map((label) => (
            <div key={label} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-2 text-xs dark:bg-slate-800">
              <span className="h-8 w-6 rounded bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800" />
              <span className="text-slate-700 dark:text-slate-200">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-0 top-0 w-[17rem] rounded-2xl border border-slate-200 bg-white p-4 shadow-lift dark:border-slate-700 dark:bg-slate-900 sm:w-72">
        <div className="h-36 rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500" />
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">photo.jpg</p>
            <p className="text-xs text-slate-500">2.4 MB → 760 KB</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            68% smaller
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 right-8 w-36 rounded-2xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 25 }, (_, index) => {
            const filled = [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24, 6, 8, 12, 16, 18].includes(index);
            return <span key={index} className={`h-4 rounded-[2px] ${filled ? 'bg-slate-900 dark:bg-white' : 'bg-slate-100 dark:bg-slate-800'}`} />;
          })}
        </div>
        <p className="mt-2 text-center text-[11px] font-medium text-slate-500">QR code</p>
      </div>
    </div>
  );
}
