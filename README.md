# NaNoGenMo2014: a Web Browser's Diary

My participation to the NaNoGenMo 2014: a Web Browser's Diary.
More info about NaNoGenMo [here][1].

## Current progress
The novel needs a title that is taken as an input by the user.
The first entry of the diary shows general informations about the browser and the client (name, OS, IP, localisation, cookies parameters).
Then, it searches on Google for the title given by the user and displays 8 results of the Google search at a random page between 10 and 50.

The content is generated asynchronously so that one can read the beginning while the rest of the novel is being written.
The header of each entry is a UNIX timestamp and the date related to it.
The beginning date is chosen randomly between 2011 and 2012 and then every new entry is in the week following the previous one.

You can try the current version [here][2].

## What's next?
The rest of the novel is not defined yet, I have two ideas:
   * either it wanders on the web, beginning on a random google result and going from external links to external links
   * or it always takes another random google result

It would eventually react to some informations about the page (title, language, JS files, CSS files, etc...) and display the main headers and random sentences from the paragraphs of the page.
Using meta tags (description keywords), it can link one page to another one already visited (in its "memory").
The external links provided on the web page would be "paths" to somewhere else for the browser and one of them could be chosen randomly to go to the next page.
If no external link or a 404 is found, it could react and go back to the previous page and choose another one.

## Let's imagine
We could include "emotions" with the use of adjectives and also implement a bit of evolution.
For example, two arrays of happy and sad adjectives, and a probability of picking the adjective in the first one decreases as for the second one increases with time.
Or we could imagine that the more it sees Google analytics, Facebook or Twitter integrations, the more it could express paranoïa of being tracked.

[1]: https://github.com/dariusk/NaNoGenMo-2014/
[2]: http://louphole.com/apps/nano/
