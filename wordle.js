import * as fs from 'fs';
import inquirer from 'inquirer';
import { Console } from 'console';


const WORD = 0; 
const EXPECTED = 1;

const GUESS = 0;
const HINT = 1;

// Hint colors - black, green, yellow.
const MISS = 'b'; const HIT = 'g'; const OTHER = 'y';
const Hint = {
	miss: MISS,
	hit: HIT,
	other: OTHER
};

// # Output lines in display_results
const NROWS = 5;

const DEFAULT_WORDLE_DATA = './entropies/words5.json';


//
// Core logic
//

function generate_pattern(source, target) {
	var n = source.length;
	var pattern = Array(n).fill(' ');
	var s = source; var t = target;

	for (var i = 0; i < n; i++) {
		if (s[i] == t[i]) {
			pattern[i] = Hint.hit;
			s = s.slice(0, i) + ' ' + s.slice(i + 1);
			t = t.slice(0, i) + ' ' + t.slice(i + 1);
		}
	}
	for (var i = 0; i < n; i++) {
		if (s[i] != ' ') {
			var idx = t.indexOf(s[i]);
			if (idx != -1) {
				pattern[i] = Hint.other;
				t = t.slice(0, idx) + '' + t.slice(idx + 1);
			}
			else
				pattern[i] = Hint.miss;
		}
	}
	return pattern;
}

function verify_pattern(pattern, src, trgt) {
	var res = true;
	var n = src.length;
	var pat = generate_pattern(src, trgt);
	for (var i = 0; i < n; i++){
		if (pattern[i] != pat[i]) {
			res = false;
			break;
		}
	}
	return res;
}

export var filter_words = function (pattern, words, src) {
	var filtered = [];
	for (var target of words) {
		if (verify_pattern(pattern, src, target [WORD])) {
			filtered.push(target);
		}
	}
	return filtered;
}

export var read_word_data = function(filename) {
	var data = ''; var words = []; var lines = [];

	try {data = fs.readFileSync(filename, 'utf8');
			lines = data.split('\n').filter(Boolean);
		} catch (err) {
		console.error(err); 
	}

	var length = lines.length;
	for (var i = 0; i < length - 1; i++) {
		var l = lines[i];
		var t = JSON.parse(l);
		words.push(t);		
	}
	return words;
}

//
// UI input and validation
//

const errmsg_mode = 'Enter  \'a\' for auto or \'m\' for manual';
const errmsg_guess = 'Enter  guess or \'q\' to quit or \'h\' for help';
const errmsg_guess_hint = 'Enter  guess, hint, \'q\' to quit or \'h\' for help';

const prompt_play_mode = [{
	type: "input", name:'data', message: 'Play mode:',

	filter(response) {
		if (response.length == 0) 
			return 'a';
		return response;
	},
	validate(response) {
		if ((response != 'a') && (response != 'm') 
			&& (response != 't') && (response != 'q'))
			return (errmsg_mode);
		return true;
	}
}];

function prompt_guess_only(word_size) {

	return [{
		type: "input", name: "data", message: "guess:",
		filter(response) {
			return response.split(/[ ,]+/).filter(Boolean);
		},
		validate(response) {
			if (response.length == 0)
				return true;
	
			if (response.length != 1)
				return (errmsg_guess);
	
			var rgx_guess =  '^([a-z]{' + word_size + '}|[phq]|[0-9]{1,2})$';
	
			var regex = new RegExp(rgx_guess);
			if (response[GUESS].match(regex) == null) 
				return (errmsg_guess);
			
			return true;
		}
	}];
}

function prompt_guess_and_hint(word_size) {
	
	return [{
		type: "input", name: "data", message: "guess, hint:" ,
		filter(response) {
			return response.split(/[ ,]/).filter(Boolean);
		},
		validate(response) {
			if (response.length == 0)
				return true;

			if (!((response.length == 1) || (response.length == 2)))
				return (errmsg_guess_hint);

			var rgx_guess =  '^([a-z]{' + word_size + '}|[phq]|[0-9]{1,2})$';
			var regex = new RegExp(rgx_guess);
			if (response[GUESS].match(regex) == null) 
				return (errmsg_guess_hint);

			if ((response.length == 1) && (response[GUESS].length == 1)) {
				if (!isNaN(response[GUESS])) {
					return (errmsg_guess_hint);
				}
				else
					return true;
			}

			var rgx_hint =  '^[byg]{' + word_size + '}$';
			if (response.length == 2) {
				var regex = new RegExp(rgx_hint);
				if (response[HINT].match(regex)== null) {
					return (errmsg_guess_hint);
				}
			}
			else
				return errmsg_guess_hint;
	
		return true;
	}
}];

}

//
// Output
//

function display_results(by_expected, pagenum) {

	var listsize = by_expected.length;
	if (((pagenum + 1) * NROWS) <= listsize) 
		var rows = NROWS;
	else
		var rows = listsize % NROWS;

	if (rows == 0)
		return false;

	console.log('\nTop Words:\n');
	console.log('#\tword:\tbits:');
	console.log('---------------------');
	for (var j = 0; j < rows; j++) {
		var row = pagenum * NROWS + j;
		var en = by_expected [row];
			console.log(
				(pagenum*NROWS + j + 1).toString() + ')\t' + en[WORD] 
				+ "   " + en[EXPECTED].toFixed(2).toString());
	}	

	if (rows < NROWS)
		return false;
	else 
		return true;
}

function print_color_coded_guesses(guesses, hints) {
	var color = '';  var argspec = '';
	var colorspec = '[ ';

	for (var i = guesses.length - 1; i >= 0; i--) {
		for (var j = 0; j < hints[i].length; j++) {

			if (hints[i][j] == Hint.miss)
				color = '\x1b[1;1m%s\x1b[0m'; // black
			else if(hints[i][j] == Hint.other) 
				color = '\x1b[1;43m%s\x1b[0m'; // yellow
			else
				color ='\x1b[1;42m%s\x1b[0m'; // green
		
			colorspec += color;
		}
		colorspec += ' ] [ ';

		for (j = 0; j < hints[i].length; j++)
			argspec += 'guesses[' + i.toString() + '][' + j.toString() + '],';
	}

	argspec = argspec.slice(0, -1);	
	colorspec = colorspec.slice(0, -2);
	var printspec = 'console.log(\'Guesses:  ' + colorspec + '\'' + ',' + argspec +');';
	eval(printspec);
}


function display_summary(matches, expected, actual,
	 guess_list, hint_list, guess, secret) {
	 if(!matches.length)
		return;

	console.log('\nGuess:\t\t' + '\x1b[1;34m%s\x1b[0m', guess);  

	if (secret != '') 
		console.log('Correct word:\t' + '\x1b[1;32m%s\x1b[0m', secret)  ;

	console.log('\nExpect:\t\t' + (expected.toFixed(2)).toString() + ' bits');
	console.log('Actual:\t\t' + (actual.toFixed(2)).toString() + ' bits\n');

	if (guess != secret)
		console.log('Words remaining: \x1b[1;31m%s\x1b[0m\n', matches.length.toString());

	print_color_coded_guesses(guess_list, hint_list);
}

function lookup_in_dictionary(guess, matches) {
	for (var i = 0; i < matches.length; i++) {
		var t = matches[i];
		if (guess == t[WORD])
			return t;
	}
	return null;
}	

const HARDNESS1 = 2500;
function generate_secret(words) {
	var idx = Math.floor(Math.random() * HARDNESS1);
	return words[idx][WORD];
}

function generate_random_guess(matches) {
	var idx = Math.floor(Math.random() * matches.length);
	return matches[idx][WORD];
}

//
//  Main UI loop
//

async function async_main(word_size, play_mode) {

	var filename;
	if (word_size != '')
		filename = './entropies/words' + word_size + '.json';
	else
		filename = DEFAULT_WORDLE_DATA;

	// Read in the (word, entropy) tuples. The file data 
	// is pre-sorted by entropy, no further sorting is necessary
	var words = read_word_data (filename);
	var matches = words; 
	word_size = matches[0][WORD].length.toString();

	// 
	console.clear();
	if (play_mode == ''){
		var result = await inquirer.prompt(prompt_play_mode);
		play_mode = result.data;
	}
	
	if (play_mode == 'a') {
		question = prompt_guess_only(word_size);
	}
	else if (play_mode == 'm') {
		question = prompt_guess_and_hint(word_size);
	}
	else if (play_mode == 't') {
		run_play_loop(words, 20);
	}
	else if (play_mode == 'q') {
		return true;
	}

	// Opt into cheat is on a per-guess basis, page_num controls 
	// pagination and both are reset after each loop.
	var cheat = false; 
	var page_num = 0; 

	// Main loop executed once per user input
	var guess_list = []; var hint_list = [];
	var secret = ''; var guess = ''; var question;
	if (play_mode == 'a')
		secret = generate_secret(words);

	while (true) {
		if (cheat) {
		    display_results(matches, page_num);
			console.log('');
		}

		// Prompt for guess +/- hint | q/h/p 
	    console.log();
	    result = await inquirer.prompt(question);
		var response = result.data;		

		// User hits return cycles through the matches
		if (response.length == 0) {
			if ((cheat) && (matches.length < NROWS)) {
				return true; 
			}
			page_num++;
			continue;
		}
		guess = response[GUESS];

		if (guess.length == 1) {
			if ((guess[0] == 'q')) {
				if (play_mode =='a')
					console.log('\n Hidden word was ' + secret + '\n');
				return true;

			}
			else if (guess[0] == 'p') {
				cheat = true;
				continue;
			}
		} 

		// In both auto and manual mode the user may input
		// a numeric index instead of a guess string. 
		if (isNaN(guess) == false) {
			var index = parseInt(guess);
			if (index > (matches.length)) {
				console.log('Invalid index');
				continue;
			}
			else
				guess = matches[index-1][WORD];
		}

		var hint; 
		if (play_mode == 'a') 
			hint = generate_pattern(guess, secret);
		else
			hint =  response[HINT];
		
	    var expected_bits = 0.0;
		var entry = lookup_in_dictionary(guess, words);
		if (!entry) {	
			console.log('\nThe word \'' + guess + '\'' + ' is not in the dictionary.\n');
				continue;
		}
		else {
			expected_bits = entry[EXPECTED];
		}

		var prev_matches = matches;
		matches = filter_words (hint, matches, guess);
		if (matches.length == 0) {
			console.log('The guess \'' + guess + '\' the hint \'' + hint + 
				' are inconsistent. Look for errors in previously input guesses and hints. It is also \
possible that the opponent is using a different word list.\n');
			matches = prev_matches;
			continue;
		}

		guess_list.push(guess);
		hint_list.push(hint);

		var actual_bits = Math.log2(prev_matches.length) - Math.log2(matches.length);

		display_summary(matches, expected_bits, actual_bits, 
			guess_list, hint_list, guess, '');

		if ((guess == secret) || (hint == 'ggggg')) {
			return true;
		}

		page_num = 0;
		cheat = false;
	}
}

//
// Auto play mode
//
const SLEEP_TIME = 2500;
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
  }

async function run_play_loop(words, n) {
	for (var i = 0; i < n; i++) {
		console.log('\n');
		console.clear();
		console.log('\x1b[1;32m%s%d\x1b[0m', 'Game: ' , i + 1);
		sleep(SLEEP_TIME);
		play_one_game(words);
	}
}

function play_one_game(words) {
	
	var matches = words;

	var page_num = 0; 
	var guess_list = []; var hint_list = [];
	var secret = generate_secret(words);

	while (true) {
	    display_results(matches, page_num);

	    var guess = generate_random_guess(matches);
		var hint = generate_pattern(guess, secret);
	    var expected_bits = 0.0;

		var entry = lookup_in_dictionary(guess, words);
		expected_bits = entry[EXPECTED];

		var prev_matches = matches;
		matches = filter_words (hint, matches, guess);
		var actual_bits = Math.log2(prev_matches.length) - Math.log2(matches.length);

		guess_list.push(guess);
		hint_list.push(hint);

		display_summary(matches, expected_bits, actual_bits,
			guess_list, hint_list, guess, secret);

		console.log('');
		sleep(SLEEP_TIME);
	    
		if (guess == secret) {
			return true;
		}
		page_num = 0;
	}
}

var rgxargs= '^([4-8]|[atm])$';
var badargs = 'Bad command line args';

export var main = function () {

	var word_size = '';
	var play_mode = '';
	var args = process.argv.slice(2);
	
	if (args.length) {
		var regex = new RegExp(rgxargs);
		if (args[0].match(regex) == null) {
			console.log(badargs);
			return false;
		}

		if (args.length == 1) {
			if (isNaN(args[0]))
				play_mode = args[0];
			else
				word_size = args[0];
		}
		else if (args.length == 2) {
			if (isNaN(args[0]) 
				|| (args[1] != 'a' && args[1] != 't' && args[1] != 'm')) {
				console.log(badargs);
				return false;
			}
			word_size = args[0];
			play_mode = args[1];
		}
		else {
			console.log(badargs);
			return false;
		}
	}
	return async_main(word_size, play_mode);
}
			
main();
//	https://wordlegame.org?challenge=c2Nhcnk
// #sourceMappingURL=wordl.map

