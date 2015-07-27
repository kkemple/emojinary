export default () => {
  const avatars = [
    'octopus',
    'dolphin',
    'hippo',
    'kangaroo',
    'elephant',
    'rooster',
    'owl',
    'panda',
    'tiger'
  ];

  return avatars[Math.floor(Math.random() * avatars.length)];
};
