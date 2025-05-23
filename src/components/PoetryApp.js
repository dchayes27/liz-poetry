import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import { Button, Textarea, Card, CardContent } from './UIComponents';
import { validatePoem, calculateDoomScale, POEM_STYLES, POEM_PROMPTS } from '../utils/poemUtils';

export default function PoetryApp() {
  const [poemPrompt, setPoemPrompt] = useState("");
  const [poemStyle, setPoemStyle] = useState("");
  const [poemText, setPoemText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [savedPoems, setSavedPoems] = useState([]);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [sharedPoemData, setSharedPoemData] = useState(null);
  const [isDisplayingSharedPoem, setIsDisplayingSharedPoem] = useState(false);
  const [copiedPoemIdentifier, setCopiedPoemIdentifier] = useState(null); // For "Copied!" feedback

  // Effect to parse URL parameters on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sharedPoem') === 'true') {
      const text = params.get('text');
      const style = params.get('style');
      const prompt = params.get('prompt');
      const doomStr = params.get('doom');
      const dateStr = params.get('date');

      // Validate parameters
      if (!text || !style || !prompt || !doomStr || !dateStr) {
        console.error('Shared poem URL is missing one or more required parameters.');
        // Optionally, clear URL params if they are invalid to avoid reload loops
        // window.history.pushState({}, '', window.location.pathname);
        return; // Default to normal view
      }

      const doom = parseInt(doomStr, 10);
      if (isNaN(doom)) {
        console.error('Shared poem URL has an invalid "doom" parameter. Must be a number.');
        return;
      }

      const date = new Date(decodeURIComponent(dateStr));
      if (isNaN(date.getTime())) {
        console.error('Shared poem URL has an invalid "date" parameter. Must be a valid ISO date string.');
        return;
      }

      const decodedText = decodeURIComponent(text);
      const decodedStyle = decodeURIComponent(style);
      const decodedPrompt = decodeURIComponent(prompt);
      // Date is already decoded and parsed

      setSharedPoemData({
        text: decodedText,
        style: decodedStyle,
        prompt: decodedPrompt,
        doom: doom,
        date: date.toISOString(), // Store as ISO string for consistency
      });
      setPoemText(decodedText);
      setPoemStyle(decodedStyle);
      setPoemPrompt(decodedPrompt);
      setIsDisplayingSharedPoem(true);
      setShowEditor(true);
    }
  }, []);

  // Load and save poems from/to local storage
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

    const savePoems = async () => {
      try {
        await localforage.setItem('savedPoems', savedPoems);
      } catch (error) {
        console.error('Error saving poems:', error);
      }
    };

    loadSavedPoems();
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

  const handleSharePoem = (poem) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedText = encodeURIComponent(poem.text);
    const encodedStyle = encodeURIComponent(poem.style);
    const encodedPrompt = encodeURIComponent(poem.prompt);
    const encodedDate = encodeURIComponent(poem.date);
    
    const fullUrl = `${baseUrl}?sharedPoem=true&text=${encodedText}&style=${encodedStyle}&prompt=${encodedPrompt}&doom=${poem.doom}&date=${encodedDate}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullUrl)
        .then(() => {
          setCopiedPoemIdentifier(poem.date); // Use poem.date as a unique ID
          setTimeout(() => setCopiedPoemIdentifier(null), 2000); // Revert after 2s
        })
        .catch(err => {
          console.error('Failed to copy URL: ', err);
          alert(`Failed to copy. Please copy this URL manually: ${fullUrl}`); // Fallback
        });
    } else {
      alert(`Please copy this URL manually: ${fullUrl}`); // Fallback for older browsers
    }
  };

  const handleCloseSharedView = () => {
    window.history.pushState({}, '', window.location.pathname); // Clear URL params
    setIsDisplayingSharedPoem(false);
    setSharedPoemData(null);
    setShowEditor(false); // Or reset to default state
    setPoemText("");
    setPoemStyle("");
    setPoemPrompt("");
    setFeedback("");
  };

  const loadPoem = (poem) => {
    setPoemText(poem.text);
    setPoemStyle(poem.style);
    setPoemPrompt(poem.prompt);
    setShowEditor(true);
    setFeedback("");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#DCEED1] p-8 rounded-3xl shadow-2xl font-['Comic_Sans_MS']">
      <header className="w-full text-center mb-8">
        <h1 className="text-5xl font-bold text-[#1E4147] font-['Comic_Sans_MS']">
          {isDisplayingSharedPoem ? "Shared Liz-spiration" : "Liz-spiration Navigation"}
        </h1>
        {!isDisplayingSharedPoem && (
          <p className="mt-2 text-lg text-[#437356] font-['Comic_Sans_MS']">
            Your pocket poetry prompt generator and creative space
          </p>
        )}
        {isDisplayingSharedPoem && sharedPoemData && (
           <p className="mt-2 text-lg text-[#437356] font-['Comic_Sans_MS']">
            Viewing a poem shared on {new Date(sharedPoemData.date).toLocaleDateString()}
          </p>
        )}
      </header>

      {!isDisplayingSharedPoem && (
        <div className="w-3/4 max-w-xl text-center bg-[#FAE3B4] rounded-3xl p-8 shadow-lg mb-8">
          <Button
            onClick={generatePrompt}
            className="mb-6 text-2xl"
            disabled={isGeneratingPrompt}
            aria-label="Get a Poetry Prompt"
          >
            {isGeneratingPrompt ? "Generating Prompt..." : "Get a Poetry Prompt"}
          </Button>
        </div>
      )}

      {showEditor && (
        <Card 
          className={`mt-6 p-6 w-3/4 max-w-xl rounded-3xl shadow-lg mb-8 ${isDisplayingSharedPoem ? 'bg-[#E0F2F7] border-2 border-blue-400' : 'bg-[#FAE3B4]'}`}
        >
          <CardContent>
            {isDisplayingSharedPoem && (
              <h3 className="text-2xl font-bold text-center text-[#1E4147] mb-4">Viewing Shared Poem</h3>
            )}
            <p className="text-xl font-semibold text-[#1E4147] mb-2">Prompt:</p>
            <p className="italic mb-4 text-[#437356] text-lg">
              {isDisplayingSharedPoem && sharedPoemData ? sharedPoemData.prompt : poemPrompt}
            </p>

            <p className="text-xl font-semibold text-[#1E4147] mb-2">
              Style: <span className="font-normal italic text-[#437356]">
                {isDisplayingSharedPoem && sharedPoemData ? sharedPoemData.style : poemStyle}
              </span>
            </p>
            
            {isDisplayingSharedPoem && sharedPoemData && (
              <p className="text-xl font-semibold text-[#1E4147] mb-2">
                Doom Scale: <span className="font-normal italic text-[#437356]">{sharedPoemData.doom}</span>
              </p>
            )}

            <Textarea
              placeholder={isDisplayingSharedPoem ? "" : "Start writing your poem here..."}
              value={isDisplayingSharedPoem && sharedPoemData ? sharedPoemData.text : poemText}
              onChange={(e) => {
                if (!isDisplayingSharedPoem) {
                  setPoemText(e.target.value);
                  setFeedback("");
                }
              }}
              className="mb-4 min-h-[200px]"
              aria-label="Poem Textarea"
              readOnly={isDisplayingSharedPoem}
              disabled={isDisplayingSharedPoem}
            />

            {feedback && !isDisplayingSharedPoem && (
              <p className={`mt-2 mb-4 text-center ${feedback.startsWith("Poem saved") ? "text-green-600" : "text-[#F34951]"}`}>
                {feedback}
              </p>
            )}

            <div className="flex justify-end space-x-4">
              {!isDisplayingSharedPoem && (
                <>
                  <Button onClick={handleSavePoem} aria-label="Save Poem">
                    Save Poem
                  </Button>
                  <Button 
                    onClick={() => { setShowEditor(false); setPoemText(""); setFeedback(""); }}
                    className="bg-gray-400 hover:bg-gray-500"
                    aria-label="Cancel"
                  >
                    Cancel
                  </Button>
                  {poemStyle !== "Free Verse" && poemText.trim() && (
                    <Button
                      onClick={() => setFeedback(validatePoem(poemStyle, poemText))}
                      className="bg-[#437356] hover:bg-[#3a634b]"
                      aria-label="Validate Style"
                    >
                      Validate Style
                    </Button>
                  )}
                </>
              )}
              {isDisplayingSharedPoem && (
                <Button
                  onClick={handleCloseSharedView}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  aria-label="Close Shared View"
                >
                  Close Shared View
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!isDisplayingSharedPoem && (
        <div className="w-3/4 max-w-xl p-6 mt-8 bg-[#FAE3B4] rounded-3xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#1E4147]">Liz's Poems</h2>
          {savedPoems.length === 0 ? (
            <p className="text-gray-600 italic">No poems saved yet. Start writing!</p>
          ) : (
            <div className="space-y-4">
              {savedPoems.map((poem, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  aria-label={`Load poem ${index + 1}`}
                >
                  <div onClick={() => loadPoem(poem)} className="cursor-pointer">
                    <p className="font-medium text-[#1E4147]">
                      {poem.text.split("\n")[0] || "Untitled"}
                    </p>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="mr-4">{poem.style}</span>
                      <span>Doom: {poem.doom}</span>
                      <span className="ml-4">{new Date(poem.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent loadPoem from firing
                      handleSharePoem(poem);
                    }}
                    className="mt-2 text-sm bg-[#437356] hover:bg-[#3a634b] text-white py-1 px-2 rounded"
                    aria-label={`Share poem ${index + 1}`}
                  >
                  {copiedPoemIdentifier === poem.date ? "Copied!" : "Share"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="mt-8 text-center text-gray-700">
        <p className="text-sm">
          {isDisplayingSharedPoem ? "Viewing a shared creation" : "Created with Liz-spiration 💖"}
        </p>
      </footer>
    </div>
  );
}
