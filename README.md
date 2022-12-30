# Introduction

Wordle is more fun when you can cheat (just a little!) using this companion app when you play online, or play stand-alone. This console app uses the information-theoretic method to compute the optimal prioritized list of best guesses to choose from at every turn using the expected value (Shannon's entropy) computed for each word in the dictionary and measured in bits. See 3Blue1Brown's Youtube video for an excellent discussion of the subject.

It would be be boring if you cheated at every turn so don't! Play against any Wordle site  and have a peek at the top guesses only when you're really stumped.  It's fun to see how far you can get without a 'cheat' and a relief to know you can when you want to. You can also play with different word size: 4-8 char lengths are supported, you can build more with the included files.

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


You can hit 'q' at any time to quit. 'h' for help to come. 't' to see a play loop of 20 games with random words and guesses. 

# Tryout other word sizes. 

There's at least one web site out there that does - https://wordlegame.org/

Pass either the word size or the play mode on the command line or both:

> wordle-sidekick 6 m

where word size always precedes play-mode

# Implementation

- Simple JS console app written semi-pedantically to show how how the method works. Requires inquirer.js for input UI

- Simple Python script to generate the entropies. Also shows how word frequencies are factored in to threshold guess choices which is pretty neat and something I struggled with until I saw 3Blue1Brown's video.






















