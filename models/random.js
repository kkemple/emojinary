import Promise from 'bluebird';

import db from '../db';

export default db.Model.extend({
  tableName: 'random',

  count () {
    return db
      .knex('random')
      .count('emojinary')
      .then((data) => Promise.resolve(parseInt(data[0].count), 10));
  }
});
