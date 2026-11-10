import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import About from './pages/About';
import AllTools from './pages/AllTools';
import Categories from './pages/Categories';
import Contact from './pages/Contact';
import Disclaimer from './pages/Disclaimer';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const ImageCompressor = lazy(() => import('./pages/tools/ImageCompressor'));
const PdfToJpg = lazy(() => import('./pages/tools/PdfToJpg'));
const WordCounter = lazy(() => import('./pages/tools/WordCounter'));
const QrGenerator = lazy(() => import('./pages/tools/QrGenerator'));
const ImageResizer = lazy(() => import('./pages/tools/ImageResizer'));
const JpgToPng = lazy(() => import('./pages/tools/JpgToPng'));
const TextFormatter = lazy(() => import('./pages/tools/TextFormatter'));
const PasswordGenerator = lazy(() => import('./pages/tools/PasswordGenerator'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<AllTools />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/tools/image-compressor" element={<ImageCompressor />} />
        <Route path="/tools/pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="/tools/word-counter" element={<WordCounter />} />
        <Route path="/tools/qr-code-generator" element={<QrGenerator />} />
        <Route path="/tools/image-resizer" element={<ImageResizer />} />
        <Route path="/tools/jpg-to-png" element={<JpgToPng />} />
        <Route path="/tools/text-formatter" element={<TextFormatter />} />
        <Route path="/tools/password-generator" element={<PasswordGenerator />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
