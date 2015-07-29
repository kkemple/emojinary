import map from 'lodash.map';

export default () => {
  const emojinaries = [
    ['100', 'umbrella', 'ocean', 'boat'],
    ['it', 'horse', 'facepunch', 'ru'],
    ['smile', 'camera'],
    ['calendar', 'last_quarter_moon_with_face', 'bulb', 'football'],
    ['person_with_blond_hair', 'wrench', 'battery', 'nut_and_bolt'],
    ['confused', 'bell', 'notes', 'question'],
    ['person_with_blond_hair', 'telephone', 'telephone'],
    ['computer', 'sunglasses', 'raised_hand', 'gun'],
    ['fire', 'bathtub', 'watch', 'computer']
  ];

  const x = Math.floor(Math.random() * emojinaries.length);

  return map(emojinaries[x], (e) => {
    return `<img src="/images/emoji/${e}.png">`;
  }).join('\n');
};
