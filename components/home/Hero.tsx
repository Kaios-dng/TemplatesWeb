import Link from "next/link";
import { AssemblyStage } from "@/components/home/AssemblyStage";
import { KaiosIcon } from "@/components/shared/KaiosIcon";
import { Messages } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export function Hero({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{messages.hero.eyebrow}</p>
        <h1>{messages.hero.title}</h1>
        <p className="hero-body">{messages.hero.body}</p>
        <div className="hero-actions">
          <Link className="button primary" href={`/${locale}/templates`}>
            {messages.hero.browse}
            <KaiosIcon name="arrowDownRight" />
          </Link>
          <a className="text-link" href="#assembled-demo">
            {messages.hero.watch}
          </a>
        </div>
      </div>
      <AssemblyStage label={messages.hero.frameLabel} />
    </section>
  );
}
