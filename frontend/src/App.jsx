import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Images from "./components/Images";
import GenerateImage from "./components/GenerateImage";
import LandingPage from "./components/LandingPage";

function App() {
  const [showForge, setShowForge] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!showForge ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage onEnter={() => setShowForge(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="foundry"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GenerateImage />
          <Images />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
