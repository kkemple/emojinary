import db from '../db';
import Emojinary from './emojinary';

export default db.Model.extend({
  tableName: 'team',
  hasTimestamps: true,

  emojinary () {
    return this.hasMany(Emojinary);
  }
});
