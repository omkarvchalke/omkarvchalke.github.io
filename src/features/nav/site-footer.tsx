const YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs sm:flex-row">
        <span>© {YEAR} Omkar Vilas Chalke</span>
        <span className="font-mono">
          Built with Next.js, deployed on GitHub Pages
        </span>
      </div>
    </footer>
  );
}
