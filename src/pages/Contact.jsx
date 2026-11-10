import { useState } from 'react';
import { Seo } from '../components/Seo';
import { Button, Notice, TextLink, inputClass } from '../components/ui';
import { site } from '../data/site';

const initial = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [opened, setOpened] = useState(false);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setOpened(false);
  }

  function validate() {
    const next = {};
    if (values.name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Enter a valid email address.';
    if (values.subject.trim().length < 3) next.subject = 'Enter a subject.';
    if (values.message.trim().length < 10) next.message = 'Enter a message of at least 10 characters.';
    return next;
  }

  function onSubmit(event) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    const body = `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`;
    const href = `mailto:${site.email}?subject=${encodeURIComponent(values.subject.trim())}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setOpened(true);
  }

  return (
    <>
      <Seo
        title="Contact"
        description="Contact TOOLZA. The form opens your email app and does not store the message on this website."
      />
      <div className="mx-auto grid max-w-page gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-medium text-slate-500">Contact</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Contact</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            This form checks the fields, then opens your email application with the message addressed to TOOLZA. Nothing is saved on the website.
          </p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Email: <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
          </p>
        </div>
        <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Name" error={errors.name}>
              <input id="name" name="name" autoComplete="name" value={values.name} onChange={(event) => update('name', event.target.value)} className={inputClass} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} required />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={(event) => update('email', event.target.value)} className={inputClass} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} required />
            </Field>
          </div>
          <div className="mt-4">
            <Field id="subject" label="Subject" error={errors.subject}>
              <input id="subject" name="subject" value={values.subject} onChange={(event) => update('subject', event.target.value)} className={inputClass} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'subject-error' : undefined} required />
            </Field>
          </div>
          <div className="mt-4">
            <Field id="message" label="Message" error={errors.message}>
              <textarea id="message" name="message" rows={6} value={values.message} onChange={(event) => update('message', event.target.value)} className={`${inputClass} resize-y`} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} required />
            </Field>
            <p className="mt-1 text-xs text-slate-500">{values.message.trim().length} characters</p>
          </div>
          {values.message.length > 1800 ? (
            <div className="mt-4">
              <Notice>This message is long. Some email apps truncate very long mailto links. Shorten it if the draft looks cut off.</Notice>
            </div>
          ) : null}
          <div className="mt-5">
            <Button type="submit">Open email app</Button>
          </div>
          {opened ? (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100" role="status">
              Your email app should open with this message addressed to {site.email}. If it does not, copy the address and send the note yourself. TOOLZA does not store the form on a server.
            </p>
          ) : null}
        </form>
      </div>
    </>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-100">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-700 dark:text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
