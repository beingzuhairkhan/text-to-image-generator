import React, { useState } from 'react';

// Header component
const Header = () => {
  return (
    <header className="bg-teal-700 text-white p-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Text-to-Image Generator</h1>
        <nav>
          <a href="#" className="hover:text-teal-300 transition duration-300 ease-in-out">Home</a>
          <a href="#" className="ml-6 hover:text-teal-300 transition duration-300 ease-in-out">About</a>
          <a href="#" className="ml-6 hover:text-teal-300 transition duration-300 ease-in-out">Contact</a>
        </nav>
      </div>
    </header>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="bg-teal-700 text-white p-6 mt-12">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Text-to-Image Generator. All rights reserved.</p>
      </div>
    </footer>
  );
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const contentType = res.headers.get("Content-Type");
      if (contentType.startsWith("image/")) {
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setResponse(imageUrl);
      } else {
        const result = await res.json();
        if (result && result.output_url) {
          setResponse(result.output_url);
        } else {
          throw new Error("Unexpected response format.");
        }
      }
    } catch (err) {
      setError("An error occurred while generating the image.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 container mx-auto">
        <h2 className="text-3xl font-semibold text-center mt-10 text-teal-700">Generate an Image from Text</h2>
        <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
          <textarea
            placeholder="Enter the image description"
            onChange={(e) => setPrompt(e.target.value)}
            rows="3"
            cols="50"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300 ease-in-out"
          />
          <div className="text-center mt-4">
            <button
              onClick={generateImage}
              className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Image"}
            </button>
          </div>
          {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
          {response && (
            <div className="mt-6 flex justify-center">
              <img src={response} alt="Generated result" height={256} width={256} className="border-4 border-teal-200 rounded-lg shadow-lg"/>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
