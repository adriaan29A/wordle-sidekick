# Introduction

I think Wordle is actually more fun when you can cheat (just a little)! Use this CLI solver app when you play online, or play alone. It's also a great illustration of the application of Information Theory to play Wordle using a statistically optimal strategy. In the case of Wordle we want to maximize the amount of information that can be obtained from each guess by first computing the average expected value, also known as the Von Neumann entropy, for each word in the game's dictionary:

![wordle3](https://user-images.githubusercontent.com/88779001/210249127-dda88378-8f22-40a4-be2f-ec5208492b25.png)

A sorted list of word and entropy tuples is then used to play the game. See 3Blue1Brown's video [Solving Wordle Using Infformation Theory](https://youtu.be/v68zYyaEmEA) for an excellent in-depth discussion of how the algorithm works. 

It would be be boring if you cheated at every turn so don't! Play against a Wordle site and have a peek at the top guesses only when you're really stumped.  It's fun to see how far you can get without a 'cheat' and a relief to know you can when you want to. You can also play with different word sizes: 4-10 chars are supported.

# Example Usage

1) Play against an online site, manually entering the hints the site provides (b/g/y are mnemonics for black, green, yellow):

> wordle-sidekick

>? Play mode: m

>? Guess, hint: rates bybyb

...
![wordle0](https://user-images.githubusercontent.com/88779001/210251566-f1755de3-040e-4f8f-b59a-3552ed04357a.gif)



2) Play against the app:

>? Play mode: a

>? Guess: rates

...
![wordle1](https://user-images.githubusercontent.com/88779001/210252035-1b5f9d34-6d3d-4377-9d98-14a8c2a68acc.gif)


Note:

- You can hit 'q' at any time to quit. 'h' for help to come. 't' to see a play loop of 10 games with random words and guesses. 
- You can press return repeatedly while viewing the 'cheat' list to see more results (sorted by entropy descending)
- An index value (1-99) can be used for any guess in the list as long as it is valid. 


# Try out other word sizes. 

There's at least one site out out there which supports this that you can play against - https://wordlegame.org/ The nature of the game changes a bit for other word sizes, anyway they're interesting to watch in a play loop:

Pass either the word-size or the play mode on the command line or both:

> wordle-sidekick 8 t

![wordle4](https://user-images.githubusercontent.com/88779001/210403043-0c2e44a4-1e0e-4477-a5b2-de6c94b52e9d.gif)



# Implementation

- CLI is a simple JS file, written semi-pedantically to illustrate the algorithm. 

- Data fles (/frequencies/*.json) used by CLI are built by a straightforward Python file. 

The word frequencies are incorporated to threshold guess choices, which is pretty neat and something I struggled with until I found 3b1b's video. All data files All entropy and frequency files are generated from google_word_frequencies and wordle_original_words using tools.py. I didn't think it worth it to put these in a dev dependency.



















