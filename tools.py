import sys
import math
import json
import time
from cmath import inf


# Tuple indexes
WORD        = 0
ENTROPY     = 1
FREQ        = 1

MAX_WORDS = 20000

   
class Hint:
    miss    = 'b'
    hit     = 'g'
    other   = 'y'     

def generate_pattern(source, target):
    """
    The one true Wordle algorithm
    
    
    """

    n = len(source)
    pattern = [' '] * n

    s = source
    t = target

    for i in range(n): 

        if s[i] == t[i]:
            pattern[i] = Hint.hit
            s = (s[0:i] + ' ' + s[i+1:])
            t = (t[0:i] + ' ' + t[i+1:])

    for i in range(n):
        if s[i] != ' ':
            idx = t.find(s[i])
            if idx != -1:
                pattern[i] = Hint.other
                t = (t[:idx] + ' ' + t[idx+1:])
            else:
                pattern[i] = Hint.miss

    res = ''
    for i in range(n):
        res = res + pattern[i] 

    return res


def verify_pattern(pattern, source, target):
    """



    """
    res = True
    p = generate_pattern(source, target)

    for i in range(len(p)):
        if pattern[i] != p[i]: #fix
            res = False
            break

    return res

def filter_words(pattern, words, src):
    """ 
    Given a pattern like bgyyb, a list of (word, entropy) tuples and a candidate
    (target) word returns the list of words that match that combination of pattern and word.
    """
    matches = []
    for target in words:
        if verify_pattern(pattern, src, target[WORD]):
            matches.append(target)

    return matches

def read_word_data(filename, is_int):
    """ 
    Returns an array of 2-tuples.

    """
    words = []
    with open(filename) as f:

         lines = f.read().splitlines()
         f.close()

    for line in lines:
        s = line.split('\t')
        if is_int:
            words.append((s[WORD], int(s[FREQ])))
        else:
            words.append((s[WORD], float(s[ENTROPY])))
    return words


def apply_threshold(freq, max_freq):

    # Magic numbers for sigmoid function- I eyeballed
    # these to get a reasonable looking threshhold. 
    c1 = 1000; c2 = 4.2 / c1

    f = freq / max_freq
    if f == 0: 
        y = 1.0 / inf
    else:
        y  =  1.0 / (1 + math.exp(-1.0 * c1 * (f - c2)))  
       
    return y


def generate_entropies(filename):
    """ 
    Compute the expected value of each word. 


    """
    words = read_word_data(filename, True)
    n = len(words)
    if n > MAX_WORDS:
        n = MAX_WORDS

    max_freq = words[0][FREQ]

    wdlist = []

    for i in range(n):
        
        patterns = {}
        for j in range(n):

            p = generate_pattern(words[i][WORD], words[j][WORD])
            if (p in patterns):
                patterns[p] += 1
            else:
                patterns[p] = 1

        s = 0
        for p in patterns.keys():

            count = patterns[p]
            probability = count/n
            bits = math.log2( 1 / probability )
            s += probability * bits

        s = s * apply_threshold(words[i][FREQ], max_freq)
        w = ((words[i][WORD], s))
        wdlist.append(w)

        print('[\"{0}\", {1:5.3f}]'.format(w[WORD], s), file = sys.stderr)

        entropies  = list(sorted(wdlist, key = lambda ele:ele[ENTROPY], reverse = True))

    for i in range(len(entropies)):
        print('[\"{0}\", {1:5.3f}]'.format(entropies[i][WORD], entropies[i][ENTROPY]))



class Odometer:

    def __init__(self, digits, base):
        self.digits = digits
        self. n = len(digits)
        self.base = base

    def increment_and_carry(self, i):
        self.digits[i] = (self.digits[i] + 1) % self.base
        return self.digits[i] == 0

    def increment(self):
        i = 0
        while self.increment_and_carry(i):
            i+=1
            if i == self.n: 
                break


BASE = 3 
def iterate_and_do(filename):
    """
    Test function. Loops through all possible hint patterns

    """
    matches = []
    words = read_word_data(filename)
    n = len(words[WORD])

    for target in words:
        for source in words:
            pattern = [0] * n
            od = Odometer(pattern, BASE)
            for i in range(BASE**N):
                res = verify_pattern(od.digits, source[WORD], target[WORD])
                if res:
                    print(od.digits, source[WORD], target[WORD])
                else:
                    print(source[WORD] + '** Not matched! **')
                od.increment()





generate_entropies(sys.argv[1])



"""
def convert_to_json(filename):
    words = read_word_data(filename, False)
    for w in words:
        s = json.dumps(w)
        print(s)
"""

#convert_to_json('wd1/wordle5_entropies')
