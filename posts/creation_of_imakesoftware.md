# The Creation of imakesoftware.co.uk

So, I bought this domain about in March of 2022 to replace my own personal domain whilst it was in the grace period
and became cheaper.

I had no idea what I wanted to do with it, I certainly was under no intention of making a tiny blog. It wasn't until
I came across this website [Tiny Projects](https://tinyprojects.dev/) when I decided, "Hey, I should do that too", and
documenting my projects through this format seems silly but it'll allow me to have something to converse with, a
medium to "talk to the rubber duck" whilst I'm developing.

So, how does it work. Well first, I knew the content had to be written in something extremely simple, I could make
each post in some HTML wizardry allowing me to render some cool content, but if i've learnt something in my years of
being a Software Developer, it's that the simplest solutions are often the best, so posts are written in the eternally
loved Markdown, with React doing the heavy lifting on rendering.

This leads to another problem, database. I have data to be stored and it has to be put somewhere, again, it comes down
to the age-old solution of KISS (*Keep. It. Simple. Stupid.*). Each post is stored in a JSON file, with a reference to
the markdown file which should be rendered, I don't need to perform joins or store large amounts of data, I just need
it to work. From what I've seen, the Software Developer lifecycle goes like this, you start of doing things basic and
simple since you don't know any better, then you get a job and decide "Oh, so this is how it should be done", not
realising that you don't need to build everything with a gigantic stack, so then you start doing things basic because
you simple don't need to do any better, you can always upgrade if you want later, just get it to work. This only
applies if you're aiming for a product, and not if you're wanting to learn something, if you're wanting to learn a
new technology keep everything else simple.

I know what you're thinking, this site is written in React and SCSS, how's that keeping it simple. I've been creating
React projects for years now, setup of these projects is simple to me, I have a base template for how things shoud
look on the file system, I know how to render using JSX and export to CSS. It's my definition of keeping things simple.

Let's talk hosting, some blogs i've seen will talk you through everything about creating a website, and nothing about
deploying one. They tend to fall under a different tree of infrastructure management, I highly recommend
[Digital Ocean](https://digitalocean.co.uk), this website isn't sponsored, I just think they're good at what they do.
Making infrastructure available to everyone. Within Azure to create a Virtual Machine, you have to create a Network
Interface, a disk and finally the machine, this works exceptionally well within a large organisation. It doesn't work
so well for a tiny project.

Through this site, I discovered that [Digital Ocean](https://digitalocean.co.uk) have an
[App Platform](https://www.digitalocean.com/products/app-platform), now everytime I `git push` I can see a Docker image
being built and then it's run, simples. With regards to `git`, I do use it, but for now this website is being kept
private. I may open source it at some point so you too may have your own software blog, but not yet.

So here we are, with the first entry done. Maybe next time, I'll talk about an even cooler project, or how to setup a
specific thing, for now it's just concluding the creation of a site.