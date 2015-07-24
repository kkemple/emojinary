import db from '../db';

export default db.Model.extend({
  tableName: 'emojinary',
  hasTimestamps: true
});
