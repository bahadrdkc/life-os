import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Not içeriğini markdown olarak render eder. Stiller globals.css `.markdown` içinde.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
