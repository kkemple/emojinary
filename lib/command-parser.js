import each from 'lodash.foreach';

const actionRegex = /^(\w*)\s*/;
const solveRegex = /^solve\s+([:\w\d\s\.\!\-_]+)/;
const newRegex = /([\w]+=\[[:\w\d\s\.\!\-_]+\])/g;

export default (actionString) => {
  actionString = actionString.trim();
  var action = actionRegex.exec(actionString);

  if (action === null) {
    return undefined;
  }

  switch (action[1]) {
    case 'solve':
      return {
        action,
        answer: solveRegex.exec(actionString)[1]
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

    default:
      return { action: action[1] };
  }
};
