import commandParser from './command-parser';

const noEmojinaryPhrase = 'There seems to be no current Emojinary to solve :disappointed:';

let current = {};
let lastSolve = {};

const newEmojinary = (emojinary) => {
  if (current.answer) {
    return 'Sorry, there is currently an Emojinary in play! See what it is! `/emojinary current`';
  }

  if (!emojinary.emojinary) {
    return `You need to pass an Emojinary!
      \`/emojinary new emojinary=[ :some: :emoji: :phrase: ] hint=[ some hint here ] answer=[ emojinary! ]\``;
  }

  if (!emojinary.answer) {
    return `Please provide an answer! :bulb: :blue_book:
      \`${emojinary.emojinary}\``;
  }

  current = emojinary;
  return 'Emojinary set! :smile:';
};

const getCurrent = () => {
  if (!current.answer) {
    if (lastSolve.answer) {
      return `${noEmojinaryPhrase}
        The last one was solved by ${lastSolve.user}
        the answer to ${lastSolve.emojinary} was *${lastSolve.answer}*`;
    } else {
      return noEmojinaryPhrase;
    }
  }

  return current.emojinary;
};

const getHint = () => {
  if (!current.answer) {
    if (lastSolve.answer) {
      return `${noEmojinaryPhrase}
        The last one was solved by ${lastSolve.user}
        the answer to ${lastSolve.emojinary} was *${lastSolve.answer}*`;
    } else {
      return noEmojinaryPhrase;
    }
  }

  if (!current.hint) {
    return 'Sorry, no hint for this one! :sweat:';
  }

  return current.hint;
};

const solve = (guess, user) => {
  if (!guess) {
    return 'Please provide an answer! :bulb: :blue_book:';
  }

  if (!current.answer) {
    if (lastSolve.answer) {
      return `${noEmojinaryPhrase}
        The last one was solved by *${lastSolve.user}*
        Emojinary: ${lastSolve.emojinary}
        Answer: *${lastSolve.answer}*`;
    } else {
      return noEmojinaryPhrase;
    }
  }

  let regex = new RegExp(guess, 'i');

  if (!regex.test(current.answer)) {
    return 'Sorry chap! Try again! :tophat: :back:';
  }

  const {emojinary, answer} = current;

  lastSolve = {
    user,
    emojinary,
    answer
  };

  current = {};
  return 'Great job! You solved it! :tada: :trumpet: :confetti_ball:';
};

export default {
  command (request, reply) {
    var userCommand = commandParser(request.payload.text);

    switch (userCommand.action) {
      case 'new':
        reply(newEmojinary(userCommand))
          .type('text/plain');
        break;
      case 'current':
        reply(getCurrent())
          .type('text/plain');
        break;
      case 'hint':
        reply(getHint())
          .type('text/plain');
        break;
      case 'solve':
        reply(solve(userCommand.answer, request.payload.user_name))
          .type('text/plain');
        break;
      default:
        reply(getCurrent())
          .type('text/plain');
        break;
    }
  }
};
