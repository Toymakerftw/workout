import { exercisesData } from './exerciseData';

// --- New Helper Function for Delay ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Updated generateCustomWorkout Function ---
export const generateCustomWorkout = async (apiKey, userData) => {
    const { height, weight, aim, additionalNotes } = userData;
    const MAX_RETRIES = 3; // Maximum number of times to retry the API call
    let waitTime = 1000; // Starting delay (1 second)

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

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            // --- CORE LOGIC (FIRST ATTEMPT: JSON MimeType) ---
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.7,
                        maxOutputTokens: 2000
                    }
                })
            });

            if (!response.ok) {
                // Check for server-side errors (429, 503, 504) that should trigger a retry
                if ([429, 503, 504].includes(response.status) && attempt < MAX_RETRIES - 1) {
                    console.warn(`Attempt ${attempt + 1} failed with status ${response.status}. Retrying in ${waitTime / 1000}s...`);
                    await delay(waitTime);
                    waitTime *= 2; // Exponential backoff
                    continue; // Skip the rest of the loop and start the next attempt
                }

                // For fatal errors (e.g., 400 Bad Request, 401 Unauthorized) or last attempt
                const errorData = await response.json();
                throw new Error(`API request failed: ${errorData.error?.message || response.status}`);
            }

            const data = await response.json();
            let responseContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

            // --- FALLBACK LOGIC (SECOND ATTEMPT: Standard Text Response) ---
            if (!responseContent) {
                console.log('JSON MimeType failed to return content. Falling back to text response.');
                
                // This entire block of fallback logic is executed *only once* // per successful 'fetch', or per loop iteration if the fetch succeeded but returned no content.
                const textResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 2000
                        }
                    })
                });

                if (!textResponse.ok) {
                    // Note: If the fallback fails with a server error, 
                    // this will be handled as a fatal error unless you add another retry layer here.
                    const errorData = await textResponse.json();
                    throw new Error(`API request (fallback) failed: ${errorData.error?.message || textResponse.status}`);
                }

                const textData = await textResponse.json();
                const textContent = textData.candidates?.[0]?.content?.parts?.[0]?.text;

                const jsonMatch = textContent?.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    responseContent = jsonMatch[0];
                } else {
                    throw new Error('Could not extract JSON from response');
                }
            }
            // --- END FALLBACK LOGIC ---

            if (!responseContent) {
                throw new Error('No content received from Gemini API');
            }

            try {
                // If everything succeeded, parse and return
                return JSON.parse(responseContent);
            } catch (parseError) {
                console.error('Error parsing JSON from API response:', parseError);
                console.log('Raw response:', responseContent);
                throw new Error('Invalid JSON response from API');
            }

        } catch (error) {
            // This catches errors from parsing, failed fallbacks, and fatal fetch errors (not 5xx/429)
            // If it was a retryable error, the 'continue' would have skipped this block.
            console.error(`Fatal error on attempt ${attempt + 1}:`, error);
            throw error;
        }
    }

    // If the loop finishes without returning, it means all retries failed
    throw new Error(`API call failed after ${MAX_RETRIES} attempts due to model overload or server error.`);
};