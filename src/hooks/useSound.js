import { Howl } from 'howler';

const sounds = {
  start: new Howl({
    src: ['/sounds/start.mp3']
  }),
  end: new Howl({
    src: ['/sounds/end.mp3']
  }),
  click: new Howl({
    src: ['/sounds/click.mp3']
  }),
  exercise: new Howl({
    src: ['/sounds/exercise.mp3']
  }),
  break: new Howl({
    src: ['/sounds/break.mp3']
  }),
  finish: new Howl({
    src: ['/sounds/finish.mp3']
  }),
  tick: new Howl({
    src: ['/sounds/tick.mp3']
  })
};

export const useSound = () => {
  const playSound = (soundName) => {
    if (sounds[soundName]) {
      sounds[soundName].play();
    }
  };

  return { playSound };
};
