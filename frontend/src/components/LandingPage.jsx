import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Shield, Image as ImageIcon } from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => {
    return (
        <div className="landing-container">
            <div className="landing-mesh"></div>

            <header className="landing-header">
                <div className="logo-group">
                    <div className="logo-icon"></div>
                    <span className="logo-text">PixForge</span>
                </div>
            </header>

            <main className="landing-main">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="landing-hero"
                >
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        <span>Foundry v2.0 is Live</span>
                    </div>

                    <h1 className="hero-giant-title">
                        The Future of <br />
                        <span className="gradient-text">Artistic Intelligence</span>
                    </h1>

                    <p className="hero-description">
                        PixForge is a high-fidelity foundry where your words are forged into stunning masterpieces.
                        Experience the pinnacle of AI-driven creativity.
                    </p>

                    <div className="cta-group">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onEnter}
                            className="primary-cta"
                        >
                            Launch the Foundry <ArrowRight size={20} />
                        </motion.button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="features-grid"
                >
                    <div className="feature-card glass-panel">
                        <Zap className="feature-icon" color="#60a5fa" />
                        <h3>Hyper-Fast</h3>
                        <p>Generations optimized for lightning speed and elite precision.</p>
                    </div>
                    <div className="feature-card glass-panel">
                        <ImageIcon className="feature-icon" color="#c084fc" />
                        <h3>High Fidelity</h3>
                        <p>Powered by the Flux neural engine for professional-grade detail.</p>
                    </div>
                    <div className="feature-card glass-panel">
                        <Shield className="feature-icon" color="#f472b6" />
                        <h3>Secure Foundry</h3>
                        <p>Private workspace for your most confidential artistic visions.</p>
                    </div>
                </motion.div>
            </main>

            <footer className="landing-footer">
                <p>&copy; 2026 PixForge AI. Forged with passion.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
