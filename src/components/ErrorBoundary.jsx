import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">This page ran into a problem</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Refresh and try the action again. Files you were working with stay on this device.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Reload page</Button>
          <Link to="/tools" className="text-sm font-semibold text-violet-700 dark:text-violet-300">
            Browse tools
          </Link>
        </div>
      </div>
    );
  }
}
