import type { Metadata } from 'next';
import Link from 'next/link';
import { CopyButton } from '@/components/site/copy-button';
import { Icon } from '@/components/site/icon';

export const metadata: Metadata = {
  title: 'Installation',
  description: 'Add Anticraft UI to your React project. Install a component with the shadcn CLI or copy its TypeScript and CSS source.',
};

const installCommand = 'npx shadcn@latest add http://localhost:5173/r/magnetic-button.json';

const componentFiles = `components/
└── anticraft/
    ├── MagneticButton.tsx
    └── magnetic-button.css`;

const usageCode = `import { MagneticButton } from '@/components/anticraft/MagneticButton';

export default function Example() {
  return (
    <MagneticButton strength={0.2}>
      Make something unexpected ↗
    </MagneticButton>
  );
}`;

const themeCode = `:root {
  --ac-accent: #d5fa55;
  --ac-accent-hover: #c7ee43;
  --ac-ink: #171914;
  --ac-focus: #6d782e;
}`;

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="code-block">
      <div className="code-heading">
        <span>{title}</span>
        <CopyButton text={code} />
      </div>
      <pre className="doc-code"><code>{code}</code></pre>
    </div>
  );
}

export default function InstallationPage() {
  return (
    <main id="main-content" className="doc-page installation-page">
      <div className="doc-breadcrumb">
        <span>Docs</span><Icon name="chevron" size={12} /><span>Installation</span>
      </div>

      <header className="doc-heading">
        <p className="eyebrow">Getting started</p>
        <h1>A little setup.<br />A lot of possibility.</h1>
        <p className="doc-lead">
          Pick a component. Bring the source into your project. Make it yours.
          Anticraft UI is free, open source, and built to fit the way you work.
        </p>
      </header>

      <section className="doc-section prose" id="before-you-start" aria-labelledby="prerequisites-heading">
        <h2 id="prerequisites-heading">Before you start</h2>
        <p>
          You need an existing React 18+ project with TypeScript and support for CSS
          imports. Next.js works out of the box. Each component ships as a small
          TypeScript file and a matching ordinary CSS file, with no animation library
          or runtime dependency beyond React.
        </p>
        <p>
          The documentation site runs on Next.js 16 and has been tested with Node.js 24.
          Your app only needs to meet the requirements of its own framework.
        </p>
        <div className="note-box">
          <Icon name="code" size={18} />
          <p>
            You own the code. There is no published Anticraft npm package to install.
            Add only the components you need, then edit them directly in your project.
          </p>
        </div>
      </section>

      <section className="doc-section prose" id="cli" aria-labelledby="cli-heading">
        <p className="eyebrow">Option 01</p>
        <h2 id="cli-heading">Install with the CLI</h2>
        <p>
          Already using shadcn in your React or Next.js project? Run this command from
          your app&apos;s root directory to add Magnetic Button and its stylesheet.
          Your project should already have a configured <code>components.json</code>.
        </p>
        <CodeBlock title="Terminal" code={installCommand} />
        <div className="note-box">
          <Icon name="terminal" size={18} />
          <p>
            This URL points to the local development registry. Keep the Anticraft
            preview running with <code>npm run dev</code> in the Anticraft repository
            while you run the install command in your own project. If you host the
            registry, replace <code>http://localhost:5173</code> with its actual address.
          </p>
        </div>
        <p>
          The CLI uses the component aliases in your <code>components.json</code>.
          For example, if <code>@/components</code> resolves to
          <code> src/components</code>, the files are placed in
          <code> src/components/anticraft</code>. Use that same alias when importing.
        </p>
      </section>

      <section className="doc-section prose" id="manual" aria-labelledby="manual-heading">
        <p className="eyebrow">Option 02</p>
        <h2 id="manual-heading">Copy the source</h2>
        <p>
          Prefer to do it by hand? You can use every component without shadcn or
          Tailwind. All the styling lives in the included CSS file.
        </p>
        <ol>
          <li>
            Open <Link href="/components/magnetic-button">Magnetic Button</Link> and
            select the Code tab.
          </li>
          <li>
            Copy <code>MagneticButton.tsx</code> and <code>magnetic-button.css</code> into
            the same <code>components/anticraft</code> folder in your project. If your
            project uses a <code>src</code> directory, place that folder inside it.
          </li>
          <li>
            Keep both filenames intact. The component already imports
            <code> ./magnetic-button.css</code>, so the styling comes with it.
          </li>
        </ol>
        <CodeBlock title="Your component files" code={componentFiles} />
      </section>

      <section className="doc-section prose" id="usage" aria-labelledby="usage-heading">
        <h2 id="usage-heading">Bring it to life</h2>
        <p>
          Import the component and render it wherever you need it. This example uses
          the common <code>@/</code> alias; a relative import works too.
        </p>
        <CodeBlock title="example.tsx" code={usageCode} />
        <p>
          Interactive source files already include <code>&apos;use client&apos;</code>, so
          you can render them from a Next.js Server Component. If your example adds
          event handlers or React hooks, make that example a Client Component as well.
        </p>
      </section>

      <section className="doc-section prose" id="customize" aria-labelledby="customize-heading">
        <h2 id="customize-heading">Make it feel like you</h2>
        <p>
          Every component has working default colors. Override the optional
          <code> --ac-*</code> CSS variables globally or on a parent element, pass a
          <code> className</code>, or edit the source. No theme provider is required.
          These variables customize Magnetic Button:
        </p>
        <CodeBlock title="Your global stylesheet · optional" code={themeCode} />
        <p>
          Motion follows the visitor&apos;s reduced-motion preference. Looping effects
          such as Aurora Background, Gradient Text, and Border Beam also expose a
          <code> paused</code> prop so you can add an explicit pause control to your
          design. Marquee includes its own pause button.
        </p>
      </section>

      <section className="doc-section prose" aria-labelledby="next-heading">
        <p className="eyebrow">Your next move</p>
        <h2 id="next-heading">Find your first component.</h2>
        <p>
          Explore the collection, try the live previews, and take the pieces that
          give your next idea a little more character.
        </p>
        <Link href="/components" className="button button-primary">
          Explore components <Icon name="arrow" size={16} />
        </Link>
      </section>
    </main>
  );
}
