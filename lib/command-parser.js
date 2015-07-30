import each from 'lodash.foreach';

const actionRegex = /^(\w*)\s*/;
const solveRegex = /^solve\s+([:\w\d\s\.\!\-_]+)/;
const newRegex = /([\w]+=\[[:\w\d\s\.\!\-_]+\])/g;
const teamMemberRegex = /^stats\s+@([:\w\d\s\.\!\-_]+)/;

export default (actionString) => {
  actionString = actionString.trim();
  var action = actionRegex.exec(actionString);

  if (action === null) {
    return undefined;
  }

  switch (action[1]) {
    case 'solve':
      let answer = solveRegex.exec(actionString.trim());

      if (answer === null) {
        answer = undefined;
      } else {
        answer = answer[1];
      }

      return {
        action: action[1],
        answer: answer
      };

    case 'new':
      let ret = {
        action: action[1]
      };

      let params = actionString.match(newRegex);

      each(params, (p) => {
        let parts = p.split('=');
        ret[parts[0]] = parts[1]
          .replace('[', '')
          .replace(']', '')
          .trim();
      });

      return ret;

    case 'stats':
      let teamMember = teamMemberRegex.exec(actionString.trim());

      if (teamMember === null) {
        teamMember = undefined;
      } else {
        teamMember = teamMember[1];
      }

      return {
        action: action[1],
        teamMember: teamMember
      };

    default:
      return { action: action[1] };
  }
};
