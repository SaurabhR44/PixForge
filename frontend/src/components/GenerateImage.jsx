import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, AlertCircle } from "lucide-react";
import "./GenerateImage.css";

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') return '/api';
  return 'http://localhost:9000';
};

const generateImageAPI = async (prompt) => {
  const res = await axios.post(`${getBaseUrl()}/generate-image`, { prompt });

  // Persist to local history immediately
  const image = res.data;
  const history = JSON.parse(localStorage.getItem('generation_history') || '[]');
  localStorage.setItem('generation_history', JSON.stringify([image, ...history]));

  return image;
};

const GenerateImage = () => {
  const [prompt, setPrompt] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: generateImageAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      setPrompt("");
    },
  });

  const handleGenerateImage = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    mutation.mutate(prompt);
  };

  return (
    <div className="hero-section">
      <div className="logo-container">
        <div className="logo-inner"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-content"
      >
        <div className="badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>PixForge AI Engine</span>
        </div>

        <h1 className="hero-title">
          Forge <span className="gradient-text">PixForge</span> Art
        </h1>
        <p className="hero-subtitle">
          The ultimate foundry for your imagination. High-fidelity AI art, forged instantly.
        </p>

        <form onSubmit={handleGenerateImage} className="input-wrapper glass-panel">
          <input
            type="text"
            placeholder="Describe your imagination..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={mutation.isPending}
          />
          <button
            type="submit"
            className="action-btn"
            disabled={mutation.isPending || !prompt.trim()}
          >
            {mutation.isPending ? (
              <Loader2 className="spinner" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>

        <AnimatePresence>
          {mutation.data && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="latest-preview glass-panel"
            >
              <img src={mutation.data.url} alt="Latest Forge" />
              <div className="preview-label">Latest Masterpiece</div>
            </motion.div>
          )}

          {mutation.isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="error-toast glass-panel"
            >
              <AlertCircle size={18} className="error-icon" />
              <span>Generation failed. Please try a different prompt.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {mutation.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-overlay"
          >
            <div className="loader-container">
              <div className="premium-loader"></div>
              <p className="loading-text">Weaving your vision...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenerateImage;
