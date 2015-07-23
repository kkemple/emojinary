import db from '../lib/db';

export default db.Model.extend({
  tableName: 'emojinary',
  hasTimestamps: true
});
