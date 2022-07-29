![astro logo](/blog/ssg-compare/full-logo-light.svg)

# Astro Site Generator --- the new hotness!

Over the last month I have used several static site generators / meta frameworks and learned a lot.

To start with what it is that I was looking for.

I wanted a static site generator with the following properties.
SMALL BUNDLE SIZE!
Built in support for markdown with code highlighting (or easy to add)
I wanted a path/folder based router/builder like Next.js
I wanted HTML/CSS static output for each page
The ability to progressively add interactive javascript components, like webcomponents.
Decent Debugging of the progressively added components
Bonus: ability to progressively add framework components to a page without requiring committment to whole framework for entire site.

Preface:
The amount of time I have spent with each of these site generators / frameworks was minimal, anywhere from hours to days, with NextJS being the exception as I have written a lot
on the meta framework over the last year.
This is meant to be a first impression.

This blog post will discuss my initial impressions of the following:

- Hugo
- Vite
- WMR
- SvelteKit
- NextJS
- Astro

Hugo
Quick setup, a little difficult to find where everything is at first.
Docs are good, but way too many features and way too many built in functions.
Learning the basics takes an afternoon, but deep dive to learn everything would take a very long time.
Folder based routing, but can be complicated (ie: different templates can use different folder structures)
Too much "Magic" to understand how things "Just Work", I like a little more explicitivity?
Built in support for markdown and highlighting.

Vite
Very quick setup, easy to find where everything is, love the prompt driven setup in `npm create vite@latest` and the option to choose different frameworks.
Docs are good, Can learn the basics in an afternoon. Dissapointed in the output. Basically, outputs a javascript bundle that creates your page.
Multi Page Sites can be created but require extra config for each page you create (or writing your own crawler/bundler/parser?)
Uses Rollup like config (maybe even uses rollup?) Rollup Docs are a giant one page monster that chokes my 64GB Ram 8 core beast laptop.
Have to add markdown and highlighting

WMR - The meta framework for Preact
Fallen in love with the small bundle size of preact, lets me do everything I'm used to writing in react.
WMR Docs are simple, but probably lacking? Not sure what I'm looking for, but quite bare.
Has Prerendering options. But requires some extra steps to utilize.
But uses a more explicit approach to adding pages/routes (like original react-router)
Need to setup index.js with `preact-iso`, add a prerender export, use lazy load function for each route, and finally add the route to the router component
Not quite the folder based page rendering that I'm looking for.
Have to add markdown and highlighting

SvelteKit - Meta Framwork for Svelte
Really love svelte, love the code style, Learning will take a minute as it is quite different than writing a functional react component.
Easy Setup, Awesome Docs. I love the `npm create svelte@latest my-app` prompt based setup and all the options to add prettier, linting, testing, etc.
Has the page based router. Small bundle size. But the generated seems complex/strange. There is so much generated! I can't find index.html!
Edit, realized that I need to use an adapter to get the type of output I was looking for `import adapter from '@sveltejs/adapter-static`;
and add prerender: {default: true} to config.kit
This makes progressive enhancement a little difficult for me... need to pick the right adapter and configure, not what I want out of the box.
However, support for cloudflare pages right out of the box (with config) is a really killer feature for me. I will be exploring this more in the future
Have to add markdown and highlighting.

NextJS - My old standby
Been using for a long time now.
Love the docs, love the react components, Love the folder based routing, SSR, SSG
Need to add markdown and highlighting
Bundle size is ok, but no where near as good as svelte and other truly HTML/CSS SSG

Rolled My Own
I actually rolled my own static site generator that uses handlebars templating.
This did a lot of what I needed. Small bundle size, folder based routing, Markdown and Highlighting.
But when it came to progressive enhancement... I started to really learn a lot about why we have so many framworks and libraries!
I was able to add webcomponents no problem, and debugging was good, but it was not my favorite as far as ergonomics.
I really love the ergonomics of function react components and JSX, and really wanted to write web components like this.
I did find a solution... Preact (preact-custom-element)
But how to add support for this in my home made SSG?
I added babel and preact and ran the babel cli to transpile into js that I could include in my site.
This got me a lot closer and was really having fun learning about this, but then I stumbled on Astro...

Astro - The Everything Meta Framework?
This literally has everything that I am looking for in my wish list and then some.
Static Site Generation / Small Bundle Size
Page based routing
Markdown and highlighting.
Progressive enahncement using almost any framework/library (react, svelte, vue, lit solidjs)
Partially Hydration
You can mix your svelte and react components in the same page!
On top of everything else, they have an SSR integration for cloudflare pages!!!
Exotic uses:
Want a static site with no JavaScript bundle, but wish you could write it using function react components?
This is obvously a little heavy handed, but Astro allows you to do this, because by default astro will only render the html of the component!
This means you have to opt in to partial hydration... sounds complicated right? Wrong... just add client:load attribute to your compponent.
And that component will get hydrated with its javascript.
This means that you can selectively choose which components are hydrated and which ones are not... enabling you the ultimate flexibility in how you create your site!
