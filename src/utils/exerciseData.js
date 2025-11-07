// Exercise data for the Feeel Web app
export const exercisesData = {
  pushup: {
    id: 1,
    name: 'Push-ups',
    description: 'Standard push-ups to strengthen your chest, shoulders, and triceps',
    category: 'strength',
    muscles: ['chest', 'shoulders', 'triceps'],
    image: 'pushUps' // matches the original file name
  },
  squat: {
    id: 2,
    name: 'Squats',
    description: 'Bodyweight squats to work your legs and glutes',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings'],
    image: 'squats' // matches the original file name
  },
  plank: {
    id: 3,
    name: 'Plank',
    description: 'Hold the plank position to strengthen your core',
    category: 'strength',
    muscles: ['core', 'abs', 'back'],
    image: 'forearmPlank' // matches the original file name
  },
  lunge: {
    id: 4,
    name: 'Lunges',
    description: 'Alternating lunges for leg strength and balance',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings'],
    image: 'lunges' // matches the original file name
  },
  'jumping-jack': {
    id: 5,
    name: 'Jumping Jacks',
    description: 'Full body cardio exercise',
    category: 'cardio',
    muscles: ['full body'],
    image: 'jumpingJacks' // matches the original file name
  },
  'high-knees': {
    id: 6,
    name: 'High Knees',
    description: 'Run in place with high knees',
    category: 'cardio',
    muscles: ['core', 'hip flexors', 'quadriceps'],
    image: 'highKnees' // matches the original file name
  },
  burpee: {
    id: 7,
    name: 'Burpees',
    description: 'Full body exercise combining squat, push-up, and jump',
    category: 'cardio',
    muscles: ['full body'],
    image: 'fourCountBurpees' // matches the original file name
  },
  'mountain-climber': {
    id: 8,
    name: 'Mountain Climbers',
    description: 'Core and cardio exercise',
    category: 'cardio',
    muscles: ['core', 'shoulders', 'hip flexors'],
    image: 'mountainClimbers' // matches the original file name
  },
  'jump-rope': {
    id: 9,
    name: 'Jump Rope',
    description: 'Simulate jump rope exercise',
    category: 'cardio',
    muscles: ['calves', 'forearms', 'cardio'],
    image: 'jumpRopeBasic' // matches the original file name
  },
  rest: {
    id: 10,
    name: 'Rest',
    description: 'Take a breather and recover',
    category: 'recovery',
    muscles: ['recovery'],
    image: 'childsPose' // Using child's pose as a resting image
  },
  'chair-dips': {
    id: 11,
    name: 'Chair Dips',
    description: 'Tricep dips using a chair',
    category: 'strength',
    muscles: ['triceps', 'shoulders'],
    image: 'tricepsDips' // matches the original file name
  },
  'pushup-rotation': {
    id: 12,
    name: 'Push-up Rotations',
    description: 'Push-ups with rotation for core engagement',
    category: 'strength',
    muscles: ['chest', 'shoulders', 'core'],
    image: 'pushUpRotations' // matches the original file name
  },
  'glute-bridge': {
    id: 13,
    name: 'Glute Bridges',
    description: 'Lift hips while lying on back to target glutes',
    category: 'strength',
    muscles: ['glutes', 'hamstrings', 'core'],
    image: 'kneelingKickbacks' // closest match for glute exercise
  },
  'tricep-dip': {
    id: 14,
    name: 'Tricep Dips',
    description: 'Dips focusing on the triceps',
    category: 'strength',
    muscles: ['triceps', 'shoulders'],
    image: 'tricepsDips' // matches the original file name
  },
  'leg-raise': {
    id: 15,
    name: 'Leg Raises',
    description: 'Lie on back and raise legs to work lower abs',
    category: 'strength',
    muscles: ['lower abs', 'hip flexors'],
    image: 'legRaises' // matches the original file name
  },
  'neck-turns': {
    id: 16,
    name: 'Neck Turns',
    description: 'Gentle neck rotations for mobility',
    category: 'stretch',
    muscles: ['neck', 'upper back'],
    image: 'headTurns' // matches the original file name
  },
  'shoulder-shrugs': {
    id: 17,
    name: 'Shoulder Shrugs',
    description: 'Roll shoulders back and forth to release tension',
    category: 'stretch',
    muscles: ['trapezius', 'shoulders'],
    image: 'shoulderShrug' // matches the original file name
  },
  'arm-circles': {
    id: 18,
    name: 'Arm Circles',
    description: 'Rotate arms forward and backward for shoulder mobility',
    category: 'stretch',
    muscles: ['shoulders', 'upper back'],
    image: 'armCirclesFW' // matches the original file name
  },
  'side-bends': {
    id: 19,
    name: 'Side Bends',
    description: 'Gentle side stretches',
    category: 'stretch',
    muscles: ['obliques', 'sides'],
    image: 'lateralNeckStretch' // not perfect but a stretching exercise
  },
  'calf-stretches': {
    id: 20,
    name: 'Calf Stretches',
    description: 'Stretch calves against wall',
    category: 'stretch',
    muscles: ['calves', 'achilles'],
    image: 'singleLegCalfRaises' // matches the original file name
  },
  'childs-pose': {
    id: 21,
    name: 'Child\'s Pose',
    description: 'Resting pose for recovery',
    category: 'stretch',
    muscles: ['hips', 'thighs', 'ankles'],
    image: 'childsPose' // matches the original file name
  }
};

// Workout exercises mapping
export const workoutExercises = {
  1: [
    { ...exercisesData.pushup, duration: 30 },
    { ...exercisesData.squat, duration: 30 },
    { ...exercisesData.plank, duration: 30 },
    { ...exercisesData.lunge, duration: 30 },
    { ...exercisesData['jumping-jack'], duration: 30 },
  ],
  2: [
    { ...exercisesData['jumping-jack'], duration: 30 },
    { ...exercisesData['high-knees'], duration: 30 },
    { ...exercisesData.burpee, duration: 45 },
    { ...exercisesData['mountain-climber'], duration: 30 },
    { ...exercisesData['jump-rope'], duration: 45 },
    { ...exercisesData.rest, duration: 30 },
    { ...exercisesData['high-knees'], duration: 30 },
    { ...exercisesData.burpee, duration: 45 },
  ],
  3: [
    { ...exercisesData.pushup, duration: 45 },
    { ...exercisesData.squat, duration: 45 },
    { ...exercisesData['chair-dips'], duration: 45 },
    { ...exercisesData.lunge, duration: 45 },
    { ...exercisesData.plank, duration: 60 },
    { ...exercisesData['pushup-rotation'], duration: 45 },
    { ...exercisesData['glute-bridge'], duration: 45 },
    { ...exercisesData['tricep-dip'], duration: 45 },
    { ...exercisesData['leg-raise'], duration: 45 },
    { ...exercisesData.rest, duration: 60 },
  ],
  4: [
    { ...exercisesData['neck-turns'], duration: 15 },
    { ...exercisesData['shoulder-shrugs'], duration: 15 },
    { ...exercisesData['arm-circles'], duration: 15 },
    { ...exercisesData['side-bends'], duration: 15 },
    { ...exercisesData['calf-stretches'], duration: 15 },
    { ...exercisesData['childs-pose'], duration: 30 },
  ],
};