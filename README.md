# Introduction
Wordle is more fun when you cheat (just a little)! using this companion console app when you play, or just play against the app itself, which uses an information-theoretic approach to solving for the optimized ranked list of best guesses to choose from at every turn. 

The list ordering is computed similar to the method used by 3Blue1Brown who has an awesome Youtube video describing the details. It involves computing Shannon's entropy for each word in the dictionary, measured in bits.

It would be be boring if you cheated at every turn so don't! Just play against any site *or* against the app itself and have a peek at the top guesses only when you're really stuck!  It's fun to see how far you can get without 'cheating' and a relief to know you can when you want to!

It's interesting to play with different word sizes - You can play with words between 4 and 8 characters in length. 4 doesn't very interesting but the game changes a bit for larger words like 6 and above. You be the judge and you can create more using the files in this package. 
