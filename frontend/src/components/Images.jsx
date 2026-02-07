import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Download, Clock, Copy, Check } from "lucide-react";
import "./Images.css";

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') return '/api';
  return 'http://localhost:9000';
};

const fetchImagesAPI = async () => {
  try {
    const res = await axios.get(`${getBaseUrl()}/images`);
    const serverHistory = Array.isArray(res.data) ? res.data : [];
    const localHistory = JSON.parse(localStorage.getItem('generation_history') || '[]');
    return [...localHistory, ...serverHistory];
  } catch (e) {
    return JSON.parse(localStorage.getItem('generation_history') || '[]');
  }
};

export default function Gallery() {
  const { data, isLoading } = useQuery({
    queryKey: ["images"],
    queryFn: fetchImagesAPI,
    refetchInterval: 10000,
  });

  const [selectedImage, setSelectedImage] = React.useState(null);
  const [copiedId, setCopiedId] = React.useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="gallery-section">
      <div className="section-header">
        <h2 className="section-title">Forge <span className="gradient-text">Vault</span></h2>
        <div className="history-info">
          <Clock size={16} />
          <span>Recent Masterpieces</span>
        </div>
      </div>

      <motion.div layout className="gallery-grid">
        {data?.slice().reverse().map((image, index) => (
          <motion.div
            key={image.public_id || index}
            layoutId={image.public_id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="artwork-card glass-panel"
          >
            <div className="artwork-img-wrapper" onClick={() => setSelectedImage(image)}>
              <img src={image.url} alt={image.prompt} className="artwork-img" />
              <div className="artwork-overlay">
                <Maximize2 size={24} className="overlay-icon" />
              </div>
            </div>
            <div className="artwork-info">
              <p className="artwork-prompt">{image.prompt}</p>
              <div className="artwork-actions">
                <button onClick={() => copyToClipboard(image.prompt, image.public_id)} title="Copy Prompt">
                  {copiedId === image.public_id ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <a href={image.url} download target="_blank" title="Download">
                  <Download size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              layoutId={selectedImage.public_id}
              className="lightbox-content glass-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage.url} alt="Expanded Artwork" />
              <div className="lightbox-actions">
                <div className="lightbox-info">
                  <h3>Generation Details</h3>
                  <p>{selectedImage.prompt}</p>
                </div>
                <div className="btn-group">
                  <a href={selectedImage.url} download target="_blank" className="icon-btn">
                    <Download size={20} />
                  </a>
                  <button onClick={() => setSelectedImage(null)} className="icon-btn close-btn">
                    <X size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
