# ROOMi — Independent Full-Stack Audit and Fix Mandate

**This is the only brief you need.** `AUDIT_BRIEF.md`, `AUDIT_BRIEF_2_DATA_FLOW.md`,
`ROOMI_SALVAGE_REPORT_2026-08-27.md`, and any other audit/status document already in
this repo are **prior work product from a different investigation. Do not treat
anything in them as verified fact.** Some of it is accurate, some of it was already
found to be wrong by a *later* pass in the same investigation (a "180 type errors"
claim turned out to be 1,165; a "258 files" claim turned out to be 7), and none of it
has been independently checked by anyone other than the person who wrote it. If you
read those documents at all, read them as unverified leads pointing at places to
look — never as conclusions. **Verify everything yourself, from the actual source
and the actual live system, before you rely on it or act on it.**

---

## What you actually have to test with — use these, don't rediscover them

Three facts about this environment, verified directly, that make real end-to-end
testing possible rather than theoretical. None of these are findings to verify —
they are tools. Use them.

- **Paystack is in TEST mode** (`pk_test_...`). A real checkout can be pushed all
  the way through — card entry, OTP, webhook, booking confirmation — without moving
  real money. There is no reason to stop short of a real transaction; "I traced the
  code and it looks correct" is not the same claim as "I ran it and it worked," and
  only the second one satisfies this mandate.
- **Three demo accounts already exist** for exactly this purpose:
  `student@roomi.com`, `owner@roomi.com`, `admin@roomi.com`, all password
  `password123` (created via the `create-demo-users` edge function — if they don't
  resolve, that function is how to (re)create them). Use these to test RLS and
  portal behavior as each role actually experiences it, not by reading policy text
  and reasoning about what should happen.
- **Playwright is an installed devDependency.** Use it to actually click through the
  student, owner, and admin UIs as each of the above accounts — search for a
  property, open a listing, go through checkout, confirm what an owner sees after
  publishing a property and what an admin sees when approving it. If a flow can be
  driven through the UI, drive it through the UI at least once; don't rely solely on
  hitting edge functions directly with curl, which proves the backend works but not
  that a real user can reach it.

If any of these three turns out not to work as described, that is itself a finding —
say so, and fall back to the most direct alternative (e.g., calling edge functions
directly with a demo account's JWT if Playwright turns out not to be viable).

## The mandate

**Read the entire codebase. Read the entire Supabase backend — schema, every table,
every RLS policy, every edge function's *deployed* source (not just what's committed
to git; a live/committed discrepancy has already been found once, so check both and
reconcile them yourself), auth configuration, storage buckets and their policies,
and available logs. Independently figure out everything that is wrong, at every
layer — frontend, middleware, the three portals, the database, the backend, edge
functions, payments, cross-portal sync. Then fix it.**

Do not produce a report that hands the owner a list and waits for a follow-up
conversation. Fix what is yours to fix as an engineer. Flag, as a short and specific
list, only the things that are genuinely the owner's business decision to make — not
things you could determine yourself by reading code, testing behavior, or applying
ordinary engineering judgment.

The owner's own words, verbatim, on what "done" means: **"all I want is 0 blockage to
go live."** Work until that is true, or until you hit a wall that only the owner can
resolve — and when you hit that wall, ask one specific, answerable question, not a
vague check-in.

Tear it down. Be extensive. Be direct about what's wrong. Then fix it.

---

## Requirements the owner has already given — build these in, don't rediscover them

These are product decisions and constraints the owner stated directly. They are not
bugs for you to find; they are things to design against and implement. Everything
else about the system's current state — what's broken, what's missing, what's
inconsistent — is yours to discover independently, per the mandate above.

**1. Student experience is the priority.** In order: students booking hostels first,
property owners listing and managing second, a real-estate asset-management line of
business third. Where these compete for engineering time or product surface (e.g. a
landing page, a dashboard, a notification), students win by default unless a specific
reason says otherwise.

**2. Commission economics must be configurable by a super-admin, live, without a
redeploy — including *who pays what*, not just the rate.** Owner's own framing: *"I
will have a field to update it when things change... I will log on to the super admin
dashboard, go to settings, and update how much the student should pay or how much the
owner should pay."* Concretely: the platform commission percentage, the flat fee, the
Paystack processing fee, and the VAT/agent rates must all be editable from an admin
UI. Beyond the rate itself, **which party bears each fee** (owner, student, or the
platform absorbing it) must also be an editable setting, not a hardcoded assumption
anywhere in the code. A note on current state, since you'll find it fast and should
know it's deliberate rather than accidental: the database already has columns for
this (`commission_configurations.commission_bearer` /
`fixed_fee_bearer` / `paystack_bearer`), seeded so that today the owner bears the
commission, the student bears the flat fee, and the platform absorbs Paystack's cut.
**Independently verify whether this is actually wired correctly end-to-end** —
whether the live deployed edge functions actually read and honor these columns,
whether any client-side code still computes money independently of them (in which
case the two can disagree, which is exactly the kind of bug this system has had
before), and whether an admin UI to change these settings actually exists and works.
Do not assume any part of this is finished just because the columns exist.

**3. Money must be computed in exactly one place: the server.** The browser must
never independently calculate a charge, a fee, or a payout — only display what the
server returns. If you find the browser computing money anywhere, that is a bug to
fix regardless of whether the two calculations currently happen to agree, because
they will not stay in agreement — this has already happened, more than once, in this
codebase.

**4. Partial payment / deposit-to-hold is a required feature and does not exist today
in any form.** This is standard, expected practice in the Ghanaian hostel-booking
market this platform serves: a student pays a partial amount to secure a specific
room or bed while arranging the remaining balance, rather than losing it to another
student. Confirm independently that no such mechanism exists anywhere in the schema,
edge functions, or UI, then design and build it. Real open questions you'll need to
resolve, most with your own engineering judgment and a small number genuinely
requiring the owner's input:

- Minimum/required deposit amount — fixed sum, percentage of total, configurable per
  property or platform-wide?
- Hold duration before an unpaid reservation expires and the room returns to
  availability, and the mechanism enforcing that expiry.
- How a hold interacts with room/bed availability state (note: you will likely find
  the existing availability data itself is in poor shape — investigate that as part
  of your own audit rather than assuming it works, and don't build the hold feature
  on top of a broken availability model without addressing the model first).
- What happens to the deposit if the balance is never paid — forfeit, refunded,
  partially refunded. This has real consumer-protection weight in a real market;
  treat it as a genuine **[OWNER DECISION NEEDED]** rather than assuming a policy.
- Whether platform commission is taken from the deposit as it arrives or only once
  the booking is fully paid — design this as an extension of the single server-side
  commission engine from requirement 3, not a second calculation path.
- Single deposit + single balance payment, or support for multiple installments —
  recommend the simplest version that satisfies real need; don't over-build a general
  installment system unless there's a real reason to.

Resolve what you reasonably can yourself. Flag clearly, as **[OWNER DECISION
NEEDED]**, only what genuinely requires the owner's judgment about their own
business — collect those into one short list at the end rather than asking them one
at a time.

---

## What "zero blockers to launch" requires from you

1. **A concrete, verified launch gate** — not "payments work," but something like "a
   real booking was completed end-to-end with real money and the amount shown to the
   student, the amount Paystack charged, and the amount recorded in the database all
   match to the pesewa, confirmed by you actually running that test." Define this
   gate yourself based on what you find, and satisfy it before calling anything
   launch-ready.
2. **Independent, from-source investigation of every layer** — do not skip the
   database or the deployed edge functions because reading TypeScript in `src/` felt
   sufficient. A discrepancy between what's committed and what's actually running in
   production has already been found once; assume that class of problem can recur
   until you've checked.
3. **Fixes, not findings**, for everything within normal engineering judgment to
   resolve.
4. **One short, final list of genuine business decisions** the owner must make,
   collected together, asked once — not scattered through a long report.
5. **A single report at the end**: what you found, what you fixed, what you decided
   and why, what still needs the owner's input, and confirmation that a real
   end-to-end test actually happened and actually worked.

Go.
