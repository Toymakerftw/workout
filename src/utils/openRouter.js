export const generateCustomWorkout = async (apiKey, userData) => {
  const { height, weight, aim, additionalNotes } = userData;
  
  const prompt = `
    Create a personalized workout plan based on the following information:
    
    - Height: ${height} cm
    - Weight: ${weight} kg
    - Goal/Aim: ${aim}
    ${additionalNotes ? `- Additional notes: ${additionalNotes}` : ''}
    
    The workout should be safe, effective, and appropriate for the user's physical characteristics.
    Include:
    1. A workout name and brief description
    2. A list of exercises with:
       - Exercise name
       - Sets and reps/recommendations
       - Brief description of how to perform the exercise
       - Difficulty level
    3. Estimated duration of the workout
    4. Number of exercises
    5. Any safety recommendations
    
    Please format the response as JSON with the following structure:
    {
      "name": "Workout name",
      "description": "Brief description",
      "duration": "e.g., '20-30 min'",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": "e.g., '3 sets of 10 reps'",
          "description": "How to perform the exercise",
          "difficulty": "beginner/intermediate/advanced"
        }
      ],
      "safetyRecommendations": ["List of safety recommendations"]
    }
    
    Make sure the response is valid JSON.
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
            role: 'user',
            content: prompt
          }
        ],
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

    // Extract JSON from the response (in case it's wrapped in markdown code blocks)
    const jsonMatch = responseContent.match(/```json\n?([\s\S]*?)\n?```|```([\s\S]*?)```|({[\s\S]*})/);
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[2] || jsonMatch[3]) : responseContent;

    try {
      return JSON.parse(jsonString);
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