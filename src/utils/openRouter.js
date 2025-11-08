import { exercisesData } from './exerciseData';

export const generateCustomWorkout = async (apiKey, userData) => {
  const { height, weight, aim, additionalNotes } = userData;
  
  const availableExercises = Object.values(exercisesData).map(e => ({
    name: e.name,
    description: e.description,
    category: e.category,
    muscles: e.muscles
  }));

  const prompt = `
    You are a fitness assistant. Create a personalized workout plan based on the user's information and the provided list of available exercises.

    User Information:
    - Height: ${height} cm
    - Weight: ${weight} kg
    - Goal/Aim: ${aim}
    ${additionalNotes ? `- Additional notes: ${additionalNotes}` : ''}

    Available Exercises (choose from this list only):
    ${JSON.stringify(availableExercises, null, 2)}

    Please generate a workout plan and respond with a valid JSON object. The JSON object should have the following structure:
    {
      "name": "Workout name (e.g., 'Full Body Strength')",
      "description": "A brief, encouraging description of the workout's purpose.",
      "exercises": [
        {
          "name": "Exercise name from the provided list"
        }
      ]
    }

    Only include exercises from the provided list. Do not invent new exercises.
  `;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Feeel Web App'
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4-fast',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful fitness assistant that creates personalized workout plans based on user data and a specific list of available exercises. You must only use exercises from the provided list and respond in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const responseContent = data.choices[0]?.message?.content;

    try {
      return JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing JSON from API response:', parseError);
      console.log('Raw response:', responseContent);
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};