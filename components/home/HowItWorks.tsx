import {
  KaiosIcon,
  KaiosIconName,
} from "@/components/shared/KaiosIcon";
import { Messages } from "@/lib/i18n";

export function HowItWorks({ messages }: { messages: Messages }) {
  const steps = [
    {
      icon: "search" as KaiosIconName,
      title: messages.how.browseTitle,
      body: messages.how.browseBody,
    },
    {
      icon: "eye" as KaiosIconName,
      title: messages.how.previewTitle,
      body: messages.how.previewBody,
    },
    {
      icon: "message" as KaiosIconName,
      title: messages.how.contactTitle,
      body: messages.how.contactBody,
    },
  ];

  return (
    <section className="how-section" id="how-it-works">
      <h2>{messages.how.title}</h2>
      <div className="how-track">
        {steps.map((step, index) => {
          return (
            <div className="how-step" key={step.title}>
              <span className="how-icon">
                <KaiosIcon name={step.icon} />
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              {index < steps.length - 1 ? (
                <KaiosIcon name="arrowDownRight" className="how-arrow" />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
