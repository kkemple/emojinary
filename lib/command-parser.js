import each from 'lodash.foreach';

const actionRegex = /^(\w*)\s*/;
const solveRegex = /^solve\s+([:\w\d\s\.\!\-_]+)/;
const newRegex = /([\w]+=\[[:\w\d\s\.\!\-_]+\])/g;

export default (actionString) => {
  var action = actionRegex.exec(actionString.trim())[1];

  switch (action) {
    case 'solve':
      return {
        action,
        answer: solveRegex.exec(actionString.trim())[1]
      };

    case 'new':
      let ret = {
        action
      };

      let params = actionString.trim().match(newRegex);

      each(params, (p) => {
        let parts = p.split('=');
        ret[parts[0]] = parts[1]
          .replace('[', '')
          .replace(']', '')
          .trim();
      });

      return ret;

    default:
      return { action };
  }
};
