import { Link } from 'react-router-dom';
import { tools } from '../data/tools';
import { site } from '../data/site';
import { LogoMark } from './Icons';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2.5" aria-label="TOOLZA home">
            <LogoMark className="h-8 w-8" />
            <span className="text-[15px] font-semibold tracking-[0.16em]">TOOLZA</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
            Free browser tools for files, text, and everyday tasks. Processing stays on your device.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">Tools</h2>
          <ul className="mt-4 space-y-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link to={`/tools/${tool.slug}`} className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">Company</h2>
          <ul className="mt-4 space-y-2">
            <li><FooterLink to="/about">About</FooterLink></li>
            <li><FooterLink to="/contact">Contact</FooterLink></li>
            <li><FooterLink to="/categories">Categories</FooterLink></li>
            <li><FooterLink to="/tools">All Tools</FooterLink></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">Legal</h2>
          <ul className="mt-4 space-y-2">
            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
            <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
            <li><FooterLink to="/disclaimer">Disclaimer</FooterLink></li>
            <li><FooterLink to="/about">About</FooterLink></li>
            <li><FooterLink to="/contact">Contact</FooterLink></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Files are processed in your browser.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
      {children}
    </Link>
  );
}
