# NaNoGenMo2014: a Web Browser's Diary

My participation to the NaNoGenMo 2014: a Web Browser's Diary.
More info about NaNoGenMo [here][1].

The originally submitted novel for the NaNoGenMo 2014 can be read here: [A Browser's Diary - Writing a novel][3]. (Unofficial name is "Sisters of Cleveland") - 50195 words.

You can generate your own Browser's Diary with the current version [here][2].

## Generate the novel
The novel needs a title that is taken as an input by the user.
The first entry of the diary shows general informations about the browser and the client (name, OS, IP, localisation, cookies parameters).
Then, it searches on Google for the title given by the user, gathers a few links and displays the text of one of them.
At each step, the program goes to a page, gathers all the external links in it, displays paragraphs if there are some, if not, goes to another page and repeats the same thing.

## Features and inspiration
### Diary of a Mad Browser
The general dynamic of the novel is inspired by the Diary of a Madman from Gogol.
   * Feelings: The Browser is happy at the beginning but becomes more and more desperate towards the end
   * Madness: The more the diary goes on, the more the browser's text generation is filled with errors, capslock text and looks like mad

### Other features
   * The program detects the main languages spoken on the web and the browser reacts to pages in those languages
   * The program takes the longest link of all the links gathered because the probability of having meaningful text in this link is greater
   * The program avoids going on the same domain several times as well as being stuck without links anymore
   * The content is generated asynchronously so that one can read the beginning while the rest of the novel is being written.
   * The header of each entry is a UNIX timestamp and the date related to it.
   * The beginning date is chosen randomly between 2011 and 2012 and then every new entry is in the week following the previous one.

## Limitations and possible improvements
### Server request limitation
I had to add a counter of requests for the loop because my server was returning a 500 Internal Server Error when I called the same request too many times.
Therefore, the program runs a Google Search again every 25 loop requests. I could have made this request dummy but too late now.

### Typewriter effect
I wanted to add a typewriter effect to display the text progressively with a ticker but all the jQuery plugins I found on the web for that didn't work with the asynchronous display of the novel. If you find something that works well, let me know.

### More special content
At first, I even had the idea of analyzing the meta tags, Javascript and CSS files, and other stuff to make the browser even more expressive. This is still possible I guess, if someone wants to expand the project of the generated browser's diary. Some ideas of how to use those informations:
   * Meta tags: be more specific about the subject of the page, be able to recognize topics already seen
   * Javascript files: common frameworks and libraries could be recognized and thought as different objects (books maybe?)
   * CSS files: depending on the size and the number of files, it could be handled as "make up" for the page
   * Length / Size of the page: different reactions can be imagined to different values of this

[1]: https://github.com/dariusk/NaNoGenMo-2014/
[2]: http://louphole.com/apps/nano/
[3]: http://louphole.com/apps/nano/novel/A%20Browser's%20Diary.html
