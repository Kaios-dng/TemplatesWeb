import Link from "next/link";
import { Messages } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export function Footer({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="wordmark footer-wordmark" href={`/${locale}`}>
          [KAIOS]
        </Link>
        <p>{messages.footer.line}</p>
      </div>
      <div className="footer-links">
        <Link href={`/${locale}/templates`}>{messages.footer.catalog}</Link>
        <Link href="/login">{messages.footer.admin}</Link>
        <span>
          © {new Date().getFullYear()} {messages.footer.rights}
        </span>
      </div>
    </footer>
  );
}

