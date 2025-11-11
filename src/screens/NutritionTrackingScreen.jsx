import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const NutritionTrackingScreen = () => {
  const { state } = useAppContext(); // eslint-disable-line no-unused-vars
  const [view, setView] = useState('dashboard'); // dashboard, history, camera
  const [meals, setMeals] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2000); // default calories goal
  const [loading, setLoading] = useState(true);
  
  // Camera and AI analysis state
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Load nutrition data from localStorage
  useEffect(() => {
    const storedMeals = localStorage.getItem('feeel_nutrition_meals');
    const storedGoal = localStorage.getItem('feeel_daily_calorie_goal');
    
    if (storedMeals) {
      setMeals(JSON.parse(storedMeals));
    }
    
    if (storedGoal) {
      setDailyGoal(parseInt(storedGoal));
    }
    
    setLoading(false);
  }, []);

  // Save meals to localStorage whenever meals change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('feeel_nutrition_meals', JSON.stringify(meals));
    }
  }, [meals, loading]);

  // Calculate today's nutrition stats
  const today = new Date().toLocaleDateString();
  const todaysMeals = meals.filter(meal => meal.dateString === today);
  const totalCalories = todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const totalCarbs = todaysMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const totalFat = todaysMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0);

  // Function to handle image capture
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result);
      analyzeFoodImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Function to analyze food image using Gemini API
  const analyzeFoodImage = async (base64Image) => {
    if (!state.settings.geminiApiKey) {
      alert('Please set your Gemini API key in Settings first');
      return;
    }

    setAnalyzing(true);
    
    try {
      // Remove data URL prefix to get just the base64 string
      const base64String = base64Image.split(',')[1];

      const prompt = `
        Analyze this image of food. Identify the main dish and any side dishes.
        Estimate the total calories, protein (g), carbs (g), and fat (g) for the visible portion.
        Return ONLY a valid JSON object with this structure:
        {
          "foodName": "Name of the dish",
          "description": "Short description of portion size and ingredients",
          "calories": 500,
          "protein": 30,
          "carbs": 45,
          "fat": 20
        }
        Do not add markdown formatting. Just the JSON string.
      `;

      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64String
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.settings.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
        let text = result.candidates[0].content.parts[0].text;
        // Remove markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const json = JSON.parse(text);
        setAnalysisResult(json);
      } else {
        throw new Error("Could not analyze the food in the image");
      }
    } catch (error) {
      console.error('Error analyzing food image:', error);
      alert('Error analyzing food image. Please try again.');
      setAnalysisResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  // Add a new meal
  const addMeal = (mealData) => {
    const newMeal = {
      ...mealData,
      id: Date.now().toString(),
      dateString: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString()
    };
    
    setMeals(prev => [newMeal, ...prev]);
    setAnalysisResult(null);
    setCapturedImage(null);
  };

  // Delete a meal
  const deleteMeal = (mealId) => {
    setMeals(prev => prev.filter(meal => meal.id !== mealId));
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Nutrition
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your daily nutrition intake
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Calories</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalCalories} <span className="text-sm font-normal">/ {dailyGoal}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-primary-600 h-2 rounded-full" 
              style={{ width: `${Math.min(100, (totalCalories / dailyGoal) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Remaining</div>
          <div className={`${totalCalories > dailyGoal ? 'text-red-600' : 'text-gray-900 dark:text-white'} text-2xl font-bold`}>
            {Math.max(0, dailyGoal - totalCalories)}
          </div>
        </div>
      </div>

      {/* Macro Nutrition */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Macros Today</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{totalProtein}g</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">{totalCarbs}g</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">{totalFat}g</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Fat</div>
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Meals</h2>
          <button 
            onClick={() => setView('camera')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Camera
          </button>
        </div>

        {todaysMeals.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No meals logged today.</p>
            <button 
              onClick={() => setView('camera')}
              className="mt-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Take a picture of your meal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysMeals.map(meal => (
              <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{meal.foodName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {meal.calories} cal • {meal.protein}p {meal.carbs}c {meal.fat}f
                  </div>
                </div>
                <button 
                  onClick={() => deleteMeal(meal.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // History View
  const HistoryView = () => {
    // Group meals by date
    const groupedMeals = meals.reduce((acc, meal) => {
      if (!acc[meal.dateString]) {
        acc[meal.dateString] = [];
      }
      acc[meal.dateString].push(meal);
      return acc;
    }, {});

    const sortedDates = Object.keys(groupedMeals).sort((a, b) => new Date(b) - new Date(a));

    return (
      <div className="w-full space-y-6">
        <div className="mb-6">
          <button 
            onClick={() => setView('dashboard')}
            className="flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Nutrition History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your past nutrition logs
          </p>
        </div>

        {meals.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No nutrition logs yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => {
              const dayMeals = groupedMeals[date];
              const dayCalories = dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
              return (
                <div key={date} className="card">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{date}</h3>
                    <span className="text-gray-600 dark:text-gray-300">{dayCalories} cal</span>
                  </div>
                  <div className="space-y-2">
                    {dayMeals.map(meal => (
                      <div key={meal.id} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{meal.foodName}</span>
                        <span className="text-gray-500 dark:text-gray-400">{meal.calories} cal</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Camera View
  const CameraView = () => {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="mb-6">
          <button 
            onClick={() => {
              setView('dashboard');
              setCapturedImage(null);
              setAnalysisResult(null);
            }}
            className="flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Food Scanner
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Take a picture of your food to analyze nutrition
          </p>
        </div>

        <div className="card">
          {!capturedImage ? (
            <div className="text-center py-12">
              <div className="mx-auto bg-gray-100 dark:bg-gray-700 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Capture a clear image of your food
              </p>
              
              <label className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg cursor-pointer transition-colors">
                Take Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          ) : (
            <div className="text-center">
              {analyzing ? (
                <div className="py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-6"></div>
                  <p className="text-gray-600 dark:text-gray-400">Analyzing your food...</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-6">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 mx-2">
                    <img 
                      src={capturedImage} 
                      alt="Captured food" 
                      className="max-h-64 w-full object-contain rounded-md mx-auto"
                    />
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Analysis Result</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Food Name</span>
                        <div className="font-medium text-gray-900 dark:text-white">{analysisResult.foodName}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-300">{analysisResult.calories || 0}</div>
                          <div className="text-xs text-blue-500 dark:text-blue-400">Calories</div>
                        </div>
                        <div className="text-center bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg">
                          <div className="text-lg font-bold text-orange-600 dark:text-orange-300">{analysisResult.protein || 0}g</div>
                          <div className="text-xs text-orange-500 dark:text-orange-400">Protein</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                          <div className="text-lg font-bold text-green-600 dark:text-green-300">{analysisResult.carbs || 0}g</div>
                          <div className="text-xs text-green-500 dark:text-green-400">Carbs</div>
                        </div>
                        <div className="text-center bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
                          <div className="text-lg font-bold text-red-600 dark:text-red-300">{analysisResult.fat || 0}g</div>
                          <div className="text-xs text-red-500 dark:text-red-400">Fat</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => {
                          setCapturedImage(null);
                          setAnalysisResult(null);
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Retake
                      </button>
                      <button
                        onClick={() => addMeal(analysisResult)}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Save Meal
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 mx-2">
                    <img 
                      src={capturedImage} 
                      alt="Captured food" 
                      className="max-h-64 w-full object-contain rounded-md mx-auto"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => analyzeFoodImage(capturedImage)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      Analyze Food
                    </button>
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      Retake Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {view === 'dashboard' && <DashboardView />}
      {view === 'history' && <HistoryView />}
      {view === 'camera' && <CameraView />}
    </div>
  );
};

export default NutritionTrackingScreen;