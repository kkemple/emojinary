import db from '../lib/db';
import Emojinary from './emojinary';

export default db.Model.extend({
  tableName: 'team',

  emojinary () {
    return this.hasMany(Emojinary);
  }
});