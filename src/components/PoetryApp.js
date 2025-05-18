import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import { Button, Textarea, Card, CardContent, ProgressBar } from './UIComponents';
import { validatePoem, calculateDoomScale, POEM_STYLES, POEM_PROMPTS } from '../utils/poemUtils';

export default function PoetryApp() {
  const [poemPrompt, setPoemPrompt] = useState("");
  const [poemStyle, setPoemStyle] = useState("");
  const [poemText, setPoemText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [savedPoems, setSavedPoems] = useState([]);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  // Load saved poems from local storage on mount
  useEffect(() => {
    const loadSavedPoems = async () => {
      try {
        const poems = await localforage.getItem('savedPoems');
        if (poems) {
          setSavedPoems(poems);
        }
      } catch (error) {
        console.error('Error loading saved poems:', error);
      }
    };
    loadSavedPoems();
  }, []);

  // Save poems to local storage whenever they change
  useEffect(() => {
    const savePoems = async () => {
      try {
        await localforage.setItem('savedPoems', savedPoems);
      } catch (error) {
        console.error('Error saving poems:', error);
      }
    };
    savePoems();
  }, [savedPoems]);

  const generatePrompt = () => {
    setIsGeneratingPrompt(true);
    setFeedback("");

    const promptIndex = Math.floor(Math.random() * POEM_PROMPTS.length);
    const styleIndex = Math.floor(Math.random() * POEM_STYLES.length);
    
    setPoemPrompt(POEM_PROMPTS[promptIndex]);
    setPoemStyle(POEM_STYLES[styleIndex]);
    setShowEditor(true);
    setIsGeneratingPrompt(false);
  };

  const handleSavePoem = () => {
    if (!poemText.trim()) {
      setFeedback("Your poem is empty! Write something to save.");
      return;
    }
    const { valid, message } = validatePoem(poemStyle, poemText);
    if (!valid) {
      setFeedback(message + " Please try again.");
      return;
    }

    const doom = calculateDoomScale(poemText);
    const newPoem = {
      text: poemText,
      doom,
      style: poemStyle,
      date: new Date().toISOString(),
      prompt: poemPrompt
    };
    setSavedPoems(prev => [newPoem, ...prev]);
    setPoemText("");
    setFeedback("Poem saved successfully!");
  };

  const loadPoem = (poem) => {
    setPoemText(poem.text);
    setPoemStyle(poem.style);
    setPoemPrompt(poem.prompt);
    setShowEditor(true);
    setFeedback("");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F3F4F6] p-8 rounded-3xl shadow-2xl font-sans">
      <header className="w-full text-center mb-8">
        <h1 className="text-5xl font-bold text-[#1F2937] font-sans">Liz-spiration Navigation</h1>
        <p className="mt-2 text-lg text-[#4B5563] font-sans">Your pocket poetry prompt generator and creative space</p>
      </header>

      <div className="w-3/4 max-w-xl text-center bg-white rounded-3xl p-8 shadow-lg mb-8">
        <Button
          onClick={generatePrompt}
          className="mb-6 text-2xl"
          disabled={isGeneratingPrompt}
        >
          {isGeneratingPrompt ? "Generating Prompt..." : "Get a Poetry Prompt"}
        </Button>

        {showEditor && (
          <Card className="mt-6 p-6">
            <CardContent>
              <p className="text-xl font-semibold text-[#1F2937] mb-2">Prompt:</p>
              <p className="italic mb-4 text-[#4B5563] text-lg">{poemPrompt}</p>

              <p className="text-xl font-semibold text-[#1F2937] mb-2">
                Style: <span className="font-normal italic text-[#4B5563]">{poemStyle}</span>
              </p>

              <Textarea
                placeholder="Start writing your poem here..."
                value={poemText}
                onChange={(e) => { setPoemText(e.target.value); setFeedback(""); }}
                className="mb-4 min-h-[200px]"
              />

              {feedback && (
                <p className={`mt-2 mb-4 text-center ${feedback.startsWith("Poem saved") ? "text-green-600" : "text-red-500"}`}>
                  {feedback}
                </p>
              )}

              <div className="flex justify-end space-x-4">
                <Button onClick={handleSavePoem}>
                  Save Poem
                </Button>
                
                <Button 
                  onClick={() => { setShowEditor(false); setPoemText(""); setFeedback(""); }}
                  className="bg-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </Button>
                
                {poemStyle !== "Free Verse" && poemText.trim() && (
                  <Button
                    onClick={() => {
                      const { message } = validatePoem(poemStyle, poemText);
                      setFeedback(message);
                    }}
                    className="bg-secondary hover:bg-gray-700"
                  >
                    Validate Style
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="w-3/4 max-w-xl p-6 mt-8 bg-white rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-[#1F2937]">Liz's Poems</h2>
        {savedPoems.length === 0 ? (
          <p className="text-gray-600 italic">No poems saved yet. Start writing!</p>
        ) : (
          <div className="space-y-4">
            {savedPoems.map((poem, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => loadPoem(poem)}
              >
                <p className="font-medium text-[#1F2937]">
                  {poem.text.split("\n")[0] || "Untitled"}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="mr-4">{poem.style}</span>
                  <span>Doom: {poem.doom}%</span>
                  <span className="ml-4">{new Date(poem.date).toLocaleDateString()}</span>
                </div>
                <ProgressBar value={poem.doom} className="mt-2" />
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-gray-700">
        <p className="text-sm">Created with Liz-spiration 💖</p>
      </footer>
    </div>
  );
} 