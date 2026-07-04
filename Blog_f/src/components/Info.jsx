import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const examples = [
  {
    title: "Line Breaks",
    raw: `This is first line.  
This is second line (two spaces at end of first line).`,
  },
  {
    title: "Paragraphs",
    raw: `This is first paragraph.\n\nThis is second paragraph (extra blank line between).`,
  },
  {
    title: "Headings",
    raw: `# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6`,
  },
  {
    title: "Text Styles",
    raw: `This is **bold**, *italic*, ~~strikethrough~~, and \`inline code\`.`,
  },
  {
    title: "Lists",
    raw: `- Item One\n- Item Two\n  - Nested Item\n\n1. First\n2. Second\n   1. Sub Item`,
  },
  {
    title: "Blockquote",
    raw: `> This is a blockquote\n>> Nested blockquote`,
  },
  {
    title: "Code Block",
    raw: `\`\`\`js\nfunction greet(name) {\n  console.log("Hello " + name);\n}\ngreet("Vivek");\n\`\`\``,
  },
  {
    title: "Horizontal Rule",
    raw: `---\nAbove line is a horizontal rule`,
  },
  {
    title: "Links & Images",
    raw: `[Google](https://google.com)\n\n![Alt Text](https://via.placeholder.com/150)`,
  },
  {
    title: "Tables",
    raw: `| Name | Age | City |\n|------|-----|------|\n| Vivek | 21 | Delhi |\n| Kaa   | 22 | Noida |`,
  },
  {
    title: "Task Lists",
    raw: `- [x] Completed Task\n- [ ] Pending Task`,
  },
  {
    title: "Emoji Showcase",
    raw: `🌐 🚀 🔹 💻 📱 ⚡ 🎯 🎵 🎮 🎲 🎤\n🌍 🌎 🌏 🛰️ 🌌 🌙 ⭐ ☀️\n✔️ ✖️ ➡️ ⬅️ ⬆️ ⬇️ 🔧 ⚙️\n💬 📝 📢 📧 📡 🔊 🎨 🎬 🎤`,
  },
];

export default function Info() {
  return (
    <div className="prose lg:prose-xl mx-auto my-20 p-6">
      <h1 className="text-3xl font-bold mb-4">📘 Blog Formatting Guide</h1>
      <p className="text-gray-600 mb-6">
        Below you can see the raw markdown syntax and how it will look when rendered.
      </p>

      {examples.map((ex, idx) => (
        <div key={idx} className="mb-10">
          <h2 className="text-xl font-semibold mb-2">{ex.title}</h2>
          <div className="bg-gray-100 p-3 rounded mb-2">
            <pre>{ex.raw}</pre>
          </div>
          <div className="border p-3 rounded">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{ex.raw}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
