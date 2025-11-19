import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import { Dialog, DialogTrigger, DialogContentBare, DialogClose } from '@/components/ui/dialog';

const MaterialIcon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

interface ResourceModalCardProps {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
}

const ResourceModalCard: React.FC<ResourceModalCardProps> = ({ title, description, icon, children }) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const evaluateScrollState = () => {
    const node = contentRef.current;
    if (!node) return;
    const { clientHeight, scrollHeight } = node;
    // If content does not overflow, allow closing immediately
    if (scrollHeight <= clientHeight + 1) {
      setHasScrolledToEnd(true);
    } else {
      setHasScrolledToEnd(false);
      node.scrollTop = 0;
    }
  };

  const handleScroll = () => {
    const node = contentRef.current;
    if (!node || hasScrolledToEnd) return;
    const { scrollTop, clientHeight, scrollHeight } = node;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setHasScrolledToEnd(true);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.requestAnimationFrame(evaluateScrollState);
      } else {
        setTimeout(evaluateScrollState, 0);
      }
    } else {
      setHasScrolledToEnd(false);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left transition-colors hover:border-[#007BFF]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
              <MaterialIcon name={icon} className="text-base text-[#007BFF]" />
            </div>
            <h3 className="text-sm md:text-base font-semibold text-[#111318]">{title}</h3>
          </div>
          <p className="text-xs md:text-sm text-[#4B5563] leading-relaxed">{description}</p>
        </button>
      </DialogTrigger>
      <DialogContentBare className="max-w-3xl p-0 sm:rounded-xl">
        <div className="flex max-h-[80vh] flex-col bg-white">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
            <p className="mt-1 text-xs text-[#6B7280]">If there&apos;s more to read, scroll to the end to enable the button.</p>
          </div>
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-6"
          >
            {children}
            <div className="h-6" />
          </div>
          <div className="sticky bottom-0 flex justify-end border-t border-gray-200 bg-white px-6 py-4">
            <DialogClose asChild>
              <button
                type="button"
                disabled={!hasScrolledToEnd}
                className={`inline-flex h-9 items-center px-4 text-sm font-medium transition-colors ${
                  hasScrolledToEnd
                    ? 'bg-[#007BFF] text-white hover:bg-[#0056D6]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Close
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

const Resources: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 lg:px-0">
          <Logo size="sm" />
          <Link
            to="/landing"
            className="text-xs md:text-sm text-[#4B5563] hover:text-[#111827] transition-colors"
          >
            Back to homepage
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 lg:px-0 py-10 md:py-14">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-[#007BFF] uppercase">Resources</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight text-[#111318]">
          Guides and support for students &amp; owners
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#4B5563] leading-relaxed">
          This space brings together the most useful ROOMie guides in one place, so you do not have to dig through
          different pages when you need help.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ResourceModalCard
            title="How ROOMie works"
            description="Step-by-step explanation of how students find, verify and book rooms through ROOMie."
            icon="play_circle"
          >
            <div className="space-y-4 text-sm leading-relaxed text-[#4B5563]">
              <p>
                ROOMie is built to remove the stress and guessing from student housing. We focus on verified
                properties, clear pricing and a simple booking flow.
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Create a free ROOMie account with your basic details.</li>
                <li>Browse verified properties that match your campus and budget.</li>
                <li>Pick a room type, see the real total cost and reserve your spot.</li>
                <li>Complete student verification so owners know who is moving in.</li>
                <li>Pay securely through ROOMie and get a clear record of your booking.</li>
              </ol>
            </div>
          </ResourceModalCard>

          <ResourceModalCard
            title="Help & FAQ"
            description="Answers to the questions students and owners ask us the most."
            icon="quiz"
          >
            <div className="space-y-4 text-sm leading-relaxed text-[#4B5563]">
              <p>
                The help centre is where we keep quick answers to everyday questions about accounts, bookings and
                payments.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>How bookings, cancellations and waitlists work.</li>
                <li>What happens if a payment fails or is delayed.</li>
                <li>How to contact support if something feels off.</li>
                <li>Guides for owners listing a property for the first time.</li>
              </ul>
            </div>
          </ResourceModalCard>


          <ResourceModalCard
            title="Pricing"
            description="Clear explanation of what students and owners pay, with no hidden extras."
            icon="payments"
          >
            <div className="space-y-4 text-sm leading-relaxed text-[#4B5563]">
              <p>
                We keep pricing simple so you always know what you are paying and why.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Rent is set by the property owner and shown upfront.</li>
                <li>Students pay a small one-time booking fee when a room is secured.</li>
                <li>Owners pay a transparent commission on successful bookings.</li>
                <li>No hidden add-ons or surprise charges buried in fine print.</li>
              </ul>
            </div>
          </ResourceModalCard>
        </div>
      </main>
    </div>
  );
};

export default Resources;
