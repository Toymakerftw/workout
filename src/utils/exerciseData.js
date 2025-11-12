// Exercise data for the Chapter Two app
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
  },
  'wall-sit': {
    id: 22,
    name: 'Wall Sit',
    description: 'Sit against a wall to strengthen your thighs',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings'],
    image: 'wallSit' // matches the original file name
  },
  'ab-crunches': {
    id: 23,
    name: 'Ab Crunches',
    description: 'Classic abdominal crunches to strengthen your core',
    category: 'strength',
    muscles: ['abs', 'core'],
    image: 'abCrunches' // matches the original file name
  },
  'step-ups': {
    id: 24,
    name: 'Step-ups',
    description: 'Step up and down on a platform to work your legs',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings'],
    image: 'stepUps' // matches the original file name
  },
  'side-plank-left': {
    id: 25,
    name: 'Side Plank Left',
    description: 'Hold a side plank position on your left side',
    category: 'strength',
    muscles: ['obliques', 'core', 'shoulders'],
    image: 'sidePlank' // matches the original file name
  },
  'side-plank-right': {
    id: 26,
    name: 'Side Plank Right',
    description: 'Hold a side plank position on your right side',
    category: 'strength',
    muscles: ['obliques', 'core', 'shoulders'],
    image: 'sidePlank' // matches the original file name
  },
  'side-split-squats-left': {
    id: 27,
    name: 'Side Split Squats Left',
    description: 'Squat to the side while keeping the other leg extended',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'adductors'],
    image: 'sideSplitSquats' // matches the original file name
  },
  'side-split-squats-right': {
    id: 28,
    name: 'Side Split Squats Right',
    description: 'Squat to the side while keeping the other leg extended',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'adductors'],
    image: 'sideSplitSquats' // matches the original file name
  },
  'bulgarian-split-squats-left': {
    id: 29,
    name: 'Bulgarian Split Squats Left',
    description: 'Single leg squat with rear foot elevated',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings'],
    image: 'bulgarianSplitSquats' // matches the original file name
  },
  'bulgarian-split-squats-right': {
    id: 30,
    name: 'Bulgarian Split Squats Right',
    description: 'Single leg squat with rear foot elevated',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings'],
    image: 'bulgarianSplitSquats' // matches the original file name
  },
  'pistol-squats-left': {
    id: 31,
    name: 'Pistol Squats Left',
    description: 'Single leg squat on one leg while extending the other',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings', 'calves'],
    image: 'pistolSquats' // matches the original file name
  },
  'pistol-squats-right': {
    id: 32,
    name: 'Pistol Squats Right',
    description: 'Single leg squat on one leg while extending the other',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings', 'calves'],
    image: 'pistolSquats' // matches the original file name
  },
  'calf-raises-left': {
    id: 33,
    name: 'Calf Raises Left',
    description: 'Raise up on your left toes to work your calf muscles',
    category: 'strength',
    muscles: ['calves'],
    image: 'singleLegCalfRaises' // matches the original file name
  },
  'calf-raises-right': {
    id: 34,
    name: 'Calf Raises Right',
    description: 'Raise up on your right toes to work your calf muscles',
    category: 'strength',
    muscles: ['calves'],
    image: 'singleLegCalfRaises' // matches the original file name
  },
  'split-squats-left': {
    id: 35,
    name: 'Split Squats Left',
    description: 'Split stance squat focusing on one leg at a time',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings'],
    image: 'splitSquats' // matches the original file name
  },
  'split-squats-right': {
    id: 36,
    name: 'Split Squats Right',
    description: 'Split stance squat focusing on one leg at a time',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings'],
    image: 'splitSquats' // matches the original file name
  },
  'arm-circles-backward': {
    id: 37,
    name: 'Arm Circles Backward',
    description: 'Rotate arms backward for shoulder mobility',
    category: 'stretch',
    muscles: ['shoulders', 'upper back'],
    image: 'armCirclesBW' // matches the original file name
  },
  'pike-pushups': {
    id: 38,
    name: 'Pike Pushups',
    description: 'Incline pushups with hips raised to target shoulders',
    category: 'strength',
    muscles: ['shoulders', 'triceps', 'upper chest'],
    image: 'pikePushUps' // matches the original file name
  },
  'no-pushup-burpee': {
    id: 39,
    name: 'No Push-up Burpees',
    description: 'Burpees without the push-up for easier alternative',
    category: 'cardio',
    muscles: ['full body'],
    image: 'noPushUpBurpees' // matches the original file name
  },
  'squat-thrusts': {
    id: 40,
    name: 'Squat Thrusts',
    description: 'Squat down and jump up, similar to burpees without push-up',
    category: 'cardio',
    muscles: ['full body'],
    image: 'squatThrusts' // matches the original file name
  },
  'reverse-lunges': {
    id: 41,
    name: 'Reverse Lunges',
    description: 'Lunges stepping backward instead of forward',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'hamstrings'],
    image: 'reverseLunges' // matches the original file name
  },
  'high-plank': {
    id: 42,
    name: 'High Plank',
    description: 'Standard plank position on hands instead of forearms',
    category: 'strength',
    muscles: ['core', 'shoulders', 'back'],
    image: 'highPlank' // matches the original file name
  },
  'pull-up': {
    id: 43,
    name: 'Pull-up',
    description: 'Pull yourself up on a bar to strengthen back and arms',
    category: 'strength',
    muscles: ['latissimus dorsi', 'biceps', 'rhomboids'],
    image: 'pullUps' // matches the original file name
  },
  'kettlebell-deadlift': {
    id: 44,
    name: 'Kettlebell Deadlift',
    description: 'Lift kettlebell from ground with proper deadlift form',
    category: 'strength',
    muscles: ['hamstrings', 'glutes', 'erector spinae', 'trapezius'],
    image: 'kettlebellDeadlift' // matches the original file name
  },
  'sumo-squat': {
    id: 45,
    name: 'Sumo Squat',
    description: 'Wide stance squat with toes pointed outward',
    category: 'strength',
    muscles: ['quadriceps', 'glutes', 'adductors'],
    image: 'sumoSquats' // matches the original file name
  },
  'shoulder-rotation-forward': {
    id: 46,
    name: 'Shoulder Rotation Forward',
    description: 'Circle shoulders forward to improve mobility',
    category: 'stretch',
    muscles: ['shoulders', 'upper back'],
    image: 'shoulderRotationFW' // matches the original file name
  },
  'shoulder-rotation-backward': {
    id: 47,
    name: 'Shoulder Rotation Backward',
    description: 'Circle shoulders backward to improve mobility',
    category: 'stretch',
    muscles: ['shoulders', 'upper back'],
    image: 'shoulderRotationBW' // matches the original file name
  },
  'chin-tuck': {
    id: 48,
    name: 'Chin Tuck',
    description: 'Bring chin toward chest to stretch neck and improve posture',
    category: 'stretch',
    muscles: ['neck', 'suboccipital muscles'],
    image: 'chinTuck' // matches the original file name
  },
  'back-neck-stretch': {
    id: 49,
    name: 'Back Neck Stretch',
    description: 'Stretch the back of your neck and upper back muscles',
    category: 'stretch',
    muscles: ['neck', 'upper back'],
    image: 'backNeckStretch' // matches the original file name
  },
  'lateral-neck-stretch-left': {
    id: 50,
    name: 'Lateral Neck Stretch Left',
    description: 'Tilt head to the left to stretch the right side of the neck',
    category: 'stretch',
    muscles: ['neck', 'levator scapulae'],
    image: 'lateralNeckStretch' // matches the original file name
  },
  'lateral-neck-stretch-right': {
    id: 51,
    name: 'Lateral Neck Stretch Right',
    description: 'Tilt head to the right to stretch the left side of the neck',
    category: 'stretch',
    muscles: ['neck', 'levator scapulae'],
    image: 'lateralNeckStretch' // matches the original file name
  },
  'front-neck-stretch': {
    id: 52,
    name: 'Front Neck Stretch',
    description: 'Stretches the front of the neck and throat muscles',
    category: 'stretch',
    muscles: ['neck', 'sternocleidomastoid'],
    image: 'frontNeckStretch' // matches the original file name
  },
  'alternating-bicep-curls': {
    id: 53,
    name: 'Alternating Bicep Curls',
    description: 'Curl each arm alternately to work the bicep muscles',
    category: 'strength',
    muscles: ['biceps', 'forearms'],
    image: 'alternatingBicepCurls' // matches the original file name
  },
  'levator-scapulae-stretch-left': {
    id: 54,
    name: 'Levator Scapulae Stretch Left',
    description: 'Stretches the muscles between neck and shoulder blade',
    category: 'stretch',
    muscles: ['levator scapulae'],
    image: 'levatorScapulaeStretch' // matches the original file name
  },
  'levator-scapulae-stretch-right': {
    id: 55,
    name: 'Levator Scapulae Stretch Right',
    description: 'Stretches the muscles between neck and shoulder blade',
    category: 'stretch',
    muscles: ['levator scapulae'],
    image: 'levatorScapulaeStretch' // matches the original file name
  },
  'neck-circles-clockwise': {
    id: 56,
    name: 'Neck Circles Clockwise',
    description: 'Gentle neck rotations in a clockwise direction',
    category: 'stretch',
    muscles: ['neck', 'upper back'],
    image: 'neckCirclesCW' // matches the original file name
  },
  'neck-circles-counterclockwise': {
    id: 57,
    name: 'Neck Circles Counterclockwise',
    description: 'Gentle neck rotations in a counterclockwise direction',
    category: 'stretch',
    muscles: ['neck', 'upper back'],
    image: 'neckCirclesCCW' // matches the original file name
  },
  'neck-half-circles': {
    id: 58,
    name: 'Neck Half Circles',
    description: 'Gentle neck movement from shoulder to shoulder',
    category: 'stretch',
    muscles: ['neck', 'upper back'],
    image: 'neckHalfCircles' // matches the original file name
  },
  'head-tilts': {
    id: 59,
    name: 'Head Tilts',
    description: 'Gentle head tilting movements for neck mobility',
    category: 'stretch',
    muscles: ['neck', 'upper back'],
    image: 'headTilts' // matches the original file name
  },
  'quadruped-thoracic-rotation-left': {
    id: 60,
    name: 'Quadruped Thoracic Rotation Left',
    description: 'Rotation exercise on all fours to improve spine mobility',
    category: 'stretch',
    muscles: ['thoracic spine', 'core'],
    image: 'quadrupedThoracicRotation' // matches the original file name
  },
  'quadruped-thoracic-rotation-right': {
    id: 61,
    name: 'Quadruped Thoracic Rotation Right',
    description: 'Rotation exercise on all fours to improve spine mobility',
    category: 'stretch',
    muscles: ['thoracic spine', 'core'],
    image: 'quadrupedThoracicRotation' // matches the original file name
  },
  'shoulder-dislocates': {
    id: 62,
    name: 'Shoulder Dislocates',
    description: 'Movement to improve shoulder mobility and flexibility',
    category: 'stretch',
    muscles: ['shoulders', 'upper back'],
    image: 'shoulderDislocates' // matches the original file name
  },
  'bent-over-row-to-external-rotation': {
    id: 63,
    name: 'Bent Over Row to External Rotation',
    description: 'Compound movement for back and shoulder strengthening',
    category: 'strength',
    muscles: ['rhomboids', 'middle trapezius', 'posterior deltoids'],
    image: 'bentOverRowToExternalRotation' // matches the original file name
  },
  'ywts': {
    id: 64,
    name: 'YWTs',
    description: 'Exercise forming Y, W, and T shapes to strengthen shoulders',
    category: 'strength',
    muscles: ['posterior deltoids', 'rhomboids', 'middle trapezius'],
    image: 'YWTs' // matches the original file name
  }
};

// Workout exercises mapping - Normalized

export const workoutExercises = {

  1: [

    { exerciseId: 'pushup', duration: 30 },

    { exerciseId: 'squat', duration: 30 },

    { exerciseId: 'plank', duration: 30 },

    { exerciseId: 'lunge', duration: 30 },

    { exerciseId: 'jumping-jack', duration: 30 },

    { exerciseId: 'wall-sit', duration: 30 },

    { exerciseId: 'ab-crunches', duration: 30 }

  ],

  2: [

    { exerciseId: 'jumping-jack', duration: 30 },

    { exerciseId: 'high-knees', duration: 30 },

    { exerciseId: 'burpee', duration: 45 },

    { exerciseId: 'mountain-climber', duration: 30 },

    { exerciseId: 'jump-rope', duration: 45 },

    { exerciseId: 'rest', duration: 30 },

    { exerciseId: 'high-knees', duration: 30 },

    { exerciseId: 'burpee', duration: 45 },

    { exerciseId: 'no-pushup-burpee', duration: 45 },

    { exerciseId: 'squat-thrusts', duration: 45 }

  ],

  3: [

    { exerciseId: 'pushup', duration: 45 },

    { exerciseId: 'squat', duration: 45 },

    { exerciseId: 'chair-dips', duration: 45 },

    { exerciseId: 'lunge', duration: 45 },

    { exerciseId: 'plank', duration: 60 },

    { exerciseId: 'pushup-rotation', duration: 45 },

    { exerciseId: 'glute-bridge', duration: 45 },

    { exerciseId: 'tricep-dip', duration: 45 },

    { exerciseId: 'leg-raise', duration: 45 },

    { exerciseId: 'pike-pushups', duration: 45 },

    { exerciseId: 'step-ups', duration: 45 },

    { exerciseId: 'rest', duration: 60 }

  ],

  4: [

    { exerciseId: 'neck-turns', duration: 15 },

    { exerciseId: 'shoulder-shrugs', duration: 15 },

    { exerciseId: 'arm-circles', duration: 15 },

    { exerciseId: 'side-bends', duration: 15 },

    { exerciseId: 'calf-stretches', duration: 15 },

    { exerciseId: 'childs-pose', duration: 30 },

    { exerciseId: 'shoulder-rotation-forward', duration: 15 },

    { exerciseId: 'shoulder-rotation-backward', duration: 15 },

    { exerciseId: 'chin-tuck', duration: 15 },

    { exerciseId: 'head-tilts', duration: 15 },

    { exerciseId: 'back-neck-stretch', duration: 30 }

  ],

  5: [

    { exerciseId: 'ab-crunches', duration: 30 },

    { exerciseId: 'reverse-lunges', duration: 30 },

    { exerciseId: 'sumo-squat', duration: 30 },

    { exerciseId: 'calf-raises-left', duration: 30 },

    { exerciseId: 'calf-raises-right', duration: 30 },

    { exerciseId: 'split-squats-left', duration: 30 },

    { exerciseId: 'split-squats-right', duration: 30 },

    { exerciseId: 'pistol-squats-left', duration: 20 },

    { exerciseId: 'pistol-squats-right', duration: 20 },

    { exerciseId: 'rest', duration: 45 }

  ],

  6: [

    { exerciseId: 'side-plank-left', duration: 20 },

    { exerciseId: 'side-plank-right', duration: 20 },

    { exerciseId: 'lateral-neck-stretch-left', duration: 15 },

    { exerciseId: 'lateral-neck-stretch-right', duration: 15 },

    { exerciseId: 'levator-scapulae-stretch-left', duration: 20 },

    { exerciseId: 'levator-scapulae-stretch-right', duration: 20 },

    { exerciseId: 'neck-circles-clockwise', duration: 15 },

    { exerciseId: 'neck-circles-counterclockwise', duration: 15 },

    { exerciseId: 'quadruped-thoracic-rotation-left', duration: 20 },

    { exerciseId: 'quadruped-thoracic-rotation-right', duration: 20 },

    { exerciseId: 'arm-circles-backward', duration: 15 },

    { exerciseId: 'rest', duration: 30 }

  ],

  7: [

    { exerciseId: 'pull-up', duration: 15 },

    { exerciseId: 'kettlebell-deadlift', duration: 30 },

    { exerciseId: 'alternating-bicep-curls', duration: 30 },

    { exerciseId: 'ywts', duration: 20 },

    { exerciseId: 'bent-over-row-to-external-rotation', duration: 20 },

    { exerciseId: 'shoulder-dislocates', duration: 20 },

    { exerciseId: 'high-plank', duration: 30 },

    { exerciseId: 'rest', duration: 45 }

  ]

};
