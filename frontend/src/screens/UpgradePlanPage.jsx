import { useSelector } from "react-redux";
import { Heading } from "../component/Heading";
import { BASE_URL } from "../Utils/Constants";
import { GlassButton } from "../component/GlassButton";
import { Check, X } from "lucide-react";
const PLAN_DETAILS = [
  {
    type: "Free",
    Price: "0",
    href: `${BASE_URL}/payment/subscribe?plan=free`,
    Button_Text: "Get Started",
    Pros: ["Unlimited Movie Browsing", "Cross-Platform Access"],
    Cons: ["Manual Search Only", "No Personalized AI Suggestions"],
  },
  {
    type: "Premium",
    Price: "9.9",
    href: `${BASE_URL}/payment/subscribe?plan=premium`,
    Button_Text: "Upgrade",
    Pros: [
      "Unlimited Movie Browsing",
      "Cross-Platform Access",
      "Exclusive AI-Powered Search",
      "Priority Recommendations",
    ],
    Cons: [],
  },
];

const UpgradePlanPage = () => {
  const user = useSelector((store) => store?.user);
  const plan = user?.planType;

  return (
    <>
      <div className="relative flex min-h-screen w-screen flex-col items-center justify-center gap-2 bg-neutral-900">
        <Heading>Elevate Your Viewing Experience</Heading>
        <p className="p-5 text-center text-sm md:p-0">
          Choose the plan that fits your cinematic lifestyle. Upgrade to Premium
          for AI-powered discovery
        </p>
        <div className="flex items-center justify-center gap-2 p-5 md:mt-10 md:flex-row md:gap-5 md:p-0 lg:p-0">
          {PLAN_DETAILS.map((plan, index) => (
            <div
              key={index}
              className="relative flex w-[200px] flex-col items-center gap-5 rounded-[24px] border border-white/[0.18] bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] p-10 text-white shadow-[0_32px_64px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] backdrop-blur-[40px] md:w-[350px] md:rounded-[32px]"
            >
              <Heading className="md:text-6xl">{plan.type}</Heading>
              <p className="text-7xl leading-none font-semibold tracking-tighter md:text-[75px]">
                {plan.Price}$
              </p>
              <GlassButton className="text-xs md:text-xl">
                <a href={plan.href}>{plan.Button_Text}</a>
              </GlassButton>
              <div>
                <ul>
                  {plan.Pros.map((p) => (
                    <li className="flex cursor-pointer items-start gap-1 text-xs text-neutral-50/90 md:text-base">
                      <Check /> {p}
                    </li>
                  ))}
                </ul>
                <ul>
                  {plan?.Cons.map((c) => (
                    <li className="flex cursor-pointer items-start gap-1 text-xs text-neutral-50/90 md:text-base">
                      <X /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UpgradePlanPage;
