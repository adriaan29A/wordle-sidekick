# Introduction

I think Wordle is more fun when you can cheat (just a little)! Use this CLI solver app when you play online, or play stand-alone. It's also a great way to illustrates the usage of Von Neuman Entropy to play Wordle with an optimal strategy. See 3Blue1Brown's Youtube video for an excellent discussion of the subject.

It would be be boring if you cheated at every turn so don't! Play against any Wordle site  and have a peek at the top guesses only when you're really stumped.  It's fun to see how far you can get without a 'cheat' and a relief to know you can when you want to. You can also play with different word sizes

# Installation

> npm install -g wordle-sidekick

# Usage

1) Play against an online site and manually input the hints the site provides (b/g/y are mnemonics for black, green, yellow)

> wordle-sidekick

>? Play mode: m

>? Guess, hint: rates bgbbb

...

![](https://github.com/adriaan29A/wordle-sidekick/blob/main/wordle0.gif)

2) Play against the app which generates the hints automatically:

>? Play mode: a

>? Guess: ariel

...

![wordle1](https://user-images.githubusercontent.com/88779001/210022892-24c5c667-2524-439c-96e6-5e5a7417f5f1.gif)


You can hit 'q' at any time to quit. 'h' for help to come. 't' to see a play loop of 10 games with random words and guesses. 

# Try out other word sizes. 

There's at least one site out out there which supports this that you can play against - https://wordlegame.org/

Pass either the word size or the play mode on the command line or both:

> wordle-sidekick a

> wordle-sidekick 7

> wordle-sidekick 6 m

> wordle-sidekick 8 t

where word size precedes play-mode if present

# Implementation

- Simple single JS runtime file, written semi-pedantically to illustrate the algorithm. 

- Simple single Python file to generate the entropies. Shows how word frequencies are incorporated to threshold guess choices, which is pretty neat and something I struggled with I saw 3b1b's video.

- All entropy and frequency files are genereted from google_word_frequencies and wordle_original_words using tools.py. I didn't think it worth it to put these in a dev dependency.



















