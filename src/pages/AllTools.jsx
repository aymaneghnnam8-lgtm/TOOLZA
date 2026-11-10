import { Seo } from '../components/Seo';
import { ToolCatalog } from '../components/ToolCatalog';

export default function AllTools() {
  return (
    <>
      <Seo
        title="All Tools"
        description="Browse every TOOLZA utility, including image compression, PDF to JPG, word count, QR codes, resizing, JPG to PNG, text formatting, and password generation."
      />
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-slate-500">Directory</p>
        <div className="mt-2">
          <ToolCatalog
            heading="All tools"
            headingLevel="h1"
            intro="Search and filter the full set. Each result opens a working tool."
          />
        </div>
      </div>
    </>
  );
}
