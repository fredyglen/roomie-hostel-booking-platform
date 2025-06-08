TRANSCRIPT_01.
Ever wish you had a mentor who teaches
you exactly what you need at your pace
whenever you want? Yeah, same. I
struggled to find the right info and
even when I did, it rarely clicked. And
feedback either non-existent or
ridiculously expensive. Hey, I'm Adrian
and today we're building Converso, an AI
powered learning companion. It's your
personal education platform. real time,
voice driven, fully customizable, and
most importantly, monetizable. You can
think of this project as a gateway into
building software as a service apps.
Whether you want to launch your own app,
upgrade your dev skills, or ship
something that actually makes money. In
this course, I'm giving you the exact
tech stack, workflows, and knowledge you
need to build any SAS business from idea
to production ready. In under seven
days, you'll walk away with a repeatable
system that helps you go from MVP to
monetization fast. In this tutorial,
you'll build secure sign up and sign in
with an intuitive authentication system.
Realtime voice-driven lessons for smooth
and interactive learning experiences,
typically very practical, but you can
also make it teach you whatever you
want. So if you want to learn about
supply and demand from Charles the
Cheddar capitalist, well you can do that
too. Hello. Let's start the session.
Today we'll be talking about supply,
demand, and market forces in the cheese
industry. Well, let's dive right in. All
right, let's start with demand. Uh why
do people demand cheese? It's because
they breathe. It adds flavor to their
meals, right? Demand is all about how
many people want cheese and how much
they're willing to pay for it. Does that
make sense so far? You seem to really
like cheese. You'd ched believe it.
Cheese is the perfect way to explain
economics. Now, can you tell me what
might increase the demand for cheese?
Well, more people liking cheese.
Exactly. If cheese becomes the GA trend,
demand increases. Guda trend. Haha, I
see you caught that pun. If cheese
becomes popular, demand rises.
Personalized voicep powered courses
tailored to your users's goals. A modern
responsive UI for a familiar yet custom
experience responsive on all devices. A
search to help users easily find what
they're looking for. Scalable Postgress
database to ensure the platform grows as
user demand increases. Bookmarking and
session history features to track
progress and revisit key lessons. A
flexible subscription system supporting
multiple plans with the ability to lock
certain features based on their tier.
and most importantly with billing and
payment processing allowing your users
to give you money in seconds. And while
you build all of this, you'll also learn
how to work with some of the best free
tools in modern web development,
starting with Nex.js for building
scalable and performant serverdriven
websites with built-in routing. And by
the way, if you want to take things to
the next level, the updated Ultimate
NextJS course is now available on JS
Mastery Pro. We'll also take advantage
of Superbase, an open-source posgress
platform offering real-time data,
scalable storage, and instant APIs
perfect for running a modern SAS app
back end. TypeScript will come into play
to help maintain a clean, robust
codebase across the entire architecture.
And since voice interaction is key for
modern applications, you'll get your AI
voice agents up and running in minutes
using VPY, a powerful voice API platform
that connects to any model and scales to
millions of calls. You can integrate it
into any SAS app to immediately make it
stand out. We'll use Clerk to easily
integrate sign up, signin, and profile
management. But on top of O, this is
what I'm very excited about. For the
first time ever, we'll also dive into
clerk billing, integrating with Stripe,
and allowing you to implement
subscriptions within all of your apps
super easily. While implementing it for
this project, a JSM developer said that
it's awesome, cheap, robust, and that if
he ever decided to build his own SAS
app, he'd go with Clark. And I think the
same functionality is the key, but the
UI is what people see. So while building
this application, you'll also develop a
modern responsive interface using
Tailwind CSS and Chatcen, which became
the standard for spinning up new SAS
apps with a UI UX that everyone loves
and understands. We also have to
integrate Sentry for real-time error
tracking and performance monitoring
because once your app is in production,
it's not like your users will take the
time to explore and report the bugs, at
least not in a useful way. Instead,
they'll just stop the subscription and
quit. So to make sure that never
happens, Sentry helps you quickly
identify and fix issues, ensuring your
SAS app always runs smoothly. And here's
the exciting part. All of the tools
we'll use in this project are free to
get started with. Together, we'll create
a sleek, interactive SAS that boosts
your portfolio, helps you land your next
job, or create your own SAS business.
Oh, and if this video got you excited,
you're going to love what I prepared
next. Alongside this video, I've just
dropped a pro build and launch your SAS
in under seven days course. It's your
step-by-step blueprint for turning any
idea into a live SAS app fast. In the
course, I'll zoom out from this LMS
build and walk you through the full
process from ideiation, design,
devstack, deployment, monetization, and
beyond. And to help you hit the ground
running very soon, I'll also include a
fully preconfigured starter repo ready
to clone, make it your own, and launch.
The link is in the description. You can
get access to it by becoming a pro
member. And if you don't want to pay
anything before you actually build it,
you can get it for free through a 7-day
free trial. Enjoy. But now, let's dive
right into this build.
To get started creating our SAS, let's
first spin up our new Nex.js
application. Used by some of the world's
largest companies, Nex.js enables you to
create highquality web applications with
the power of React components. The
installation couldn't be simpler. It's
just mpx create next app at latest. I
already opened up a new project within
my IDE. So, what I can do is come right
here and paste the command we just
copied, but I'll add a dot slash at the
end. So, it creates an application
within the current folder that I'm
within and press enter. It's going to
ask you whether you want to install the
installer. So, I'll say yes. Go ahead.
And then it'll ask us a couple of
questions such as would you like to use
TypeScript? Well, that's going to be an
easy yes. We also want to use ESLint to
keep our codebase clean. Tailwind CSS is
a big yes for me. No need for a source
directory. Everything is fine where it
is. App router is a definite yes.
Turboac to speed up our development time
is going to be another yes. No need to
customize the import alias. It's fine as
it is by default. And that's it. The
dependencies are getting installed. And
while I was installing these
dependencies, you might have noticed
that I was using an IDE and not a
typical text editor. And this change
will be even more apparent as we
continue developing our apps. As
whenever some new cool pop-up shows up
that auto does something for you, which
a typical text editor doesn't, well,
it's most likely coming from WebStorm.
And as of recently, it became completely
free for non-commercial use. Before you
had to pay a lot of money to be able to
use it, and it was reserved only for
large corporations, but now you can
download it completely for free. Oh, and
with it to improve our productivity,
we'll also use Juny, helping us develop
our apps faster. It's built right within
the IDE. It can analyze your codebase
and just immediately speed up your
workflow significantly by offering some
suggestions on code structure and logic
doing things for you or just making sure
that your code is clean, consistent, and
production ready. So, while you're here,
you might download that one as well.
Now, at the beginning, I want to take a
second to explain all of the different
tools that we'll be using as that way
you'll have complete clarity of why
we're using a specific tool and how
it'll help us. We'll also deal with some
initial setup and account creation first
so that later on we can focus on solely
coding this SAS. First up, Tailwind CSS.
It's a utility first CSS framework
packed with utility classes. In simple
words, it just speeds up the way you
style things while still allowing you
the complete flexibility of native CSS.
It'll help us with keeping our app
responsive, applying a dark mode if
that's what you like. It'll also help us
with theming to make sure that our
styles are consistent, and it has some
built-in animations. But most
importantly, you can see that all of
these websites are completely different,
which means that it speeds up our
workflow, but it doesn't come at a cost
of making our apps look boring. Oh,
look. Clerk is one of the websites using
Tailwind and in this course we'll be
using Clerk within our app. Sure, we'll
use Clerk's O allowing us to simply
authenticate and manage our users. But
exclusively in this course, I'll teach
you how to implement Clerk billing. It
builds on top of O and in my opinion is
just so much more exciting and more
powerful as it allow us to easily
implement subscriptions within our
applications. So, click the Clerk link
down in the description to be able to
follow along and see exactly what I'm
seeing. And let me tell you a bit about
it. You know that integrating payments
is typically a pain in the ass. Well,
with Clerk, it's going to be super
simple. You can just insert the pricing
table. It'll hook up with a user that's
already logged in, and you'll be able to
keep track of their plan, subscription,
and more. It also comes with some
helpers, allowing you to control access
based on the customer's plan. And best
of all, it is completely powered by
Stripe, the leading payment processor in
the world. Now, of course, you might be
wondering if they're abstracting all of
those payment functionalities, how much
is it going to cost? To be completely
honest, I was a bit scared that it might
be a lot because they're taking the
burden of managing the payments, but it
is completely free to get started with
and you only have to pay an extra 0.7%
for each transaction. That's super
reasonable in my opinion. And of course,
we'll integrate it within our Next.js GS
application. So when you click that link
in the description, click sign in.
Choose your provider and you'll be
redirected to your dashboard where we
can quickly create a new application.
I'll call it JSM SAS app. There are many
providers to choose from, but in this
case we'll stick with the basics, email
and Google. And very soon we'll
implement it right within our app. Now
alongside clerk, we'll also use chatn
UI. It is built on top of Tailwind but
also provides us some of the most
commonly used components so that we can
develop our apps even faster. Need a
little badge, a button or a whole
calendar that would take you days to
develop? Well, you have it right here
exposed as a single component which you
can just use within your application.
Oh, and the main functionality of our
app, the conversational courses, they'll
be powered by Vappy. So, click the Vap
link down in the description and let's
set it up. Head over to sign up, choose
your provider, and you'll be redirected
right within your dashboard. Now, Vapi
is completely free to get started with,
but if you head over to billing and go
to apply a coupon and type JSMy 200,
you'll get 200 extra minutes. Not that
you'll need them as the free plan is
generous enough, but who knows? If you
decide to use VP for your own SAS, it
might come in handy. And there's Sentry
to keep your application running
smoothly. We'll use it for error
tracking and performance monitoring,
allowing us to catch errors when your
app is in production so that your users
stay happy for a long time. And since
I've been using Sentry for a long time,
they decided to give you an extra 50,000
errors with the code JSMy. Once again,
their free plan is super generous, so
you might not even need them, but if you
decide to use it on your apps in the
future, it'll surely come in handy. So,
just fill in the details and select JS
Mastery as the coupon. Once you do that,
you'll be redirected to your dashboard
and very soon I'll show you how we can
integrate it within this and your future
SAS applications. But with that in mind,
our NexJS app has now been set up so we
can explore the file and folder
structure that has been created for us.
Primarily, we can take a look into the
app folder and you'll see that right now
there is a lot of boilerplate code which
we don't really need. So we could go
ahead and just remove it. But what I
want to do instead is remove the entire
app folder. So just delete it. And then
in the description down below, you can
find the video kit for the current
project. So visit it. And right here,
you'll be able to find the Figma design
for the entire application. This will be
super useful when we're developing it
because you'll be able to take a look at
the existing pages and know exactly
what's about to come next. or maybe you
can develop it on your own to try your
skills and then verify the
implementation with me later on in the
video. Alongside the Figma design, you
can also find the Discord channel to get
help or get the full source code
completely for free. But what we need to
do next is click on the assets right
here. Once you visit this page, you'll
find the assets folder. So, simply
rightclick it and click download. Once
you download it, simply unzip it, head
over into it, and you'll find different
folders that you can just drag and drop
into your app. But let's first make sure
to delete the public folder as well
because it has some icons which we won't
need. So I'll just delete it as well.
And then I'll select all of these
folders and simply drag them within our
application. There we go. Now you might
be thinking that I'm giving you the
entire app already, but that's really
not the case. If you check out the app
folder, you'll notice that we have the
same exact files that we had before, but
I just replaced them with a converso
icon. Then in the page.ts the TSX I have
left the completely empty page just
removed the entire boilerplate code and
then in the layout I just modified the
font and the title. Everything else is
just completely bare bones besides the
styles. I did take some time to extract
all of the primary colors from our Figma
design and I put them right here so we
can use them much more seamlessly within
our application. And I created some
utility classes that allow us to very
easily style larger portions of our
application so that we don't have to
crowd our JSX with very long class
names. Rather, we can just use the home
section keyword. For example, if you
want to learn how you would go ahead and
extract all of these class names from a
Figma design into a dedicated CSS file,
you might want to check out the Tailwind
CSS course. I'm actually recording it
alongside this video right now and it
should be ready soon. In any case, I'll
link it somewhere down below. With that
in mind, here we're using one package
called twwan animate CSS. So, we have to
go ahead and install it. I'll just
increase the font size a bit. And I'll
create a second terminal right here
where we can run these installation
commands. So, I'll just say
mpmi twwan animate CSS. And now it's no
longer complaining. Next, alongside the
app folder, I also provided some
constants. And here we have arrays of
different data points that we can use
within our application. For example, we
can have different subjects that we can
create conversational courses on and
dedicated colors for each subject. We
have different voices that we can use
and just some dummy data so that we can
very easily start focusing on the UI and
then later on once we implement the
functionality, we can ditch this dummy
data and start using the real data. I
also created a lib folder with a utils
file where we have one major utility
function called configure assistant and
we'll uncomment it later on and go
through it together as we start
implementing voice functionalities
within our application. Alongside that,
we also have the public folder for all
of the icons, images, and everything
else that we'll be using. You can see
some call to action images right here,
the limit and the logo itself. And
finally, we have some of the types that
we'll use for our application. For
example, we can say that subject will be
one of these different things. And then
we can define different interfaces for
different functionalities from within
our application. I'll show you how to
implement all of these in action very
very soon. But with that in mind, now we
are ready to install SAT CN. I already
told you what it is. It is a component
library that will give us some default
components, but it'll allow us to style
them seamlessly. So to install it in
Nex.js, GS we need to use the guide for
Tailwind v4 because we're using the
latest version of Tailwind and we're
going to use MPM. So you can simply run
MPX shaden at latest in it. So heading
over into my terminal I'll run MPX
shaden at latest init. And it's going to
ask us a couple of questions. We're
going to use the neutral base color. We
can use the legacy pure deps to install
some packages. Don't worry if this
happens. There's a little mismatch in
dependency versions between Tailwind v4
and React 19. So for that reason, we'll
have to use these legacy pure devs to
make sure that these two packages
collaborate together. And there we go.
Shhatzen has been set up. So what do you
say that we put it to the test? I'll
head over into my app page.tsx tsx and
I'll try to render first of all an h1
that has a class name
of text
dash2xl and
underline and by the way you can see how
webtorm automatically tells me what
styles this specific tailwind CSS class
name is applying this comes pre-built
into webtorm but it can also be
installed as a package or an extension
just search for tailwind CSS here we can
say welcome Welcome to my SAS app. And
just below, we want to render a Shatzian
component. For example, a button. But
here's the thing. By default, just by
installing shots, you won't be able to
get any of these components right in.
Instead, what you have to do is add
those components one by one, only the
ones that you want to actually use. So,
I'll run MPX shen add latest button. And
you can use this legacy pure deps with
every command and it's going to install
it within a second. And now if you try
to render a
button and press enter, it'll actually
pick it directly from your codebase. Add
components UI button. So if you head
over to components UI, you'll see that a
new button has been created for you.
There's a lot of code right here, but
you don't have to touch it. You just
need to use it within your application.
So, I'll just make it say something
like, "Let's get started." Perfect. Now,
if I save this in my initial terminal,
I'll run mpm rundev to run our
application on localhost 3000. And once
you open up your localhost 3000 in the
browser, if you zoom in a bit, you
should be able to see this large heading
with this custom font underlined that
says, "Welcome to my SAS app." and then
a nicel lookinging chats button with a
hover effect that says let's get
started. So what I'll do for now is put
my browser to the right side of my
screen and then I'll put my editor so
that it doesn't go over the screen and
that way we can take a look at both the
code and the implementation at the same
time. And with that in mind our setup is
now complete. So in the next lesson we
can dive right into creating different
pages for our application and
implementing the routing. That's pretty
exciting because we're finally getting a
chance to dive right into this nice
looking codebase that so far, let's be
honest, we have just been setting up.
So, let's implement routing
next. Remember that video kit and the
Figma design I showed you a bit before?
Well, now we'll need it. So, open it up
and taking a look at the screens that we
have right here. Let's try to figure out
which pages we need within our
application so we can implement the
routes for those pages. Starting off
with our homepage. We'll surely need
that one. And thankfully, we already
have it. It is right here under app
page.tsx. After that, we'll also need
the sign in so that our users can
actually sign in. So, for now, let's
create it right here within app and add
a new folder and let's call it
sign-in. And within it, create a new
page.tsx. And for now, you can simply
run rafce within every single one of
these pages we'll create, which will
spin up a new empty react functional
component. Now, how do we get to this
page, this signin page within our
browser? Well, you'll have to head over
to localhost
3000/sign. And that's it. And you should
be able to see a small sign-in text
right at the top left. Now, this is
working right out of the box with Nex.js
because of its file-based routing. So
whenever you create a new folder with a
specific name and create a special file
within it called page.tsx, it'll expose
that route to the
browser/signin in this case and it'll
render the contents of that page. Okay,
what else do we have between the signin
and the homepage? Well, we're going to
have a companion library page where we
can explore all of the learning courses
that other people have created so far.
So we can create it by creating a new
folder right within our app and we can
call it
companions as in learning companions and
within it I'll create a new
page.tsx and run rafce. This one I'll
call companions library and we no longer
need the import of react within nextjs
applications. It works without it as
well. Next we'll need a build a
companion form. So let's create it. We
can create it within the same folder. So
that's going to be within companions,
but I'll create a new folder within it.
And I'll call it new. And then within
that folder, I'll create another page
which will host that form. So just
create it and runce within it, which
will quickly spin up a new functional
component. We can rename it to something
like new companion. And we can clear
this react import. Next, we'll have a
companion or a conversational course
lesson page. So, let's create it right
here under companions. This time, not
new, but actually, we'll create a new
dynamic route. And in Nex.js, you can do
that by creating a new folder and wrap
it with square brackets. Within it, you
can define the URL parameter that you
want to have for this specific route. In
this case, I'll call it ID. And within
ID, I'll create a new
page.tsx. Once again, here we can run
rafce. And I'll rename it to
companion session because here we'll
actually be learning from that learning
companion. Next, we'll have our profile
page or we can call it my learning
journey. So I'll create it right here,
not within companions anymore, but
within a new folder, which I will call
my dashjourney. And within my journey,
we can create we can create a new
page.tsx. Run rafce and rename it to
maybe profile page like this or just
profile. Perfect. And finally, we have a
subscription page here. we'll actually
be able to upgrade our user tier. So,
let's create it by creating a new folder
right here within our app. And I'll call
it subscription. And within
subscription, I'll create a new
page.tsx. Run rafce and we can call it
subscription. Perfect. These are all the
different screens that we'll need within
our application. And now we have
actually added them within our
application. So now if you want to head
over to for example my journey, you can
do that very easily and it navigates you
to a profile page. Or maybe if you want
to go to companions and visit a specific
session, you can do that very easily and
head over to any one of these internal
routes as
well. Wonderful. So with that in mind,
we have now not only set up the app
configuration but also the initial
routes of the application. So to further
improve your learning experience, what I
want to do at this point is publish this
project to GitHub. You can head over to
github.com/new and this will bring you
to a new repository page. Now why are we
already publishing to GitHub? Well, a
better question would be why not? When
you're developing your SAS applications,
the biggest mistake you can make is just
to keep developing it locally. Many
things can go wrong and you can lose
access to your codebase. Or even worse,
maybe you change some code and it breaks
the application and you don't know how
to revert it. But if you continuously
make commits over to GitHub, you'll be
able to revert to a previous stage of
your application at any point in time.
So let's actually create a new repo and
I'll call it SAS app. I'll leave it
public and click create. Once you do
that, you can follow these steps right
here or just follow what I'm doing.
Within the terminal, you can run git
init dot to add all of the currently
saved files within it. Get commit dash m
initial commit get branch m main get
remote add origin and then copy the link
to your GitHub repo. And finally, get
push u origin main. And this will nicely
push the code that you have added so far
over to GitHub. So if you reload, you'll
be able to see all of your code right
here. Now, this will be super useful for
those of you that are watching this
course over on JSMy Pro. Why? Because
this entire course will be split into
individual lessons. So you'll be able to
see exactly what we're doing lesson to
lesson. And for each lesson, you'll be
able to read a summary as well as the
entire transcript of that video. Then
you'll be able to test your knowledge
with a quiz. And most importantly,
you'll have access to a link pointing to
the GitHub commit containing only the
code for that lesson. I mean, you can
check it out right here on GitHub if you
head over to commits and then see this
commit that we have added right now, but
later on it's going to be easier to
track it lesson by lesson.
still whenever I remember even in the
video I'll try to remind you to also
push to GitHub so that your code is nice
and clean within your repo but with that
in mind now that we have set up the
routing of our application we might as
well go and create a navigation bar
because here we're going to have links
that point us to different pages that we
have just now created the routes for.
For example, clicking on home will point
us to the homepage. Learning companions
will point to that page. Journey will
point us to the profile and log out will
bring us back to the sign-in page. So in
the next lesson, let's develop our
navbar. To start developing our navbar,
I'll head over into the components
folder. I'll leave the UI for the
components that shad CN brings us. But
for our components, we'll create them
right here directly within the
components folder. So I'll create a new
file called
navbar.tsx. and I'll run rafce so we can
quickly spin it up. Within this navbar,
we can wrap it with an HTML 5 semantic
nav tag instead of a regular div. And we
can give it a class name equal to
navbar. Now you can see how my IDE
automatically recognizes that this
navbar is coming from
globals.css. And as I mentioned at the
start, we're using custom tailoring
classes for readability and reusability.
If you're unsure at what some of these
classes do, you can simply commandclick
it and it should lead you to the line
where we have created all of the classes
for that specific class name, such as
the navbar, which will simply apply a
flex container. It'll center the items
both vertically and horizontally. Set up
some margin, give it a full width, give
it some padding, a white background, and
also set up the padding for smaller
devices. Now within it I'll create a new
link component coming from next link
with an href pointing to forward slash
which is the homepage. And within this
link we can render a div that'll have a
class name equal to flex items center
gap of 2.5 and
cursor-pointer. Within it, I'll render
an image coming from next image with a
source of images logo. SVG, an al tag of
logo, a width of about 46, and we can
also do a height of about 44. And we can
close it right here. Now, whenever a
component is going into the second line,
what I can do is just split it a bit so
it's easier to see where it starts and
where it ends. And right below this
link, I'll also create a div that'll
have a class name equal to flex items
dash center and a gap of eight in
between the elements. And here we can
create some paragraphs pointing to
different parts of our application such
as home or maybe companions or maybe my
journey which is technically our profile
or maybe pointing us back to sign in.
For now of course these are dummy links
but later on we can actually make them
work. So now we have to import this
navbar right within our homepage. But if
you think about it, the navbar will not
only go within the homepage, it'll also
go right here within discover, within
the new companion builder, within my
journey, and it'll go everywhere. And
that is the perfect place to use a
Nex.js layout. It is a special file that
allows you to embed a specific component
within all of the other routes. So, head
over to app
layout.tsx. And here we are rendering
the children. The children is simply
what every single page shows for that
page. So if the page is profile, it'll
show the page that renders the profile
page. If the page is signin, it'll show
the sign-in. But in this case, we want
to add a self-closing navbar on top of
every single page. So the perfect place
to add it within is the layout. So now
if you head back, you'll be able to see
this simple navbar. Now, it's not yet
functional. So, what we need to do next
is create each individual nav item. I'll
do that by heading over to components
and right next to the navbar, I'll
create a new component, which I'll call
nav
items.tsx. I'll runce and I'll import it
right here instead of these fake
paragraphs that we created so far by
saying nav items. I will leave the sign
in though because later on we'll modify
it. But for now, we should be good. So
if I head over into the nav items, we
can now make it functional by creating a
new nav with a class name equal to flex
items
center and a gap of four. And right
within it, we need to create a new array
of different elements that we want to
map over, such as an object that has a
label pointing to the homepage. And it
also has an href of the link where we
want to go. And we need to create a new
one for every link that we have so we
can map over them. But instead of
creating this data point right here that
clutters our view, instead we want to
copy this array and take it somewhere
above. For example, here by saying const
nav items is equal to an array where we
can now define all of these different
data points in peace. So we can later on
very easily map over them. So one is
going to be the label of home. Then
we're going to have one that's going to
say label of companions with an href
pointing to companions. And we can have
a third one which is going to say my
journey. So that's going to be the label
my journey. And then href will also
point to my journey.
Perfect. Now we can simply map over
those nav items by saying nav items.m
map. And from each one we can
automatically
dstructure the label and the href. And
then for each one we can automatically
return something. Now when I say
automatically return, what do I mean by
that? I mean that after the arrow we're
not putting the curly braces like we are
here because then we're opening a new
functional block where we can type some
stuff, do some logic, and finally then
return. No, instead we're putting a
parenthesy right here directly, which
means that we have an immediate return.
So, whatever you put in here, such as a
link, it'll automatically return it.
This link will have an href of href,
it'll have a key since we're mapping
over the elements of label because each
label is different. And it'll simply
render the label within this link. So,
if you do that, you should be able to
see those three clickable links at the
top. And now all of them are going to
actually take you to different pages.
Profile, companions, home. But now, how
do we know which one is currently
active? Besides by taking a look at the
contents of the screen, we want to be
able to see at a glance on which page
we're on. Well, to be able to do that,
we have to figure out on which page
we're currently on, right? And we can do
that using the Nex.js's use path name
hook. So I'll say const path name is
equal to use path
name. This is being imported from next
navigation. And as soon as you use a
hook within your application, you have
to turn it into a use client component
because it'll be rendered on the client
side as it's using client side
functionalities such as tapping into the
current URL path that we're on. Now
based on this path we can now add a
class name to this link and we want to
make it dynamic. So we'll use something
known as a CN short for class names
coming from lib utils which allows us to
check whether the current path name is
triple equal to the href that we want to
go to. I'll actually put this into
multiple lines so it's easier to see. So
if the path name is equal to href, in
that case we want to render the text
primary and font- semi-bold. So we can
automatically show to people that we're
on that page right now. If you save
that, you'll see that home will be
bolded. Same if you click at companions,
that'll be bold and so on. Perfect. So
you should now be able to navigate
between different pages and see the
current page highlighted on the navbar.
And of course, this navbar is completely
mobile responsive, so it looks good on
desktop, too. So, with that in mind, we
have just developed our navbar. And it's
a good practice that whenever you
implement a feature, no matter how small
it is, that you actually push it over to
GitHub. So, I'll head over into my
second terminal. And I'll run get
addit
commit-m. You always write commit
messages in an imperative form. So you
say something like implement instead of
implemented. Why is it that way? Well,
that's because you're telling to people
that are seeing these commits of what
they will do if they implement this
commit within their existing codebase.
So this commit will implement navbar.
Okay, that's how you do it. And of
course, often times we write it in all
lowercase letters, but if you want to
make it look a bit nicer, you can say
implement navigation
bar. And once you commit it, you can
just run get push and this will
automatically be reflected on your
GitHub repo. Perfect. So if you have a
pro subscription and you're watching
this video right within JSM Pro, you'll
be able to see the commit changes for
that lesson specifically so that you
always know what you had to do within
that lesson. With that in mind, this
homepage is looking pretty bland. So, I
think it's about time that we give it
some love. Let's focus on the homepage
next. To start developing our homepage,
we first have to see how it looks like
on the finished design. We have this
nice looking dashboard. And the thing
that we instantly see right here are
these three differently colored cards.
And what instantly stands out are these
three differently colored action cards.
So, let's create those first and
position them on the page. I'll create a
new component for each one of these and
I'll call it companion
card.tsx. Let's start by running rafce
right within it. And we can head over
into our homepage by heading over into
app
page.tsx. And we can have an h1 right
here that says
popular companions. And then we can
create a new section that'll have a
class name equal to home section. And
within it, we'll create a new companion
card. 1 2 3. And I'll turn this main div
into a main tag because this is our main
content of the page. So now we can see
three different companion cards. Now on
top of these companion cards, we also
have a second part of the home section,
which are these recently completed
section. So this is a companions list as
well as this call to action to build a
new companion. So let's add those two.
I'll do it right here within the
components folder by creating a new file
called
companions
list.tsx. I'll run
rafce. And we want to do the same thing
for the CTA call to action. So I'll call
it CTA.tsx tsx and I'll run
rifce. And now we can just import it
over here within the homepage in a
section below the section with the three
cards. So I'll create another section
that'll have a class name equal to home
section. And here we can render the
companions list. And right below it we
want to render the CTA, the call to
action. So now everything looks all
jumbled up right here. But very soon as
we start implementing the styles for
these inner components, it'll all start
making sense. If you expand it to
desktop view though, you'll see that the
main view already started to resemble
the Figma design. We have three
companion cards at the top, the
companion list at the left, and the call
to action at the right. So let's figure
out which different props do we need to
pass to each one of these companion
cards. How can we know that? Well, we
can take a look at different data points
that it has. For example, we can see
that it has some kind of a topic like
science or a subject maybe. Then it has
a name or the title. It has the topic.
It has the duration and finally the
color of the card. So these are
different props that are different from
card to card whereas their layout is the
same. So we can technically already know
what we need to pass. So for the first
one, let's give it some kind of an ID.
I'll make it a string. In this case, 1 2
3. Let's give it a name. And we can
basically copy what we have here on the
design. So this is going to be neura the
brainy explorer. Next, we can have the
topic, which will be equal to, in this
case, we can copy what it says right
here, neural network of the brain. And
we can have a
subject. In this case, it is
science. And also a duration. In this
case, we can make it about 45 minutes.
Same what it says on the design. That
can be a number. And we can pass a
color. You can do anything really. I'll
just pass a random hexodimal code.
Perfect. And now that we have this card,
we can basically duplicate it two more
times. One. Two. And we can change the
ID. In this case, I'll do something like
456. And you can copy the contents of
the next card from the design. I'll call
it count see the number wizard. The
topic can be something like derivatives
and integrals. Let's say you want to
learn about that or you don't know how
to teach your kids that and you want the
AI to teach them. I think we're going to
reach those times pretty soon in the
future. Uh we can pass the duration and
maybe another hexadimal color like
E5D0
FF. And for the last card we can pass
789 as the ID. And we can copy the rest
of the stuff from the design verb the
vocabulary builder. We have the topic
next which is going to be in this case
language learning. So I'll say language.
We have the subject which is going to be
English literature. So let me copy that
from here. And we have a duration of
about 30 minutes as well as some kind of
a color such as
BDE7 FFF. So if we save it and go back,
nothing will really change, right? And
you know why? It's because we haven't
yet modified the actual companion card
itself. We have just passed the props
into it. So within this companion card,
we can now accept the props that we're
passing such as an ID, name, topic,
subject, duration, and color. And we can
define those as a type of companion,
card, props. This is a TypeScript
interface that we can create right above
so that we always know exactly what this
component has to accept. So you can say
interface companion card props and you
can declare that it needs an ID of a
type string, a name of a type string as
well, a topic of a type string, a
subject of a type string, a duration of
a type number, and a color of a type
string. And now it's not going to
complain because it knows that it's
getting everything that it needs. But if
you pass something different into it,
such as a test of a type test, you'll
immediately see that it says, "Hey, this
isn't going to work. Property test does
not exist on this companion card props
type." Perfect. So, now that we know
which props do we need and we know that
we're actually accepting them, we can
create the UI of the card. I'll wrap it
in an article tag, which simply means a
div that contains something together.
I'll give it a class name equal to
companion dashcard. And since we have to
keep the background color dynamic, I'll
pass an inline style of background color
set to the color that we're passing
through props. Next, if I save this,
you'll now be able to see three
differently colored divs. And now the
only thing we have to do is render the
contents. So I'll pass in the div with a
class name equal to flex justify between
and items center so we center it
nicely. Next I'll render a div that'll
have a class name of
subject-b able to see three different
subjects. I think for the second card, I
forgot to change the subject over to
Mats. So, I'll copy it and I'll paste it
right
here. There we go. That's good. Next,
still within the same outer div, but
below the subject div, I'll render a
button. This doesn't have to be a chat
button. We'll just give it a class name
of
companion bookmark. And I'll make it
render an image that'll have a source of
icons bookmark. SVG with an al tag of
bookmark, a width of about
12.5, and a height of
15. Perfect. So now we can also bookmark
this lesson. I'll head below the button
and below the div, and I'll render an
H2. That'll render the name of this
tutotor with a class name of
text-2xl font-bold just so we can make
it stand out. Below the h2 I'll render
the p tag that will render a class name
of
text-sm. And here we can just render the
topic. Below it, I'll render another div
with a class name equal
to flex items-c center, a gap of two,
and within it, we can display an image
with a source of icons forward/c
clock.svg with an al tag of
duration, a width of about 13.5, and a
height of 13.5 as well. So now you can
see this little clock icon and then
below it we can render a P that has a
class name of
text-sm that'll simply render duration
and then men's duration just so we know
how long it lasts 30 minutes or you can
just say duration minutes like this.
Finally, below this div, I'll render a
link component with an href pointing to
slash
companions slash id. And this is
actually pointing to our route that we
created, the dynamic route to that
specific lesson details. I'll give it a
class name of
wful. And let's not self-close it.
Instead, within this link, I'll render a
button that'll say launch lesson. And we
can style it a bit by giving it a class
name of btn primary wful and justify
center. So we center it really nicely on
the screen. And with that we got these
three amazing looking popular companions
cards. And of course it is fully mobile
responsive but we were developing mobile
first so I could technically say that it
is desktop responsive as it looks great
on the full screen. in the next lesson.
Let's continue with the rest of the
homepage
UI. Now that we've implemented those
three cards right at the top of our
homepage, we can start focusing on the
bottom two. The companions list and the
call to action. The recently completed
section will look something like this.
So, it'll have to be a table of sorts.
not a full-on table with lines in
between the items creating an Excel
sheet design, but it still has some
columns and rows. So, to achieve this
design, we'll use a Shatian table, a
responsive table component that by
default looks like this. But I'll show
you how we can style it further. So,
let's install it by running this MPX
chat add latest add table command, which
we can run right here within our second
terminal. There we go. And then head
over into the companions list. Within
it, we can start by copying the usage
part of a shoten table component and
paste it right at the top. Then I'll
wrap the entire companions list in an
article instead of a div so we can
encapsulate it. And within it, let's
just render an H2 that will say
something like recent sessions.
And then below that H2, I will then copy
the second part of the usage of the
table, which is the table itself, and
then just paste it over here. If I do
this and head back over to our deployed
application, you'll notice that now at
the bottom, we have what seems to be a
very simple, straightforward table. But
of course, we want to make it look like
the one that I showed you in the design.
So to achieve that, let's actually head
back over into our homepage and let's
first pass the necessary props, one of
which will contain the data for the
table. But we can start with a simple
title. So title will be equal to
recently completed
sessions. Next, we'll have companions.
And here is where we actually have to
pass the data. So I'll make it equal to
recent sessions. And this is coming
directly from constants
index.ts. Here you can see that I
created an array of couple of different
objects that have the ids and then
subjects, names, topics, durations and
colors. So we can nicely display some
dummy data within that table at least
for now. Later on all of this data will
be coming for real from our database. So
alongside the companions, we can also
pass some additional class names that
will alter how the companions list will
be rendered. So I'll give it a class
names equal to W of 2 over3. So this is
the width because 1/3 will be kept for
the call to action button. And then on
max large devices, we'll actually make
it take the full width. So I'll do a W
full. Now we can head over into the
companions list and accept these props.
So let's accept the title, the
companions as well as class names. And
all of these will be of a type
companions list props. And we can
declare that as an interface right above
companions list props where it'll have a
title of a type string. It'll have
companions which will be optional of a
type companion coming from index DTS
array and finally a class names optional
of a type string. So what is this
companion array? Well this companion is
a type that I already created within our
index.d.ts which is where we have most
of our TypeScript interfaces. And here
we say just that each companion will
have a name, subject, topic, duration,
and whether it had been bookmarked or
not. So now that we're accepting those
props, let's actually pass the class
names into this article by saying class
name is equal to I'll make it dynamic by
rendering CN class names. And we'll
always render the companion list, but
then on top of it, we'll also pass the
additional class names. This will turn
that ugly, boring table into a bit more
interesting table. Still not good
enough. So, I'll style this H2 by giving
it a class name of
font-bold text-3 Excel. There we go.
That's making it stand out a bit more.
And now we can focus on the table. We
first have the table. No need for a
table caption. The table header will
contain a table row and table row will
contain the table head. In this case,
the first one will have a class name
equal to
text-lg and then width 2 over3 and it'll
simply say lessons. The next one will
have a class name equal to
text-lg. And this one will render a
heading of
subject. And then another one will have
a class name equal to
text-lg text- write. And this one will
render the text that'll say duration.
That's it. We only need three. And then
below it within the table body we can
map over the data that we're passing
into this table as a prop. So I will
simply map over
companions question mark.m mapap where
we get each individual companion and for
each companion we can automatically
return a table row and within each table
row we'll return a table cell and within
a table cell we'll render a link
component with an href pointing to
forward slash
companions slash companion
id and within it for now I'll just
render a
companion subject just so we can
visualize it. So now if you take a look
we have split the table into three
different columns lessons subject and
duration. We can remove the second table
row that was from the default chassis
and component usage. But now we have
something that looks a bit closer to
what we have on the design. Still not
quite there yet. So, first to get rid of
this error, each table row will have to
have a key equal to companion ID. And
I'm noticing that we started repeating
ourselves just a tiny bit. So, we can
automatically dstructure the prompts
from a companion such as an ID, a
subject, maybe also a name and a topic.
Is there something else? Well, I think
there's a duration, but that should be
more or less it. So now we don't have to
repeat ourselves and we can just say id
subject and so on. We're good. And
within this link, we'll actually create
a div. This div will have a class name
equal to flex items center and a gap of
two in between the elements. And then
within it, I'll render another div that
will then render an image right within
it. Image with a source of forward slash
icons forward slash dynamic code of
subject. SVG. So I prepared a couple of
images or icons for each one of the
subjects. We can also give it an al tag
of subject and a width of about 35 and a
height of 35 as well.
And we can close it there. And maybe
just so it makes a bit more sense, I'll
split it into multiple
lines. There we go. So now we can see
different icons for each one of these
subjects. We can give this div a class
name equal to size of 72 pixels.
flex items dash center justify dash
center rounded- lg on max medium devices
hidden because we don't have any space
to show it on this type of view. We can
also apply a style because it allows us
to be a bit more dynamic where we can
set the background color to be equal to
get subject
color to which we can pass the subject
and this get subject color is coming
from utils which we imported before. It
is possible that the utils got
overridden when we installed chaten. So
if that happened, you'll just have to
bring back the utils that we got from
the assets file within the video kit.
Once you do that, now we are assigning a
new color to each one of these divs.
Although they are hidden on mobile
devices because there's not a lot of
space to show them, but we will show it
later on on desktop devices. For now,
let's head below this div and let's
create another
div with a class name equal to flex
flex- call a gap of two and then within
it we can display a p tag that'll have a
class name equal to
font-bold and text-2 excel that will
render a companion name or in this case
just the name. So if we do this, you
should be able to see different
companion names. And if you click on one
of these, it'll actually point us to the
companion session, which is the details
page for that specific companion. Below
it, I'll also render another P tag with
a class name equal to text-l. So a bit
smaller than 2XL. And here we'll render
the topic. Perfect. So now we can see
all the different lessons. That's it
that we want to show in the lessons
table. But now we want to head over to
the subject table. So I'll go a bit
below and we will exit the first table
cell, but we'll start a new one right
here. This second table cell will have a
div that'll render the subject of a
specific session. Science, maths,
language, coding, and so on. And we can
give this div a class
name equal to subject-b badge w- fit max
md h h h h h h h h h h h h h h h h h h h
h h h h h h h h h h h h h h h h h h h h
h because we don't have any space for
it. Then I'll create another one that we
will have the space for on mobile. So
I'll create a div with a class name
equal to flex items center justify-c
center rounded- lg w fit padding of two
and on medium devices it'll be hidden
and we'll also give it a style equal to
background color will be set to get
subject color to which we can pass the
subject within that div we can render an
image and this image will render a
source of forward slash icons slash
subjects
SVG with an al tag equal to
subject a width of 18 and a height of 18
as well and we can close that image
right here that should look something
like this once we indent it properly and
now you can see that on mobile devices
We see something looks like this. But
this SVG was supposed to be outside of
the subject. And now we can see those
small icons. Now we can head into the
last table cell. So I'll create it right
here. This one will be for the duration.
So I will create a new div right within
it with a class name equal to flex items
center gap of two wful and justify end.
And within it we can render a p tag that
will render the duration. There we go.
Now we can see the number of minutes.
But let's style it a bit by giving it a
class name equal to
text-2xl. Then after duration, we can
give it a bit of spacing and then
display a span that will be hidden on
max MD devices and it'll simply say
mints. So on mobile we don't have the
space to say mints but on larger devices
we will have the space. We can also
render an
image right below this B tag that'll
have a source of icons clock.svg SVG
with an all tag of minutes, a width of
14, a height of 14, and a class of
medium devices hidden. Once again, to
save some time on mobile because on
mobile we'll show the clock usually will
say mints. So with that in mind, now we
have created this table which looks
something like this. looks great on
mobile and you can see that it even
functions well on mobile because we can
still see all of the contents. But where
this table really shines is of course
the desktop view where we can see these
more detailed icons. Then since we're
showing the icons here in a bit of a
larger format here we show just the
regular text and then we specify the
duration. Pretty cool, right? And
finally we have to render this call to
action part that will look something
like this. We have to create a card
within it a little banner, a heading, a
subheading, and then an image showing
all the different subjects and then a
button that allows us to build a new
companion. So to implement it, we can
close what we have right now and just
head over into this call to action
component. to start implementing it. I
will turn it into a section with a class
name of CTA section which will give it
this nice looking background. Then I'll
create a div right within it with a
class name equal to CTA badge and I'll
make it say start learning your way.
There we go. Already much better. Next,
an H2 right within it with a class name
of
text-3XL to make it stand out and
font-bold. And we can make it say build
and
personalize your learning companion. If
you save it, that really sticks out. I
think if you remove your, it'll fit even
more nicely. And then below that H2, we
can render a paragraph for which the
text we can copy from the design.
Something like pick a name, subject,
voice, and personality and start
recording through voice conversations
that feel natural and fun. There we go.
That's looking great. But of course, we
need the actual image and a button. So,
let's render an image with a source of
images CTA. SVG, an al tag of CTA, a
width of about
362, and a height of about 232. I found
those values to work the best. There we
go. And below it, a new
button with a class name equal to btn
primary. That'll then render a new image
with a source of
icons plus SVG, an al tag of plus, a
width of only 12, and a height of 12 as
well. And below it, we can render a link
component with an href pointing to
companions new. This will lead us to a
form that allow us to create a new
companion. So the text within it can
simply say build a new
companion and we can save it. There we
go. This is actually looking amazing. It
looks great on mobile but I think you
can imagine it. It looks even better on
desktop. And everything is already
technically functional. I mean you can
click on each one of these lines and
it'll lead you to the companion details.
You can click on launch lesson which
also leads to the companion details or
you can click on build a new companion
which leads you to the new companion
form. Pretty cool. It almost feels like
we have already developed our app as
everything looks almost exactly like it
does on the design but we still have a
long way to go. For now, we have
developed the UI of the homepage. But
now, let's develop the UI of the create
a companion form or in other words, a
companion
builder. In order to be able to show
real companions on the homepage and the
companions library, we need to store
them in some database. But before that,
we need a form that allow us to submit
those companions. and forms can be
tricky at first, but thankfully chaten
paired with react hook form will do the
heavy lifting for us. So head over to
react hook form within chats UI and
let's install our form right within our
code. I will head over to the terminal
and run mpx chats at latest add form and
I'll use the legacy pure deps as usual
and then we can create a new component
called companion form.ts
tsx. I'll then run rafce and we'll need
to import this form right within our
page where we want to create new
companions. That's within app companions
new page.tsx. So within here, let's turn
this into a main since that's the main
part of the component or the page. Let's
render an article between it and let's
render an H1 that'll say companion
builder. And right below it, we can
render a companion
form. There we go. Now we can explore
this in action by clicking build a new
companion right here. And you can see
companion builder and then a companion
form right below it. We can style the
layout a bit more by giving this main
tag a class name equal to min lg w of 1
over3. On min medium devices, the form
will take 2/3 of the view, and it'll
always be centered both vertically and
horizontally. There we go. This article
will have a class name equal to
w-ool, a gap of four, flex, and flex-
call. And now we can head over into the
companion form here. I'll start by
copying the usage from react hook forms
or rather let's do it step by step. I'll
first copy the step one which is to
create a form schema. I'll zoom it out
so we can see a bit better. So first we
have to define the schema of our form
using a zod schema. You can read more
about it in zah documentation but don't
worry as I'll explain everything as we
go. First things first, we have to turn
this into a client rendered component or
page because we are dealing with browser
functionalities such as keyboard events
and form submissions. We then import Z
from Zod which will allow us to validate
the inputs within our form. Next, we
have to define the form itself. So, we
have to import two more things which is
going to be the ZOD resolver as well as
the use form. And then within our form,
we have to do two things. First, we have
to define our form and then we have to
submit it. So, copy this part and add it
at the top of your companion form
component. You'll notice that this form
requires some kind of a form schema,
which for now only accepts a username.
So, we need to modify it to suit what
our form needs. For example, it'll need
a name, which can be a Z.string string
min one character we don't need the max
but I will add a
message in case this rule is not met for
example companion is required and we can
duplicate this a couple of times for the
second one I'll say subject and subject
is required we'll also need a topic and
topic will be required as well after
that we'll need a voice that we're going
I use for the lesson. So, it has to be
required. We'll also use a style of the
conversation. So, I'll say style is
required as well. And finally, a
duration. Now, duration has to be a
number. So, I'll say
z.co number with a minimum value of one.
And then we can say duration is
required. So now that we have this form
schema, you can see that we're actually
using it to define our form. And
therefore, we have to also choose the
default values of that form to match the
form schema. To do it quickly, I will
hold the option key and select all of
these different keywords and I'll paste
them right here. Then I'll do some more
keyboard shortcut magic by holding the
option key to create multiple cursors.
and then I'll set all of them to an
empty string. Besides the duration,
which I will set to be equal to about 15
minutes by default. Now that we have our
form, we also need to define a submit
handler or what will happen once we
submit the form. I prefer error
functions. So let's actually turn this
into a const onsubmit as an error
function. And for now we can simply
console log the values once we submit
the form. We can then move over to the
step three which is to build our form.
And we can build it by copying all of
the different components that will make
up the form. So I'll paste them right
here at the top. Now we have already
installed the form as a shaden
component, but we haven't yet installed
the input. So head over to the terminal
and run mpx shaden add
latest add input. And we can also add a
text area. Once you add those, we can
head below and I'll copy this part where
we actually render the form instead of
this empty div right here. You'll notice
that it'll complain a bit saying that
the name is equal to username. But in
this case, name can be just name because
that's what we have under our default
values. So with that in mind, it looks
like our form is done. You now have a
fully accessible form that is type- safe
with client side validation. So if I
click submit, you can see that it
actually gives us an error. And if I go
back to our application, if I click
submit, we have the same thing. But now
we have to render the actual inputs that
our specific form needs. The first form
field is already almost as good as it
is, but I'll change the label to
something like companion name. And I'll
give it a placeholder of enter the
companion
name with a class name equal to input.
I'll put it in a few lines just so it's
a bit easier to see. And in this case,
we don't need the form description, but
I will leave the form message so we can
display it if something goes wrong. Now,
we can duplicate this form field just
below. And I'll actually do it a couple
of times for each one of these different
fields. So that is one, two, three,
four, five times more. Let's do it once,
two times, three times, four times, and
five. There we go. So now we have a lot
of different fields. So let's head over
to our second one, and I'll rename it to
subject. The form label will be subject
as well. And in this case, instead of
simply rendering an input, we want to
render a select component. So in this
case I will open up our terminal and run
MPX shaden at latest add
select. We'll use legacy pure depths.
And now we can render a select right
within it. So let's copy it right here
and paste it within the form control.
And with that it is already looking good
and it seems to be functional but we're
going to modify it for our needs. we
have to control the value that has been
selected. So within the select I'll say
on value change is equal to field
onchange value will be equal to field do
value and the default value will be set
to field value. React hook form makes it
super easy because we're controlling
everything using this field prop under
the form field render. Next, we can give
this select trigger a class name of
input and
capitalize. And we can give a select
value a placeholder of select the
subject. There we go. And now under
select content, I will remove the three
dummy select items and instead I will
map over the subjects coming from
constants. And for each one of these
subjects, we want to automatically
return a select item. Each select item
will have a
value and that value will be equal to
subject. It'll have a key since we're
mapping over it also equal to subject
and a class name of
capitalize.
And within the select item, we will
render the subject name. So, if you have
done this properly, you should be able
to see all of the different subjects
that we're offering within our
application. Later on, I'll show you how
we can modify these, but for now, this
is more than enough. And that's it. We
have our second input. I'll just reload
the page so we don't have to stare at
these errors. We have the companion name
and the subject. Now, let's head over
for our third one, which is going to be
the topic. So under the form label we
can say what should the companion help
with and then for the placeholder we can
give it an example like ex
derivatives and integrals for example if
we're dealing with some heavy math
problems and that's it. But instead of
it being an input we can make it a text
area. So text area which will give the
user a bit more space to explain what
they want. Next we can head below and
we're going to have another select. So
actually I want to delete this form
field that I entered before and I want
to duplicate the select one that we have
already created. So I'll copy the select
field and paste it right here as the
fourth field. But we'll want to modify
it just a tiny bit. This one I'll call
voice. and the label will say voice as
well. We're going to keep everything the
same, but within the select trigger,
we'll give it just an input and a
placeholder of select the voice that'll
look something like this. And then for
the select contents, we're going to
display two different select items. One
that'll have a value equal to male and
it'll render a text of male. And the
other one which I think you can guess
will render a value of female and also
the text of female right here. That'll
allow us to choose the type of the voice
that we want our learning companion to
have. Now I will duplicate it one more
time below it. And this time I'll ask
for the style of the voice. So we can
change this to style the form label to
style as well. We'll keep this the same.
The trigger will say select the style
and then for the select contents instead
of male and female we'll say
formal formal here as well and informal
or in this case we can say casual. So
now we have two different selects one
for the male or female type and one for
the style. And finally just below the
style we want to have one more form
field. I think we currently have two so
I'll delete one. And the last one I'll
rename to duration. And the label will
also be set to estimated session
duration in minutes. This time it'll be
an input with a placeholder of something
like 15. A type of number so that the
users can more easily select the number
of minutes they have with these plus and
minus signs. And I think that's more or
less it. We can finish it off with a
button that has a type of submit. And to
make it a bit more apparent, I'll give
it a class name equal to wool and
cursor-pointer. And instead of making it
say submit, I'll make it say build your
companion. There we go. So now we have a
full companion builder form. At least
the UI here. And on full screen it
should look something like this. And if
you try to submit it, you'll notice that
we have different errors saying that the
fields are required. But if you try to
successfully submit it, such as entering
a real companion name, let's do
something like maths in this case. And
we need help with let's say
multiplication. Choose the voice style
and the estimated session duration and
click build your companion. If you do
that and open up inspect element and
head over to console, you'll see that
we'll get back an object with the values
that we have submitted. Duration, name,
style, subject, topic, and voice all
right here at our disposal to do
something with them. Where are we
getting those from? Well, from the
function submit function right here.
Later on, instead of just console
logging them, we'll do something useful
with them. But now to be able to submit
our actual tutor, we need one more very
important component and that is the user
that is trying to create their companion
because otherwise how are we going to
know which companion belongs to which
user and how many they have created. To
do that we need to implement
authentication. So far the UI is looking
great and very soon we'll actually be
able to create companions. But hey, we
cannot do it if we cannot create our own
user yet. So let's do that
next. We are very close to storing our
companions. But before that, we need to
set up our authentication and then the
database. So let's start with O. To set
up O in this app, we'll use Clerk. It's
not just a sign-in box. It allows you to
authenticate and manage your users. And
later on, I'll show you how we can also
use clerk billing to implement
subscriptions for your SAS apps. But for
now, just click the clerk link down in
the description and head over to your
dashboard. Once you're there, at the
intro, I already showed you how to
create an empty project. I just called
it JSM SAS app. But if you haven't yet
created it, you can just start with JSM
and then give your app a name and then
add Google and email for your sign-in
options. After that, we have to follow a
couple of steps. We can start by
following their overview. It says you're
just a couple of steps away from your
first user. We are using Next.js. And
then it says, "Copy this quick start
guide as prompt for LLM to implement
clerk in your next application." Okay.
Now, if I head back over into my
application, and if I try to head to any
kind of a text editor like a readme
here, and I try to paste what I just
copied, it looks like this is a complete
implementation of everything needed to
install Clerk. And if you're using an
LLM within your code editor, it should
be able to do all of that for you. So,
this is the perfect opportunity to test
out Juny. Juni is Jet Brains's smart
coding agent that integrates into
Webstorm and it's more than just an LLM.
It's actually a coding agent that can
make your coding more efficient. So, you
can just download it for free. And once
you do, you can press command shiftB and
search for Juny. This will open it up
right here on the right side. And
there's also something called a brave
mode which allows Juny to execute
terminal commands without confirmation
which I think is going to be perfect in
this case because we need Juny to
install a couple of clerk packages. So
I'll just paste what I copied over from
clerk and let's see how far Juny can run
with it. First it's going to take some
time to fully understand what it needs
to do. So, it's going to send the LLM
request and then it'll go back and
research our entire codebase so it knows
exactly what it has to do and where. But
if you're not using Juny, don't worry
about it. After Juny integrates Clerk in
just a single command, I'll actually go
through the entire codebase and through
the entire Clerk setup manually. So, if
you're not using an LLM, you can still
do it with my guidance. So, no worries
about that at all. But it's just so
amazing to be able to see what these
modern coding agents are capable of. And
I also got to say that this is the first
time that I'm seeing a dev tool mention
a copy prompt button for an LLM to
integrate this within your code instead
of doing all of these things manually.
Pretty cool. So now you can see that
it's actually opening up different files
and then editing those files to
accommodate for changes. So let's wait a
couple of seconds until it finishes and
then I'll be right back. Oh, and if you
don't know how to find this Juni page,
I'll leave it linked down in the
description. It is completely free to
get started with. And there we go. Clerk
was integrated into Nex.js app router,
including a middleware file with Clerk
middleware and wrapping the app with
Clerk provider. The navbar component was
updated with Clerk authentication UI
components and a template for
environment variables was created. The
implementation followed all guidelines
without errors. This is exactly what I
want to see. And to be honest, the
efficiency improvement and the time Juny
saved is absolutely crazy. So I'll click
done. I'll collapse Juny and let's check
out what Juny did. First of all, I'm
assuming that it added clerk next.js to
the dependencies. So since it did that,
we just have to run mpm install to
install it. So I'll do it right here and
say mpm install add clerk next.js. And
if you haven't used Juny, you can also
just follow along with me right now. So
first things first, install add clerk
next.js package. This will also update
it with the right version. Now if I open
up my browser, you can see that the
application is still fully functional.
So nothing broke, which is absolutely
amazing. At the bottom right, we can see
that Clark is in keyless mode, which
means that we need to add our API keys,
which makes sense. Juny didn't want to
mess up with our API codes. That's okay.
But then it also added the sign in and
the signup components at the top right.
So if you click it, it'll actually lead
us to the account creation page which is
already completely functional. I got to
say this whole experience seemed
surreal. The fact that a dev tool offer
a quick start guide as a prompt for an
LLM and then even more so that Juni was
able to implement what the command
requested, it's out of this world. I
know I'm repeating myself a bit, but I
am pretty much amazed at how far web
development has come. And no, this
doesn't mean that AI will replace you.
It just means that if you use it well,
it's going to make you more efficient.
Okay, so now that we have installed the
clerk package, we have to get our env.
That's one thing that the AI bots didn't
want to do for us. So, it provided the
example, but now we're going to add our
own
env.local file. And I'll paste the real
keys right here. So after that, we're no
longer going to be in the keyless mode.
After that, you have to create a new
file called
middleware.ts that is not within the
app, but rather at the root of our
application. And within it, you have to
copy this step from the documentation.
Import clerk middleware from Nex.js
server. Export default clerk middleware.
And then we provide a configuration.
Next, we have to head over into our
layout.tsx and we have to wrap our
application with the clerk provider. So
just import it from at
clerk/nextjs and then just wrap your
application with the clerk provider. One
extra thing we can do here is also give
it an appearance and we can define a
variable of color primary and you can
set it to our primary color which is fe
933. So now we're defining that variable
as well. Perfect. Next, we want to head
over into our navbar. And here we want
to import a couple of things from clerk.
We want to import a signin
button, a signed in functionality,
signed out functionality, and the user
button. In this case, I don't think
we'll need the sign up button. So, we
can remove that. And we can just remove
it from here as well. Or rather, if you
haven't used an LLM to generate this,
you can replicate what I have right
here. Below the nav items, we created
two different divs. The signed out div,
which renders the code that only needs
to be showing if we are signed out, and
then the code that should be showing if
we're signed in. So, if we are signed
out, we actually want to show a signin
button. So, I'll just render that signin
button like so.
and I'll actually render something
within it which is going to be an actual
button with a class name equal to btn
sign
in and it'll say sign in. So now if we
go back you can see that it is a bit
more pronounced after that we have if
we're signed in then we just want to
render the user button. You'll very soon
see exactly what this does. So, if you
head over to sign in, it's going to
redirect you to a completely different
page where if you click continue with
Google and you sign in, I got redirected
right here to our homepage where I now
have the ability to see everything about
the currently logged in user and I can
even manage my account and my email got
connected with my Google account. Pretty
cool to have all of this done by
default. But again, it is possible that
you don't have this done on your end as
well. So now let's implement it. I'll
head over to app sign in and then here
is our page. This is the page that we
haven't utilized up to this point. But
rather what clerk did is if you click
sign in we got redirected to a whole new
URL which is not hosted under our
domain. So we have to fix that.
Thankfully to do just that clerk has an
entire page on building our own signin
or up page for our next app with clerk.
So step one is to create a new optional
catch all route under app signin and
then double square bracket signin
page.dsx. So let's actually remove this
current
signin and within app I'll create a new
folder called
signin. Within that folder, I'll create
a new folder with a double square
bracket dot dot dot sign-in close the
square
brackets. And within it, I'll create a
new file called
page.tsx. And there we can write import
signin from add clerk next.js export
default signin page. After that, for
now, I'll skip the second step and we
can focus on updating our environment
variables.
So, I'll copy what it says right here
and go over to my envo and I'll paste
them
below. We need to set the next public
clerk signin URL to forward/signin. And
we can also set the fallback URLs. Now,
if you head back to our application and
you click sign in, you'll be redirected
to a page that looks much more like our
current application. Of course, the
layout is not quite there yet, but we
can fix it very easily by wrapping this
signin into a main tag, which I'll do
right here, and then giving it a class
name equal to flex items center and
justify dash center. If you do this,
it'll be nicely centered on the screen
and it seems like it's our UI. But not
only does it seem that way, it actually
is a part of our application. So we can
very easily go from homepage to the
signin. Heading back to our clerk
dashboard for a second, find your
project and then head over to configure
under email, phone, and username. You
can also enable either the username or
the first and last name. And then for an
even better customization, you can head
over to configure, scroll down to the
account portal, and you can fully
customize how you want your O to look
like by heading over to
customization. Set the appearance to
light because our app is light. And then
set the color to FE 5933, which is our
orang-ish color. And that's it. In just
a couple of steps, we have wrapped our
application with the clerk provider,
implemented the sign-in route, installed
the add clerk next.js package, and
within our navbar, we have implemented
the signed in and signed out buttons.
Let's reload and give it a shot one more
time. And there we go. We're logged in.
It couldn't be any easier.
With authentication implemented so
easily within our application, we are
now ready to focus on another crucial
feature for every SAS application, and
that is billing. Once you've implemented
the features within your application,
you want to allow your users to pay you
some money for them. So, back within our
clerk dashboard, you should be able to
see a congratulations message saying
that you now have one user within your
application. But we already know that.
So, we want to do something else
instead, and that is head over to the
subscriptions tab and click get started.
First things first, we have to create
our first billing plan. So, click create
a plan. And you can see that we
automatically got a new free plan that
was created for us. We can modify it a
bit by saying something like basic plan.
Slug can be basic. And for the
description, we can say something like
perfect for testing the waters. just to
see whether they like our app or not.
Monthly fee will be set to zero and it
can be publicly available. So just click
save. Now that we've created this plan,
we are ready to add a couple of
features. Features let you define and
gate functionality in your app. Add
features to your plans to give users
fine grain access to your app. Think of
it as allowing your users to access
specific app functionalities. I'll click
add a feature to add the first one. Now,
this can be totally unique. It's up to
you to choose which SAS features you
want to give to your audience for this
specific plan. For example, I will say
that they can have 10 conversations per
month on a free plan. And I'll click
create feature. For example, I'll say
that our users on the free plan can have
10 conversations per month. This is
referring to the conversations with AI
tutors. And just click create
feature. There we go. One added, two
more to go. I actually created some of
these earlier, so I just called it three
active companions and a basic session
recap feature. All of these will be
offered for free. You want to give your
users enough features to test the
waters, but also not too much so they
never have the need to upgrade. So, I'll
click apply features to plan. Now, let's
head back over to other plans and let's
create a new plan right here at the
bottom. I'll give it a name of core
learner, a slug of core, and a
description of more companions, more
growth. And you can also set the monthly
base fee to around 29 bucks, or you can
literally make it whatever you want. And
it's always a good idea to turn on the
annual discount because that way you can
get people to subscribe for 12 months
and give them a cheaper price. Perfect.
Now, let's also click add a feature so
we can assign specific features to this
specific plan. I'll add a new feature of
everything in
free and click create. I'll also add
another one called
unlimited conversations. Let's also
maybe increase the number of active
companions from three to 10. So I'll say
10 active
companions. Let's also add the ability
to save conversation
history. You know what? We can also do
inline quizzes and the
recaps. We're really adding a lot of
cool features here.
And finally, maybe we give them access
to something like monthly progress
reports. Perfect. So now we have created
a lot of features and we can structure
them somehow in a way that makes sense.
So I'll say everything in free at the
top. Next, I'll put the unlimited
conversations right here. up to 10
active companions, inline quizzes and
recaps, monthly progress reports, and
save conversation history can also be a
bit higher. Perfect. And I'll click
save. So now we have this plan and many
different features attached to it. Let's
go ahead and add the third plan.
Typically, you want to give your users
some options. So I'll call this plan pro
companion with a slug of pro and a
description of something like your
personal AI powered
academy. We can increase the price to
something like 49 bucks per month with
an annual discount bringing it down to
maybe
39. And I'll save it. And we can now add
some more features. So this time I will
say
everything in core that was the previous
plan that we had. Next we can say
unlimited
companions. We can do something crazy
like full performance
dashboard. Let's also add a couple more
features. I actually listed them already
right here under available features.
It's going to be daily learning
reminders, early access to new features,
and priority support. You can go ahead
and add those right here under new
feature and click apply features to
plan. Perfect. I'll bring the everything
in core at the top. Also, the unlimited
companions. We can also have early
access, full dashboard, and then
reminders and support at the bottom.
Actually, many of these features that
are listed here, we also offer on
jsmastery.com. So, if you want to check
out how I structure the plans for you,
you can head over to
jsmastery.com/membership and choose
between elite and pro. Trust me, there's
a lot of good stuff in there. Finally,
head over to configure, scroll down to
billing, and head over to
settings and then click enable billing.
Perfect. Billing is enabled.
The only thing you have to do now is add
the pricing table component to your app
so your users can subscribe to your
plans. Then we'll use additional SDKs to
gate functionality in our apps codebase
by using the has method and the protect
component. So let me show you how that
works. We just have to head over into
subscription page.tsx and we can also
navigate over to it using the URL bar in
our browser. So I'll say
subscription and right now you'll notice
that it is completely empty. It just
says subscription. But just by importing
a single pricing table component coming
from add
clerk/nextjs immediately we get a fully
mobile responsive beautiful pricing
table. Of course, we'll style it further
later on, but I think you can already
get the point of how easy it was to get
it implemented using all of the best
practices of pricing cards with the
pricing, the title, the description of
the pricing, the cost, the toggle to
switch between annual and monthly
billing, and then all of the features
offered within our plans. They look
great out of the box, and very soon
we'll put them to use. Once you
subscribe, you'll also be able to see
your subscription right here under your
account because now there's a new tab
right here called billing that allows
you to check your current plan, add your
payment method, check out the previous
statements, or just switch the plan
directly here within the dashboard. Just
how cool is that and how easy it was to
implement. And check this out. If you go
ahead and click the subscribe button,
you might have thought, but there's so
much more setup that we have to do to
actually make this work. But no, it
actually opens up the checkout on the
right side, shows us the plan that we're
about to join. And since we're in the
development mode, we don't have to enter
our own card details. Rather, we can
just click pay with test card. Just like
that, the payment was successful. And
now we can click continue.
And if you head over to manage account
to billing, you'll see that right now we
are under the core learner plan and
under statements, you'll be able to see
that one invoice was automatically
generated for you. I got to say the
simplicity of this is just out of this
world. So with that in mind, we are now
done with implementing the
authentication and the billing. But now
we can start focusing on real
functionalities of our app. For which we
need a database. So in the next couple
of lessons, let's go ahead and set up
our
database. For the database, we'll use
Superbase allowing you to build in a
weekend and scale to millions. It's an
open-source Firebase alternative which
is a Postgress database working on edge
functions and of course allowing you to
store things. and I decided to use it
for this SAS course as many other SAS
applications such as resend, loops,
mobin, chatbase, and so many more use it
for their SAS apps. So to get started,
you can just sign in or start your
project. I'll continue with GitHub. And
if you're a new user, it'll ask you to
create your organization. So you can do
that very easily. I'll call it JSM SAS
app. It's going to be personal and free.
Once you do it, it'll ask you to create
a new project. So under project name,
you can say something like JSM converso
and you can enter a database password.
In this case, I'll just autogenerate a
strong password and copy it. Make sure
to do the same. And you can choose the
region that is closest to you and click
create. Once you do that, you'll be
redirected to your project dashboard.
Now head back over to your clerk
dashboard. Yep, that's right. And then
go to configure. Scroll down to
developer section and click on
integrations. And you'll be able to
notice that there's a new Superbase
integration that just came in. So turn
it on and click manage integration. Now
it'll ask you to select your instance.
So select the right organization and the
right project. Enable the Superbase
integration and just populate your clerk
domain in Superbase. Copy this link and
head over to Superbase third party O
settings. Next, select your project.
add a provider, choose clerk, and just
paste the domain you just
copied. Pretty seamless, right?
Immediately, it'll create the connection
between the two. There we go. As it
says, this integration will allow users
to use Superbase with Clerk. Additional
setup may be required. There's a whole
docs page, but don't worry about that
because I'll show you exactly how it
works. Now head over to the table
editor, the second icon on the top left,
and create a new table. Let's call it
companions. You can leave enable rowle
security enabled and scroll down to the
columns and change the ID to the UYU ID
type, universal unique identifier. Next,
we need to add all of the columns that
we're going to use within our
application. We can leave the created ad
as timestamp with the default value of
now. And we can add a couple more
columns. The next one will be name,
which is just going to be a var, which
is just a variable length character
string. Let's add a couple more such as
a subject, which will also be a varchar.
We can add a topic, which will also be a
var. We can add a style of the
conversation. Is it a bit laidback or is
it not? This is also a varchar. We can
add the type of voice which will also be
a varchar male or female. We can also
add a duration which will be an integer
of eight. That's going to be enough. And
we can also choose the author which will
be a
var. Perfect. Now you can click save and
this will create a new table of
companions and add these nine columns to
it. Let's wait until it does that. There
we go. And now we can create one more
table. This one we'll call
session_history. Enable the rowle
security and scroll down to columns. We
can also keep the ID equal to UU ID to
make it unique. Created at will be a
time stamp of now. And then we'll also
add a user ID field which will be a
varchar pointing to the clerk user ID.
And I'll also add a companion ID.
which will be of a type UU ID. Make sure
to put the underscore between the user
ID and the companion ID here as well.
Now we can add a foreign key to form a
relation. So click add foreign key
relation. Choose a table to reference to
which will be a companions table and
choose the companion ID to relate to the
ID of the companion action. If reference
row is removed, we can choose cascade
which when chosen if updating a record
from public companions, it'll also
update any records that that reference
it in this table. And we can do the same
thing if a reference row is removed and
click save. Oh, and don't forget to save
the entire table as well. Perfect. Now
head over to authentication on the left
side and click on policies. Now click on
create policy for the companions table.
Under policy name, type all. Under
table, make it public companions. Policy
behavior can be
permissive. Select target roles can be
set to anon as in anonymous. And then
here you can provide an SQL expression
for the using statement where I will
simply say true. So we want to return
true for this policy. And I'll click
save. There we go. So we have
successfully created a new policy. And
now we want to add another policy for
companions. So click create policy and
call this policy clerk. I'll select all
right here as the policy command. And we
want to trigger this for the
authenticated users. And right here
under the SQL expression, you want to
say
using select.jwt
JWT as JWT is not
null. So we are writing pure SQL right
here. You'll see later on how this will
be integrated within our code. And with
check we can paste the same thing and
call it a day. So using this with check
select
off.jwt as JWT is not null and click
save policy. And now we want to repeat
the process for the session history. So
just create a new policy for the session
history. Let's name this one
all public session history permissive
select and choose the role of anon
anonymous. And for using you can just
say true right here and save the policy.
And we'll add one more under session
history. The name of this one will be
set to clerk.
It'll be permissive with the policy
command for all clause. Target roles
will be authenticated users. And here we
have to provide the same SQL expression
that we had before. Select
off.jwt as
JWT. And you can click save policy. If
you did this correctly, you should be
able to see under the policies
configuration two different tables,
companions and session history. And both
of them should have the all and select
policies. All for clerk apply to the
authenticated role and select all apply
to the anonymous role here. Let me just
go into this one to make sure that I got
it
right. Policy name is not correct here.
The policy name should just be all. It
looks like it got autofilled when I was
doing something. So make sure to select
add-on right here as well like we did
before. Policy name all. Select anon
true and click save. Yep. So this is how
it should look like. I believe now we're
good. Now I know that this setup took
some time but it allowed us to create an
account on superbase and to actually
spin up two different databases that are
now running on Postgress which we can
call from within our application. So
let's do just that and write the
implementation for the use of this
database within our code in the next
lesson. To connect the Superbase
database within our code, you can just
go ahead and click the connect button at
the top. It'll give you some envy over
to your application. If you click app
frameworks right here and then choose
Nex.js JS using app router with
superbizjs. I swear these modern dev
tools make it super simple to implement
them within our nextgs
applications. They even provided all the
different files that we need to make it
work. This time without an llm command,
but maybe that's something that they can
do as well. Still, let's first copy the
envir.v.local. I can now differentiate
those two by saying that this is for
clerk by adding a simple comment. The
bottom one will be for clerk. This is
the custom o setup. And then right below
it we can add another one which will be
for
superbase. Perfect. And now we could
just go ahead and copy and paste all of
these files. But I want to actually
teach you how we can integrate it
without just copy pasting code. So back
within our app, first we have to install
Superbase. So head over into your
terminal and run mpm install at
superbase slash
superbase-gs. It'll take just a moment
to get installed and then you can head
over into the lib folder and within it
you can create a new file called
superbase.ts.
within it we can export const create
superbase client which is going to be
equal to an arrow function and here
we'll do exactly what this function says
we will create a superbase client so
let's start by just returning a create
client which is coming from superbase
superbasejs to which we need to pass the
environment variables the first one
being process env
next public superbase URL and I can add
an exclamation mark at the end so that
we know that it's actually there and
then the next one will be process env
next
public
superbase anon
key and after you pass those next you
have to provide the options so in this
case the options will be an async
function called access token where we
can return the authentication token in
one single line because of the clerk and
superbase integration. So I'll say
return in parenthesis await o and this o
should be coming from clerk at
clerk/nextgjs/server get token. Oh, and
it looks like I'm missing an extra pair
of parenthesis right here at the end to
actually fetch that token. And this is a
method we're attaching to the function.
So it also has to have a pair of
parenthesis. Now that we've created this
file that creates the subbase client and
we're exporting it, we can now create a
new folder within the lib folder and
call it
actions. Within actions, I'll create a
new file called
companion.actions.ts within which we'll
start implementing our application
logic. So the first and most important
function will be to create a learning
companion. So I'll say export const
create
companion is equal to an asynchronous
function that accepts the form data of a
type create
companion and it'll return and create
that companion. Now what form data we're
passing into it? Well, it is everything
that we have within our front-end form.
a name, a subject, topic, voice, style,
and duration. So now the last missing
piece of the puzzle is the actual user
ID which now using the superbase and
clerk integration we can get super
easily by saying const dstructure the
user ID and rename it as author is equal
to
await call coming from cler next.js
server.
It is super easy to get access to the
currently authenticated user. Oh, and we
also have access to our entire database
thanks to the superbase client we
created which we can get by calling the
create superbase client. Remember it's
this one that we just created. Now that
we have the user and the database, we
are ready to do some magic. I'll say
const dstructure the data and the error
from the function we're trying to make.
And that is await
superbase dot and we first need to
access a specific table. So I'll say
from companions this is a relation to
that table. We want to insert an object
containing all of the form
data with an author. So this is going to
be the user ID.
And then we can call a dot select on it
which will basically return all the
columns separated by commas. Maybe we
can put this into multiple lines so it's
a bit easier to
see.
insert. And then if there is an error or
if there is no data in that case we can
just throw a new error that'll either
say error dot message or failed to
create a companion. If we don't have any
errors we can just return the first part
of the data. So data zero which should
be the newly created companion. Looks
like our webtorm is wondering what
superbase even means. It doesn't know
about it. So we'll just save it into the
dictionary so that it knows that it is
an actual word. Great. So now we have
exposed this server action called create
companion that allow us to call it from
the front end. Oh but hey this is super
important. This code can only be
executed on the server because we are
tapping into our database and mutating
it. So, so to ensure that this server
function only gets called on the server,
we need to add a use server directive at
the top, which means that every single
function within this file will be
executed only on the server. And now we
can head over into our new companion
page. So that is the companions new
page.tsx and we can try to get access to
the currently logged in user. Or if we
don't have one, we should never be able
to visit that page in the first place.
So right now if we log
out and head over to build a new
companion you can see that we can visit
it but that shouldn't be the case
because the users that are not logged in
should not be able to create their
companions and now we can add this
redirect in a check super easily by
saying const dstructure the user ID
coming from await o coming from clerk
nextgs server y server and not client
Well, because this page is rendered on
the server side. If we don't have a use
client at the top, it is server. And we
can also make it
asynchronous. And then if we don't have
a user ID, we can simply redirect using
the next navigation to sign in. As
simple as that. So if you go back and
reload, you'll see that now you cannot
visit the build on your companion.
Rather, you'll be redirected to sign in.
But now let's actually sign in. Head
over into build a new companion form.
And before we submit it, let's actually
open it up within our code. That is the
companion form
component. And here we have an empty
submit function. It is right here. On
submit, we're console logging values.
But instead of just console logging
them, let's actually do something with
them. Let's pass them into our server
action by saying const companion is
equal to
await create companion and this one is
of course coming from our server actions
that we just created to which we need to
pass all of the form data which I think
in this case is called values right here
and we also have to make it into an
async function because we're using a
weight right here. Next, if we have
successfully gotten back a companion,
then we're going to redirect to
forward/companions slash companion. ID
to be able to visit that companion's
details or the session. Else, we will
just console log something like failed
to create a
companion. And we will also redirect,
but this time not to that companions
details, but rather just to homepage
because something obviously went wrong.
So now we're ready to test all of this
out. We've done a lot of changes. So
let's see how it goes. I'll try to
submit the form for a NexGS companion
where the subject will be coding and it
should help me with figuring out server
versus client components in Nex.js and
React.
We can select the voice. You can go
either for male or female. And the
style, let's make it casual. Estimated
session. I think about 5 minutes should
be more than enough for this. So, let's
give it a shot. Build your companion.
This is the moment of truth. If I click
it, if we get redirected to the session
details, which we do, and we got back
the companion ID, that means that
everything was successful. If for
whatever reason you got redirected back
to home, something went wrong with the
setup. We've actually done a lot of
changes before testing this out. So, it
is possible that something went wrong
for you. If that is the case, please
just make sure that you have created
these two tables, that you have set up
the authentication policies right here
in Superbase, that you have connected it
properly within the code, and that you
have added the local ENVs. Once you do
all of that and if you head back over to
companions, you should be able to see a
new companion right here within our
database. So now that we have this
companion right here, it would be the
shame to only look at it within a table
format. What do you say that we actually
fetch it within our codebase and then
display it on the all companions page?
So let's do that
next. In the last lesson, we created our
first companion. in this one. Let's
display it amongst other ones within the
companion library. To do that, I'll head
over into my companion library
component. That's going to be under app
companions right here. And we can get
started implementing it by heading over
to companions just so we can see what
we're doing. But before we can actually
display the companions right here, we
have to fetch them from somewhere. And
for that, we'll create another server
action. So, we want to head over into
companion.action.ts where we have so far
just created a companion, but now we
want to fetch all the companions. Before
I do that, I want to push the code that
we have so far to GitHub. I think I
forgot to do it for the last couple of
lessons. But now, I'll do one bigger
commit, which is never a good idea.
Always split it into as many smaller
commits as possible if you of course
don't forget to do that. So, learn on my
mistakes. Always commit per feature. In
this case, I'll just do get add dot
getit
commit-m and let's try to remember what
we implemented. If I'm not mistaken, the
last commit was to implement the
homepage UI and since then we have also
developed the form and within this one I
have also implemented the companion
form. So since then we have implemented
authentication billing and database
setup as well as the create
companion server
action. And I'll just run get push and
there we go. I've just pushed this
commit. Now let's focus on creating our
second server action of the day which
will be the one that will fetch all the
companions that we have created so far.
So right below it, I'll say export const
get all companions and it'll be equal to
an asynchronous function that'll accept
a couple of props because right off the
bat, we want to make it work with
pagionation, search, and filtering. So
I'll make it accept a limit of how many
companions we want to show. By default,
it'll be set to 10. We can also accept
the current page number. By default,
it'll be set to one. as well as the
subject and the topic and all of these
will be of a type get all companions
which will just accept those exact
things. So first things first since all
server actions are run on edge which
means that there's not a consistent
connection to the server rather we have
to make a connection to the database
within each one separately. So I'll say
con superbase is equal to create
superbase client. Same thing as we have
done above. This time we don't have to
get the user ID because we're not doing
a mutation. Rather we're just fetching
the data from the database. Now I will
create a new query by saying let query
is equal to superbase dot from
companions table select all the fields
like this. But if we have the subject
and the topic in that case we want to
make the query equal to query dot I like
where we can specify within which column
we're searching for the likeness and
then we can specify the actual pattern
that we're searching for. In this case
it'll be a template string of percentage
sign subject and end with percentage
sign. This means that we're looking for
any mention of this subject within the
subject. But we can also append the dot
or to it or we can say or topic do I
like dot percentage sign topic
percentage
sign, name I like dot percentage sign
topic percentage sign because we want to
search it within the topic and the
subject. But else if we only have access
to the subject. In that case, we want to
change the query to be equal to query. I
like. And now it'll be pretty simple
because we can just copy this first
part. Query. I like. We're going to
search for the subject and search for
the pattern of subject. And another else
if. If we only decide to pass the topic.
In that case we can make the query equal
to query dot or and then we can pass
this second part only. So query
or topic I like topic name I like topic.
So we're searching for the topic within
either the name or the topic. So in this
part we're building the query based on
the name topic and subject filters. We
also need to do the pagionation. So I
will say query is equal to query.range
range in parenthesis page minus one. So
we get access to the elements on the
first page times the limit of elements
that we're showing per page and then we
want to point it to page times limit
minus one. So we start from for example
page two and then we do to page three or
in other words we show the first eight
elements and then we show another eight
for the second page. Finally, once we
have the query, we can fetch the data
from the database based off of that
query by saying const data which we can
rename to as companions. We can also
extract the error from it and that'll be
equal to await query. If there is an
error in that case, we can just throw a
new error with the error message. But if
everything goes right, we will just
return the companions that we just
fetched. Perfect. Now, if we head back
over to our companions library, we can
fetch those companions using that server
action. But first, I want to teach you a
bit about how search params work within
Nex.js. See, NexJS makes it super simple
to accept URL search params. So, to use
it, you have to turn this function into
an async function and accept search
params from props of a type search
params. Now how do you get access to the
search params? Well, you can say const
params is equal to await search params.
So you just have to await them. But now
you might be wondering what do these
params actually contain. So I will just
console log them and say params will be
equal to whatever we're console logging
right here. If you do this and open up
the terminal because we are on the
server side right now. So the console
logs are not appearing in the client
rather on the server. And if I zoom in
so you can see it a bit better, you'll
see that the params is just an empty
object. So how can we actually populate
those params? Well, by modifying them
right within the URL. So after the URL,
you're going to say question mark and
then you can say for example, subject is
equal to math. If you do that, you'll
see that now under params, there's going
to be a new subject of math given to you
within this object. Same thing if you go
ahead and say and topic is equal to
react.js. Not really math, but you get
the idea, right? So now we can accept
those prompts which I'll call filters
and I'll say con subject is equal to if
filters do. object exists then make it
filters. Else just make it an empty
string. And we can duplicate it and do
the same thing for the
topic. And now that we have the subject
and the topic, we can fetch the
companions using the server action we
created by saying const companions is
equal to await get all companions that
accepts the subject and the topic. So
now if you save it and you console log
the
companions you will see that if you
reload you'll get an empty array of
companions. Now we are getting an empty
array because we are querying it for the
subject math and then reactjs but react
isn't really a math topic. So I will
just clear out all of the querying right
now and just leave an empty fetch. And
if you do that, you're gonna get back an
array with an object that actually
contains the data for the companion we
created. Perfect. So now let's display
it right here by turning this into a
main tag. And right here I'll create a
new section with a class name of flex
justify between gap of four on max small
devices flex call just so we can show
multiple in a single column. Here I'll
render an H1 that'll say companion
library. And I'll render a div with a
class name equal to flex and a gap of
four that'll say filters. Later on we'll
display real filters right here. But for
now that'll look like this. Now we can
create a new section just below it. And
this section will have a class name
equal to companions grid. And within it
we can map over our companions by saying
companions.m mapap. And for each
companion we can automatically return a
companion card which we have already
created before. And now we can see that
we have to pass some props to it such as
the ID, name, topic, subject, duration
and so on. What I'll do instead is I'll
just pass a key because we're mapping
over an element. So the key will be
equal to companion ID and I will spread
the rest of the companion properties so
we can automatically pass it right in.
If you do that you'll be able to see a
Nex.js companion figuring out server
versus client components in Nex.js. It's
a 5minut coding lesson and soon very
very soon we'll be able to launch it.
But hey, where's the color for this
lesson? Well, to get the color, we have
to pass the color prop. But the color
depends on the topic. So, we have to
call our get subject color utility
function to which we have to pass the
companion. And then let there be color.
Perfect. And there you have it. How
simple was this? Just in the last
lesson, we have fully set up the
authentication and the database. Before,
we have created a form that allows us to
build new companions. And just like
that, we built it and now we're able to
see it right here within our companion
library. Creating SAS applications has
never been easier. And if after watching
this course you want to build yours,
well, just below this course, you'll be
able to find a complete course on
creating your own SAS application, not
following along and building Converso,
but rather building and monetizing your
own startup. But with that in mind,
let's also add filters. To create the
filters, I'll create two new
components. So, I'll head over into the
components folder and I'll create one
called search
input.tsx where I'll run rafce. And I'll
also create another which I'll call
subject
filter.tsx where I'll also
runce. Then within our page that we were
just on, instead of just saying filters
within this div, we can actually render
the search input as well as the subject
filter, which for now will just say
search input and subject filter. So to
get started with implementing them, you
just have to head over into that
component and get it implemented. To
implement it, let's first ask ourselves,
what does our input need? And this input
will need to modify the URL bar. So
it'll surely need to have access to the
current path name. So I'll say const
path name is equal to use path name. And
this is coming from next navigation. And
as soon as you use a hook or something
that starts with the word use, you
immediately need to turn this into a use
client component or whenever you want to
type something into it like an input,
then it's most likely a use client
component. Next, we'll need to have
access to the router. So, we can do the
navigation. And we can get access to
this by getting the use router from next
navigation. We're also going to get
access to the current search
params. And this is a bit different than
getting the search params within a
serverside component. There you get them
to props, but within client components,
you can get them by saying search
params.get and then you can specify
which param you want to get. For
example, in this case, we want to get
access to the topic that we're searching
for. Oh, but it looks like I got a bit
ahead of myself. First, to get the
search params, you of course have to get
them through a hook. Use search params
like this coming from next navigation.
And then you can extract a query that
you're searching
for by doing the search params.get call.
And once we get it, we'll also need a
use state snippet to modify it. So I'll
call this search query and set search
query at the start equal to an empty
string. And we're using the use state
coming from React. Now that we have
this, we can create a new div right here
and give it a class name of relative
border and border dash black rounded LG.
items center flex gap of two padding x
of two padding y of one and h fit and
within it we can display an image
that'll have a source of forward slash
icons slash search with an al tag of
search a width of 15 a height of 15 and
that's it you should be able to see a
little search icon but that's
searchsvg and Then it shows up right
here. But of course, what is this div
and an image without an input? So let's
add an input
next with a placeholder equal to search
companions dot dot dot a class name
equal to
outline-none a value equal to search
query which is the state we created and
an onchange equal to a callback function
where we get access to a keyboard event.
And then we set search query to be equal
to
e.target value of that key press that
you just pressed. Immediately we'll get
a bit of an error saying that a
component is changing from a control to
an uncontrolled state. But I believe
that shouldn't be the case because we
are only using the state. So if we
reload that error should be gone. Okay.
And now we actually have to modify the
URL bar based on what we're typing right
here. This is one of the most powerful
concepts in Nex.js because you don't
have to manage everything on the client
side rather we'll do the entire database
filtration based on what you're typing
right here directly through the URL. So
to do that I'll create a new use effect
hook where I'll set up a dependency
array and we want to recall this
function whenever the search query
changes whenever the router or the
search params change or whenever the
path name changes. And what we want to
do here is say if a search query exists
in that case we want to form a new URL
and redirect to it something like
router.push and we want to push over to
the current route and then append to it
this new topic that we have such as
topic is equal to and then we can pass
the search query something like this.
But if it were so simple, then if I
start typing it, well, you would see
that automatically we would get
redirected to the current route and
topic. But then if I cleared up that
search, it would still be there. We
would not be able to get rid of it
entirely. Trust me, I know because I
tried to do this many times. So for that
reason, while I was developing the
application for the ultimate nextGS
course, I actually created my own
package that simplifies the management
of search params in Nex.js. So, it
simply allows you to add or update query
parameters, remove keys from existing
query strings. It is fully typed and
developer friendly and works great with
React and X.js. So, let's go ahead and
follow along. I'll leave the link to it
down within the video kit. So, let's
first install it by running mpm install
at
jsmastery/youutils and then we can copy
its usage. Instead of just automatically
pushing to this route, we will first
form this new URL by using the form URL
query functionality which we have to
import from JSM utils to it. We're going
to then pass the search params which
contains everything in this case the
topic and we want to choose which key we
want to update. So I'll say we want to
update the topic field with the search
query which is the value we just typed
into that input. Then we want to call
the router.push and we want to set
scroll to false. Okay. So let me show
you how this works. If I go back, I'll
expand this just a bit so you can see
the URL bar. And if I type test right
here, you'll notice that automatically
the topic will get changed to test. If I
add a keystroke or remove it, you can
see that it is automatically reflecting
what is shown here. So if I search for
something that doesn't exist, it goes
away. And if I search for next, it is
right here because it's filtering it.
Keep in mind that the search input
itself is not doing any filtering.
Rather, it is just changing the URL bar.
And then within the companions library,
we're using those search params that the
input is updating to be able to pass
this new topic or the subject into the
get all companions, which then filters
it for us and returns the right
companions. But we're not done yet.
Here's the issue that I was talking to
you about. If I remove everything from
the search input, since we're no longer
in this if statement, you can notice
that this search query will still remain
right here.
So we have to add an else and say
if path name is equal to
forward/companions we want to remove the
keys from the URL query by doing
this new URL is equal to remove keys
from URL query which we have to import
from this utility package to which we
pass the new search params and choose
which key we want to remove. In this
case, it is the topic and then we just
push over to that URL. So if I go back
and if I type test, you can see that we
get redirected to it. But if I delete
it, it gets completely cleaned up from
the URL. And this already is amazing.
But one issue is that every single
keystroke that we make actually creates
another call to our database and to our
API, which we don't want to do. it is
putting too much pressure on our
database to give us back the data for
every keystroke. But maybe we just
wanted to type nextgs and get one single
response back and not six for every
single keystroke. So to fix this we have
to add a delay or a debounce to this use
effect and we can do that by saying
const delay debounce fn as in function
will be equal to set timeout where we
provide a callback function and then we
bring this entire if statement into this
callback function and then as the second
parameter of that function which is
right here at the end we can provide to
it the number of milliseconds of the
delay. For example, we can do 500
milliseconds. So now for every single
letter that you type like A B C D E F G,
it's not actually going to send a
request until you wait for more than 500
milliseconds. So if you're typing fast
enough, you can type the entire word
nextgs and it's only going to make one
single request to the database. Let me
show you. A B C. It made three separate
requests. But if I now type
next.js, it actually made only one.
Pretty cool, right? The more you know.
And as I said, I dove super deep into
how the search params work within modern
Nex.js applications. So deep in fact
that I decided to create this uh very
simple package which simplifies the
usage of adding and removing keys from
the URL query. and I actually created it
as an MPM package which was created as
part of the ultimate next.js course. So
if you like this course and you want to
dive much deeper into what NextJS has to
offer so you can build your applications
in the best way possible. Well, go ahead
and check out the ultimate next.js
course. Trust me, you won't be
disappointed as it is our best and most
detailed course right now and I would
dare to say that it is the best NexJS
course on the internet. And as of
recently, we turned on the 7-day free
trial. So, if you want to try it out
completely for free, just dive into it.
You can do that right now. Do it and let
me know what you think. With that in
mind, now that we have this search
input, we also want to add the filter
for the subjects. So, head over into the
subject filter component. And since this
one is super simple to the input, but
even simpler than that, I actually want
to challenge you to try to build it
right now on your own. Go to the design,
check out how it needs to look like. It
is a single chat select component which
allows people to select different
subjects. So you'll most likely have to
use our constants right here where we
have the list of subjects. There we go.
Map over them. display a new list item
or select item for every single one of
these options and then change the state
and modify the URL bar to add the end
subject is equal to the selected
subject. Try it out and let me know how
it goes. I'll provide you with a
solution within the video kit which I
will now copy and paste right here in 3
2 1. There we go. It should look
something like this. You have the
subject. You can select all subjects
which just cleans it up or you can
select a specific subject. I think all
of these are empty besides coding right
now where our nextgs component lies. So
when it comes to how we're doing the
actual change of the search params, it
is exactly the same as what we have done
with the input. We modify the key, we
push it and we remove it if all is
selected. Perfect. With that in mind,
you now have a fully functional
companion library which fetches all the
companions and you have complete sorting
and filtering so that if it doesn't
exist, you don't show it. If something
does exist like NexGS in this case, you
do show it and you can also filter out
by subject. Of course, this is not so
useful at this point in time because we
have only one companion. But later on,
once you have more or you want to search
through other people's companions, this
will be super useful. Trust me. But of
course, what is this card good for if
it's not actually doing anything? If I
click launch lesson, it just leads me to
the companion session, but it is
completely empty. So in the next lesson,
let's focus on implementing the core of
our app's functionalities and that is
actually crafting our educational
companion that will speak to us and
based off of these information that we
provided such as the title, category,
description, and so on, it'll actually
teach us what we need to learn about.
This course has been exciting up to this
point, but we're just getting started.
It's time to implement the core
functionality of our application. Off is
here. Billing is here as well. But now
we got to give something to our users.
And that something is the ability to
have the actual conversation with their
AI teacher companion. To do that, we'll
use Vapi, the voice AI agents for
developers. So, click the link down in
the description to be able to follow
along and see exactly what I'm seeing
and then sign up so you can visit your
dashboard. Once you're in, you can head
over to assistants. And in my case, it
looks like I already have one assistant
created. If you don't, you can just
immediately create a new one. But let's
see what Riley is all about. I mean,
check this out. You can configure the
behavior of the assistant to behave
exactly how you want it. everything from
choosing a provider to the model that
the provider uses, the first message and
the system prompt and more. You can also
choose the provider for the voice. Vapi
has their built-in ones, but you can
also switch to 11 Labs or Azure. And one
thing that I love about Vapi is that we
don't have to go ahead and get our own
OpenAI keys, for example, or Google
Gemini keys. We also don't have to
create an account on 11 Labs to be able
to use their text to speech. Everything
comes right out of the box. And you can
also test it out immediately by clicking
talk to assistant. Let's see what it
does. Thank you for calling Wellness
Partners. This is Riley, your scheduling
assistant. How may I help you today? Hey
bro, how are you doing? Hi there. I'm
doing well. Thank you for asking. How
can I assist you with scheduling your
appointment today? No appointments. I'm
just using you to show how great you
speak because you're not a real human.
You're an AI after all. That's right.
I'm a AI here to help with scheduling
and providing information. I'm glad
you're enjoying the way I communicate.
If you ever need assistance with
appointments or have questions about our
services, feel free to reach out. Okay,
this sounds amazing. Great. Super happy
that we tested it out and had a call
with the assistant. But now it's time to
set it up within our application. So let
me show you how simple it is. Just head
over into VPI API keys and create a new
public key. You can call it JSM converso
and just click create public token. As
soon as you do that, you can just copy
it. Head back into your application into
the env.local local and then at the
bottom you can say vapy and you can add
a new key of next public vapy web token
and you can paste it right here.
Perfect. So now how would we go about
using it within our application? Well,
it is super simple. We just have to
install the vap web SDK by running mpm
install
atvapi-ai/web. Now that it is installed,
let's head over into lib and create a
new file called vapy.
SDK.ts. And within it, we can just
create and export a new instance of VPY
by saying export const vapy is equal to
new vapy coming from vapai web to which
we need to pass the process.v nv dot
next public voppy web token and we can
add an exclamation mark to let
typescript know that we know that it's
going to be
there. So if you do that now we'll be
able to use this vap instance within our
code. First we need to get one
individual companion from the database.
So let's head over into lib actions and
companionactions.ts. Currently we're
fetching many companions but now we need
to get just a single one so we can
actually generate that
companion. So just below get all
companions let's create another server
action export const get
companion is equal to an asynchronous
function where we accept an ID of that
companion. As usual, we get access to
our superbase by creating a new
superbase client for this specific call.
And then we just want to make a call by
saying await
superbase dot from
companions give me everything. So I'll
select
everything and only give me the one that
equals ID equal to the ID that we're
passing right here through params. Now
this will give us back the data. So I
can dstructure the data as well as the
error from this await superbase call.
Once we have it, if there is an error,
in that case we'll simply return the
console.log of the
error. else we will return data zero
which is the actual companion. Now we
can head over to that companion details
page which is under app companions id
page.tsx and we can try to fetch that
single companion's details. In this
case, we won't be doing that through
search params like before, but rather
we'll be doing it through just params
which will be of a type companion
session page props which we can define
just above. I'll say interface of
companion session page props and we
accept params which is actually a
promise which will then be resolved with
an ID of a type string. Let's spell
interface properly. And now you can see
we're good. So once again what is the
difference between params indexjs and
search params? You know that search
params have the URL and then question
mark something or key is equal to the
value and then you can append one more
key is equal to another value. But with
params you have the URL and then you
have a forward slash and then you have a
specific ID or any kind of a random
value right here. So you can extract
that value on its own. You cannot
extract the key and the value. It's
already in there within the URL. And in
this case, the params will contain the
ID. Why? Because we have put it right
here within square brackets. If we put
something else right here, then we would
have to change this from ID to that
something else, which is the file name.
Perfect. It'll make more sense in
action. So now I can dstructure the ID
by calling a weight params. And since
I'm using a weight, I have to add async
right here. Next, now that we have the
ID, we can very easily call the server
action we created. const companion is
equal to await get companion. And we can
pass in the ID. And we can also get the
current user by saying const user is
equal to await current user. And that's
it. It is so simple to do that using the
functions we have already created. Now
let's do some checks.
If there is no user, we can just
redirect using the Nex.js redirection to
forward slash signin. Pretty simple,
right? No user, you can't access. Else
if there is no companion, in that case
we can redirect to
forward/companions, which is the all
companions page. But if all of that is
good and now we have actually fetched
the important details we have such as
the ID, the user and the companion
details itself, we can start focusing on
the UI of the companion session. So
let's bring back our browser and I'll
turn this into a main tag because our
entire page is right here within this
main. Next, I'll create an article. And
this article will have a class name
equal to flex rounded-ash border justify
between padding of six max md flex call.
So we can show more elements one below
another. Next within this article, I
will render a div. And this div will
have a class name equal to flex items
center and a gap of two in between the
elements within which we'll have another
div that'll have a class name of size of
72
pixels flex items center justify- center
rounded- lg on max medium devices
hidden. You'll see very soon what we're
doing right here. As soon as I provided
a style. So right here I will say style
is equal to background color is equal to
get subject color to which we need to
provide the companion subject. And it
looks like subject doesn't exist on
companion because companion is of a type
number. What? That definitely shouldn't
be the case. Oh, look. I'm returning
just an empty array of zero. And
TypeScript automatically knew that that
doesn't make sense. So, actually, what I
should have been returning is data zero.
Hopefully, you notice this. But if you
fix it, you'll notice that now it no
longer complains. But if that is now
fixed, then where's the background
color? Well, let me fix this items
center and let's console log the
companion to actually see what we're
getting back from it.
Once you do that, I'll open up my
terminal. Scroll all the way down and
reload. And you can see that we have the
subject right here, which is coding. Oh,
I think I know why we can't see it.
That's because on smaller devices, it is
hidden. But as I expand it, you can see
this little rectangle within which we're
going to display the topic icon. The
only thing we have to do here is just
say image with a source of forward
slashicons
slashcompanion.subject.svg with an alt
tag of
companion. A width of 35 and a height of
35 as well. So this one is for the
desktop devices. But now we can exit
this
div and below it create another div
that'll be visible on all screen sizes.
I'll give it a class name of flex flex-
call and the gap of two. Within it I'll
create another div. Oh, it looks like I
have to go to sleep but I will collapse
that because creating these courses for
you is what I really love doing. So now
this div will have a class name equal to
flex items center and a gap of two. And
I'll render a p tag that'll render the
companion name with a class name of
font-bold and text-2xl.
Below it, I'll render a div that'll have
a class name equal to
subject-b small devices, it'll be
hidden. And here, we can render the
companion.ubject. It also won't show on
mobile devices. Now, let's scroll a bit
down. So, basically one div down. And
then here, create a p tag that'll have a
class name of
text-l. and we'll render the
companion. There we go. Figuring out
server versus client components in X.js
and React. And now that I think about
it, I'm mentioning companion a lot. So
instead of saying companion this,
companion that, what we can do is just
dstructure those values out of the
companion. So I can extract the name,
the subject, the title. What else do we
have? We have a topic, a
duration, and we'll see if we have
something else, we can easily add it
later on as well. And then, for example,
I can say if there's no name, then point
to companions. Now, I can just remove
the word companion in front of every
other part that comes from the
companion, and it makes a bit more sense
code-wise. Perfect. Now we can go below
this div that contains the P tag and
below one more div. And here we'll
render the duration in minutes. Let's
style it a bit better by giving it a
class name of items
start
text-2XL and then max medium devices we
will hide that duration. Perfect. Now
you can think of this as just the header
for the actual AI conversation. I think
it makes a bit more sense on desktop as
it actually is a header. We can see the
topic, the title, the category, the
description, and the duration. But here
is where the magic happens. Now, we have
to develop the rest of the UI, which is
where the actual conversation with our
educational AI voice companion will
happen. So, let's do that in the next
lesson.
Let's make our app speak and teach us
things. Vap SDK will send an event every
time when the AI is speaking and we can
use that event to add nice animations to
keep our users more engaged. To do that,
we're going to use Lahi files which will
provide us some animations and allow us
to make our app that much more engaging.
You can search for something like a
sound or maybe a sound a wave and
download it to make it seem like our AI
bot is actually speaking with this
animated wave. You can choose any free
animation from here that you like, but I
actually provided the one that I liked
most right here under constants
soundwaves.json. Oh, and there's one
more thing we have to do. Since we'll
use our profile picture right here to
show that we are speaking with that bot,
we have to authorize it within our
nextgs config. So head over into
nexconfig.ts and right here you can say
images remote patterns and then an array
where you can have one object of host
name
img.clarker.com because our profile
image is stored on clerk. Now we can
create a new component where we're going
to display those sound waves and I'll
create it within the components folder
and call it companion.
component.tsx run rafce within it and
then import it within our session
details which is companions ID and we
can put it right here below this article
by just having an empty companion
component. You should be able to see it
right here at the bottom right there it
is. And now we can dive into it and
implement it. Let's start with a bit of
JSX to give you an idea of how our
structure will look like. First, turn
this div into a section with a class
name of flex flex- call and an h of 70
VH. Why? Because the header will take
the rest of the 30VH. Next, within this
section, I'll create another section
that'll have a class name equal to flex,
a gap of 8, on max small devices, flex-
call, and finally within it, we can
render a div that'll have a class name
equal to
companion section. Then within it you
can display another div which will have
a class name equal to
companion dash
avatar. And you can also give it a style
property to dynamically style it with a
background color equal to get subject
color to which we can pass the subject.
But where is the subject coming from?
Well, we'll have to pass it right into
the companion component. It's being
called right here within the companion
session. So we have to pass all of the
right props. Instead of just saying
subject is equal to subject, topic is
equal to topic and so on. We can just
spread the initial companion data. So I
will just copy this part. Still leave it
as just companion right here. And then I
will spread it below. Const. We take
this out of the companion. But what this
allows us to do is to still have the
full companion object together at the
top. So now we know that name, subject,
title, topic, and duration are right
here. So we can just do is spread the
properties of the companion. But we
still have to pass some additional. And
as I said, this will automatically pass
the following props. But we have to pass
some additional details as well which is
the companion ID which we have stored
under ID. The username which will be
equal to user do first name and we can
add an exclamation mark to let it know
that it's there. Same thing for the user
image which is under user image URL. And
I think that is it then. Now we can head
over into the companion component and
accept all of those props at the top. So
I will just dstructure them. companion
ID, subject, topic, name, username, user
image, style, and voice. Perfect. And
then we can set it to be of a type,
companion, component, props. Perfect.
And now you can see that we get this
color. Within this div, we can also
render an image that will show us when
the call status is inactive or
connecting. So, I'll render a div and
I'll give it a class name equal to CN
for class names which you have to import
and it'll always have the absolute style
as well as a transition opacity and a
duration of 1,000 for the animation. But
then based off of the status, we have to
figure out what icon do we show. So, we
need to create a new use state field at
the top. I'll use the use state snippet
to quickly create it. And I'll call it a
call status which will be a use state of
a type call status. And at the start
it'll be equal to call status inactive.
And of course don't forget to import
state coming from react. There we go.
And since we're using state of course we
have to turn this into a use client
component otherwise we're going to have
an error. Now what is this call status?
Well, we can create it as an enum by
saying enum call status and then we can
provide it different values such as
inactive is
inactive, connecting is connecting,
active is
active and finished is equal to
finished. Now, what does this mean and
why do we have those values right here?
Well, if we didn't have call
status.inactive inactive as an enum,
then you would just have a string of
inactive. But what can happen with a
string is that maybe you can just
misspell it and not know it's an error.
But if you just misspell a string,
that's not really an error, right? So
your code would not know to alert you
that you have made a mistake, but your
app wouldn't work. But instead, if you
make it into an enum and then you
misspell it right here, immediately
it'll complain saying that invive
doesn't exist on the type call status.
Did you mean to say inactive? Which is
super useful to make your code more
predictable? Perfect. We're back in
action. So now that we have this call
status, we can change it based on the
data that we get over from VPY. So I'll
create a new use effect with a callback
function and a dependency array. I'll
leave the dependency array to be empty.
So we only want to execute it at the
start. And here we want to have a couple
of functions. First function will be
called on call start which is a function
that'll simply set the call status to be
equal to call status.active.
Then we want to have another const on
call end where for now we can just set
the call status to be equal to call
status dot finished. Next we can have on
message. So I'll say const on message.
And this one we'll implement soon
because it doesn't have to change the
call status. So for now I'll leave it
empty. And I'll also do const on error
where we'll accept the error of a type
error. And then we can just
console.log that error right here.
Perfect. Now we'll tap into vap's event
listeners by saying vapy.on and make
sure to import this voppy. It is coming
from that instance that we created in
our vap.
SDK.ts and
sayon call start. So this is an event
listener and we want to simply call the
on call start function when the call
starts. Now I'll duplicate this a couple
of times. And then we're going to have
vapy.on call end. I think you can guess
what we're doing. We're going to call
the on call end function. Next on
message we're going to call the on
message function. After that we're going
to have the error. There we're going to
call the on error. It looks like this on
message is complaining because it should
be a callback function. So I'll fix it.
And I actually want to add two more
handlers. const on speech
start. Here we don't want to mess with
the call status because the status has
already been initiated. But instead we
want to set is speaking state to true.
So I'll create a new state called use
state snippet is speaking. set is
speaking at the start set to false and
then right here on speech start we can
basically set is speaking to true and on
speech
end we can set is speaking to false. So
now we can also handle those here. On
speech start call the on speech start
function and on speech end simply call
the on speech end function. Basically
what this does is vap tells our
application whenever something happened
with the AI bot and then we handle it in
our application using state and then
when we update the state well we can
then do whatever we want within the
application to show that to the user.
Now, whenever you're adding some event
handlers within the use effect, it is
very important to clean them on the
cleanup. And to do that, you have to say
return a callback function where we can
now turn those off. Just copy the ones
you have. And then simply instead of on
for all of these, simply say
vopy.off. That way, we're keeping your
app optimized. Perfect. So now our
values on speech start and speech end
and call start and call end should
actually update our two states. So we
can do something based off of those
states within our application. For
example, right here within this CN the
class names, I'll put it into a new line
so it's easier to see. We have this
default string that is always present.
But then after it we can decide if call
status is triple equal to call status
dot
finished or if call status is triple
equal to call status do inactive. In
that case we're going to give this an
opacity of 100. Else we're going to give
it an opacity of zero. And if call
status is triple equal to call
status.connecting at connecting. In that
case, we're going to give it an opacity
of 100 and
animate-pulse so that it seems like
we're connecting. And within this div,
we can display an image. And this image
will have a source of forward slash
icons slash subject. SVG with an al tag
of
subject, a width of 150, a height of
150, and a class name of max SM W- fit.
And there we go. Now we can see the
topic of our conversation. But now below
that div, let's display the L animation
to show when the status is active. So,
I'll display a div with a class name of
CN, and it'll always have absolute
transition- opacity duration of 1,000,
but only sometimes when the call status
is triple equal to call
status.active, then we want to give it
an opacity of 100. Else, it's going to
have an opacity of zero.
And now within it we can install Lahi.
It's for those animations that I was
telling you a bit about before. So just
open up your terminal and run mpm
install latty react. And here you can
just call the lahi component like this.
Import from lah react and to it you can
pass the lah ref equal to lah ref. This
is something that we have to create just
above. So head over up below the states
create a new const l ref is equal to use
ref coming from react of a type l ref
current props at the start equal to null
because we haven't yet attached anything
to that ref. Then I want to create a new
use effect and this use effect will
change depending on the speaking status.
So in the dependency array I'll add is
speaking and I'll also add the l ref and
I'll check if a lah ref exists that
means that we can do something with it
and then if we're currently speaking
then we can set the
lifcurren question mark.play so we'll
play that animation but
else if we're not speaking I'll do lahre
ref.currens currents stop to stop that
animation to really make it seem like
we're having a conversation. Let's
actually properly open this and close
it. There we go. And I'll add a question
mark right here in case the current ref
doesn't exist. Perfect. Now we can
scroll
down and under
l ref, but we also have to tell it what
it'll stop and play. And that'll be the
animation data equal to sound waves. And
we have to import these sound waves at
the top by saying import
soundwaves coming
from add
constants forward slash
soundwaves.json. It looks like I
misspelled it, but if you search for it
under constants, you'll see
soundwaves.json. Oh, it looks like I'm
missing a forward slash right here. This
is not a package. It's a file path. So,
if you do it correctly, sound waves are
now coming in. and we're displaying them
within this Lahi animation. Let's also
give it an autoplay set to false and a
class name of companion dash lahi. And
very soon once we initiate the call with
the Vapi agent, our conversational
assistant and when that changes the
status to active, it'll appear right
here. For now, let's head one and then
two divs down. And let's render a P tag.
That'll render the name of this
companion with a class name equal to
font-bold and text-2 toxel. Finally, we
need to show some information about us,
the user speaking with the bot. So, head
below this div that wraps the p tag and
create another div with a class
name equal to user dash section.
within it a new div with a class name
equal to user- aavvatar and within it an
image that'll render a source of user
image an al tag that'll render the user
name a width of about 130 a height of
130 as well and a class name of rounded
lg if you save that and expand your
screen you can now see that we have two
portions, one big one for the AI
conversational bot and one for us. But
on smaller screens, there's not really
enough space to show us as well. So, I
think this is going to be good. But for
now, I'll keep it in tablet view just so
we can see what we're developing. Below
the image, I'll also display a P tag
with a class name equal to font-bold and
text-2XL where I'll render the username.
Then we can exit this div and I'll
render a button that'll have a class
name equal to btn mic as in microphone.
And on click of that button, we'll want
to toggle the
microphone on or off. So we have to
create this function right above by
saying const toggle microphone. And
right here within it, we first need to
figure out whether we're muted right now
or not, which we can do by saying is
muted. VPY is muted. Thankfully, they
provide us this function. And then vap
set muted to be equal to the current not
is muted status. So we're basically
toggling it on or off. And I also want
to keep track of this within the state.
So above I'll create a new use state
snippet and call it is muted set is
muted at the start set to false. So now
below it we can set is muted to be equal
to not is muted. Perfect. So now let's
actually display that button right here
by displaying an image within this
button we created with a source off. If
is muted then we'll render the forward
slic
mic-off. SVG else we'll render forward
slic-on.
SVG with an al tag of Mike, a width of
36, a height of 36, and we can close it
right there. There we go. And you can
also display a P tag with a class name
equal to max small devices hidden
because there's no space for it. But if
we do have space and if it is muted,
it'll say turn on microphone. else it'll
say turn off microphone. There we go.
You can see it. And we can create
another button below this button that
will allow us to actually connect to the
call. So I'll say button with a class
name equal to
CN rounded-lg padding Y of two
cursor dash
pointer transition dash colors because
we want to change the color of the
button depending on the state of the
call w full and text white. Now within
this button we'll want to check the
current status. So if call status is
triple equal to call
status.active then we want to say end
session. Else if the call status is not
active we want to check the call status
one more time and check if it's equal to
call
status.connecting because if it is
connecting then we can say connecting.
else we can say start
session because if it's not active and
if it's not connecting then the only
last option is that we can start the
session. Now we cannot see this button
yet because the text is set to white but
to be able to see it we can add some
additional class names to the button
depending on the call status. So if call
status is equal to active in that case
we want to give it a bg red of 700 else
we want to give it a bg primary there we
go using a turnary operator there we go
and I'll also give it another class and
say if call status is equal to
connecting in that case we can give it a
class name of animate- pulse you'll see
how cool this looks like very soon. And
to this button we can also give an on
click where if call status is triple
equal to
active in that case want to call the
handle
disconnect to disconnected else we want
to call the handle call which are the
two functions we need to create. So
let's scroll
up and let's create a function const
handle call is equal to an asynchronous
function like this. And then we're going
to have another one const handle
disconnect which is going to be another
function like this. We'll implement
those soon. But for now let's deal with
the rest of the UI. And that bottom part
is actually super exciting because here
we're going to have a transcript. You
know how when you're speaking with
somebody, sometimes it's tough to
understand specific words, especially if
you're learning about something that has
new vocabulary? Well, to make your
learning even better, you'll be hearing
it through voice, but you'll also be
seeing the transcript in real time. So,
let's head below this section and let's
create another section with a class name
equal to transcript. It'll have a div
with a class name equal to transcript
dash message and no scroll bar. And
within here, we'll be able to map
through our messages. But for now, I'll
just leave this empty until we actually
set up the call. Finally, we can head
below this div and create one
self-closing div with a class name of
transcript-fade. So, we let people know
that the transcript it's fading. So we
can only see the current sentence of
what we're talking about. Okay, great.
Now let's actually hook it up by
implementing the functionalities within
these functions that we have created
above. First, we can deal with the
handle call and handle disconnect to be
able to start and end the call. First
things first, on the handle call, I'll
set the call status to be equal to call
status.connecting. And then we want to
override our assistant by saying const
assistant overrides will be equal to an
object where we can provide variable
values and those will be a subject, a
topic and the style. So our assistant
knows what they're talking about. And we
can also say client
messages give me back the transcript and
server messages will be equal to an
empty array. Then we have to call vap.st
start. And here we'll have to pass the
assistant configuration which I already
shared with you within
utils.ts. If you check this out, you'll
notice that we have this get subject
caller which we used a lot. But then we
also have this commented out configure
assistant function. We'll uncomment it
and go through it together line by line.
Don't forget to also uncomment the
imports. The only reason why I provided
this to you is because it has a lot of
text that we have to copy and paste in
order to train our AI assistant to be
the best tutor possible. But everything
else we're going to go over line by
line. So what do we have here? Well,
first of all, we're trying to get access
to the ID of the voice that we want to
use. And we actually have two voices
right here. Or you can think of it as
four. We have two male voices, male
casual and male formal and two female
voices, one casual and one formal and
that is the default one called Sarah. So
here we tap into this object of
different voices and then depending on
the voice which is either male or female
and the style, we choose the voice ID
which we want to use. Once that is done,
we're ready to set up our VP assistant.
We give it a name called companion. We
give it the first message that it's
going to say such as hello, let's start
the session. Today we'll be talking
about topic. Now that topic is a
variable value that we're passing into
the assistant. If we head back into our
ID page right here, you'll notice that
we're passing these three variable
values, the subject, the topic, and the
style. And we can use them then within
that bot.
So, I'll head back over into our utils,
and you can see that the first one we're
using is the topic. Next, we can choose
the transcriber that'll give us the text
version of the conversation we're having
or what the assistant is saying. And
then, what is super cool is that out of
the box, Vapi gives us with their 11
Labs provider. So, you don't have to
create an account on there. It just
comes pre-built in. I played with
different settings a bit such as the
stability, similarity, boost, speed, and
style, and I found those values to work
the best. Finally, we choose the model
for the actual conversation. I'm using a
GPT4 OpenAI model. And here we give it a
system role, saying that you're a highly
knowledgeable tutor teaching a real time
voice session with a student. Your goal
is to teach the student about the topic
and subject. guidelines. Stick to the
given topic, which is a dynamic variable
and subject and teach the student about
it. Keep the conversation flowing
smoothly while maintaining control. From
time to time, make sure that the student
is following you and understands you.
Break down the topic into smaller parts
and teach the student one part at a
time. Keep your style of conversation
and then either formal or casual. Keep
your responses short like in a real
voice conversation. Do not include any
special characters in your response.
This is a voice conversation. You can
think of this as sort of an AI's brain.
It tells it what to do, what to know,
and how to behave. This particular one
is working pretty good, but you can
tweak it to your needs if you want to.
And you can experiment with some more
injected variables. For now, I found the
topic, subject, and conversational style
to be more than enough. And now we are
returning that assistant. So, if we head
back over here, we can say vapy.
And we can call the configure assistant
function. And to it we need to provide
the two props at once which is going to
be the voice and the style. And outside
of it we can also provide the assistant
overrides which we have declared right
here. It's complaining a bit about the
assistant override types saying that the
client messages should be an object. But
I think this could be a possible
TypeScript error. So I'll just say ts
expect error to let it know that the
type is good. Perfect. So now we're
handling the call start. And on
disconnect we can just say set call
status to be equal to call status dot
finished. And we can initiate a
voppy.stop method which will stop the
call. So now what do you say that we
give it a shot? I'll click start
session. It says connecting and you can
see that it is blinking right here. A
will be talking about figuring out
server versus client components in
next.js and react.
Okay. Okay. Let's go ahead and get
started.
All right. Let's first define server and
client components in this context. In
React, traditionally all components run
on the browser or client side. In
next.js, JS, you also have server side
components which run on the server
before sending the page to the browser.
Does that make sense so far? It makes a
lot of sense. So, you're saying that
there's two different types of
components and they're being rendered on
the client or on the server. Exactly.
Server components handle heavy
processing and can fetch data directly
from databases. They also don't send
JavaScript to the client, so they're
faster. Meanwhile, client components
handle interactivity like buttons,
forms, or dynamic updates in the
browser. Does that sound clear so far?
Yeah, that is actually super clear.
Thank you so much. Okay, there we go. I
just ended the session and this was such
a great educational session. For my
taste, it does speak a bit too slow, but
that's because it wants to teach us in
the best way possible. So if you want
to, you can maybe tweak this to speak a
bit faster or you can change the way
that it interacts with you. But it
actually very nicely listened to my
questions and followed up with
additional relevant information on the
topic. So this is absolutely amazing.
The last thing we have to do to fully
finalize this teaching assistant is to
implement the transcript. To do that, we
can head over right here where we have
the onssage function and we can accept a
message of a type message right here.
Vapi SDKs return all kinds of different
messages during the conversation.
Information about events, errors, used
functions, and so on. But here we're
looking specifically for transcript and
saving it to our messages array. So I'll
say if message.type type is triple equal
to
transcript. And if message transcript
type is triple equal to final in that
case we want to create a new message
which will be equal to ro of message
roll. It can be either us or the bot and
the content will be equal to message.t
transanscript. And finally, we can add
it to the messages array by saying set
messages. Let's create that state field
at the top. Use state snippet of
messages set messages at the start equal
to an empty array. And the type will be
saved
messages array like this. Perfect. So
now we can set messages into an array.
add this new message and spread all the
previous messages. Now when you want to
set the state using the previous version
of the same state, you get access to it
as part of a callback function called
prev. So we spread the previous state
and we add a new message. So now on
message we're adding this new message
and right here below where we have the
handle call that's where it makes sense
to only provide us with the transcript
messages. And then finally we can head
under the JSX part where it says
messages and we can get access to the
current messages within the state by
saying messages do map where we get each
individual message and for each message
we can open up a new function block and
check if message roll is equal to
assistant. In that case, we can return a
new P tag that'll have a key equal to
message.content and a class name
of max SM
text-s. And here we can render the name
of the assistant by running the
name.split based on a space and only
taking the first part of it. But let's
fix this issue where I missed a
parenthesy right here.
And also we need to close the split
right here. I'll expand my editor to the
full view so we can see it a bit more
easily. So what we're doing is we're
splitting the name based on the space to
only get the first name. And then on it
we want to call
thereplace where we're going to replace
any dots or commas globally across that
string with an empty string like this.
So I'll put it into multiple lines just
so it's easier to see.
Name.split.replace
replace and then finally we end it right
here. Now this is just the name so we
have to also say colon and then render
the
message.content. This is if the
assistant is speaking but if we are
speaking then I'll say else. I'll also
create a p tag with a key equal to
message.content and a class name equal
to text- primary on max small devices
text-sm. And I'll make it say
username saying
message.content like this. Oh, and since
we're in JSX, we actually have to return
this like this. And then at the bottom,
we have this transcript fade, which is
just a div with a gradient background,
which moves to transparency, creating
the illusion of a fading text. So, I'll
show it to you in action very soon. So,
with that in mind, we have everything we
need to test out our assistant. And the
only way to do it properly is by going
full screen and starting a session. We
actually already tested this one out.
So, what do you say that we create
another? I'll head over onto my
homepage and create a new companion. Hm.
What should we learn about today? Let's
dive into some maths. I'll give it the
name of
Matthew the math
expert. and it should help us with
understanding the concept of infinity in
mathematics. I'm going to use a female
formal voice and the session should last
well let's do it 2 minutes just to see
how much we can learn in about 2
minutes. I'll click build your companion
and we automatically get redirected to
it in the math section. It says Matthew
the math expert and we can start our
session. So let's give it a go.
Hello. Let's start the session. Today
we'll be talking about understanding the
concept of infinity in math. Sounds
good. Let's go. Great. To start off,
infinity is a concept that describes
something without any limit. In
mathematics, it's not a number in the
traditional sense, but rather an idea
that represents boundlessness or
endlessness. Would you like an example
to make this clearer? Yeah, I I sure
would.
All right. Imagine counting numbers 1 2
3 and so on. You can keep counting
forever and there is no end. That
endless quality is what we refer to as
infinity. Does that example help? It
does, but I want to dive a bit deeper.
Perfect. Let's go a bit deeper. In math,
infinity is often used to describe
things like unending sequences or sizes
that are unmeasurably large. But here's
the key idea. While infinity is endless,
it is not a number you can calculate
with like five or 10. It's more of a
concept. Do you follow? Yeah, I do
follow. I'm guessing that you're being
very brief because I gave you only two
minutes to teach me this, right?
Exactly. I'm keeping explanations
concise since we're working with limited
time. Would you like me to focus on any
specific aspect of infinity? No, I think
this is it. We can end the session here.
Thank you. You're welcome. I'm glad we
could cover it. Have a great day.
Perfect. Well, this was a very quick
one, and I immediately noticed how the
AI assistant tweaked its explanations
based on the time limit we gave it. This
is perfect. Now, if I start the session
one more time, I want to see if I can
turn on or off my microphone. Let's
start the session. Today, we'll be
talking about understanding the concept
of infinity and we do get an issue right
here.
All right. What issue are you facing?
Does it relate to infinity or something
else? No, no, it's something else. I'm
fixing the way that I can mute myself
when speaking with you.
Okay. Let me know once you're ready and
we can begin with the topic.
Perfect. I think the issue is just with
the key that we're providing to the
message. So if we head back over here
where we're providing the key to the
message, we can also get access to the
index of the message. And then instead
of a message.content, we can provide the
index right here as both of these keys.
So now if we go back, we can try to turn
on the mic or turn it off. But it
actually doesn't work because we haven't
yet activated the VPY session. It says
VPY does not exist. So to fix this, I'll
make this button disabled if the call
status is not equal to call
status.active. So only if it is, then it
should be enabled. Oh, and I just
noticed that I passed it over to a P
tag. It should actually be passed over
to this button. Now, if you head back,
it's not going to do anything if you
click on it, if you're not within the
session. But if you start the session,
hello. Let's start the session. Today,
we'll be talking about understanding the
concept of There we go. There you have
it. We have a fully functional AI
teaching assistant teaching you about
anything you want to learn about. I got
to say, this is out of this world. just
the ability to go ahead and build your
voice companion, somebody that you can
speak with about anything you want to
learn about. And it's not just like
somebody's reading things out to you
from a textbook or you're seeing them on
the screen. You can have an actual
conversation with the instructor, have
follow-up questions, or just say that
something is unclear or maybe say that
you're bored with the current
explanation. And they're not going to
get mad. They're going to give you
another better explanation. They're
going to cater their education exactly
to your learning
style. And based off of these two
companions we have tried so far, I got
to say it is working perfectly. This was
one of the longest lessons in the
course, but at the same time the one
that allowed us to focus on all the core
functionalities of our app. I hope you
liked
it. Now that we've implemented all the
major apps functionalities, there's a
lot of stuff that can break. So for that
reason, to make this app truly
production ready and to make sure that
it doesn't break for users when they
actually want to test it out and if it
does break so we can very quickly fix
it, I'll teach you how we can integrate
Sentry into your app. So if and when the
code breaks, we can fix it faster. Click
the link down in the description to be
able to follow along and see exactly
what I'm seeing. And if you do that,
you'll get 50,000 free errors, which
should be more than enough to test with.
So just create your account and once
you're in you'll be redirected to your
dashboard. As you can see I'm using
Sentry for many of our projects
including the JS Mastery Pro platform.
Now you could go ahead and click create
project on top right but what I prefer
to do is just take your current
organization URL and add on boarding.
This will redirect you to a customized
sentry on boarding. So go ahead and
click start. And now you can choose the
platform that you want to monitor. In
this case, it's super easy. We'll go
with
Nex.js. Next, you'll be given the
automatic configuration string that you
can just copy. Head back over into your
application and paste and press enter.
It'll ask you whether you want to
install the Sentry installer. So, just
say yes, Y, and then proceed with the
update. A new browser window will appear
asking you to authenticate and to choose
your project. So, just create a new one
called Converso. And unfortunately, I
got an error saying that there is a new
log right here within our codebase.
Sentry installation error that says that
we could try to use force to make it
work. Now, we can rerun this command,
but I'll remove the last part, which is
the d-p project. So, it still allows us
to choose the other one within our
organization within the browser, but
I'll add the d-force at the end. I'll
say yes, continue, and log me into my
account.
I'll select JSM Converso as my project,
but I'll add the D-force at the end. And
I'll start with pseudo in case it needs
some additional permissions in order to
set it up within my workspace. So, I'll
run it and enter my password. It's going
to ask us whether we want to continue.
Say yes. And we already have an account.
So, it'll open it up within the browser.
And we can choose our project. Now, back
within our terminal, it looks like it's
installing it. And it's asking us a
couple of questions. Do you want to
route sentry requests in the browser
through your NexJS server to avoid ad
blockers? Well, this can be super
helpful if you want to have very
detailed tracking, but it can increase
your server load and hosting bill. So,
for now, I'll say no. Do you want to
enable tracing to track the performance
of your app? I'll say yes. Do you want
to enable session replays to get a
video- like reproduction of errors
during a user session? Definitely. Do
you want to create an example page?
Well, yes. Let's do that as well.
There's a little note on older versions
of Nex.js. I'll click I understand. It's
going to ask us whether we're using
CI/CD tool. So, select yes. And now it's
going to give us the token that we can
now copy. And we'll be able to add it
within ourv. So, before I click yes,
I'll head over to
my.env.local and I'll add a sentry API
key.
by saying sentry o token and now I'll
say yes continue I configured it perfect
you can validate your setup by
restarting your developer environment
and visiting the sentry example page so
let me do just that I will reload my app
and I'll head over to sentry example
page there we go I think this is the
only time in our career where we're
going to purposefully throw an error
within our application so I'll say throw
sample error there we It was sent to
Sentry and we can see it right here.
Sentry example front end error. This
error is raised on the front end on the
example page. Now to finish up with the
onboarding, you can click view sample
error and your UI might look a bit
different from what mine looks like. But
don't worry about that. You can still
head over to your projects, find
Converso, and after some time, you
should be able to see one front-end
error and one API error. So now you can
click on the front end error to explore
it and just take a look at the amount of
details we're getting back about the
user that caused that error. We can see
where that error was caused. We can see
under which environment. We can check
out the browser. It was Chrome, the URL,
the environment, and that's only where
we begin because you can also see the IP
address that caused the error and even
the version of the operating system.
Next, you can see the exact stack trace
that led to the error and even a session
replay, allowing you to see exactly what
your user was seeing when the error
happened. And here it is. Then you can
explore the breadcrumbs leading to that
error and even what was showing in the
console at the time that the error
happened. The amount of details that
you're getting right here is crazy. And
if you want to head over to the API
error, you're going to get a completely
different set of data points such as
that this server was being ran on node
and you can see exactly from where in
the code it was triggered. Alongside
issue tracking, you can also see your
page load times for your applications as
well as the API latency, the web vitals,
so you can improve your loading times,
all the network requests that happen
within your application and how long
they took, and even special insights for
backend, where you can track exactly how
many users are making which requests and
whether they're working or not working.
Okay, Century can do a lot of stuff, but
what does this mean for you? Well, it
means that as soon as somebody goes into
your application and breaks something
that you didn't anticipate they're going
to be able to break, you'll immediately
know that a random user somewhere across
the world broke something with your
application and is having difficulties
without needing to send them an email
and ask them what they did because let's
be honest, they can never tell us
exactly what they did. You'll know
exactly what happened and you'll be able
to fix it quick and push a fix to
production. Therefore, improving your
users's experience and most importantly
not making them head over to their
account billing and cancel their plan.
That's why Sentry is a must on any
modern SAS application where you want to
increase your customer satisfaction and
keep them subscribed for a long time.
And if you go back to the app, there is
nothing else that has to be set up.
Sentry added their own setup which is
now tracking your application, making
sure that it is error-free. Super simple
yet so
crucial. Now that we've implemented our
app's primary feature, which is the
conversation with the AI coach, well, we
have to store that conversation into the
session history so that later on we can
display it right here on our homepage
under recently completed sessions. So
head over into our details page and then
into the companion component here under
the first use effect when we ended the
call we also want to add it to the
session history. So we have to do that
right here add to session history and
then specify the companion ID that we
want to add to that history. So we have
to implement this new server action
within lib actions companion actions and
then below get companion I'll create a
new one export const add to session
history. It'll be equal to an
asynchronous function that accepts the
companion ID of a type string. Within
here we first need to get access to our
currently logged in user. So I'll say
user id is equal to await o coming from
clerk. Next we want to create an
instance of
superbase. So I'll say create superbase
client. And then we want to fetch the
data from the current database history
by saying const dstructure the data and
the error and make it equal to await
superbase dot from
session_history dotinsert. And we want
to insert a
companion
ID of
companion ID and user ID of user ID.
That way we can get the session history
exactly for that user and that
companion. Next, if there is an error,
in that case we can just throw a new
error with the error message. But if
there's no errors, we can just return
the data about that session. Now, after
we add the session to the history, we
also have to be able to fetch it. So
I'll say export const get recent
sessions and that'll be equal to an
asynchronous function that accepts the
limit by default set to 10 and it also
creates a new superbase instance by
saying create superbase client and we
can try to fetch some other data and the
error by saying await
superbase dot from session
history table. I only want to search for
companions with this specific companion
ID and I want to return everything for
it. And then we can also order it. So
that order by created
at and we can do it not in an ascending
way. So I'll say ascending to false
rather it'll be descending from newest
to oldest. And I'll limit it to our
current limit which is set to 10. Then
again if we have an error we can simply
throw that new error with the error
message but if we have successfully
fetched the companions we can return
data map where we get each individual
companion but we have to dstructure it
because we have the data which contains
the ID the companion ID and the whole
companion but since we just need the
companion we can just dstructure it and
return the companions.
I'm missing an S right here. Perfect.
So, this is getting all the recent
sessions for a specific companion ID.
But now, we also need to get all recent
user sessions. So what I'll do is I will
duplicate this entire get recent
sessions function and I'll rename it to
get user sessions where instead of the
limit we will accept the user ID of a
type string and also a limit of 10. We
will again create a superbase client and
fetch data from session history. We will
select the companion ID, but we will
only do it where the EQ user ID matches
the user ID that we're getting through
props. And everything else will be the
same. Perfect. Now get back to our on
call end within the companion component
and uncomment what we just put here and
make sure to import the add to session
history coming from our actions. Now,
back within our application, let's have
a session with one of our companions.
I'll go with Matthew. And now, start a
call and wait for the AI to respond to
you at least once.
Hello. Let's start the session. Today,
we'll be talking about understanding the
concept of infinity in math. Okay. So,
we're doing this so that the
conversation can register on Vap's end.
Then, we can end the call by clicking
the end session button. And now it
should have been registered and it
should have been added to our session
history. You can check that out by
heading over to Superbase for JSM SAS
project. You'll see that we have two
different tables. So now head over to
session history and take a look at this.
We have one session by this user with
this companion. That's everything we
need. But now we want to show this data
somewhere where it matters. And that's
going to be our homepage. So, head back
over to app page.tsx, which is our home,
where we're currently rendering the fake
data. Instead of rendering this fake
data, remove these two additional
companion cards. And what I want to do
instead is just fetch all the companions
and the recent sessions by saying const
companions is equal to await get all
companions to which we need to pass a
limit of just three because we're
showing the three companions at the top.
And then we can also fetch the recent
sessions companions by making it equal
to await get recent sessions. And to it
we can pass 10 as the limit. Make sure
to add async to this function because we
are actually waiting for these pieces of
data to come back from the server. And
now we can put it to use by mapping over
our companions and displaying a
companion card for each one. So say
companions dom and then for each
companion automatically return a new
companion card. So I'll actually use
this one with a fake data. But I will
clear that fake data right here and
simply spread all the properties of a
companion. We also have to give it a key
since we're mapping over it which is
going to be companion ID. And for the
color, we have to pass it separately
because we have to call the get subject
color and then pass the companion. So it
can generate a color based off the
subject. Now if you get back to
homepage, you'll see that we have two
popular companions. And now we have to
scroll down and fetch the recent
sessions as well. We can do that very
easily by passing the real recent
sessions companions to this companions
list which we already created which will
then put them all in a table. So if you
head back you can see that we only have
one recent session which is exactly
right. Now just to test whether it's
working properly let's add one more
companion and then have a conversation
with them. This time let's learn a bit
about science. I'll call it science
tutotor. And we want to learn about the
most
interesting things in science. A bit
generic, but hey, let's see what it
does. We'll go with a casual style and
let's make it
15-minute. I'll start the session.
Hello. Let's start the session. Today
we'll be talking about the most
interesting things in science. Okay.
What do you have for me?
Let's start with black holes. There are
regions in space where gravity is so
strong nothing, not even light can
escape. Fascinating, right? Okay. Yeah.
Yeah. Black holes are super interesting.
So, I would like to learn a bit more
about that. But now I got to demo the
app to people learning. So, let's see
what do we have. Yep, the new science
tutor had been added right here. And the
recent session has been added to the
table as well. Perfect. Now in the next
lesson we can focus on the my journey
tab or in other words the profile
page. Let's implement our profile page
where the currently logged in user can
see how many sessions they've completed,
how many companions they've created, and
they can see a list of their most recent
lessons. To implement it, we'll have to
modify our profile. So let's first
implement an action that would allow us
to fetch the companions that this user
has created. Once again, it'll be very
similar to these last two functions. So,
let me just duplicate it once more and
let me rename it to get user companions.
It'll accept just the user ID. We create
a Subbase client and we make a fetch not
to the session history but to the
companions that this user has created.
From them, we can select everything that
we can get back. So just select and the
EQ will be equal to author which matches
the user ID because we only want to get
the companions that that user has
created. We check for the errors and if
there aren't any, we return the data.
Now to show these companions, we will
use the accordion component from Shaten.
So let's go ahead and install it. Within
our terminal, simply run MPX shhatsen at
latest add
accordion and use legacy pure deps. Once
it gets installed, head over to our
profile page which is under my journey.
Create a new main
page with a class name equal to on ming
devices
W34 and then create a new section right
within it. Below this section, we want
to copy and paste the usage of the
accordion. So, first I'll get over the
imports and then I will copy the actual
usage part and save it. Now, for some
reason when I rerun the application, I
got this cannot find open telemetry core
package which I believe Century is
using. So, we have to go ahead and
install it. So, just run mpm install and
then paste that package name right here
if you're using it as well. If you
install it and run the application,
it'll spin it up so we can head over to
the my journey page. And you can see
this accordion. But now let's focus on
the rest of the profile page. And that
first requires us to fetch the user
details. So I'll say const user is equal
to await current user coming from clerk.
And to be able to use that, we have to
turn this into an async function.
Next, if there is no user, they cannot
see that page. So, I will simply
redirect over to forward/signin. After
that we want to fetch all of the
companions that belong to that user by
saying await get user companions to
which we have to pass the user ID and
also the session history of that user
which we can get by saying
await get user sessions to which we can
pass the user ID. Thankfully we have
already created all of those server
actions that give us that data. Now we
can style it further by giving this
section a class name equal to flex
justify dash between gap of four on max
small devices flex column and items
center within it we can render an
image that'll have a source of user
image
URL and an al tag of user
dot first
name a width of a 110 and a height of
110 as well. And let's fix this class
name. If you do this, you should be able
to see our profile photo below the
image. I'll render another div with a
class name equal to flex flex- call and
a gap of two. And there we want to
display an H1 that'll have a class name
equal to
font-bold and
text-2XL. There we want to render the
user first name as well as the
user.ast name. And below the h1, we can
render a p tag that'll have a class name
of
text-sm
text-muted-foreground. And here we can
render the user email addresses
zero. So now we have both the full name
and the email. Now after this section I
also wanted to have a div that would
have a class name equal to flex a gap of
four and items center and then we can
put both the image and this div
containing the username and the email
within it. So that way we can achieve a
better layout. Now let's go two divs
down still within the section and let's
create another div with a class name
equal to flex and a gap of four in
between the elements with another div
with a class name equal to border
border- black
rounded
lg padding of three a gap of two flex
flex- call so they appear for one below
another and hash- fit so we can fit it
within its current height. Within it,
I'll display another div with a class
name of flex gap of two and items center
within which I'll display an image with
a source of
for/icons/check.svg with an al tag of
check mark, a width of 22, a height of
22, and we can close it right here.
What does this check mean? Well, we'll
display a check for every single lesson
that we have completed. So, below this
image, I'll display a P tag with a class
name of
text-2XL font-bold. And I'll render the
session
history.length to see how many sessions
we've had. So, in this case, it is two.
And then below this div, we can render
another div and say lessons completed.
Two lessons completed. Perfect. Now I
will duplicate this entire div with the
border all the way to its ending div.
And I'll paste it below. This time we
won't show a check, but rather we'll
show a cap SVG. And this one will show
not a session history.length, length,
but rather the
companions.length. So we can see how
many companions has this user created.
So I'll say companions created. And now
we have two lessons completed and three
companions created. This will be super
useful for tracking whether our users
have crossed their billing features. For
example, with a small plan, maybe they
can only create three companions, but if
they upgrade, they can create five. Or
maybe unlimited. Who knows? That's the
exact point of SAS apps. You're the one
to define what will be available within
a specific billing plan. And finally, we
have this accordion below the section
with a type of
multiple not collapsible where the
accordion item will be set to recent.
Accordion trigger will have a class
name equal to
text-2XL and
font-bold. and it'll render the recent
sessions. Then under accordion content,
we can simply rerender the companions
list which we created before. Pass to it
a title of recent
sessions and also pass the companions
equal to session history. If we do that,
automatically we'll be able to render a
nicel looking list of recent sessions.
Let's also render a new accordion item
just below this one and give it a value
of companions with an accordion trigger
that'll say not recent sessions but my
companions and then we can also display
the number of companions by saying
companions.length. You know how
typically you can see the number before
you click on it. So for example in this
case you have three. And now below the
accordion trigger, we can display the
accordion
content within which we'll just render
the companions list component this time
with a title of my
companions. Companions equal to
companions that this user has created
and save it. So now you can see recent
sessions as well as my companions. But
you can notice that the title always
says recent sessions right here in the
companions list. And that's because we
haven't modified it right here where it
says recent sessions. Instead, we should
have used the real title that we passed
to it. So now it says recent sessions
and my companions. It looks great on
mobile, but when expanded, it looks even
better on desktop because you can see
all of your recent sessions and
immediately get back into them by
clicking on them. or you can just view
the companions you created that you
maybe want to revisit. And with that in
mind, we now have a full profile page
where we can see the number of lessons
completed and companions created. But if
you remember properly, back on our
subscription page, we listed a specific
number of sessions and companions that
each user can create at a specific point
in time. So now is the time that we
enforce those
rules. We allowed our users to be able
to authenticate into our application. We
allow them to create sessions and
companions and we are tracking the
number of the lessons completed and
companions created. But now is the time
that we actually enforce our billing
options. See on our subscription page,
we have three different plans. Instead
of having this be a div, I'll turn it
into a main tag so we get some
additional spacing around it. And I'll
zoom it in so you can see it better.
Under the basic plan, a user should only
be able to create three companions and
have 10 conversations with these three
companions. If we take a look at our
current journey, we are almost there,
right? We should not be able to create a
fourth companion. But if we now go to
home and try to create it, well, it
actually redirects me to the companion
builder and I would be able to create a
fourth one. Sure, right now I am a core
learner. But to show you how we should
apply these limits, let me switch back
over to the basic plan. Since clerk
billing is still in beta, it is possible
that sometimes you'll get this internal
server error. But this didn't happen
super often and I'm sure that in no time
this will be fixed. So very soon we'll
switch over back to the basic plan. But
in the meantime, let me show you how we
can enforce those limits within our
application. So if the user crossed a
specific limit, then we point them to
upgrade to the next bigger plan. Back
within our code, head over to the
companion.actions.ts file. And at the
bottom, we'll implement a new server
function called export const new
companion permissions.
It'll be equal to an async action like
all the other ones. Then within it, we
have to get access to the currently
logged in user ID as well as to the has
method coming from clerk which will be
equal to await o on clerk docs for clerk
billing for B2C SAS applications which
is exactly what we are trying to
achieve. We have already enabled billing
set up our payment gateway created a
plan and added features to that plan. We
have also created a pricing page, but
now we have to control access with
features and plans. And that is
something that is very hard to do within
your SAS apps because there's so many
features, different plans, and you have
to monitor which user belongs to which
membership plan and which features does
that membership plan cover. Thankfully,
Clerk makes it super simple using the
has and protect methods. The only thing
you have to say is has access to this
specific plan or has access to this
specific feature. Let me show you how we
can implement it within the code. I'll
also get access to the current superbase
instance by saying superbase is equal to
create superbase client and by default
I'll set the limit to be equal to zero.
But then using the has functionality I
will check whether the user has access
to the pro plan. Pro plan is our biggest
plan which offers the creation of
unlimited companions. So in this case I
will just return true because this user
can create as many as we want. But else
if the user has access to a feature
called three companion limit in that
case we want to set the limit to three.
And I'll add another else if and check
if they have access to the 10 companion
limit feature. In that case we'll set
the limit over to 10.
And if you're wondering how did I come
across these names three companion limit
and 10 companion limit with underscores?
Well, those have to match exactly with
the features that you have within your
clerk billing dashboard. So, head over
to your clerk dashboard, configure, and
then scroll down to billing subscription
plans. Head over to the basic plan and
find the three active companions
feature. And in this case, looks like
the slug and this slug has to match this
one right here. In this case, they're
not matching. So, let's fix it. Three
companion
limit and save. If the slack doesn't
match, it'll not properly recognize the
amount of credits that the user has. And
let's also head over to the core learner
and set the 10 active companions to say
10 companion limit update and save.
Perfect. Now we can get access to the
amount of companions this user has
created with the database by saying
const dstructure the data and the error
is equal to await
superbase dot from companions do select
id and give us back the exact count only
return those where the author is equal
to the current user ID. Then if we get
back an error then we can simply throw a
new error with an error
message. Else if there aren't any errors
we can get access to the companion count
that we have created so far which is
under
data.length. And finally, if the
companion count is greater than or equal
to the limit that we have set within
clerk billing, then we will return
false. Else we will return true, meaning
they can or they can't access that
feature. And now that we have created
this new function that checks for the
user's ability to create a new
companion, we can now head over to the
new companion page that is right here
under companions new. And I will call
this server action right here at the top
by saying const can create
companion and make it equal to await new
companion permissions. And then based
off of this variable, we can either show
the entire article with a companion
builder right here by using a turnary.
So if can create companion, then we show
this article same what we have been
showing before to the users that were
actually able to create them. Or if we
can't create anymore, we can show a new
article with a class name equal to
companion limit. And we can close it
right here where we can render an image
with a source of images limit. SVG with
an AL tag of companion limit reached, a
width of about
360, and a height of about 230. And
below it, I'll render a div that'll have
a class name equal to CTA badge, and
it'll say upgrade your plan. So that we
eventually get to a page that looks like
this. Upgrade your plan. you reached
your limit. Upgrade to create more
companions and premium features. And
then a button that will lead us to
Clerk's pricing page. So below this div,
I'll create an H1 that will simply say
you've reached your limit. Then below
it, I'll create a P tag that'll say
you've reached your companion limit.
Upgrade to create more companions and
access premium features. And then below
it, I'll render a
link coming from next navigation with an
href pointing to subscription and a
class name equal to btn primary with a
full width and justify center. So we can
see it right here in the center of our
screen. And this link will simply say
upgrade my
plan. Perfect. So now just to be able to
test it, I will head over to new
companion permissions. And since I'm
currently on the core plan, I will
change this 10 companion limit to about
let's do three because I have created
three so far and I should not be able to
create more. So if we head back over to
our application, head over to build a
new companion, you can now see companion
limit reached. It looks like our image
didn't render properly. That's because I
missed a forward slash right here. There
we go. Upgrade your plan. I can even
zoom out. And it looks like I missed a
btn class right here on the button.
There we go. So now I am blocked for
creating more companions. And what I can
do instead is just navigate over to the
subscription, which is when I can switch
to another plan and then be able to
create more. For the time being, I'll
just go back and switch this limit back
to 10 for the core users. So if I do
that, since I'm a core learner right now
and I have only created three
companions, I should be able to go back
and create a fourth one. This is working
like a charm. And for every new user
that it's
created, all of this will be managed
automatically for you without you having
to think about different permissions,
plans, and features. The fact that the
user account is directly connected to
the billing which is then connected to
the features of that plan is just crazy.
And now that the clerk team implemented
this, it seems like it was a plan all
along because these features tie
together perfectly. And at this point, I
think that we can call this application
a true SAS app.
Now, you've probably noticed that the
Figma design contains these bookmark
icons at the top of every card. It
allows you to add it to your companion
library and then access it very simply
by seeing only the companions that you
have bookmarked. A pretty cool feature
that you can maybe add to a pro or elite
plan. But this is a feature that we
haven't implemented yet, and that's for
a reason. It's a task that I have left
for you to do to test how much you have
learned during this course. Of course,
I'll provide the final code and if you
get stuck on this video kit somewhere
near the bottom, I'll also provide you
with some hints on how you can make it
happen. But take a second and try to
implement it on your own first. You can
do it.
Now that we're done with our app, the
last remaining step is to deploy to the
internet so that everyone can see it and
actually pay for your features. To do
that, you first have to create a new
repo on GitHub. If you've been following
carefully, then you know that we have
already done that before. Oh, look, some
of you have already given this repo a
star. So, go ahead and push your code to
GitHub by following the steps that you
get when creating a new repo. Once your
repo is up, head over to versell.com and
create a new project. If you published
it recently, it should appear right at
the top. So, just click
import. It'll automatically recognize
that you use Nex.js to publish it. And
just before we deploy it, you can enter
your environment variables right here.
So, head over to your
env.local, copy all of the variables
together, and just paste them into the
first field, which will automatically
generate them right here. and then click
deploy. This process will take about a
minute. So, let's pause right here and
I'll be right back. After about 2
minutes, we'll just get a little warning
that says that some of our TypeScript
types are not met. Thankfully, a fix for
this is super simple. You just have to
head over to your Nex.js config and
above images say
TypeScript and then just say ignore
build errors set to true.
We've used TypeScript on this entire
project and we've been very careful of
the types, but it is possible that one
or two
slipped. So, just to make sure that our
build doesn't fail like it did, we can
just add this little fix right here and
then type get add dot get
commit-m fix
typescript and then get push. If you
head back over to your projects, you'll
notice that this will automatically
re-trigger a deployment on your SAS app.
So, we'll have to wait two more minutes.
And hopefully this time it builds
properly. Oh, the second time the error
is still here. And it looks like it is
TypeScript related, but it is also
ESLint. So the same thing that we done
before within our next config, we have
to do it again but this time for eslint
by saying eslint ignore during builds
set to true. And for typescript it is
ignore build errors set to true. So if
you fix this, we can one more time do a
get add dot get
commit-m fix eslint and then get
push which will once again for the third
time re-trigger a
deployment. And hopefully third times
the charm. And there we go. Our build is
now ready. If we go to project overview
and click visit, you can see that we're
now live on the domain name that
Verscell has given to us. So let's go
ahead and try to sign in. I'll continue
with Google. This time I selected a new
account and you can see that this
account is still on a basic plan. I can
of course use the companions that other
person has created and speak with them
and learn from them. But I can also
build my own three companions. So let's
give it a shot with one. I'll actually
name this companion Adrien and I'll say
coding and I'll say teach me how to land
a web developer job. The voice will be a
very casual male and I'll set the
estimated duration to about 15 minutes.
Just like that, a new companion has been
created and we can speak with it.
Hello. Let's start the session. Today
we'll be talking about teach me how to
land a web developer job.
Well, yeah, I will teach you that. And
to everybody watching this video, I
think we have done an amazing Converso
application and you are part of that SAS
app. What do you
think? It sounds like you're working on
something exciting. So, let's dive into
landing that web developer job. First
things first, do you have a portfolio
ready with your best work? Okay, you can
see that Adrian knows what he's talking
about. A portfolio is a must-have for
any developer and we have many
portfolios as part of JSM Pro where you
can generate a full learning path
catered to your preferences and then
ultimately head over to landing that
developer job at the end. But since you
came to the end of this course which is
all about SAS apps here you have built
and developed a learning management
system SAS with AI but there are many
different SAS applications that you can
create. So for that reason I created a
pro course called build and launch your
SAS app in seven days. And already I've
added tons of different lessons on how
you can approach creating and monetizing
any kind of an idea that you have. The
link is down in the description, so go
ahead and check it out. With that said,
thank you so much for watching and for
coming to the end of this amazing
course. I'll see you in the next one and
have a wonderful


TRANSCRIPT_02
So, you want to become a full stack
developer. Not just someone who knows
what React is, but someone who can
actually build polished productionready
apps that companies love to see in
portfolios. Well, you're in the right
place. Hi there, I'm Adrian and welcome
to a brand new 12-hour course where
you'll build and deploy not one, not
two, but three realworld full stack
applications. Each project is designed
to sharpen your skills, build your
confidence, and move you one step closer
to getting hired as a developer. We'll
kick things off with a React 19 crash
course where I'll break down what React
really is, why it's so popular, and
exactly how it works under the hood.
Then I'll take you through its
fundamentals, JSX, core syntax, hooks,
and even new React 19 features, all
while building a modern movie app with a
trending feature to see the hottest
movies based on a dynamic algorithm. By
the end, you'll have a working app and a
solid React Foundation. Then you'll use
this knowledge to develop a full stack
serverless data management solution.
store it. A sleek app with
functionalities inspired by those of
Google Drive, Dropbox, and One Drive. By
developing it, you'll learn passwordless
OTP authentication, file uploads,
previews, renaming, sharing, Google
search, responsive UIs, clean
architecture, and all the back-end logic
to make it rock solid and scalable. This
isn't a toy app. It's a productionready
project that screams, "I'm hirable." And
lastly, you'll take things further and
get hands-on by developing an AI travel
agency admin panel where you can view
customer analytics, trip insights, and
generate new trips using AI. Manage
bookings, profiles, trip details, real
world admin tasks, all within a
dashboard. Sounds pretty good, right? a
complete learning journey where you
begin with the fundamentals, progress to
building a full stack application and
finish by deploying an advanced admin
panel with AI features. And if you're
worried it's too advanced, don't be.
I'll walk you through every step. All
you need to get started is a bit of good
old JavaScript. And if you're not quite
there yet, check out the complete path
to JavaScript mastery course and come
right back here to build it. Throughout
these courses, we'll use the most
advanced tech that you can find right
now. React 19 and React Router V7 with
latest hooks, layouts, and routing
patterns. NextGS15 with server and
client rendering, server actions,
revalidations, SEO, and more. And we'll
use AppRight, the star of this entire
course for everything backend related,
authentication, databases, storage, and
serverless functionalities. Stripe for
seamless payments integration.
Typescript for safe and cleaner code.
Tailwind CSS and chaten for responsive
polished UIs. An interesting component
library called Syncfusion for dynamic
charts and dashboards. Sentry for air
tracking and monitoring. And Vit for
blazing fast dev experience. And if you
want to go deeper on Nex.js, you can
also check out our ultimate Nex.js
course on jsmastery.com with 40 plus
hours of advanced content. But for now,
let's focus on this course. You'll watch
a React crash course and then build
three separate advanced applications.
For each one of these, you'll get a
completely free open-source codebase,
completely free Thigma UI kits, so you
can refer to it and build it on your
own, deep dive guides for Nex.js,
Tailwind, and more, and access to our
private Discord for support and
feedback. All of this is 100% free
inside the video kits down below. So,
with that in mind, let's say that you're
not just watching another tutorial.
You're building real impressive apps
with today's best tools. Whether you're
job hunting, freelancing, or building
your own ideas, this course gives you
the skills and the confidence to make it
happen. So, grab your favorite drink,
open up your code editor or IDE, and
let's build your first project.
We'll use Apprite to power the back end
of all three of our amazing apps. So
before we dive into the first one, let's
immediately create an account on
AppRight. So click the special link down
in the description to be able to follow
along and see exactly what I'm seeing.
Click get started. Sign in with GitHub.
And that's it. Very soon we'll start
diving into our first app. Learning
JavaScript libraries and frameworks can
feel overwhelming. So many options, so
much complexity, and the jargon, it's
enough to make anyone feel stuck. But
what if there was one best bet? A tool
that not only simplifies web
development, but opens doors to mobile
development, too. That's
ReactJS. Hi there, and welcome to a
course where I'll take you from a
ReactJS beginner to confident developer
without endless theory or aimless code
copying. This is about building
something real while truly understanding
it. Starting from what ReactJS is and
why you should learn it to how it works
under the hood. ReactJS fundamentals,
JSX core syntax, hooks, and React 19
features. And finally, we'll build a
modern movie app with a top trend
feature that showcases the hottest
movies people search for. By the end of
this crash course, you won't just know
ReactJS, you'll have created something
you can showcase. But that's not all.
For those ready to dive even deeper,
I've put together a free guide and a
comprehensive ReactJS course designed to
take you from zero to production ready.
Whether it's learning state management,
testing, or advanced patterns, this
course will help you build and deploy
apps like a pro. You can find all the
links in the description below. But for
now, let's dive into the video.
Together, we'll build an awesome app
with a break the trends feature using
AppRight to handle backend tasks
seamlessly. Let's get
started. ReactJS is a gamecher, a
JavaScript library created by Facebook
that powers some of the world's most
dynamic user interfaces. It's maintained
by a strong open- source community,
constantly innovating with new features
like server components, which simplify
your back-end workflow by running React
on the server. And it might seem like
React is borrowing PHP's homework for
building serverdriven websites, but it's
more like React speaking at PHP's notes,
modernizing them, so you spend less time
reinventing the basics and more time
building amazing apps. Of course, React
isn't alone. Frameworks like Vue.js,
Svelt, Astro, and Angular are also
making waves, but when it comes to
popularity, React dominates. Just look
at the numbers. 42% of the developers on
the Stack Overflow developer survey
chose React. And it is the biggest
programming survey in the world,
featuring all of the programming
technologies. So for the React to be
that high which gives that number a lot
of weight. React has also topped the
state ofjs survey for six consecutive
years as the JavaScript library of
choice and with a good reason. React is
the backbone of key stacks like MER and
burn extends to mobile development with
React Native and integrates seamlessly
with modern frameworks like Nex.js for
full stack development. In short, learn
React and you'll have the tools to build
apps for web, mobile, and beyond. It's
your ticket to becoming the Swiss Army
knife of developers. Now, let me show
you what makes React so powerful with a
project that I made specifically for my
upcoming ReactJS Pro course to help you
visually understand React patterns in
practice. And it's built entirely in
React. This app showcases React smooth
instant updates. You won't see a single
page reload or a loading spinner, even
when browsing different sections.
Everything happens dynamically on one
page. How? Well, React uses JavaScript
and the virtual DOM to make it all
possible. The virtual DOM is like a
simplified map of your web page. A
JavaScript object that mirrors the real
DOM. Here's why it's revolutionary. When
something changes, React creates a new
virtual DOM element. It then compares it
to the old one to pinpoint the
difference and only the changed part of
the real DOM is updated, making React
blazingly fast. Think of it as updating
a single tile in a mosaic instead of
repainting the entire wall. And React
doesn't demand much, just a solid
understanding of JavaScript. So, if
you're unsure about concepts like ES6
plus syntax, pause this video right now
and go check out my complete JavaScript
Mastery course. It'll make sure that you
have all of the necessary prerequisite
knowledge to be able to get the most out
of this course. And for a more focused
approach, or if you want to have a
reference guide always available,
download my free ultimate ReactJS guide
linked in the description packed with
prerequisites, core concepts, and
project ideas to get you started. And
now that you understand why React is so
popular, let me teach you how to write
React code and introduce you to its
syntax. We'll start with the basics and
slowly move towards building our amazing
movie application. So, are you ready to
react? Before creating a React project,
you need Node.js installed on your
machine. Node is a JavaScript runtime
that allows you to run JavaScript code
outside of a browser. This is essential
because React development involves
running tools and scripts on your local
machine and these tools require Noode.js
to function. So head over to
no.js.org and download the LTS or
long-term support version of Node.js.
Those versions are super stable.
Depending on your operating system, you
can install it via package manager
that'll look something like this. You
simply copy this to your clipboard and
paste it to your terminal. It is super
quick. Alternatively, you can download
the installer and then follow the steps
to install it. And when you install
Node, you'll also get a handy tool
called MPM, short for Node Package
Manager. Instead of writing everything
from scratch, you can use MPM to quickly
add features like animations, form
handling, or even full frameworks by
pulling them from its massive collection
of readytouse libraries. And it also
makes it super easy to keep your tools
and code up to date, ensuring everything
works smoothly together. In simple
terms, mpm will save you time and effort
by giving you access to a lot of
packages to help you build your modern
apps more efficiently. Now that you have
NodeJS installed, you'll need a place to
write your React code. There are many
code editors out there, and whichever
one you choose, you'll be good. I prefer
WebStorm as it's a fullyfledged IDE
designed specifically for React
development as it offers you everything
you need from a quick project setup,
error reporting, an integrated Git
system, and more. And as of recently, it
became completely free. And speaking of
Git, while it's not mandatory to have
Git installed to start learning React,
it's absolutely essential for your
growth as a React developer or any kind
of developer for that matter. It's a
non-negotiable. So, go ahead and Google
download Git, head over to their website
and install it on your device. And if
you're new to Git, I've already done a
Git and GitHub tutorial, which I'll link
somewhere in this video. So, if you want
to do that, too, before proceeding with
this React course, pause this video and
then come back. But with that in mind,
now that we have all the tools
necessary, we are ready to create our
first ReactJS project. There are
different ways to create a ReactJS app.
Starting from create react app, a widely
used tool that's reliable but somewhat
dated. Many companies still use it, but
it's not the most modern option. Vit
became a new norm and industry favorite.
Celebrated for its lightning fast HMR,
optimized builds, and speed, it's an
excellent choice for quickly setting up
a React app. And you can set it up
manually. If you're someone who loves to
spend a lot of time doing manual setups
so you feel like you're a great
developer, then you can do that. Just
kidding. All I meant is that you can
also manually set up a React app using
Webpack and Babel or directly install
React and React DOM in existing
projects. But why reinvent the wheel
when somebody already created a rocket?
Head over to Vit and notice that you can
very easily create a new React
application through a single command.
We'll do it that way to get faster build
times, improved performance, and modern
tooling. So, simply copy this command.
Open your code editor with an integrated
terminal and paste it. It'll ask you
whether you want to install the package
to create that React app. So, say why
yes. And it'll ask you for your project
name. Let's do something like my first
React app.
Choose
React and choose JavaScript. Later on,
we can do some TypeScript, too, but for
now, we'll stick with JavaScript. And
there you have it. The entire project
got generated in just a fraction of a
second. Probably before you even had a
time to blink. Now, let's actually see
which files and folders have been
generated and for what reason. Starting
from the bottom to the top. First, we
have the Vit config. This file allows
you to customize the build process, such
as adding plugins, configuring server
settings, and more. It's optional for
most basic projects, but can be useful
if you need more advanced customization.
After that, we have a readme.md file,
which contains the information about the
project, like how to run it, what the
project does, and other documentation.
And the package.json JSON contains the
metadata of our project such as its
name, scripts, and dependencies needed
to run it. The dev script starts the
development server while the build
script creates the production build. You
can run those commands by opening up
your terminal and running mpm run and
then the name of the command you want to
run. But before you do that, first you
have to install the necessary
dependencies to be able to run the
application. You can do that by running
mpm install or for short
mpmi or in my case I don't have to type
anything as webtorm immediately asked me
whether I want to run mpm install. So
that's exactly what I'll do. And there
we go. The packages have been installed.
Since WebStorm did it for me, I didn't
have to worry about switching
directories. But if you're doing it
manually, you first have to cd change
directory into whatever you named your
app. So in this case that is my first
react
app and then here you can run mpm
install if you haven't already. Now run
mpm rundev. This will run your
application in about half a second on
localhost 5173. You can see it live just
by clicking on this URL. There we go. A
simple app with a counter and a couple
of icons. Don't worry, we'll delete all
of this soon and start from scratch. But
for now, let's move ahead and check out
other files such as the package lock
JSON. This file is automatically
generated when you run mpm install. It
locks down the versions of the
dependencies installed in your project,
ensuring that every project
installation, whether on your machine or
when your colleague or boss is running
your application, will install exactly
the same dependencies, making sure that
your app runs perfectly. Don't delete
it. After that we have an index html and
this is the main HTML file within which
your app is loaded. It has a basic
structure including the root div which
React will infuse with your entire
application. Vit uses this as the entry
point and there's also the script that
points to a main.jsx file which
initializes your application. We'll
check it out soon. For now, let's
continue up ahead to ESLint config. This
is a config file used to define the
rules and settings for ESLint, a popular
linting tool. It helps you identify and
fix problems in your code, such as
coding style violations, errors, and
potential bugs. After that, we have git
ignore. This file tells Git which files
and folders to ignore when committing
your code. The most important thing to
ignore are node modules. You never want
to push these over to GitHub. rather you
want everybody to just get your code and
then if they want to they can just run
mpmi and the second most important thing
to ignore is the env file which contains
your environment variables. Those need
to be kept safe. Some of the other
folders on the list include node modules
which contains all the installed
dependencies for your project.
Everything from react v and more. This
folder is huge and contains even more
folders within it. You never really have
to get into it. It's just there for your
app to work. It's completely managed by
MPM and you don't have to interact with
it directly. After that, we have the
public folder which contains static
assets such as images, icons, and other
files that don't need to go through
VIT's bundler. Files in here can be
referenced directly by their path such
as
for/vit.svg. And finally, we have the
source folder. This is where your react
components and JavaScript logic go.
Tailwind CSS will be applied here
through the styles you import into your
components. App JSX is where the main UI
of your app is defined. Whatever you
write here will appear on your website.
Main. JSX is the entry point of your
React app where React is rendered into
the DOM. You can see that here we use
plain JavaScript to get the element by
ID of root and then render the entire
app right within it. Since this is the
entire app, here we import our main
style file
index.css where you can define the
global styles of your application. After
that, we have the assets folder
containing media assets like images or
icons. And these can be imported into
your React components or used within JSX
by simply importing them like this and
then using them as the source within the
image component. And finally, the app
CSS is the styling file specifically for
the app. JSX. As you can see, we're
importing it only here. You can create
as many CSS files as you want and import
them into different components just to
make sure that our styles are tidy and
separated. Hopefully, this all makes
sense. Sure, there are more files and
things happening behind the scenes, but
just to make sure ReactJS runs smoothly,
you don't need to worry about those
files all the time. Now, before we dive
into ReactJS syntax and learn how to
write its code, let's quickly set up
something cool for the feature I'll
teach you how to build today. We're
going to be using AppRight, an
open-source backend for your React apps.
The link is in the description, so just
click it and quickly create your
account. We'll use AppRight to develop a
simple algorithm that tracks what users
are searching for on our movie app and
then suggest the top five trending
movies based on their search history.
We'll set up our AppRite project and
connect a React app to it a bit later.
For now, just creating your account is
good. Let's talk about components in
React. There are two ways in which we
can define components. The traditional
one is called class
components. While they're not widely
used anymore, they're still common in
older code bases. An example of a
class-based component would look
something like this. Class component
name extends React.component. And then
there's a render method and a return
statement. All of this code just to be
able to return a simple H2. You might
encounter these if you work on larger
projects in big companies. However, for
new projects, they are no longer
recommended. Instead, there's a better
way to create components. Components
just like this one right here where you
define it by just declaring a JavaScript
function. But we have a lot of
unnecessary code right here. So, let's
actually delete this entire function and
create it from scratch. You could do
something like function app or you could
also use newer JavaScript syntax called
arrow components. That would look
something like this. const app 1 is
equal to and then you declare it like
this. I actually prefer this way of
creating components. So I'll just call
it app and I'll just export it at the
bottom. Then within here you can say
return render on H2 and say something
like functional arrow component. Now if
you head over to your browser, you
should be able to see the text we are
rendering, which means that the
component is showing successfully. And
the beauty of creating React components
is that you can create as many as you
would like. Something like con card
component or just card would render a
little card that looks something like
this card component. And then you can
use that card within the original app
component by simply wrapping it either
in this interesting little component
called react fragment or just a regular
div. And then below the H2 you can
render as many card components as you
would like just like so in the browser
that would look something like this. And
you can reuse it across your entire
application. Now just imagine if this
card component actually consisted of
more code. You would be able to reuse it
everywhere, allowing you to write code
only once and use it multiple times,
eliminating repetition. And that's the
power of React's component-based
architecture. But of course, it'll start
making much more sense as we dive deeper
into some more real React apps. So I can
show you how real developers use it on
their day-to-day projects. But writing
components is not enough. Sometimes we
want to pass data from one component to
another to display something specific
and not create multiple similar
components for every little change. And
we can do that through props. In React,
props, short for properties, are a way
to pass data from one component to
another. You typically do it from a
parent component to a child component.
Think of props as arguments you pass to
a function. Let me quickly show you how
it works in action. On our current
example, let's say that each one of
these cards renders a different movie
title. Later on, it can also be a
thumbnail, title, description, and more.
But for now, let's say it's just a
title. You can go into that card and
then pass something known as a prop.
Let's call it title and make it equal to
some famous movie title. Let's go with
Star Wars. The second one can be
something like Avatar. And for the third
one, maybe we can do something like the
Lion King. Now, if we do that and save,
you'll notice that no changes have been
made to our app. They're all still the
same card component. Well, now we can
put that prop to use by heading over to
our card component and accepting that
prop right into it. We have to call it
title and dstructure it. And then
instead of rendering the card component
text, we can dynamically render the
title that is being passed into the card
resulting in different text for each one
of these pieces of UI. And keep in mind,
the prop can be anything. It can be a
string, but it can also be something
like a number or even a boolean. It can
even be a complex prop, which is an
object. So in this example, let's pass
some information about the actors which
can be an array of different
objects where we have a name of each one
of these actors in a list. You can do
whatever you want. And then we need to
accept all of those props right here at
the top and then do something with them
in the UI. Pretty cool, right? Well,
we're just scratching the surface of
what React is capable of. So far, you're
doing well, but this is far from ideal.
This is looking very plain, just text on
the screen. We need to give it some
styles to offer a good user experience
to the users. So, how can we apply
styles in React? Or maybe I should
rephrase. Is there any kind of styling
we can't use with ReactJS? Inline
styles, CSS, Tailwind CSS, Bootstrap,
Material UI, Ant UI, SAS, CSS andJS, CSS
modules, you name it. You can choose any
approach to style your React apps. So,
let's try a couple of these styling ways
in our app. First of all, head over to
index.css and remove all styles from
here. This is one way of styling where
you write styles in a separate CSS files
and then you import them into your
component. We've imported this index.css
file within our
main.jsx. Let's start by applying some
styles to this app. I'll start by
targeting all the elements and set some
styles that you typically do at the
start of every single application such
as box sizing set to border box margin
set to zero and padding set to zero.
This will reset those styles for all the
elements on the screen. Next, we can
target the body element and give it some
padding. Like 40 pixels should be
enough. Oh, and I almost thought that I
was writing CSS in JS, so I
automatically made it a string, but
that's not necessary in regular styling.
We can also change the background color
to something like
hash151 515. Let's also change the font
family to something like
Franklin, Gothic, Medium, or if we don't
have that, we can just do aerial. And
finally, we need to style the H2
element by changing its color to
something like hash
F3 F3 F3. Giving it a text align of
center as well as a margin bottom of
about 30 pixels. And finally, a font
size of 48 pixels. There we go. Now I
can zoom out a bit and we can see
everything more clearly. We just applied
some styles directly to HTML elements
without having to manually select them
right here. But if we want to be a bit
more specific, then we can use class
names. So let me remove this first H2.
And let's remove some of these props as
we're not using them anyway. And now we
can give this div that's wrapping these
three cards a class name equal to card
dash container. Notice that unlike
styling HTML, you don't have to say
class name or lowercase in React. It
actually has to be uppercase N in class
name. Now you can head back over to
index.css and style.class class name by
saying card container. And then you can
give it a display flex flex wrap of wrap
justify content of center as well as a
max width of something like 1,024
pixels. This will make it look good on
all different devices. I'll also give it
a margin of zero and then auto. And
naturally, if you applied an id to this
div, you would be able to style it by
saying hash and then the name of the id.
Now that you know how we can use
external stylesheets to style our react
components, let me also teach you how we
can do some inline styles. We can do it
on this card component by giving this
div a style property and an object. And
then here you can define styles within
JavaScript by saying for example border
is one pixel solid. And then we can do
hash4b
5362. And now each one has a border. We
can give it some additional padding of
maybe 20 pixels. Let's give it a margin
of 10 pixels as well. A background color
of hash 313 63F. And notice how if
you're using inline styles within
JavaScript, you cannot say background
dash color. It's actually using camelc
case background color. Let's also give
it a border radius of something like 10
pixels. And let's also give it a min
height of about 100 pixels. Now, what
would happen if we mixed and match both
the styles from the external stylesheet
and internal ones? Let's add a class
name right here equal to something like
a card. If you now head back over to
index.css CSS and define the card class
name and give it something like a border
of 2 pixel solid red. Oh, again I'm
using string signs here where I don't
need to. You can notice that the color
didn't change. That means that inline
styles have the preference over all the
other CSS stylings. So do remember that.
But it's always better to stick with one
way of styling anyway. And in today's
world, Tailwind CSS is the way to go.
It's the preferred way of styling apps
of any kind. So in this tutorial later
on once we actually start building your
movie application, you'll use the most
popular and most in demand way of
styling applications through the latest
version of Tailwind CSS version 4.0
which was released exactly at the date
of publishing this video. So you know
that with JSM you're always getting the
latest information. Now, let's quickly
fix up our styles by heading over to the
index CSS and removing this margin
bottom from the H2. We don't need it.
And now, all of our cards are looking
good. But remember, I already told you
that it's always best to use one way of
styling. So, in this case, I will remove
these inline styles and I'll move them
over to our external stylesheet. So, let
me copy all of this and exchange it for
a class name of card. Then, we can head
over into our index.css. CSS and paste
all of those styles here, but you'll
have to change it to use lowercase
letters and dashes in between. So,
border radius, background color, and min
height. And at the end, you'll have to
add a semicolon. And of course, remove
all the string signs. We don't need that
in native CSS. So, let me quickly do
that. And we're good. Everything still
works as before. And with that, we are
ready to dive into what I believe is the
most important concept in React called
the state. State is like a React
components brain. It holds information
about the components that can change
over time. In this code, for example, if
you have to track if someone has liked a
movie or not, you'll have to use state.
If you use a regular variable, something
like const has liked and set it to true
and then use it right here as a prop has
liked is equal to has liked. Well, this
won't work because React won't know that
something has changed and it won't
update the DOM accordingly. That's
because React's rendering process relies
on state and props to decide when and
how to rerender the components. So,
let's create a state that allows users
to interact with each card and allow
them to like or dislike that movie. I'll
start by heading over to our primary
application and define our first state
by saying const and then you have to
dstructure an array like this and then
make it equal to a call to the use state
hook which you have to import from
react. So right here at the top, import
use state from
React. Keep in mind that in React,
everything that starts with the verb use
typically is referred to as a hook. And
React has many different hooks at your
disposal to allow you to build your
applications more simply and more
scalably. React being one of the most
important ones. And the way in which the
use state works is that you first
dstructure the actual variable name. In
this case, we can name it has liked a
boolean variable in this case. And then
as the second parameter to this
dstructured array, you can get a setter
function that you can use to update that
state. So in this case, set has
liked. These are names that I just
thought about on the spot, but you can
follow this similar pattern. First you
give a variable name. It can be
anything. and then you say set and then
use the same name. This is the common
practice. For now, I said has liked and
set has liked, but we're not yet done.
Within the parenthesis, you can also
provide the default value of that state.
In this case, the state is a boolean.
So, I'll say that at the start, the
initial state of this hasliked variable
will be set to false. And as you can
see, I'm using webstorm as my IDE. So it
intelligently recognizes what this first
parameter to the use state is and it is
the initial state. Of course if a
variable was something like a number
then of course you could set a five or
10 or any kind of value or a string or
even a complex object. All of that is
possible. Now right within each one of
our movie cards below the title let's
implement a button. A button that will
allow us to like a movie. This button
will say something like like and it'll
have an on click listener. Within here,
we can define what happens when this
button is clicked. We'll define a
callback function within it. Meaning
that once this button is clicked, this
function will be executed. But more
specifically, whatever is right here,
either within this curly braces or after
the arrow function will be executed. In
this case, I simply want to call the set
hasliked function and I want to set it
to true to be able to like it. Now, as
you can see, if I hover over this, it's
going to say unresolved function because
within the scope of this card, we
haven't yet declared this set has liked
state. It is declared within the app
itself. And this is where the beauty and
the complexity of React comes deciding
on where you will define which piece of
state. If the state has something to do
with all of these three cards, maybe
something like hide all movies, and then
that can be true or false, well, it
would make sense to have that state
right here within the app. But in this
case, this hasliked state will be
different for each one of these cards.
So, it makes more sense to take it away
from here and add it to the card. Now,
if I save this, you can see a little
like button appear right there. But
let's also style that button further.
by heading over into our
index.css and just styling all the
buttons on the page by giving them a
border of none, a font size a bit larger
of about 30 pixels. Once again, I'm used
to writing CSS in JS, so I'm used to
this different type of syntax. And I
think that just shows you that later on,
once we develop this movie app, you
learn a whole new way of writing styles,
which is much better and much faster
than this one here. We can also change
the background color and make it
transparent. Let's give it a width of
about
100%. As well as a text
align of
right. And I know that this doesn't
matter too much to teacher react, but I
still want to make sure that you can
visually see what this app is about and
how all of these features interact with
each other. And we can give it a cursor
of pointer to know that this button is
clickable. That'll look something like
this. And now if we click like, we
cannot really see that anything changes,
right? So how can we change the UI
depending on the state? Well, you simply
do some conditional logic. Instead of
simply always saying like, we can do
something like this. Open up a new
dynamic block of code similar to what we
did with the title. So whenever you want
to render just regular text like this,
then it'll always say title. But if you
want to use some dynamic variable then
you put it within curly braces and
that'll make sure to make it dynamic and
render the data of the variable that
we're trying to render not just the
title text instead. So here we can check
if has liked is true and if it is then
we can say liked else we can say like.
So now for the first one, you can
already see that it says liked even
though it's not that apparent because
it's black. But you can see that now I
can click on all of them and they will
all say liked and they'll stay that way
until I reload the page. So that is a
very important thing to mention that the
state is not persistent across browser
reloads. As soon as you reload the
browser, the component will get
rerendered and the state will return to
its initial values. Now, instead of just
saying liked and like, we can show some
different kinds of hearts just so it's
easier to visualize it. And now, think
about it. How would we unlike something?
That's a good question, isn't it?
Currently, we're always setting the
hasliked state to true. How would we
figure out if the state is already liked
and then flip it like a switch? Well,
you can say set has liked is equal to
not has liked. So, turn it around and
flip a switch. Now, if you click on it
again, you can see that we can like and
unlike it, and it happens instantly
without a browser reload. That's because
when the state changes, React
automatically rerenders the component to
reflect the new data on the screen. In
this example, initially has liked starts
as false. Then we have the set hasliked
function which is used to update the
state. And when you click the button, it
flips the switch to set the state to the
opposite of its previous value. React
then rerenders only that card component.
And that's the beauty of React. Like
when you click and change this state, it
only changes this one and it doesn't
touch any other cards or elements on the
screen. And then the updated hasliked
value is used to display either a red or
a white heart. But if we kept the state
within the app and passed it as a prop,
we wouldn't be able to like or unlike
each card separately, having it here
allows each card to manage its own state
independently, making the component
reusable and isolated. I hope this makes
sense. The syntax we just used with
state and as I told you when I
introduced this hook, use state is just
that, a hook. Hooks are special
functions in React that let you tap into
React features like state management in
this case. And there are many different
types of hooks. Use state for managing
state. Use effect for handling side
effects like data fetching. Use context
for sharing data across components and
use callback for optimizing callback
functions. There are plenty more as well
and we'll go over some of these in this
crash course. But if you're looking to
dive deeper, I've covered all of them in
detail, one by one, in my ReactJS Pro
course, complete with practical
examples, when to use them, and why
they're helpful. You can find a link to
that in the description if you're
interested. But for now, let's move over
to the second most popular hook, use
effect. Use effect is like a special
tool in React that lets you do things
outside of just displaying stuff on the
screen like fetching data from a server
or doing some cleanup after the
component is removed from the screen.
Let's say you want to log a message
every time a user likes a movie. To
track that, we can use the use effect.
So let's modify the card component to
implement it. Right here below declaring
the use state, I'll say use effect.
something like this. And then I'll
import it right here from React right
next to use state. Use effect has the
following syntax. You first declare a
callback function called the effect and
then within it you put the code that you
want to have executed something like
title movie has been liked or has been
liked or disliked. So, if I save this
and open up the console in the browser,
you'll see that we have quite a few
console logs. Two for each one of these
movies. Why do we have so many? Well,
it's because this card component got
mounted three times, once for each one
of these movies. But wait, something is
not right here. Instead of three calls
here, we can see six different kinds of
logs, which means that this use effect
has been called six times even though we
only have three cards. Why the
duplication? Have we done something
wrong? Well, not really. If you check
out the ReactJS documentation, you'll
see a question that says, "My effect
runs twice when the component mounts."
And that's normal because we are in the
development mode. when strict mode is
turned on. And in development, React
runs setup and cleanup one extra time
before the actual setup. This is a
stress test that verifies your effect
logic has been implemented correctly.
This is not a problem because once you
deploy your app to production, it'll
only run three times. But if you want to
learn more properly how React really
works in production, you can head over
to
main.jsx and then remove this strict
mode wrapper. This will make sure that
there's no duplication. So right now you
can see that there's three console logs,
one for each one of these cards getting
mounted to the UI. But now let's say you
want to track the activity of the user
for some kind of an algorithm that we
might want to develop within our movie
app. You want to track the number of
clicks to each one of these cards to be
able to recommend similar movies. To do
that, we'll need to create a new state.
So simply say use state. And this time I
won't simply start typing it. Rather
I'll press enter to select this template
allowing you to just type your word like
count in this case. Press tab which will
automatically write set count to provide
the setter for that count variable and
then tab one more time to define the
initial state of zero. Since in your
React applications it is normal to have
multiple states per each component.
Using this quick start is always
helpful. Now that we have this state,
let's create an on click handler on this
card. So whenever we click on the card,
we want to set count to be increased by
one. So we can say take the current
count and increase it by one. Now
there's one quick thing I want to point
your attention to. And that is that in
more complex interfaces, it is never
recommended to update the value of the
state by using the state itself. Rather
what you'll often see being done is you
create another callback function without
the setter state call and then you get
access to the previous version of that
state and then you can do whatever you
want with it such as do prep state + one
in a similar way here you can get access
to the previous has liked and then
toggle it on or off but for simplicity
sake I'll keep it right now just count +
one now let's display that state
somewhere we can display it right here
next to the title. So, let's say title
and then maybe show the count. If you do
that, you'll see Star Wars 0, avatar
zero, and so on. Maybe we can add a
break tag right here to display it in a
new line. There we go. That's a bit
better. And now, if I reload, first of
all, you can only see three different
renders. But now, check this out. If you
click on a movie, the number will
increase. That's good. But if you keep
clicking on it, even though we're not
changing the like state, this use effect
will keep firing. You can see that by
this number right here. So every time I
click something, we're firing a new use
effect, even though we're not changing
the like state. That's not good. That's
not the behavior we want. So let me show
you how we can run the use effect only
when something changes. To do that, you
can use something known as a dependency
array, which you pass as a second
parameter, also often called
depths. Whatever variable you pass
here, React will try to recalculate and
then see if it has changed and only if
it has changed, this effect will be
called. So, if you do this and reload
now, if you continue clicking on it,
you'll see that our card will actually
update. The count state will change but
this use effect won't run. But as soon
as you like or unlike a movie, it will
immediately change its state. Pretty
cool, right? And can we have multiple
use effects in the same way that we can
have multiple use states? Well, surely.
And let me show you another most common
use case of a use effect. You can just
create it like this. Provide a callback
function and then provide an empty
dependency array. This is in my opinion
the most common use case of a use
effect. This is a use effect that runs
only once on the mounting of that
component only when that component first
appears. So let's add a quick console
log and say card
rendered. If you do that you'll see
three card renders. This is how use
effect manages the side effects based on
the dependencies that you provide. Now
we can remove that and instead of that I
want to teach you something else.
Something called conditional rendering.
Technically we already learned a bit
about conditional rendering when we use
this turnary operator right here.
Conditional rendering allows you to show
different kinds of UI on the screen
depending on different criteria. For
example, if you only want to render the
count if it's not equal to zero, then
you could say something like if count
exists, then render the count. Else
render a null. Or in this case you could
just say count or null. So now you can
see that it gets hidden but as soon as
you increase it to one it's shown. We
just implemented conditional rendering.
Another way where you conditionally
rendered something were those two
different cards. You can see now we see
one and now you see the other. Of course
this has been just the simplest example
of conditional rendering. Throughout
almost every single more advanced
application that we build on this
channel and on JS Mastery Pro. You can
see different cases in which we use
conditional rendering. You'll also use
it very soon when building your movie
app. So with that in mind, let's delete
everything that we have right here in
our app. And then we'll have to create
it once again from scratch. But isn't
that going to take a lot of time to
recreate this function for every new
component? Well, thankfully there's an
extension that helps with that. No
matter which code editor you use, you
can head over to the plugins or
extensions and then find some kind of a
package that does React snippets.
Install
it and once you do, you'll be able to
run
rafce. This is a shortcut to quickly
create a new React arrow function
component with a default export. Pretty
cool, right? With that in mind, I'm so
happy that you're now finally at the
stage where you're ready to start
developing something more serious. You
now know what React is, why do we use
it, how components, props, styles,
states, different hooks, use effects,
and so much more work. So, you'll
finally be able to put it to practice
within this amazing app you'll build.
So, let's dive right in. This is a
single page application where you can
view all movies from an external API
with Pagenation. Plus, there's a search
feature that lets you find any movie
you're interested in. But here's the
cool part. will simulate Netflix's top
trending list. Unlike the movies pulled
from the API, these rankings are based
on actual user searches within the
app. The more users search for a
particular movie, the higher its count
grows and the more likely it is to show
up as the top searched movie. We are
actually building a small algorithm
here. We'll do it using AppRight. So, if
you haven't yet signed up, now is the
time to do so. Just click the link in
the description. And of course, this app
is fully responsive across all devices.
The main goal of this course is to teach
you all the most important ReactJS
concepts so you can implement them
within your code, within this project
and all of your future projects.
Alongside building the app, I'll also
teach you how to deploy it to the
internet so that everyone can see what
you've done. See, the app you'll build
today isn't just a project. It's a
career asset designed to showcase
everything you're capable of, making you
an attractive candidate for any job. I
highly recommend Hostinger, so I'll put
a link down in the description. I'll go
with the premium plan as it allows me to
host 100 websites with free SSL for
HTTPS security, free email for that
professional touch, and even a free
domain name to give your website a good
name. And because I've partnered with
Hostinger, you'll get an even bigger
discount. Click the special link in the
description. Click claim deal and add to
cart. Choose the period of our hosting.
I'll choose 48 months to save the most.
And then next to your payment method,
you can enter your JavaScript Mastery
coupon code, which will give you the
biggest discount available. Once you've
purchased, we are ready to set
everything up. Let's start with
Hostinger's guided setup. In this case,
we'll create a new website, and we won't
use WordPress. We want to have an empty
HTML website, which of course will turn
into a React website. As you can see, I
use Hostinger for all of my domain
names. So, if you want to choose your
domain name right now, you can do that.
But if you want to do it at the end, you
can click use temporary domain. You can
choose the server that is closest to
you. And that's it. Our setup is being
initialized. While our hosting is
setting up, I just want to quickly let
you know that there's a GitHub repo
containing the entire code for this
project. So if you ever get stuck, just
make sure to visit the GitHub page and
compare your code with the code that's
on there. There's also a free complete
Figma design for this project in case
you want to develop it on your own. And
let's not forget the extra lessons and
procourses on
jsmastery.pro. With that in mind, our
hosting has been set up and at the end
of the course, we'll simply change our
domain to a real one and then deploy it
using the file manager. With that said,
let's dive straight into the
code. Now, thankfully, we already have
the starter code that we used to learn a
bit about React, which we'll use as the
basis for our movie application. The
only thing you'll have to do at the end
is change the folder name. But there's
one thing that we don't right now have.
Remember how I used to make so many
typos when typing out the styles? Well,
that's because this is not how we
typically do styles in React. We do it
using Tailwind CSS. And literally, as of
the day that I'm recording this video, a
brand new major version of Tailwind CSS,
version 4, is now live. It brings much
better performance, simplified
installation, less configuration,
dynamic utilities, and so much more. So,
in this video, alongside learning React,
I'll also teach you a bit about how to
use Tailwind CSS with all of its newest
features. And if you'd like me to cover
Tailwind CSS in more detail in a
dedicated crash course, let me know down
in the comments. And if many of you
comment, we'll do that very soon. With
that in mind, head over to the Tailwind
CSS website, click get started, and then
scroll down to the installation using
Vit. The only thing we have to do is
copy this command and move it over to
our terminal. Now, as you can see, we're
already using one terminal to run our
application. So, we can just create
another which we'll use to install
additional packages. I'll simply paste
it mpm install tailwind CSS and add
tailwind
CSS/vit. And while it's installing we
can check out the second step and that
is to configure the vit plugin under our
configuration. So let's do just that by
using tailin CSS under plugins under our
vit config which is right here at the
bottom. We just have to add it within
our plugins array.
Tailwind CSS like this and we can import
it at the top coming from add Tailwind
CSS/V. After that we have to import our
Tailwind CSS within our main index.css
file. So let's copy this and move it
over to our
index.css. Remove all the other code and
add it right at the top. And that's it.
We can start using Tailwind within our
code. Let's just copy this H1. Head back
over to our
app.jsx and use it right here. Class
name
text-3xl font-bold and underline. If
this syntax is looking completely new to
you, don't worry. I've already done a
quick crash course on how to use tail
and CSS on the channel before, but by
the time you're watching this video,
maybe we have a newer one. How these
different utility classes work. But in
simple terms, instead of declaring all
of the styles within a separate
stylesheet, which means that you always
have to go here and then open it and
then choose a class and then add it
here, you just declare a class name and
add these specialized utility classes.
So it's not, for example, color and then
red. Rather, it'll be something like
text-
red-500. And there's even a Tailwind CSS
extension which will tell you exactly
which CSS properties that class is
applying. We can also change the font a
bit by heading over to our index.css.
Within here, we can import different
fonts. And the imports for them look
something like this. It's a long string
of characters that brings in different
font that you can use from
Google. Instead of having you manually
type this out in the GitHub repo, give
it a star. By the way, you can find a
complete detailed readme where you'll
have different code snippets. So, head
over here, find the index.css, and
simply copy it and paste it in your
file. Here you can find some utility
classes that'll make it easier for us to
add different gradients or just apply
some styles to images, inputs, and more.
And we're also importing the fonts that
I talked to you about. You can see that
there are some warnings right here
pointing to unknown rules for Tailwind
CSS directives. That is totally okay as
these are new. It is possible that our
IDE didn't yet recognize them, but these
are just warnings and everything should
work fine. Once you apply those styles,
you should be able to see that our app
will now get this nice dark mode. And as
I said, if you'd like a detailed start
to finish tutorial on the latest
Tailwind CSS version 4, covering how it
works, its features, and the best ways
to use it, let me know in the comments,
and I'll create a crash course for you
soon. Now, we can finally start with the
app. Let's start from the top down, from
the header, by turning this entire div
into an HTML 5 semantic main tag. And
then below the main we can create a new
div which is going to be self-closing
and it'll have a class name equal to
pattern. You'll see what it does very
soon. But for the time being let's
remove this h1 and create another div
with a class name of
wrapper which will wrap our header. So
within it, let's create a header tag.
And within it, we can say find movies
you'll enjoy without the hassle. There
we go. That's looking nice. And we can
turn movies into a span. And to this
span, we can apply a special class name
of text dash
gradient. There we go. So now the way
this is working and if you want to take
a look at the full styles for the text
gradient, you copy it and you search
across all files for it and you'll find
it right here in the index.css where you
can see that we're applying a linear
background from N2 and then making it
clip with the text and setting it to
transparent. This is more so a CSS trick
rather than react, but it's very cool to
know. And once again, if you'd like me
to do more of these CSS tricks and show
you how I came up with them, I can do a
video on that, too. Below this header,
we'll also display a P tag of search.
Later on, we'll convert this piece of
text into its own component, but for
now, it can remain just a P tag. And of
course, let's not forget the icon. To
get all of the images we'll use in this
course, you can head over into the
description and find a link to the Figma
design. There you'll be able to see this
full design and you'll be able to
download the images. The way in which
that works is you select an image in
this case let's go with this one and
then you export it. And we can also do
that for a couple of other images that
we have here such as this background. So
select it and simply export it. Next we
can get the logo of our application.
Then we need to show this poster not
available. So let's export that too.
Let's not forget about some of the icons
such as this search icon right here
which we'll want to export as an SVG as
well as a star SVG. So you'll have to
click multiple times and then select it
to get to it. And then you can just
export as SVG. There we go. You got a
quick course on Figma as well. It's very
important to know how to work with
designer tools as a developer to be able
to put these designs into practice. So,
now that we've downloaded all of these
assets, let's remove this vit.svg from
public. Open up your downloads folder
and then drag and drop all of the assets
you downloaded. It should look something
like this, but make sure to name them
appropriately. This right here is a
star. So, let's just rename to
star.svg. After that, we have this image
right here, which is going to be hero
dashbg because it's a background for the
hero section. After that we have the
hero image itself. So we can say
hero.png. We also have the
logo.png as well as a no movie. So you
can rename all of those
accordingly. And let's not forget about
the search. So let's rename it to
search.svg. There we go. Now we have all
of the assets needed to create this
project. So let's use one of these
assets right within our header. Here we
can render an image that'll have a
source equal to dot
/hero.png. And we can give it an al tag
of hero banner. If you save it, you'll
immediately see it right here. And if
you expand your screen, you'll also see
this hero background with different
spotlights as well as these vertical
lines that kind of resemble a movie
screen opening up. Looking great. Now,
let me teach you how to create your
first React component. You can do it by
opening our file explorer, heading into
your app source, and then within the
source, create a new folder and call it
components. Within components, create a
new file and name it
search.jsx. Within it, runce, which will
quickly spin up this component. And then
you can head back over to app and import
it here by simply calling a self-closing
search component. And if you press enter
while you're trying to render it, it'll
actually autoimp import it from the top.
But if that didn't work, you can
manually do it by saying import search
from /components search.jsx. Now, why
can't we see that search yet? Well,
technically it's here, but it's just a
dark piece of text, so it's not really
showing on the dark background. Let's
actually make it show by giving this div
a class name equal to
text-white and
text-3xl. Now, how will this search
work? Keep in mind, this component is
only keeping track of the search term
itself, not of the movies that are going
to show below the search. So, it's not a
good idea to just create a new state
here because then what would we do with
it? It is tied to this scope of the
search. So what we have to do instead is
create a new state within the main
application and then we'll pass it as a
prop to search. Let me show you how to
do that. We can use the use state
snippet and let's call it search term
set search term and by default we can
set it to an empty string. What we can
do then is pass both the state itself as
well as the setter state to the search
as props. You already learned how to use
props, right? You simply give it a name
such as search term which can be equal
to in this case the value of a search
term coming from state and set search
term equal to set search term equal to
the setter function. Oh, don't call it
like this because then it will get
called immediately as this component
gets rendered. Instead, what you want to
do is just pass over the function
declaration. So later on, you can then
recall it within the search, but it'll
not get called as soon as this component
gets rendered. And there's one more
thing you learned right now, and that is
that state fields can also be passed as
props. It's not illegal. As a matter of
fact, it happens super often. So just to
recap here we have two different props
and you can think of props as inputs
that you pass into a component like
arguments for a function or settings you
pass to a component so it works properly
in this case as the user searches for
something like we can say I am Batman
right here we can then pass that search
term over into search and then here how
do we use it? Well, you get access to
all the props right here in the props
object. And then here we can maybe
render it by saying
props search term. And there we go. Now
it's being rendered on the screen. What
you'll often see is just so you don't
have to repeat
props. Props set search term, props do
something, you can dstructure those
props because it's an object. And this
is not a React specific thing. It's just
JavaScript. Whenever you have an object,
for example, person that has something
like a name, Bruce Wayne, age36 of
location go off location Gotham City. AI
is getting really creative here. Um, so
let's say you have a person and you want
to use their properties. Well, you could
do person.name, person. And so on,
right? But what you can also do is the
structure name, age, and location from
the person. And then you can use them
just like so. Super simple, right? So in
this case, what we often do with React
components is the same thing. You simply
dstructure the search term and the set
search term which you're passing in.
That way you don't have to say props do
every time and it'll still work. Now
there's one important thing to keep in
mind and that is that props should never
be changed by the child component. They
are read only. So if you want to do
something like search term is equal to I
am Batman not even though you can see it
works here you should never actually do
that because it breaks the main behavior
of react and actually mutates the prop
in multiple spaces. So you actually
don't know whether it's this value or
this value or whatever it is. And in
this case we're breaking two main rules
of React. The first one being you should
not mutate props. And the second one,
maybe even more important one is you
should never mutate
state. Yep, this is forbidden. So if you
want to go something like search term is
equal to new search term, this is
heavily forbidden in React. You should
never do this. You only mutate the state
using the setter function. Okay, this is
important behind the scenes for React to
always know what the value of these
states is. Perfect. So now that we have
gotten that out of the way, you know
that props are read only and we can now
implement the search using those values.
I'll do it by giving this main div a
class name equal to search. Within it,
we don't have to render the actual
search term. rather we'll render another
div which will contain an image of
source is
search.svg and an all tag of search.
It'll also contain an input which will
be a self-closing component that'll have
a type is equal to text. It'll have a
placeholder equal to search through
let's say thousands of
movies. Then you can pass a value to it
of search term and more importantly an
onchange handler that works something
like this. And you'll do this very often
in React. Might seem a bit confusing at
first, but trust me, once you get used
to it, it'll become second nature. So
the way it works is that you don't
manually ever change the search term.
Rather, the input has a handler for a
specific type of event. In this case,
it's listening for an onchange event,
which in this case, it's a key press. So
each one of these event gets fired once
you press your key. And in real world,
this is often shortened just to e short
for event. And then you call the setter
state and you pass over
a.target. So now if you head back over
to the app, we can reset the initial
state because we don't want this to be
the main search input for everybody.
Rather it should start from an empty
string. You can search through thousands
of movies and then you can type
something and you can see it is working.
And is it actually changing the value?
Well, I don't know. Let's render an H1.
That'll render the actual search term.
And maybe we can give it a class name of
text-white. If we do that, you can see
that as you type, React is dynamically
changing the value of that state. And
later on, we'll keep track of that value
to call an API to give us movie
recommendations. Great. With that in
mind, we have now successfully completed
a heading part of our application. A
nice hero image, a background, a title,
and a search input. Already in the next
lesson, we'll focus on fetching movies
from the best movie API on the internet.
So, let's do that next.
In this lesson, I'll teach you how you
can fetch external data, which if you're
learning React for the first time, will
open up a world of possibilities. That's
because there are hundreds, no,
thousands of different APIs that you can
call directly from your application to
get super unique data to build an
application about anything. If you're a
fan of anime, you can do that. Fan of
antimalware, you can do that, too. art
and design, authentication, blockchain,
books, I mean you name it. There is an
endless list of APIs that you can use to
power up your React applications. And
when I was first learning React many,
many years ago, when I learned how I can
fetch this external data, it opened up
the world of possibilities. For this
course, I chose the movie database API
as we all watch movies, right? And it's
free to use. So just Google for TMDB,
head over to API reference and then
search for movie. We want to head over
to discover movie. Here you can see all
the information on how you can make a
request to this API. But I believe first
we have to create an account to get our
API key. So let's go ahead and log in at
the top right. You can create an account
by clicking right here. Enter a few
pieces of info. And once you're in, you
can head over to more API. And this will
bring us back to the page we were on.
Head over to API reference and search
for movie discover. And this time you'll
have your own access token. So let's go
ahead and copy it by selecting it from
here. And let's paste it into our
application. Now in React apps, you
never want to have your key right here
by saying something like TMDB API key is
equal to a string because then everyone
would be able to have access to it. What
you want to do instead is put it under
environment variables. So let's delete
this and let's create a new file in the
root of your folder and call it
env.local. Again make sure that it is
not outside of your main application
folder like right here. It should be
where your source is. So right next to
it. And then you need to start your key
with the keyword
vitm_appi_key and simply paste your key
right here. Now you may need to restart
your terminal for the changes to take
effect and for this variable to be
recognized. So head over to your first
terminal, press Ctrl C to stop it from
running and then run mpm rundev one more
time to spin it up on localhost 5173.
Once you do that, what do you think?
Which React hook do we need to use to
fetch the
movies? It's use effect. So let's import
it right here at the top. Import use
effect from React. And then below this
use state, let's create it. Use effect
which will only load at the start. How
do we do that? Well, we provided an
empty dependency array. Only run this
once this component loads. Now, how can
we actually fetch this data from the
API? I mean, we have the key, but what
do we do with it? Well, to know the
answer to that question, you'll have to
read through the docs a bit.
Documentation is the most important part
of learning how to code. And immediately
at the top, we get the exact API
endpoint that we need to call. API
refers to an
application programming interface. And
it is simply a set of rules that allows
one software application, in this case a
React app, to talk to another, which is
a database or server set somewhere else.
In this case, we're using TMDB's API to
get a list of movies. So, we have to
send over a request that says something
like, hey, give me a list of your most
popular movies. We can do that by first
defining the API base URL which will be
equal to
https
col//appithemovdb.org/3 for version 3.
We do have something after that but
we'll specifically craft that part
later. For now we just want to have the
base part of the URL. After that, we can
also get access to our API key by saying
const
API_key. And typically, when you're
naming your variables and you know
they're not going to change, you can use
this kind of case where you have all
uppercase letters and then
underscores. And here we can get the
variable by saying import
meta.envit tmdb api key. Make sure to
spell this correctly. This variable name
right here needs to be the same as here.
After that, we have to define the API
options by saying const API options is
equal to we can define the method as
get. So you want to get some movies and
then we can define the headers which is
an object where we can say accept and
you can define what kind of data do we
accept in our application and it'll be
an application JSON which means that the
API will send back a a JSON object which
is similar to a basic JavaScript object
with some minor differences and we have
to authenticate the API by saying
authorization and then say bearer and
then pass the API
This verifies who is trying to make that
request. In this case, we created an
account on their API. So, we can do
that. And we're finally ready to declare
a function that allow us to fetch those
movies. So, let's do it above the use
effect by calling it const fetch movies
is equal to an asynchronous function
that'll look something like this. within
it. When you're fetching something,
typically it's a good practice to open
up a try and catch block. If something
fails with the API call, then you get
into the catch where you have access to
the error. So then you can console that
error the error and we can also say
something like error fetching movies
like this. And this way we're getting a
bit more information about a specific
error that happened. Now a pretty cool
thing is that we can also display that
error in the browser. React makes it
super simple. We can do that by
declaring a new state. So let's say use
state and let's call it error message
set error message at the start equal to
null or an empty string because we don't
have any message in there. But now if we
catch an error we can set error message
to a meaningful message something like
error fetching movies please try again
later. And now where do we display that
message? Well wherever you want. We can
create a new section right here below
our search. As a matter of fact let's
put the search within the header and
then we can declare this new section
about movies below the header. So it'll
be
section and we can have a class name of
all
movies and we can render an H2 that'll
say all
movies. There we go. Now what you can do
is say if there's an error message,
render a p tag with something like text-
red 500 and then display that error
message. We'll actually explore that in
practice very soon. But for now, we have
to keep trying to call the API. We're
not even successfully calling it yet. So
now let's move into the try block where
we can try to call it. And first things
first, we need to define the exact
endpoint that we're trying to call. And
the endpoint will be equal to a template
string where we put together the API
base URL. And then we go to forward
slashdiscocover
slashmov question mark
sort by equal to
popularitydeesc for descending. So this
will make sure to fetch all the movies.
Once we have the endpoint, we can try to
call it by saying const response is
equal to await fetch to which we pass
the endpoint and API options. Now see
this fetch over here. This is a built-in
JavaScript function that allows you to
make HTTP requests like get or post to
different APIs or servers. It's like
sending a letter to a service and
getting a reply. In React, fetch is
often used to get the data from APIs for
displaying it on the website. So, how do
we actually put this fetch movies to
practice? Because right now, it is
completely unused. What do you think?
Well, we can simply call it as soon as
the app loads. So, if I call it within
the use effect like this, what do you
think? Will it work? Fetch movies. No
errors, right? Which is a good thing.
Maybe we can put an alert and just alert
the response. Yeah, that works. We get
some kind of an object back. That's
great. But what would happen if
something went wrong? For example, if an
error happened here, like we can throw a
new error, say failed to fetch movies
just to simulate a wrong call. If I do
this, you can immediately see error
fetching movies, please try again error
message happening at the bottom. No
reload, no nothing. it's just
immediately there. But thankfully, we
don't get it if we don't manually throw
it. Which means that we do get back some
data. So let's actually parse this
response into a JSON object by saying if
not
response. Well, in that case, we might
want to throw some kind of an error
saying fail to fetch movies.
But if the response is okay, we can get
data by saying cons data is equal to
await response.json. And finally, we can
console log that data to see what do we
have in there. If I reload the
application and head over to inspect and
then open up our console, you can see
that we get back only one object.
Doesn't seem like a lot, does it? But if
I expand it, we only get back the first
page which has 20 movies in it. I'll
need to expand it to view it more
properly. There we go. These are only 20
movies. And for each one of these
movies, take a look at how much data do
we get. We get an image of that movie,
the ID, the original language, title,
overview, popularity, poster path,
release date, title, video, vote
average, vote count, and more. And we
get this for every single movie. And
this is just the first page. But take a
look. We have
48,000 total pages, which is almost a
million movies. Pretty crazy, isn't it?
And now we can infuse our React
application with all that data and show
it to the user. So let's do just that.
I'll say if data response is equal to
false, then I'll set the error message
equal to data.
or fail to fetch movies. Sometimes
something wrong can happen. We have to
handle that error. And in this case, it
will also be a good time to create a
state field like an empty box inside of
which we can place all of these movies
that we fetched. So let's create it
right here at the top. I'll call it use
state and I'll call it movie list or we
can simply call it movies. It's up to
you. set movie list at the start equal
to an empty array. Another state we'll
have to have and we often have those in
React applications is the loading state.
So we can call it is loading set is
loading at the start set to false
because when you're fetching something
from an API it takes time maybe a second
or two. So while that data is loading
you want to make sure to show some kind
of a loader to the user. So we're still
here in the case if it fails. If it
fails, we simply want to set the movie
list to be equal to an empty array and
we want to return meaning exit out of
the function. But if it succeeds, then
we are ready to set movie list to be
equal to data results or an empty array.
So this will actually finally populate
the movie list with real movies. Another
thing we have to do is turn on the
loading. So before anything happens
right at the start we can set is loading
to true to start the countdown and we
can also set error message to nothing
because it doesn't exist
yet. And then there's another clause to
the try and catch and that is the
finally clause. So finally no matter
what happens whether we succeed or fail
we want to stop the loading. Why?
Because if we succeed we'll show the
movies. If we fail, we'll show the error
message. No need to show the loading
state. With that in mind, now that we
have this function that fetches all the
movies called fetch movies, we're
calling it at the start, we're finally
ready to use the data that the fetch
movies populated into our movie list
state. So, let's head down a bit and
right below all movies, let me show you
a bit more complex conditional
rendering. We won't show this error
message always. rather first we'll check
if we're currently loading. So if is
loading then open up a turnary operator
and show a p tag of loading dot dot dot.
Maybe we can also give it a class name
equal to text-white.
else. If we're not loading, check if an
error message exists. And if an error
message exists, then render another P
tag that'll have a class name equal to
text-
red-500. And it'll render the dynamic
error message coming from the state. And
if we're neither loading nor showing the
error message, then we want to show an
unordered list, a ul element inside of
which we're going to map over the movie
list by saying movie list map. By the
way, this is something you often do in
React. Whenever you have some kind of an
array of items you want to map over, you
simply call that array, call the map
method on it, get the individual element
like a movie from it, and then
automatically render something. Now,
make sure not to open up a function
block here by putting the curly braces.
Instead, put parenthesis because if you
put curly braces, which is totally okay,
but then you would also have to say
return here. But if you use just
immediate return by using parenthesis,
then you don't have to say return,
making your code a bit cleaner. For each
one of these movies, return a p tag
that'll render a movie title. And now if
I save this, so if I save this, it seems
that nothing happened. But if I apply a
class name to this p tag equal to
text-white, check this out. we get 20 of
the most popular movies at this exact
point in time for you. This list will be
different from me because some other
movies are trending. And that's the
beauty of calling APIs. You don't have
to worry about the data. Somebody else
is doing that for you. Now, another
important concept in React is a concept
of a key. Whenever you're mapping over a
list of elements, you want to make sure
to provide a key to each one of these
elements you're mapping over. that key
has to be unique, something like an ID.
So, we can simply pass the ID belonging
to this movie. This is needed especially
if you're deleting some of these
elements from the list because React and
might confuse the two elements together
and be not sure what to render. But if
you give each one an ID, then it'll
always know which one it is, and you'll
have no unexpected behavior in your
browser. Great. With that in mind, let's
check how these movies are loading. Like
if I reload right now. Oh, they're
already stored in memory. So, it's super
quick. But for a brief second, you
should be able to see loading right
here. For now, we can simulate it by
heading over to our state and turning
the is loading initially to be set to
true. And then under fetch movies, if
you head over to the bottom in the
finally clause, you can also set it to
true. And now you can see loading. But
this is not looking that interesting, is
it? It would be better to have some kind
of a real spinner that looks like this.
There are many different spinners
online. People offer them for free. They
work in different light or dark modes
and you can simply copy the code. I'll
put the link to this website in the
description so you can find your spinner
of choice and just copy to
clipboard. Then we'll create a new
component by heading over to source
components and let's call it
spinner.jsx.
run
rafce and instead of this div right
here, simply paste the code that you
just copied. It'll be a bit of a longer
code because it's an SVG, but that's
okay. And at the end of this class name,
instead of fill blue 600, change it to
fill indigo 600. I think this color pops
a bit more on our background or any
color of your choice. Now, if you head
back over to our app.jsx,
JSX. Instead of simply returning a
loading text, if it's loading, we can
return a new component which we can
import from the components folder and
it'll look something like this. Much
better. Right now, we can bring this
back to false. And same thing right here
at the top initially. Great. Also, let's
quickly give this H2 a class name of
margin top of something like 20 pixels.
And we can do that within square
brackets like this. There we go. I think
maybe even 40 will do. Perfect. With
that in mind, now we have a fully
responsive, greatl looking list of movie
names or movie titles, but not movie
cards. One thing I love the most about
all of these APIs is when they're
visual. People are visual beings and
seeing something that looks like this
with a lot of movie covers, ratings, and
more is much better than just seeing the
titles themselves. And we'll do that
next. But it's not that hard, is it?
Once you understand something at its
core, it won't feel tricky the next
time. And that's why before in the crash
course, I went into detail about how use
effect works and I showed you how to
implement it. So this time you fully
understand how it does and you'll be
able to replicate it in all of your apps
in the future, but that's just one hook
and there are many more in React 19 like
use action state is one of these hooks.
Use optimistic, use form status, and I
also think there's a use transition.
Yep, that's here too. And each one of
them comes with its own quirks. I'll
cover each one of these in depth along
with their specific use cases in my
upcoming pro course. So if you want to
go beyond what most people learn, be
sure to check it out. The link is in the
description. There's either going to be
a wait list or if you're lucky, the
course will already be there. With that
in mind, let's turn this into this.
Let's develop a movie card component. We
can do that by creating a new component
in the components folder and call it
movie
card.jsx. Run
rafce and then import it directly within
your
app.jsx. Specifically, we want to render
each one of these cards instead of a
movie title. So remove this P tag or
rather just copy it and instead of it
render a movie card which you can
automatically import from components.
Pass in a key equal to movie ID and also
pass in a prop of movie equal to movie.
Remember how props work. We want to pass
all of this information from here about
each one of these movies to the movie
card. This will allow you to dstructure
that movie right here. And then within
this div, we can render the same thing
we previously had, which is a P tag that
renders the movie title. So if you go
back, nothing should change. Everything
is still the same. But now we have this
new component within which we can work
to make it fully reusable and not keep
everything in our app, which would
clutter the view. Now we can put things
that specifically belong to the movie
card within it. Now, I already told you
how we can dstructure the props, so we
don't have to say props.ov movie dot
something but this time we'll have to
say movie something many times movie ID
movie.poster card movie.title and so on.
So what we can do is dstructure more
properties from the movie itself. You
can do that by saying colon and then
saying which properties you want to take
out such as the title. And now you can
simply say title. We don't need a key in
this case because we already have it
here where we're mapping over it. But
now you can see the same thing but we
don't have to repeat ourselves. We'll
also use a couple of other thing
belonging to a movie such as a vote
underscore average for the rating poster
underscore path release underscore date
and original underscore language. You
can also put this in a new line so it's
a bit easier to see what's
happening. Great. Now let's create this
movie card by giving this div a class
name equal to movie
dashcard. Already this will apply some
styles that I prepared within the
index.css. So if you head over into the
index.css and search for the movie
card, you should be able to see that
this will apply a dark background, a bit
of padding, rounded corners, and some
shadows. Exactly what we get over here.
Instead of a P tag right here, let's
render an image. And this image will
render the poster path. So let's say
source is equal to if a poster path
exists, then we want to render
https colon/image.tmdb.org
org slasht slashp
slww500
slashposter_path. This is the full path
to that image. And if a poster path
doesn't exist, we can render forward
slashnomov.pbng, which will render our
dummy image. So with that in mind, you
can see that now we get access to the
images belonging to all of these great
movies. Looking great even on mobile
devices. As you can see on mobile, we
can only see one per row. But as you
expand it, check this out. You can see
two, three, four, and it is just looking
great. Perfect. We can also give an al
tag to this image and it'll be equal to
the movie title. Below the image, we can
render a div with a class name equal to
margin top of four. And within it, we
can render an H3. That'll simply render
the movie title. Perfect. Then we can go
below that H3, render a div that will
have a class name of content, and within
it, we can render another div that'll
have a class name of rating. And within
it, render an image with a source equal
to star. SVG with an all tag of star
icon. And now you can see a little star
right here belonging to each one of
these movies. Next to the image, we can
also render a p tag which will check if
vote average exists. And if it does, we
want to render the vote average tofix
one. And if it doesn't, we can just say
something like n a doesn't exist. So now
this will round down the number to the
first fraction digit 7.7 6.5 and so on.
Looking great. We can head below this
div right here and render a span. This
span can render one of these special dot
characters just to create some
separation. I think if you just Google
for dot symbol copy, you should be able
to find it somewhere. There we go. This
is the one. So you can copy it and then
paste it here. I like using those to
create some separation. Below it, we can
render a P tag with a class name of lang
as in
language. And here we can render the
original language. In this case, it says
en as in English. After that, we can
render another one of these
spans. So let's actually put it below.
And then below that span we can create
another P tag which will have a class
name equal to year. And there we can
check if a release date
exists. Then we want to render release
date.plit based on the dash and only
take the first part of it. So we only
want to get the year. Else we'll say na.
So now we get 2024 2024 2025. Great. We
have the newest movies right here. But
even if you're watching this in 2026 or
seven or eight, let me know in the
comments down below. The video should
still be relevant. But if that is the
case, it's highly likely that I have
more relevant content on jsmastery.pro.
So head over there and watch it there.
But with that in mind, believe it or
not, this is it for a movie card. This
is called a presentational component. It
doesn't handle any logic. is just
accepting some props we pass into it and
rendering them. So now if I full screen
this, you'll be able to see how it looks
like as we scroll through those movies.
And let me zoom in just a tiny bit. Take
a look at how great this looks. We're
getting full resolution images back and
we're rendering them right on the
screen. And if I render, most likely
they'll be cached already. So you won't
even be able to see the loading screen.
But if you have a slower connection,
you'll be able to see that loader. Now,
in the next lesson, let's power up our
use of this API by implementing search.
That way, you'll actually be able to
type in a movie name you want to find,
and the top matches will pop up right
here. To implement search, we'll reuse
the same fetch movies function that
we've created before, but we'll have to
tweak it just a tiny bit. We'll have to
track the changes in the search term
state. And whenever it changes, we'll
have to recall the fetch movies function
with a different API call that's used to
fetch movies. No longer will it be
discover movie. Now it'll be a search
movie and we'll also have to pass a
mandatory search query string. So let me
show you how to do that. First, I'll
make this fetch movies function accept a
new param called query at the start
equal to an empty string.
And then we can pass over our search
query from the state or search term into
the fetch movies function which will
then be populated as a query right here.
Oh, and let's not forget we want to
recall the fetch movies with the updated
search term whenever the search term
changes. And you already know how to do
that. You just add the dependency into
the dependency array of the use effect
search term. So whenever it changes this
function will be recalled and fetch
movies will be called with the updated
query. So we can now modify the endpoint
by saying if a query exists in that case
we can have one call else we can have
another. So if a query doesn't exist we
just want to use the same one we used so
far. But if a query does exist we want
to modify it just a tiny bit. First get
the API base URL, but this time it'll be
forward slash
search/mov to which you want to pass the
query. But we want to make sure that
this query is optimized to be displayed
in the URL or to be called as an API
call. So instead of just passing it as a
string, we can say query is equal to
encode URI component. This function
encodes a URI by replacing each instance
of certain character by a couple of
escape characters representing the UTF8
encoding. This will make sure that our
search term, no matter which weird kind
of characters it has, still gets
processed properly. And to it, we can
pass the query and everything is still
the same. We're still getting back the
response and then setting up the movies
to our state. The only thing that was
different was passing the right query to
the right endpoint. So if I reload and I
start searching for something like let's
say the Batman, you can see that the
search is fully functional. And of
course this is working even better on
desktop as you'll be able to see more
movies at the same time. Maybe Dark
Knight. Yep, this is working great. What
is your favorite movie? Let's go with
Godfather. It's one of the classics. Or
maybe Avatar. Or maybe you like anime.
something like Attack on Titan. That
should be there, too. There we go. While
typing these movies, I'm sure that to at
least one of you, I've chosen your
favorite movie. But yeah, with that in
mind, this search is now fully
functional and it works. And if we type
something that doesn't exist, you can
see that we get nothing here. And if you
type something random, you can see that
even if a poster doesn't exist,
everything still works and it doesn't
break because we put that dummy poster
not available image. But we're not done
yet. In the next lesson, I'll teach you
how to optimize that
search. Right now, as soon as you type a
single letter, a request is made. Let me
show you. I'll type the letter A, and
immediately you get back the movies that
match the letter A. But let's be honest,
that's not really what you wanted.
That's not the expected user behavior.
You don't want to get the movies for the
letter A. You want to continue typing.
So, you go ahead and type the letter V.
You were still not done. You were about
to type Avengers. But hey, now you got
the AV, the hunt, and so on. Not only is
this not good for you, the user, but it
is terrible for our server because
things can very quickly get
overwhelming. Every time that you type a
letter, one character, one request, and
this can easily lead to an excessive
number of API calls, killing your daily
usage and increasing your bills. This
causes two problems. The number one is
API overload which might exhaust the
server resources and the second one is
rate limiting. The API might have the
too many requests rule which could
automatically break the application or
lead to throttling. So let me teach you
the solution. It's called input
debouncing. As you can see, we can enter
a couple of characters and they're being
sent only once. So one more time. 1 2 3
4 one request. 5 6 7 8 one request.
While in the regular way, we send one
API for each number. Debouncing is
commonly used to address the issue that
we just experienced. This technique
helps us delay the request until the
user has stopped typing for a predefined
amount of time, reducing the frequency
of API calls. So, let me teach you how
to implement debouncing using a pre-made
use debounce hook from the React use
package. This hook will help us manage
the delay for us. As you can see, use
debounce debounces a function. And we
can simply get access to that code by
installing a package. And this is
actually a great way for me to show you
how you don't have to build everything
inside of your React apps. Just head
over to mpm, search for what you're
looking for, and then simply install it
by using the mpmi command. We installed
tailwind CSS in a similar way. And now
we can simply use it. Let me show you
how. Right at the top we can import use
debounce coming from react use. And then
we can create a new use state
field. This time we'll call it a
debounced search term and set debounce
search term at the start equal to an
empty string. Then we'll simply call the
use debounce hook pass a callback
function to it and call the set debounce
search term with the search term that we
have. But we can pass a specific number
of milliseconds for how long it should
wait before actually changing that value
in the state. This is how this weird
little hook works. So instead of passing
the real search term which gets updated
on every single keystroke, we can now
pass over a debounced search term into
this use effect dependency array and
into the fetch movies function. The use
debounce hook will take care of the
rest. Basically what it does is it
debounces the search term to prevent
making too many requests by waiting for
the user to stop typing for 500
milliseconds, which is half a second. So
check this out. If I want to type
something like Avengers, I can now
continue typing and it'll not make a
single request until I stop typing for
half a second. So if I stop, it made a
request. But it looks like I have a
typo. So if I fix it, we're good. Of
course, using this hook is amazing, and
I would even recommend installing
additional packages like this to help
your workflow. But sometimes it's good
to understand how these hooks work
behind the scenes. So learning how to
implement one from scratch by yourself,
not by using an external package, is
excellent practice to learn how React
works behind the scenes. Does this make
sense? Many creators won't even dive
into this at a beginner level, but I
believe it's important to understand it
right from the start. It's not just
about building something, but about
building something that truly adds
value. So next time you're in an
interview, don't just say, "Hey, I
implemented search functionality.
Instead, explain that you built an
optimized search solution that improves
performance by debouncing the input
field." That level of detail will set
you apart. And yeah, I hate to repeat
myself here, but I've been diving into
similar concepts and many more advanced
patterns that boost performance
optimizations, caching, SEO, and more in
the upcoming ReactJS Pro course because
it's all about that realworld production
level practices. No fluff. So, if you
haven't already, you know the deal. Join
the wait list and I'll see you there.
But with that in mind, we are now ready
to move to a part of this app that I'm
super excited about, and that is the
trending section. You know that famous
Netflix trending section? Well, I'll
teach you how to do just that. So, let's
do it in the next
lesson. To create a feature that
displays trending movies, it's essential
to understand exactly what users are
searching for. The more frequently a
specific search is performed by multiple
users, the higher its trending status
becomes. This requires tracking and
analyzing search patterns over time. For
example, if many users search for Squid
Game, well, Squid Game will become
trending. To track and analyze these
searches, we need a place to store the
data permanently. If you think about it,
state is a way of storing data, but it's
not a permanent store of data. something
called a database is we use databases to
store information and then retrieve it
when we need it. And traditionally
implementing this would mean building a
full stack application meaning that you
would have to develop a server, set up a
database, connect them, host everything
and only then integrate it into your
React project. While this approach
works, it can be a lot of effort and
requires diving into back-end
development, which is a whole different
area of expertise. An easier way to get
backend functionality without starting
from scratch is using a backend as a
service platform. These services like
Firebase, Superbase, and AppRight take
care of the backend setup for you,
providing you easytouse APIs that let
you store data, manage o, and more
without needing in-depth backend
knowledge. In this course, we'll use
AppRight because it's simple, open-
source, and free to use. Plus, it saves
us from diving headirst into backend
work when we really just want to focus
on making our React app
awesome. So, click the link in the
description and then create a new
account. You'll be redirected to your
dashboard. And as you can see, I already
have many apprite projects. So, let me
create another. Call it something
starting with
JSM. Maybe a movie app. You'll have to
choose a different name and choose a
server. Once you do that, you'll be
redirected to your project's dashboard.
Apprite installation changed a bit. So,
if you're watching me use a different
installation later on, don't worry about
it. First, you'll be redirected to a
page that looks a bit like this. Choose
React as the platform. Skip the first
step. Copy these envir.
ignore all the other steps and just use
mpm install apprite to install it. Then
go to the app right dashboard which is
right at the bottom of the page. I'll
zoom it in a bit and you can copy its
ID. We can head back into our
enenv.local and add it right here below
by saying vit apprite project ID and
make it equal to the ID that we just
copied. Next, we'll have to set up a
platform for our project. In this case,
we'll use web. You can enter the name
such as react and a host name can be set
to asterisk meaning everything to make
sure that we can call it from anywhere.
Click next and then you'll have to
install appite. So let's copy the
installation
command. Head back into your terminal
and paste it there. Then click next and
next one more time and go back to the
dashboard. Then you can head over to
databases and create a new database. You
can call it something like movies and
create. Make sure to copy its ID and add
it to your
env.local under the name of
vitappright
database ID. And we can also create a
new collection within that database.
Let's call it metrics. Click create.
Copy its ID. And let's also add it right
here as vit apprite collection
ID. Perfect. Now let's create different
attributes for each one of these
metrics. We'll need the actual search
term which will be a string. So let's
call it
search term. Enter the size something
like 1,00 characters and it'll be
required. After that we can have a count
of how many times have users searched
for that search term. So let's create a
new integer call it count and enter the
default value of one. Doesn't have to be
required. After that we can also save a
URL called
poster URL and make it required so that
we can immediately save the URL of the
poster that users are searching for in
our database as well as its movie ID. So
let's do another integer and it'll be
called movie
ID and it'll be required. Perfect. So
make sure that your attributes are
called exactly like this required and
have the same types. If you call them
differently, you'll have to change how
we use them within the code. Now head
over to settings and then to the
permissions. Click plus any and give all
permissions. This is just to make sure
we can make calls to our database
without any worries and click update.
With that in mind, let's head back over
to our code. And within the source,
create a new file called
apprite.js. And within here, we'll do
all of the setup. But before that, let's
simply try to console log our env sure
we can access them. We can do that by
saying
const
database ID is equal to import.
meta.env.t
vit_apprite
database ID and we can duplicate that
and just rename it to collection ID and
say collection ID right here at the end
as well. Oh, and we'll also need the
apprite project ID. So, let's duplicate
it one more
time. And let's just rename it to
project ID is equal to import app
project ID. Perfect. Now let's console
log them. That's going to be project ID,
database ID, and collection ID. But for
this file to be executed, we actually
have to call some kind of a function. So
what do you say that we immediately
create a function here that will update
the search count. It'll look like this.
Export const update search
count, which will be equal to an
asynchronous function. And for the time
being, the only thing it'll do is it'll
console log those environment variables
just to make sure we have access to
them. So now we can go back to the
app.jsx and right at the bottom after we
set the movie list, we can call the
update search count like this and make
sure to import it at the top coming from
apprite.js. If you do this, go back to
your browser and reload the page and
then open up the console. You should be
able to see three different IDs. In case
you can't see them, sometimes it's
possible that Vit will not automatically
restart the server for you. So, you can
do that yourself manually by pressing
Ctrl C and then rerunning it by running
mpm rundev. But if you have those keys
here, that's good and means we can
proceed. So let's implement this
function that'll track the searches made
by different
users. This function will take in two
parameters. The first one will be the
search term that the user has searched
for and the second one will be the movie
associated with that search term. So all
of the information about the first movie
that pops up once the search term is
entered. The function has to do the
following things. Number one is to
use apprite SDK or API to check if a
document already exists for the search
term. So to check if a document or
search term already exists in the
database. Then if it does that means
that the search term has been searched
before. So in this case simply update
the count. But if a no document is found
then create a new document with a search
term and count and set the count as one.
So now how would we implement it in
practice? Well first things first we
have to get access to appight's
functionalities by defining a new
apprite client by saying const client is
equal to new client coming from apprite.
So you can import it at the top and then
on it you can call the setend endpoint
and set it to https col/
slashcloud.apprite.io/v1. Similar to how
we set our movie API here we're pointing
to apprite servers in updated versions
of apprite. Now you also need to include
the region for your endpoint. So it
might look something like FRA.cloud.app
apprite.io and you also have to set your
project pointing to the current project
ID similar how in the movies API we had
to have our own save token. Once we have
the client we can define which
functionality we want to use from
apprite and that is the database
functionality. So we can say con
database is equal to new databases
coming from apprite and to it we pass
our current apprite client. Great. So
now let's use the app right SDK to check
if a search term already exists in the
database. We can do that by opening up a
try and catch block. In the catch we can
simply console log the error if there is
one. But in the try I'll say const
result is equal to await
database.list documents. In which
database do we want to list the
documents? It's going to be the database
with our current database ID. So you can
pass it as the first parameter. From
which collection? Well, it's going to be
the collection ID. This one. And then as
the third parameter, we can pass an
array. And within that array, we can say
query which has to be imported from
apprite equal search term has to be
equal to the search term. So we're
matching what we have in the database
with what our users are searching for.
After that if result
documents.length is greater than zero.
So if the document exists then we want
to get that document by saying cons doc
is equal to result documents zero. And
then we want to update the count. We can
do that by saying await database do
update
document. Which document we want to
update? Well, the document under this
database ID, this collection ID, and
this document ID. And then what do we
want to do to it? Well, we want to set
the count to be equal to current
doc.count + 1. That's it. And then else
if it doesn't yet exist, that's going to
be the step three already. So step two
is if it does exist, update the count.
That's this if statement. And this is
the step three. If it doesn't then
create a new document with a search term
and count as one. So instead of calling
databases update we'll say await
databasecreate document under this
specific database for this specific
collection with this specific ID. We can
get it ID do unique like this. But make
sure to import this ID unique from
apprite right here at the top. That will
allow you to simply create a random ID
for this document you're creating. And
then you can pass an object containing
different pieces of data that you want
to pass to it such as the search term,
the count set to one. And what other
attributes do we have? Do you remember?
I think it was the movie ID. So we can
set that to be equal to movie ID, but
make sure to have the underscore right
here. And I think we had
poster URL which we can set to be equal
to template string https colon/ slash
image.tmdb.org
slt/pw500 and then
movie.poster_path. Perfect. I believe
now we have everything we need to be
able to save our searches. So now we can
head back over to our
app.jsx. And by the way, to quickly
switch files, I don't always go here and
then search for the file manually. I use
the command or control P on my keyboard
and then start typing where I want to
go. So app.jsx, arrow down, and then
enter. And we're immediately there. So
now whenever a user performs a search,
which is right here below, we want to
update the search count. We can do it
something like this. If there is a query
and if
data.res.length is greater than zero. So
means if a movie exists for that query
then we want to await update search
count. Make sure to import it at the top
to which you provide the query and the
information about that movie. So that's
data results zero. So it knows what to
save. And that's it. Let's perform a
search and then I'll show you how this
record appears in the appread
collection. Let's go with something
popular like Venom. Let's go Venom right
here. Okay, we search for it. This is
the one that shows at the top. And now
if you head back over to AppRight
databases, movies collections, you'll be
able to see two different documents. The
first one has the data of V. Looks like
I wasn't fast enough. So maybe we can
increase the debounce value. But the
second one should be good. Check this
out. Data venom. So it has been
successfully saved with a count of one.
Now let's keep searching. Maybe this
time I'll go with something like wicked.
Okay. And now let's also simulate
another user going to Venom. So we
search for it two times. So now if I
head back and reload, we see three
different documents. One is for Venom
and it has a count of two which means
that this worked successfully and we
also stored its ID as well as its poster
URL. And then the new one is just wicked
right here with a count of one. I think
you understand how this is working. So
the more people search for something,
the higher the count will be and then we
can show it in our trending list. And
with that, you saw how simple it was to
set up AppRight to use its database
functionalities. So now, let's head back
over to our app and let's fetch that
data from the database so we can display
it right here at the
top. Now that everything is in place and
we know what our users are searching
for, we are ready to show this trending
list of movies. But before we focus on
the UI, we need to create another app
right function to be able to fetch the
top movies from the database. So create
it right below by saying export const
get trending movies is equal to an async
function that looks something like this.
This time we don't need any parameters
as we'll simply fetch it from the
database. Let's open up a try and catch
block. As always, in case something goes
wrong, we can console log the error. But
in the try, we can try to fetch those
movies by saying const result is equal
to await
database.list documents and list them
from the database with the database ID
and the collection ID that we pass. But
then we can provide an array to specify
which movies we want to get.
Specifically, we want to limit the
query to only show five movies. We don't
need anymore. And we can do it in a
descending order. So query order
descending sorted by count. So the ones
that have the highest count will appear
at the start. And finally, simply return
result.cuments.
This is it. This is enough for us to
fetch those movies on the homepage. So,
let's head back over to app.jsx and
let's create yet another state for our
movies. This time, we'll create trending
movies. So, another
state trending movies set trending
movies at the start equal to an empty
array as always.
And I know that this app is not super
simple, not something that you might
consider your first app. It has many
states, many different hooks, functions,
API calls, and even
databases. But I really wanted you to
have a real experience of what building
with React is really all about. This is
how real apps look like, not just a
single use state and then some UI.
Typically, it does get messy like with
what we have right now. So with that in
mind, let's create another function
right below fetch movies and let's call
it const load trending movies which will
be equal to an asynchronous function
where we have a try and catch block.
In the catch, we get the error and we
can say something like error fetching
trending movies. And we can also set the
error message to error fetching trending
movies. So we know if something goes
wrong. Oh, but no, this wouldn't be good
because currently we're checking if an
error message exists and if it does,
we're not even showing a regular movie
list. So if the trending movies are not
working, this would actually break our
entire application's functionality and
we don't want that. So you see you got
to be careful with that conditional
rendering. So in this case I will not
set this error message here. I will
simply console log it and in the try we
can simply fetch the trending movies by
saying const movies is equal to await
get trending
movies. Make sure to import it at the
top coming from
apprite.js. And then once you have it
there, we can simply say set trending
movies to be equal to movies. We're not
equal. You pass it into the setter
function. So what do we do with those
movies? Well, first of all, we have to
actually use this function because right
now it is fully unused. So what do you
think? What would be the best place to
call this low trending movies?
maybe within a use effect. Right here
we're fetching movies. Might make sense
to load the trending movies too, but not
really because if you do this then
trending movies will be refetched every
single time that our current user
searches for something and that'll cause
too many necessary API calls. So
instead, we'll leave this use effect as
it is with its own dependency array. And
check this out. We'll create yet another
use effect. this time with an empty
dependency array, which means that it'll
only get called at the start. Finally,
now that we've done that, we can head
over above our current all movies
section. Remove this margin top from the
H2 because now we'll implement a whole
another section right below the
header. I'll check if trending
movies.length length is greater than
zero. Meaning if trending movies exist,
then render another
section that'll have a class name equal
to trending. And within it, render an
H2 where we can say something like
trending movies. There we go. Here it
is. And then below it, we can render a
UL, an unordered list. And within it, we
can map over the trending movies by
saying trending movies map where we get
each individual movie. And we can also
get its index. And then for each movie,
we want to immediately return an LI,
which is a list item. And don't forget,
since we're mapping over it, we have to
give it a key equal to movie. Dollar
sign ID because now it's coming from the
database. And typically databases start
their ids with something like dollar
sign or underscore. And there we can
render a p tag and render the index plus
one because indices start at zero. But
this time we want to start from one. And
you can see that now we get 1 2 3 4.
Perfect. But let's actually show
something next to those numbers like an
image with a source equal to movie.post.
poster URL with an al tag of something
like movie.title. If you save this, you
should be able to see different posters
appear right here. And it looks like I
searched for Avengers a few more times
than what I did for Venom. So, if a
couple more users search for Venom,
let's see what happens. That was one.
Maybe I can delete it and then search
for
another. And now if I reload the page
for the trending movies to be
reinitialized, you can see that Venom
now gets the first place. Let's try to
search for some other popular movies
nowadays. Maybe the Gladiator. So if I
do this and search for the Gladiator, we
see it. And I'll search for it a couple
more times just to see whether our
trending movies will properly recognize
it. I'll reload the page. And there we
go. Now the gladiator is on the third
place. And with that in mind, believe it
or not, you've done it. I'll close this
file and expand my browser fully. And
there you have it. Your own movie
application with a trending movies
functionality. Isn't this cool? Not only
can you search for different movies, but
you can also know what is popular within
your app based on other people's
searches. That was awesome to learn and
implement, right? As an extra task for
you at the end of this video, maybe you
can implement loading and error states
for the trending movies. Remember how I
said that if we change the error message
here that the movies would not load?
Well, that's because we need a whole
another loading and error state for the
trending movies. So, right now we have
the is loading as well as the error
message for all of the movies. And then
we have the search term. Maybe we can
sort it a bit better. and a movie list
and the trending movie list. But the
better way to sort it would be to have
the movie list right here and then the
error message and then the is
loading. But then for the trending
movies, you can also implement the error
message and is loading and properly
render it on the screen depending on if
something fails or the time it takes to
load. Pretty cool little exercise,
right? In any case, I hope you gained a
lot from this video. And for some of
you, things might not have yet fully
clicked, but that's totally fine. Feel
free to rewatch it and try it on your
own without watching the video. There's
no secret formula to becoming a great
developer. I started the same way. When
I learned something new and it didn't
quite make sense, I'd retry it on my own
and practice it over and over and over
again. You can do the same and you'll
start to see the results. Since we're
very close to the end of this video, I
just want to say that if you enjoyed my
teaching style, and maybe you did since
you're at the end, make sure to sign up
to the weight list or check out the
upcoming ReactJS Pro course to dive
deeper. YouTube is great, but on
jsmastery.pro, I provide you with a bit
more structure and exact path on what
you have to learn next after you master
JavaScript, React, Nex.js, and so on. No
matter where you're at in your journey,
I'll provide you with the next step to
become job ready. But on that note,
there is one thing that will surely make
you more job ready, and it's within this
course, and that is the deployment of
this great application. Not only have I
taught you how to build it, but now you
want to share it with others, right?
It's a pretty cool app, and you want to
have it online, and you want to show it
to your friends, colleagues, or maybe
even put it on your portfolio.
To do that, you can head back over to
your code, stop your terminal from
running, and then run mpm run build.
This will generate an optimized
production build of your application in
about 800 milliseconds. Damn, these
builders are getting fast. If you open
up your file explorer, you'll notice
that now there's an additional folder
here called dist as in distro or
distribution. So, just click it and then
open it in your finder or file explorer.
It should look something like this. Once
you do that, head back over to your
Hostinger dashboard and head over to the
project we created. Now might be the
perfect time to use the domain that you
chose. You can either do something like,
you know, JSM movie app, which is a bit
specific. So you would get this domain
specifically for this app, which is
totally okay. You can see it's zero
bucks for the first year. But what I
would recommend, but maybe what I would
recommend is getting the domain name for
your portfolio instead. So something
like your first and last name.dev or.com
like
jsmadrien.dev or.com is even better if
it's available with that domain. You
would have one single place for your
portfolio and you would be able to put
many projects on there. So in this case
I can go with something like
adrienjsmastery.com. Click next and once
the domain is connected you can head
over to your projects dashboard. Go to
file manager. Head over into public
html. Delete the default PHP file
because here we're going to upload your
website. So delete it. Open up your
finder. Go inside of it. And then simply
copy everything and move it over to this
public html. This contains the index
html file as well as all of the assets
needed to run your React app. Once you
do that, go back to your Hostinger
dashboard. Make sure that the SSL
certificate for the domain has been
installed. Typically, it takes a couple
of minutes from once you select your
domain name. There we go. It's done. And
then click on it right here. And check
this out. We are now live under your
specific domain name. You can find all
of the popular movies as well as see
what other people are searching for or
you can search for something yourself.
Do we have any movies about JavaScript?
Who knows?
Well, not really. What about React?
Well, this is good enough, I guess.
Keanu running away from some kind of a
chain reaction. That reminds me of
working with Redux, which is kind of an
advanced React state management library
that was used back in the day. But in
today's world, you don't have to worry
about that because there's simpler and
more advanced technologies to help you
manage your state and bring your React
game to the next level. For example, the
best next way forward after learning
React is to dive into Nex.js. As Nex.js
is a framework that is built on top of
React that allows you to turn your
front-end React apps into full stack
apps with optimized performance. So, if
you're not sure what to do next, well,
Nex.js is the way to
go. Do you think you need to invent the
new Facebook to get hired? Not at all.
You just have to prove that you can
build professional and productionready
applications that solve real problems
and that won't crash harder than your
last relationship. So, hi there and
welcome to a course in which I'll teach
you how to build store it, a storage
management solution inspired by giants
like Google Drive, Dropbox, and One
Drive used by billions of users. But
here's the kicker. You won't just slap
together a bunch of features. You'll
also learn a modern, state-of-the-art
tech stack along the way. Together,
we'll create this project using the
latest and greatest next 15, which
updates faster than you can keep up. So,
buckle up because in this tutorial,
you'll learn how to implement secure
passwordless OTP authentication. Build a
streamlined dashboard to track storage
and recent uploads. Manage multifile
uploads in different file types. Rename,
preview, download, delete, and even
share access with others. Use global
search to find any file instantly, and
design a responsive UI that works
flawlessly on any device. And much more,
covering the Nex.js foundations, best
practices, architecture, and top-notch
performance. This isn't just another
app. It's a step-by-step hands-on
experience allowing you to showcase your
essential job ready skills. And if that
doesn't get your adrenaline pumping, I
don't know what will. But if you're
ready, let's dive right in. If you visit
the website, you'll be redirected to the
O pages since you don't have an account.
You can log in or create a new account.
Right after providing that account info,
you'll be prompted to provide a one-time
password. So, let's head over back to
our email. And there it is. Let me type
it in. And I'm in. We have a beautiful
screen that shows the storage usage,
different categories of files, recent
uploads on the right, navigation on the
left, and a global search bar at the top
that allows you to search any file
you've uploaded lightning fast. There's
also an upload button at the top right.
Click it and you can upload any kind of
file from documents, images, or media.
You can also upload multiple files at
the same time. Upon a successful upload,
you'll see changes in storage usage and
files being automatically categorized in
different sections. Let's navigate to
the specific file categories to see
their dedicated space usage, filter them
or do the pagionation. And the same
thing goes for all the other categories
of files. You can also perform different
kinds of operations on each file. So
let's rename this to something else or
even check its details. If you click on
it, you'll see this file in the preview.
For PDFs, you will see a preview in the
default browser PDF Reviewer. Pretty
cool, right? From the drop down, you can
also download these files and save them
to your device or simply delete them.
But that's not even the best part. You
can actually share these files with
others. That's right. Let's click share,
provide an email, open an account using
that email, and there you go. The shared
file is already there. You can do
anything you want with it if needed. You
can also restrict the shared actions.
And as always, the whole thing is
completely mobile responsive, working on
any device that you could have, even
that teeny tiny Galaxy Zfold. So think
about it. This single project showcases
everything a full stack developer needs
to know from back-end architecture,
database design and authentication flows
to file handling, user permissions,
modern UIX principles, and even web
vitals using Nex.js, JS, TypeScript,
Tailwind CSS, ChatcN Charts, and
AppRight, an open-source backend as a
service that gives us complete control
over our data with many self-hosting
options and powerful APIs that some
other alternatives don't offer. Now,
let's build something that actually
matters. Not because it's revolutionary,
but because it's exactly what the
companies need. So without any further
ado, let's dive right
in. To get started building a great
project, we'll start from bare
beginnings. In this case, I'll be using
WebStorm. It is a professional IDE that
just recently became completely free for
non-commercial use. While recording this
application, some of the dependencies
changed a bit. It's not a big difference
from a feature perspective, but it's a
difference in a way these things have to
be written. The concept stays the same.
It's just the setup syntax that differs
a bit. Click on the use this template at
the top when you click the link down in
the description and then choose one
option to move forward. For example,
create a new repo or open it in
Codespace. Once you do that, you can
either continue working in Codespace or
clone it on your machine. Everything
stays the same moving forward. I
provided all the needed dependencies in
this template so you don't have to
install anything ahead of time. You can
skip that part whenever I mention it.
the rest will flow smoothly so you can
actually get started quickly and start
learning what matters from tsconfigs to
tailing configurations package jsons
containing different versions of
dependencies we're using to the public
folder with the assets and then finally
the app folder within which we'll
develop our code in this case I won't go
too deep into what each one of these
files does but what I will do is leave a
link down in the description covering
the exact timestamp to my NexJS15 15
crash course which is released on
YouTube for free where I dive into a
deep explanation of each one of these
files and more in case you need a
refresher on how NextJS applications
work considering that this application
right here will also be a Nex.js
application. So I'll leave a link to
this video down below and I'll also
leave a link down below to our ultimate
Nex.js course. The only course you need
if you truly want to dive into the
production level of writing NexJS code.
And since you're watching this video, I
think that's exactly what you want to
do. Specifically talking about caching,
different runtimes, client versus server
rendering, different data fetching
methods, and more. Just recently, I
updated it to the latest versions, the
best performance, detailed theoretical
explanations, and even active lessons so
that you can truly test your knowledge
and try to do something before you watch
a video lecture, which is not the case
here on YouTube as you can just
sometimes follow along and it feels like
you're watching Netflix. But in this
case, you'll truly have to test your
knowledge before you can watch the next
lesson. And why am I saying all of this?
Because from this point onward, I will
assume that you have either watched the
free NexJS5 crash course so I don't have
to overexlain some things that I've
already mentioned there or the paid one
if you can afford it and you really want
to learn how it works under the hood. So
with that said, let's go ahead and run
our application by running mpm rundev
which will start development server on
localhost 3000. Commandclick it to open
it up and it'll look something like
this. you'll get next.js's boilerplate
code. What you can notice is that the
title will say create next app. So, let
me show you how you can update it to
make more sense with what we are
building. I'll head over to app and
layout.tsx. As you can see here, we have
our nextgs metadata that allows us to
change our title. In this case, we can
change it to store it. And for the
description, we can say something like
store it the only storage solution you
need. Alongside that, we can also update
our fonts. So in this case, instead of
getting the gist sans, I'll go ahead and
remove those two. And instead, I'll say
const poppins is equal to poppins. I'll
call it and provide the options object.
And we can import the poppins font like
this from next
slashfont slash Google. Within it, we
can pass the subsets. In this case, that
will be equal to Latin. We can also pass
weight. We'll need all of the weights in
this case, ranging from 100 all the way
to 900. And finally, we can specify the
variable that we'll use to define this
font. It'll be d-font dash poppins.
There we go. We can remove this import
and place this right here at the top.
And now we can use this font right here
in the body. So let's head over to the
class name and let's just use a singular
font which is going to be a class name
of a template string popins do variable
with
font-pins and we can keep this
anti-alias class name as it typically
helps to make some fonts appear more
readable. Now the font will have changed
and so did the title but as you can see
the favicon remained the same. So, let's
get the new and updated one, and we'll
get it from our Figma file, which means
that the link to the complete design of
this project will be down in the
description. You can get it completely
for free. So, if you want to, you can
maybe pause this video and sometimes try
to build some of the things on your own
and then see how I would approach them
for the best solution. You would kind of
be replicating what we're doing with
active lessons within the ultimate
next.js GS course, but it will be just a
bit tougher as in our active lessons, I
actually explain each task in detail to
guide you on how I would approach
thinking about implementing a specific
task, giving you some examples as well
as resources and documentation pages
that you can refer to. And finally, a
complete hint if you cannot manage to do
it on your own to try to do it, but just
with a bit of help. If you would be
replicating all of that just from the
design, it would be a bit tougher, but
you can still do it. In any case, once
you're in design, you will be able to
find something that looks like this
where you have a logo and then you can
just export it. In this case, I'll go
with a JPEG. Once you download it, head
over to Favicon Generator and I'll turn
that image right here into an ICO, an
icon file. You can do that by simply
uploading this icon right here. And
immediately it will give you a favicon
version of that which you can simply
drag and drop into the app folder which
will ask you to override the existing
one. So override it. And there we go.
Now if we go back to the website you can
see that all of our website's metadata
such as the title of store it and then
our favicon nicely appear right here.
That means that soon enough we'll be
able to start focusing on the codebase.
But before that, let's set up
linting. To make sure that you follow
all the best practices in your codebase
and keep your code clean, we'll go ahead
and set up eslint right here before we
start writing any code to make sure that
your code is clean and so that you can
quickly find problems if they appear.
Now, eslint is a llinter, but I'll also
teach you how to hook it up with
prettier, which is an opinionated code
formatter. together they'll do wonders
and just make sure that your codebase is
clean. So let's open up our terminal and
I'll create a new one so we can run some
additional commands while our
application is running. And I'll run mpm
install
eslint-config-standard eslint- plug-in-
tailwind CSS which will help us with
adding Tailwind CSS classes a lot and
eslint-config prettier. Finally, we'll
need the prettier itself, which is an
additional package. And all of these can
be saved as dev dependencies. So, just
at the start, I'll say mpm
install--save-dev, which is going to
save them as dev dependencies. And I
notice I have a typo right here, eslint
plugin tail css. Fix it, and press
enter. It's going to install them in
less than a second, which means that we
can now head over to our eslint rc.json,
JSON which was generated for us by
Nex.js. And here we can make sure that
all of the rules of the packages and
plugins we just installed are being
followed by adding them to the extents
list. So we can say next core web
vital. Then we can say next typescript.
We have
standard and we can also add a
plug-in tailwind
CSS/recommended. And finally, we have
the prettier package as well. Now, if
you're using WebStorm, you might press
commandshiftp and then search for
prettier, go to preferences, and turn on
manual prettier configuration, which is
going to take it right here from your
node modules. And you can run reformat
and run on save. Okay, great. And you
can repeat the same thing with ESLint by
searching for it, turning on the manual
configuration, point it to your node
modules, and run the save on fix. And if
you're in VS Code, you might need to
create a new folder called VS Code and
within it a settings.json file, which is
going to have some kind of a setting
that says editor code actions on save
source fix all ESLint explicit, which
will make sure to turn on the ESLint
configuration on save. And this is also
something that we dive a bit deeper into
within our nextgs course where we have a
completely separated video on eslint and
prettier setup with all the
configurations. With that said, we can
test whether it works by heading over to
page.tsx and make any kind of change to
a file like adding a space and then save
the file. You'll notice that immediately
it'll make some small changes with the
class names to fix some eslint rules.
Later on, you can notice that it'll be
doing many more things like fixing some
spacing within your application and just
making sure that everything looks
consistent whenever you save a file.
Now, let's clean this page up because we
don't need anything within it. This is
going to be our homepage. So, I'll only
have one div within which I'll have an
H1 that'll say store it. The only
storage solution you need. I'll also
give it a class
name equal to
text-3xl just so we can nicely see it in
the browser. There we go. This is
looking good. With this in place, we are
ready to implement our design system.
We'll do that by figuring out some of
the specific elements of the theme of
our application. In the style guide,
you'll see some of the elements such as
different headings, brand colors, and
more, which we'll be able to copy and
put into our Tailwind CSS config. So
let's do that
next. Setting up a Tailwind CSS theme is
something that we have to do for every
application independently because no
matter how many of the applications
nowadays follow a specific boilerplate
structure, still the designs of all of
them have some differences. For example,
take a look at this Dev Overflow
application that we have with this nice
light and dark mode and then compare it
with a much brighter storage
application. If anything, they have
different fonts and different brand
colors. So, the main question is how to
extract these values from these style
guidelines to be able to use them within
the application. This is something we go
into a lot of depth within our Ultimate
NexJS course, but let me give you a feel
for that right here as well. First
things first, you want to find a style
guide or if you don't have it, you can
extract some colors right here from the
application. There we go. You can see
that this one uses
FA7275, but in this case, we thankfully
have the style guide. So, we can go
right here and we can copy this color.
Next, you can head over to
Tailwind.config.ts. And by the way, I
just use a command or controlP keyword,
which allows me to very quickly move to
different files. I don't have to open it
and then go there. I just press command
P, start typing, and I'm immediately
within the file. That's just a little
pro tip. So, how would you go ahead and
extend your theme to match your
application's colors? Well, we can go
theme, extend colors, and I'll add a new
object called brand. And I'll provide a
default color for the brand. You can
provide a default by simply entering a
default keyword. And you can paste the
color that you just copied. And I'm also
going to provide a variation of that
color which we can get by saying
brand- and that's going to be #
EA6 365. After that, we can add all of
these other colors as well. For example,
you can see this green one right here.
Well, let's just copy it. Go back and
then go below the brand and then say
green. And you can simply paste it right
here. You get the idea, right? And how
would you go ahead and add these colors
right here? Now, you will need to repeat
this for other colors, and some might
even be hiding within the design, such
as this one right here. Now, just so you
don't have to manually search for all of
these colors, in the description of this
video, you can find the complete
Tailwind.config.ts file, where I took
some time to extract all of these colors
from the Figma I provided. Now if you
scroll down you'll be able to notice
that there is one package which we don't
currently have which is Tailwind CSS
animate which we'll use for some very
simple spin animations on loading logos.
So let's go ahead and install it by
opening our second terminal and running
mpmi-save-dev and we can paste tailwind
CSS animate and press enter. Once you do
that your application will be back to a
functional state. Now, let's head back
over to our homepage and let's see if we
can use this color. I'll type text dash
brand dash 100 or you can just say
text-brand to get the default one and
immediately you can see that it works.
Now sometimes you might use a series of
different classes to position an element
properly like let's say something that
you would always do display of flex
items center and justify dash center.
You'll see this always and in this case
we have to add the age- screen for this
div to take the full height of the
screen. If you do that this will nicely
center the text. We can also change the
background color to something like amber
100. And we can make this text bold by
saying font dashbold. And there we go.
Now you can see this in the middle of
the screen. But what would happen if
across many different components you had
to position things in the middle of the
screen. You would have to copy this
entire class name and then paste it
across all the other pages. And if
there's a change, maybe you want to give
it a border, you would have to make that
change across all files. So to make sure
that doesn't happen, we'll head over to
our
globals.css where we currently have some
predefined code given to us by the
next.js CLI. In this case, I'll remove
it. We are importing the table utilities
and I'll give it an at layer
utilities. And here we can define some
utility classes. What are utility
classes? Well, they help us make our
code more reusable. So if I head back
over to our div and copy all of these
classes, I can now write something like
this dot center at apply and I can paste
all of those classes right here. Then
going back to page, check this out. I'll
just simply say class name center. If I
do that, this page still works perfectly
and my code is looking much cleaner
because now I'm not cluttering it with
all of the other class names which have
to be reused. rather if I need to see
what they're about, I can go into our
globals. The combination of the Tailwind
CSS config and this globals.css file is
what makes the styling so much more
seamless, especially when working in big
applications. As you can see here, in a
lot of cases, we'll simply have H1 bold
or H1 XL, and we need to be able to
reuse those classes just like we reuse
the colors in the config. So in our
case, going back to the style guide,
we'll want to create a class for this
specific heading. We can click into it
to see what it is, but we also already
have some information here. In any case,
this is a heading one with a weight of
700 and it has this specific color. So
in your utilities, you would do
something like this.h1
H1 add apply
text-34 pixels leading -42 pixels and a
font-bold. And how do I know about
those? Well, because I can see that
right here. 34 pixels, leading 42, and
it is obviously bold. Now, you can
create different variations. For
example, an H5 would be 16 pixels of
text. It would have a leading of 24, and
it would be semibold. Going back to our
application now, I can use it right here
by simply saying h1. And it looks great.
Now that you know what kind of role the
tailwind.config.ts and the globals.css
files play into styling of our
application and considering the tailwind
config is already done, we can now
finish the globals in the GitHub readme
of this project. You can head over to
the code snippets, find the globals.css,
and paste it right here. As you'll
notice, we have a lot of these reusable
classes that are going to make the
styling of our application a bit easier.
I mean, how often do we have to use a
primary button or how often do we have
to center a div? Once you apply that
global, make sure that it is imported
within the
globals.css and immediately eslint will
let you know that we no longer have this
center class name, which is great, but
now we'll have some other ones like flex
dash center and hash-creen. And we're
back at where we started, but now with a
completely finished style guide for our
project. Next, let's focus on the first
thing that a user sees when they visit
the application. It's not the dashboard,
but the authentication. In this case,
it's going to be the login and
registration
screen. Before we go ahead and start
creating the authentication, we have to
be really smart in how we're planning on
architecting it. As a matter of fact,
you have to do that before starting to
code anything. Nowadays, AI can also
code UIs, but it's about how you
approach creating some of these pages
that matters, how you architect them.
So, in this case, let's try to compare
those two pages. We have the login and
we have the registration. As you'll see
on the login, we have some different
fields such as the email and the
password. I don't think we'll need a
username there. But on the create
account, we'll need all of these fields
like the username, email, password,
confirm password, and more. So we have
to figure out which things will be
repeated and which things will change.
In this case, we know that the entire
left side will be repeated as well as
some of the parts on the right side such
as the buttons. So what does that mean
for a NexJS application? How will we
approach that? When it comes to creating
different layouts and the routing for
those pages, Nex.js allows us to create
something known as group routes, which
you can create by creating a new folder
and wrapping its name within
parenthesis. Something like
O. Within O, we can create two new
routes, which are going to be different
folders that are going to have the name
of
sign-in as well as sign dash up. And
within those we can create new page.tsx
files. Within each one of these run
rafce which will create a new react
arrow function component. This one we
can call sign in. And we can repeat the
same procedure within the other one by
creating a new
page.tsx. Paste it and rename it to sign
up. Now, if you've done it correctly,
you might want to go to O and then sign
in. But you'll quickly notice that this
is a 404. That's because when you wrap a
folder's name in parenthesis, it doesn't
create a route. It's just a route group,
which means that it will not be counted
when navigating through different URLs.
So, to get to the signin, you just have
to say forward slash signin, and
immediately you'll be redirected to the
sign-in page. But what creating route
groups also allows us to do is to add a
new special file called
layout.tsx that allows you to show some
shared UI or functionality across all of
the pages within the route group. So
create a new
rafce call it layout and since it's a
layout it needs to have access to the
children. So I'll get children through
props and then I'll define children as
react react node. Immediately within it
we can render those children. But now we
can further style this div by giving it
a class name equal to flex and
min-hreen. Within it we can create a
section. So let's create it right here.
And within that section we can create
another div that will contain the image
which we can import from next image and
give it a source of dot do
favicon. Iico. We can also give it an al
tag equal to logo and a width of about
16 a height of
16 and a class name equal to age- auto.
You can see that prettier will
automatically restructure this for us.
And I just remember that we don't even
have to use the dot dot slash. We can
just start with forward slashfabicon.
And below it, we can render a div
that'll have a class name equal to
space-y and
text-w inside of which we can render an
h1 with a class name equal to h1 that's
going to say manage your files the best
way. Below it, we can have a p tag
that'll have a class name equal to
body-1. And it can say something like
this is a place where you can store all
your documents. And you'll want to give
this section a class name of BG brand as
well as a padding of 10 to give it some
breeding room. That's going to make it
look like this. And I think you can
already start seeing where I'm going
with this. The left side which is
rendered within the layout will be
shared across both the signin and the
signup. How do I know that? Well, we can
change the text within the page to say
sign in. And we can change the text
within the signup to say sign up. And
then you know that this is our layout.
So now if we are on the sign in, you can
see it right here on the right side. But
if I change the URL and go to the signup
page, you can see that now it says sign
up. So let's go ahead and finish the
layout so we can focus on the right side
which means showcasing the forms of our
application. But for the time being we
just want to get this nice looking logo
as well as this greatl looking 3D
illustration. To get it you can go to
Figma and then you can export this file
right here. For example, you can export
this entire icon which contains the
storage text by going to export and then
saying export logo. And you can do the
same thing by exporting this
illustration as well. Once you do that,
you can head over into your public and
delete all of the current SVGs within
the public folder and then drag and drop
the file that you just downloaded into
your public folder. We can rename the
logo to simply say logo. And we can
rename the second one to simply say
illustration. And now we can use them
right here by replacing this favicon to
simply say forward slash
logo.png. Let's give it a width of 224
and height of 82. And we can go below
this div containing the text and render
another image that'll have a source
equal to for equal to
slustration.png. Let's give it an al tag
equal to
files, a width of
342 and a height of 342 as well
alongside a class name of transition
dashall. What are we going to
transition? Well, on hover, we want to
rotate by
two. And on hover, we also want to scale
it a bit to 105. So if we save this and
go back, you can see this nice looking
illustration. And if you hover over it,
it rotates and scales a bit. So it looks
great. But as you can see, this
illustration looks a bit low res to me.
So what you can do is you can get it
with a higher resolution, like 3x or
more. But just so you don't have to
manually download each one of these
icons, and you can see there's going to
be a lot, such as these files, ones,
images, video, and so on. Not to mention
these ones on the sidebar as well as the
upload icons, log out, these ones right
here for different views, and so much
more. Just to make the process of
downloading all of these a bit simpler,
I went ahead and downloaded them for
you. So, the only thing you have to do
is delete the current public
folder, download and unzip the new one
from the repositories readme down below,
and then drag and drop it right here in
the root of your application.
It's going to contain all of the assets,
icons, images, and more. In this case,
we'll just have to rename the two files
that we used because here we're using a
bit of a clear name. So, the logo is
going to be under assets, icons,
logo-fool. SVG. SVGs are much higher
quality than PGs. And for the
illustration, we can get it by going to
assets, images, files.png.
Now if you go back, this is looking much
crisper. Let's play with the UI a bit by
giving this section a class name of
hidden walf. So it's going to take 50%
of the screen items center justify-
center on large devices flex. So what
does this mean? It means that typically
it'll be hidden, but once we reach
larger devices or higher, we want to
show it. And on extra-L large devices,
we wanted to take two-fifths of the
screen instead of 1/2. Also, notice how
ESLint saved me right here, saying that
just the center doesn't exist. This is
going to be just the fi center. Let's
also give this div a class name of flex
max-h00 pixels max-w of 430
pixels. Flex- call so the elements
appear one below another.
justify- center and
space-y-12 for some extra spacing on top
and bottom. There we go. Now the left
side is looking much better. But what
about the right side? Well, let's create
another section right below this
section. And this section will have a
class name equal to flex flex- one flex-
call. So the elements appear one below
another. Items dash center. This one
will have a bg white because it's on the
other side. Padding of four and padding
y of 10 for top and bottom. On large
devices justify center. On large devices
padding of 10. And on large devices
padding y of zero. Within it. We want to
display a div. And that div will have a
class name of margin bottom of 16. And
on large devices hidden within it, we
want to display an
image. And this image will have a source
equal to
for/assets/icons/logo-fool-and.svg with
an al tag of logo, a width of
224, and a height of 82.
with a class name equal to age- auto
W-200 pixels and on large devices W of
250 pixels. Finally, we want to put this
children within this second section
right below this div containing the
image. If we do that, you can notice
that we have nicely centered the signup
page as well as the content on the left.
Now, if we head over to the sign-in
page, you can notice that it doesn't
look as good, even though it's using the
same layout. Let's check it out. Right
here, we have the sign-in page and the
signup page and the layout right in the
O. What I'll go ahead and do is reload
the terminal by pressing Ctrl C to stop
it and then rerun mpm rundev. Now, I'll
reload the page and you can see the
changes took effect. Sometimes you might
need to reload your application if
something seems weird because we have
done everything correctly. We have
modified the layout which should result
in changing all of the files or all of
the pages within the O route group. So
now we ready to focus on the right side
implementing the O
form. To get started creating our O
form, let's head over to our file
explorer and create a new folder outside
of the app folder. and I'll call it
components. Within components, we can
create a new file called
o
form.tsx. Run
rafce. And now we can import it within
the sign-in page. We can do that by
simply immediately returning it here by
saying o form coming from components o
form which is going to be a self-closing
component. And to make it reusable,
we'll pass it a single prop called type
is equal to sign in like this. Now we
can do the same exact thing on the
signup. So let's copy this and move it
over to sign
up. If you don't have opening and
closing brace, then that means that
we're having an immediate return. So
we're immediately returning just the o
form. And that's the only thing we have
to return from both of these pages. Now,
right now, as you can see, the odd form
is complaining because we're not
accepting the proper type. So, let's
head over into the o form and let's
start implementing it. First things
first, I'll accept and dstructure the
type, which is going to be type of a
type. And we can declare it right here
above by saying
type form type is equal to either sign
in or sign up. And now we can just say
that this type will be of a type form
type. Perfect. And now we are ready to
start implementing a form which we'll
reuse for both of these pages. To
implement it, we'll use Shatzen, a
beautifully designed component library
that allows you to copy and paste code
into your apps. Specifically, we'll
search for form. And it says right here
that we'll be using React hook form and
ZOD because forms are tricky. They're
one of the most common things you'll
build in a web application, but also one
of the most complex. So in this case
they'll use the form component in a
wrapper around the react hook form
library which is going to just make it
so much easier for us to develop the
forms. Here they go a bit over the
anatomy give an example but what we are
interested in is the installation
process. So let's go ahead and follow
this together. I'll put this side by
side to my code editor right next to my
IDE. And now I can zoom it out a bit and
we can follow the installation process.
First things first, we have to install
SHAT CN because this right here is just
making sure to add this Shaten component
into it. But if I head back to
ui.shhatn.com and click get
started, head over to installation for
Nex.js, you can see that we need to run
mpxhatn at latest in it. So let's copy
this command and paste it right here.
Once you do that, it's going to ask us
whether you want to install the
installer. And after that, it's going to
ask you a couple of questions. Which
style would you like to use? In this
case, I'll proceed with New York. We're
going to use a neutral color. And we
don't need to use CSS variables. So, in
this case, I can switch over to no. Now,
it says it looks like you're using React
19 and some packages may fail to install
due to peer dependency issues. It's
asking us whether we want to use force
or use legacy pure depths. In this case,
I'll just press enter to use
force and it's going to install them. We
can see what this exactly did. If we
head over to the package JSON and check
the versions of dependencies, these have
remained the same, React 19. And I think
it's just going to work. So, let's head
back to the installation of the actual
form and let's copy this command that
will allow us to add the form to our
application. And once again, it's asking
us how we would like to proceed. I'm
going to say use
force. And it's going to add a form
button and a label. Now, how shatzen
works is completely different to all of
the other libraries such as material UI
or Bootstrap where by installing it, you
get all of the components immediately
within your code. But by using SHAT CN,
a new UI folder gets created and you can
only use the components that you
manually decide to install and use. In
this case, we're using a form component.
So, it brought all of this code to you.
So you can actually modify it if you
want to, but you won't really need to
because we're just going to use what
they provide to us and then style it
further by using tailwind and CSS. So
now that we have installed it, we can
continue with some of the additional
setup. Next, we have to define the
schema of your application. So let's
copy the next code block right here and
paste it at the top here. We make it a
use client because this is a form after
all. And we define the form schema.
After that, we have to copy the Zod
resolvers and use form as another pair
of imports. And then we have to define
this profile form. In this case, I'll
just copy what goes inside of the form
and paste it within our O form. That's
going to be the form definition as well
as the onsubmit
function. After that, we need to get
more imports. So, these are going to be
imports for inputs, forms, and buttons.
And I'm going to put them right here at
the top. And we then have to get the
actual UI of the form. So I'll copy it
and I'll paste it right here under the
return. If I do that and save it, ESLint
will automatically position everything.
And I'll take a second to explain how
all of this
works. First of all, it looks like the
input hasn't been installed by SHA CN.
So we can easily install it by saying
MPX shad CN at latest add input. After
that we can see that it got installed
and we have our form schema which right
now contains only the username. Then we
define our form by using the use form
coming from react hook form library and
we say that it'll be of a type form
schema meaning that we'll use the
username and we also set the default
values. Finally we define a submit
handler which we can use the arrow
function to do so. It's going to be an
asynchronous arrow function that accepts
the values and then for now simply
console logs them. Finally, right below
we return the form with a single form
field. So if we go back to our
application specifically to the sign-in
page, you should be able to see a
beautiful looking input. Of course, if
you go to desktop devices, you'll be
able to see that it looks even better.
But on mobile, we remove this left side
because we don't have any space and just
show store it on top. Now, let's modify
this form field to make sense in our
case to turn this into an odd form.
First things first, I'll wrap this form
into an empty React fragment, and I'll
close it with it as well, because later
on, we'll have our OTP verification
happening right here. For the time
being, I can simply comment it out, but
later on, we'll add it back in, which is
why we need to turn this into a React
fragment. Now we have this form here and
let's give it a class name equal to
O-form. This will give it a full width.
Right within the form we can create an
H1 and this H1 will check if the type is
sign up. So we can say type is sign in
then it'll say sign in else it'll say
sign up. We can also give it a class
name equal to form-ashtitle. Now let's
go below and we have a form field. This
form field will only show if we're on
the sign up. So we can say if type is
triple equal to
sign-up in that case render this form
field. And of course we'll have to
properly close it right here if that is
not the case. So since we're on the
signin, we don't have any fields right
now. But if I head over to sign up, you
can see that we still don't have
anything. Why is that? Well, let's head
over to the sign up page. And it looks
like I forgot to change the type. So,
this perfectly illustrates how we can
use props to modify how a reusable
component should look like. Now, what
will this first form field be about?
It'll be a full name field where we
return a form item. And within a form
item, we have a div element with a class
name equal to shad form
item within which we display a form
label. And that form label will simply
say full name. Next, right below it, we
have a form control with the input. In
this case, we don't have a description.
So, it'll look something like this. Form
label and form control with the input
within the div. And then form message
right below.
Let's style this label a bit by giving
it a class name equal to
shad-form- label. And let's go into the
input and give it a placeholder equal to
enter your full name. And we can give it
a class name equal to
shadinput. Finally, we can give this
form message a class name equal to
shad-form message. That happens if there
is some kind of an error. We can nicely
show it below. Now let's duplicate this
form field by copying it and let's paste
it below this check for the signup. The
second one will be displayed either way.
So we can change it to email. Next we
can change the label to email as well.
We can change the placeholder of the
input to say enter your email. And
that's it. The rest will be the same.
Since we'll use OTP verification, we
don't even need a password field. OTP
verifications are more secure. You'll
see how that works very soon. Now, below
this form item, we can render a button
with a type of submit. It'll also have a
class name equal to
form-submit-button. And within it, we'll
check if type is equal to sign in, then
it'll say sign in. Else it'll say sign
up. And there we go. We have our
beautiful button. We can also have some
kind of a loading state. So I'll go up
and I'll create a new use state field
right at the top of the component by
using the use state
snippet. I'll call it is loading set is
loading at the start set to false. And I
like how my webtorm immediately tells me
that this false actually stands for the
initial state. Now if I go down below
this text still inside the button if is
loading is true then I'll render an X.js
image that'll have a source of
forward/assets/icons/loadader.svg
SVG an al tag of loader a width of 24 a
height of 24 and a class name of margin
left of two to divide it from the text
and animate dash spin. So if I simulate
loading by turning this default variable
to true, you should be able to see how
that looks like. There we go. Sign up.
And at the same time, we can also
disable that button because we cannot
click it again if it's loading. So we
can give it a disabled property and
it'll be disabled if is loading is true.
Now let's go below the button and there
I'll check if we have an error message.
So if error message is true then I'll
render a p tag that'll render an
asterisk and then error message and we
can give it a class name equal to error-
message. Of course, this error message
is a new state which we have to create
which we'll use to track the state. So
I'll use a new use state snippet to
quickly spin it up. I'll call it error
message and set error message and the
start equal to an empty string. Now if
we go down, we can go below this error
message and we can render a div. This
div will have a class name equal to
body-to flex and justify- center. Within
it, I'll render a p tag that'll check if
type is sign in. Then it's going to say
don't have an account. Else it'll say
already have an account like
this. Of course, we have to give it a
class name of text-
light- to make it a bit muted. And then
below this B tag, I'll render a link
component coming from next link, I'll
give it an href. And if the type is
triple equal to sign in, then it'll
point to sign up. Else it'll point to
sign in. So basically the other one.
I'll also give it a class name equal to
margin left of one font- medium and
text- brand. The link can say if type is
sign in then sign up else sign in. But
it looks like I imported the wrong link
component. This link should actually be
a default import and it should be coming
from next forward
slashlink. There we go. So now we can
see the text and check this out. If you
click it, we can now move between those
two different pages. This is looking
great. I'll remove the form description
since we don't use it. And let's head
back down. Looks like this animate spin.
I misspelled it. Nice how ESLint caught
that for me. That was supposed to be
animate spin and we can continue right
below. Now that we have implemented the
UI of the form, we have to look into
making it functional because right now
you can see that our names have some
kind of errors saying that email is not
assignable to type username and that's
because all of this is so neatly hooked
up to our use form the default values
and the form schema. So let's actually
modify it to reflect our use case. Right
here at the top I'll say const O form
schema is equal to and then given the
form type of this form which is going to
be of a type form type I can return
different things. So I'll return a
Z.Object which stands for zod that'll
have an email field and we'll have the
email field always. So that's going to
be Z.string string and email. But we can
also sometimes add a full name and the
full name will only be there if the form
type is triple equal to sign up. In that
case, we can have a
Z.string
min.max 50 else Z.null. So what this
means is that this o form schema will be
different given the type of form we're
on. So let's actually pass it right here
by saying const form schema is equal to
o form schema which we call and then
pass the correct type to it. We also
need to modify the default values. So
for default values I'll say full name is
an empty string and I'll also say email
is an empty string as well. And we can
delete the previous form schema. And now
we can see what error do we have here.
It seems like there's an error with this
input saying it's not assignable to
null. Yep. So in this case, instead of
using the null, we'll use the dot string
and then dot
optional on it. There we go. That makes
more sense. And now our input isn't
complaining. So now if you click sign
up, you can see that it gives you a
required field and an error for both of
these. That is exactly what we wanted.
Same thing for detailed validation.
string must contain at least two
characters or this has to be a valid
email. I mean implementing this
validation is just super easy using zod
validation. Now what error do we have
here? A component is changing an
uncontrolled input to be controlled.
This is definitely something we can look
into but I don't think it's even
happening anymore. So I think we're
good. And as I said we can now switch
between both of these forms. Now the
question is are we getting those values
right here once we submit? Let's give it
a shot. If I go to inspect element and I
open up the console and I clear it, I'll
try to enter my name Adrian and my email
and I'll click sign up and take a look.
We get an email and the full name right
here in the object. And that means that
we are ready to sign the user up or in
this case actually create a user in the
database. And of course, I don't even
have to mention that this application
looks so much better on desktop devices.
This is great. So, with that in mind,
let's go ahead and implement our backend
system next. So, we can actually create
user accounts, store those users in the
database, and allow them to attach their
files to their store management
solution. To develop our backend, we'll
use AppRight. It allows you to build
entire backends within minutes and scale
effortlessly using their open source
platform. Of course, even though it says
you can do it within minutes, don't be
fooled. This is not some kind of a
plug-andplay no code backend system.
Rather, you have complete control over
your O databases, functions, storage,
and more. For this project, we'll use
the database functionalities,
authentication to authenticate our
users, and finally storage to keep track
of our files. Now, I like using Apprite
because it is simple to set up and most
importantly, if you take a look at their
pricing, you'll notice that with the
free plan, you get unlimited projects
which are never paused. And this is what
is super important. Some other tools
allow you to use their software for a
specific period of time, but then they
pause your projects. Here, you can have
unlimited that are never paused, and you
get more than enough bandwidth, storage,
executions, and everything else to be
able to run your project. If your
project doesn't get tens or even
hundreds of thousands of users, you'll
most likely never have to upgrade to a
pro tier. But even if you do, I've got
you covered. By clicking the link down
in the description, you'll be getting 50
bucks worth of free credits if you do
decide to upgrade. So, with that said,
click the link down in the description
to be able to follow along and see
exactly what I'm seeing and then sign in
with GitHub. Once you do that, you can
create a new organization or just choose
personal projects and apply credits if
you need to. And you'll be able to apply
the credits if you actually do decide to
upgrade. In this case, I'll just head
over to my dashboard and create a new
project. Call it JSMore and then give it
a name. I'll use store it. You'll have
to do something else. Click next. I'll
choose Frankfurt as it's closest to me.
And there we go. Our project has been
created. Oh, this is pretty cool. The
weekly database backups are now
available. I'll choose a platform in
this case web. And we'll have to enter
the name of the web app. So I'll just
say store
it web. And for the host name, I'll just
put asterisk. So everything works for
now. Next, appite is going to guide us
through the installation process. For
now, you can skip these optional steps
as we're going to do everything
together. Let's start by copying our
environment variables. I'll put my
browser side by side by the editor and
I'll create a new enenv.local file
within which we can store our
environment variables. First things
first, let's create a
next_pub_apprite project and make that
equal to this ID that we just copied.
Right below it, let's head over to
databases and then let's create a new
database. I'll give it a name of general
and create. We can also copy this ID
right here by giving it a
next_public_apprite database and set it
equal to the ID that we just copied.
Within this database, we can create two
different collections. Let's create a
first one which is going to be called
users. And let's copy its ID as well. We
can add it to our env by saying
next_pub_appite
users_colction is equal to this ID here.
And while we're here, let's immediately
add some attributes that each one of our
users will have. Head over to the
attributes tab and click create
attribute. Let's start with a string.
And let me actually expand the browser
and give it a key of full name size of
255. No need for the default. and let's
make it required. Let's create another
one. This time of a type email. It's
going to be called email and it'll also
be required. After that, we can create a
new avatar which is going to be of a
type string. And we don't have to enter
the size and we don't have to make it
required. I'll just click create. Oh,
but that says that we have to add it.
So, I'll choose the maximum number for
the size. Remove the comma from here and
click create. Finally, let's add another
string of account ID of a size 255 and
make it required and click create. After
that, go to settings, head over to
permissions, click any and make sure
that all boxes are checked. This is
going to give us the right permissions
to be able to update the users in this
collection. Now, we can repeat this for
another collection. So, let's go back to
our database and create a second
collection, which is going to be called
files. Once you create it, you can copy
its ID and duplicate this one right here
and rename it to next public files
collection and paste the new ID. Once
you do that, we can also add some
attributes such as a name. Each file can
have its own name. Let's enter a size of
255 and make it
required. After that, we have to give it
a URL and the URL will be of a type URL.
So let's call it URL and make it
required as well. Next, we can choose a
type of the file which is going to be of
a type enum. So let's search for
enum. Let's call it type and different
elements that it can have are going to
be
document image and just to create new
ones just press space or add a comma
video and audio and other make it
required and click create. After that,
let's add a bucket field. So, this is
where we're going to be storing that
file. Let's choose 255 and make it
required. After that, let's add another
one which is going to be a string of
account ID of 255 and it'll be
required. After that, let's create a
relationship. So, that's the last thing
right here. It's going to be a two-way
relationship related to the collection
of users. And the relation will be many
to one which means that files can only
contain one user while users can belong
to many files. The attribute key right
here doesn't have to be users it can be
owner. So who owns the file and on
deleting document set it to null and
click create. Finally we can also keep
track of the file extension. So let's
say
extension of size
255. Don't have to make it required.
Finally, we can keep track of an integer
which is going to be the size of the
file. We don't have to make it required.
And finally, we can share that file with
some people. So, let's create a new
string called
users. And here we'll actually create an
array of users. So, click create. And
you can choose any kind of size. I'll
enter the same max value that we have
right here. And click create. And I
believe that's it. We just have to go to
settings, head over to permissions, and
choose any and tick all the boxes. That
way, we won't have any problems with
permissions. And finally, we have to
head over to storage, which is the last
icon right here, and create a new
bucket. Let's call it file storage.
Click create. And you'll get the ID of
that bucket. Once you get it, let's
collapse it. And let's create a new
next_public_appite_bucket is equal to
this ID right here. Great. And believe
it or not, that's it when it comes to
the app right setup. Now we can focus on
integrating apprite within our code to
then store our users data and files. So
let's do that by installing a node app
package. This one right here. It'll
initialize your SDK with the apprite
server API endpoint and project ID that
we just created. So you can very quickly
perform any kind of actions or requests
through SDK calls. I'll show you how
that works. But first we have to install
it. So let's go open up the terminal and
run mpm install
node-apprite-save. And this is a common
problem since we're using the latest
versions of Nex.js. To fix it, head over
to package.json. JSON and check our
versions. We're using the latest
versions of
Nex.js, but React is under RC versions,
but it's still possible that some other
packages might not yet work with the
latest versions of React. So to fix
that, we have to add a new object called
overrides. And in overrides, we can
specify that all packages have to use a
version of React that is defined in the
dependencies. And we can do that by
saying dollar sign react. And we can
repeat the same thing for react. If you
do that, let's try running the same
command one more time. mpm install node-
apprite. And as you can see now, it
worked like a charm. Now, just so we
don't have to recall these environment
variables every time by their name, what
we can do is create a new file in the
lib folder or rather a new folder called
apprite. And within it we can create a
new file called
config.ts. And inside of this file we
can import all the
enviately for easier access. We can do
that by saying export const appite
config is equal to and now here we can
pass over all the links. Endpoint URL is
equal to process.env.next
next underscore public underscore
apprite underscore
endpoint and we can add an exclamation
mark at the end so typcript knows that
we know that the variable exists there.
So let's actually make sure that it is
indeed there. We can go over to env
local and it looks like we're missing
the endpoint. So let's add it by saying
next_public_appite endpoint which is
going to be equal to https col/
slashcloud.apprite.io
slashv1. Now let's repeat the process
for all of the other variables such as
project ID is process.env.next
Next public apprite
project. Next we have a database ID
equal to
process.env next public apprite
database. And now that I look at it, the
easier way to approach this would be
just to copy all of the names. So let's
copy them, paste them here, and divide
them by commas. And then add the proper
names right here at the left side. So it
can be something like users collection
ID is going to correspond to the
outright users collection. Next we have
the files collection ID which is going
to correspond to files. And last we have
a bucket ID which is going to correspond
to the apprite bucket. We can also add
exclamation marks at the end. So we tell
Typescript that we know that the
variable is indeed here because we know
that it is coming from
process.env. Right below it we can also
add the final variable called secret key
which is going to be equal to
process.env next
apprite_key exclamation mark. As you can
see we don't have the keyword public in
front of it because this will not be
publicly available on the front end only
on the backend server actions. Great.
With that said, we now have this file
which we can use to initialize the
AppRight Node SDK. Now, scroll down and
head over to integrations and click API
keys. Create a new API key and let's
give it a name, store it. And I'll set
the expiration date to never. Once you
do that, you can select all scopes and
click create. As soon as you do that,
you'll get your secret key. So, copy it
and let's add it right here to our
environment variables.
as next underscore
apprite secret and make it equal to the
key that you just copied. Now we are
finally ready to start setting up our
app right config. Within the app right
folder in the lip folder, create a new
file called
index.ts. This is where we can put our
setup. In our case, we'll be using node
app SDK so we can make sure that all of
our services work on the server side. To
use node apprite we first have to create
an apprite client. So let's do it by
saying export const create session
client is equal to an async
function inside of which we can declare
our client and set it equal to new
client which we can import from node
apprite and then on it we can call a set
endpoint which we can set to appreite
config coming from config.ts ts dot
endpoint URL and we can call a dot set
project which we can set to operate
config dot project id. This client will
be used to initialize instances and
services like databases and accounts
ensuring that they stay connected to the
same apprite project. There are two
possible ways to create a client. create
an admin client and create a session
client. In this case, we're creating a
session client as you can see by the
name of this function. This client will
be linked to a specific user session
letting users access their data and
perform actions they're allowed to such
as when logged in users can manage their
own data like view or update their
profile. On the other hand, the second
function export const create admin
client which is equal to an async
function. This one, on the other hand,
is much more powerful. This one creates
a client instance with admin level
permissions to manage your entire
AppRite project. We're going to only use
it on the server when we need to do
things like create users, manage
databases, or handle tasks that need a
higher level of access. This should
never be exposed to the users directly.
And you might be asking, why are we
going to create a new client for each
request? Well, the reason is because
sharing the same connection between
requests can lead to security issues
like exposing someone else's data or
session. So, always create a new client
connection for each request to keep data
safe and secure. Now, let's continue
setting up our session client by
creating a new session variable equal
to. In this case, I will await
cookies coming from next headers. And
then outside of that, I'll call a get
apprite dash session. Next, we can check
if no session. So, if the session
doesn't exist or if there is no session
value, we want to simply throw a new
error that's going to say no session. If
there is a session, we will say client
set session and we'll set it as session
do value. Finally, we want to return two
different getters. Return get account
which will simply return a new account
coming from apprite to which we pass the
client.
And we can create one to get
databases which will return new
databases which we have to import from
apprite. So get databases. As you can
see all of these are coming from node
apprite. Make sure to add a comma right
here. And this is our create session
client. Now we can do a very similar
thing for our admin client. So what I'll
do is I'll copy the entire code within
create session client and I'll paste it
within create admin client. I'll keep
everything the same but I'll remove
everything that has something to do with
the session. And after we set the
endpoint and set the project, we want to
set the key that will allow us to
perform admin actions which we have
under apprite config secret key. Finally
we return get account get databases but
in this case we can also get storage and
within it we can return a new storage to
which we can pass the client and finally
we can also do get avatars where we can
return new avatars and also pass the
client. Make sure to import the avatars
coming from node apprite and same thing
for storage. Make sure to import it from
node apprite. There we go. Now we're
looking good. We have functions that
allow us to create admin clients and
session clients that will then allow us
to use all of these functionalities
which we're exposing right here. Account
and databases for the session client as
well as everything else for the admin
client. So with that in mind, let's
create our first server action that will
allow us to sign our users up. I'll head
over to lib and create a new folder
called actions. And within it, I'll
create a new file called
user.actions.ts. And here we'll focus on
the create account flow. That flow will
look something like this. So I'll just
put it here as a comment just so we know
what we're working on. We first want to
make sure that our user enters their
full name and email. Then we need to
check if the user already exists using
the email which we will use to identify
whether we need to create a new user
document or not. After that we send the
OTP which is a one-time password to the
user's email. Step four is to have a
secret key for creating a session. Step
five is to create a new user document if
the user is a new user. Step six is to
return the user's account ID and finally
verify the OTP to authenticate the
login. So let's create a new server
action called const create
account is equal to an async function
that will accept a full name and email
which we will dstructure of a type full
name
string and email of a type string and we
can open up a function block that's
going to look something like this. Now I
just remember that we have to call this
on the server side which means that we
have to give this function a use server
directive just like this to make sure
that this code never gets run on the
client because otherwise we might expose
our secret key. In the same way another
file that should never be exposed is our
index.ts within the lib folder here. We
also have to make this a use server only
file. So good thing that I remember to
do that. Now let's create this create
account function or server action should
I say. First things first we want to get
access to the potentially existing user
by saying constex existing user is equal
to await get user by email to which we
pass our
email. Now this get user by email
function is something that I will teach
you how to create. It'll be a helper
function which we can create just above
the create account const get user by
email which accepts one parameter of
email of a type string and let's turn it
into a functional
component and within it we can get
access to the
databases by saying equal await create
admin client. Okay, so we want to get
access to the admin client permissions
over the database and we have to make it
async because we're using a weight here.
Below it, we'll say const result is
equal to a weight
databases.list documents. And
specifically, we need to tell it which
documents we want to get. So we'll get
the documents from the database with the
id of appert config database ID and from
the user collection which we can get by
saying apparate config user collection
ID and we have to write a query which is
something like
query coming from
apprite equal email is the email we're
searching for and I think we need to put
it within an array. Once we do that, if
we have the result, we can then say if
result dot
total is greater than zero, then we can
return the result. documents zero. Else
we can return null because we cannot
find a user. And now within create
account, we have this nice helper
function allowing us to fetch the
existing user. Now if we have an
existing user we can then get its
account ID by saying const account id is
equal to await send email
OTP to this specific
email. Once again, this is another
function that we have to create const
send email OTP onetime password which is
an async function that accepts an
email and that's going to be an email of
a type string. And here we can once
again get access to the account
functionalities by calling it from the
create admin client. We can open up a
try and catch block that's going to look
something like this.
In the catch we get the
error and in the try we can try to get
access to the session by saying con
session is equal to await account
dotcreate email token to it we can pass
a unique user ID by saying id dot unique
and this is coming from apprite and the
second parameter is the email we want to
connect it with that's going to give us
access to the session so we can return
the session
dot user
id and in the catch we can simply handle
that error. So instead of simply console
logging it I'll actually create another
helper function con handle error where
we have access to the error of a type
unknown and we have a second parameter
of message of a type
string and here we can simply
console.log log the error and the
message and I can simply throw that
error. So now we can call this handle
error function and simply pass the error
to it and then some kind of a meaningful
message like failed to send email OTP
and don't forget to import this ID
coming from apprite specifically node
apprite. So let's get it right here.
query and ID coming from node apprite.
And I think I can remove this comment
right now because you know what we're
doing. I'll repeat it one more time.
We're trying to get the user by
email. Then we will send it a new OTP
verification to make sure that the user
who entered that email is actually the
user under that email. After that, we
will get its account ID and we'll make a
check. If there is no account ID, we're
going to simply throw a new error.
Failed to send an OTP. And finally, we
have to have a case where there is no
existing user. We can get access to the
databases functionality because we'll
have to create a new document in the
database. So we can say await
databases.create
document. First we have to say where in
which database we want to create it. So
that's appreconfig ID. Then we have to
say to which collection we want to add
it to. That's going to be the user
collection ID. Then we have to give the
ID of this new document we want to
create. That's ID unique. And then we
have to pass the actual data which is
going to be the full name. It'll be
email. It'll contain an avatar which is
going to be just a random placeholder
avatar logo. So if you search for avatar
image, we can find a random placeholder
one. Yeah, I think something like this
will be good. So I will simply copy its
image address and I'll paste it right
here as a string. And finally, after
avatar, we want to make sure to give
this user an account ID. Finally, we can
go below this create
document and below this if where we're
checking for the existing user and we
can return parse
stringify and then to it we can pass an
object containing the account ID of this
new user. But what even is this parse
stringify? Well, this is going to be a
simple utility function which we can
create in the utils file. It's going to
look something like this. Export const
parse
stringify which is going to accept a
value of an
object. For now, I'll set it to unknown.
And it's going to return
JSON.parse of
JSON.stringify of that value. Whenever
passing large payloads through server
actions, we first have to stringify and
then parse that value. So that's the
reason why we're doing this. And we'll
be doing that many times. So instead of
simply saying JSON parse JSON stringify
every time, we can use this function
parse stringify which we can now import
from
utils. Great. And that is our create
account server action. Oh, I just
noticed one thing. I misspelled
existing. You can see even webtorm is
pointing this to me. Typo in word
existing. And now it's giving me a
couple of options to rename it to
existing. There we go. That's much
better. Now let's export this create
account function so we can use it within
our form. I'll head over to o
form.tsx. And remember where we left off
right here under the onsubmit. So here
once we start submitting we want to set
is loading to be true because we're
doing some action.
And then we want to try to create a new
user by saying const user is equal to
create account which is now coming from
our server actions and to it we have to
pass the full name and email. Full name
will be equal to values.f fullname and
email will be equal to values.mmail. If
we don't have a full name we can just
set it as an empty string which is going
to be the case when we're trying to log
in. So we can set it as empty string
right here. Now let's create a new use
state
snippet. And I'll call it account ID and
set account ID at the start equal to
null. And right where we have the user,
we can call set account ID and set it to
user.ac account ID. But we only want to
perform this if we're on the sign up
functionality. So let's actually open up
a new try and catch
block. And in the try, I'll call this
functionality that I just added. And in
the
catch, I'll simply set an error
message to something like failed to
create an account. Please try again. And
we can also have a
finally in which case we're going to
simply stop the loading no matter what
happened. So we can say set is loading
to false and as soon as we start
submitting we can reset the error
messages. So the error message is an
empty string. Now in this case it looks
like it's saying that user account ID
does not exist on type promise which
means that we have to await the
functionality of create account. So
let's add the await keyword right here
and this should be enough for us to test
the process of creating an account. So,
let me enter my name right here and let
me enter my email and I'll click sign
up. There we go. We saw a loading and
even though it appears like nothing
happened, I believe the request has been
sent. And would you look at that? Hello.
Enter the following verification code to
securely sign in to JSM store account
330792. But now a better question is
where the heck will we enter that
password? We don't have an OTP modal.
This is the thing I'm talking about. So
in the next lesson, let's focus on
creating this modal so we can finally
perform a first action that would
connect our UI, the front end, with the
server side, allowing us to create an
account. To get started creating our OTP
modal, let's head over to components.
And within it, let's create a new file
called OTPO.tsx.
While you're in there, run rafce to
quickly spin up a new React functional
component. And let's import it just so
we can see it. But the better question
is where are we going to use this OTP
modal? Well, it only has to be used on
the sign up page. And specifically, the
signup page itself refers to the O form.
So, we're going to put it right here at
the bottom of the O form. I think we
have already left a comment for
ourselves right here. specifically will
only do it if an account ID exists. So
if account ID exists that means that the
user has tried to verify themselves and
then we can show an OTP model. So let's
render it properly. OTP model coming
from components modal and to it we can
pass the email coming from
form.get values and I'll pass the email
and finally the account ID is equal to
account ID. We'll use these props within
the OTP model to make sure to verify our
user properly. So now we don't have any
kind of an OTP right here because the
account ID is set to false. But for the
time being, just so we can see what
we're developing, I'll render this if
it's true. So the OTP model appears on
the bottom. Of course, right now the OTP
model is not a model quite yet. It is
just a piece of text, but the goal for
this lesson is to turn it into a modal.
And to do that, we'll use Shatien's
alert dialogue that when you click it,
it'll show some kind of a modal. So with
that in mind, we can follow the
installation by heading over to our
terminal and then pasting MPX shaden at
latest add alert dialogue. And you can
just press enter to use
force. And now we can copy its usage. So
right here at the top we have the
imports. And then right within the JSX I
can actually render the alert dialogue.
And that's it. That's how you create a
dialogue. Can we see it in action? Well,
click open. And there we go. It's super
easy to do things with CHN, but it's
going to be even easier because we're
going to pair this model with an input
OTP accessible onetime password
component with copy and paste
functionality. So now you can simply
type in your keyword and that's it. To
install it, we can once again just run a
command. And I just noticed that we
didn't continue with the rest of the
questions Shhatzen asked me. So I'm just
going to press Y for yes. And I'll run
MPX shaden at latest add input OTP.
Again, we'll have to answer two of the
same questions. It's quite likely that
by the time you're watching this video,
you won't even have to do that. But now,
as you can see right here, for this to
work, we have to add some things to our
Tailwind config. So if we head over to
our Tailwind config and search for key
frames, you can see that I already added
this beforehand. So we should be good.
And after that, we can just import it
and use it. So let's do just that. Right
at the top, I'll copy all of the
imports. And right here, I'll copy the
input OTP. So where are we going to use
it? Well, we're going to use it below
the alert dialogue header. So here the
alert dialogue header ends. And then
right here above the alert dialogue
footer. So I'll simply paste what I
copied. And that's it. If I go back, you
can see something that looks like an OTP
modal. Of course, we're going to style
it further and make it look so much
better. So let's do that. Starting from
the top, we have the alert dialogue, but
in this case, I want to manually manage
its state by creating a new use state
field. So I'll say use state and I'll
call it is open set is open at the start
set to true because once we have the
account ID we want to make sure that it
is already visible. Next we have another
state which is going to be the value of
the one-time password. So I'll call it
password set password at the start set
to an empty string. And finally we have
the loading state. So I'll create a new
use state field with is loading set is
loading at the start set to false. Of
course, a form wouldn't be a form if we
didn't have a submit handler. So, I'll
say const handle submit is equal to an
async function that accepts an event
which is going to be of a type react.
Mouse event, specifically an event on an
HTML button element just like this. And
make sure to import react from React.
And then at the start, we can prevent
the default because you already know the
default behavior of the form. when you
submit it, it reloads. We don't want to
do that. Next, we want to set its
loading value to true. And then we want
to open up a try and catch block. In the
catch, we have an error where we simply
want to console.log the error. Or we can
do something like, you know, failed to
verify
OTP. There we go. At the end, we'll set
is loading to false. Whatever happened,
we are no longer performing any kind of
OTP action. And in the try, this is
where the magic happens. This is where
we want to call an API to verify the
OTP. So, we'll do this very soon, just
after we complete the UI that would
actually allow us to do so. And also,
you know how some users might not do it
on time when they get the first email.
So, we're going to also create a
function that would handle resend OTP.
So in that case if they don't manage to
do it on time or if the first email is
for whatever reason not there in that
case we can just resend the email. So
I'll just say call API to resend OTP.
Great. And now we can focus on the UI on
this alert dialogue. We can pass the
open state which is going to be equal to
is open. And on open change will be set
to set is open. That's going to make it
always opened because is open is always
true. Next, in this case, we don't need
the alert dialogue trigger here. It'll
be triggered programmatically once the
user clicks the submit button. After
that, we have the alert dialogue content
with a class name of shad alert
dialogue. Next, we have alert dialogue
header with a class name of relative
flex and justify center.
Next, there's an alert dialogue title to
which I'll give a class name of H2 and
text- center. And we're going to say
something like enter your OTP onetime
password. Below the text, we can also
render an
image. And this image will have a source
of forward slassets/icons/clo--dark.svg
SVG with an AL tag of
close, a width of about 20, a height of
about 20, an on
click of set is open to false. So, we
want to close the model, and a class
name equal to OTP close button. If I
save this, you can see a little close
button at the top right, which would
close the form. Next, let's mess with
the description a bit by giving it a
class name equal to subtitle- 2 text-
center and text- light 100. And here we
can say something like we've sent a code
to we can open up a span and then say
email. And this email of course is
coming from props because we have passed
them into our OTP model from the odd
form component. So let's dstructure
them. I'll get the account ID as well as
the email and these will be of a type
account ID is of a type
string and email is of a type string as
well. Okay, that is great. Now we can
say we've sent a code to and in this
case we actually cannot see an email.
That's because we're still testing the
model. Typically, you would never see
the model as soon as you open the sign
up page at the moment when the user
hasn't yet entered their email. But in
this case, we can see it because we're
testing it. But later on, the email will
always be there as it'll be picked up
from the form. So, we're okay here.
Also, we can escape the apostrophe sign
right here by using this combination of
letters. And for this span, let's give
it a class name of padding left of one
to divide it a bit from the left and
text dash
brand just to show you how that would
look like. It's something like contact
atjsmastery.pro. There we go. That's
going to be very nice. For now, I'm
going to leave it dynamic. So once the
user is actually filling it out, we can
nicely show it. Next we have the input
OTP with a max length of six with a
value of password and an onchange we
simply want to call set password. We
have an input OTP group to which I'll
give a class name of
shadotp and then I will remove the
second group and the separator because
we want to show all six in the single
group just like this. Now, as you can
see, that's going to kind of separate
them a bit, but we want to make them
appear more together. So, I'll hold the
Alt key on my keyboard and select these
different lines. And then I can type the
same thing in all six lines, such as a
class name of
shad-pot. And if I save it, you can see
that now they have gotten a look that is
more on brand and better matches our
design. This is beautiful. And again,
the fact that we can just use Shhatzen
here to develop these very nice and very
functional looking components for
something that would typically take us
hours to develop is just out of this
world. So yeah, just wanted to say that.
Now we can go to the alert dialogue
footer and within it we can create a new
div that'll have a class name equal to
flex
w-ool flex- call and a gap of
four. Within it we can render an alert
dialogue action which is this one right
here. And I'll give it an on click
property which is going to call the
handle submit functionality. And it'll
have a class name of
shadsubmit-bn with an h of 12 and a type
is equal to button. If we do that now
you can see a nice
continue. And in this case we don't even
need the cancel because we already have
the close on the top. There we go. It
can say something like submit. And
within it, we can render a self-closing
next.js image with a source of forward
slashassets/icons/loader.svg with an al
tag of loader, a width of 24, a height
of 24, and a class name equal to margin
left of two to divide it a bit from the
submit text, and animate dash
spin. And we can save it. And now we can
see the spinning thing. But we'll only
show this when it's loading. So we can
say is loading. And if that is the case,
only then do we display this image.
Finally, for clumsy users that didn't
get the first email or it ended up in
spam, we can go below the alert dialogue
action and create another div. And this
div will say something like didn't get a
code question mark. We can create a new
button that'll have a type equal to
button, a variant equal to
link, a class name equal to padding left
of one and text- brand, and finally an
onclick property of
handle resend OTP. And then we can say
something like click to resend. Of
course, we have to import the button
from dot
/components. And we can escape the
apostrophe character right here by using
this keyword. Also, we don't have to
call this function immediately. We can
just make it a function declaration.
Okay, this is looking good. But let's
style it a bit better by giving this div
a class name equal to subtitle- two
margin top of two text- center and text-
light- 100. And if I save it, this is
looking much much better. We have a
beautiful OTP model that looks great on
mobile but also looks great on desktop.
I would dare to say even better. So with
that in mind, we are ready to submit our
OTP form to actually try to verify the
action on the server. Okay. So let's
implement the handle submit
functionality inside of which we have to
call the verify secret server
action. So let's create it under actions
user actions and below all of these send
email OTP and everything we're going to
create a new one export const verify
secret which is going to be equal to an
async function that accepts an account
ID and the password and we have to
define the types account ID is of a type
string and the password is of a type
string. as well. And finally, we can
open up a function block right
here and get access to appreite account
functionalities by saying const account
is equal to await create admin client
which we can call like this. As a matter
of fact, let's put this into a try and
catch block just to make sure that
something doesn't go wrong. So this will
go into the try and in the catch we can
have a catch where we call a handle
error failed to verify OTP. So once we
do have the client we want to generate a
new session for that client by saying
const session is equal to await
account.create
session and to it we can pass the
account ID and the password. Finally we
want to set that session to a cookie. So
we can say await cookies coming from
Nex.js which we can call
set and we want to set an app dash
session to session secret and we want to
pass additional options such as a path
of forward slash http only set to true
same site set to
strict and finally secure set to true.
These are all some precautions we have
to make when generating a session and
setting it to cookies. Finally, we can
return parse stringify. And then we want
to simply pass an object with this
session
ID being equal to session dot dollar
sign ID. There we go. So now we have a
function called verify secret which we
can call within our OTP model. We can do
that by saying const session id is equal
to await verify secret to which we can
pass an object containing the account ID
and the password. Once we have it, we
can check if session ID exists. And if
it does, we can use the Nex.js router
functionality by declaring it above con
router is equal to use router coming
from next navigation not next router. Be
careful about that. And we can simply
say if session ID
router.push at push. Where do we want to
push? To forward slash, meaning just go
to the homepage. And let's properly
spell the router. And let's make sure
we're properly mounting it. Cons router
is equal to use router. And as you can
see, we have an error. Next router was
not mounted properly, which is not
really a descriptive error enough, but
it's enough for me to notice that I
forgot to pass a use client at the top.
Considering that we're using forms and
hooks and routers and more, it has to be
a use client component. I'll also remove
these unused variables or imports coming
from chat. I'll check my import. So
that's import use router coming from
next. Oh, it looks like it imported it
from router after all. And I said to
import it from
navigation. There we go. We fixed it
now. And we are ready to verify the
session and navigate to the homepage.
And while we're here, before we try it
out, let's also implement the handle
resend OTP. If we go to user actions, I
think we had something similar. We had
send email OTP. Yep, it's right here.
So, we can just use it. Let's go back to
the OTP and let's say await send email
OTP. And to it, I think we just need to
pass an object containing the email. And
let's make sure to properly import it.
OTP. Oh, it looks like it doesn't want
to import it. It should be coming from
user actions. So, I'll just put it here.
Oh, but it looks like we didn't export
it. So, if I go back to user actions, we
have to say export
const send email OTP. Before we were
using it just in the create account to
immediately send it. But if somebody
wants us to resend it, then we have to
run export and then import it from here
and use it there. So, with that in mind,
let's actually give it a go. I'll go
here and I'll say something like
adrienjsmastery and I'll enter my email
contact
atjsmastery.pro and click sign
up. Immediately after that, it looks
like something has happened, but the OTP
model didn't pop up. Let's see why is
that. If I head over to the O form,
that's because we are currently setting
the O form always to be true. But we
should only activate once the account ID
is actually
clicked. And the account ID actually
gets updated right here on the create
account. So if I try it one more time,
you'll still notice that it fails. So
let me actually expand this and open up
the inspect element and the
console and click it
again. And you'll see we don't really
get anything right here. We do get a 200
from in our network tab, but other than
that, not much more is happening. It
might be because I tried to use this
email before. So, let me reload the
page and I'll try it once
again and click sign up. There we go.
Now it appears. Since we made a change
in the odd form right here where I
specified account ID, I actually had to
reload the browser because the change
was on the client side. Now go to your
email and you should see a couple of
emails because I clicked a few times,
but you should go for the latest one
right here, which is this one. I will
copy it and you can manually type it.
But what you can do is just paste it. So
I'll paste it and click submit. And
there we go. we got redirected to the
forward slash route or the homepage. And
what does that mean? Well, if you check
the OTP model, we would only get there
if we don't fail the try block. So, we
didn't get this error and only if the
session ID exists. So, that means that
we have successfully generated a user
session. And if you head over to inspect
and go to application and go to cookies
localhost, you should notice the apprite
session right here. But I noticed
something that is not quite good. The
value of that session actually seems to
be empty. Interesting. So this is
definitely something that we need to
further investigate. But for the time
being since we don't even have the
logout option, we cannot go back to test
out the login. We can only do that
manually by changing the URL. But I
think now is the right time to develop
the layout of our actual application.
And that includes the navigation bar as
well as this beautiful sidebar with
different links. And at the bottom, we
have more info about the user. So when
we try to fetch that, we'll see if the
session has indeed been created or not.
And then also at the top right, we have
a logo button so we can continue testing
the O. But for the time being, let's
focus on the homepage
layout. To get started with creating our
layout, we'll follow a similar process
like we did for our authentication
routes. Remember how we had a route
group within which we had the layout and
then the two pages that share that
layout. We'll do the same thing for the
homepages. So let's create a new route
group which is going to be a folder
whose name starts with parenthesis which
is root for the route group. And within
it we can create a new layout.tsx tsx
file. This layout will be a React
functional component. And as with any
layout, it'll accept children, which
will be of a type react node. It'll
render a single main tag since we're
showing all the main content within it
with a class name equal to flex and age-
screen. And then within it, we will
render a sidebar. Below the sidebar,
we'll render a section that'll have a
class name equal to flex hash- full
flex-1 and flex- call inside of which
we'll render the mobile
navigation as well as a header. And
finally, within it, we'll have a div
with a class name equal to
main-content inside of which we'll
render the children. If I save this,
you'll notice that the look and feel of
our primary homepage didn't change.
That's because we have to move this page
right here from the app folder to the
root folder. If you do that and reload,
you'll notice that now it'll have space
for the sidebar as well as the mobile
navigation and the header. And the
content will appear right here in the
middle. Now, let's create these
components, the sidebar, the mobile
navigation, and the header. We can do
that by creating all of these as new
files within the components folder.
First one called
sidebar.tsx within which I can run
rafce. The second one can be called
mobile
navigation.tsx inside of which we can
run
rafce. And finally the third one can be
called
header.tsx inside of which we can run
raftce.
Now we can import and use all of these
three components such as sidebar which
we can import from components sidebar.
Next we can get the mobile navigation.
So let's make sure to import it properly
as well. And finally we can render the
header which is going to be another
self-closing component which we're going
to import from components header. There
we go. You can see everything is still
working exactly as it did before. So,
what do you say that we start with a
header since it's going to be most
prominent right here at the top? Let's
dive into the header component and let's
start implementing it by turning it into
an HTML 5 semantic header tag with a
class name equal to header. Within it,
we can render just a keyword that says
search. Later on, we'll implement a real
global search out of this. That's going
to be quite an exciting lesson. So stay
tuned because it'll allow us to search
across all the files, all the pages, all
the content in our database. Below it,
we'll have a div with a class name equal
to
header-wrapper. And within it, we can
render our file uploader component. More
on that soon. This will be a button that
allow us to upload the files. And within
it, we can have a form. This form will
render a button. This button will be of
a type is equal to submit and a class
name equal to sign out button. And now
within that button we can render an
image. And this image will have a source
of for/assets/icons/loout.svg
SVG with an al tag of logo, a width of
24, a height of 24, and a class name of
W-6. If I save it, it's almost as if we
cannot see this header appear anyway
because we're on mobile, right? So, we
can only see the mobile navigation. But
if we expand a bit, you can start seeing
the header on tablet or desktop devices.
So now we have the search, the file
uploader, and the logout button. While
we're here, we can also create what are
soon going to become the components for
search and file upload. In the similar
fashion, we created these three. So I'll
create a new component called
search.tsx. Run
rafce. And I'll do the same thing with
the file uploader by creating a new file
uploader.tsx file inside of which we can
runce.
So now we can simply import and render
both of these components. The search
coming from components search and the
file uploader coming from component
search as well. Nothing has changed but
now we can dive into these components
and implement them one by one. But with
that in mind, we now have something that
at least looks like the final layout.
Well, maybe not yet. After we implement
the sidebar and the mobile nav, it'll
look a bit better, but at least it
resembles the UI that we'll soon have.
So, to make it look much nicer, let's
implement the sidebar. For the sidebar,
we'll have to keep it at at least a
tablet width, which is going to look
something like this. And as a matter of
fact, since the sidebar is on the left
side, I'm going to switch the position
of my code editor and the browser. That
way, we can see it while we're
implementing it. So let me head over to
the sidebar component and let's
implement it by using an HTML 5 semantic
aside tag which means that this is going
to be a side navbar and we can give it a
class name equal to sidebar. Within it
let's render a link coming from next
link with an href of forward slash
meaning pointing just to home. And
within that link, we can render an image
that's going to be an X.js image tag
with a source of forward slash
assets/icons slash
logo-fool-brand.svg with an al tag of
logo. And we'll have to give it a width
of about 160 and height of about 50 with
a class name of typically hidden with an
auto height. So, h- auto and it'll be
visible on larger devices. So, LG block.
Once we do that, you can see we cannot
see it yet because we're not on a large
device. But if I expand a bit more to
get to the large screen, you can see
it's right here. Great. So, I can extend
my code editor because the only thing we
care about is the sidebar for now, which
we can visually see because it's on the
left side. But below this image, I'll
render another image. And this one will
be logo but for smaller screen sizes. So
we can see source is equal to
slassets/icons/logo-brand.svg with an al
tag of logo a width of 52 a height of 52
and a class name of lg hidden. So we're
doing the exact opposite as before. So
now if I go here and collapse it, you
can see this smaller one right here.
Looking great. Now let's create a navbar
right here below the link. That's going
to be a nav tag with a class name equal
to
sidebar-nav. And within it, I'll display
a ul, an unordered
list. It's going to have a class name
equal to flex.
And I have to properly spell the class
name here. It's going to have a flex
dash one, flex- call, and a gap of six.
Within it, we need to display our nav
items. Now, we could manually create an
array here and then create a couple of
objects where we have name and then we
have a path. But this would simply
clutter our view because we would have
to have all of the objects right here.
What I prefer to do instead is to create
a constants file that looks something
like this. You can create a new
constants folder right here in the root
of our directory and within it you can
create a new index.ts RTS file and there
we can define all of the things that we
might use across some places like export
con nav
items is equal to an array where we have
the name of each link such as in this
case
dashboard. Each link also could have
maybe an icon which in the dashboard
case would be assets icons
dashboard. SVG and it also needs to have
a URL to which it will point to which is
just going to be forward slash because
our home is our dashboard. And that
looks something like this. So now you
need to duplicate it and create it for
all other pages such as documents,
images, media and others. So we can
display the different links right here.
Of course, I'm referring to the links
from the design, documents, images,
media, and others. Feel free to take the
time to write some of these routes,
icons, and names. But just to save you
some time, in the description down
below, you can find the GitHub readme
where you can find the code snippets.
And one of them will be the constants
index.ts file. So here, I just provide
you with all the links. No logic here,
just some code that's easily copyable.
Great. So once you have it, we can use
it within the sidebar to map over it. So
let's say nav items coming from
constants dot map where we get each
individual item and for each one we want
to open up a code block and then figure
out whether it's active or not. So we
can say it's active if path name is
triple equal to the item URL. And this
path name refers to the path name we're
currently on. And to figure that out, we
have to use the use pathname
functionality from Nex.js by saying
const path name is equal to use path
name coming from next. Once we do that,
we can now compare it and we have to
turn it into a client component because
we have used a
hook and sidebar should be client anyway
because we'll use redirects and actually
route people to different links. So now
that we know which link is active, we
can actually return a link. So we can
say return a link
component which of course has to be
imported from next. And we can give it
an href equal to item URL. And as a
matter of fact, let's actually
dstructure those properties like the URL
and so on from the item. So we have the
URL, we have the name and we have the
icon. So now instead of saying path name
is equal to item. URL, we can just say
URL. Same thing here for URL. And active
is actually pretty short. So we can just
use this equation instead of setting it
to a new variable, which would allow us
to just have an immediate return of a
link just by wrapping it in a parenthesy
instead of in a function block. So
that's how immediate returns work. Next,
within this link, we can render an LI
that'll render an image with a source of
icon, an al tag of name, a width of
24, a height of 24, and that's it. And
below it, we can render a P tag that'll
render the name. If I save this, you can
see something that resembles our URL
structure. Let's give each link a key
since we're mapping over them. and a key
will simply be the name since each name
is different. Let's also give it a class
name on large devices wful. Let's also
style the li by giving it a class name
equal to. We can use the CN property
from shad CN and within it we can give
it a
sidebar-nav- item and then as the second
parameter we can say only if path name
is equal to URL in that case give it a
shad active class let's properly name
this path name and let's specify an end
sign here so only if this is true which
we have to wrap in parenthesis right now
then give it a shot active and now you
can see this is looking a bit better.
Let's also style the image by giving it
a class name equal to. We'll once again
use the CN right here. And every image
will have a nav icon property, but only
if path
name is triple equal to URL. Then we'll
also give it a nav icon active. And
let's properly spell class name here.
And now we can see that it turns white
when it's active.
but it's gray
otherwise. Let's also style the P tag by
giving it a class name of typically
hidden but on large devices block
meaning visible. So check this out. If
we're on desktop devices, we have enough
space for the sidebar. But if we
collapse it to tablet, check this out.
So nicely collapses. And this is the
homepage, the dashboard. We have the
files, images, videos, and others.
Everything makes so much sense.
Beautiful. Now let's head below this ul
and below the nav and let's create a new
image. This image will have a source of
for/assets/
images/files-2.png. For the al tag let's
say
logo. For the width let's do 506.
For the height, let's do 418. And let's
give it a class name of w-f
full. And we can close it right here.
This is just a nicel looking files icon.
And it's going to create some separation
to show our user details. So just below
the image, let's render a div with a
class name equal to sidebar- user- info.
within it render an image with a source
of and we can use the same placeholder
image that we already used once. I'll
try searching for it by searching for
placeholder. No, maybe it was avatar.
Yep, this one from Pixabay. Since it's a
long name, I can actually put it into
constants. So, go ahead and copy it.
Head over to the constants folder and
index.ts. And let's just create this new
const avatar placeholder URL and make it
equal to this one right here. And don't
forget to export
it. And now I can use the same one right
here in user actions avatar placeholder
URL. And we can use it in the sidebar.
That's going to be source avatar
placeholder URL. The all tag will be
avatar. The width will be 44. The height
will be 44 and a class name will be
sidebar user avatar. I've decided to use
static avatars right here because this
app is not really user based like social
media applications where you have to
change your avatar every now and then.
Here what we care about the most is
what's inside of our account which are
the files we upload. Now you'll notice
that our app will break saying that
cdn.pixabay.com pixabay.com or whatever
other source of the image you chose will
not be accessible right here. So you
have to head over to
next.config.ts and you'll have to
specify images remote patterns and
within it provide an array of an object
where you specify a protocol of https
and then below it you provide a host
name of cdn.pixabay.com
pixabay.com and later on once we want to
read additional images we'll also need
to add apprite. So let's do it right
now. Protocol https and
cloud.apprite.io. Now if we reload you
can see that now we can see the image
and we have a placeholder icon right
here. I might actually decide to change
it later on because this one looks a bit
too default but that's okay for now.
What I care about much more though is
going to be the user details. So let's
create a div that'll typically be
hidden. So it'll have a class name of
hidden. But on large devices it'll be
visible. So it'll have a class name of
LG
block within it. We can display a P tag
with a class name of
subtitle- two and
capitalize. And we can render the full
name.
But the question is where's this full
name coming from? And I mean same things
goes for the email. So if we render a P
with a class name of caption and try to
render the email, we don't yet have
access to these things. Remember what I
said before, these need to come from the
session. So where are we going to get
access to this session? I don't want to
get access to it right here within the
sidebar because we'll have to use it in
other places too. So let's head to the
central place where we'll need to use it
and that's going to be in the layout
root because this place supplies both
the sidebar, the mobile nav, the header
as well as all the other pages. So here
we have to try fetching the current
user. But we can only fetch it if we
create a server action that allows us to
do so. So for now our app is broken, I
know, but let's head over to
user.actions.ds.
DS and below verify secret we can create
a new function that will allow us to
fetch the current user. So let's say
export const get current user is equal
to an async function. We have to get
access to databases as well as the
account which is equal
to
await create session
client. Then we want to get the result
by saying const result is equal to await
account.get. And then we want to extract
the user from the database by saying
const user is equal to await
databases.list documents. And here we
have to specify from which database we
want to get it from which collection we
want to get it and what is the query to
fetch it. So conveniently enough my code
editor autofilled it for me. First want
to provide it the appreate config
database ID. Then we want to provide it
the user collection ID. And finally we
want to write a query where we are
looking for a result dollar sign ID that
matches the account ID. And this doesn't
have to be in an array. It can just be
like this. That should give us access to
the user. And then we can check if a
user exists or if user.total total is
lower than or equal to zero then we can
return null but else we can return parse
stringify user documents zero which
should bring us back the currently
active user. So now we can use this
server action right within our layout by
saying const current user is equal to
await get current user and don't forget
to make this function async since we're
using a weight and also if there is no
current user in that case we can return
a redirect coming from next navigation
and we want to point the user to forward
slash sign-in make sure that this
redirect is coming from next navigation
and not whatever it imported right here.
So I'm going to say redirect. So I'll
import it by saying
import redirect from next navigation.
There we go. And now we can reload and
see what's happening on the server. We
are getting server error no session. And
this is coming from create session
client. So that's in the
user.actions.ds.
DS specifically from the create session
client. That's this function right here.
That is saying that right now we don't
have the app right session created which
is exactly what I assumed when I check
the cookies because we saw that the
cookie value wasn't actually added. So
let me head back over to sign up
functionality right here in the signup
page and we'll have to head over to the
odd form. In the odd form, when we're
creating a user, we're calling this
server action. And that server action
creates an admin client. And to set up
the admin client, we're using these
specific env. So let's check if we set
them up right. We have the endpoint URL
which points to apprite endpoint project
ID which points to apprite project. And
I believe we used a secret key which
points to apprite key. So now I have to
compare them with our
env side by side. Starting with the
endpoint URL, we call it next public
apprite endpoint. That's correct. Next
we have the app right project. And
finally, it looks like I misspelled the
secret key. Here I called it apprite key
and here I'm calling it apprite secret.
So let me actually fix it by renaming my
env to say next apprite key.
There we go. So now this env should be
good and we should actually successfully
be creating a session. I'll go to
inspect element and go to the
application tab and I will completely
clear the
cookies as well as the local storage and
the session storage. Then I'll head over
to sign dash up and make sure to delete
all the existing users by heading over
to O and then clicking on them heading
all the way down and then deleting them.
just to make sure that we have a clean
and empty slate. There we go. Now that
that is deleted, let's also clear up our
database by heading over to databases
and then users and simply select all
three of these users and simply delete
them. Now we can try creating a new
user. I'll call it
Adrianjsmastery and I'll use my contact
atjsmastery.pro email and I'll click
sign up. There we go. An OTP has been
sent. I'll make sure to copy it and I'll
paste it right here and click submit.
Immediately we are redirected back to
localhost which is a good sign. But
right now we're not getting that session
not found error. Right now we are
exactly where we left off in the
sidebar. Remember if I head back over
here we were trying to console log two
different things. The full name and the
email even though we knew that we have
to extract them from somewhere. So this
entire time we have been trying to log
our user in and get the active session
so that we can extract the full name and
the email from the session. Our sidebar
is being called within the root layout.
So let's head over to root layout which
is this one right here. And remember
here we're trying to access the current
user by calling this server action which
should give us all the information about
the currently active user. And then once
we get it, we are ready to pass it over
to the sidebar. So let's do just that by
passing the full name is equal to
current
user.name. Let's also pass the avatar
image equal to current user avatar. And
now that I think about it, we're just
simply saying full name is equal to
something that same thing. Same thing
here. So instead of doing that, let's
simply spread the entire current user,
which is going to look something like
this. Object da current
user. Now we can head into the sidebar
and we can accept all of these props
we're passing in such as a full
name. We can also get the avatar and we
can get the email. And those can be of a
type props which we can define right
here. interface props is equal to full
name is of a type string. Avatar is of a
type string and email is of a type
string as well. And now, as you can see,
we're back here and we're successfully
rendering the full name and the email
right there. And while we're here, we
can also render the user avatar by
simply rendering the avatar. It's not
like anything will change because we're
still using this demo placeholder avatar
which we can later on switch with some
kind of a more interesting avatar image.
But again, I mean, just check this out.
Now we are successfully logged in. We
know which user is logged in and we have
a left sidebar that will soon allow us
to navigate to other pages. Soon enough,
we'll also head back over to complete
our header with its search file uploader
and the functionality for the logout
button, which so far hasn't been
implemented yet. But next, let's focus
on the mobile navigation. What happens
if I collapse my screen to a mobile
size? Well, as you can see, we have no
space left for the left sidebar. So that
means that I can head over to the mobile
navigation component and I can collapse
it a bit just so we can see our browser.
So let's implement the mobile navigation
next to develop our mobile navbar we'll
need to use another shatzian component
specifically a chaten sheet which is a
dialogue component that extends to
complement the main content of the
screen something that looks like this.
So let's go ahead and install it by
running this command in our
terminal. MPX shaden at latest add
sheet. Press Y and install all the
dependencies. Let's copy its usage right
here at the top. And let's copy the
rendering part. I'll simply first wrap
it in a header. So let's create a header
component. Within it, I'll create an
image coming from next image with a
source of forward slash
assets/icons/logo-fool- brand. SVG with
an al tag of logo, a width of 120, a
height of
52, and a class name equal to hash-
auto. And right below it, we can render
the sheet that we just copied. So, let
me save it. And check this out. Now, we
have a logo that says open. And then it
opens up right here. Looking great.
Let's also give this header a class name
equal to mobile dash header. That's
going to position the logo on the left
side and the open button on the right
side. And now we can focus on working
with this sheet. First of all, I'll
create a new use state field. I'll call
it open and set open at the start set to
false. This will also have navigation
items within it. We also need to know
the path name. So I'll say const path
name is equal to use path
name. And of course we need to import it
from next navigation.
Now moving down to the sheet, we can
pass it different props such as open is
equal to open and on open change is
equal to set open. So that's going to
modify this state
variable. Sheet trigger is not going to
simply say open rather it'll be an
image. It's going to have a source of
for/assets/icons/menu.svg
SVG with an al tag of search, a width of
30, and a height of 30. If you save
that, we have to properly import the use
path name right here at the top. Or
should I say we have properly imported
it, but instead we have to turn it into
a use
client. So, let's use client. And we're
good. And now we can see that this looks
much better than a text that says open.
We have an actual burger menu right
here. Right below the sheet trigger,
let's style the sheet content by giving
it a class name equal to shad sheet
hash-screen and padding x of three.
Next, we can remove the sheet header. We
don't need it in this case, but within
our sheet title, I'll create a new div
that'll have a class name equal to
header-ash user. And I'll render an
image with a source of avatar, an al tag
of avatar, a width of 44, a height of
44, and a class name equal to header-
user dash
avatar. Of course, we're not yet passing
this avatar into here, and we're also
not passing the full name and everything
else that we need from our user. So,
let's go ahead and pass it. Remember,
we're calling this right from the root
layout, same way in which we're calling
the sidebar. So, let's simply spread all
the information about the current user
into the mobile navigation as well.
Next, we can simply dstructure all of
those fields by getting the owner ID. I
believe we have access to that account
ID, full name, avatar, and email.
And this is going to be equal
to props. And now we can define those
props right here by saying interface
props. And we're going to have an owner
ID of a type string, meaning who owns a
specific file, an account ID of string,
full name, avatar, and email, all
strings. So now if you open it up, you
can see an actual avatar image.
And if we go down right below the avatar
we can render a
div. And this div will have a class name
of on small devices this will be hidden
but on large devices it'll be block
meaning shown within it. We can render a
p tag that'll render the full name. And
we can also give it a class
name equal to
subtitle-2 and
capitalize. There we go. This is looking
great. And right below it, we can also
render another P tag that'll have a
class name equal to caption and it'll
render the email. So if I fix this and
save it, this is looking great. Now we
can go two divs down and we can install
a chaten separator component. So that's
simply separator. I think this is the
simplest component to use. You just
simply say separator import it from
components UI separator and save it. You
can also give it a class name of margin
bottom of four and bglight 200 over 20.
And as you can see, this created some
separation from the top content and the
content below. Now we can exit the sheet
title. And right below it, we can delete
this entire sheet description. And I'll
create a nav that stands for navigation
bar that'll have a class name equal to
mobile-nav. And within it, we can create
a new ul, an unordered list that'll have
a class name equal to
mobile-nav-list. And within it, we can
map over our nav items. So let's say nav
items coming from constants. Remember
this is a list of different URLs that we
have within our application that we have
created earlier and now we can map over
them almost in the same exact way of how
we have done it in the navigation bar.
So if I open up the sidebar we can copy
this part where we have nav
items.m
map. So let me copy it. And now I'll
paste it right here. There we go. Of
course it'll require some fixes because
we're doing mobile here instead of
desktop. First, we have an href with a
name URL and LGW fool. Then we have a
list item with mobile nav items. So,
let's fix this CN class. There we go.
That's going to change the layout. Then,
we have the image where it says nav icon
and nav icon active. This is looking
good to me. And finally, we have a P
tag, which is not going to be hidden in
this case because even though we're in
mobile, we have enough space to show it.
So, this is looking great to me. Now we
can head down right here below the nav
and create another
separator. We'll do it exactly as we
have done the last one with a class name
of margin y of five to create some space
in top and bottom and bglight of 200
over 20. Now we can create another div
right below the separator that'll have a
class name equal to flex flex-
call justify dash
between a gap of five and a padding
bottom of five and within it we will
render a file uploader. So soon enough
we'll be able to upload the files from
here and right below it we're going to
have a button to sign out. Since this
one is similar to the one in the header,
I will simply go ahead and copy this
button. Go back here and render it right
below the file uploader button type
submit with a class name of
mobile-
sign-button. It'll have an on click,
which soon enough we'll be able to use
the real logout functionality. For now,
we'll make it an empty callback function
and it'll have an icon that's going to
say log out. We can just remove this W6
for the width. And there we go. We have
a beautiful button. And we can also add
a text, a P tag that simply says log out
right here below. And over here, let's
also use the file uploader component we
created before. That's just file
uploader. Nothing will change right now
because it's still just an empty piece
of text. But once we start implementing
the file uploader on desktop, this one
right here, it'll also automatically
work for the one in the mobile
navbar. Now that we've implemented the
mobile navbar, we are finally ready to
implement the functionality for the log
out both on mobile and on desktop. And
once we implement that we'll also have
to finalize our authentication
specifically the log in part of the O
because right now we have only
implemented register. So let's do that
next to implement our logout
functionality. I want to introduce you
to a new tool from AppRight called the
assistant that allow you to implement
different features, APIs, and more by
generating some code for you,
specifically helping you with the
queries and
optimizations. So, how can you use it?
It's super simple. Just head back over
to your dashboard, press control or
command K, and then just say ask the AI.
And now we can ask it any kind of
question like how to implement an OTP
login form. And check this out. It's
going to figure out that you need to
create a new apprite client by getting
all of these environment variables.
Initiate the OTP authentication by
creating a magic session URL. And then
you have the form and finally you have
to handle the form submission to create
a session which is exactly what we have
done. Of course, you'll have to tweak it
to match your codebase, but what I love
the most about it is that it actually
creates sources for you. So, you can
very quickly refer to these different
links that make it
happen. In this case, I'm wondering how
can we log the user out? So, I'm going
to say how can I log my user
out? So, to log a user out, you can use
appite.delete session. This is exactly
what I wanted. It helps us specify the
client and then it has a function that
deletes a session. This is all that I
needed. So I'll copy this part delete
the current
session and I'll head back over to
user.actions.ts and I'll say export
const sign out user is equal to an async
function where we have a try and catch
block and in the try we'll try to delete
the session. Of course, this account is
coming right here at the top by saying
await create session client. Then we can
await account.delete session. And we
don't need to use the doc then since
we're using async await. After we delete
the session, we want to delete it from
the cookies too. So we can say in
parenthesis await cookies and then
delete and specifically want to delete
the apprite session. Finally, let's add
a catch block. Within catch, we're
getting the error. And then we can call
the handle error saying fail to sign out
user. And finally, we have a finally
block, no pun intended, which can simply
redirect our user. So, let's redirect
the user to sign in. Now, it looks like
I forgot to apply a semicolon here. If I
do apply it, this is going to be good
because these are two distinct lines of
code. So with that in mind, now we have
the sign out user functionality and
let's head over to our mobile navigation
to just add it to this on click. It's
going to be simple. You just make this
function an async function and then you
await sign out user and you call it like
so. Now remember we are going to also
implement it within our header right
here where we click the log out button.
But in this case it'll be just a tiny
bit different.
See our header component is not a client
component. It is a server component. And
for that reason, you cannot really use
client side functionalities like button
clicks or form submissions or redirects
for that matter. So that's why we'll use
new React 19
functionality by passing an action to a
form that will allow you to perform a
server side functionality for what seems
to be a client side thing. We can do it
by creating a new async function and
then opening a new block of code adding
the use server directive. So that means
that the code below this code will be
rendered on the server and we can call
the await sign out user like so. Now if
you head back and if you click log out
you can see that we've been successfully
logged out from our application and we
can soon start implementing the signin
functionality.
But just before we do that, remember
that ugly avatar icon that I decided to
use? Well, let's just fix it so that the
new users that are coming to our
platform have a bit nicer avatar images.
I'll go ahead and choose this guy right
here. Seems to be working well with our
3D theme. So, I'll simply copy the image
address. You can choose any other avatar
you want. Or what I would even like you
to do is implement another modal where
you allow your users to choose from
multiple different avatars. Or this is
pretty cool. You can use appite's
avatars functionality that will allow
you to generate an avatar image based on
the letters of their first and last
name. That's also pretty cool. But in
this case, I'll go back and I'll go
where we are creating the user, which is
going to be in user actions.
And we're creating the user somewhere
here. There we go. And I'll simply want
to update the avatar placeholder ID from
this pixabay one to this new one coming
from freek. And I already know that
we'll have to head over to config nex
next.js. And we'll have to add another
remote pattern right here to tell
next.js that it's fine to render an
image from this
source. Great. Now I'll go ahead and
create a new account. Let me use the
same name as before, but this time I'll
use a different email. There we go. We
now have to verify it. And immediately
after verification, we're back. We have
to configure it. That's
imagefreepic.com, which we have to add
to our
next.config.ds. I reload it and we're
good. Yep, this is looking more like it.
until I do the official face reveal. I'm
more than okay with this. Now, let's log
out one final time and let's implement
the signin functionality. I'll try to
ask the app right assistant one more
time by pressing command K and then ask
the AI and I'll say how can I implement
a Nex.js server action that will sign in
the user using OTP. Let's see what it
says. Okay, it does everything we've
done before. Create admin client. Create
the OTP signin server action. Yep, this
is looking pretty good, I got to say.
It's using the cookies. It's using the
NexJS redirects, the create admin
client, and more. It's creating a
session, setting the cookies. Yep, this
is looking great. In this case, we have
already created the form and we have
created a server action that will help
us send out the OTP verification. So
let's just do it manually by heading
over to user actions. I'll head below
the sign out user and export const a new
one sign in user which is going to be
equal to an async function that accepts
an email of the user we're trying to
sign in and that email is of course of a
type
string. We want to open up a try and
catch
block. In the catch, we're going to get
the error and simply handle that error
by console logging it. And in the try,
we'll extract the existing user if it
exists. So I'm going to say
constexisting user is equal to await get
user by email. And then we pass the
email. And then if a user exists, we
send the one-time password to their
email by saying if existing user then
await send email OTP to this email and
immediately return parse stringify the
account ID from that existing user. else
if it doesn't exist we can just return
parse
stringify and I'll return something like
account ID is equal to null and I'll
also return an error that we can then
use by saying something like user not
found and now we can use it within our
form so let's head over to our odd form
head over to where we're creating the
account and we want to make a check
right here right before we say where the
user is coming from and right before we
make a decision whether we want to
create or sign in. So I'm actually going
to add a new turnary operator is sign up
and if it is sign up I'll call this
await functionality right here to create
an account else I'll call
await signin user and to it I'll pass
the email equal to values email coming
from the form and this is sign up is
going to be true if our
type of the form that we're passing as
props is equal to sign dash up. I'm
referring to this type right here. And
let's make sure that we're properly
closing it. Let's see. This function is
ending all the way here. So, I think I
should have put my second part here.
There we go. That's better. You can also
use an if if this seems a bit too
overwhelming with these turnaries. So
using an if by saying something like let
the user is null and then if type is
sign up in that case you can use this
block of code else you can do another
block of code but that requires an
additional variable assignment so in
this case I'm fine with just saying this
user create sign in perfect so let's
give it a go by going right
here entering my email. Let's do
javascriptmastery
00gmail.com. The OTP will come to your
email. And once you verify it, you'll be
right in. Great job on implementing the
full authentication with all three parts
done. Sign out, sign in, and register.
Next, we can focus on uploading some
files.
to get started with the file uploader
component. You can see it right here on
mobile devices in the right sidebar. So,
let's head over to the file uploader
component.tsx. Once you're there, let's
install a new package called React Drop
Zone, which is a simple React hook to
create an HTML 5 compliant drag and drop
zone for files. You know how you can
pull the file and then you can drag and
drop it into a website? Well, that's
exactly what React Dropzone does. So,
let's copy the installation command and
paste it right here. MPM
install--save React-drop zone. And then
we can copy its usage. So, let's copy it
and let's paste it right here at the top
of the file uploader file. In this case,
we're not going to declare the my drop
zone component. So, we can delete it.
But instead of that we can copy
everything from within it and then put
it within the file uploader component
itself right here. So here we have the
onrop as well as some of the special
functionalities coming from the use drop
zone hook. And of course since we're
using a hook that means that this has to
be a use client component or you can use
the wrapper component called drop zone
but in this case I'm okay with using it
like this. Now, they explain some
additional functionalities, how you can
get the files that you input, and more.
But I'll explain all of that to you as I
teach you how to use this component.
Now, you can see drag and drop some
files here or click to select files. And
if you click it, it'll actually open up
a file explorer. So, let's first do the
UI for the file uploader. So, we know
where we can place our files. To do
that, we have this div with a class name
equal to
cursor dashpointer. Next, we have the
input. And right below that input, we
can render a
button. This button will come from
components. It'll have a type is equal
to button. And it'll have a class name
equal to CN coming from utils. We're
going to always give it a class name of
uploader
dashutton and after that we're going to
pass it some additional class names
which we can get through props. So right
here at the top where we have the file
uploader props we can accept the owner
ID which will soon pass. So we know who
is uploading the files, the account ID
as well as the class name and we can
define the props right here. So that's
going to be interface props is equal to
owner ID of a type string, account ID of
a type string and class name of a type
string optional. So now we have this
button and within that button we can
render an image with a source of forward
slassets/icons/upload.svg
SVG with an al tag of upload, a width of
about 24, a height of about 24, and I
think that's it. If I save it, you can
see how now it has the upload icon, and
we can also render a piece of text, a
paragraph that's going to say upload.
There we go. Now it's super clear. Below
the button, we can check whether some
files exist. And the question is how can
we know where the files are? The files
that we're trying to upload. We have to
keep track of them using the state. So
right here at the top we can say use
state snippet. Let's call it files set
files. And at the start it'll be equal
to an empty array. But in this case
we'll specify the type to be a file
array like this. So an array of files.
Right now we have some kind of a
warning. But don't worry about that. If
we go down right here below the button,
we can make a check and see if
files.length is greater than zero. In
that case, we can render a ul, which is
an unordered list. But let's make sure
to properly close it right
here. So file.length is greater than
zero. Then we open and close the ul.
That ul will have a class name equal to
uploader-preview-list and within it we
can render an
h4 that's h4 not h3 with a class name
equal to h4
text-light- and it's going to say
uploading so to know which files are we
trying to upload and then below it we
can say files.m mapap and we can map
over the files
by first getting the file and then
getting the index of that file and then
for each one we can basically open up a
new function block and we need to figure
out what is the type of that file is it
an image or is it a video so I'll try to
dstructure const type as well as the
extension of that file by calling a new
function which we can create called get
file type to which We need to pass the
file name. Now, this is a function that
we have to create. It's going to be a
special function coming from utilities
or utils. So, let's head over to
utils.ts. And currently, it's pretty
empty. We need to create some kind of a
function and export it called get file
type which accepts a string of file
name. And then it should return
basically the name. And then it should
return the type as well as the extension
of this file. And this is the type of
code that I like to use chat GBT or
GitHub copilot for. I'll do something
like this. I'll select it. And in this
case, I'll open up a new copilot block.
I'll ask it to create a function or
implement the functionality for this
function to take in a file name and
return a type and an
extension. Let's see what GitHub Copilot
comes up with. Okay, check this out. So,
it's getting the extension by splitting
the file name by using the separator of
the dot and then popping the first
thing. So, it's only going to keep the
extension. Then it opens up the type and
it opens up a switch case. If it's one
of the most popular image formats like
JPEG or PNG or GIF, then it says the
type as image. For MP4 and others, it
sets it to video. For MP3 audio, for
PDF, doc, and DOCX document, and so on.
Finally, it returns the type and the
extension. This is looking good to me,
so I will gladly accept it. And as I
said, you can use Chad GPT or any other
AI editor. They're perfect for
implementing utility functions such as
this one. But just to make sure that you
can 100% follow along, I'll provide you
with the complete utils file linked to
the readme of this project's codebase.
So simply copy it and override this one
right here. You'll notice that it has a
collection of these other utility
functions like get file type params. Is
it documents? Is it image? Is it media?
or this one that will return the usage
summary for each of the categories like
the documents, images, and more. Or the
one that we just created that gets the
file type based on different extensions
and then it just returns that type and
the extension. We do a similar thing for
the icons right here. Get file icon.
Based on the extension, we can return a
specific asset so we know exactly of
which type the file is. With that in
mind, we can now go back here and we can
call the get file type
functionality coming from utils to which
we pass the file name. And once we get
it, we can return an LI which is a list
item with a key equal to a template
string of
file.name and then dash index. So this
way we can make it fully unique and we
can give it a class name is equal to
uploader-preview dash item. If we do
that, we cannot see anything yet because
we haven't yet uploaded any files. But
if I type test in there, we should be
able to see something for each file that
we upload. So back on my desktop, I'll
choose one of the screenshots that I
have right here. And we should be able
to see something, but not yet. That's
because we're not setting the file to
state on drop. We can do that by turning
this callback function into an async
function. Specify the type of the
accepted files to be a file array like
this. And then within it, we can simply
set files and set it equal to accepted
files. If I save this and try to upload
it one more
time, you can see that we have this
little popup at the bottom that says
uploading test. But other than that, not
a lot is happening. So let's continue
creating this LI list. Within this LI,
let's create a div. And this div will
have a class name equal to flex items
center and a gap of three. And within
it, we want to render a special
component called thumbnail. So, this
will be a component that will render the
preview of the image we're trying to
upload. Okay. So, let's actually create
it as a new component in the components
folder. I'll call it
thumbnail.tsx. Run
rafce. And then I'll go back and import
it right here.
Thumbnail. Of course to this thumbnail
we have to pass some props such as the
type is equal to type extension is equal
to extension and finally the URL is
equal to convert file to URL and then we
pass in the file we're trying to
convert. This is another one of the
utility functions which takes the URL
object and calls the create object URL
of a specific file. So now we can go
into the thumbnail and we can accept
those props. We can accept the type, the
extension and the URL which by default
can be set to string if nothing else is
passed. We can set this over to props
for the type and we can declare the
interface props of type string extension
string and URL string. Now we can return
a figure. It's a special HTML 5
component typically used for use cases
such as
thumbnails. Within it, we can render an
image from
Nex.js with a source of. Now here we
want to check whether it is an image. So
we can do that at the top by saying
const is image is equal to and now if
type is triple equal to image then it'll
be an image and if extension is not
equal to SVG because SVG is harder to
show right here as a thumbnail. So if it
is an image and extension is not SVG
then we know that it's an image. So we
can say if is image then we simply give
it a URL. else we need to get the file
icon which is a function from utils to
which we pass the extension as well as
the type and then we are going to pass
just a generic image like for video it's
going to be a camera icon for the alt
tag we can give it a thumbnail we can
give it a width of about 100 a height
about 100 we can give it a class name
equal to let's make it CN for class
names. Let's give it a class name of
size of
8 object- contain. And then we can also
give it image class
name which is a special prop that we can
pass image class name or just a typical
class name if it's not an image. So
class name, we also have to define those
two. So image class name will be
optional of a type string and class name
optional of a type string. I have to
properly close this image. And finally
if it is image we'll also give it the
thumbnail dash image
property. Hopefully this makes sense. So
we always give it size 8 object contain.
We also pass some additional images from
props if there are any. And then if it
is an image we also pass the thumbnail
image class name. In the same way we can
style the figure by giving it a class
name of CN. And then we can give it a
property of thumbnail and pass all the
additional class names if there are any.
So as you can see right now it says
uploading and then we have a little
thumbnail of the image that I was trying
to upload. This is like an upload model
looking good. of course doesn't look as
good on mobile devices, but trust me,
we're getting there. Now, below this
thumbnail, let's create a div. And that
div will have a class name equal to
preview dash
item-name. And it'll simply render the
file.name. Let's also render another
image right here. and give it a source
equal to
slassets/icons/file-loadader.gif. So
this will be the actual loader that we
want to show. Let's make sure we're
properly pointing to it. It's assets
icons
fileloadader.gif. We have to give it a
width of about 80, a height of about 26.
So let's do that. and then I'll tag off
loader. If you save it and open it up
and try to upload a file like this
screenshot of a YouTube thumbnail, you
can see that now this is looking pretty
good. We have the full name and we also
have some kind of a loader right here
showing the upload process. Let's go two
divs down and let's render one more
image which is going to be an image that
will allow us to remove that upload. So
let's give it a source of forward slash
assets
slashicons
slreove.svg with a width of about 24 a
height of about 24 an al tag of remove
and on
click we can call a function that's
going to take in the event. So it's
going to be called handle remove
file and it'll take the event as the
first parameter and then the file.name
as the second one. So let's go ahead and
create this function right here at the
top. const handle remove file takes in
the event specifically react mouse event
of HTML image element mouse event and
then the file name which is going to be
of a type string that's going to look
something like this and then first
things first it needs to stop the
propagation so once we click on it we
don't want to click anymore below this
model we want to simply stop the
propagation we only want to do what this
function is doing and then we want set
the files to get the previous files.
Okay, because we're modifying the state
using the previous state. And whenever
you are doing that, you actually have to
have a callback function within the
state changer. And in this case, we can
call the prev files dot filter and we
want to filter the file where file.name
is not equal to file name. Okay. So,
basically what we're doing here is we're
keeping all the other files in the list
that we're trying to upload, but we will
only remove the one that we click on.
So, if you have multiple, like let's say
these two, if you click on one, it
deletes that one and then you delete the
other one. Great. Let's also remove this
React right here. And let's just import
the mouse event as a type from React.
And I think we need to get the HTML
image element as well. So, let's do it.
properly event and then within it we
also need to add a comma and specify
that this is also a mouse event because
even though we're clicking on an image
element this also is a mouse event like
this and I will add react mouse event up
front. So let's simply make sure to
import react from react. There we go.
This is good now. So now let's head back
down. And once you upload files, as you
have seen, it's going to say uploading.
And of course, this definitely looks
better on desktop devices. And we have
some kind of a modal that allows you to
upload files and then see the upload
process happen immediately over here.
Now, of course, this is fake uploading
it. It's not doing a real upload. And
that's because this functionality right
here on simply sets the state which then
triggers the loading. but we're not yet
uploading them anywhere. For that, we
have to create a new set of server
actions. So, let's head over to lib
actions and create a new file called
file.actions.ds. And within it, we can
export const our first file action
called upload file, which will take a
file of a type file, and it'll open up a
new function block. Let's not forget
that this will be an asynchronous
function. And let's also make sure to
add the use server directive at the top.
So we can ensure that these are only
getting called on the server. Alongside
the file, we'll also pass additional
things such as owner ID to know who is
creating that file. And actually I won't
define the types right here. I'll define
them for the entire object. So we first
have to dstructure these props. So we
have the file, we have the owner ID, the
account ID and finally the path which we
want to use for revalidation and we can
define the type of this to be upload
file
props. Now what you can do is you can
define an interface of upload file props
right here as what we have been doing so
far. What you can also do is create a
new file in the root of your application
and call it
index.d.ts and then declare this
interface of upload file props right
here. That way if you declare it within
this index DTS which some people also
like to put within a special folder
which we can call types and then you can
drag and drop this index.d.ts
ts within the types it allows you to
have global types for your entire
application. So right here you can maybe
say that file is of a type file. You can
also say that owner ID will be of a type
string account ID string and path
string. Now if you go back you'll see
that even if you don't export this
upload file props from this file and if
you commandclick you will be able to go
here. So your editor knows this is the
right interface. The problem is that
sometimes ESLint doesn't know the
TypeScript magic that we're doing with
this index DTS. So you still have to
export this as an interface and then
import it right here as a regular type.
If you do that, ESLint will not complain
and it'll say, hey, just go ahead and
use this file. But now I know that it is
a string. So this is how we will be
declaring some of the other types in our
application, especially some longer
ones. And just so we don't have to type
them all by hand, you can find the
complete
index.d.ds in the readme of this
project. So if you go there, you can
paste it and you can copy it here. For
example, you can see the upload file
props which we just wrote ourselves is
here as well. So now let's continue
working on the upload file
functionality. First things first, we
have to get access to the storage and
databases functionality from apprite. So
let's say const dstructure the storage
and
databases and that's going to be equal
to await create admin client as we
learned so far. We can open up a new try
and catch block that's going to look
something like this. In the catch we get
an error and we can simply call the
handle error utility function. I think
we declared it in our previous actions
file. So that's going to be
user.actions.ts. And we can copy the
handle error functionality from here. It
is right here. Pretty simple function.
So let's copy it and paste it here. And
we're going to pass in the handle error
and a message saying failed to upload
files. And now a better question is what
happens within the try block. Well, here
we try to read the file. So we can say
const input file is equal to input file
dot from buffer and to it we pass the
file as well as the file name. This file
is basically a blob that this input file
coming from node apprite file
functionality. It's going to read from
it and it's going to upload it to their
servers. So we can then use that file.
How do we do that? by saying const
bucket file is equal to await
storage.create
file to which we need to pass the ID of
the bucket. So that's going to be
apprite
config bucket
id. Then we need to pass the id of this
new file we're creating for which you
can use the id dot unique functionality.
And finally, we need to pass the file
itself, which is the input file. So
that's going to end up looking something
like this. We pass the file through
props. Then we read it from the buffer
from the blob right here to turn it into
an input file. And then we call apprite
storage.create file. We specify the name
of the bucket. And bucket simply means
where are we going to store this file.
Give it an ID and specify which file are
we trying to upload. Then we get the
file within the bucket. Once we have it,
we have to be very precise about the
information of this file. So let's say
const file document is equal to an
object where we first have to specify
the type of that document. It's going to
be something like get file type. This is
a utility function we have created
before to which we can pass the bucket
file name and then call the type on
it. Then we have the name of this file
which is going to be bucket file name.
Then we have a URL and here we can use
another utility function called
construct file URL to which we can pass
the bucket file dot dollar sign id. Next
we need to get the extension which we
can get by using the get file type which
is another utility function to which we
have to pass the bucket
file. And then call the extension
outside of the parenthesis.
Then the size which is going to be the
bucket file size
original. Then the owner which is going
to be the owner ID. Then the account
ID. Then specify the users that have
access to that file which at the start
is set to an empty array. And then give
it a bucket file ID which is going to be
bucket
filed dollar sign
ID. So why are we doing this? We're
doing this so that once we store the
file, we actually have access to some
metadata about that file. So we can show
an icon by knowing that it's an image or
a video. Then we can know how to access
it. We know which extension does it
have. We know its name. We know its
type. We know its size. All of that
metadata we want attached to that file.
So to store the file itself we're using
appite's storage functionality but to
store the metadata we'll use app's
databases functionality. So let's say
const new file is equal to await
databases dotcreate document. Here we
have to say to which database ID we want
to create it. That's going to be apprite
config database ID. Then we have to
specify within which collection we want
to create it. In this case, it's going
to be the files collection. We have to
give it an ID and we have to give it the
actual file which we want to store. On
this, we can also call a catch with an
async error functionality in case
something goes wrong. So that's going to
look something like this. Async error of
a type
unknown where we can await storage dot
delete file. Uh we have to be very
precise with this because if something
goes wrong with creating the database
document then that means that we should
not store a file in the storage as well.
So we want to delete it. So
storage.delete file from which bucket we
want to delete it. That's going to be
apprite config.bucket
id. And then also which file do we want
to delete? That's going to be bucket
file. Dollar sign ID. And we can also
call the handle error. So let's call it
right here handle
error to which we pass the error and say
fail to create file
document. Finally once we finish, if we
finish successfully, we want to call a
revalidate path and pass the path. So if
we're uploading from the homepage, we
want to revalidate homepage. If we're
uploading from documents, we want to
revalidate documents. So we can show the
new refresh data. And finally we want to
return parse stringify which is a
utility function and to it we want to
pass a new file and this should properly
upload our files to appight's databases
and appight's storage solutions. Great.
So let's try to use this upload file
server action within the file uploader.
So, right after setting the files, I
want to say const
upload promises. And I'll explain
exactly why I called it like this.
That's because we're uploading multiple
files. So, I can say is equal to
accepted files.m map. Not always are we
trying to upload multiple files, but if
we are, we want to do it one by one and
make sure that all of them fit our
requirements. So, we're going to map
over
an async function where inside of each
one we get access to a file and for each
one we open up a function block. There I
have an if statement where I want to
check if files size is greater than max
file size coming from constants. We
simply want to set files by getting the
access to the previous
files because we're modifying the files
based on the current state of the files
by saying prev
files.filter and filter the one where
f.name is not equal to file.name. Why
are we doing this? We're doing it to
clear the files that don't match the max
file size criteria or that are bigger
than what is allowed. In our case, that
is 50 megbytes. Now still within the if
we can go in and return a toast
component. This toast will come right
here at the top by saying const toast
which we can dstructure is equal to use
toast. And I just noticed that we didn't
yet implement toasts. A toast is a
succinct message that is displayed
temporarily. It looks something like
this. So to implement it, we have to run
mpx chat cnen add latest add toast. So
we can do it right here. Let's say y and
let's just press enter for these
questions that it's asking us. Next, it
wants us to add the toaster component to
the root layout. So let's do just that.
I'll head over to root
layout. I'll import it right here at the
top toaster. and I'll render it right
here above the ending main tag here.
Next, we have to use it by importing the
use toast from hooks use toast. We can
do that right here. Then we get access
to the toast. And finally, we can use it
like this. So within the if I'll say
return toast and instead of saying
scheduled ketchup in this case we can do
something like toast that has a
description equal to a p tag with a
class name equal to body dash 2 and
text-white within it. We can render a
span with a class name equal to font
dash
semibold. So let's end it here. Within
that span we can render the file name
and after the span we can say is too
large max file size is 50 mgabytes and
we can give it a class
name equal to error dash toast. So now
if the file is too large we will simply
return this toast saying hey you cannot
actually upload that. And we can
actually already test that out. But
first, let's remove this drag and drop
some files. We don't need that since we
have the upload button. So, I'll go here
and remove the text that says upload
files. There we go. That's this one
right
here. Save it. Now, we have just a
button. I'll click it and I'll choose a
video. This is one of the videos for the
ultimate nextGS course that I'm
recording at the moment. So, let's try
to upload it. It's definitely larger
than 50 megabytes. And it says ask a
question. Question form edited is too
large. Max file size is 50 megabytes.
But if we try to upload a
screenshot, that actually works like a
charm. Great. So now we can continue
with the rest of the setup in case the
file is not too large. So right after
this if
statement we're going to return the
upload file
functionality which is actually a server
action which we created to which we need
to pass the file the owner ID the
account ID and finally the path which we
want to revalidate and that path is
going to come by using the use path
name. So we can say const path is equal
to use path name coming from next
navigation and let's appropriately pass
it right here by saying path and on this
we can call a dot then so once we get
the uploaded
file for each uploaded file we can see
if it has been uploaded successfully. So
if is uploaded file then we want to
actually remove it from the bottom right
corner where we're showing the file
upload process by once again getting the
set files and getting the previous files
and then filtering out the file that has
been uploaded. I know we have a lot of
these filters but trust me that's how
you do it in enterprise applications as
well. Sometimes the code does look a bit
clunky. It looks like it's being
repeated. It looks like there's a lot of
filters, but that's just the logic that
we need to carry out the functionality
that we want to achieve. And finally,
why did we call it upload promises?
Well, that's because we can have
multiple uploads running at the same
time. So, right here where we have the
dependencies, we can say that we don't
have to recall this unless the owner ID,
the account ID or the path don't change.
These are the dependencies for the use
callback that we have at the top. And
use callback just make sure that we
don't have to rerun this code every
time. Only rerun it if these things
change. And now finally right here I
think we need to be within the use
callback of the onrop. We can say await
promise.all upload promises. So we want
to await the upload process of all the
files. In this case, we don't need to
get access to this is drag active from
use drop
zone. And I actually think we're good. I
actually think that this will now
implement the upload functionality. We
have all the necessary checks. We're
removing the files from the list. If we
click on the X. So, let's give it a
shot. I'll try to upload a screenshot.
This one right here of a thumbnail of
our ReactJS crash course. It says
uploading. And we get an error. That's
good. At least something happened. We
have coded a lot of stuff. So it's
normal that an error happens. In this
case, it says invalid document structure
missing required attribute bucket field.
And this is happening on line 45 of file
actions DS. So if I head over to file
actions DS, line 45, it points to where
we're trying to create a new document.
We're using a weight. So let's just make
sure that this is an asynchronous
function. And it is and specifically it
is saying missing required attribute
bucket field. So let me hover over the
create document. It looks like it
accepts the database ID, the collection
ID, the document ID, and then the data.
But I don't see the mentions of a bucket
field under create document. Buckets are
typically mentioned under create file
right here. But maybe we're looking at
it the other way around. Maybe the error
is not within our code because here it
says bucket file ID but our error is
saying that we're missing bucket field
which is something entirely different
and that makes me think that we might
have made an error right here within our
apprite project where we were setting up
the database structure specifically the
structure of our files. So if we head
here and go to attributes, you can see
that I called it a bucket field and made
it required. But actually it should be a
bucket file ID. So let's update this.
Reload the page and let's try to
re-upload another file. In this case,
I'll upload a screenshot of the error
we've been having just to reminisce of
it once we actually fix it. It says
uploading and we get another error
saying account ID is now missing. That's
also happening here and we're passing it
to the upload file as one of the props.
Let's see if that's being passed
properly from the file uploader. If we
go here, we can see that where we're
calling the upload file, we are passing
the account ID which is of a type
string. So this makes me think that
we're passing it properly. And are we
passing it to the file uploader? That is
another question. So let's head over to
where we're calling the file uploader.
that's going to be within our header, I
believe. So, let's head over into the
header component. And as you can see,
we're not passing the necessary props
that will make the file uploader
work. So, let's first do that. And
that's going to be the last step needed
to make this work. We need to pass the
owner ID and the account ID. But you can
see that even our header doesn't have
access to those. So, let's head over to
the root
layout and let's pass the necessary
props to the header component. I got to
say we are doing just a bit of prop
drilling right here because we're going
too level deep with passing props, but I
will still consider this to be fine in
this case. So, let's pass the user ID
equal to current
user dollar sign ID. And let's also pass
the account ID equal to current
user dot account
ID. Now we can head over to the header
and we can accept those two new props.
That's going to be a user ID as well as
an account
ID and those two will be of a
type. User
ID is of a type string and account ID is
of a type string as well. And now we can
pass them over to the file uploader by
saying owner ID. So who owns this file
that's going to be equal to the user ID.
And we have the account ID which is
going to be equal to the account ID. And
I know that we're calling the file
uploader from one another file. I think
it's going to be mobile navigation. So
right here we also have to pass the
necessary props. But in this case, our
mobile navigation I do think already has
access to the owner ID and the account
ID. Let's see if that is the case where
we're calling it right here. We're
spreading all the information about the
current user. So in that case, we won't
have the user ID, but we will have the
current user dollar sign ID for the
owner ID. So I can dstructure the dollar
sign ID and account ID is as it is. But
in this case, we can rename the dollar
ID to owner ID. It's going to make it a
bit easier to refer to later on. And we
need to define it right here within the
props. Now, let's pass them over to our
file uploader. That's going to be owner
ID equal to owner ID and account ID
equal to account ID. If we do that,
we're good. Our file uploader is getting
all the necessary props. And in this
case, I have to thank apprite because we
made the field required. So it let us
know that we're not actually passing all
the necessary fields. But now we can try
to upload this one more time. It says
uploading and it actually disappeared
very quickly though, which made me think
that it actually uploaded the file to
the database. So, if I head back over to
AppRight, go to databases, files, and
then documents, we can see a new
document has been added with a name of
screenshot, a URL where it has been
uploaded to a storage bucket with a type
of image, a bucket file ID, account ID,
owner, which is a relationship to the
user, the extension of PNG, the size,
and everything else.
And if you head over to storage file
storage, you can see a single screenshot
that has been added. And it's actually
this error screenshot that thankfully
has been resolved. But you can see that
we actually have a URL that allows us to
access it. So that means that our file
upload functionality has now been
completed. And just for good measure,
let's also see if it works from the
mobile menu. So, if I head over here and
click
upload, I'll try to upload some other
screenshot. And it looks like it went
through. Great. Now, it's possible that
if you try to upload a bit of a larger
file, it didn't work for you, even
though the maximum size is 50 megabytes.
That's because NexGS payload by default
has only 4 megabytes limit. So we can
close all the currently open files and
we can head over to next configt DS and
we need to add a new object right here
called experimental. Open it up and we
need to set the server actions
specifically the body size limit to
let's do something like 100 megabytes
just to make sure that we're not blocked
by Nex.js. So now both of our limits
apps is set to 50 for free projects and
Nex.js's is set to 100. So we should be
good. Next we'll have to render all of
these different pages such as documents,
images, media, others, and more. That
will allow us to fetch the files we just
uploaded and then show them on the
screen. That's the whole point of this
application anyway, right? To be able to
upload, store, and then retrieve the
files.
But feel free to take a bit of a pause
now because this lesson has been a long
one. The functionality for implementing
the upload has been well let's say
detailed with this file uploader
component and then even the upload file
actions haven't been super simple to
make. We had to mess with the storage
and database create a new file and then
also create a new document in the
database to store all of that files as
metadata. While we're here, I just
noticed that we have one issue regarding
the upload file props coming from types.
Let's see why is that. In this case,
we're importing this. As I said,
typically when you declare interfaces,
you don't even have to import them. But
then, even though our TypeScript knows
how to find this interface because it is
declared as a TypeScript interface, you
can see that ESLint is simply not okay
with that. So what we could do is
suppress this no undefined line so that
even eslint is fine with it. And this is
actually a good solution. What you can
do is you can suppress this eslint
warning for the entire file by copying
this no undef heading over to
eslint.rc.json going after the extends
and adding the rules functionality. And
within the rules, you can say no
undef. So if you go back, we're good.
Typescript knows what it is. Everybody's
happy. Great. With that said, we have
successfully implemented the file upload
functionality. Next, let's focus on
adding the routing for these different
pages so we can actually show the files
that we have created.
to start implementing dynamic routing to
render different routes for different
file types. Let's head over to our file
explorer. Go within the app folder and
let's create a new dynamic route within
the root folder. I'll call it new and
let's open up the dynamic segment which
you can do with an opening and closing
square bracket. And let's call it type.
And within this dynamic type path, we
can render a new
page.tsx. Within it, run rafce. And
we're just returning page right here.
Now, a better question is, how can we
extract the exact type of the page we're
on? Right now, if I head over to
documents, you can see that it simply
says page. Still, if I go to images, it
still says page even though the URL
changes. So let's do that by extracting
it from params. We can dstructure the
params at the top and say that it is
equal to search param props. Then we can
say const type is equal to now in new
versions of Nex.js you have to await
params. So let's say await params and
then question
mark. We can also add as string right
here. So our typescript is not
complaining. And since we're using a
weight, we have to turn this function
into an asynchronous function. That's
going to look something like this. And
if we don't have a type, by default, it
can be an empty string. So now, instead
of rendering just a page, let's render a
div with a class name equal to
page-container. Within it, let's render
a new section that'll have a class name
equal to
w-ool. And within it, we can render an
H1 with a class name equal to H1 and
capitalize. And here, let's render the
type. So now, check this out. Documents
basically says documents. Dashboard
still is different because that's just
the home route. It has to be different
from all of the other type routes. But
images, media, others, we can switch
between them immediately. Now we can see
the powers of the left side sidebar. How
the active class changes based on the
URL and the page changes as well. In
simple words, we have just created a
dynamic route. And a dynamic route is
where the path changes based on the URL
instead of being static. This is handy
when you want to create multiple pages
that follow the same structure. Like in
our case where we have the same
structure for video, audio, others,
images, and so on. At least the layout
is the same.
But in our case, the file type document,
video, audio, others actually changes
and displays some different kind of
data. So now let's continue developing
it. Right below the H1, I want to render
a div that'll have a class name equal to
total size section. And within it, we
want to render a P tag with a class name
equal to
body-1. And right within it, we can say
total and then render a span with a
class name equal to H5. That's going to
simply render the total size. But of
course, this total size has to come from
somewhere. We have to somehow fetch it.
So for now, I'll simply say 0 megbytes.
Let's fix this class name and let's save
it. There we go. Total 0 megabytes.
Right below that we can create a new div
which we'll use for sorting. So here we
can give it a class name equal to
sort-ash
container and within it we can render a
p tag with a class name equal to
body-1 and typically hidden but on small
devices block and text- light 200 within
which we can say sort by and then below
it we can render a new sorting
component. So let's create a new
component within the components folder
and let's call it
sort.tsx
runce and then imported right here where
it says sort coming from
components. If you now save this, you
can see a little sort by sort right
here. But very soon we'll turn this sort
into an actual sort that allows you to
sort by name, file size, type, and more.
But for now, let's actually display our
types because it doesn't make any sense
to sort them if we cannot even see them.
So for that reason, let's go below this
section and let's try to dynamically
render the
files. To do that, we first need to know
which files are we trying to fetch. In
other words, we have to write a query
that will allow us to fetch the files.
So let's head over to file actions and
below the upload file we can now create
a new one export const get
files which is equal to an async
function and we can get started creating
it within it we can get access to
appight's databases functionality by
saying cons databases is equal to await
create admin client like so and then we
can open up a try and catch
block within the catch we get the error
and in case something goes wrong we just
handle that error like a boss. So let's
just pass over the error and say fail to
get files. Within it we can form the
query to get the files not all the files
but rather files based on many different
criteria. One of which and maybe the
most important of which is the user that
is currently logged in. So we only need
to show the files that they have access
to. So we can say const current
user is equal to await get current user
and below that we can check if there is
no current user. So if no current user
then we simply throw a new
error saying something like user not
found. Now that we have the user, let's
form all the different queries to query
our files by saying const queries is
equal to a call of the create queries
function to which we can pass the
current user. So let's create this new
helper function called create queries.
We can do it right here at the top.
const create queries that accepts in a
current user and then starts forming the
queries which is basically equal to an
array of multiple different apprite
queries such as
query coming from
apprite
or and then within it a query.equal
equal where the owner property is equal
to an array of current
user dollar sign ID and then we can
duplicate this and check whether the
current ID is within the users array of
a specific file that would also be okay
or in this case it would be their email
not the user ID because the access to
that file has been shared with them so
that's also a completely valid way in
which we want to get access to a
specific file. Now that we have those
queries, we can simply
return the queries and later on we can
further extend them by looking at
search, sort, limits and more. But for
now I'm fine with just having those
queries and the current user will be of
a type
models document. This models of course
coming from apprite. So you can import
it from node app. And now we get access
to those queries right here. So let's
actually make a call to the database. We
can do that by saying const files is
equal to await
databases.list documents. We first have
to tell it from which database we want
to list documents from and that's going
to be apprite config. database
id. Next we have to tell it from which
collection. In this case it's going to
be from the files collection. And
finally, we pass in all the queries that
we want to use to query the files. And
here I need to say list documents. There
we go. Let's properly close it. And
we're going to simply return parse
stringify the files that we have
gathered. Now let's head back over to
the page and let's try to make a call to
this server action by saying const files
is equal to await get
files which is coming from lib file
actions and to it we can pass our
current user. So let's put it in an
object if we're dstructuring it. Just
call it like this. It doesn't need any
parameters for now. and then try using
it right here below by saying if
files.length length is greater than
zero, then render a
section.
Else render a p tag saying no files
uploaded that's going to have a class
name of empty dash list. And if you do
that, we get an error saying invalid
query cannot query equal on attribute
users because it is an array. So if I
head back to file actions and if we look
into the queries that we wrote, you'll
notice that for the users, we have to
say contains and not equal because two
arrays can never be the same. So if we
switch this over to contains, you can
now see no files uploaded for documents.
Same thing for media and others. But
what about images? It also says no files
uploaded. That's not good because we
know that we have uploaded some images
before. So let's quickly check our query
where we're fetching the files and let's
console log different parts that go into
the list documents such as console log
the current user and let's also console
log the queries that we have and finally
let's console log the files themselves
by saying console
log
files. Now if we save it and reload the
page and open up the terminal let's see
what do we have here. We get back the
current user and its account ID as well
as the dollar sign ID. I think we're
using specifically the account ID right
here in the query. Yep, current user
dollar sign ID. Here it is. And current
user email. Let's see if we have that.
Yep, we have that too. Next, let's see
whether we have access to the queries.
Yep, queries look good to me. method is
or with the values equal to the owner ID
or if it contains our email address. And
finally, we get back two files which are
counted as documents. Oh yeah, that is
true. The files are actually within the
documents array. So if I head back, this
is not going to be files.length. It's
going to be files.total is greater than
zero. And if you do that, the no files
will disappear, which means that we can
try to render some of the files right
here. So let's actually render a class
name on this section equal to file list
and within it let's map over files dod
documents dom where we get each
individual file of a type models
document and for each document we can
return an h1 with a class name equal to
h1 and let's make it simply render the
file dot I think it has a title if I'm
not mistaken taken. Let's see if that is
the case. Oh, we got a warning that we
need to have a key prop. That's right.
So, each H1 has to have a key equal to
filed dollar sign ID. There we go. And
it might not be title. Let's see what do
we have under a file. Let's try to
render its ID for now. The dollar sign
ID. At least we know that has to be
there. And take a look at this. For
images, we have one and it appears to be
two. And for all these types, we have
two right now because we're doing the
same fetch for all of them. So it
doesn't matter on which page we're on,
at least not right now. But later on,
based on the page URL, we can change
this. So let's try to render the
file.name. And you can see that we have
two different screenshots. This is
perfect. It means that we're
successfully fetching the documents from
the database. Of course, it would be
much better if we could actually show
that as a nice card, give a preview of a
thumbnail, and allow the user to see
this image. This on its own is not super
useful. So, let's create a new component
called
card.tsx
runce and let's import it here instead
of this h1. So, that's going to be now a
card component. Make sure to give it a
key equal to filed dollar sign id and
then pass a prop file is equal to file.
So now within this card we can access
all of the properties related to each
file so we can create a proper file
card. Let's dstructure those properties
just to be where we were. Each file is
of a type file models document. Make
sure that the models is coming from
apprite. And now we can render a
file.name name for each file. There we
go. We have two different screenshots.
But now, let's turn this into this. Much
more beautiful cards for each different
type of a file. It can be a video, it
can be audio, it can be an image, and so
much more. So, let's do that in the next
lesson.
to start creating our file card. Let's
turn this div into a link because each
file will actually be clickable and it
can lead you to the details or open up
the modal for that card. Of course, a
link has to have an href. And in this
case, it'll be equal to file URL. And
we're going to also give it a target
equal to underscore blank so it opens up
in a new screen and doesn't close our
existing window. We can also give it a
class name equal to file-ashcard. There
we go. Now it looks more like a card.
Right within that link, let's render a
div. And that div will have a class name
equal to flex and justify dash between.
Right within it, we can render a
thumbnail component which we created not
that long ago. It needs a type equal to
file.type as well as the extension equal
to
file.extension. and we can close it
right here. You can notice that we'll
get some errors and some broken images.
So to fix it, let's also give it a URL
equal to file
URL. Let's give it a class name equal to
exclamation mark size 20. That's to make
it important to make sure that our
classes are getting applied. And let's
give it an image class name equal to
important size 11.
If we do that, it'll make them a bit
bigger and it'll make the errors go
away. But now, why is this image not
actually showing? It is saying the
current user is not authorized to
perform the current action. That happens
if I click on it. But if I reload, yep,
the images don't seem to be showing, and
that's because we're getting a 401 from
AppRight Cloud. We can look into fixing
that later. But for now, let's deal with
the rest of the card. I'll go right here
below the thumbnail and create another
div that'll have a class name equal to
flex flex- call items- end and justify
dash
between within this one. Later on, we'll
have the actions drop-down component
which will show some kind of a drop-down
that gives us additional actions that we
can perform on this file such as rename
it and do all kinds of other stuff. But
for now, let's simply keep it as a piece
of text. Below it, let's add a P tag
that'll have a class name equal
to
body-1 and it'll call convert file size
and we can pass to it the file size.
This way, instead of getting a large
number, we're getting something that
looks a bit more reasonable. Like a
typical file size would be huge number
in bytes. But here we pass it the bytes
and then we get a reasonable number in
kilobytes, megabytes or gigabytes. Now
we can go two divs down and then create
another div right below it that's going
to have a class name equal to file-card
dash
details. Within it, we can have a p tag
within which we can render the file
name. So let me actually use this name
right here within the p tag. and I'll
give it a class name equal to subtitle-
2
line-clamp-1. This ensures that it
doesn't take more than a single line.
After that, we can go below the p tag
and render a new component called
formatted date time. It'll be a
self-closing component. So, let's go
ahead and create it within the
components folder and call it
formatted date time.t
tsx run
rafce and then simply import it right
here. It's going to simply say formatted
date and
time and to it you want to pass a prop
of date which is going to be file dot
dollar sign created at as well as some
additional class names like class name
is equal to
body-2 and text-
light- and now we can accept those props
within the formatted date and time it's
going to be date and class name of a
type date is a string and class name
will be optional also of a type string
and what this will be is a simple P tag
that'll call the format date time and
pass in the date and we can give it a
class name equal to CN which stands for
class names body-1 and text- light-200
always and then sometimes also apply by
the additional class names that come
through props. That's going to look
something like this. So now we can see
5th of November, 8:56 a.m. 8:58 a.m.
right here. Great. So that is our
formatted date and time. And below it,
we can have another P tag that'll say by
and then render the
file.name. And we can further style it
by giving it a class name of
caption
line-clamp-1 and text-
light- 200. Now it's a little smaller
right here, but it still looks good. So
besides this image not actually showing,
we have successfully completed this card
UI. And it's not only that the image is
not showing. If you click on it, that's
supposed to open the image. But we get a
401, which means unauthorized. And this
means that the fix could only be in one
place. And that is within the app rights
dashboard. If you go to the project,
head over to storage file storage
settings, and then right here, go to
permissions, add an any RO, and turn on
all the permissions for that role, and
click update. Another cool thing about
apprite file storage is that it allows
you to have a certain file security
enabled so that users can access it only
if they have access to bucket
permissions. You can configure whether
or not the files inside the bucket
should be scanned by the apprite anti
virus and you can also choose a
compression algorithm. There's a lot of
stuff that you can do such as choosing
allowed file extension. Basically
letting us know that choosing apprite
for the file storage application was the
correct choice. So going back now that
we have reestablished our permissions.
We can reload and take a look at this.
We can see the thumbnails right here.
And if you click on it, we can see the
full image. Of course, I should have
used some better looking images, but the
most important thing right now is that
we can actually see the images, see the
files that we uploaded, and even access
them within their full definition
online. As you can see, the URL is
pointing to
cloud.apprite.io v1 storagebucket and
then to the ID of that file. Great. So,
that means that we're almost done with
this file card, but now we have to
implement the actions dropdown.
That's this thing right here. So, let's
go ahead and create a new component for
the action dropdown. I'll call it action
dropdown.tsx. Run rafce. And then I'll
import it right here instead of this
piece of text. That's just action
dropdown. And it's going to be a
self-closing component to which we can
pass the file equal to file.
So let's head into that action dropdown
and let's go ahead and implement it
together in the next
lesson. Let's implement our action
dropdown. It should look something like
this. Once you click on it, it should
open up some kind of a combination
between the shaden dialogue and a
drop-down menu component. So let's
implement it by heading over to chaten
and specifically I'll go over to the
dialogue component.
Yep. This dialogue right here, I believe
we have already installed it. So, we can
just go ahead and copy all the imports
that we'll need. And then we can copy
its usage right here. I'll paste it in
the action dropdown. Oh, it looks like
we haven't actually installed it. So,
let's go ahead and do that by copying
this command and running mpx chats add
latest add dialogue and press enter to
install it. And the second component we
need is a drop-down menu. So search for
drop-down menu. It looks like this. So
go ahead and install
it by running mpx chaten at latest add
drop-down dash
menu and then simply copy its
imports as well as its usage right here.
We can put it right here instead of all
of this content from the dialogue. We
simply need a dialogue and then within
it we'll immediately display a drop-own
menu. So we can remove all the other
imports from the dialogue. And now if I
head back and click open, this is what
we get. So let's define some use states.
In this case, we'll have a use state
equal to is modal open. Set is modal
open at the start equal to false. And
we'll also have another use state
snippet called is dropdown open and set
is dropdown open which will at the start
be set to false as well. Of course if we
want to use the use state we have to
turn this into a client component which
it definitely is. There we go. Now let's
give this dialogue a open property equal
to is modal open as well as the onopen
change equal to set is modal open. For
the drop-down menu let's give it the
open property equal to is drop-down
open. And for the onopen
change let's actually give it set is
dropdown open. Next, we have the
drop-own menu trigger, which is going to
have a class name equal to
shad-now-focus. And within it, we can
render a next.js image tag with a source
of forward slash assets/icons/Ots.svg
SVG with an alt tag of dots, a width of
about
34, and a height of
34. There we go. So now this is looking
closer to the design. Now let's focus on
what happens after we click it, which is
the drop-down menu content. We first
have the drop-own menu label which will
have a class name equal to
max-W200 pixels and
truncate in case the name is too long
and within it we can render the file
name. Of course we have to get access to
the file through the props. So let's
dstructure the file that we passed over
and this file will be of a type file is
models.doccument. document models coming
from node apprite. So now we can see the
file. Next we want to render a separator
and then we want to render a couple of
different menu items. And for that we
actually want to map over
actions drop-down items map where we get
each individual action item. And for
each one, we automatically return a
drop-down menu item that has a key equal
to action item value. And for now, it
can just render the action item
label. So we immediately got rename,
details, share, download, and delete,
which will be all of the different
actions that we will support from within
our application. Now, where are these
actions coming from? Well, if you hold
control or command and click on them,
it'll lead you to our constants where
you can see that this is simply an array
of different objects that have a label,
icon, and a value. And we just list
different functionalities, which I
simply copied from the design right
here. Now, let's go ahead and style it
so it looks better. First things first,
each one of these drop-down menu items
will have a class name equal to
shad-ashdropown item and it'll have an
on click property. So once we click it,
we want to choose which action we have
selected. So for that reason, we want to
go here and create a new use state
snippet for the chosen action. I'll call
it action set action at the start set to
null. And we can say that this action
will be of a type
action type coming from
index.d.ts or null because at the start
it is set to null. And now we can scroll
down and on click we can set action to
be equal to action item just like so. We
can also make a check and see if an
array of
rename or share or delete or
details do includes the action item do
value. Then we're going to set is modal
to open. That's going to look something
like this. Why is that? That's because
if we choose anything from here, we want
to show a new model that's going to
allow us to perform additional actions
that we specified. Like rename opens up
a rename modal. Details opens up a
details model. Delete opens up a modal
that allows you to confirm your
deletion. Same thing for share. It opens
up a modal to ask you with which people
you want to share it with. And the only
thing that doesn't open up a new model
is download as it automatically
downloads it. So that's why we're doing
this here. And it looks like I didn't
properly close this array right here. I
have to close it here. There we go.
That's better. And then what do we
actually show for each action item? It's
not just a label, is it? Well, we want
to make it into a link with an href of
construct download URL to which we can
pass the
filebucket file ID. And this construct
download URL is coming from utils. It'll
simply point to our apprite endpoint and
then construct the URL that contains
this file by finding it in the files
array. And then it'll also point to
forward/d download and pass the
necessary project. So it knows exactly
where that file is stored. We can also
give this link a download property equal
to file.name name and a class name
property equal to flex items center and
a gap of two. Now we cannot see anything
just
yet. But within this link we can render
an
image. This image will render different
icons for each one of these types of
actions. So that's going to be action
item do icon. All tag will be equal to
action item label. It'll have a width of
about 30 and a height of about 30. And
we can save
it. Oh, it looks like action item is not
defined. So, we have to properly spell
it. And now we can see those different
icons which match our application's
theme perfectly. But of course, next to
the image, let's also render the action
item that label. There we go. This is
looking great. But now we'll only show
this link if we're trying to download
something because then we navigate to
the download link, right? Else we don't
want to make it a link. So what I will
do is I will add a new check right here
and check if action item value is triple
equal to download. In that case I will
show this link.
else we can render a div that'll have
the same class names as the link and
it'll actually render the same thing
that is within the link which is the
image and the label but it simply won't
be a link it'll be just a simple div. So
now everything is looking the same but
if you click download it'll actually
immediately download the image and you
can see that it works
wonderfully. There we go. That's great.
But all the other links won't do
anything for now because what they have
to do is open up a new model. And that
model looks something like this. I mean,
if you check this out, this is the model
for sharing. And we have a model for
renaming as well as moving to trash and
so much
more. We'll make it super reusable. So,
let's actually focus on implementing
that dialogue or that modal that'll show
up. We have a dialogue here, but then
within it, we're showing the menu. So
sometimes we need to show this dialogue
content in form of a modal and we can do
that by saying const render
dialogue
content is equal to an arrow function
that looks like this and then it can
return some kind of a dialogue content.
So we can say dialogue
content coming from components UI
dialogue and then we can say dialogue.
Now, when will we render this dialog
content and where we're going to render
it? At the bottom of this dialogue we
created right here where we have the
drop-down menu. Right below it, we'll
call the
render dialogue content as a
function. Immediately, we'll get some
errors. Let's see what they're saying.
They're saying that a dialogue content
requires a dialogue title. Okay, that's
not a problem. Let's just head over to
Shatzien, search for dialogue, and copy
everything from within the dialogue
content. That's going to look something
like this. It has the content, the
header, the title, description, and all
that good stuff. And of course, we need
to get the imports for the dialogue as
well. Now that we're actually putting it
to practice. So, let me copy it right
here and paste it.
Now if we go back and click and click
rename, you can see that a new model
shows up. But now is our turn to style
it properly. So let's give this dialogue
content a class name equal to shad
dialogue and
button. That's much better. Let's give
the dialogue header a class name of flex
flex- call and a gap of three. Let's
give the dialogue title a class name of
text- center hint text-
light- needs to render a
label specifically an action label. So
what we can do is say if there is no
action we're going to simply return null
nothing. But if there is an active
action we can simply dstructure the
value and the label from that action. So
we don't have to say action label every
time. We can simply render the label.
There we go. Now the label says rename.
We don't need a dialogue description in
this case. But below the title we want
to make different checks for different
types of actions. So if a value is
triple equal to rename in that case we
want to render an input field that looks
something like this coming from
components UI
input. It'll have a type of text and a
value equal to. And now the question is
where are we going to get the value
from? Well, we're going to keep it all
in the state. So right here at the top
we can create a new use state snippet
and call it name which is going to mean
file name at the start equal to file
name because we already have the file
name but we might want to modify it. So
now if we head down we can pass the
value equal to
name. If you save that and click rename
you can see that the value is already
populated exactly what we want. Now we
also have to somehow keep track of the
change in that name. So we can say
onchange is equal to we get an event and
then we call the set name with e.target
value. So now if you decide to change it
you can freely change it like this new
file name. Of course we need to be able
to submit that somehow. So let's go
below the dialogue header. Let's create
an array and say if an option is rename,
delete or
share. If any one of these three are
included, so that includes the value of
the current action, then let's render a
dialogue footer as well. This dialogue
footer will have a class name equal to
flex flex- call a gap of three and on
medium devices a flex of row because we
don't have enough space to show it in a
column and within it of course we'll
render a button a submit button as well
as a cancel button. So this first one
can be a cancel and the second
one will be a submit. Within the submit,
I'll render a P tag with a class name of
capitalize and there I will render the
value which simply means the action
we're trying to perform like rename.
Also next to that we have to know
whether we're currently loading. So I'll
create a new use state and I'll call it
is loading. Set is loading at the start
set to
false. And then I can say if is loading
then render an
image that's going to have a source of
assets
icons
loader. SVG with an al tag of
loader a width of about 24 a height of
about 24 and a class name of animate
dash
spin. And we can close it. There we go.
That's looking good. I'll reload the
page. There we go. Let's now give
functionalities to these buttons. I'll
create two new functions. One will be
called const close all modals which is
going to be equal to a function. It
simply sets everything to false. Set is
modal open
false. Set is dropdown open false. Set
action. We want to reset the action that
was selected. So set it to null. Set
name back to the original file.name. And
later on here, we also want to reset the
set emails that we're trying to share
this account with in case the user
didn't proceed with the sharing. This
will be if we cancel the action. But if
we don't cancel it, then we want to
handle it. So we can create a new handle
async function called handle actions.
And we can call these on their
appropriate
buttons. So on the cancel button, we
want to give it an on click equal to
close all modals with a class name of
modal dash
cancel. If we save it now, even if we
change something and I click cancel, it
closes it and the changes didn't take
effect. Great. Now let's do the opposite
with the second button by giving it an
on click equal to handle actions or no
that should have been action singular
because it can only do one at a time. So
handle
action and we can also give it a class
name equal to
modal-submit
dashutton. There we go. This is looking
good. So now we have a fully functional
model that allows us to perform
different actions or at least it
properly showcases the action for the
rename at the time being. So now that we
have the UI to make this functionality
work, let's implement the logic for the
rename file functionality. Let's do it
together in the next
lesson. To implement the rename
functionality, let's go back to our code
and let's head over to file.actions.ts.
ts. We can scroll down and we can create
a new function by saying const rename
file is equal to an async function that
accepts a couple of props which we're
going to dstructure such as the file ID,
the name of the file, the extension and
the path to regenerate. All of these
types are going to be of a type
rename file props and we can open up a
function block. Now we have to implement
it. To start implementing it, let's open
up a function block. Let's get access to
the
databases coming from apprite which is
equal to create admin client. Let's open
up a try block as well as a catch block.
And within the catch we can handle the
error by saying fail to rename the file.
But within the try we can try to form a
new name. So const new name is equal to
a template string of
name.extension and then we simply get
the updated file by saying is equal to
await
databases.update document. So in this
case we're updating the metadata stored
in the database. and not the file within
the storage. That's because we're
handling files metadata within the
database. So now we have to choose the
database ID, then the collection ID,
then the file ID which we want to update
and finally provide the data which we
want to update. We want to update the
name to the new name and after that we
want to revalidate the path to point to
this new path and return parse stringify
the updated
file. Now we can export this rename file
and we can use it within our actions
dropdown.
If we head over to this handle action,
we can first check if there is no
action, then we simply want to return
not do anything. If we start doing
anything, that means that we must start
with the loading. I'm going to set the
success status equal to false at the
start, but we can change it later on.
And then I want to create an object of
all the different actions and the
corresponding functionalities attached
to those actions such as a rename
action. On rename we want to call a
callback function that calls this rename
file function to which we need to pass
the file ID name extension and
everything else. So let's say file ID is
equal
to filed dollar sign ID. Then the name
is equal to name. Extension is equal to
file.extension. And we pass in the path.
That's going to look something like
this. The path in this case has to come
from use path of course. So let's say
const path is equal to use path name
coming from next navigation. There we
go. And now we're handling the action of
a rename. Of course for share it's going
to be an entirely different callback
function that'll do a different thing.
Same thing for delete. But for now let's
focus on rename. So we can modify the
success status based on the return of
the action.
Bear with me. This will be a bit more
complicated. We want to
await actions and then we want to access
a specific action value. Meaning if it's
rename, then we want to just call the
rename
functionality. So we'll just call it
like this. Finally, if we have a
success, then we want to close all
modals and set is
loading to false. Now, let's put the
success as a let variable because we're
modifying it right here. And let's also
define the types right here saying that
action value will be as key off
type actions. This way it knows that it
can be only one of these three things
rename, share or delete. And then we can
call actions dot rename, share or
delete. In this case, we're calling
rename. So now if we go back to the
browser and try to rename this error
screenshot, we can do that by saying
rename. Let's call it error
screenshot. And click rename. And it
should call that server action. And you
can see that it successfully renamed it.
That's great. The second one is a
screenshot of the ReactJS full course.
So let's simply rename it to React full
course. And that's it. Our rename
functionality now works. Now in a very
similar
manner we'll implement all the other
functionalities like view details which
is going to be even simpler or maybe
move to trash like this or even the
toughest one which is going to be the
share where we'll be able to choose
which users we want to share it with
based on the email. So next, let's focus
on this one right here, which is view
file
details, such as the file size, the
owner, the last edit, and the
format. To start implementing file
details, head over to the components
folder and create a new file called
actions modal
content.tsx and run rafce. We're going
to use this actions model content to
create some helper components to display
things within our action dropdown. So
right within here, we won't have just a
single default export called actions
model content. Instead, we'll have
multiple smaller exports that are going
to help us form the UI in the action
dropdown. We can call the first one file
details like this and export const file
details.
These file details will accept the
actual file which is going to be of a
type file is
models.doccument models coming from node
apprite. Now we can head back over to
the action dropdown. Head down to render
dialogue content. And so far we have
covered the case where the value is
equal to rename. But in this case we
want to make a check and see if value is
equal to details. And if it is we want
to render a self-closing file details
component like this to which we can
provide a file is equal to file. Now,
back within documents, if we head over
and click details, you'll be able to see
file details. So, let me collapse the
browser and head over into the file
details component. Within here, we can
first create an additional helper
component const image
thumbnail, which is going to be a
component for displaying file
information. So, let's pass it the file
equal to file modules.cument document
and it can have an immediate return
meaning just parenthesis where it'll
return a div with a class name equal to
file-details- thumbnail if we spell
class name properly and now we want to
use it within the file details so right
here I'm going to use a an empty react
fragment and within it I will display
image thumbnail to which I will pass the
file which is equal to file
Now I'll collapse this just so we can
see the browser as well. And you can see
what soon will become the image
thumbnail. So let's actually render the
thumbnail by rendering the thumbnail
component which we created not that long
ago to which we have to pass the file
type. We also have to pass the
file.extension. And finally we have to
provide the URL equal to file URL. And
we can close it right here. If you do
that, we can see a little thumbnail of
the file. Below it, let's render a div
that'll have a class name equal to flex-
call and flex. And within it, I'll
render a p tag that'll render a
file. We can style it a bit by giving it
a class name equal to subtitle- two and
margin bottom of one. And below it, I
want to render a formatted date and time
to which we're going to pass a file dot
dollar sign created at
property and a class name equal to
caption. If I save this, you can now see
a little timestamp appearing right here.
And that's going to be it for our image
thumbnail. But now we can continue
adding more file details. So let's
create an additional helper component
called detail row. const detail row is
equal to a component that accepts a
label and a value for that label. We can
define those with different types. Label
of a type string and the value of a type
string. And we can have an immediate
return. We're going to return a div with
a class name is equal to flex a
paragraph within which we will render
the label and it'll have a class name
equal to
file-details- label and I'll duplicate
it below change this to value and then
change the actual value of label to
value. If I save this we can now use
this detail row. if I fix the spelling
right
here, right here within our file
details. So let's do just that. I'll
call a single details row as a
self-closing component to which I'll
pass the label equal to format and then
a colon and a value equal to
file.extension. If we save it, you can
now see format.png.
If I duplicate it one, two, three more
times. We can also provide a size equal
to file dot but of course we have to
wrap it in convert file size and then
call file.s size. There we go. The next
one will be owner. So who is the owner
of the file? That's going to be
file.ame. And finally we can do
something like last edit which is going
to be file dollar sign updated
at there we go and we can also wrap this
in format date and
time it's this function right here to
which we will pass the file updated at.
Of course this format date and time has
to be
imported. So if we do that properly and
if we head over to details you can see
format PNG size owner and last edit we
can compare it with the design and it
looks like it's quite similar but the
text is left aligned. So I have to left
align these values which we can do by
wrapping these detail rows in a
div and putting them all
together and giving this div a class
name equal to
space-y-4 padding x of two and padding
top of two as well. This will at least
give it some spacing. But to fully align
it, we can give those two P tags a text
dash left property, which will align it
on the left. And now this is looking
much better. This is looking great to
me. So right below the details action,
we now want to deal with the share
functionality. Yep, share is coming
next. And it is one of the most exciting
features of our application because
it'll allow us to share the files with
other accounts. So let's do that next.
To implement the share functionality,
let's add a new check right here and see
if the value is equal to share. If that
is the case, we can render a new
component. Let's call it share input. Of
course, this is a new component that we
haven't created yet. So, let's head over
to the components folder and create a
new share input.tsx.
run ref inside of there and let's simply
import it right here. Once you have it,
this share input will have to know which
file do we want to share. So let's pass
over the file. Let's also create a new
use state at the top and let's call it
emails and set emails at the start equal
to an empty array. This is going to be
an array of emails with which we want to
share the file. And let's also create
another function right here. I'll call
it const handle remove user. And that's
going to be a function that will remove
the users from the sharing functionality
if needed. So now let's pass those props
over to this component right here. So if
value is equal to share and that's going
to go below the details then we can pass
it over the oninput
change which can be equal to set
emails and in the same way we can also
pass the on remove equal to handle
remove user and I just noticed that I
messed up the value check for the
details it should have been triple equal
sign so only if it is details then we
show that model still works, but now we
can work on the share. There we go. So
now let's head over into the share
input. Let's implement the UI and then
we can focus on implementing the
functionality. We already know which
three props we want to get. We want to
have the file, the oninput change and on
remove and these will be of an interface
called props. So let's define the props
right here by saying
interface props and it's going to have a
file equal to
models document. It'll also have an
oninput change which is going to be a
react.dispatch. Specifically it'll be a
dispatch of react set state action which
is going to set an array of
strings that's going to look like this.
And finally we have the on remove which
is going to accept an email which we
want to remove of a type string and
it'll return void meaning nothing. Now
right within this share input we can
actually use an image thumbnail which we
created in the action model content.
This one right here. So I want to make
sure to use it. So you know what if we
kept the details right here we can also
keep the share input here as well.
So let me actually copy this part the
interface and the share input
declaration and then I will actually
remove the share input file
itself. And I'll put it within the
actions modal content right here below
the file
details. And of course we'll have to fix
the import within the actions dropdown.
So let's head over to actions
dropdown and let's fix the import. It's
going to come from actions modal content
of course only after we actually export
it by saying export const share input.
Great. So now let's use this image
thumbnail which we have created just
above. That's going to be image
thumbnail, not the image, but rather
image thumbnail, which is going to
accept a file equal to file. That's
going to look something like this. And
let's make sure that it's actually
taking account of the changes. If I head
down and see where we have the share,
it's pointing to the right one. I'll
reload the page as
well. Go over here to share. And now we
can see the image thumbnail. This is
great. So we know what we are sharing.
Now right below it we can create a new
div with a class name equal to share
dash
wrapper. And within it we can create a
new p tag that's going to say share file
with other users. And of course we can
style it further by giving it a class
name equal to subtitle- two padding left
of one and text- light of 100. Next
right below it I'll render an input.
This input will come from components UI
input and to it we can pass a type which
is equal to email a placeholder equal to
enter email
address on change we can handle that
event by saying oninput change and then
we can use the e.target target dot
value. But in this case, I will trim it
and I will also split it based on commas
because sometimes maybe somebody wants
to add multiple emails right within a
single
input. Finally, I'll give it a class
name equal to share dashinput dash
field. Okay, that's looking better.
Right below it, let's create another div
and give it a class name equal to
padding top of
four. Another div within it with a class
name of flex and justify dash
between. And within it, we can render a
P tag that'll have a class name equal to
subtitle-2 and text-
light- that's going to say share width.
And then below it, we can duplicate that
P tag. And then here we can say file do
users.length users. So instead of saying
share with users, I'm going to say
shared width. And then here I'm going to
show the number of users. And we can
change this text light 200 to denote it
like
this. Right below it, we want to map
over the different users. So let's
create a new ul an unordered list. Below
the
div, it'll have a class name equal to
padding top of two. And here we can say
file do users do map. And then for each
user email, we can automatically return
an LI, which is a list item. For each
list item, we can give it a key equal to
email because they'll be unique with a
class name of flex items- center justify
between and a gap of two in between the
elements within the list item. Then we
can render a P tag with a class name of
subtitle-2. And here we can display in
the email address. So now if we try to
share it, I don't think we'll have
anything there just yet because we
cannot share it because we haven't yet
implemented the share functionality, but
that'll be there soon. Below the P tag,
we can present a button which will allow
a person to remove the user from
sharing. So let's give it an on click
which is going to call a callback
function and we're going to call the on
remove functionality to which we can
pass the email. This email is of a type
string right
here. And within the button let's not
just say remove. Let's actually render
an icon. So that's going to be an image
that's going to have a source of assets
icons remove. SVG with an al tag of
remove. We can also give it a width of
about 24, a height of 24, and a class
name of remove dash
icon. So now later on once we have the
users here, you'll actually be able to
remove them by tapping an X next to
their email.
But of course, now we actually have to
implement the functionality to share the
file with users whose emails we enter in
here. First, we have a TypeScript error
right here within our set state. That's
because we haven't specified the type of
this state. And we're going to say that
it's going to be an array of strings and
then we should be good.
So now let's actually implement the
functionality to share our file. We can
do that by heading over to
file.actions.ts. And we're going to copy
the entire rename
file like this. And I'm going to paste
it right below. But this time I will
change the name to update file users.
We're going to accept the file ID. This
time we don't need the name, but rather
we need the emails we're going to update
it with. And we can get the
path. And I'm going to change this over
to update file users props. We once
again get access to the database. But
instead of trying to form the new name,
we don't have to do that. We're simply
trying to update the file by calling the
databases.update update document to
which we pass the database ID so we know
the file within which database to
update. Then we let it know within which
collection to update it and finally the
file ID and then instead of changing the
name we want to change over the property
of users and make it equal to emails of
those
users. That's going to look something
like this. Finally, we revalidate path
and pass over the updated file. So now,
if we head over back, we now have access
to that server action. We also don't
need this dialogue description, so I can
remove it. And what's going to happen is
we're going to go here where we have the
functionality for share. Remember, we
already mapped all of our actions to
specific actions that a user performs.
So if the user is trying to press this
button share, we want to call this new
function we created. So here we can call
the update file users. We're going to
pass in an object containing file ID
equal to filed dollar sign ID. That's
going to look something like this. We
want to pass over the emails. And we
also want to pass over the path. So it's
going to look something like this. So,
what do you say that we give it a shot?
I'll enter my second email. I think I'm
logged in with
contactjmastery.pro. I'll share it with
javascriptmastery
00gmail.com. It says share. And it looks
like something has happened. And there
we go. Shared with JavaScript mastery
00. There seems to be some kind of a
problem with this image right here. But
other than that, the file seems to have
been shared. Let's just see what is the
issue with this content right here. So
if I head over to share input, go down.
We have this assets icons remove. Let's
just give this button a class name equal
to
share- dash user. So it looks less like
a button and more like an actual icon,
of course. Now to truly test this out,
we have to log in with the email that we
shared the file with. So let's give it a
go. Oh, it looks like there's a problem.
I shared the file with myself. So that's
actually very good because now that
makes us implement the remove share
functionality which we haven't done
yet. It is right here in action dropdown
and it's called handle remove user. To
remove it, we just have to make it into
an async function that accepts the email
we're trying to remove of a type string.
And then we have to form the new updated
emails array equal to
emails.filter where we get each
individual email. And we just check
whether that email is not equal to the
email that we're trying to remove. Once
we do that, we can say const success is
equal to await update file users which
is the server action we created. We're
going to pass it the file ID the emails
equal to updated emails and the path and
if we have a success. So if success in
that case we simply set the emails equal
to updated emails and let's not forget
to close all modals. So let's give it a
shot. I'll go here and remove
it. And there we go. Looks like the user
has been
removed. Now let me actually share it
with my second account by clicking
share.
There we go. I will log out so we can
one more time see this great looking
signin functionality. I'll sign up with
Adrian second and I'll use my other
email. Let's give it a go. There we go.
An enter OTP appears. I'll just paste it
in and click
submit. Immediately we are in. It
doesn't yet appear on our homepage, but
if we head over to documents, you can
see the file right here, and you can see
it is created by AdrianJS Mastery. This
is looking great to me. All of the other
information about the file as well as
the ability to view a file and even
downloaded is allowed to me within my
second account. Even though I never had
to do anything with it, another user
just shared it with me, which I think is
one of the most important
functionalities from Google Drive,
Dropbox, or any other file storage
solution, allowing you to share your
file with others. And in this case,
since you have access to it, you can
even share it with other people. A great
exercise for you would be to implement
some admin privileges. So now that the
file has been shared with you, you
cannot actually remove the admin that
created it. I actually wanted to leave
this in as an additional functionality
that you can
implement. But with that said, the next
part we can focus on is what happens
after the share and that's going to be
the delete functionality. Download share
details and rename have been
implemented. The delete functionality is
the only one that
remains. to implement the delete file
functionality. We can check for the
value of the action equal to delete in
which case we can trigger a delete
modal. So let's say delete and if that
is the case we can then render just a
single p tag that's going to have a
class name equal to delete dash
confirmation and we can say something
like are you sure you want to
delete and then we can leave an empty
space like this. After that, we can
render a span that's going to have a
class name equal to
delete-file dash name. And within it, we
can render the
file.name. And then we can put the
question mark at the end. If we now try
doing that by going over here and saying
delete, you can see this. Are you sure
you want to delete error
screenshot.png? And we can then choose
cancel or delete. And of course to
implement the delete option we actually
have to create a new
fileaction which will once again be very
similar to the previous ones. So we can
copy the update file users. We can paste
it below. We can rename it to delete
file. We need to get the file ID which
we want to delete. We need to get the
bucket file ID as well. So we know where
it's stored in the memory and then we
need to get the path and this will be of
a type delete file props. Now that we
have that we need to get access to the
databases but also the storage. So right
here we have to say storage is equal to
await create admin client. First we
delete it from the database and that
means deleting the metadata of the file.
So we can say deleted file is equal to
await
databases.delete document in this case
we delete it from the database with this
ID from this collection and then this
file in this case we don't have to pass
a fourth parameter because we only want
to delete
it after that if we delete it from the
database. So if deleted file exists in
that case we also want to delete it from
the storage by saying await
storage.delete file and we want to
delete the file from the upright bucket
ID and we want to delete the file with
the bucket file ID. If we do that, we
can revalidate the path and finally send
over a object that has a status of
success.
So if we give that a go, we can actually
import the delete file right here under
our set of different actions where we
have the delete and we can call the
delete file to which we can pass an
object of the file ID equal to filed
dollar id. We can also pass the path.
But let's not forget to pass the bucket
file ID equal to file.bucket bucket file
ID because this time we actually have to
delete it from the storage as
well. So if we do that, let's try to
delete this error
screenshot. I'll go over and delete it
and click delete. It seems like nothing
has happened. That's because delete
seems to be unused in this case. At
least it says that it is an unused
property even though we're using the
actions and then action value of key off
type of off actions. So we are actually
accessing the delete property right here
which should be of a type promise of
any. Let me reload the page here. Oh and
looks like the file got deleted. So let
me actually log out and let me log into
my second account. So that's going to be
the contactjmastery.pro
Pro where we have another
file. And let's log in. Let's head over
to
images. And it looks like we have no
files over here. What about documents?
Yep, no files here either. Interesting.
Let's try to add a few more
files. But actually, I'll take some time
to find some good images to upload them,
some good media as well, and maybe even
some documents. So, I'll pause the
video. You can go ahead and find some of
your files or you can find some online
as well and then we can upload them
together just so we have more files over
here. I'll head over to Unsplash for
some images. Let's go ahead and take
this nice looking interior. I'll quickly
download it. Let's also find some more
like this wall right here. Oh, maybe
this dog as well. There's also this
great site called Cover where you can
find some great video footage which is
completely free. Oh, it looks like they
have music as well, but let's go with
videos for now. And let's download any
one that is below 50 megabytes. Most of
these should be, I believe. Yep, there
we go. 2 megabytes. I'll go ahead and
download it. Let's get this coffee as
well. Full
HD. Just so we have some stuff to work
with within our storage application.
There we go. This one is cool as well.
And you know what? Let's do music as
well. I think I saw that they offer
music. So, if I head over here at the
top, I'll click music and I'll download
any ones from here, just a couple. I'll
get all of them in standard quality. And
finally, we need some PDFs. And what
better place to find some PDFs than
under some of these YouTube videos.
There's a great PDF guide for the Nex.js
GS crash course which is actually a huge
200 and something page long ebook which
you can download but I think that's a
bit too large to upload it to our
platform. So let's maybe go with
something like this Git and GitHub guide
which you can download by going to
resources and then you can simply enter
your name and email and you can get it
in your email immediately. There we go.
Here it is. So let me download it and
press download at the top. I believe now
we have one of each. We have images,
media, storage, and others. So, let's go
over to upload. I'll head over to my
downloads, and I will try to upload all
of these at once. Let's see if that
actually works. This is a real test for
our application. I'll click open. And
check this out. It's uploading all of
them at once. It even has the thumbnails
for images. It has a video icon for
videos. It has a music icon for music.
And we even got one alert saying that
the next year's ebook was too good to be
uploaded. Just kidding. It was too
large. But as you can see, we had
real-time alerts about all of these
files. And now if you head over to
documents, we can see all of them right
here. If you head over to images, we can
also see all of them. Media has all of
them. And that's another issue, right?
Because currently we're fetching all the
files. But what we need to do is we need
to sort them based on their type. So, on
media, we should only be showing media.
On images, we should only be showing
images and so on. But damn, is it so
good to be able to see a full library of
files just like this. And I mean, check
this out. If you want to open up this
MP3, you just click it and the music
just started playing. If you want to
open up a PDF guide, check this out. It
immediately opened it up within my
browser. Or maybe you want to open up an
image. Well, that works, too. And of
course, we can perform all of these
different actions on every single one of
these files. Let's try to actually
remove one of these songs. I'll go with
this discover preview right here to see
if the delete functionality works. So,
are you sure you want to delete discover
preview? I'll click
delete. And there we go. It was deleted
immediately. Great work. Now, we know
the deletion is working. And the next
thing we'll do is we'll fix up our get
files. I think that's how we called it.
Let's see where it is. There we go. Get
files. So that it can actually sort and
filter files based on their type. Let's
do that
next. To fetch the files based on the
file type, we first have to head over to
the dynamic type page. And notice that
right now we're just extracting the type
from the params, but we're not actually
sharing it anywhere. If you see this
type variable is completely unused
besides being right here in the title.
So let's use this type and let's pass it
over as a
prop inside of an object to our get
files. Next, we can get into the get
files functionality and we can accept
the type right here by dstructuring it,
getting the types and making it equal to
an array. So, this is one important
differentiation that I want to make is
that here we're just passing the type,
but instead of that, let's do types.
Okay? Because sometimes we might want to
show multiple types. So, how are we
going to filter it properly? Well, I
created a quick utility function that
will help us do just that. We can say
const
types is equal to get
file type params and to it we can pass
the type and we can say as file type
array like this. If you look into the
get file type params you'll notice that
for documents it returns an array of
documents. For images it's images. For
other it is other. But for media it
includes both the video and audio. So
now we can simply say types and then
make it equal to types like this. Let's
head back over into get files. And let's
give it a prop type of get files props
like this. And now we can use those
types to properly fetch the data. Right
here where we're calling the create
queries to that we can pass the second
parameter of types and now in the create
queries functionality we can accept
those types right here as the second
parameter which is going to be equal to
an array of strings like this and we can
form an additional query based on the
types. So I'll say if types.length
length is greater than zero. In that
case, we want to push an additional
queries by saying
queries.push query
equal and we want to make it equal if a
type is equal to the types that we are
sharing over right
here. So that's it. We have just added
the type filtering by adding an
additional query into the create queries
and we're now fetching the files based
on that additional query right
here. So let's save it. Let me reload
the page and check this out. Now we have
only images. If we head over to
documents, we have a document. In media,
we have both the video and audio. and in
others we don't have anything yet right
now. So this is looking great and this
was pretty simple but actually this was
just a first step into implementing our
search. Yep, types will be connected
with search as well. Why? Because we
will do it all through this single file
action. And you might be wondering how.
Well, that's because we'll use search
params to manage the URL query. Once we
search something, we will append an
additional question mark right here and
then say something like query is equal
to let's take this small white dog
example by saying query is equal to
small. Okay. And when I go here, we'll
want to access this query and then based
on it filter the data. We can do that by
extracting the search params right here
from props by saying search
params and then we can say const search
text is equal to we want to await search
params and then question mark dot query
and I want to say that this is as string
or it'll be an empty string at the
start. Let's properly close this right
here. And we can duplicate this search
text with sort as well because later on
we'll also be adding sorts to this. So
we can say query small and then we can
say and sort is latest for example. So
now we can extract those values such as
search text and sort and we can pass
them as additional parameters to the get
files functionality. So alongside types,
let's pass the search text and let's
also pass the sort. So now I can head
over to get files and I'll expand this
just so we can see the search query
right here at the top. There we go.
Let's accept those additional parameters
right here by getting the search text
which at the start can be set to an
empty string if we don't have any other
value. For the sort, we're going to give
it a default value of dollar sign
created at
-ashdeesc, which stands for descending
and limit as well in case we want to
limit to a couple of files per page. Now
that we have all of those props, we can
actually pass it into form queries. So
I'll pass it right here. After types,
I'll pass the search text. After that,
I'll pass the sort. And finally, I'll
pass the limit. Now, let's head into the
create queries. And in the same way that
we have pushed this additional query for
the type, we can duplicate it two more
times. And if we have search text, so if
search text exists, which of course we
have to get through props. So let's get
it right here. Search text of a type
string. Then we have sort of a type
string. And finally, we have an optional
limit of a type
number. There we go. That's better. So,
if we have search text, then we push
query dot contains since we're searching
for text name contains the search text.
What does that mean? Well, that means
that we're comparing this small white
dog photo with the query coming from
here. And you can see it actually
queried it. If I search for something
like I think we had red in the other
title. There we go. White house, red
roof. That works. And if I search for
white, it should actually show both the
dog and the house, which means that
search works properly. And let's also
add an additional query by limit. So if
a limit exists, then
queries.push
query.limmit. And we can simply pass the
limit right into it. So we can limit to
a specific number of photos or files per
page. We can also apply sorts by saying
const
sort const and then dstructure the array
of sort by and order by and make that
equal to
sort.split. Okay. Why are we splitting
the sort? Well, that's because the sort
will contain both the sort and the order
in which we want to sort it. For
example, we saw an example of that sort
right here where we use the default for
the get file. Where is it? Oh, here it
is. Created ad and then the actual
order. So, we want to sort it by the
order of creation in a descending order.
Once we get each one of these sorts, we
can use the queries
push. If order by is equal to ascending
asc, then we can return a query order as
c based on the sort by and else we can
return a query
order and based on the sort by. So that
can be sorted by title or name or maybe
created at or whatever else. Oh, after I
change the sort, it looks like something
has happened. It says attribute not
found in schema white referring to list
documents right here. Interesting. Let
me try to remove the sort from here. And
still the same thing happens. If we open
up the terminal, we can see it says
invalid query attribute not found in
schema
white. Interesting. Let's see why this
might be. Let me check the order of
parameters we're passing into create
queries. We have current user types and
then after that we have search sort
limit. Okay, is that the same thing
we're passing into it? Let's see. Search
sort limit. Yep, this is looking good to
me. We first generate the queries and
then based on different if statements,
we push additional queries into it. Now
it's referring to white. So it's
referring to the query which is equal to
white in this case. Specifically search
text is currently set to white. So we're
simply pushing the query where the query
contains specifically the variable of
attribute name contains the search text
of white. I don't see why that would be
a problem. And this only started
happening after we added the sorts. If I
remove the sorts, you can see that it
works and we can say white dog and white
house. So what actually broke it with
these queries right here. Well, first
let's check whether we have a sort. So
if sort exists, then we can do those
additional things right here. If sort
doesn't exist, let's not do anything
with it. If there is no sort, it should
be set to created at descending. Let's
try to console log the queries to see if
that gives us any more information. So
I'll say console log queries. I'll
reload the page and then scroll up. And
there we go. Here are the queries. You
can see that we have a contains query
for the name of white, which is great.
But then we have a method of order
descending with the attribute of white.
Interesting. Why is it picking the name
or in this case the search text when it
comes to the sorts? Oh, I see why. I
copied this and I forgot to change this
sort right here to sort. Oh, that's my
bad. Okay, as soon as I fixed it, the
error is gone. And now I think we should
be able to actually sort it as well.
We'll test that later on once we
implement the sort toggle. But in any
case, we're good. And now we have
complete functionality for sorting based
on type as well as based on search. But
of course, our users are not going to
really search through files through the
URL bar. We want to implement this
global search functionality right at the
top. So, let's close all of the
currently opened files. And let's head
over to
search.tsx, which is a component that we
created before and completely left
alone. Now, we want to come back to it
and implement it. Let's go to this size
right here so we can see it. And let's
bring it to life. To implement the
search, let's start with the UI. But for
that to work, I'll move the browser to
the left side because the search is
right here to the left and I'll move the
code editor to the right. This should be
more than enough space. Oh, I actually
like it this way. Now, let's give this
div a class name equal to search. And
within it, let's create a new div that's
going to have a class name equal to
search
dashinput-wrapper. Right within that
div, we can create an image, which will
just be a search icon. So, let's give it
a source of forward
slashassets/icons slash
search.svg. Let's also give it an al tag
of search with a width of 24 and a
height of 24 as well. That's just going
to be a little search icon. But now we
have to add an actual input coming from
components UI input. And we have to
create a new use state to manage it. So
let's create a new use state. Call it
query and set query at the start equal
to an empty string. Since we're using
use states, we have to turn this
component into a use client component.
Just like this. And now we can pass it
over to our input as a
value. Value is equal to query.
Placeholder is equal to search dot dot
dot. Class name is equal to search
dashinput.
And on change we can call the event and
then call the set query based on the
event.target value. So now we can
actually type into it. But of course the
changes are not yet happening. And in
this case we actually want to do
something special. We want to implement
a global search which will search across
all the files no matter on which page
we're on. Even if we're in documents, it
would be super simple to just query the
documents, right? based on the name, but
this will act as the global search. So,
it'll show us all the files no matter
where we're at. So, now that we can
actually modify the state of the query
through a search, let's actually
implement the functionality that'll
fetch the files. I'll create a new use
effect. Of course, the use effect has a
callback function and a dependency
array. If left empty, this effect will
only happen once at the start of the
load of this component. And in this
case, I want to check if a search query
exists. What search query are we talking
about? Well, that's going to be the one
coming from params. So, this is going to
be a bit different than fetching the
search query right here from the type
here. We're just dstructuring it and
then saying await search
params.query. But if we're in a client
component, the process is a bit
different. Here you can get it through
the use search params hook. So let's say
const search
params is equal to use search params
coming from next navigation. And then we
can get the search string by saying
const search string or we can call it
search
query is equal to search params.get
get
query or it can be set to an empty
string if there is nothing there. So now
we can say if a search query doesn't
exist then simply set query our current
state query to an empty string as well
and this will change whenever the search
query changes. This is just the first
step. If there's nothing there, reset
the input. But now let's create another
use effect. And within this one, we want
to fetch the files by saying const fetch
files is equal to an asynchronous
function. We can call it right here by
saying fetch files. And how can we fetch
the files? By saying const files is
equal to await get files. So this is the
same server action we called before. And
to it we can pass everything else. We
can pass the search text equal to query.
Finally, once we get the files, we want
to actually set them to the state. So we
can say use state. Let's call it
results. Set results at the start equal
to an empty array. And the type of this
will be models dot document and
specifically an array of model
documents. And once we have the results,
we also want to open up a new model to
show those results. So we can open up a
new use state
snippet. And let's call it open set open
at the start equal to
false. So now that we get the files
right here, we can say set
results is equal to
files.cuments and we can set open to be
set to true.
Okay, let's give it a shot. I'll create
a new piece of UI right here where I
want to check if open is set to true. In
that case, I want to create a ul, an
unordered list with a class name of
search dash result within which I will
say results. Let's see if that works.
The results immediately appear here.
That's good. But is there something in
there? Well, let's find out. We can do
that by saying
results.length is greater than
zero. If it is, then we'll return the
results.m map where we get each
individual file. And for each file,
we're going to
return an LI, a list item. And else, if
we don't have any results, we can simply
return a p tag with a class name equal
to empty-ash result. That's going to say
no results or no files found. Let's make
sure to properly close everything. There
we go. I think we're
good. And now, what are we going to do
for each li? Well, first let's give it a
key because we're mapping over it. So
the key will be equal to file dot dollar
sign id. And let's make it render just
the file.name to see if the search is
working. Would you look at that? We
immediately get all the files because we
currently have no search query. But now
if I type something like let's go with
white. Currently there's no way for us
to modify that because it's never
recalling this use effect. But if I
recall it every time that we change the
query, the state of the query. And now
if I type white, you can see that it
actually filters the correct files. But
we do have an error saying that the
final argument passed to the use effect
changed size between renders.
Interesting. So it means that the query
got cleaned. But that should never be
the case because it should always be a
string. So yeah, I think we're good now.
And you can see that this search is
fully functional. I'll show you how we
can improve it even further very soon.
But for now, let's finish the UI of how
we show each one of these because just
seeing a file name isn't really doing it
justice. So let's give each LI a class
name equal to flex items center and
justify dash between. Within an LI,
let's create another div that'll have a
class name equal to flex
cursor-pointer items-c center and a gap
of four. And within it, we can render a
thumbnail with a type of
file. Extension equal to file.extension
extension URL equal to file
URL and a class name equal to
size-9 and
min-W9. If I close it here, this should
already look so much better because now
we have great looking icons right here.
Next, we can render this file name above
within the div, but let's wrap it in a P
tag. So let me provide an opening and
closing p tag with a class name equal to
subtitle-2
line-clamp one so it fits in a single
row and text-
light- looking much much better.
Finally, right below this div, let's
also render the formatted date and time
to which we can pass the date of file
dot dollar sign created at that's going
to look something like
this. Let's properly close it. And let's
also pass it a class name of
caption line
dashclamp-1 and the text dash light of
200. There we go. So now we can see at
least the time. And on large devices we
can see even the date alongside the full
title. This is looking amazing. And
check this out. Even if I'm on images
and I start typing something like let's
go MP4. We can see all the MP4s or maybe
even we can see cinematic. Yep, this
works as well. Now, if we click on it,
nothing really happens, does it? So,
let's add a new function right here. And
let's call it const handle click
item. Here, we're going to get a single
prop or param called file of a type
models.doccument.
document and on click we want to set
open is set to false. So we want to
close the model and we want to set
result equal to an empty array and we
want to push to the page containing that
file. For that we can use the router
functionality. So I'll say const router
is equal to use
router. Let's make sure that we imported
it from the right place. Next
navigation. That's good. And now we can
say
router.push and we want to go to forward
slash file.type and if it is video then
we want to go to media. Else we want to
go to file.type a string of s because if
it's image it's going to be images. If
it's document it's going to be documents
and so on. And then we want to give it a
question mark. query is equal to query.
So we want to keep the search but we
want to navigate over to that specific
page. So now that we have this
handleclick item, let's actually pass it
over as a link click to the li by saying
on click handleclick item and point to a
specific file. Now if I click living
room furniture, it will close it and
point me to the images so I can find it
very easily. Same thing if I go to
search and if I search for some kind of
a document like a
PDF, I click on it, it points me to
documents so I can find it. Same thing
goes for videos and so on. Oh, it looks
like it didn't actually work with audios
because it says audios. It should
actually be just I think media or video.
So in that case we need to modify our
query a bit saying if file type is video
or audio right because in those both
cases it should go to media. So I'm just
going to duplicate this query and say
file type is video or file type is
audio. Okay. And I'll wrap that in a
parenthesy. In both cases it should
actually go to media. And it does seem
that it is working right now. That is
great. Now we still have to properly
close the search if there's nothing
there. So we can say something like
right here at the top of the fetch
files. If there is no
query in that case we can set results to
be equal to an empty array and we can
set open to false and we can return
router.push
push and we want to push to the same
path but with no search query attached.
So let's get the current path by saying
const path is equal to use path
name and then we can push to
path.replace search
params to string with an empty string
like this. So we're going to simply
nullify the search. If I reload and try
searching for something, I'll try typing
cinematic. You can see it shows. I click
on it, I get redirected. That works. But
if I clear the search, you can see all
the other files and media. And
everything works as expected. But now I
want to show you a big optimization that
we can make with this search. And that
is implementing a concept known as
debouncing.
Why do we need the concept of
debouncing? Let me show you. If I search
for something like
MP3, you see with every single keystroke
as I was typing, it made another request
to the back end to the database. And as
a user continues to type, it's making a
request for every single letter, which
means that we're now overloading the
database with these different requests.
Instead of doing that, what if we could
not make a single request until the user
stops typing for a specific amount of
time? Let's say maybe they continue
typing and then they finish with the
word white and we send a single request
to the database. Yep, that's possible.
We can do that by using the concept of
debouncing. In our ultimate NexJS15
course, I dove deep into the concept of
debouncing. I think it was right here on
their homepage. Implementing a local
search bar. Check this out. Here we're
implementing a search bar to search
through all of the questions of the
stack orflow application. And we need to
really make it optimized. So first I
show you how to implement it like we did
in this case, but then we dive into
implementing the delay debounce function
from scratch using callbacks and just
making sure that we don't overload our
database. As you can see, this lesson on
implementing this little search is about
36 minutes long. So here I make sure
that we really go indepth with
explanations and
implementations. So feel free to check
out the course on
JSMY.pro. But with that said, even here
I'll show you how to implement the
debounce. In this case, we won't
implement it from scratch. We'll use the
used debounce hook, a widely used hook
with more than 1.6 6 million weekly
downloads. It is super simple to use.
Let me show you. You can just run mpmi
use
debounce-save. So, let me install it
right here by running that exact
command. MPMI use-d debounce. And after
that, it is super simple to use. You
just import use debounce from use
debounce at the top. After that, you
need to call the hook and give the name
to your debounced
value. So I'll do it something like
this. I'll say const use
debounce. We want to debounce the field
of query with a delay of 300
milliseconds. This means that the action
will be only fired if a user hasn't
entered another keystroke in the next
300
milliseconds. And here we can call it
debounced query.
What I'll do now is simply replace the
query with the debounce query in the use
effects dependency array. So we won't
make a request whenever the query
changes. We'll make a request whenever
the debounce query changes, which will
only happen every 300
milliseconds max. But again, it might
happen much less frequently if the user
continues typing within that 300
millisecond time frame. Let's do a quick
check to see if debounce
query.length is triple equal to zero.
Then we want to reset everything. And
since we're checking the length, we
don't need a exclamation mark right
here. And instead of passing the query
to search text, we're going to pass a
debounced
query. Let's see if it's properly
accepting it. Search text right here.
And it looks like it's expecting types
as well. So we can say types is an empty
array because in this case we're doing a
global search. We don't care about
filtering by types. We only care about
searching. So if I go back now, if I
continue typing, you can see if I do it
quickly, it will not make a single
request. But as soon as I stop typing
for a second, only then will it make the
request. So I can type out the entire
word of white and we only get the
results after it has been typed out.
That's it with a global search and
filtering based on types as well.
Everything works incredibly well. Now we
have a very quick lesson next which is
implementing the sort component. The
sort functionality is done but now we
just want to implement a quick sort that
looks something like this that allows
you to filter by name or maybe even the
date. So let's do that next. I'll close
all the files and I'll drag my browser
to the
left to get started implementing the
sort component. Let's first install the
chaten select component which will be of
a great help. This is basically exactly
what we need. So let's install it by
copying the installation command and
pasting it right here. mpx shaden at
latest add select. let's say y and then
press enter and it's going to get
installed. Once you do that, let's copy
its
imports. And let's do it within the
sort.tsx component. We already created
it, but we never implemented the logic.
So, let me copy this here. And let me
also copy the usage of the select. I'll
paste it right here. Fix this little
typo. Save it. And now if I go back and
reload, you can see that we have a theme
selector. But a theme selector is not
really what we want. Instead, we want to
be able to sort it. Okay. So let's make
slight modifications. Let me first
access the router meaning the routing
functionality by saying con router is
equal to use router. And this use router
is coming from next navigation. Of
course, if we're using the navigation,
we have to turn this into a use client
component. Then we can declare a
function called handle sort which is
equal to a function that accepts a value
of a type string. And then it can run
the
router.push and we're going to push to
we first have to get the existing path
by saying const path is equal to use
path name coming from next navigation.
So we're going to start our URL with a
path on which we're on. And then we're
going to simply append to it a search
param called sort which will be equal to
the value that we want to sort it with.
Once we have that, let's give this
select an on value change. And we can
call the handle sort right here. And
let's also give it a default value which
will be equal to sort types which is
going to come from constants zero.
If you take a look into the sort types,
you can see that we have basically I
think six different types. That's going
to be date created, newest, oldest,
name, ascending, descending, and then
the size from highest to lowest. So once
we have those, we can have a trigger to
which we can pass the class name equal
to sort dash select.
And we have a select value to which we
can pass the placeholder equal to sort
types zero dot value. So now we can see
it says created at descending as a
placeholder value. After that we have
the select content to which we can pass
a class name equal to sort-
select-content and then within it we can
map over all of the different select
items. So let me simply say sort types
do map and then for each different
sorting option we will simply return one
of these select items. I can remove the
other two and we're going to of course
change how this select item behaves by
giving it a key equal to sort label
because labels are unique. I'm going to
give it a class name equal to shad-
select- item. And most importantly, we
have to dynamically render the value,
which is going to be sort value. And
within the select item, we can render
the sort label. So the user knows what
they're selecting. If I do that, check
this out. We have all of these different
sorting options. And I actually want to
expand my browser for this. So you can
see the full URL bar. I'll head over to
documents or no maybe media because we
have the most media and let's try to
sort it. Here we have it by date created
newest and currently the man strumming
guitar is the last one based on date. So
let's switch it to oldest and it looks
like nothing has happened. Oh wait, now
it switched it. So it seems like the
first switch didn't actually work.
Interesting. Let's try one more time.
I'll reload and select oldest. And then
I'll go back and switch to newest. And
that worked. It's a bit tricky to check
the dates right now because they're all
uploaded at a similar time. It might be
a couple of milliseconds of a
difference. But let's try switching it
by name. So if I say name A to Z, we can
see that it starts with the letter C, it
moves to D, M, and P. So this is looking
good. And if we do this one, it's
actually going the other way around.
What about the size? This should be easy
to check. We have 5.7 at the top, 1.9 at
the bottom. And if we switch it, that
works. So, let me actually reload and
try to immediately switch it by the
size. Yep, that works, too. Okay, so I
think we're good. We can also check for
the images. Let me do it by size. Yep,
that works. About created at works. Name
works as well. Wonderful. Believe it or
not, it was that easy to implement the
sorting functionality on all of these
different pages because we are reusing
the same single sort component and it
doesn't have to do any extra logic
besides simply modify the URL bar with a
new sort and then our file action for
getting the files to which we
automatically pass the sort does the
rest by modifying the queries if a sort
exists. Great work. But now that we have
all of these things looking quite good,
what's going to happen with the
dashboard? We kind of left it on its own
for the time
being. To implement our dashboard, I
prepared something quite special. See,
within our ultimate nextGS course, we
often have something known as active
lessons. These are lessons which we
specifically craft beforehand and give
you the task so you can develop
something on your own. It doesn't just
tell you what to build, but it goes into
the why and specifically how you can
approach it. It contains examples,
resources, and heck, even a hint that is
blurred out until you click it and
decide that you need some help. So, as
you can see, they can get pretty big,
and the NexJS course is full of them.
You can see for the database creation
model, we have an active lesson for
creating each one of these models in the
database starting from the task to the
how to the additional resources and then
hints. Now, why am I telling you this?
Well, first of all, because I'm proud of
how well we created the nextgs course,
but the second reason is to show you
that I have prepared an active lesson
for you to build this dashboard off the
story project. Yep, there is a task.
There is an example pointing to the
Figma link as well as all of the
resources you might need and the
implementation of how you can do it with
the data fetching chart components and
even additional hints you can check out
if you get stuck. As you can see, it's
pretty lengthy. So, take your time,
don't rush it, really give it a go and
trust the process. So, in this case, we
won't be doing it together. I want you
to take what we have right now, the
entire codebase, see if you can figure
out the bits and pieces of how it works,
the file and folder structure, where you
can add additional server actions if you
need to, and where you would actually
implement the dashboard. Of course, it
would go into the root and then page
where we currently only have this
homepage. Of course, the final repo
containing the full code will be linked
down below, but for now, I'll show you
how it should look like. As you can see,
it's going to be about a 100 line long
page where we basically get all the
files using the same server action we
have created before, but we're using a
little bit of an optimization here by
using parallel data fetching. We're
fetching both the total space as well as
the files. And since one doesn't depend
on the other, we can fetch them at the
same time, effectively making the load
time two times faster than it would
usually be. Of course, to make this
happen, we also have to create some
additional actions. And that's basically
one single action in the file actions
file. So, let's scroll to the bottom of
it where I hope you implemented it. Of
course, your naming doesn't have to be
the same as it is in my case. But
basically, I called it get total space
used. And in this case, it uses the
create session client. So, we have to
import it. And I switch this over right
here. So, there's no errors. And I
believe this is it. Let's see what else
do we need. We need to get a thumbnail
from the components thumbnail which we
already created but we also have to
export it by adding the export to it. We
have the formatted date and time which
we also already created but forgot to
export. And finally we're using the
actions dropdown but I think in my
version of the codebase I called it
action dropdown. So we can just fix the
naming right here and then import it
right here at the bottom. And in our
case, it's not a named import, it's a
default import. So we can do it just
like this. And finally, we have to
install shaden charts. So I'll say mpx
shaden add latest add chart. And
immediately it'll be installed. And you
can see that this red squiggly line will
remain there because this chart
component is not a shaden component. It
is actually an additional chart that we
need to create that then uses the
shadian charts. So, let's head over to
the components and create the last
component of the day. I'll call it
chart.tsx. And you can find the code
either in the active lesson or if it's
not there, it's going to be in the final
repo.
Chart.tsx. If you do that, let's close
the files and reopen the homepage one
more time. Oh, it looks like this red
squiggly line didn't get removed even
though we're properly importing the
chart from the chart page. Oh, I think
it's gone. So, I think we're good. And
with that, if we go back here, check
this out. We have the available storage,
only 40 megabytes out of 2 GB in total
available. We can see how much of each
specific file type we have. And we can
also see a list of recent files
uploaded. And we can immediately perform
actions on all of them directly from the
dashboard. Now, this is looking like a
real storage management solution. So,
how did you like it? I hope this active
lesson gave you enough info for you to
be able to build it on your own. But if
not, I hope you were able to take some
pieces of the puzzle of the full
solution and then just put them all
together. Let me know whether you like
me to include more active lessons like
this or if this was too hard. And as I
said before, if you enjoy this active
lesson and you want more hands-on
practice, check out the Ultimate Nex.js
course. More than 50 interactive lessons
available. And once again, if you
experience any issues while developing
it, just make sure to go to the GitHub
repo of this project and refer to
it. Knowing how to read and use other
people's code bases is crucial for
growing as a developer. So, if you can't
do that effectively, you'll have to
improve there. So, even if you didn't
complete it on your own successfully,
make sure to patch it all together so it
works like it does in my end right here.
By putting this page.tsx tsx together as
well as the chart component and file
actions like get total space used. And
with that said, we are ready to focus on
the
deployment. To get our project deployed,
as with all the other great NexJS
projects, we first have to push it over
to GitHub. So head over to github.com
and create a new repo. Let's call it
something like storage
management solution or you can call it
store it or whatever name you
prefer. Create a repo. Now we'll have to
follow these commands within our editor.
So let's open up the terminal. Stop it
from
running and then run git init to
initialize an empty repo within this
project. Now, when I was deploying this
project before, I encountered some
errors. So, I know how to fix them
before they happen. So, let me show you.
The error I experienced was this one
saying route forward slash couldn't be
rendered statically because it used the
cookies functionality. So, that means
that it requires dynamic server usage.
So, how would you go about fixing
something like this? Well, the solution
is pretty simple. Let's head over to
layout.tsx of the root and right at the
top of that file, add a new export const
dynamic and make it equal to force-ashd
dynamic. Now, why are we doing this?
Well, that's because Nex.js says that
this page couldn't be rendered
statically as it uses the cookies. That
means that the page or component you're
trying to render relies on data from
cookies which requires dynamic behavior.
Static pages are pre-rendered at
buildtime and cannot use runtime
specific features like the cookies which
are only available at request time. So
setting this export cons dynamic to
force dynamic will make the page render
on the server for each request which is
not the same as client side rendering.
Now let's follow the next steps for
pushing a repo to GitHub. I'll run git
add dot to add all the files. git
commit-m first commit get branch- m main
get remote add origin and then the link
to this page. But it looks like I pushed
before. So I'll have to actually change
it to origin one. And finally get push u
origin main. If you do that and go back
to GitHub and reload, you can now see
your codebase appear right here. We
needed to do that for Versel to
recognize it. As you can see, I'm using
Verscell to host all of my projects,
even our great course platform. But now,
head over to add a new project, and it
should be right here at the top. Added
about 48 seconds ago. So, just import
it. Storage management
solution. And it's going to ask you to
add environment
variables. So going back to our project
and heading over to enenv.local, there's
a little trick that you can do, which is
just copy everything from this file and
then paste it in this first input. This
will automatically populate all of the
other key and value pairs. Once you do
that, don't deploy just yet. I
remembered that we might have one or two
Typescript errors left or even eslint
errors left which are not really errors
if you think about it but they could
potentially disallow us from building
this project on Verscell even though I'm
trying to find some of them and it looks
like we've been paying very good
attention to remove all of these
TypeScript type errors and ESLint
errors. So, you know what? Let's give it
a shot. If it doesn't work, we can just
try to maybe suppress the warnings just
so the build goes through. But who
knows, maybe we did a phenomenal job and
the codebase is squeaky clean. With that
said, let's go ahead and deploy it. And
fingers crossed, hope for the best.
About 56 seconds have passed and we seem
to have an error in the build log. Was I
right? Yep, I was right. We did leave
just some unused variables in the mobile
navigation. But other than that, our
codebase was very well done. So, what I
will do is head over to mobile
navigation to quickly remove those
unused variables. As you can see, it's
just two lines right here, which are not
breaking anything, but again, TypeScript
and ESLint don't like them. And I'll
head over to
next.config.ts and then say
TypeScript and then add ignore build
errors to true. And I'll do the same
thing for
eslint by saying ignore during builds is
set to true. Now if we make a push by
saying get add dot get commit dash
ignore build errors and then get
push. If you go back to versel
specifically to your projects click on
that project and go to deployments you
can see that another deployment is being
built. Let's see how this one goes. And
there we go. The build is built. You can
see it also populated our favicon right
here at the top. So head over to project
and click visit at the top
right. You'll be able to see that we
have an application error. A serverside
exception has occurred. And this seems
to be happening on our homepage. And I'm
actually super glad that this happened
because I want to teach you how to debug
it. Deployment errors are common and you
need to know how to fix them. So if you
head over to inspect element and go to
the console, you'll notice that you have
some kind of an error message. But let's
see if it's useful. It says error. An
error occurred in the server components
render. The specific message is omitted
in production builds to avoid leaking
sensitive details. A digest property is
included on this error instance which
may provide additional value about the
nature of the error but again doesn't
give us a lot of info. So how do you
debug server errors if you no longer
have a
terminal? It's pretty simple. You head
over to Verscell, you go to logs and
then right here you can find more
details about the error. In this case we
get an error no session coming from root
page. So let's go ahead and console log
the no session thing because it does
appear to be something that we wrote. So
if I search for no session, you can see
that it only occurs a single time within
our entire codebase. So that's already a
good sign. It occurs when we're trying
to create a session client. But when are
we trying to call this from the
homepage? Let's see if I head over to
page root right here. And then you can
see that we're not really calling that
create client. But if you head over to
the layout of the root, you'll notice
that we're calling the get current user
the first thing ever. And right here
within it, we're calling the create
session client, which then throws an
error in case there's no active session,
which makes sense, right? Because we
cannot have a session if a user hasn't
logged in yet. So the only thing you
have to do is wrap the get current user
in a try and catch block like this. In
the catch we of course get access to the
error and we can maybe just console log
the error. But we have to pull
everything else into the try block. So
we actually catch an error if we throw
it from the create session client. And
you can see here that we say if user
total is lower than or equal to zero
return null which is totally okay. So
right here we're going to return null
not throw an error and then if we don't
have a user we will redirect to sign in.
Now let's go ahead and push those
changes to our repo by saying get add
dot getit
commit-fix deployment. That's a common
one. And then finally get push. If you
do that you can head over to your
deployment and let's wait for the new
build to go through and hopefully that
fixes the issue. And there we go. Our
deployment is live and ready. We already
knew that's going to happen. But is it
actually working? If I visit our storage
management deploy solution and try to
sign in with the email that I used
before, or you can also create a new
account. That's totally up to you. We
should get an OTP verification model
which just arrived to my email inbox.
It's
681565. Press enter or submit. And
immediately we are redirected to our
beautiful looking dashboard. I mean this
is just amazing. It's a it's a very
detailed application with a lot of
moving parts. I truly hope you enjoyed
the build. We got a chance to learn a
lot about file management while of
course using the latest and greatest
best practices from Nex.js to make sure
that all of this loads super quickly. So
if you'd like this free course, imagine
what we'll do in the ultimate Nex.js GS
course. I mean, here we're going to dive
into a lot of depth, teaching you how to
use Nex.js the right way. From hydration
error fixes to stale data to even
caching and different runtimes. There's
a lot of stuff we'll cover. And of
course, you'll improve your performance,
dive deep into server and client
components, use the latest React and
Nex.js
features, and more. All with deep dive
lessons which are illustrated theory
lessons to teach you the baseline. Then
we build and deploy a very complex app.
And then as I told you, we have those
active lessons which really dive in
depth teaching you how you can create
some stuff on your
own. How many times has that budget
travel hack left you broke in a hotel
room with no Wi-Fi and a construction
site for a view? Come on, admit it.
Planning trips sounds fun until it's
not. 50 tabs later, you're overwhelmed,
frustrated, and somehow booked a
two-star stay next to a nightclub.
Perfect. But what if you could solve
that chaos? Not just for yourself, but
for thousands of people with one
powerful app. Hey, I'm Adrian, and in
today's video, we're building and
deploying a full stack travel agency
dashboard. Not just another static page,
but a real product designed for travel
businesses to plan and manage trips for
their clients with AI and Stripe payment
processing. And the star of the show,
the admin dashboard, a polished travel
agency back office where you can see
user insights, trending trips, and
signup analytics. Browse all generated
trips and customer profiles. Use AI
powered trip generation to create new
travel plans in seconds and then view,
edit, and manage those trip details on
demand. And yeah, it's fully responsive,
so you can also manage trips on the go.
Now, by becoming JS Mastery Pro member,
you can even upgrade this dashboard with
a public-f facing site for travelers,
featuring a beautiful landing page with
curated destinations, a pageionated list
of all trip packages, and a full trip
details page with day-to-day
itineraries, images, and pricing. And of
course, to make it real, a stripe
checkout to finalize that trip.
Throughout the project, you'll work with
modern ReactJS with React Router V7, the
latest Tailwind CSS V4 for styling.
Syncfusion UI component suite used by
Visa, Disney, McDonald's, Netflix,
Starbucks, IBM, and even Apple. Apprite,
an open- source backend for all your app
needs. Free Gemini AI for dynamic trip
generation. Stripe integration for
secure payments. Typescript for clean
type- safe code, Sentry for error
tracking and monitoring, and much much
more from code architecture to clean
codebase structure. So, if you're ready
to go beyond basic tutorials and build
something pitchable, polished, and
portfolio worthy, this is the video
you've been waiting for. Let's dive
right in.
To get started building our amazing
travel agency dashboard application,
we'll head over to vit.dev, the build
tool for the modern web. See, the
application you'll build in this video
is a dashboard and React excels at
dashboards. So technically here, we
don't have a need for nex.js. So in this
case, I'll use React and I'll quickly
spin it up with VIT for instance service
starts and out of the box support for
TypeScript and more. But with that said,
if you want to follow along with
Angular, NextGS, Vue, or any other
technology you want, you're completely
free to do that. I'll show the setup for
the technologies I'm using, but later on
when we're implementing the design, if
you want to try out some other
technologies, you're free to do that.
Still, in this case, I want to make it
work with Vit. So, right here under
getting started, scroll down to
scaffolding your first V project. We'll
use MPM and V at latest. So, I'll copy
this command and head over to my IDE.
Throughout this course, I'll be using
WebStorm, a super powerful JavaScript
and TypeScript IDE that as of recently
became completely free for
non-commercial use. Before you had to
pay to use all of these great
functionalities, but now you can use it
for free. So throughout the video, if
you see me use some cool features that
pop up and they're maybe not available
in your text editor, well that must mean
that they're built into WebStorm. So if
you want to follow along with that as
well, you can download it and start
using it there. Once you're in, feel
free to create a new folder already and
then jump right into it. Within it, open
up a new terminal and paste the V
command we just copied. If you're not
already within an empty folder, you'll
want to add a travel app right here,
which is the name of the application.
So, it actually creates a new folder.
But because I already created a new
empty folder, I'll just say mpmcreate
vit latest slash to set up the
application in the current repository.
And I'll say why to install the V
installer. Now, it'll ask us a couple of
questions. I'll just say ignore files
and continue. Choose our own framework.
In this case, of course, we're
continuing with React. And it's asking
us to choose a variant of a React
application. We have TypeScript,
JavaScript, but we also have this new
React Router V7. Yep, that's right. In
this course, not only will you learn how
to build your own React dashboard, but
you'll learn how to route it using the
newest version of React Router. So,
press enter and install the create React
Router installer. This took just a
couple of seconds. And it's asking me
whether I want to initialize a new Git
repository. And you know what? Let's go
ahead and do that. So, I'll say yes,
initialize it. Install dependencies with
mpm. Yep, we can say yes to that as
well. While our dependencies are getting
installed, let's quickly set up our app
account. It's an open- source tool we'll
use to manage our back end. I'll leave
the link down in the description. So, go
ahead and create a new account. As you
can see, I'm using it for many projects
already. But now, go ahead and create a
new project. You can call it travel
agency dashboard. Click next. Choose
your region and create. Perfect. And
while we're at it, you can also set up
Sentry. I recently partnered with them,
so they decided to give you 50,000
errors to track. And trust me, you won't
be able to break that much stuff soon.
So, simply create your account right
here. Feel free to enter JSMy as the
organization name. So let's go ahead and
create a project with React. I'll call
it travel agency and click create.
Perfect. We'll get back to this page
later on. There we go. Get initialize
dependencies installed and we are ready
to run our application. If you didn't
have a new folder before, you'll have to
cd into this travel app you created. But
in this case, we're already in. So I
have all of my files right here. The
only thing I have to do is just run mpm
rundev, which will spin up the
application on localhost 5173. So, back
into the browser, if you open it, you
should be able to see something that
looks like this. You can go ahead and
open up this React Router docs. It's
pointing us here because I'm guessing
this is something that is new to a lot
of people. They've made some significant
changes from V6 to V7. And I want to
make sure that you understand exactly
how everything works so you can not only
make it work for this application, but
every future application you're working
on. We'll dive a bit deeper into this
later on. For now, just keep it open.
Let's take a second to clean up our file
and folder structure. Currently, we have
the folder called welcome here, which I
will completely delete. I will also
clean up our root home.tsx tsx by simply
running rafce within it which will just
spin up a new react functional component
called home. If this shortcut didn't
work for you that must mean that you
don't have a react plug-in installed. So
just search for plugins or extensions
and search for modern React snippets
which will allow you to very quickly
spin up new React components. Great.
Let's also head over into the app.css
CSS and remove everything besides the
import of Tailwind CSS. We'll definitely
need that. Now, since we'll be using
Tailwind, we also want to add some
Tailwind Power Apps. So, right within a
terminal, I'll open up the second one.
I'll call the first one dev environment
or we can call it just dev. And I'll
call the second one terminal. So, when
we need to install some additional
packages, we can do that right here
while we know that our development
environment is still running.
So let me run mpm install
clsx as well as tailwind- merge right
here and press enter. These packages
will allow us to use tailwind a bit more
responsibly so we don't go ahead and
override some styles without knowing it.
And it also allows us to very easily add
dynamic styles using Tailwind. This
should leave you with a very simple
plain looking homepage. But keep in mind
that our app is big and I really do mean
it. Throughout this course, we'll first
build the admin dashboard that'll
consist of this nice looking
authentication page. We'll then switch
over to building this dashboard which
has a lot of moving pieces. And then
we'll continue with all of the other
pages as well. The ability to add trips,
see them right here, and even generate
AI itineraries. The dashboard part of
the application where you can see the
users where you can create new trips and
see them on the dashboard will be
released completely for free on YouTube.
But in case you want to take it a step
further and also build a public-f facing
website that works seamlessly with the
dashboard we'll create, but this time
for the users trying to book some trips,
not for the admins trying to generate
them. You can access it on jsmastery.pro
Pro, where you'll be able to watch this
entire course lesson by lesson, and for
each lesson have a lecture summary, a
transcript, a branch including only the
code for that specific lesson that shows
you exactly what has been implemented up
to that point, and even a quick quiz
making sure that you have properly
adopted all of the knowledge within that
specific lesson. Or if you maybe didn't
and you got stuck, you can ask questions
directly within that lesson and get
immediate help. Oh, and I almost forgot.
Alongside the public facing website,
we'll also integrate Stripe with your
dashboard so that we can process
payments and actually allow people to go
on these trips. So, if that sounds
interesting, click the link down in the
description. But with that said, even
the content you're watching right now is
far more than what you can find in other
paid courses. This admin dashboard
you'll develop will be enterprise ready
using the tech that the biggest
companies in the industry use. So I'm
super excited to share a bit more about
that later on. But with that said, let's
ensure that we have everything we need
in order to develop this application.
Everything from this nicel looking
background on the O even to the smallest
detail like this logout icon. I want to
make sure that we have everything you
need in order to develop this seamlessly
and focus on improving your skills
rather than searching for different
icons online. So, for that reason, I
prepared all of the assets you need
right within this project's video kit.
You can find it in the description and
then click over on the assets. That'll
point you over to Google. So, you can
simply rightclick it and download them.
Once they're downloaded, make sure to
unzip them. And within it, you'll find
the app and the public folder. The
public folder will contain all of the
assets that we'll need, such as the
icons and the images. So, let's go ahead
and delete the current public
folder and just drag and drop this new
one right in. Make sure to put it at the
root of your directory. And we'll do the
same thing with the app. We don't really
have anything in there, so let's just
delete it. And now I'll drag and drop
the app right within it. And if you
check it out, you'll notice that it's
still almost the same as we left it
before. It has a home, the root where we
have the HTML file, and just one single
route right now. But what I've added are
some types. They're going to make it
easier for us to use TypeScript types in
the future as well as some fonts in
which we've set up the theming of our
application. So we don't have to write
all of these styles one by one. Rather,
we have them right here. But don't
worry, this contains zero logic. It just
contains some CSS that's going to make
it easier for us to style specific
aspects of the application. Now, if you
go back and reload, you'll still be able
to see the same thing that we had just
before. So, with that, we've got the
setup out of the way, which allows us to
already in the next lesson dive into the
setup of the complete React UI
components library called Syncfusion.
We'll still use Tailwind CSS to style
our application, but Syncfusion will
provide us with over 90 higherformance,
lightweight, modular, responsive
components that are perfect for building
dashboards. And Syncfusion isn't really
like material UI. They're used by some
of the biggest companies in the world
such as Visa, Apple, Disney, McDonald's,
Netflix, Starbucks, and IBM. Do I have
to go any further? Hopefully, you're
excited because in the next lesson,
we'll set it all
up. Just before we go ahead and start
setting up Sync Fusion, I want to make
sure to push our code to GitHub. Follow
along and commit to your GitHub as well.
I'll open up the terminal, run git
init
commit-m app setup. This will add all
the changes we have implemented so far.
Then head over to
github.com/new and create a new travel
agency dashboard. I'll keep it as public
and click create. Once you do that,
you'll have to switch over to the main
branch.
So get branch m
main get remote add
origin and finally get push u origin
master or in this case main. If you do
that in a couple of seconds if you
reload you'll be able to see all of the
files committed right here. What I
typically like to do is remove these
releases, packages, and deployments and
give a short description such as a
travel agency
dashboard. We can add the URL later on.
For now, I'll add some kind of a
placeholder. And I will also say that
the topic is React React Router
V7. And what else? Well, yeah, it's a
dashboard, right? So, we can say
dashboard. And already our repo is
looking much better. So with that said,
let's set up Syncfusion. First things
first, I want to tell you that it is
completely free. Okay, so click the link
down in the description and within the
video kit, I'll also leave a link to the
documentation where you can see all of
the different components that you can
use. For example, charts. Here you have
the getting started guide on how you can
use charts. And you can notice that the
Syncfusion components have been split
into multiple different dependencies
such as base, data, charts, PDF export,
and so on. So we'll need to install
these different packages separately. So
head over into your application within
the terminal. And here we'll need to
install all of these different packages.
Just so you don't have to type them all
one by one, you can find them right here
under mpm install Syncfusion where you
can just copy it and then you'll have
the full installation command. Super
simple, right? Press enter and this will
install all of these different
components allowing us to implement
enterprise ready dashboards for free.
There we go. That was quick. Now we'll
have to update the V config file. So
head over to
vconfig.ts. And here we'll need to
prevent the list of dependencies from
being used for SSR allowing us to use
Syncfusion components without any
issues. So I'll say SSR no external. And
here we can just use a regular
expression to target at Syncfusion.
Perfect. Now if you click set up
Syncfusion link down in the description,
you should be able to see a page that
looks like this. As you can see, the
free license is valid for 30 days, but
I'll show you how you'll be able to
continue using their components even
after that period ends. The only thing
you need is a free community license.
I'll use Google here at the second step.
If you used a personal email to create
your account, you'll also need to add a
work email, which they need for
compliancy. But don't worry, what you
can do is just type support
atjsmastery.pro. You can use this as the
company email. That way you can proceed
to the next step. For the company, you
can also type JS Mastery. You can enter
your phone number and create an account.
Once you do that, you'll be redirected
to your Syncfusions dashboard. Here it
says start your free trial for the
Essential Studio. This will offer you a
ton of stuff. But don't worry, this
doesn't mean that you'll only be able to
use your components for 30 days. What
you need to do instead is head over to
the bottom right part and click get your
license. Here you'll be redirected to
different types of licenses that exist
such as team unlimited, but what we're
going to go for is the community. This
allows you to get access to the entire
product line for free if you're making
less than a million dollars of course or
have five or fewer developers in your
team. So click claim your free license
and fill in some details. You can say
individual student or
hobbyist. For the organization name,
feel free to type in JS
mastery. I don't believe these are
necessary, but you might want to save
whether you want to use this as open
source, in which case you can also
provide a repo. And then you can finally
provide a LinkedIn profile and say who
is going to be owning the code. Of
course, that is yourself. So submit it.
And this request can take some time, but
what matters the most for us is that
already we got an email containing the
7-day free trial that'll include the
access to React components. So, if you
head over there and scroll down, you'll
be able to find your license key, which
you can copy, or you can also get it
right here within your dashboard by
specifying that you'll use JavaScript
and type JSM travel agency and get a
license key right here as well. Perfect.
Once you do that, you can head back over
into your code, create a new file called
env.local, and within it, you can say
vit
Syncfusion license key and paste the key
that you just got. Then you'll need to
head over into app
root.tsx. And right at the top above the
layout, you can
import the register license coming from
Syncfusion EJ2 base. And then you can
call it register license. And you want
to get access to that ENV variable by
saying import meta
envision license key. And that's it. We
have successfully registered and we can
use Syncfusion's enterprise ready
components. Let's focus on routing. Or
in other words, let me give you a quick
React Router V7 crash course where I'll
teach you how to do routing in modern
React. Let's start from bare beginnings
by deleting our current home route
because we'll do everything from
scratch. Within the routes folder, I'll
create another folder which I'll call
admin. And within admin, I'll create a
new file called
dashboard.tsx. Instead of which we can
run rafce to spin up this new react
page. Now unlike Nex.js, this won't work
automatically. So that if we just go to
forward/dashboard, you'll be able to see
it. What you have to do first is head
over into this routes.ts ts file which
you can think of as the configuration
file. Here you can see that our index
route points to the homepage which no
longer exists. So instead of having this
index we can use two additional methods.
One is called layout and the other one
is called route. To start off we can
simply create a
route which you'll need to import over
from react router dev routes. So I'll
say route right here. It requires you to
pass a name of that route or in other
words the path and then you need to pass
a location to the file. So that'll be
the routes admin
dashboard.tsx. And notice how webstorm
automatically tells me what each one of
these params means. The first one
dashboard is the path and the second one
is the file. Pretty cool. And if you do
that, you can see that this dashboard
right now coming from here. I can even
call it dashboard page shows up right
here on localhost
5173/dashboard. Pretty straightforward,
right? But now, let me also show you how
we can add something known as a layout.
So within admin, I'll create a new file
and I'll call it admin-
layout.tsx. within it I'll run
rafce and I'll give this div a class
name equal to admin-
layout. Now this admin layout is coming
from
index.css. The only thing we're doing
here is applying a bit of a light
background color with some padding on
the top for the navbar and we're also
making it a flex container. So what we
can do now is head over into routes and
wrap our route with a layout. So right
here I'll say layout coming from react
router at the top. It's not a component
but a method. As the first parameter it
requires a path to that file. So I'll
say
forward/outes/admin/admin-
layout dsx. And as the second one it
requires an array of children which are
different routes within that specific
layout. So I'll simply put this
dashboard route right within. If you do
it properly without providing the
starting forward slash right here, you
should be able to see just the admin
layout in your page even though you're
currently on the dashboard route. So
what you can notice is that by putting
something into a layout, it doesn't mean
that you have to prepen that route with
that name like it is in Nex.js. You can
think of it more like a Nex.js GS route
group where the route still remains its
original part but the layout allows you
to style it a bit further. So for
example, we might want to display a
mobile sidebar right here or maybe like
a regular sidebar. So I'll put an aside
give it a class name of
W-ful max-W of 270 pixels.
typically make it hidden but only show
it on desktop devices. So this is a
sidebar for desktop and I'll say sidebar
right here. So now on mobile we can see
the mobile sidebar. But if we head over
to desktop we can also see the regular
sidebar. But now what matters most is
showing the pages within that layout.
They will all have something in common
which are the sidebars. Sure. But how do
we show the actual page? Well, I'll
render another asai which is an HTML 5
semantic element. Give it a class name
of children and within it I will render
something known as an outlet coming from
React router. This outlet is a component
that renders the matching child route of
a parent route or nothing if no child
route matches. In simple words, it just
shows you the page or the route that
we're currently on that is inside of
that admin layout. So for example here
now this admin layout allows us to have
this mobile sidebar but also the
contents of the dashboard page. So if
you needed to add a second route you can
do that very easily. You just create it
right here within the same folder and
I'll call it
all-users.tsx. I'll runce and this is
the page within which we'll display the
users table. This will of course also be
a part of the admin dashboard. So now
back in the routes you can just
duplicate this route still within the
same layout and I'll say all users and
pointing to routes admin all users. So
now if you wanted to, you can very
easily switch over to all users and both
that one and the regular admin dashboard
have the mobile sidebar which we'll
implement next. That's more or less it
when it comes to routing. It's actually
pretty simple. But if you wanted to read
a bit more about it, you can see that
React Router is a multistrategy router
for React, bridging the gap between
React 18 and 19 where you can use it
maximally as a React framework or as
minimally as you want. So there are
different ways of using it, but in the
most simple way, you can create some
routes and then use them as parts of
different layouts as I just showed you.
Don't worry, we're going to dive into
more depth of how we can use it later
on, such as how you can create dynamic
routes as well, but more or less it is
super intuitive. For example, if you
wanted to nest routes, you would be able
to do that just by creating a single
route and then adding additional routes
as an array to that route. But with that
in mind, you already know not only the
basics, but also how to put those basic
routes within the layout. So, I'll close
all of the currently open files, and
I'll go ahead and commit this by heading
over into the terminal, running git add
dot get commit-m, and I'll call it
routing. Perfect. Ready to move onto the
next lesson.
Considering that most of our pages will
use the mobile or the desktop sidebar,
what do you say that we focus on the
layout of those sidebars first and then
we can focus on the pages that'll be
within it. So let's start with the
sidebar component. I'll first create a
new folder within the root of our
application and I'll call it components
and then our first component will be
called nav
items. nav items.tsx tsx and then there
we can run rafce to quickly spin it up.
We don't need this react import so we
can always delete it. And we can also
create a new component within the
components folder called
index.ts. We only need to do this once
because from this one file, we will
export all of our other components by
saying export default as nav items and
then from slashnav items. This allows us
to very easily import all of the
components within one line. I'll show
you how we can import it very soon, but
for now, let's head over into the nav
items component and let's implement it.
First things first, I'll focus on the
layout. So instead of a div, I'll turn
it into a section and give it a class
name of nav dash items. Within it, we of
course need to have a link coming from
react router and it'll point to forward
slash. This will be our primary link and
it can also have a class name of link-
logo. So right within this link we can
render an image. So that's an img with a
source pointing
toward/assets/icons/logo.svg with an al
tag of logo. And we can also give it a
class name equal to size of 30 pixels
like this. And just below it, we can
render an H1 that'll say tour visto,
which is the name of our application.
You can see that WebStorm doesn't
recognize this word, so it might think
that we misspelled it. But I'll tell it
no, save this to dictionary because
we'll be using it much more often later
on. Okay. So now, where can we see this
nav items component? Well, we can use it
within our admin layout. So head over
into the admin layout and right here
where it says sidebar within this aside
here we want to render that nav items
component but we don't want to just
render it like this. We want to wrap it
within a Syncfusion sidebar component.
So I'll first render a sidebar component
coming from at Syncfusion EJ2 React
navigation. I'll give it a width of
about 270 pixels and a prop of enable
gestures equal to false because this
will be our desktop sidebar. And within
it, I will then render the nav items
coming from data /components like this.
So you can see if we didn't have that
index.ts within components, then we
would have to import every single
component like this in a new line.
Import nav items from components. have
items import something else from
somewhere else. But in this case, we can
just do this. And now we can add
additional components like com 2, com 3
all in a single line. Okay. So let's
also self-close these now items. And now
right on top you can see that this
application was built using a free trial
of Syncfusion Studio. So we'll have to
get a valid license key and that's
completely free. So soon after you
register your license, that message will
be completely gone. If I covered this
before in the video, that's great. If
not, don't worry. Even if the message is
still right there, we can continue
developing everything and then we'll
remove it later on. But with that said,
let's actually expand our browser so we
can see what's happening on desktop
devices. There we go. Right here, we
start seeing the sidebar. Perfect. And
we can see this to Visto logo that
basically points us to the homepage
which right now doesn't exist. So with
that in mind, we can continue developing
the left sidebar right here. So the nav
items component. So right below this
link, let's render a div that'll have a
class
name equal to container. And within it,
we can render a nav. That's an HTML 5
semantic tag for the nav items within
which we can map over our sidebar items
which you can import over from
constants. So say sidebar items.m mapap
and then you get each individual item
from which we can dstructure the
properties such as the id anf an icon
and a label and then for each one of
these we can automatically display a new
div within which for now we can maybe
display just the label. So, if you do
that and save it here, you can see
dashboard, all users, and AI trips. But
hey, where are these items actually
coming from? Well, if you commandclick
into sidebar items, you'll see that this
is a simple array of objects that I
prepared before. Each one of these
objects has an ID, an icon, a label, and
a path that it points to. Perfect. So
now for each one of these instead of a
div we want to use a react router
component called nav link. Of course you
want to automatically import it from
react router. The two path will be equal
to the href or the link and we can also
give it a key equal to ID. Now what this
nav link allows you to do is to open up
a dynamic block of code and then have a
callback function within it. And that
callback function looks something like
this. So you have the parenthesis and
then an immediate return. Within the
parenthesis you can dstructure the is
active state. So this tells you whether
the component is active. And we can also
use typ script here to say that is
active is of a type boolean. And now
within it we can render a div within
which we can render the label. If we
save this now all of them are exactly
the same as before. But now we can use
that is active state to style it
further. For example, this div can have
a class name equal to. And now here we
want to make it dynamic. So we typically
want to apply some styles. But we also
want to change the styles depending on
the is active state of that nav link.
And for that in Tailwind we use
something known as CN short for class
names. So within our file and folder
structure, create a new folder and let's
call it lib as in
library. Within the lib folder, create a
new file and call it
utils.ts. This stands for utility
functions. Functions that we can reuse
across the application that deal with
specific functionalities. The CN util
typically comes directly with Tailwind,
but you can very easily get it right
here from the video kit as well. So,
just copy the entire app lib utils and
then paste it over into the utils right
here. Here we'll have a couple of simple
functions like formatting the date,
parsing the markdown to JSON so we can
use it, parsing the trip data which
we'll use later on, and some functions
that'll help us calculate the percentage
later on. More on that soon. The only
thing we needed right now is this one
tailwind merge which will take in the
static and the dynamic class names. You
can also notice that this utils file
uses dayjs library to manage date and
time. So I'll open up my terminal and
I'll run mpm install dayjs. Also we can
keep this library within the app. That
way we have everything important stored
right within it. There we go. So now
within this class name you can say CN
and then import it automatically from
the top from lib
utils and pass the styles that it'll
always have such as a group and a nav
item class name. But now as the second
parameter to the CN method you can also
provide an object and say when these
additional class names will be
activated. For example, the bg primary
100 and important text-
white will only be active if the is
active state is turned on. If it's not,
then they won't be active. We can do a
similar thing for the image next to the
label. So, I'll render a self-closing
image tag that'll have a source of icon,
an all tag of label, and a class name
equal to I'll make it dynamic one more
time, and I'll make it a template string
this time. On group
hover, we want to change the brightness.
So, I'll say
brightness to zero, typically size of
five. And on group
hover, we'll also want to invert the
colors. You know that effect when you
kind of hover over it, the background
then turns darker, but the icon
therefore needs to turn lighter in order
to be visible on that darker background.
So we can open up a dynamic block of
code and say if is active is true. In
that case, we can change the brightness
to zero and invert. But if it's not, we
can just leave the text color to dark.
So text-d dark 200. Perfect. So now if
we check this out in action, we can see
the logo on the top. And you can see
that the dashboard is the currently
active tab. But if you click on the all
users tab, it still has the same layout
because remember we implemented this
page before and gave it the admin
layout. The trips of course will lead to
a 404, but we can now nicely switch
between those two. And as you hover over
it, you can see that it actually changes
the background color, indicating that
it'll become active. So now we can
switch between those two pages within
our nav items. Let's also add a footer
to this sidebar, sharing a bit more info
about the currently logged in user. For
the time being, I will hardcode the user
information just so we have something to
display. But later on, of course, this
will be coming for real from
authentication. So say const user is
equal to I'll give it a name of Adrian
an email of contact
atjsmastery.pro which is my email
address and an image URL of a path
pointing to assets images
David.webp. I found a random David
developer online. So now that we have
this user, we can head down below this
nav and create a new
footer. This footer component will have
a class name equal to
nav-footer. And right at the top of that
footer, we can display an image with a
source of user question mark. URL or if
that doesn't exist, we can always point
to that David thing. So
forward/assets/
images/david.webp and we can give it an
all tag of username. So that's going to
be user question mark.name or David
maybe in case the user doesn't exist.
Perfect. So now if you check it out
you'll see this developer right here at
the bottom left right below the image.
We can render an article. Article is
like a div but it says that the pieces
of content within it actually are
related. So within it, we can just
display an
H2 that'll render the user question
mark.name. And then below it, we can
render a P tag that'll render the user
question
mark. So if you save it and check it
out, you can see Adrian and
contactjmastery.pro, which is the email.
For you, of course, it could be
something different. And finally, below
this article, we need to display a
button through which will allow the user
to log out. So to this button I'll add
an on click and I'll just do a callback
function and say console.log logout. Of
course later on we'll actually implement
the functionality right here. I'll also
give this button a class name of
cursor-pointer to let people know that
it is clickable. And then right within
it, I'll display a self-closing image
that'll have a source of forward
slashassets
slashicons slash
logout. SVG with an al tag of
logout and a class name equal to size of
six. So now if we save this and check it
out, you can see that we have a nice
looking logout button. And that
concludes our left sidebar. But now what
happens if we go to a mobile view? We
cannot really let the sidebar take that
much space. So that's why we're hiding
it on tablet or smaller devices. So now
if I actually put this to a mobile view,
you'll see that this left sidebar
entirely disappears and we have this new
mobile sidebar that is there instead. So
let's implement the mobile sidebar, too.
I'll do that by heading over into
components and I'll create a new
component called mobile
sidebar.tsx. I'll
runce to quickly spin it up and we can
export it from our components just by
changing the name of the export to
mobile sidebar. And then we can import
it directly within the admin layout.
Instead of the mobile sidebar, we can
just render the real mobile sidebar.
coming from
components. There we go. So now if you
did that, you understand that we have a
mobile on mobile. We have this one on
desktop and then we show the rest of the
page content. Perfect. So that looks
something like this. Nothing fancy yet,
but it'll look much better very soon. In
this case, we can actually see both the
code and the view at the same time. So
it's going to be even easier to
implement it. I'll start by giving this
div a class name equal to mobile
sidebar and I'll also give it a class
name of wrapper making it act as a flex
wrapper within it I'll display a header
component and within that header we can
have a link coming from react router
pointing to home just forward slash
within the link we can display the logo
as before so I'll say image
That'll have a source equal to assets
icons logo. SVG with an al tag of logo,
a class name of
size-30 pixels, and there we go. You can
see this shortened version of the logo,
and then right below it, we can render
an H1 that'll simply say to Visto, which
is the name of the application. Of
course, feel free to use something else
if this doesn't look good. And then
since this menu will open up, we
actually need a button. So below the
link render a button
component. And this button component
will have an on
click that'll be a callback function
that simply needs to collapse our
sidebar. Okay. So how do we get access
to this sidebar? Implementing this on
our own would be super difficult.
sidebars and mobile nav bars and
whatever opens and closes. Even though
is seemingly super simple, it's actually
a pain in the ass to implement so it
works properly across all devices. So
that's why here we'll once again use
Syncfusion's sidebar component, same as
we did for desktop. So I'll say const
sidebar of a type sidebar component
coming from Syncfusion EJ2 React
navigation. And then what we can do is
within this button we can simply say
sidebar
dot toggle which will actually open up
that sidebar. But instead of a const for
now I'll simply set it to let because
for const since you cannot redeclare the
variable you have to declare the value
immediately. But here we really don't.
We can just set it as undefined at the
start. You can see that our TypeScript
is complaining right here because we're
using this variable before being
assigned. But we'll actually make this
functionality work with Syncfusion's
component. So for now, I will simply
suppress this warning with a TS ignore,
which I will add right above this button
as a comment. Perfect. So we are
toggling this sidebar and we'll have a
regular image. This is going to be a
menu icon. So I'll give it a source of
assets icons menu. SVG with an al tag of
menu and a class name equal to a size of
7. So if I save this, you should be able
to see a menu icon on the right. Now,
right below the header component, we can
actually render this mobile sidebar. So
I'll render the sidebar component coming
from Syncfusion and I'll give it a width
of about
270. And of course we'll have to import
it from Syncfusion but not just as a
type which is what we have done so far.
We'll want to import the actual cyber
component like this. So if you do this
you'll see that it'll automatically be
opened and it'll hide our logo. So we'll
need to give it a ref. A ref where we
have a function of sidebar. And then
we'll make this sidebar equal to the
sidebar object that we created above.
I'll also add a ts ignore right here
just so we don't have any typ warnings.
Next, we can give it a created property.
So once this sidebar component gets
created, what we want to do is
automatically hide it. So I'll say
sidebar.hide.
Looks like our TypeScript will complain
here a bit as well. So what I'll do is
remove these TS ignores. And just at the
top of the file, I will add a TS no
check directive, which will make sure
that no TypeScript errors show for this
file. Then we can also say close on
document click. This is very important
to turn on for mobile sidebars because
if you click on a specific element in
between the sidebar, we want it to also
automatically close. We can also render
the show backdrop to true which will
give it a bit of a background right
here. And then also we can give it a
type equal to over because it's showing
over the
content. And now the only thing we have
to do is pass over the nav items
component we have created before for the
regular sidebar and it'll also work here
as well. So just import nav items coming
from nav items and you should be able to
see the full desktop sidebar also works
incredibly well on mobile but now it
also has some behaviors of a mobile
sidebar such as you can click outside to
close it still when you click on a
specific element it doesn't actually
collapse itself so you can see the page
you're on even though it actually does
the redirect you can see we're in the
user table but we cannot really reopen
it anyway so there's definitely
Definitely some more improvements we
have to make to it. One thing is taking
this sidebar toggle outside of this
direct click and turning it into a new
function. So we can pass it over into
the nav items themselves. So I'll simply
copy this sidebar toggle and call it
toggle sidebar. So now right at the top
I can say const toggle sidebar is equal
to a callback function within which we
can just toggle that sidebar. Now we're
calling it right here on button click,
but I'll also pass it as a prop over to
the nav items. So I'll say on handle
click toggle the sidebar. So now we can
head over into the nav items and we can
accept this handle click as a prop which
will be of a type handle click a
function that returns void meaning
nothing and it'll also be optional. So
now we can use this handle click when
we're clicking something right here. So
I'll pass it as the on click to this nav
item div right here where we have the
classes. I'll also add an on click and
I'll say on click handle the click. So
what this should do is when you click on
a specific link it should actually
collapse the dashboard. Oh I see it
doesn't do it just yet. I think I know
where the issue is here. when we give it
a reference, I should actually be making
this sidebar object coming from Sync
Fusion equal to the ref, not vice versa.
So, what we need to do is switch it
around. So, the sidebar object will be
equal to the sidebar ref. If we do this,
you can notice that now it actually
closes and you can reopen it. Perfect.
We now have a mobile nav that allows us
to navigate in between different pages.
So the last part of the layout that is
shown across all the pages, can you see
what it is? We have the sidebar. We have
the mobile sidebar in mobile. But what
is that other element that also appears
across all of the different pages? Well,
it's the header. See, with a title,
subtitle, and potentially an action
button allowing us to do something for
that specific page. Almost every single
dashboard has this. Oftentimes it is
also called breadcrumbs because it tells
you on which part of the dashboard
you're on such as admin users or this
could be admin trips. But in this case
since our dashboard is pretty simple we
just have a title subtitle and an action
button. So let's implement it as well by
creating a new component in the
components
folder which I'll call
header.tsx. run rafce and for now I'll
just add it to the top of the dashboard
page. So right here we have the page
contents but we'll wrap everything in a
main. So this is the main page with a
class name equal to dashboard and we'll
also give it a class name of
wrapper within it. We'll display the
header component coming from components
header. See this is what I was telling
you about. If you don't export it from
this components index, then you'll have
to have a new import for every
component. But if I came in here and
just exported it right here as header
coming from header, in that case, you
would just be able to import it like
this by saying import header from
components. Again, doesn't make a big
difference now, but as you start
importing more components into the file,
it really makes your code that much
cleaner.
This will be a self-closing component.
And we immediately know that we'll have
to pass different props to it such as
the title and the description. So title
for now can be something like
dynamic template string that'll say
welcome. And we can say maybe if a
username exists. So I'll create a new
user right here. const user is equal to
an object that has a name of
Adrian. Of course, you can put your own
name there and we'll say welcome if user
question mark.name exists then use the
name else just say guest and we can also
render an emoji of a wave right here at
the end. near the title will also render
the description equal to. We can do
whatever we want to say here, but maybe
something that explains that page we're
on, such as track activity, trends, and
popular
destinations in real time.
Perfect. We can now copy this header and
we can also add it over to our second
page, which is the all users page. As a
matter of fact, we need to do the same
thing right there.
Give it a main, a class name that says
dashboard and wrapper. Then we can
render the header right here. This time
we won't say welcome. We can say
something like trips page like this. And
then the description can be something
like track users for now. Of course, we
can actually modify it later on. Or not
track users. That's a bit too creepy. We
can say something like check out our
current users in real time. And of
course below that we have the actual
page contents. So this will be the all
users page contents. And then on the
other one that was the dashboard, we'll
instead say dashboard page
contents. Perfect. So now if we actually
head over into our app, you'll see that
we have the header and we have the
dashboard page contents. And if I move
over into all users, we have the header,
all users page contents. But now we have
to dive into the header component and
accept those props to show the
differences in between those pages. So
I'll immediately accept the title and
the description. We can actually define
this as props. So we can define an
interface of prompts right at the top
that'll have a title of a type string
and a description of a type string as
well. So now we can display the header
component with a class name equal to
header. Within it we can have an article
because it contains two related pieces
of info. Within it, we can have an
H1 that'll display the title and below
it, we'll have the P tag that'll display
the description. If you do this, you can
now see trips page, check out our
current users. But if I head over to
dashboard, you can see welcome Adrian,
track activity, trends, and popular
destinations in real time. Great. Of
course, the only thing remaining for us
to do is to style it a bit better. So
let's do that by giving this H1 a class
name equal to text-d
dark 100. And we actually want to make
this a bit more pronounced if we're on
the homepage. See here it shows up right
here at the top. But on dashboard we
want to make it a bit larger. So for
that reason I'll wrap this in a dynamic
CN class name like this. And we need to
properly close it as well. So the text
dark 100 will always be there. But if
the URL is homepage, then we'll apply
some different class names. And how can
we do that with react router v7? How can
we figure out the path? Well, it's super
simple and very similar to Nex.js. I'll
just say con location is equal to use
location hook. That's it. You import it
from React Router and you know the URL.
Oh, and let's not forget to import the
CN as well from utils. Okay. So now next
to this default style we can also check
if the location.pathn path name is
triple equal to forward slash and if
that is the case we can give it a text
of 2 excel on medium devices text of 4
excel and font-bold but if we're not on
the homepage we can give it a text of
excel on medium text of 2 excel and
font- semi-bold of course we have to
properly close this now so now if you
compare the differences between this
header size and this one right Here you
won't be able to notice the difference.
That's because all of these are not on
the homepage. This is dashboard and the
other one is all users where these ones
need to be the same to have enough
consistency in between the pages. But
I'll also teach you how to reuse this
header on our public facing website
whereas we want to make it much much
larger. So that's where the difference
will be. But for now, we can also copy
this
H1 and paste it below, but change it to
a P tag for the description. This one
will be text gray of 100 and font normal
by default. But if the path name is
forward slash, it'll have
text-base. And on medium devices,
text-LG, and we don't need this font,
bold. And if it's not on the homepage,
we'll make it a bit smaller and give it
a
text-s as well as on medium devices
text-l. And within it, instead of the
title, we'll display the description. So
now we have a proper title and
description right here. So this is
already looking great on mobile. We have
a fully functional mobile sidebar, and
it's starting to take the shape of the
final application. Of course, where
dashboards truly shine is on desktop
where we have more screen real estate so
we can see all of the different stats,
charts, tables, and charts. So, what do
you say that we focus on the main
dashboard page contents
next? Okay, the primary layout is done.
So, let's focus on the content
displaying what matters on the page.
I'll collapse it for the mobile view.
And mobile first development is taking
over anyway. Though it's always good to
start developing for mobile and then
expanding over for desktop. Although I
would say there is one exception to that
rule and that is dashboards. Dashboards
are typically meant to be viewed on
desktop. So prioritize proper desktop
views. Okay. So let's focus on creating
the UI of these trip cards right here to
have something nice to display on the
dashboard right off the bat to the user.
So let's develop a reusable trip card
layout. But you know what? Before that,
let's start from the top. Let's focus on
the stat card layout. The one that has a
nicel looking chart and displays some
information. I'll do that by creating a
new component right here in the
components folder. And let's call it
something like statsc
card.tsx. Run
rafce. And while we're here, we can also
create another card. This one will be
the trip card. So I'll create a new trip
card.tsx. Also run rafce and just
display it right here. What we need to
do of course is export them both from
the index.tsx. So that's going to be the
stats card as well as the trip card.
Perfect. So now we can head over and
import both of them within the dashboard
so we can start implementing them. I'll
first head over into our routes
dashboard and right below the header
I'll display the trip
card coming from trip card components.
And right on top of it I'll also display
a stats card coming from components. So
now we can see that we have a stats card
and a trip card. We first have to ask
ourselves what will each one of these
stats card have. If you already have a
design, well then you have everything
you need. Take a look at these cards and
ask yourself what is different about
them and what is the same. The regular
card layout is the same, the background,
the borders and everything. But what is
different is the title, total users,
total trips and so on. the number of
course the value this up and down stat
is different value and then we also have
the chart itself. So these are the
different pieces of data that we have to
pass into it. So we can start by forming
that for now fake data but later on
we'll make it real once real users start
creating the trips and they start
joining the platform. So for now I'll
say const dashboard stats is equal to
and I'll create a stat for total users
and actually doing this is a pretty good
idea starting to create everything
static from regular JavaScript objects.
So if you do this and maybe define
12,450 users as it says on the design
right here technically what you're doing
is creating a structure for your future
database. You now know that you have to
store this field in the database and
that it'll be of a type number. We can
do a similar thing for users joined
which in this case can actually be an
object where you keep track of the
current month maybe like
218 and the last month. That way you can
compare that data. So last month I'll
set it maybe to 176.
This will allow us to have this nice
looking chart right here. After that, we
can render the total trips card maybe
3,210. And then we can also have the
trips created. So this will be for the
chart where we can have the current
month data maybe like 150 and the last
month data maybe like 250. Let's say
there were more that month. And finally,
we need to know how many active users do
we have. So I will say user
ro we have a total of about 62 maybe
current month maybe let's say there were
25 and last month let's say there were
like 15 so we're growing very fast
perfect so this is some fake data that
we can now pass over into the cards so
let's focus on the stats card first
below the header I'll create a section
and this section will have a class name
equal to flex flex- call and a gap of
six so we can display all of them one
next to another within this section I'll
create a div that'll have a class name
of grid so specifically the grid for the
stats card where we want to make it have
only one column so calls one on medium
devices we want to have three columns so
this will be on larger devices and then
a gap of six in between the cards and a
full width. And right within it, we can
display our first stats card. So I'll
say stats card self-closing and we can
already start figuring out which
different types of props do we have to
pass into it. So I already told you that
we'll need to have the total users,
right? So that's the title header. title
is total
users. Next, we can pass the actual
amount which I'll call the total. So,
this will be equal to dashboard stats
dot total users. We'll also need the
current month count which will be equal
to dashboard stats dot users
joined current month. And then we can do
the same thing for the last month. Count
is equal to
dashboard stats dot users joined dot
last month. And we can maybe dstructure
this dashboard stats just so we don't
have to repeat ourselves every time. So
I will dstructure the total users and
users joined from the dashboard stats by
saying const total
users users joined total trips trips
created and user ro equal to dashboard
stats. So now if you head here you don't
have to explicitly say dashboard stats
for every single one of them. You can
just refer to total users and users
joined. Perfect. So now we can very
easily duplicate this card two more
times. For the second one, instead of
total users, we'll have total trips. So
we can pass the total trips. And instead
of users joined, we can refer to the
trips created. And then for the last
one, we can talk about just users. So we
can say user
rot total. And then here we can say user
rotc current month and last month. So if
you head back over to your application,
you'll see that we still have just three
empty cards, but now we're passing the
right data to them. So it'll be super
simple to take that data and display it.
The only thing we have to do is head
over into the stats card and implement
its layout. Of course, starting with
dstructuring all the props that we're
passing into it such as the header
title, the total, the last month count,
and the current month count. These will
be of a type stats card. So what you
could do is you could either define an
interface right here of stats card and
then say what the header title will be,
what the total will be and so on. Or you
can do what I did right here, and that
is to define the stats card within a
special file called
index.d.ds, which allows you to declare
interfaces, which can be used across
your entire application without needing
to import it. So here we're saying that
the header title is a string, the number
is the total, last month count, and
current month count are both numbers.
And that's it. It just immediately knows
that the header title is a string.
Pretty cool, right? So now that we have
that card, we have to take the last
month and the current month count and
get some useful data out of it such as
figure out what is the trend. Is it
increasing or is it decreasing? This
will be useful for us to figure out the
color of the chart and then also by how
much has it decreased since the last
month. And this is actually a pretty
interesting challenge if you want to
work on it. What I'll do is say const
dstructure something and make it equal
to the call of the calculate trend
percentage and to it I'll pass the
current month first and then the last
month second. And this calculate trend
percentage will give me exactly what I
need which is the trend and the
percentage. Now how does this calculate
trend percentage work and where is it
coming from? Well, I declared it within
the utils function. It's a utility
function, but of course, I invite you to
implement it on your own. This is a
great type of function that chat GBT
excels at. You give it a very small task
such as to give you a trend and a
percentage. You say what the inputs are
such as the count this month, count last
month, and then you tell it what you
need to output. So in this case, it says
if count of last month is zero, then
there is no change. So what is it doing
is it's taking a look at the difference.
It's grabbing the percentage of that
difference and then if the change is
greater than zero it returns a trend of
increment and a percentage. If change is
lower than zero then a decrement
percentage and if there's no change it
just returns zero. Makes sense right? So
once we get that trend, we can then say
const is decrement is equal to and
that's going to be equal to trend is
equal to decrement. What we're doing
here is we're just checking for equality
and then turning that equality into a
boolean variable so we can more easily
use it within the card. So now that we
have all the necessary data we need in
order to implement the layout of the
card, let's actually do it. Cards are
typically articles. So, I'll use this
article and give it a class name of
stats dashcard, which will automatically
give it a white background and a bit of
a shadow. If at any point you're
wondering which styles are being applied
when you add a specific class name, you
can commandclick into it or just search
for it across the codebase until you
find it within the app.css. You will see
that we're giving it some padding,
making it a flex container with a gap in
between the items, giving it a
background, a shadow, a bit of a rounded
corners, and a dark text. Next, right
within this article, we can render an H3
that'll have a class name equal to
text-base font- medium, and it'll render
the dynamic header title. So now each
one of these says a different thing.
total users, total trips, and then total
users. Once again, that's because I
forgot to change the last one. So, if I
head over into the dashboard, yep, you
can see here I left total users, but
actually it was supposed to say active
users
today. Perfect. So, now we have three
different
cards or just active users is fine.
So now we are ready to start
implementing the rest of the stats card.
Right below the H3, we can start
focusing on the main content. So I'll
wrap it in a div with a class name of
content. And within that div, I'll
create another div with a class name of
flex flex- call and a gap of four in
between the elements within which we can
start rendering an h2. That'll render
the total number. So now we have the
number, but to make it look a bit
better, we can give it a class name of
text-4xl and font- semibold because the
total number is more important than the
title. You need to see those numbers
very clearly. Right below this H2, we
can render another div that'll have a
class name of flex items center and a
gap of two. And within it, we want to
render a figure. This figure will
contain the percentage as well as the
arrow pointing up or down. So right here
I'll give it a class name equal to flex
items center and a gap of one. And
within it I will render an
image with a source equal to it has to
be dynamic. So I'll open up a template
string and point to assets icons and
then if it is decrement I will render
the arrow down red.
SVG. Else I will render the arrow up
green. SVG and I'll also give it a class
name of size of five and an al tag of
arrow. If you save that, you should be
able to see up down up which matches our
data. And right below that image, I'll
render something known as a fig caption
which is basically just a P tag within
which I'll render the math. round and
within it I'll pass the percentage and
then add the percentage sign right after
it. So you can see it says 25% up, 40%
down, 67% up or something different for
you if you used different numbers. Let's
also style that text a bit by giving it
a class name. I'll use a dynamic CN
class name. It'll always have a text
small and a font medium. But if it is
decrement, then it'll also have a text
red of 500. Else it'll have a text
success of 700. So now we can see that
the number also matches the color of the
arrow. And then outside of this figure,
I'll also add a bit of an explanatory P
tag that'll say versus last month so we
know what this number is referring to.
Let's make the text a bit smaller by
giving it a class name of
text-s font- medium and since it's not
so important, text gray of 100 and
truncate. So if it's too long, we can
just remove that part because it's clear
what it is referring to. Great. And now
we can head over below this B tag and
below two more divs and we can render an
image. This image will have a source of
forward slash assets slash icons forward
slash dynamically we can check if we are
in the is decrement and in that case
we'll display the
decrement.svg else we'll display the
increment. SVG. So if you save it,
you'll be able to see those different
charts. Now a challenge for you and
something that we can look into later on
would be to actually make these charts
functional using a library like
charts.js or something similar. For now,
the most important thing for me is to
display the value and the trend. And
making this real is a beautiful
challenge for you to try out. So, you
might want to check out Syncfusion's
chart components because they have a lot
of functionalities that allow you to
very easily display that chart data. But
for now, let's also style it a bit more
by giving it a class name of on
extra-large devices W of 32. Typically,
W full H full on medium devices age 32
on extra-large devices H full. And I'll
give it an al tag of trend
graph. So if I save this, they're now a
bit larger. And if you check out the
desktop version, this is looking exactly
like it does in the design. Pretty cool,
right? And later on, this will be super
functional because you can make these
cards clickable. So it actually points
to a page where you can show more
details about those users like active
users and total users can point to the
all users page and total trips can point
to the AI trips page where you can show
more details on the trips. But for now
let's focus on implementing the trip
card. This will bring so much more life
into our dashboard because each one of
these trips will have its own thumbnail.
So let's collapse it. So now is the time
to implement that trip card. Before we
start implementing the UI, we'll have to
figure out the data for those
components. And similarly, how in the
dashboard, we rendered some fake data
for the dashboard stats, which soon
enough will be imported into our real
database. We need to have the data for
the trips. So, I prepped some fake data
for you right here. So, we can very
easily get going. It'll be right here
under all trips dummy. And you can see
that here we have all the trips. So
let's simply import it and paste it
right here at the top. It doesn't have
to be within the component. As a matter
of fact, I'll also pull these outside of
the component because this is just fake
static data which later on will be
converted over to be real database data.
And I'll paste it here. You can see that
each one of these trips has an ID, a
name, image URLs, the itinerary with
different locations, tags, travel
styles, and estimated prices. But it's
never a good idea to keep static data
right here within the JSX file where
we're trying to do some logic or
represent some UI. So, what I'll do
instead is I'll copy these trips, user,
and dashboard stats, and I'll move them
over to the bottom of the constants
file. So, this is the constants
index.ts, and I'll paste the dashboard
stats, the old trips, and the user data.
I think later on we'll also have the
users data, so I'll copy it while we're
here, and also add it here. So we have
some fake users. This one uses the
format date functionality. So make sure
to import it from lib utils. There we
go. This is only to help us focus on the
UI. But very soon we'll be pulling all
of this data directly from the database.
And you can see there's no more snippets
to copy. Everything else in this entire
application will be done entirely by us
together. So let's make sure to add an
export statement at the start of each
one of these lines. And we can import it
right here within the dashboard. So I'll
say import dashboard stats from
constants. Also the user and also what
else do we need? I think it's going to
be the all trips. So we can render the
cards for each one. See how clean the
file is. And we can even pull this
dstructuring right here. So we have
nothing in the component. We only have
the JSX. So now below the stats card,
I'll actually just hide them for a
second. I'll display a whole another
section. Right below this section that
shows the stats cards. This one will be
another section that has a class name
equal to container. And it'll also have
an
H1 that'll have a class name equal to
text- Excel and font-
semibold as well as text- dark 100. And
it'll say created trips. So now right
below it, we can render a div that'll
have a class name equal to
trip-grid. And keep in mind, nothing is
showing up right here besides this trip
card, which we can remove. But now
within here we can use that dummy trip
data by saying all trips coming from
constants dots slice which means that we
can only get maybe the first four
trips and then we can map over them by
getting data for each one of these trips
and then for each one of them we can
automatically return a new trip card
like this. So if you save it, you'll now
see four different trip cards to which
we can pass all of this trip data. So
I'll give it a key since we're mapping
over it of trip ID. And as a matter of
fact, we can dstructure those properties
from the trip. So I'll dstructure the
ID, the name, image URLs, itinerary
tags, and the estimated price. All the
info that we need. And now we can very
easily pass it over as props into the
trip card. So the key is just ID. The ID
will be equal to ID do string because
typically when you store ids in
databases they can be of some other data
type not necessarily a string. We can
get a name equal to name image URL equal
to image urls zero. So we're going to
take the first one. The location can be
equal to itinerary question mark.0ero.
So if it exists get the first one and
then get its location or if it doesn't
exist maybe display an empty string like
this. For the tags about the trip
display the tags and for the price
display the estimated price. Perfect. So
now we're passing all of these important
props into the trips card. So, what do
you say that we go ahead into it and we
accept them and we start implementing
that card? It won't be that tough, trust
me. Maybe even easier than the stat
card. The data is what matters. For now,
it's static, but soon users will be able
to create it using Gemini so that the
trips contain real suggestions on the
trips where your users want to go. So
I'll dstructure that data such as ID,
name, location, image, URL, tags, and
the price. All of these are of a type
trip, card, props. And now we can make
each one of these cards a link coming
from React Router. Why? Because we want
to be able to see the trip details once
we click on it. This link will render an
image with a source equal to image URL
and then alt tag can be the name of the
trip that they're going
to. If you save this, you'll be able to
see four dummy images. For me, there are
four of the same images right here, but
for you, I might change it up a bit and
actually put different ones. But of
course, what matters more is that each
one of these cards will actually point
to a real trip details page. So let's
actually add a two-part and we have to
get access to the current path. So right
here it's very similar to how we do it
in
XJS const path is equal to use location
coming from react
router. Then we can check whether we're
clicking on this card from the public
facing website or from the admin
dashboard because depending on that
we're going to link them to a different
page. So I'll say if
path.pathname is triple equal to forward
slash meaning public
facing or
path.pathname starts
with forward sltra that still means that
they're on the public facing website. In
that case we'll point them over to
travel and then the ID of that trip.
else will point them to trips forward
slash ID. Why? Because for the admin, we
want to display the details of that
trip. Whereas for the person, we just
want to show them the trip that has been
created. Let's close this properly. And
if you click on it right now, you'll get
redirected to a 404. So don't do that
just yet. But with that said, let's
continue adding more data to this card.
I'll give this link a class name equal
to
trip-ashcard which will kind of collapse
it a bit. Next, right below this image,
I will create an article that'll contain
most of that cards or most of that
trip's data such as the H2 that'll
render the name of the trip. Maybe also
a figure in this figure will contain an
image that'll have a source of assets
icons location marks
SVG with an al tag of location and a
class name of size of four. That's much
better. Now, why do I use figure? Well,
if you have an icon that is related to a
specific text, then you might want to
put them into a figure and put a figure
caption like
this instead of a paragraph. It's just
better for screen readers and overall
usability. So now we can see that this
is New York, Paris, Tokyo, and so on.
Next, we can exit out of this figure and
the article as well and create a div
right below it. This div will have a
class name equal to margin top of five
to divide it a bit from the top. A
padding left of about 18 pixels like
this. Padding right of about 3.5 and
padding bottom of about five. So we're
creating space to display some tags
right here. And for the tags, I'll use a
Syncfusion chip component. So I'll just
start typing chip list component.
I'll give it an ID of a travel
chip and within it we can display the
chips directive component and these one
will look something like this. You have
different styles like simple choice
chips, filter chips, dynamic chips. It
is super customizable within it. We can
map over our tags by saying tags.m map
where we get each individual tag and the
index of that tag. And we'll render a
chip directive not chips directive this
time without the s as a self-closing
component that has a key equal to index.
It has a text equal to get first word of
a tag because tags can contain multiple
words. You have to import this from
utils. Basically, we just trim it out,
split it and render the first word. And
then we can also provide some CSS class
to it to style it further. And I'll say
CN from utils. If index is triple equal
to 1, then give it a
bg 50. And you have to add an
exclamation mark in front to make sure
that the style is applied as well as
text pink 500. Else give it a bg success
of 50 and a text success of 700 and save
it. So now you'll see that we have
different colors for those two different
tags. First one may be New York is about
adventure and culture. Paris is
relaxation and culinary and so on.
Finally, we can head below this div
that's wrapping the chips and render the
article that'll contain the information
about the price. Of course, we can style
it a bit better by giving it a class
name of trip card dash pill. And this
will just make it a pill that's going to
show up on top of this image right here
on the right. Looking great. Also, I
automatically added some images right
here to match what you're seeing on your
screen right here. And with that, we're
done with the trip card. But of course,
it looks even better on desktop where we
can see all of these cards. Later on,
we'll be able to visit them as well, but
you get the idea. We can see the latest
trips that the agents within our travel
agency are creating. So now we have a
beautiful layout, but with fake data. So
the next obvious step is to implement
the full functionality for our
application including
authentication allowing users to add
real trips storing it all within the
database and then displaying it right
here on the dashboard as we are right
now but with the real
data to get started adding functionality
to our application and some persistent
storage. We'll use Apprite, an open-
source platform that allows you to
create your entire backend within
minutes. In this course, we'll use it
for their databases, storage, and
authentication functionalities. So,
click the link down in the description
to be able to follow along and see
exactly what I'm seeing and then create
your account. As you can see, I already
have quite a few projects running on
AppRight. So, let's create another one.
I'll call it JSM Travel Agency
dashboard. You can do something similar.
Click next, choose a region, and your
project will be created. Within here,
we'll need to grab a couple of IDs and
store them within our application. So,
I'll collapse my browser so I can see my
code editor, too, and I'll head over
into
myv.loc, which is where we can add those
apprite keys. The first one I'll add
will be a vit apprite project ID and
that'll be equal to this key that we can
copy right from here. I'll add a comment
that right here these are going to be
our apprite keys and then above we have
some coming from
Syncfusion. Perfect. Now here it's
asking us how do we want to integrate
our application and I'll say that we
want to integrate it with the server
using an API key. So if you click right
here, you'll be able to choose your API
key name and give it access to all the
scopes. That'll give you your API key
secret. So copy it and create a second
variable of vit apprite API
key and paste the one that you just
copied. Now head over to databases and
create a new
database. You can call it anything, but
I think travel is suitable right here.
As soon as you do that, you'll be given
your database key. So, also save it.
I'll call it vit apprite database ID and
just paste it right
here. Within it, we'll be able to create
additional collections within our
database. So, you can create our first
collection and call it users, which will
allow us to authenticate and store those
users right within our database. As soon
as you create it, you'll be able to copy
its ID as well. So I'll call it vit
apprite users collection ID and paste
the key that I just copied. And we want
to repeat the same thing with the trips.
So I'll create another collection called
trips and create it. And I'll copy its
ID. So I'll create another one called
vit apprite trips collection ID. And you
can paste that one as well. Now each one
of these two collections has to have
some fields within it. So first let's
head over into the users collection and
head over to attributes. So we can start
defining how our database structure will
look like. So let's ask ourselves what
does every single user need to have?
Well, they'll need to have a string that
is a name. So they need to have a name
and we can make it a size of well we
could do something like 20 characters
and make it required. Alongside the name
we also need an email. So we can create
another field of email. I'll call it
email and I'll also make it
required alongside the name and the
email. We'll also need an account ID. So
create a new string of account ID. Make
sure to put the I in ID uppercased
because this will be case sensitive. And
we can make it about 1,000 characters
just to stay on the safe side. And I'll
also make it required. I'll also create
another string for the image URL
attached to that specific user's profile
photo. And I'll make it 1,000 characters
should be
enough. I won't make it required this
time as maybe some users don't have a
profile photo. And I'll also add a date
time of a type date time. And I'll call
it joined at. So when did this user
join? And I'll make it required. Next,
we'll add a more complex type called an
enum. So this is basically a string, but
it can only be made up of a couple of
different values. I'll call this enum a
status. So each user can have a status
or you can also call it a type, but I'll
stick with status right now. And it can
either be user or
admin. So you can add a comma after each
one to actually add it as an element.
Then I'll pick the user as the default
value and I'll create it. That should be
it. And finally head over to settings of
the user collection. Scroll down to
permissions. Click plus and select any.
and then select all the permissions
right here so that everybody has all the
permissions just so we don't get blocked
because we don't have the necessary
update
permissions. Perfect. So now we'll be
able to create different users that have
all of these different fields. Next,
let's create some attributes for the
trips. So head over to trips collection
attributes and create a first attribute.
I'll call it trip detail. We don't need
the s at the end. I think trip detail
will be fine. I'll make it a big size,
like very big. I'll go with maybe 10,000
characters, just so we can have the
entire itinerary, details, budget, and
everything right there. And I'll make it
required. After that, I'll create
another string. Call it image URLs. Give
it a size of about well, let's do 5,000.
Since these URLs can be large, I won't
make it required, but I will make it an
array to indicate that this is an array.
I'll also create a dated time like
before called created at so we know when
specific trip was created and I'll make
it
required and I'll also add a
URL which will be a link to the stripe
payment. So I'll call it
payment link and I won't make it
required. I'll also add a user ID which
will be a string so we can connect the
user with a trip. I'll give it a size of
about a thousand
characters. Perfect. So now you should
have image URLs which is a string array.
You should have trip detail which is a
required string. You should have a
created ad property which is a required
date time, a payment link of a URL and
the user ID which is a string. Now head
over to that collection settings. Scroll
down to permissions. Select any and give
it all permissions. Perfect. That's it
for our AppRight setup. Very soon we'll
be able to use all of these
functionalities such as the API
integration, the AppRite project itself,
as well as the database collections and
even authentication. But the next step
into making all of this work is
connecting our authentication. And we'll
do that using Google. So for that, we'll
need the app ID and the app secret
coming from Google. So you'll have to
head over to console.cloud.google.
google.com. Head over to projects and
create a new
project. I'll name it something like JSM
agency
dashboard and create it. It'll take a
few seconds for it to get created. And
then you'll be able to open that
specific project. Then where you have
the search, you can search for
clients. Here you'll be able to see
Google O platform. And before you click
get started, head over to branding and
then click get started. Here you'll be
able to choose your app name. So you can
do something like
JSM travel
agency and you can enter your email for
support. You can choose external for the
audience and then you'll have to provide
an additional contact info
address and create it. Once you create
the OOTH config, you'll have to head
over to clients and create a new client.
Select web application as the
application type and you can call it
something like JSM travel agency and add
an authorized JavaScript origin. Here
you can do something like http
col// localhost
5173 and you can click create. Later on,
we'll need to update this with the URL
of our deployed application. What
matters most right now are the key and
the secret that will just pop up. So,
copy the key first. Head back over into
Apprite and provide this app ID that you
just copied as well as the client secret
which you can paste in the second step.
Then copy the URL at the bottom of apps
card and click update. This will say
that the Google authentication has been
updated. And then head back over to
Google. Click edit on this client and
add an authorized redirect URI by
pasting the apprite redirect URI that
you just copied and then click save.
Now, another thing we have to do on
Google to be able to retrieve Google
profile photos is to search for Google
People
API. It's this one right here. And
enable it.
This will allow us to extract the
profile photo from every user. Perfect
was a lot of setup. I know. But now
we've prepared ourselves to handle
authentication and we have also set up
everything regarding apprite. So we have
very seamless development time from now
on. So in the next lesson, let's
implement it within our codebase.
To get started implementing our backend
system, I'll head over into our terminal
and just run one simple command. MPM
install appite. We'll use it to handle
our back end. It got installed in a
couple of seconds. And now I'll head
over into
ourv just to add one more environment
variable which I'll call vit apprite api
endpoint. We can add it right here at
the end. And this is something that is
the same for every single apprite
project. So I'll set it to https
col/cloud.apprite.io slashv1. This is
where the cloud version of apprite is
hosted. So our app needs to know it so
you can hit those proper endpoints. Now
we'll need to set it up. So I'll check
out this documentation that is very
simple. It guides you through everything
we have done so far. But then it asks
you to set it up from within the code.
So to get to this page, you can just
head over to Appra documentation quick
start for React and scroll down to the
part where we have the code. Perfect. So
it says to create a new file under lib
apprite.js and add the following code to
it. But instead of just copy pasting
what we have here, we're going to write
it together from scratch. That's what
you're watching this video for anyway,
right? to learn how to do things
properly from scratch. So, back within
the code, let's head over into our file
explorer and head into app, create a new
folder within it called apprite. And
within the apprite folder, create a new
client.ts file where we'll set up the
app client. Here we'll first get access
to all of the apprite variables coming
from constants and then we'll export
them so we can use them from within the
rest of our application. So export const
apprite config is equal to an object
where we're going to have the endpoint
URL set to import meta.env_apprite_i
env_apprite_appi endpoint. And now we
can duplicate this a couple of times
because we'll need to change it for
different things. The second one will be
the project ID and then of course we'll
have to change it to vit apprite project
ID. After that we'll need the API key
which will be vit apprite. You can guess
it API key. After that we have a
database ID and then we'll point it to
database ID. After that we have the user
collection ID pointing to V appride
users collection ID. And finally we have
the trip collection ID pointing to V
appride trip collection ID. Let's just
make sure that we have called them
properly. Trips, trips, user, user. It
has to be the same. So if you open up
your
envir users plural as well as trips
plural as well. So make sure to spell it
properly otherwise the app will not
work. So you have to do this very
carefully. What you can do is maybe a
global search for the entire thing. You
can do that with control or commandshift
F and it should search it across the
entire codebase. So I can immediately
see that this one matches. This one
matches as well. Database ID is here as
well. I can see it here. This one
matches as well. Apprite API key is
there. Project ID is here. And API
endpoint is here as well. I think I
should be good. Now that we have this
entire configuration, we can say const
client is equal to new client coming
from apprite. So new appreate client and
on it we can call a method called set
endpoint to which we can pass over the
app config dot endpoint URL and I'll
also call the set project to which I'll
pass the appate config dot project ID.
So this way this app right client knows
exactly which project and endpoint we're
working on. After that, we'll have to
set up additional appre functionalities
such as const account to manage user
accounts. We'll be equal to new
account. Make sure to automatically
imported from apprite at the top account
and client from
apprite to which we'll pass this client
that we have above. I'll do the same
thing for the database. So con's
database is new
databases coming from apprite and to it
will pass the client and con storage is
equal to new storage also coming from
apprite. Make sure to import it at the
top and I'll pass the client. So now
that we have the general apprite client
as well as these three additional
functionalities, we can just export them
from this file so we can use it within
other files. Client, account, database
and storage. Perfect. So now that this
implementation is done, the next step
will be to implement authentication.
There are two different approaches we
can take right here. The first one would
be to focus on the layout or the UI
first like what we have been doing
before and the second one would be to
first implement the functionality. In
this case we have Google O connected to
apprite o and then later on we can very
easily do the UI. So what do you say?
Let's do the harder thing
first. Back within our codebase I'll
create a new file within the apprite
folder which I'll call o.t
RTS here we'll create all sorts of
different methods that allow us to
handle authentication starting with of
course the login. So all of these
different methods will start with export
const because these functions will be
used from within our front end. So I'll
say export const login with Google.
It'll be equal to an asynchronous
callback function.
that'll have a try and catch block. In
the catch, we will simply console.log
that error and that's going to be it.
Now, we'll have all sorts of different
functions that'll follow this same exact
structure. Export const async function
with a try and a catch block where we
console log something.
So, what do you say that we
automatically duplicate it a few times
and then rename it for all sorts of
different functions that we'll need?
I'll do it a couple of times and then we
can start renaming them. So, we have
login with Google. Of course, we'll also
need a log out user to log them out.
Next, we'll need to get the user. This
is to get the user profile. We'll also
need one to get the Google picture,
their profile photo, and we'll also need
one to store the user data into the
database once they first log in. So,
store user data. And if I'm not
mistaken, we'll also need one to get the
existing user if they existed before.
Right now, how did I know that we'll
need all sorts of these different
functions? Or the other question is, how
can you know when you're just
approaching this project? The answer is
you can't. I actually took the time to
build this application beforehand so I
can teach it to you properly. If you
were building this for the first time,
you would just start with one massive
big function and you would start
noticing that that function actually is
getting too big and it's doing too many
different things. With proper code, one
function should have one job. So as soon
as you start noticing that it's starting
to get more jobs, you separate it into
other functions. Okay. But with this in
mind, we can start implementing these
one by one. Starting with the login with
Google functionality. Here we want to
leverage apps functionalities that we
have exported from the apprite client
file. such as for login with Google, we
want to leverage the account
functionality coming from apprite client
specifically the create oath to session
method that accepts a couple of
different parameters. The first one is
the oath provider. So I'll say
oath
provider google. That's going to look
like this. And as the second parameter,
we have to provide the success URL. And
as the third one, the failure URL. But
all of these are optional. So I think if
we just leave them empty for now, we
should be good. What provider Google and
you might need to import this oad
provider coming from
apprite. Perfect. Believe it or not,
this is it to log in the user. Now for
each one of these errors, in case you
want to make them a bit more
descriptive, you can say before the
error itself, you can render a string
with the same name as the function. So
you know exactly where that error is
coming
from. Great. So login with Google is
done. But once we actually log the user
in, we might want to focus on getting
that user's information. Okay. So we'll
leverage the same account
functionalities, but this time not to
create a new oath session, but rather to
get that user that we have just created.
So I'll say con user is equal to await
account.get. Then if we don't have
access to a user, so if no user, I'll
simply return a redirect to forward
slash signin. Something obviously went
wrong. But where is this redirect coming
from? Well, it's going to come directly
from React Router. Pretty simple way to
do it. But in case we do actually get
back the user, we want to extract
something out of it. So I'll say const
dstructure the documents and say that is
equal to await
database.list
documents. And here you're basically
telling it hey extract some documents
from the database from for me. But you
have to actually say exactly from where
in the database you want to extract
them. So you have to provide the ID of
the database, the ID of the collection
and then finally the query with which
you want to query that
database. So thankfully we have stored
all of those pieces of data within our
apprite configuration. So as the first
parameter I'll provide a database ID and
this is coming from apprite config. So
make sure to import this app config
right here at the top and then we have
to provide the collection ID. So that's
apparate config user collection ID and
as the third parameter you have to
provide the actual query that you want
to use to query these documents. So I'll
use app's query functionality which
we'll need to import from
apprite equal. So we want to return
documents where the account ID equals to
the
user dollar sign ID. So we're only
returning the data for the user that is
currently logged in. Then I want to run
the query select to tell it which fields
do we need such as the name, email,
image URL, when did the user joined. So
joined ad and the account ID. Perfect.
And of course make sure to import this
database coming from app client. Great.
So this function should give us back our
logged in user. So I'll shift it above
right above our logout user because we
might not need that functionality for
some time yet. But what we will need is
a Google picture. So extracting this
seems like a perfect thing for an AI to
do as we don't have to necessarily write
all the code ourselves especially
repetitive or boring code which doesn't
really deal with any logic. So this
might be a perfect chance to give Juny a
try. See, Juny is Jet Brains or
WebStorm's new smart coding agent for
productivity, and I wanted to test it
out a bit to see whether it can help us
with this. I started using it recently,
and I'll link it in the description in
case you want to test it out, too. But
let me give it a shot and see what it
comes up with. So, I'll open it up by
pressing command shiftp and then typing
jun, which will open it up right here on
the right side. Now I'll give it a task
to fetch the profile
photo from the Google people API and
return its URL. Okay, I really wasn't
descriptive enough. So let's see if it
can actually do it based on this limited
amount of information. Okay, it created
a plan which it will use to do that. It
actually checked out the
enving the odd file and now it should
actually write some code. After some
thinking, it looks like the get Google
picture function has been implemented to
fetch the user's profile photo from the
Google people API using the OOTH token.
It's also changing the store user data
and get existing user. Oh, it also
implemented the logout function. This is
pretty cool. So, it seems like it
actually did a lot of stuff right here.
It stored the user data into apprite by
fully understanding how apprite actually
works. Creating a new user document and
it even fetch the existing user from
apprite. All of this is super amazing.
But did it do what we asked it to do?
Well, let's check it out. First things
first, it is getting the current session
and it's getting the OAT token from that
session. Then it's checking whether it
got that access token. And by the way,
if you don't have Juny, you can just
pause right here and write out this code
as well. Then it's actually making a
request to the Google people API to get
the profile photo. So it actually
scouted the web and found the right
endpoint. People Google apis.com v1
people me person fields photos. This is
exactly how it should be. and it passed
the headers with the authorization
bearer oath token. If it failed, it
console logs it. Else it extracts the
data, gets the photo URL and returns it.
This is pretty crazy. This is the exact
implementation that I had in mind. So I
can now collapse it and they just told
me get Google picture function was
implemented. The implementation is
error-free and all the related functions
were updated accordingly.
I got to say this is amazing and it even
tackled the logout user functionality
where it simply deleted the current
session and return true. So feel free to
pause and implement this as well. And if
we look into the store user data here,
it's getting the user. It's checking
whether the user already exists in the
database. And by trying to list that
document, if it does exist, we simply
return it. else we get access to the
Google photo and then we create a new
user await database.create create
document within this database the user
collection we make it unique I think
here we can do a bit better by saying ID
coming
from apprite dot unique so here we can
really use a unique ID and then it
passed over the account ID the email the
name the image URL and the date we
joined that finally it returned the new
user
This is the perfect implementation of
this function. And I got to say, I am
amazed. It did everything I asked it to
and even more. It's even checking for
the existing user and returning it if it
exists. But with such a great
implementation of the get user function,
it's even checking for that here. So
that additional function might even be
redundant. Okay. Since Juny coded this
for me, it's possible that while trying
to replicate it, you maybe have some
typos. So for that reason I'll provide
this o.ts file within the video kit as
well. So you can copy it and ensure that
you have the same exact implementation
that I have even I'll do it right here
by deleting it and putting it here just
to ensure that everything is exactly the
same. And with this in mind I'll also
push this over to GitHub by running git
add dot git
commit-m and I think I forgot to push
for the last couple of lessons. So since
then we have
implemented routing dashboard
layout dashboard UI as well. So
dashboard layout and UI and now even the
o
functionality. So I'll commit it and
push it. And in the next lesson we can
focus on implementing the UI of this
great authentication
page. To get started with Oth UI, let's
first create a route for the O page. So,
head over to app and notice how
currently we have the routes right here
for the admin. But now we'll create it
outside of the admin layout, which means
that this page won't share the layout we
created for the admin dashboard because
it doesn't have the header, the left
sidebar, the navbar, or whatever. It
just has a singular login. So I'll
create it right here within a new folder
called
root. And within root I'll create a new
file called
sign-in.tsx within which I'll run rafce.
Now we'll have to head over into
routes.dts because this doesn't just
work like next.js's file-based routing.
You still have to define it right here.
So above the current layout I'll add a
new independent route pointing to sign
in and its path will be
routes root
signin.tsx like this. So now if you head
over into that route we can also try
accessing it on the dashboard by heading
over to sign
in and there it is. Sign in cannot read
properties of null. So let's actually
implement it. If I reload it one more
time, the error is gone. So, I believe
we should be good. I'll start with the
UI. So, I'll turn this div into a main
and give it a class name equal to off.
What this will do is it'll automatically
apply the background photo right here.
Looks okay on mobile, but once again, it
really stands out on desktop. If you
want to check out how I did it, the only
thing you have to do is basically apply
a full width, a full height, and then
there's this background o background
cover and background no repeat. And this
image is taken over right here from our
assets. We have just added it as a CSS
variable right here within Tailwind. So
now I'll create a new section within
this main. And this section will have a
class name equal to size- full glass
morphism flex-c center and a padding x
of
six. This will basically create this
glassy feel over the entire background
so the card is more visible. So within
this section I'll create a new div with
a class name equal to sign in card and
within it I'll create a new header with
a class name equal to
header. Within this header we can render
a react router link. So make sure to
import it and we can point it to forward
slash meaning just the homepage. And
within it, we can render our logo. So
I'll render an image with a source of
assets/assets/icons/
logo.svg with an al tag of logo and a
class name equal
to size of 30 pixels. There we go. And
below that link, we can render an
H1 that'll say tour Visto, which is the
name of the application with a class
name of P28 bold and text-d dark
100. Thankfully, I added the tour visa
name to our Webtorm dictionary. So now,
even when I misspelled names, I know I
misspelled them. There we go. Below this
header, we can create the article for
the rest of the card. That'll have an
H2. And this can say something like
start your travel journey. We can style
it a bit by giving it a class name equal
to
P28
semi-bold text- dark 100 and text-
center. And below it, I'll also render a
P tag that'll say something like, let's
see, what do we have in the design? Sign
in with Google to manage destinations,
itineraries, and user activity with
ease. So, I'll copy that from the design
and paste it right here. I'll also give
it a class name equal to P18 regular
text- center text-g gray 100 and
exclamation mark leading dash 7. So this
will change how the characters are
structured. Right below this article I
want to render a button and this button
will come from Syncfusion. So I'll say
button component coming from Syncfusion
right at the top that is Syncfusion EJ2
React buttons and we can render an image
right within that button with a source
of forward/assets/icons/google.svg
SVG within it. I will also render an
icon CSS that'll be E search icon so we
style it further with a class name of
button class exclamation mark H11 for
the height an exclamation mark W full.
Sometimes you have to add the important
style to the class names so that they're
actually taken into account. And now
you'll see this huge Google G. So, let's
instead give it a class name of
size-5 to make it smaller. And I just
noticed that I applied some styles to
this image right here, but those styles
were actually meant to be applied to the
button itself. So I'll move them up and
say this button will be of a type button
with the icon CSS a class name and an on
click equal to handle sign in. So right
at the top I'll declare this handle
signin function as an asynchronous basic
function for which the logic will
implement very soon. But now what
matters is that we have this button.
Within it we have this image. We can
also give it an alt of Google. And below
the image we can render a span that will
say sign in with the
Google. And we can give it a class name
of
P-18- semibold and text-white so we can
better see it on this blue button.
There we go. Sign in with Google. Now
the only thing we have to do is
implement this handle signin function
which right now will be super simple to
do. Actually, believe it or not, we have
already done it. So right here at the
top, the only thing you have to do here
is say
await login with Google which basically
renders this entire function not needed.
So instead of declaring this handle
signin function, what we can do is just
head
down and call the login with Google
right
here when the button is clicked. But
there is one thing that we have to add
at the top though and that is a loader.
See in React Router a loader is an
asynchronous function tied to a route
and it runs before the routes component
renders and provides the data to that
component so that it can use it
immediately once it appears. This makes
the app feel faster and more structured
because data fetching happens before the
UI shows.
So to implement this very cool React
router loader, you can do it right at
the top of the sign-in
function export async function client
loader. You can open up a try and catch
block. In the catch, we can simply
console log the error saying something
like
error fetching user. And in the try,
we'll actually try to get the user data
beforehand. So we'll say const user is
equal to await
account.get. And then if there is no
user dollar sign ID, we'll simply return
a redirect coming from React Router to
the homepage. And if we get the user,
that's great because then we'll already
have access to it before. And we also
have to import this account
functionality from apprite client. So
now if you reload, you can see that it
loads super nicely. And we can also copy
this client loader and also add it to
our admin layout. But we'll change it up
just a tiny bit. Within the admin
layout, head over above the current
admin layout component and paste this
client loader. Here we'll do something a
bit differently. Keep in mind this will
render when we're on the dashboard page.
So here we want to check apps o for the
currently authenticated user and if
there is no authentication redirect user
to the signin. So we'll do account.get
if there is no user ID then we'll
redirect to sign in. So a bit
differently than in the other one. But
if there is an existing user. So const
existing user is equal to a wait get
existing user coming from apprite o to
it we have to pass the user dollar sign
id then we can check if existing user
question mark status is equal to user in
that case we again want to redirect like
this to the forward slash why because
regular users should not be able to
visit the dashboard. Only admins can. So
this is another check to see if we need
to reroute them somewhere else. Finally,
we'll return existing user question mark
dollar sign ID. If we have it, we'll
return the data for the existing user.
Else we'll say await store user data
like this. Here I am missing user and
here instead of saying error fetching
user I'll say error in client
loader and I'll return the redirect to
sign in because most likely we have to
sign in if we experience the error
fetching the user. What you can do now
is open up your terminal, expand it a
bit and stop it from running. That way
all of these changes regarding routing
will be applied. So you can then rerun
your application by running mpm rundev
which will spin it again on localhost
5173. If you do this and if you head
over to for/ dashboard, you'll notice
that it'll automatically redirect you
back to signin, which means that our
redirects and authentication are
working. Now, just before we click this
signin with Google button, let's head
back to Apprite to make sure that all of
our settings are correct. As of
recently, AppRight is making a lot of
improvements to their infrastructure.
And one of those improvements are the
regions. Right now, Frankfurt is one of
the primary ones, but in the future
there could be more. So, depending on
which region is closest to you, you'll
need to click on it right here to copy
the endpoint. And then you'll have to
use what you copied over right here as
the apprite endpoint. Since I'm in
Frankfurt region, for me it's FRA.
Alongside that, we can head back over to
O, head over into settings and look for
Google. We have already added our app ID
and secret before, but I think I forgot
to enable it. So, click enable. Recheck
your app ID and app secret over from
Google. on Google. You can also head
over to the client you created and
remove the authorized JavaScript origin
for 5173 localhost. It's not needed
since we have this apprite redirect. And
once again, just copy the URI from
apprite and paste it over right here to
make sure that you have the same exact
one. As of recently, I think they're
also adding the region at the start.
Once you do that, click save and also
head over into your branding and make
sure your app is published. If your app
is not published, somewhere on this
page, you should see a publish button.
So once you do that, you'll be able to
upload the logo of your application to
further customize how your
authentication behaves. So if everything
is looking good on the Google side,
click update right here on apprite to
confirm our setup. Just like that,
Google authentication has been enabled.
So you can head over to our application
and click sign in with Google. And just
like that, Google authentication has
been implemented. In case you want to
further customize your workflow, you can
do that by implementing your app domain
and your app logo so it shows up on
Google so that people know what app
they're signing into. But with that
said, I'll just sign in. If you do that,
you can notice that we'll be redirected
to localhost 5173. And now, if you try
to be sneaky and manually navigate over
to the dashboard to be able to see what
admins are seeing, check this out.
you'll automatically be redirected to
the public facing homepage, which right
now is completely blank. And if you
navigate over to sign in, you should be
redirected back to the homepage as
you're already signed in. But it looks
like that redirect is now working. So if
you head back to your sign-in page, it
looks like we need to reverse this
operation. If there is a user already
logged in, then redirect to homepage.
So, if you save this and now head over
to sign in, you can notice that since
we're logged in, we can no longer see
the login page. Perfect. But now, hey,
how do we actually continue developing
the rest of our dashboard finally that
we're logged in since we are now being
redirected? Well, let's give ourselves
admin permissions. Head over to your
app, right databases, travel dashboard,
users, and notice this one single user
right here. If you look at its data,
you'll see my name, email, and and
account ID. The image URL as well,
joined ad. And then at the end, there's
a status. It's either a user or an
admin. So, I'll switch it over to admin,
save it, and head back over to localhost
5173 and navigate over to dashboard. If
you do that, you can notice that now we
can see the dashboard, and we're no
longer getting redirected. Perfect. This
means that the entire signin and account
creation process are working properly.
Let's also hook up the logout
functionality so we can test the full
circle of logging out and then
authenticating one more time. To do
that, we can head over into our nav
items component. And right at the top of
it, we can try to access the user data
to replace this dummy user. I can do
that by saying const user is equal to
use loader data. And this is coming
directly from React router. So this is a
new functionality. But wait, how does
this use loader data know exactly what
data to fetch from where and why did I
set it to be equal to the user? Well,
let me show you. The use loader data
gets the data from the loader function
of the nearest route. Now, the nav items
component itself is not necessarily a
route, but it is used within our admin
layout. So if you head over to the admin
layout, you'll see that here we have a
client loader function that returns only
one thing. What is that? The existing
user. So that's why we know that we can
fetch that user right here. Pretty cool,
right? Alongside the user, we can also
get access to the navigate functionality
coming from the use navigate hook also
provided to us by the courtesy of react
router which now is working much more
similarly to Nex.js which of course I
embrace. And then here we can handle the
logout
functionality. It'll be equal to an
asynchronous function where we want to
await the call to the logout user
function coming from apprite off. And
then after that we simply want to
navigate over to forward slash sign in.
Now let's also render the real user
information. So right here we have the
username and user email. I think it's
already done, right? Because we're now
fetching it from the real user instead
of the fake user data object that we had
before. The only thing we have to do is
on click instead of this console log, we
want to call the real handle logout. So
if I now save this, head back over into
the dashboard, we'll see that we now
have a real Adrian name right here with
the real email, but the photo is
missing. So to fix it, I Googled Google
profile photo not loading in Vit React
development. So just trying to see what
would be the reason that even though we
have the access to the actual URL of the
photo and I know we have it because I
console logged what was coming back from
that photo. If I then head over into it,
you'll see that it's actually publicly
accessible online but for some reason it
wasn't showing within our application.
So I Googled that and then if you head
over to the response it'll say that by
adding refer policy of no refer to the
image tag you can solve the Google image
not showing. So just add the referral
policy of no refer to this image where
we're rendering the image
URL. If you do that and go back to your
local host, you should now be able to
see this image right here. Perfect. So
finally let's test out the logout
functionality.
If I click it, I get redirected back to
signin. Now I'll head over to the
dashboard manually. And you can see that
I can't see it. I immediately get
redirected to the signin. Can I maybe go
to the local host just the root route?
Well, yes, because currently there's
nothing on there. Later on we'll
implement the redirect from there too.
But now if I go ahead and sign in. Okay,
now we got redirected to the homepage.
Later on, we'll implement a great
public-f facing website right here. But
for now, let's head back over to our
admin dashboard since we have the full
privileges to it. And one thing that I
noticed is that right here, even though
it says your name, it's not the same
name that we have here. It's still using
the one from constants. So to fix this,
we'll have to use the React router
pre-fetching one last time for now. So
would you know how to do it based on how
we implemented it previously? If not,
I'll show you how to do it one more
time. First, we have this additional
function that we create. Export async
function client loader within it. It
allows you to prefetch some data you
need on that page. The only thing we
need is the user. So, I'll say const
user is equal to await get user like
this. And this get user is coming from
apprite o. So make sure to import it
from there and then simply return it. Or
in an even simpler way, you can just say
return await get user. Or if you want to
be really cool, you can turn this over
into an ES6 arrow function by saying
export const client loader is equal to
an asynchronous arrow function with an
immediate return. So you can just skip
the return statement and the braces and
just say return await get user. And with
that you can turn this client loader
into a nice looking oneliner which
fetches the user. And now you can
retrieve it from within your page. Just
right here under params you get access
to the full loader data. And we also
need to assign a type to it. This type
will be provided to us by react router.
So I'll say router or rather route
component props. And we can import this
type. So saying import type route in
curly braces from dot slash plus types
slash dashboard. If you do that and
remove these curly braces because we
don't need them as we're not within an
object, you can see that now our
TypeScript knows that the loader data
will contain the data returned from the
loader or the client loader which in
this case is the user. So how do we now
accept that user? Well, the only thing
we have to say is const user is equal to
loader data. And we can even assign a
type to it by saying as user or null if
it maybe doesn't exist.
Now, it looks like TypeScript is still
complaining saying that this could be
unknown. But that's not really the case
because we know what we're going to get
back from the client loader. Oh, but it
looks like I forgot to add an export
statement right here. If you add it,
you'll see that it'll no longer complain
and it knows exactly that the username
is either a string or undefined.
Perfect. So, with this in mind, we are
good to test it all out. So if you head
over to your dashboard, you can see that
at the bottom left we have the username
and now it says welcome Adrianjs Mastery
right here at the top which means that
we're successfully gathering the user
data and we're successfully signed in.
So with that we have now implemented the
full circle of authentication everything
from the UI to functionality to log out
and also fetching the user data and
storing it within the database. So if
you head over to apprite you can already
see that we have this user that we
created but if you also head over to O
you'll see that we have created a user
over there as well. So not only have we
implemented the full authentication but
since we have the user in the database
here that means that now we're also
successfully creating documents within
our database collections. Which means
that we can also not only fetch them to
show the username on the left sidebar or
the dashboard, but rather we can render
a full table showing all the users that
have joined their application so far and
display their statuses. They can either
be users or admins. So in the next
lesson, let's focus on implementing the
users
table. Just before we go ahead and set
up our user stable, what do you say that
we make our app enterprise ready? Or
maybe should I say enterprise secure
using Sentry? See, Sentry is the
application monitoring software that's
considered not bad by 4 million
developers. And it'll allow us to track
all sorts of different errors when you
actually bring your app to production.
Since I've partnered with Sentry, they
decided to give you 50,000 errors to
test out. And trust me, that's more than
you'll need. So, I'll leave this special
link down below. So, feel free to create
your account. And then you'll need to
create a new React project like what
we've done at the start. Once you're
there, don't follow this setup right
here where it asks you to install Centry
React. In the docs, I found a special
guide for the React router framework V7
for building full stack web apps with
React. I'll leave the link to it within
the video kit. So, let's go ahead and
follow it together. You need a Sentry
account, check. A Sentry project, check.
And an application up and running,
check, as well. Let's choose what we
want to use Sentry for. I'll turn
everything on from air monitoring to
tracing session replays and profiling.
And I'll copy the command given to me.
Then head over within your terminal and
paste the installation command. This
will take a couple of seconds and it'll
get installed. Next, we can run react
router reveal, which will reveal some
files that'll allow us to set up Sentry.
So, I'll just run that command. And now
you can see two new files created for
you right here within the app. Entry
client and entry server. Next, let's do
the client side setup. The only thing
you have to do is just copy this file
from the docs. I believe Sentry has
already taken the DSN, the ids and the
pro and everything regarding your
projects directly from your application.
If not, make sure that it did that by
making sure that you have some ids or
links right here at top. Then copy it
and override the client DSX with this
new one that you just copied here. We
enabled the replay integration as well
as the browser tracing integration. Now,
we'll need to update our root.tsx tsx to
report any unhandled errors from our
error boundary. So copy the import
statement and paste it right at the top
of your
route and then also add this century
capture exception within the else of our
error boundary. That'll be right here at
the bottom error boundary. And here we
have the else if. So alongside just
reporting it, we want to allow Sentry to
capture it. Now let's scroll down and
let's do the server side setup by
copying this instrument server mjs file.
So let's go ahead and create it within
the root of our application. I'll call
it
instrument.server.mjs and simply paste
the one that you just copied. Scroll
down and then we'll have to update our
entry.server.tsx. So head over into it.
That's going to be entry server.tsx tsx
for this file. We'll have to copy the
import. I'll paste it at the top. Then
you'll have to take this handle request.
But you can notice that it already
exists within our codebase. So what we
can do is just we can wrap the current
handle request. That'll look something
like this at the bottom of the screen.
We can just say export default handle
request. And then we can wrap it within
sentry.
sentry handle
request like this. And now you can find
where we're exporting the handle request
in the first place and just remove it
rather just make it a regular function
that we're then wrapping with sentry
handle request and exporting at the
end. And then also copy this handle
error part right here and paste it right
above it. You can import the handle
error function coming right at the top
from React Router. And the only thing
that bothers me right here is that it
says that sentry handle request has been
deprecated. But thankfully, if you
scroll just a bit down, you'll see that
if you need to customize your handle
request, you can just get this wrap
sentry handle request, provide this pipe
within it, and then finally export it
like this. So, let's just enable this
distributed tracing between the client
and the server by adding it below this
resolve. So, I'll head right here, find
the resolve, and add it right below. So,
you can see we have the same thing here,
but now we're wrapping it with this get
metatag transformer coming from Sentry.
And then also at the bottom, we're not
going to use Sentry handle request.
We're going to use the wrap sentry
handle request. Perfect. Docs are on
point. so far. So, let's continue with
the updated scripts because React Router
is running in ESM mode and we need to
use the import command line options to
load our serverside instrumentation
before the application starts. So, we'll
have to update the start and dev scripts
to include that instrumentation file.
I'll copy this dev and start commands
and head over to package JSON and update
the dev and
start. Perfect. And then we can set up
the source maps upload by updating our V
config. So you can notice that Sentry
automatically prepopulated the
organization in the project for me. In
case you have multiple, you can select
one right here. And then make sure to
generate the O token as well. I mean the
fact that you can do this from the docs
directly is super cool. Now copy this
sentry config. Head over to
vit.config.ts and add it right at the
top. Make sure to import this type from
sentry options. And now we can define
this config. So let me just copy this
entire config part and paste it below
our current one. You'll notice that we
have two. Now we're going to keep the
one from Sentry, but make sure to add
Tailwind CSS to it as the first plugin
and add TSC config pads right here as
the second plugin as well. Then we have
the React router and the Sentry React
router. And then make sure to add the
SSR right below the plugins or in this
case below the Sentry config. If you do
this, you can delete the current config.
And notice what's happening here. We're
actually exposing the default config and
then passing it over into the Sentry
React router config alongside the Sentry
config. Make sure to import all of these
from
Sentry and make sure that you have your
O token right here alongside your
project and organization information. If
you did that correctly, you'll want to
include the Sentry on build end hook in
React Router config. Head over to the
React router config. Copy this entire
build end part as we don't have it and
paste it after the SSR and import sentry
on build end. Perfect. And that's it.
Everything has been set up. I got to
give props to Sentry for creating such a
wellstructured documentation page. I
mean, I was just able to go through it
and everything worked just seamlessly.
Even though React Router V7 is a super
new framework, they knew exactly what
they were doing. Sentry showed me how we
can expose the entry server and client
files. So we can change the
configurations and they only added the
minor changes to all of these files. The
minimum for what's required for sentry
to work. So with that in mind, the only
thing left for us to do is to verify.
This snippet of code will include an
intentional error so that we can test
that everything is working as soon as we
set it up. So throw an error in loader
to verify that sentry is working. After
opening this route in your browser, you
should see two errors. One capture from
the server and one capture from the
client. So instead of copying this
entire file, we can copy this error
right here. Throw a new error thrown
from a loader. Close all the currently
open files and head over into our
dashboard. That'll be right here within
app routes admin dashboard. And we'll
have to add our loader. So, you know
what? I'll just copy the entire loader,
paste it right here, and save it. Now,
if you go back to the browser and reload
the page, you'll be able to see, oops,
some error thrown in loader. Believe it
or not, this is exactly what we wanted
to see. So, if you head back over to
your Sentry dashboard and reload the
page, you'll be able to see your error
dashboard and you can see that this
index increased and that has been one
error right here. So, at the top right,
click view all issues. And there we have
it. A minute ago, a new error was thrown
in a loader. And I mean, just take a
look at the amount of information that
we're getting back right here. We can
see when the error has happened. We can
see how many users has it happened to on
how many occasions. We can mark it as
resolved or archived. And we even have a
replay attached to it. So you can see
exactly what the user was seeing before
the error happened. In this case, it
happened as soon as the dashboard
loaded. But how do we know that it was
actually on the dashboard? Well, believe
it or not, here you have the breadcrumbs
of everything that led to that event.
You can see that the user was trying to
load the dashboard data and then there
was an error in the loader. This
actually tells us a bit more about how
React Router V7 works. Why? Because we
didn't manually make a request to the
dashboard. URL, but it looks like when
you try to access the dashboard page and
you have a loader attached to it, it
actually tries to fetch the data for
that page first and then we weren't even
able to get to the dashboard page. So
having all of this information is super
useful. Not really right now while we're
in development, but in production. Why?
Well, because your users will not be
able to tell you this, right? You're
going to ask them, "Hey, where are you
experiencing this error? Why did it
happen? Which device you're using?" They
will have no clue, right? But here, you
can just check it out. the user was
trying to access the dashboard page and
then immediately after we got an error
in the loader. You can see when the
error happened. Oh, and as I was
explaining this to you, looks like I got
this little tool tip that's going to
explain it to me too. So, we can go
through it together. So, you can see
this error in aggregate across all the
different users as well, so you know
whether it's one that you should fix
very soon or the one that can wait. You
can also narrow your focus on when this
error has happened. You can explore the
details of the error like the context
around which it happened which is the IP
address, the browser, the operating
system, everything that Sentry has
access to, they'll share it right here.
Then you can compare different examples
of errors. Take action on it by marking
it as a priority or not a priority one
or maybe assigning it to the team member
that you don't really like as you don't
want to fix that error. And finally, you
can share the updates or maybe even
track it on GitHub or Jira. But with
that said, let's remove this error from
the loader. And let's also try to throw
one not from the loader but from the
client component itself. So this will
disallow us to see the dashboard in the
first place. And I'll say some error
thrown in a
dashboard. You'll see the second error
appear. This is a client side error now.
So if you head back to the issues,
you'll see that we have another error
thrown within a dashboard. And for this
one, of course, you'll get different
kinds of information because it's coming
from a different context. Overall,
Sentry is just the go-to tool for
tracking and monitoring errors in
production. And you can also check out
traces, which allows you to see exactly
how that specific error has happened by
checking out the descriptions of what
was happening before it. There's
profiles that you can implement to find
slow code. There's replays that allow
you to see exactly what was happening on
the screen before the error happened.
And you'll also just get a lot of
quality insights like the first
contentful paint, your web vitals, and
more. You can check it all out in the
onboarding. So with that in mind, let's
remove this error from here as we don't
want to break our
application. And if you head back over
here, it's like nothing ever happened.
But now we have an enterprise ready
error tracking monitoring system put in
place. So once we actually deploy this
application, if something happens to it
in production, we'll know exactly what
happened and to how many users it
happened so we can act on it
quickly. To get started working on the
all users page, first navigate over to
it and then open it up right here within
our codebase. We have already added it
to the routes. So, if you check it right
here, you can see that you can access it
by going over to all dash users, which
is exactly where we're on right now. And
here, we'll use Syncfusion's grid
component. They have this very nice
guide that shows you how you can install
it and set it up. But basically, what
you have to do is use the grid
component, pass the data source to it,
and then render a couple of different
columns for the different fields that
you want each one of your rows to have.
So let me show you how we can make it
work. First things first, I'll change
the class name right here from dashboard
to all- users. And then instead of trips
page, I will say manage users. And we
can change the description to something
like filter, sort, and access
detailed user
profiles. Perfect. Right below the
header, I'll render the Syncfusion grid
component. This grid component will be
coming from right here at the top. Add
Syncfusion
SLJ2 React grids. Tables are not easy to
work with. So, let me show you what we
can do with this grid. First things
first, you have to pass a data source to
it. So, let's say data source is equal
to. And now what you need to do is just
basically pass an array of different
objects into it. But instead of
declaring it right here, for the time
being, we can use the static data coming
from our constants. So I'll simply say
users and we'll import those users
coming from constants index.js. It is
basically just an array of three
different users that I want to render
right here on the page. And then once we
render them, we can switch it over to
use real data. And there we go. Already
just by doing that you can see a table.
Of course, tables are better viewed on
desktop devices. So if you check it out,
it's pretty cool, right? You get the ID,
the name, email, image URL, they joined,
itinerary created, and a status of
either user or an admin. Now I'll
collapse this just a tiny bit so we can
see the code, but also the rest of the
stuff. As you can see, it is mobile
responsive, but we can definitely make
it so much better. So within it, I will
render a columns directive, but make
sure that you spell it columns plural
and use the one coming from React grids.
Next, right within it, you can render
each individual column directive. So
import that one, too. And then
self-close it. Within it, you can
specify exactly what you want each field
to have and how you want it to look
like. So I'll give this field a name
equal to name. I'll give it a header
text equal to name with a capital N.
I'll give it a width of about 200. And
I'll even align the text on the left by
saying text align is equal to left. And
the second one will be just a column
directive, not columns, but rather a
column. So you'll also have to import it
right here at the top. And you can see
now that we have decided to manually
decide how we want to present all of
these different columns and rows. Now we
only have one column with names John,
Jane, and John. What you can do is also
say grid lines and set it to none. That
way it looks a bit cleaner. You do this
to the regular grid component. Now what
else can we do with each one of these
fields? Well, we can also define a
template that allows us to choose
exactly how each one of these will be
rendered. So for the template I will
open up a callback function inside of
which we get access to the props which
will be of a type user data because
we're mapping over the users. So for
each one of these props, we want to
automatically return a div. And each one
of the divs will have a class name equal
to flex items center, gap of 1.5, and a
padding x of four. And within it, we
want to display an image. So instead of
simply displaying a name, we want to
render an image with a source of props.
image URL with an al tag of user, a
class name equal to
rounded- full size of 8, and an aspect
of square. If you do this and reload,
you should be able to see a profile
photo for each one of our fake users.
And below the profile photo, you can
render a span element that'll render the
props.name. Perfect. This is already
better than what we had at the start. It
really shows how customizable it is.
Now, let's also declare another column
directive right below. The future ones
will be even simpler. They'll have a
field. This one will be for the email so
that it knows how to match the data.
See, this value right here matches
exactly the value of the key in that
specific object in the array. So the
first one was the name and now we want
to show email addresses. So the field is
email. The header text will be set to
email. The width can be maybe set to
150. And text align can be set to left.
And you put this column directive
properly within the columns, not outside
of it. You should be able to see it
appear right here immediately. What we
can do next is just copy that column
directive and maybe duplicate it two
more times. For the third field, I will
render the date joined and change the
header text to date joined with a width
of maybe 120 will be enough. So now we
see January as well. And maybe the next
one can be trip created or I think in
this case it's itinerary created. We can
again say itinerary or maybe trip is
shorter created and this will be when
the trip was created. So about 130
characters is enough. So if I save it
now you can also see trip created but I
need to spell it properly exactly as to
how we have it in the user data. So if I
head over into users it is itinerary
created. How many of them have we
created? So this user has created 10
four and eight. And finally and most
importantly, we need to show the status
or the type of the user. So I will
duplicate this column directive one more
time right below. And I'll call the
field status a header text of maybe here
we can say type of the user width of
about 100. And for the template, we can
once again get access to the props of
the user data. And then for each one, we
can return an article that we're going
to close. And within it, we can render a
div. Within the div, we can render an
H3 that will render the props.
So here you can see that now if you
reload you can see the type of either
the user or the admin. But let's also
style this a bit differently to make it
like a chip component within it. First,
I'll style the article by giving it a
class name equal to and I'll make it a
dynamic CN class name that'll always
have a status column class. But then
depending on the props
status, which I can just dstructure from
the props right here. So I'll simply get
the status out of it so we don't have to
repeat ourselves too much. If the status
is triple equal to user in that case
we'll return the BG success of 50 else
we'll return the BG light of 300. So if
you save that you should be able to see
a light background on each one of these
articles. Now right below within this
div I'll also give it a class name. I'll
also make it a CN. It'll have a size of
1.5 and rounded dash
full and if the status is triple equal
to user I will then give it a bg success
of 500. Else we can give it a bg gray of
500. So if you save that you'll now see
that little dot that we have right here.
And now we can style this H3 within it
by giving it a class name of CN font-
enter text dash extra small and font-
medium and finally if a status is triple
equal to user in that case text success
of 700 else text-g gray of
500. So let me style this properly. And
if I go ahead and save this, you can see
that now the text matches the color. But
it doesn't yet look good. And that's
because this div should not close the
H3. Rather, the div should be a
self-closing component as it is just a
dot that appears right here before the
user. So you can see how customizable
the table is. You can show the photo
within it. You can change how much space
each one of these fields takes. And you
can also change whatever is presented
right within each one of these rows.
Perfect. And believe it or not, that is
it. A fully functional table where you
can actually hover over fields and
implementing filtering or sorting and
pagionation within it is also super
simple. I'll show you how we can do that
once we actually get more users. But for
now, I actually want to load up the real
users right here, not these fake ones.
So what we can do is head over into
apprite
o.ds and create a new function called
get all users. We can do it right at the
bottom. The goal of this function is to
fetch all of the user. So let's export a
new async function called get all users
and make it equal to an asynchronous
function like this. So export const get
all users is equal to an async error
function. And we can open up a try and
catch
block. In the catch I will simply
console log the error saying error
fetching
users. And in the try we need to list
the documents coming from the database.
So I'll say
const dstructure something and make it
equal to an await call to database
coming from apprite dot list documents.
As before we have to tell apprite from
which database ID to get it and that
database ID is stored in the appread
config database ID. Then we have to
specify from which collection. So I'll
say
appreconfig. This time it'll be a user
collection ID. And finally, we need to
provide a query to fetch this. In this
query, I want to limit the amount of
users that we get back by a specific
number. Let's say five for now. And then
to implement the pagionation, I also
want to offset the query by a specific
number. Let's say two. Essentially with
the limit and the offset, you are
implementing the pagionation. Why?
Because if the limit is 10 and you're
offsetting five, you're basically
dividing this into two pages. One that
has five and page two that has the other
five. Hopefully this makes sense. So to
make this pagionation dynamic as the
params into this function, we can accept
a limit of a type number as well as the
offset of a type number two. So instead
of hard coding them, we can just declare
them right here. limit and offset. Now
the call of this function will give us
back the documents and these documents
we can rename to user because that's
what they are and we also get back the
total number of documents. What we can
say is if total is triple equal to zero
we can just return users equal to an
empty array and total equal to the total
which in this case will be equal to
zero. But in case we do get some users,
we can then return the users equal to
users as well as the total equal to the
total we're getting. Hopefully this
makes sense. So now the only thing we
have to do is call this function within
the all users
table right here at the top. Instead of
declaring it right here, we'll use the
React router new functionality to fetch
it before the page loads by implementing
a loader. So above the function I'll say
export async function loader or you can
use ES6 to say export const loader is
equal to an async function. And here we
can get access to those users and the
total number of users by awaiting the
get all users coming from apprite o and
let's say we want to limit it to 10 and
offset by zero at the start because
we're in the first page. Once you do
that we can just return an array of
users as well as the total number.
Basically what we have done is we have
exposed it right here to within our
function.
So let's dstructure the loader data of a
type route coming from react router
types and this is going to be coming
from all users dot component props and
then we can just say const users and
dstructure them from the loader data.
Here we have a bit of a warning saying
that users does not exist on type get
all users. Let's see if we're properly
returning it. we are here but we also
can return it in the catch. So if
something goes wrong we can return the
users as an empty array and the total
also equal to zero. If we do this then
it'll know that always there's going to
be a return of users and
total. Also let's fix this route import
because I can see that it's coming from
the wrong file. Basically it should be
coming from just dot slash plus types
forward slash in this case we can get it
from all users and we have to specify
that we're importing a type of
route. Perfect. So now we're getting the
users and you can immediately see that
instead of having the fake users coming
from the constants which we can now
completely remove now we're getting a
single user from a real database. There
are a couple of things we have to fix
though. The name and the profile photo
are looking good. We can give some more
space to the email address. So, let's
scroll down to the email address and
maybe give it a width of 200. That'll
give it some more space to breathe.
After that, we have the date joined. So,
I'll just rename this to join at because
I believe that's we're saving it into
the database. And you can see that now
we're getting that they joined. And we
also need to parse it a bit better. Do
you know how to do that? Well, you need
to create a template for how you will
render it. So just create a template
have a callback function where you get
the props in this case the joint ad
date. So I'll just dstructured join ad
from it. And then we can just return
what you want to show. In this case,
I'll call the format date function
coming from lib utils and then I'll pass
this joint ad right into it. If you do
that, you'll see April 23rd, 20. Let's
also give it some more space to breathe
just so we can see it a bit better.
April 23rd, 2025. Beautiful. Did you see
how simple that was? We can also say
that joint ad is of a type string.
Perfect. So I was just able to take this
piece of data from the database, take
its field and then nicely present it
right here. I don't think we'll need the
trips created thing. So I will just
remove it from now because we're not
actually storing it within the database.
But what we care about is of course the
type of the user which in this case is
the admin. So with that in mind, we now
have our first and only user and we have
a table with which we can check it out.
We can head over to the dashboard and
check out our only user. Looks pretty
cool, right? What do you say that we go
ahead and sign in as the second user as
well to see the differences? I'll log
out, we have this great looking sign-in
page and I'll log in with my second
JavaScript mastery email address. And
now if I try to head over to the
dashboard, you'll see that I'll be
redirected back to the homepage. So
later on when we implement the public
facing website, I'll be able to check it
out. But right now, as I'm a mere public
user, I cannot see the admin dashboard,
which is its whole point. So, open up
inspect element and head over to
application and clear your cookies
session storage as well. And once you
clear it, just reload your page or just
manually head over to the sign-in. I've
logged back in with my admin user. So,
if I head over to all users, you'll be
able to see this second account that
says JavaScript mastery. I can see that
the image is not loading properly, but I
think we know how to fix that, right? We
have to head over to where we're
rendering that image. And we have to
give it a refer policy of no refer. If I
save it and reload, you can now see that
we have two of the same profile photos.
For you, it should be something
different if you used a different
profile. But what matters most is that
the type of these two users is actually
different and the email address as well.
And they're both showing on our table
where we can manage the users. So that
means that our all users table has now
been completed. So now that we have the
basic dashboard, the authentication
system, and our users are actually
logged in, it's the time that we
actually create the trips. That's what
this app is all about, right? So, let's
focus on creating the form that'll make
all of that
possible. And finally, we are ready to
create new AI trips. Well, you could say
that this is the moment that we've been
waiting for. We'll do that through the
help of a form. Everything starts with a
form, of course, but then we'll fuse it
with functionalities using AI
generation. But first, let's focus on
the basics. Everything starts with some
inputs. And as Shhatzen likes to say,
forms are tricky. They're one of the
most common things you'll build in a web
app, but also one of the most complex.
You have to structure them, and they
have to be semantically correct. They
have to be usable and navigable using
the keyboard. They have to have proper
area attributes to be accessible,
support both client and server
validation, and they should be
wellstyled and consistent with the rest
of the application. Thankfully, in this
case, I'll show you how to do enterprise
level forms using Syncfusion. So, with
that in mind, let's create a new route
that allow us to create trips that we'll
be able to navigate to by clicking this
AI trips button. Right now it points us
to a 404 that is available under
for/trips. So let's just create it.
Right here under app we have routes and
then under routes and admin I'll create
a new file and I'll call it create
trip.tsx. Within it I'll run
rafce. And then to be able to visit it
on the page I'll head over to
routes.ts. I will duplicate one of the
last routes within our admin dashboard
interface. I'll change the path to point
create trip and also the path to the
file also has to be a create trip path.
So if we do this, what we might want to
do is just change the route to maybe
trips/create. That will allow us to have
proper REST API routes where we're
following good naming conventions. On
this page, we'll be able to create the
trips, but just above it, I'll create
another table that'll allow us to see
all of the trips, including the table of
trips. So, I'll call it just trips, and
I'll point it to admin
trips.tsx. So, let me create that file
by heading over to right here under
admin, and I'll create a new file called
trips.tsx. I'll run rafce. And here
we'll be able to see all the trips. If
you now head over to your terminal, stop
it from running and then rerun it and
reload your page on trips, you should be
able to see it. So, one of the things
that we'll have on the trips page will
be a button that will allow us to head
over to the trips creation page. And
we'll actually do that through the help
of a header. We're already using the
header in the all users table. So, let's
just go ahead and copy this starting
main tag and the header from the all
users page. And let's just paste it
right here and properly close the main
tag. If you do this, of course, for now
it'll say manage users. But here we want
to say trips and we can give it a
description of something like view and
edit AI generated travel
plans. But here's the kicker. In this
case, we'll actually give some
additional functionalities to the header
by adding a call to action button to
actually generate a new trip. So, I'll
give it two new props. A CTA text equal
to create a trip and a CTA URL pointing
to the new route we created of forward
slashtrips slashcreate.
And then we can head over into that
header and accept those two new props
which are going to be optional. The CTA
text which is optional of a type string
and a CTA URL also optional of a type
string. And we can accept them as props
CTA text and CTA URL. And now we can
render them right below this article by
first checking if they exist. So CTA
text and CTA URL and only if those two
exist then we will render a link
component coming from React router
pointing to that CTA URL in this case
the new create trips route we
created and within it we can render a
button component coming from shot CN
that'll have a type equal to
button a class name equal to
button-class excl exclamation mark H11
because sometimes when we need to add
additional class names to Syncfusion
components, we need to denote them as
important. Same thing for the W full and
on medium devices W of 240 pixels. I
found that value works the best. Within
that button, we can render an image with
a source equal to assets icons
plus.svg with an al tag of plus and a
class name of size of five. This is a
very simple plus icon. And then on the
right side, we can also render a span
that'll simply render the CTA text. And
we can give it a class name equal to P16
semibold as well as
text-white. So if you add this, head
back over into trips and check whether
we have properly added the right CTA URL
like this, you should be able to see a
create a trip button, which on desktop
looks something like this. So now right
from the page where you can see all the
trips or at least you will be able to
see them soon you can also navigate over
to create a trip page which is exactly
what we wanted. So now we can start
implementing that create trip form.
Let's start off by wrapping everything
into a main tag to denote that this will
be a page with a class name of flex flex
dash call a gap of 10 padding bottom of
20 and a wrapper property. This will
give it some padding and nicely position
it on the screen within it. We can also
render another header. Yep, we really
want to reuse them as much as possible.
We'll give it a title of add a new trip
as well as a description of view and
edit AI generated travel
plans. And we can end the header right
there. Right below it, we can open up a
section within which our form will go.
So let's give it a class name and give
it a margin top of 2.5 to divide it from
the header as well as a wrapper MD. What
is this wrapper MD? Well, it is to
ensure that the form stays in the middle
of the screen and it doesn't extend
throughout the entirety of the
dashboard. See on web screens you have a
lot of space but sometimes you want to
use that space like for the table and in
other times you just want to be able to
see what you need to see and that is
nicely structured inputs that don't
necessarily need to extend from the left
to the right edge rather you need to
have them right in front of you so
heading back over within our section
right within it I will create a form
that'll have a class name equal to
trip-formm and on submit we can call a
handle submit function which I will
declare right above by saying const
handle sububmit is equal to an
asynchronous empty function at least for
now we'll add the logic very soon now if
you save this you should be able to see
a cardlook layout so within this form I
will now add a
div. And within that div, I'll add a
label that'll have an HTML 4 country.
Why country? Because the first thing you
got to figure out when you're planning a
trip is where you want to go to. So,
I'll basically add a label that'll say
country right here. And then below it,
we want to implement a component known
as a combo box. See, a combo box is like
a select element, but it also allows you
to start typing within it. Something
like this, where you can type and then
you can find results faster. Like
selects are pretty good if you have a
limited set of options like five, two,
or 10. But if you have more than 100 or
200 countries, well, you want to make
your life easier and start typing the
name of that function so you can more
easily find it. That's exactly what a
combo box component is for. And in my
early development career, I remember
creating those combo box components on
my own. And trust me, you don't want to
do that. It takes a lot of time. So,
we're going to make our life a bit
easier here and actually use good
programming practices, which is not to
reinvent the wheel. And we'll use a SHAT
CN combo box component, which you'll
have to import at the top. And then once
you import it coming from Syncfusion EJ2
React
dropdowns, you'll have to pass some
props to it to actually make it work.
First things first, you'll want to pass
in the ID. And this will be for
selecting a
country. Once you have the ID, you'll
also want to have a data source similar
to what we had with our table. This can
accept an array of maybe different
titles like country one, country two,
and so on. As you can see, it is super
intuitive that I didn't even have to
take a look at the docs and I
immediately understood how this
component works. I can start typing it
suggests me option and I can just select
one with my keyboard. But now we're
going to have more countries and we'll
want to display it in a bit of a better
way. Maybe something that looks a bit
like this, right? So to achieve that
we'll have to have a list of different
countries that we can fetch. Thankfully
there is a simple endpoint called
restcountries.com
v3.1/all. And if you just head over to
that URL it'll give you a JSON formatted
list of all of the countries in the
world which is exactly what we need. So,
what do you say that at the top of this
page, we make a simple fetch request to
fetch those countries? To do that, I'll
actually use React Router's loading
functionality by saying export const
loader is equal to an async function
within which we can get access to a
response by calling that API. So I'll
say await fetch and I'll make a call to
https col/
slashrestcountries.com/v3.1/all. Then we
want to get the data by awaiting the
response JSON as you typically do with
fetch requests. And then what do you say
that we simply console log them. So I'll
console log the data we're getting back.
I'll head over into our application and
I will just open up the
console and reload the page. And if you
do that, you'll get an error. That's
because we're not returning anything
from this loader. So let's actually just
return this data. And if you do that and
reload, we will be good. So instead of
console logging it here, where we
actually need that data is down below.
So let's just put that console log here.
And we can actually dstructure the
loader data which is of a type route dot
component props. And this route has to
be imported right at the top by saying
import type in curly braces route from
dot slash plus types forward
slashcre. So it knows exactly what we
have within it. And we can dstructure
the countries from the loader data. So
I'll say const count countries is equal
to loader data as country
array. Perfect. So now we know that this
is an array of one of the countries and
later on we'll return the name
coordinates value and the open street
map view. So let's just console log the
countries and reload the page.
If you do that and inspect the element,
you'll be able to see that we get back
an object of a ton of different
countries, each having a name and a ton
of other details. But we don't need
those details for every single one of
them. So instead of returning the full
data, let's actually map through it and
only return some pieces of the data. So
I'll say return data.m map where we get
each individual country of a type any.
And for each one we want to
automatically return an object. You do
an automatic return by wrapping this
first in parenthesis and then returning
an object. And we want to take the name.
We'll make sure that the name is equal
to
country.fl country.name.com.
We'll take in the coordinates which will
be equal to
country.latt LNG latitude and longitude.
The value will be equal to
country.name.com. And I'll also take in
the open street map which will be equal
to
country.maps question
mark. Street map. So now we're returning
only the data that we'll actually use
and we have it right here within our
application. So you already know how
Syncfusion works magically when you have
a data source. The only thing you have
to do is actually provide that data
source right here within this combo box
component. If you do that and reload the
page, you'll see that we have a list of
a lot of something. That something will
hopefully turn into a lot of countries
soon. But for now, it is just a list of
emptiness. So let's go ahead and modify
this combo box component to actually
show the right fields. So I'll say
fields is equal to an object where text
will be text and value will be
value with a placeholder of select a
country and a class name equal to combo
box. If we save this, you can see the
placeholder but still no countries.
That's because we have to take this data
and we have to modify it a bit. So what
I'll do is right here where we have the
countries, I'll create those countries
in a way that we need it. So I'll say
const country data is equal to
countries.m map where we get each
individual country and for each one we
can automatically return an object where
we take only the text of country.name
name and the value of country dot value
and these values will then match the
ones that we are referring to right here
text and the value. So let's just say
countries is equal to country data. You
can see that the format matches and we
immediately get both the flag as well as
the text. Are you wondering how are we
getting the flag as well? Well, that's
because each one of these flags is
basically an emoji, like a set of
characters. So, you don't necessarily
need to render an image to be able to
see it. And with that said, we have this
greatl looking combo box. Well, not that
great looking as of now, but it will
make it better looking. But hey, you can
try to start typing something and it
won't yet update. We'll also work on
that very, very soon. So, what we can do
is fix the class name right here, which
will automatically make it look so much
better. Let me just reload the page
right here. Check this out. So, now I
can go here and I can select one of the
countries. And we'll also have to keep
track of the selected value. So, I'll
have to add a change
property where we'll take a look at the
event which has a value which is either
of a type string or undefined. And then
within it we want to check if a value
exists and if so we'll call the handle
change function and to it we'll change
the field of country to the value that
was selected. This is a function that we
haven't yet created. So let's just
create it right
above here where we have the handle
submit. I'll also add the const handle
change and it'll be a function that
takes in the field and the value. So
right here I can already type that it'll
take the key which will be a key
of trip form data and a value which will
be either a string or a number and then
we can do something with those values
within the function but more on that
soon. What we want to focus on right now
now that we have the change is also to
turn on the allow filtering. It is a
very simple boolean prop. But once you
enable it, you can head over here and
you think you'll be able to start typing
but not yet. That's because we have to
define what property will we filter by.
So I'll turn on the filtering and here
we get access to the type event and
we'll try to get access to the query
that the user has typed. So query is
equal to
e.ext dot to
lowercase so we can actually not mind
the case. Then we want to call the e
update
data and we want to take the list of
countries that we have and filter
them by getting each country and we'll
filter it by name. So we're going to
check whether the
countryname tool
lowercase
includes the query that has been typed.
Once we get that list of countries,
we'll map over them by saying dot
country. And then once again, for each
one of these countries, let's do it
properly. For each one of these
countries, we will automatically return.
So once again, make sure that you have a
parenthesy right here. Will
automatically return a
text of
country.name as well as a value of
country.
So if you do this properly then you'll
be able to start typing and you'll
immediately be getting all the countries
matching that search term. So let's go
for United States. There we go. We can
also immediately search or for India.
All of it works. Wonderful. So that's
it. That's how you very easily create
your very own combo box and make it
fully functional. So, what other
information do you think is important
when deciding where you want to go for a
trip? The country where you want to go
to and the location surely matters a
lot, right? But what else can we do?
Well, let's head below this div that is
wrapping our combo box. And below it,
I'll create another div within which
I'll have a label and it'll have an HTML
4 for the following input and this one
will be about the duration of your trip.
So I'll say duration and below it I'll
render a regular HTML 5 input with an ID
of duration a name of
duration a placeholder equal to
enter a number of
days for example 5 12 and so
on and we can also give it a class name
of form input and we'll also change the
placeholder color to gray 100. If you do
this, you'll be able to see a duration
input so people can enter a specific
number of
days. And we can also give it an
onchange. So I'll say
whenever something changes here, take
that key press event, call the handle
change
function that requires a key. In this
case, we're changing the duration as
well as the value. But before we pass
the value, I'll convert it over into a
number. So number constructor and then
e.target value so we can actually work
with it. Because I don't know if you
knew, but every single input, no matter
if you make it like a type of a number
input, it'll still take in the values in
form of a string like the URL bar. So
you have to convert it back into a
number. Great. So now we have the
duration as well. What else do we need?
Well, we'll need a couple of different
select elements that allow us to choose
the type of our travel. Are we traveling
with a group? Maybe solo, maybe as a
couple. Then we have to choose our
travel style, our interests, and finally
a budget estimate. Select elements are
super useful because you're nudging your
user in the right direction. You can
propose a couple of different options
that a user can choose. For example,
travel style can be luxurious or maybe
adventurous. Maybe budget can be low, it
can be high. You can tell your user what
you need to hear. And we're collecting
all of this information in order to make
the best trip possible for them. So, now
that we have this second div, which
holds the duration, we can focus on
mapping on all of these individual
select items. Below the div, I will map
over our select items coming from
constants. See right here, I created an
array that has these couple of inputs.
Group type, travel style, interest, and
budget. And we'll actually map over
them. So, we don't have to create each
one of these one by one. So, I'll just
take the key and I will automatically
return a div for each one of these. This
div will have a key since we're mapping
over it. And the key will be equal to
key. Within it, we will render the
label. And this label will be an HTML
for the key, right? Because we're going
to have different properties. So this is
a little lesson on how you can map over
the elements so that you don't have to
repeat yourself. Whenever you map over
something, you have to ask yourself what
is consistent across all of these
different things. We always have a div.
We always have a label, right? So these
will be there, but the contents of it
are going to change. So within it, we'll
render the key. So now if you do this
and go back, you'll see that now four
different labels will appear, each with
its own key. I'll call a function called
format key and to it I'll pass the key.
What this will do is that it'll actually
capitalize some of the letters. So what
we're doing here is that we're taking
the first letter of every word and then
we are uppercasing it. Another little
function that AI could very easily
create, but AI can't create entire
experiences and ideas such as this
application that we're creating that
allows agencies to generate trips for
themselves. Trust me, developers will
not be replaced because imagine an
agency owner wanting to create this
great software for themselves. They can
take Vzero Open AI and chat with it for
days, but as soon as they need to code
something, they will experience bugs. So
being able to chat with AI is not
enough. You have to know how to engineer
things and think of ideas. Perfect. So
now that we have this label, let's also
create a new combo box component right
below. And as a matter of fact, this
combo box component will be very similar
to the one created above. But you know
what? Let's actually create all of its
props one more time so you learn how it
truly
works. First, we have the ID, which will
be the key. Then we take in the data
source, a very important part of the
combo box component. And here I'll say
combo box items. We'll take each key and
then we'll map over different items
within it. And for each one of these
items, I will automatically return a
modified object where the text is equal
to item and the value is equal to item
as well. So we want them to be the same.
So if I do this, you'll be able to see
that now we have solo, couple, family,
friends, business for the group type. We
have a travel style with a couple of
options, interests as well, and then
finally a budget. So, we could
technically select the fields still and
say that fields will be text of a type
text and value of a type value. Even
though in this case, I don't think it's
even necessary. We can have a
placeholder. We have to make it dynamic.
So, I'll say select key. That way, this
will say select travel style, select
interest, and so on. And actually we can
say select key but I'll wrap it with
format key so it looks a bit better so
that it's not lowercased. Select
interest, select budget, select travel
style and so on. And then we also need
to handle the change. This change will
be the same as in the previous select.
So, I'll copy this part where we're
changing. And I'll also copy this part
where we're filtering and choosing what
to filter by. So, let me copy these
parts right
here. Collapse this back again. And then
paste these additional props to it. But,
of course, we have to properly end it.
So, let's see what we have. We have the
change where we're taking in the value
and passing it over to the handle change
function. But this time we should not be
selecting a country to update. Rather we
will dynamically update the key with the
value. Okay. Next we head over into
allow filtering and then we will try to
filter it by the query. So, we're going
to run the eupdate data, but we're not
going to map over the countries. Rather,
we're going to map over the combo box
items under a specific key. We're going
to then filter over each one of these,
not countries, but
items. I will render the item to
lowercase and I'll check whether it
includes the query. If it does, I'll
then map over these items. And for each
item, I will return the item right here.
And then I'll return for the value item
as well because they are the same
thing. Perfect. Now I have to properly
close this. So let's count the closing
curly braces and parenthesis together. 1
2 3 4. Do we have more? We do. And we
also have to close this one and this
one. That's a lot of curly braces. And
also here we're not checking for the
item.name. Rather it'll just be item.
For countries we had names. For items we
have just the item itself. And by item I
mean each one of these values relax,
luxury, adventure or for the group type
couple, family, friends, business and so
on.
And at the end of the day, we can also
just give it a class name equal to combo
box. And this style or this class will
actually apply some paddings, borders,
lights. It'll round up the corners,
change the text to a bit of a darker
color, and it'll just make it fit the
rest of the UI a bit better. And you end
up with something that looks a bit like
this. A much more complete form.
Perfect. So now let me collapse this
part where we're mapping over these
select items. And by the way, if at the
end of this form something is not
working for you, it could be possible.
Following along with me while I'm typing
these very complicated ends of curly
braces might not be ideal. If you have a
typo, that's totally okay. It doesn't
mean that you don't understand
something. It just means that you made a
typo. So, for that reason, I will leave
the entire create trip.tsx page in the
video kit below. So, you can just copy
it over and make sure that your app
works. So, now that we have all of these
items, what do we do next? Well, believe
it or not, I want to display some kind
of a map. But in this application, we're
focusing on not a very specific
location, but rather the entire country.
Let's say you wanted to visit Croatia, a
country I'm from, and you wanted to find
out about the best places you want to
visit within that country. That's what
this app is made for. So, we don't need
to necessarily show a Google map, but
just show that country on the world map.
So, let's do that by heading over into
our app and below these select items, I
will render a div. Within that div, I
will render a label. And within that
label, we'll have an HTML 4 location.
And it'll simply say location on the
world map. And then within it, this
would be super hard to implement
otherwise, but now we can just use the
maps component coming from Syncfusion.
Within it, you can show a layers
directive. And within layers directive,
you can show a single layer directive to
which you can pass some additional props
that defines how you want that map to
look like. So let's actually head a bit
above and like we formatted the data for
the countries, we want to format those
countries for the map. So I'll say const
map data is equal to an array where we
have a country. We can take this from
form data country. So we want to figure
out which country was selected. But as
of now we don't yet have access to the
form data. This is a state that we have
to create. So right at the top I'll
create a new use state snippet and I'll
call it form data. Set form data equal
to the use state call where it'll be an
object of different values. First, let's
make sure to import use state from
React. And we can also define the type
of this state by saying that it'll be a
trip form data and it'll have properties
such as country. By default, we can
select countries zero question mark.name
or just an empty string if we cannot get
it. We can also set the travel style to
an empty string at the start. We can set
the interest to be equal to an empty
string at the start. Same thing for the
budget as well as the duration. And the
same thing for the group type. All of
them will be empty strings at the start.
Let's fix this typo right here. And
let's make sure that we actually have
access to the countries beforehand. So
this const countries coming from the
loader data should appear above where
we're setting the state. There we go. So
now we have this form data and in the
map data we're using the one from the
country that we have selected right here
in the first place. Alongside the
country itself, we can also choose a
color in which we'll color that country.
So I'll say hash E
A382 E. I found this color to look
pretty good. And then we can also choose
the coordinates of that country. So I'll
say
countries.find we want to find C that
specific country. And if that country's
name matches the one from the form. So
form data. country. In that case, we
want to take its coordinates or just an
empty array in case we cannot find it.
And that will form our map data. So now
we can take that map data and pass it
over as data source is equal to map
data. But a very important question is
how are we going to shape that data? So
for that reason, Syncfusion has prepared
a prop called shape data which gets the
set data for the maps to render. And
here I'll say world underscore map. I've
actually provided this for you right
here next to the constants. This
contains the list of the coordinates of
all of the countries in the world. So if
you pass it in and reload the page,
you'll be able to see the world. You can
also change the shape data path to
change it by the name of the country.
And we can change the shape
settings which will be a color value
path of color. And we can also provide a
fill color. So I'll say fill will be
equal to E5 E5 E5. So now if you save
it, you can see that everything will be
red. So if we leave it like this, it
looks like the entire world has been
selected. So we have to say shape data
path and I'll set it over to country.
But for the name, we'll actually say
shape property path. So now if you go
ahead and select a country like United
States, you would hope that it'll all
light up like a Christmas tree, but
that's not really the case. And that's
because even though the select fields
are here, they're not actually yet
storing the values within our state. So
what we have to do is we have to
implement this handle change function
which right now just takes in the data
but we have to set that data to the
state. So I'll say set form data. We
will actually modify the entire object
by spreading the previous form data in
order not to lose any of it. And then
the only thing we'll do is we'll
dynamically update a key only the key
that we're updating with the value that
we're trying to update it with. So, if
we do this, you'll notice that now we
should be able to change the value of
any kind of these fields and that it'll
automatically light up right here. Same
thing if we select United States. There
we go. It's pretty big. So, we can very
easily see it on mobile. But, of course,
where this shines is on desktop as you
can see it much better. As a matter of
fact, you can see even a such a small
country like Croatia, which is right
here in Europe. You can barely see it on
the world map. So now we have a fully
functional map that shows you where you
want to travel to. For extra points,
maybe you can take in the country you're
flying from and then create some kind of
a flying animation to point to the
countries you're going to. But with that
said, let's just head a bit below this
map component, which for now I will
collapse. And let's create a single
self-closing div that'll have a class
name of bg gray 200 hpx and w full. And
this will simply create one
line saying that we're at the end of the
form. Below it, if we have any errors,
we might want to display them. So what
do you say that we create a new use
state for the error right here at the
top? I'll do it right below the current
use state. So where we have the form
data, I'll create another use
state and I'll call it
error set error at the start equal to
null. And I'll also do another use state
called
loading set loading at the start equal
to false. And I'll also specify that the
error can be either of a type string or
a type null. So just because it starts
with a null doesn't mean that it cannot
get any other value. So the way that
type inference works with React or an
XJS is that if you pass the initial
value, the value of that variable will
automatically be loaded as the type of
that value like in this case the
boolean. So for null, it'll by default
be just null. But we know that later on
we want to switch it to string which is
why you have to manually specify which
type you want it to be. Perfect. So now
let's head back down and let's say if
there is an error we will render a new
div with a class name of error and
within it a p tag where we'll render
that specific error. Finally, below the
error, we can also render the footer of
this form component that'll have a class
name equal to padding x of 6 w full. And
within it, we can render a button
component coming from Syncfusion with a
type equal to submit. So, we wanted to
submit the form and I'll give it a class
name of button class exclamation mark
age of 12 and exclamation mark AW of
full. Also, if we're currently loading,
I'll set the state to disabled. That
way, the user will not be able to click
it multiple times. Finally, within the
button, I'll render an image with a
source equal to it'll make it dynamic
pointing to assets icons forward slash.
But then if we are loading, I'll render
the loader.s
SVG. Else I will render a magic star.
SVG. You'll soon see how that looks
like. a magic star, I think, has become
the official icon or the uh official
visual representation of AI generation.
So, if I save it, you'll be able to see
this button right below. And the image
is not really loading. That's because I
missed an S right here under icons. So,
now we can see those sparkles, the
stars. You see what I meant, right? And
below that image, I'll render a span
with a class name equal to P16 semibold
and text-white. And right within it,
I'll check if we're currently loading.
And if so, I'll say
generating dot dot dot. Else, I'll say
generate
trip. And we can save it. So now we have
that final submit button. So this was a
super long lesson. We have implemented
the front end of the form. But what have
we actually done? Well, let's try to
summarize everything by console logging
all of the values of the form that the
user has selected within the handle
submit function. Right here, I'll access
the event which will be the form click
event. So I'll say react dot
form specifically of a type HTML form
element. First things first, we want to
prevent the default behavior of the
browser by saying
event.prevent default. Oftentimes the
event is just abbreviated to E. And the
default behavior of the browser is to
reload the page, which we don't want.
Next, we want to start with the loading.
So I'll say set loading is true. And
then just before we console log those
values, we want to make sure that the
user has actually filled in all of the
necessary fields because we need them to
generate the trip. So I'll check if the
form data country or the form data dot
what do we have? travel style or the
form data interest or the form data
budget or the form data do group type.
If any of these don't exist, so if
they're empty, in that case we want to
set the error to
say please provide values for all
fields. There we go. So now if you try
to generate a trip, it'll say please
provide values for all the trips. Oh,
looks like we have this huge loading
icon right here. Definitely not what we
want to have. So we have to change the
class name of this image to make it have
a size of five. And actually I want to
make it spin. So I'll render dynamically
by rendering a CN property which will
always have a size of five. But it'll
have a class of animate dash spin only
if loading is turned on. So if I do
this, you can now see that it's smaller
and it says generating even though
that's not really the case, right?
Because we have the error, please
provide fields or values for all the
fields. So let's head back over to the
form. And alongside setting the error
that we have, we also want to just set
the loading to false because obviously
we're not submitting. Something went
wrong. So I'll set loading to false and
simply return out of this function
because there's nothing for us to do
here. We're missing the values. So now
if I reload the page and click the
generate trip button one more time,
you'll see that it'll stop loading
immediately and it'll say please provide
values for all fields. Now what else do
we need alongside these fields? We also
need a duration. So I'll say if form
duration is lower than one or if form
data duration is greater than 10. Make
sure that it says form data here as
well. In that case, we'll also render
the error loading in the return
statement. But the error will say
something like duration must be between
1 and 10 days. So I'll save it. And now
if I select the duration of 55 days,
which is a lot for AI to generate the
trip based off of. And when we actually
fill in all the other things, you'll
notice that it'll actually say that the
duration must be in between 1 and 10
days. Perfect. Finally, we should not be
able to generate a trip in case our user
is not currently logged in. So this
functionality is only there for the
logged in users. So after this if
statement I'll try to get the user by
saying await account coming from
apprite.get and then if there is no user
dollar sign id in that case I will
console. And say user not authenticated
I will set the loading to be false and I
will exit out of the function.
Finally, after all of these checks, I'll
open up a try and catch
block. In the catch, I will just render
the error. So, con error is error
generating trip and we'll say what the
error is if we have already gotten to
this point. I'll also add a finally
block. So, whatever happens, whether
we're successful or not, we want to set
the loading to false. And in the try for
now, let's just console log the user so
we know which user is trying to create a
trip. And let's also console log the
form data so we know what kind of trip
they're trying to create. So with all of
that in mind, let's try to generate a
random trip. Trust me, I will just
randomly scroll through all of these
countries. So, I was just about to
create the trip, but my app crashed for
some reason. So, I just reloaded the
server. Oh, it looks like we're getting
this process fetch failed. Interesting.
What is it failing for? Is it maybe for
the countries? Well, if I manually head
over to this API, this endpoint seems to
be working well. So, it must be
something that we have recently added to
the application. No, looks like we're
good again. Well, we'll see whether we
can try to replicate that error soon.
But with that in mind, I'll try to
create a new trip completely randomly.
Okay, I'll be selecting some of the
values here. For example, Virgin
Islands, maybe a couple of days. Let's
go with a family. I want to see some
culture. Let's do museums. And let's do
a budget of luxury. Perfect. And I'm not
sure whether United States Virgin
Islands are so small that we cannot see
them. Or maybe our map is not working
properly. So let me select something
else. Let's go with Bahamas. And there
we go. It's also barely visible, but I
can see it there. So now if I click
generate trip and go to inspect and open
up the console. Check this out. We are
getting back the user information as
well as the form data including the
budget, country, duration, group type,
interest, and travel style. All the
information that we need to generate a
proper travel advice. So now that we
have this proper form, let's actually
use that data in the next lesson. Let's
use that data to generate the AI trip.
Okay, the form is here, but my trip to
Bahamas is not yet ready. Why is that?
Well, it's because we haven't yet
implemented the Gemini AI itinerary
generation. So, let's do that next. You
can head over to a
studio.google.com and consent to sell
your soul. Once you do that, you'll see
that you can get started with Gemini,
but you'll have to sign in to get access
to the dashboard.
Within the dashboard, you'll be able to
create your API key. So just click
create API key on the top right and you
can search for your Google project. It
automatically finds it right here and
you can create it in that existing
project. Once it get generated, copy it.
Head back over to your application
within
yourv and add it as
Gemini. I'll call it Gemini API key. and
I'll paste the key that I just got. But
Gemini is not the only thing we'll use
to generate our trips. You'll want to
head over to
unsplash.com/developers. Unsplash being
the largest image provider in the world
that offers stock free images. So,
you'll want to register as a developer
by filling out this form. Once you
verify your account via email, just go
ahead to create your application. Let's
agree to all of these right here. and
I'll say travel
agency and create the app. Now it'll let
you actually create the app. So if you
scroll down, you'll be able to see your
key. I'll copy the access key and save
it to my app as Unsplash and I'll call
it
Unsplash access
key. Perfect. Now let's actually put
these great APIs to use within our
codebase. To do that, I'll head over
within my terminal and I'll run mpm
install at google slg generative AI and
press enter to install it. Then we'll
want to head over to routes.ts and we'll
add a new route, but this time we'll add
an API route. Can you believe that? an
API backend route within
ReactJS. No Nex.js, just React. That's
what's possible with React Router V7. So
head over here and create a new route
with a path of API create trip and the
file will be routes
API
create-trip.ts instead of TSX. So if we
do this properly and add a comma that
now allows us to create that file. So
head over to your file explorer head
over within the app routes and within
routes create a new folder called API
and within API create a new file called
create
trip.ts. within it will deal with the
logic of creating this trip and all of
that will be just a regular function. In
this case, we can even call it an
action. So I'll say export const action
is equal to an asynchronous function
that gets access to the request which
will be of a type action function args
coming from react router and then we can
define exactly what this action will do.
For example, we're going to pass some
props to it through the request object
so we can automatically dstructure them.
This is the data coming from the form.
So what do we have coming from the form?
We already saw it in that console log.
So I'll say const and dstructure the
country. I'll also get the number of
days. Let's also get a travel style
interests budget group type and the user
ID. and that'll be equal to await
request.json. Let me save this and
reload the page. I might also need to
reload my terminal. That is one thing
that I noticed needs to be done after
you add a new route. So if I do this and
reload, we should be okay, I believe.
But now we're getting cannot read
properties of null reading use context.
But after that, we're good. So, there's
still some things that could be improved
with the overall developer experience,
but again, being able to use server
actions within React. Pretty crazy,
right? Okay. So, now that we have all of
this info or the data from the form, how
do we actually pass it to AI to generate
it or to make something useful out of
it? I'll say const
genai is equal to new Google generative
AI to which we need to pass the key. So
I'll say
process.env.jemini API key and you can
add an exclamation mark to let it know
that we know that that variable will be
there from env. We can do the same thing
with the unsplash key by saying const
unsplash API key is equal to
process.env
unsplash access key just like this. We
can then open up a try and catch block
and in the catch we can simply console
that error saying error
generating travel plan and then we can
console log the error that happened. But
if everything is going well then we need
to figure out a prompt that we'll use to
generate that trip. So say const prompt
is equal to a template string. And here
you can really go all out. Template
strings allow you to split them into
multiple lines. So you can be very
descriptive. The more descriptive you
are, the better it'll be. So we'll need
to say something like generate a number
of days day itinerary for country based
on the following info and then you can
pass additional user information such as
the budget can be set to well a string
of a specific budget. You can repeat the
same thing for what else do we have?
Maybe interests. So, we can close the
interests right here and then pass over
the interests. And you can keep
repeating that until you pass over all
of the information. But typically, when
you're telling AI what it needs to do,
you also need to be very descriptive of
the format in which you want to receive
that data back. So, if you head over
into the video kit, you'll see that here
I provided the entire create trip
prompt. So just go ahead and delete the
current one that we started typing. Or
you know what? Type one yourself and
then paste the one that we have right
here. You'll notice that this
one looks like this. It is exactly the
same as we started typing it, but it
also covers more different pieces of
info such as interests, travel style,
group type, and then I specify how it
should return the itinerary and specify
the lowest estimated price in a clean
non-markdown format with the following
structure. We wanted to have a name, a
description, estimated price, duration,
budget, travel style, and so on. Specify
the best times to visit. Share some
weather info, the location, the
itinerary, and then we specify how the
itinerary should look like day by day.
The more info you give it, the better
the result will be. Finally, we are
going to call that AI and pass over the
prompt and that will result in the text
result. We can do that by calling await
genai.get
get generative model and here you can
choose whatever model you want in this
case I'll aim for something like let's
do Gemini 2.0 O flash. I think this one
is pretty fast. So we should get the
results very quickly. And we can also do
generate
content based on the prompt like this.
So now we're passing that prompt into
it. And then we get back the trip data.
So const trip is equal to parse markdown
to JSON of the text result.ext.
text. This parse markdown to JSON is a
function that while I was writing this
app for the first time, I asked AI to
actually write it, which basically takes
in a markdown text and it turns it into
well JSON, right? The way it works is it
simply parses it and then it runs
JSON.parse on it. So now that we get
this trip, what do you say that we also
get the image of that country from the
Unsplash API and then merge it with that
result of the itinerary. That's what'll
make it stand out. So I'll say const
image response is equal to await and we
want to make a fetch request to
https col/appi.unsplash
unsplash.com slash
search/phos question mark query is equal
to and then we can pass the country and
then we can also pass some interests so
that way it'll match very closely with
what we need. Alongside the interests,
we can also pass in the travel
style. And then we can append the end
sign and then pass the client ID. Client
ID is equal to unsplash API key because
without it, it would not return
anything. So now that we have this image
response, let's actually get some image
URLs. So we'll say const image urls is
equal to in parenthesis await image
response.json
JSON outside of this parenthesy we want
to say dot results dot slice from 0 to
three to get the first three and then we
want to run the map on it where we get
each individual result of a type any and
for each one we want to get back the
result dot urls regular or if it doesn't
exist we can get the null. So once we
have that, this will actually give us
the images and prepare the URLs so we
can save them into the database.
Finally, we are ready to create a trip
within the database. So I'll say const
result is equal to a
weight
database.create document. Make sure to
import this database coming over from
apprite. And we can pass in the database
ID coming from the apprite config as
well as app config dot trip collection
ID. We need to give it the id of that
specific trip. So it'll be id dot unique
also coming from
apprite. And let's see why do I not have
access to this create document. Oh no, I
have access to it, but it's saying that
I need to pass a few more props such as
the last object which contains the trip
detail. Again, I think in the database
we call the detail without the s. So
make sure that you stay consistent. And
what we'll do here is say
JSON.stringify and we'll pass over the
entire trip that was generated for us by
AI. We are using the stringify because
it allows us to save the trip detail
object as a string in the database and
later on safely restore it by using JSON
parse. Alongside the trip details, we
can also get the created at which will
be a new
date to ISO string. So we're getting the
current date and time the image URLs
attached to it as well as the user ID.
So once we create this new result in the
database, we'll return the data and pass
over the id as result dot dollar sign
ID. And this data is actually coming
from react router because we need a way
for us to return the data that is the
result of this server action. And in
this case I have this error issue. It is
just e. Perfect. So the only thing that
remains for us to do is to call this API
endpoint within our codebase that is
then calling additional API services
from within our form. So we can head
back over to create
trip.tsx and go right here to where we
were console logging the form outputs.
So if I now head back over here, we know
where we were right here. I'll just say
const response is equal to
await. We're going to use a simple fetch
to hit our API create trip
endpoint. And I'll also pass some
options to it such as a method of
post headers equal to content type will
be set to application JSON because just
we want to pass some JSON over. And
finally and most importantly, we want to
pass over the body which will be
stringified. So I'll say JSON.stringify
an object that'll have the country
coming from form data dot country number
of
days which is form data dot
duration. We'll also get access to the
travel style which is equal to form
data.t Travel style interests equal to
form data.inter
interests budget equal to form
data.budget
budget group type equal to form data dog
groupoup type and yeah you definitely
could have dstructured the form data so
it'll be much easier to get it that way
you wouldn't have to repeat yourself
here I believe we stored it without the
s just interest and then finally group
type and to it we can also pass the user
ID as user dot dollar sign ID and this
is making a request to the trip. So this
response right here should correlate
with what we are returning from the
actual server action which is basically
the generated trip. So let's actually
extract it right after the response.
I'll say const result of a type create
trip response will be equal to await
response.json
JSON and then we can check if result has
its own ID then we can navigate over to
that trip's detail
page. So right at the top of this
component I will use the use navigate
hook. So I'll say const navigate is
equal to use navigate which is coming
over from react router. And then right
here I'll navigate over
toward slash trips slash result ID. So
we want to go to trip details page and
we can also add an else. So I'll say
else we can simply
console. Say failed to generate a trip.
Perfect. So now we have completed the
second piece of the puzzle. The first
one being the actual Gemini generation
and adding Unsplash images and returning
that as an output of our own server API
endpoint action. And then the second
part was actually passing the data to it
while calling it from our front end and
then navigating over to the trip details
page. So what do you say that we give it
a shot? I will open up my browser in its
full glory. Enter a country. I'm very
interested. What will it do for my
country? In this case, you can put yours
to see what kind of trip does it
generate. I'll give it 7 days. For the
group type, let's be romantic and do a
couple. Travel style will be
interesting. Let's do relaxed. Let's do
historical sites for interests. And for
this person, let's say that budget is
not really important. They want to do
luxury. Perfect. So let's generate a
trip. It'll take some time to actually
generate it as you can see because AI
right now is thinking it's producing the
output and it's sending it over to our
app. Looks like the generation stopped.
So either something went right or
something went wrong. So if we open up
the console, it looks like we got error
generating trip with a syntax error of
unexpected token U. Unexpected is not a
valid JSON. It's good that we console
log the error. So it actually comes from
error generating trip. So that should
help us a bit. You can see that it's not
coming right here as the else statement.
It's not coming as part of our own API
response. Rather, it's failing right
here. error generating trip. If I open
up my dev terminal, we can see that we
got the issue here as well and it says
value is not JSON serializable and we
got another error this time from our API
saying apprite exception collection with
the requested ID could not be found.
Okay, interesting. So now it's pretty
clear where the issue is. It is back
within our server action where we're
trying to generate a trip that is right
here.
So I'm pointing over to apprite config.
It's saying that collection with the
requested ID could not be found. So
obviously this is the issue. App config
trip collection ID. Let's see trip
collection ID. Importing it from vit
apprite trips collection ID. And if I
head over to my
env. I'm saying apprite trips collection
ID. So, this is looking good to me. So,
it might be best to crossverify over on
AppRight dashboard by heading over to
databases and then trips
collection. I'll recopy this ID and then
back in our application, I'll paste it
here. Oh, looks like I missed the number
right there. So, it's actually highly
likely that it worked for you on the
first try. But while I was messing with
my env. Well, looks like I deleted a
number accidentally. So, if I head back
over to my application and click
generate trip one more time. Let's see
what happens.
Now, it is generating and it looks like
it stopped one more time. If it didn't
stop, we would be redirected to another
page. So, if I open up the console,
looks like it's pointing to the same
issue. Is it? Maybe I have to reload the
terminal.
Now that I reloaded it, it might work.
Who knows? Third time's the charm. Okay,
the third time didn't work. It's not the
charm. So, it looks like this time we
got a different error saying that our
document structure is invalid. Missing
field trip details. So, it looks like I
did actually rename it to details and
not detail. So, if I go right here and
change this over to trip details, we can
crossverify that right here. Yep, it's
trip
details for you. It might be detail
you'll need to check out with your own
database. So, let me give it a go. Maybe
it worked for you in the first try and
you're just seeing me fail. How does
that make you feel? Okay, there we go.
Um, I didn't think I would be so happy
to see a 404 page, but I am. Uh the fact
that we're seeing this 404 page means
that we came all the way to the end of
our process because if everything goes
right and if the new record has been
created in the database only then will
it redirect us to that trip details
page. And even though we cannot see the
whole thing right away at least we
cannot see it in this beautiful layout
it doesn't mean that it doesn't exist.
If you head over to Apprite, go to the
trips database and check out documents,
you'll see that one of our users has
created their first trip. So, if you
want to check it out, you can just head
over to data and check this out. We have
three separate image URLs matching what
a user searched for. Yep, you can
actually see those images already by
simply navigating over to this URL and
you'll see some of the nice photos.
These are looking good. And we also have
the created ad field, the payment link
which we will add later, the user ID
that created it, and most
importantly, the trip details generated
by AI. So here you can see that it
actually gave a name to a trip luxury
creation history and romance a couple's
escape and it gave us a lot of
information that we might want to use to
nicely display right within our
application which is exactly what we'll
do in the next lesson. But first I'll go
ahead and commit the changes we have
right now. I think I might have forgot
to do it in the last lesson but that's
fine. We'll do it right now. I'll say
get add dot get
commit-m and I'll call it generate trip
using AI and I'll push it. So in the
next lesson let's focus on generating
this beautiful trip details page so we
can finally see what our app actually
does now that we have spent a lot of
time making it happen. Great work. We're
past the most complex parts of the app.
So, if you reach this point, leave a
comment down below and let me know,
"Hey, Adrian, I passed the AI trip
generation and now I'm ready to dive
into the trip
details. See you there." Or if you maybe
want to do a bit of NextJS, you can
check out the ultimate Next.js JS course
or just become a JSM Pro member to get
it all alongside real interview feedback
and even the access to building the
public version of this website. All of
that is available on JSM Pro. So check
it out and I'll see you there. Have a
wonderful