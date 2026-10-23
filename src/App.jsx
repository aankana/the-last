import React, { useState, useEffect, useMemo } from 'react';
import CosmicCanvas from './components/CosmicCanvas';
import CosmicBackground from './components/CosmicBackground';
import { toggleCosmicAudio, updateAudioEntropy } from './services/audio';
import { getCosmicChronicle, generateCosmicPhenomenon, askGemmaArchivist } from './services/ai';
import { PRESET_PHENOMENA, getPhenomenonColors } from './services/phenomena';
import { Volume2, VolumeX, Sparkles, Compass, Wand2, Loader2, Send, MessageSquareQuote } from 'lucide-react';

const GLASS_PANEL_STYLE = {
  background: 'rgba(11, 15, 25, 0.72)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)'
};

export default function App() {
  const [phenomenon, setPhenomenon] = useState(PRESET_PHENOMENA[0]);
  const [progress, setProgress] = useState(0); // Continuous value: 0.00 -> 3.00
  const [audioActive, setAudioActive] = useState(false);
  const [chronicle, setChronicle] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [playbackMode, setPlaybackMode] = useState('manual');
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hudVisible, setHudVisible] = useState(true);

  // AI Prompt State
  const [promptInput, setPromptInput] = useState('');
  const [generatingPhenomenon, setGeneratingPhenomenon] = useState(false);

  // Interactive Gemma 4 Q&A State
  const [userQuestion, setUserQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [askingAI, setAskingAI] = useState(false);

  // Dynamic cosmic colors for background and accents matching the active phenomenon and progress
  const currentColors = useMemo(() => getPhenomenonColors(phenomenon, progress), [phenomenon, progress]);

  // Active chapter is chosen based on the nearest progress milestone
  const activeChapterIndex = Math.min(Math.floor(progress + 0.4), 3);
  const currentChapter = phenomenon.chapters[activeChapterIndex] || phenomenon.chapters[0];

  // Dynamic continuous energy calculation: 100% decaying down to 0.00%
  const energyPercent = Math.max(0, 100 * Math.pow(1 - progress / 3, 2.8)).toFixed(progress > 2.2 ? 2 : 1);

  const handleAudioToggle = () => {
    const nextState = !audioActive;
    setAudioActive(nextState);
    toggleCosmicAudio(nextState);
  };

  // Sync Web Audio frequency and entropy as progress changes
  useEffect(() => {
    if (audioActive) {
      updateAudioEntropy(progress);
    }
  }, [progress, audioActive]);

  useEffect(() => {
    const handleKeyDown = event => {
      const target = event.target;
      const isEditing = target instanceof HTMLElement
        && (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName));

      if (event.key.toLowerCase() === 'f' && !event.altKey && !event.ctrlKey && !event.metaKey && !isEditing) {
        setHudVisible(visible => !visible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Gemma 4 Live Epoch Narrative
  useEffect(() => {
    let isMounted = true;
    setLoadingAI(true);
    getCosmicChronicle(phenomenon.id, currentChapter.title, activeChapterIndex, currentChapter.summary).then(text => {
      if (isMounted) {
        setChronicle(text);
        setLoadingAI(false);
      }
    });
    return () => { isMounted = false; };
  }, [activeChapterIndex, phenomenon.id, currentChapter.title, currentChapter.summary]);

  // Auto-playback loop
  useEffect(() => {
    if (playbackMode !== 'auto' || isScrubbing || progress >= 3) return;

    let animationId;
    let previousTime;
    let currentProgress = progress;
    const speed = 0.02;

    const advance = timestamp => {
      if (previousTime !== undefined) {
        const elapsedSeconds = (timestamp - previousTime) / 1000;
        currentProgress = Math.min(3, currentProgress + elapsedSeconds * speed);
        setProgress(currentProgress);
        if (currentProgress >= 3) return;
      }

      previousTime = timestamp;
      animationId = window.requestAnimationFrame(advance);
    };

    animationId = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(animationId);
  }, [playbackMode, isScrubbing, progress]);

  // Handle Gemma 4 / Gemini API Custom Phenomenon Generation
  const handleGenerateConcept = async (e) => {
    e.preventDefault();
    if (!promptInput.trim() || generatingPhenomenon) return;

    setGeneratingPhenomenon(true);
    try {
      const generated = await generateCosmicPhenomenon(promptInput.trim());
      if (generated) {
        setPhenomenon(generated);
        setProgress(0);
        setAiAnswer('');
      }
    } finally {
      setGeneratingPhenomenon(false);
    }
  };

  // Handle Interactive Gemma 4 Q&A
  const handleAskArchivist = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim() || askingAI) return;

    setAskingAI(true);
    try {
      const answer = await askGemmaArchivist(
        userQuestion.trim(),
        phenomenon.name,
        currentChapter.title,
        currentChapter.summary
      );
      setAiAnswer(answer);
    } finally {
      setAskingAI(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: hudVisible ? '100vh' : undefined, height: hudVisible ? undefined : '100vh', overflow: hudVisible ? undefined : 'hidden', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Dynamic Color-Matching Cosmic Background */}
      <CosmicBackground progress={progress} customColors={currentColors} />

      <div style={{ position: 'relative', zIndex: 1, minHeight: hudVisible ? '100vh' : undefined }}>
        
        {/* Top Header with Phenomenon Selector & Gemma 4 Prompt Bar */}
        {hudVisible && (
          <header style={{ ...GLASS_PANEL_STYLE, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', margin: '1rem 1.5rem 0' }}>
            
            {/* Title & Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Compass size={22} color="#38bdf8" />
              <div>
                <span style={{ fontSize: '1.05rem', fontWeight: '700', letterSpacing: '0.05em' }}>COSMIC ANIMATOR</span>
                <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: '0.5rem' }}>// {phenomenon.name}</span>
              </div>
            </div>

            {/* Phenomenon Presets Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Phenomenon:</span>
              <select
                value={phenomenon.id}
                onChange={(e) => {
                  const selected = PRESET_PHENOMENA.find(p => p.id === e.target.value);
                  if (selected) {
                    setPhenomenon(selected);
                    setProgress(0);
                    setAiAnswer('');
                  }
                }}
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid #334155',
                  color: '#38bdf8',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  outline: 'none',
                  fontWeight: '600'
                }}
              >
                {PRESET_PHENOMENA.map(p => (
                  <option key={p.id} value={p.id} style={{ background: '#0b0f19', color: '#e2e8f0' }}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Generator Bar (Gemma 4 / Gemini API) */}
            <form onSubmit={handleGenerateConcept} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, maxWidth: '420px', minWidth: '280px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  placeholder="Ask Gemma 4 (e.g. 'Neutron Star Merger', 'Kilonova')..."
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(3, 7, 18, 0.65)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#e2e8f0',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={generatingPhenomenon}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.85rem',
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid #38bdf8',
                  color: '#38bdf8',
                  borderRadius: '8px',
                  cursor: generatingPhenomenon ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
              >
                {generatingPhenomenon ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                <span>{generatingPhenomenon ? 'Synthesizing...' : 'Animate'}</span>
              </button>
            </form>

            {/* Controls (Ambient F & Cosmic Audio) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                type="button"
                aria-pressed={!hudVisible}
                onClick={() => setHudVisible(false)}
                style={{ padding: '0.45rem 0.85rem', background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>
                Ambient (F)
              </button>

              <button
                onClick={handleAudioToggle}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  background: audioActive ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
                  border: audioActive ? '1px solid #38bdf8' : '1px solid #334155',
                  color: audioActive ? '#38bdf8' : '#94a3b8',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  transition: 'all 0.2s'
                }}>
                {audioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span>{audioActive ? 'Audio: On' : 'Audio: Muted'}</span>
              </button>
            </div>

          </header>
        )}

        {/* Main Grid */}
        <main style={hudVisible
          ? { maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }
          : { position: 'fixed', inset: 0, zIndex: 1, padding: 0, margin: 0 }}>
          
          {/* Visualizer Column */}
          <div style={hudVisible ? undefined : { width: '100%', height: '100%' }}>
            <div style={hudVisible
              ? { ...GLASS_PANEL_STYLE, position: 'relative', overflow: 'hidden' }
              : { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              
              <CosmicCanvas progress={progress} fullscreen={!hudVisible} phenomenon={phenomenon} />
              
              {/* Real-time HUD */}
              {hudVisible && (
                <div style={{ position: 'absolute', top: '1.25rem', left: '1.5rem', pointerEvents: 'none' }}>
                  <div style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>{currentChapter.tag}</div>
                  <h2 style={{ margin: '0.25rem 0', fontSize: '1.5rem', fontWeight: '700' }}>{currentChapter.title}</h2>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{currentChapter.subtitle}</div>
                </div>
              )}

              {hudVisible && (
                <div style={{ position: 'absolute', bottom: '1.25rem', right: '1.5rem', textAlign: 'right', pointerEvents: 'none' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>{phenomenon.energyLabel || 'Kinetic Energy Flux'}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: progress > 2.5 ? '#ef4444' : progress > 1.2 ? '#f59e0b' : '#10b981' }}>
                    {energyPercent}% Available
                  </div>
                </div>
              )}
            </div>

            {/* Continuous Deep-Time Scrubber */}
            {hudVisible && (
              <div style={{ ...GLASS_PANEL_STYLE, marginTop: '1.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>{phenomenon.timelineLabel || 'Continuous Timeline Scrubber'}:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', padding: '3px', gap: '3px', background: '#030712', border: '1px solid #1e293b', borderRadius: '8px' }}>
                      {['manual', 'auto'].map(mode => (
                        <button
                          key={mode}
                          type="button"
                          aria-pressed={playbackMode === mode}
                          onClick={() => setPlaybackMode(mode)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            background: playbackMode === mode ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                            border: playbackMode === mode ? '1px solid #38bdf8' : '1px solid transparent',
                            color: playbackMode === mode ? '#38bdf8' : '#94a3b8',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                          }}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                    <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 'bold' }}>Progress: {(progress / 3 * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <input
                  type="range" min="0" max="3" step="any"
                  value={progress}
                  onChange={(e) => setProgress(parseFloat(e.target.value))}
                  onPointerDown={() => setIsScrubbing(true)}
                  onPointerUp={() => setIsScrubbing(false)}
                  onPointerCancel={() => setIsScrubbing(false)}
                  onKeyDown={() => setIsScrubbing(true)}
                  onKeyUp={() => setIsScrubbing(false)}
                  onBlur={() => setIsScrubbing(false)}
                  style={{ width: '100%', cursor: 'pointer', accentColor: '#38bdf8' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                  {(phenomenon.stages || ["Stage 1", "Stage 2", "Stage 3", "Stage 4"]).map((stageName, idx) => (
                    <span key={idx} style={{ color: activeChapterIndex === idx ? '#38bdf8' : '', fontWeight: activeChapterIndex === idx ? 'bold' : 'normal' }}>
                      {stageName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Narrator Column */}
          {hudVisible && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Gemma 4 Cosmic Archivist Narrative Panel */}
              <div style={{ ...GLASS_PANEL_STYLE, padding: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1rem' }}>
                  <Sparkles size={16} />
                  <span>GEMMA 4 COSMIC ARCHIVIST</span>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  {currentChapter.summary}
                </p>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '1rem 0' }} />

                <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  Live Epoch Log
                </div>

                <div style={{ background: '#030712', padding: '1rem', borderRadius: '8px', border: '1px solid #1e293b', minHeight: '105px' }}>
                  {loadingAI ? (
                    <div style={{ color: '#64748b', fontSize: '0.88rem', fontStyle: 'italic' }}>Listening across the epochs...</div>
                  ) : (
                    <div style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                      "{chronicle}"
                    </div>
                  )}
                </div>

                {/* Interactive Q&A Terminal with Gemma 4 */}
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#38bdf8', marginBottom: '0.5rem', fontWeight: '600' }}>
                    <MessageSquareQuote size={14} />
                    <span>Ask Gemma 4 About This Epoch:</span>
                  </div>

                  <form onSubmit={handleAskArchivist} style={{ display: 'flex', gap: '0.4rem' }}>
                    <input
                      type="text"
                      placeholder="e.g. Can life survive this? What elements form?"
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'rgba(3, 7, 18, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#e2e8f0',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={askingAI}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.4rem 0.75rem',
                        background: 'rgba(56, 189, 248, 0.2)',
                        border: '1px solid #38bdf8',
                        color: '#38bdf8',
                        borderRadius: '6px',
                        cursor: askingAI ? 'not-allowed' : 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      {askingAI ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    </button>
                  </form>

                  {aiAnswer && (
                    <div style={{ marginTop: '0.75rem', padding: '0.85rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.85rem', color: '#e0f2fe', lineHeight: '1.5' }}>
                      <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>Archivist: </span>
                      {aiAnswer}
                    </div>
                  )}
                </div>

              </div>

              {/* Engine Specs */}
              <div style={{ ...GLASS_PANEL_STYLE, padding: '1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
                <div style={{ color: '#cbd5e1', fontWeight: '600', marginBottom: '0.25rem' }}>Continuous Multi-Vector Physics</div>
                10,000 WebGL points compute relativistic velocity fields, gravitational radiation, magnetic flux ropes, and tidal disruptions in real-time.
              </div>

            </div>
          )}

        </main>

        {!hudVisible && (
          <button
            type="button"
            aria-pressed="true"
            aria-label="Show controls"
            title="Show controls (F)"
            onClick={() => setHudVisible(true)}
            style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 2, padding: '0.55rem 0.85rem', color: '#e2e8f0', background: 'rgba(11, 15, 25, 0.72)', border: '1px solid rgba(255, 255, 255, 0.16)', borderRadius: '8px', backdropFilter: 'blur(12px)', cursor: 'pointer', opacity: 0.55 }}>
            Show controls · F
          </button>
        )}

      </div>
    </div>
  );
}
