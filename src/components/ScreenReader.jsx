import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Accessibility } from 'lucide-react';

export const ScreenReaderContext = createContext();

export const useScreenReader = () => {
  const context = useContext(ScreenReaderContext);
  if (!context) {
    throw new Error('useScreenReader must be used within a ScreenReader provider');
  }
  return context;
};

const ScreenReader = ({ children }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);
  const voicesRef = useRef([]);
  const utteranceQueueRef = useRef([]);
  const isMountedRef = useRef(true);

  // Load voices when component mounts
  useEffect(() => {
    isMountedRef.current = true;
    
    const loadVoices = () => {
      if (!isMountedRef.current) return;
      
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        voicesRef.current = voices;
        setVoicesLoaded(true);
        
        // Auto-select a voice for the current language
        const voice = getVoiceForLanguage(language);
        if (voice) {
          setSelectedVoice(voice);
        }
      }
    };
    
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis;
      
      // Some browsers need this event to populate voices
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Load voices immediately if already available
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        // Force voices to load in Chrome
        const utterance = new SpeechSynthesisUtterance('');
        utterance.onend = () => {
          if (isMountedRef.current) {
            loadVoices();
          }
        };
        window.speechSynthesis.speak(utterance);
      }
    }

    return () => {
      isMountedRef.current = false;
      if (speechRef.current) {
        speechRef.current.cancel();
        speechRef.current.onvoiceschanged = null;
      }
    };
  }, [language]);

  // Process utterance queue
  useEffect(() => {
    if (!isSpeaking && utteranceQueueRef.current.length > 0 && isAudioEnabled) {
      processQueue();
    }
  }, [isSpeaking, isAudioEnabled]);

  const processQueue = () => {
    if (utteranceQueueRef.current.length === 0 || !speechRef.current) return;
    
    const nextUtterance = utteranceQueueRef.current[0];
    setIsSpeaking(true);
    
    nextUtterance.onend = () => {
      if (isMountedRef.current) {
        utteranceQueueRef.current.shift();
        setIsSpeaking(false);
        if (utteranceQueueRef.current.length > 0) {
          processQueue();
        }
      }
    };
    
    nextUtterance.onerror = (e) => {
      console.error('SpeechSynthesis error:', e);
      if (isMountedRef.current) {
        utteranceQueueRef.current.shift();
        setIsSpeaking(false);
        if (utteranceQueueRef.current.length > 0) {
          processQueue();
        }
      }
    };
    
    try {
      speechRef.current.speak(nextUtterance);
    } catch (error) {
      console.error('Error speaking utterance:', error);
      utteranceQueueRef.current.shift();
      setIsSpeaking(false);
      if (utteranceQueueRef.current.length > 0) {
        processQueue();
      }
    }
  };

  // Get the best available voice for the selected language
  const getVoiceForLanguage = (lang) => {
    if (!voicesRef.current.length) return null;
    // For Gujarati, prefer a Hindi voice
    if (lang === 'gu') {
      const hindiVoice = voicesRef.current.find(v => v.lang.includes('hi'));
      if (hindiVoice) return hindiVoice;
    }
    // Try to find a voice that matches the language
    const langVoice = voicesRef.current.find(v => v.lang.includes(lang));
    if (langVoice) return langVoice;
    // Fallback to English voice
    const englishVoice = voicesRef.current.find(v => v.lang.includes('en'));
    return englishVoice || voicesRef.current[0];
  };

  // Field translations for all supported languages
  const fieldTranslations = {
    en: {
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Street Address',
      city: 'City',
      state: 'State',
      postalCode: 'Postal Code',
      country: 'Country',
      primarySport: 'Primary Sport',
      secondarySport: 'Secondary Sport',
      experienceLevel: 'Experience Level',
      yearsOfExperience: 'Years of Experience',
      coachName: 'Coach Name',
      coachContact: 'Coach Contact',
      achievements: 'Achievements',
      disabilityType: 'Disability Type',
      disabilityClassification: 'Disability Classification',
      impairmentDescription: 'Impairment Description',
      emergencyContactName: 'Emergency Contact Name',
      relationship: 'Relationship',
      emergencyContactPhone: 'Emergency Contact Phone',
      medicalConditions: 'Medical Conditions',
      medications: 'Medications',
      allergies: 'Allergies',
      profilePhoto: 'Profile Photo'
    },
    hi: {
      firstName: 'Pahela Naam',
      lastName: 'Upnaam',
      dateOfBirth: 'Janm Tithi',
      gender: 'Ling',
      email: 'Email Pata',
      phone: 'Phone Number',
      address: 'Sadak Ka Pata',
      city: 'Shahar',
      state: 'Rajya',
      postalCode: 'Pin Code',
      country: 'Desh',
      primarySport: 'Mukhya Khel',
      secondarySport: 'Doosra Khel',
      experienceLevel: 'Anubhav Star',
      yearsOfExperience: 'Anubhav Ke Varsh',
      coachName: 'Coach Ka Naam',
      coachContact: 'Coach Ka Sampark',
      achievements: 'Upalabdhiyan',
      disabilityType: 'Viklangta Ka Prakar',
      disabilityClassification: 'Viklangta Vargikaran',
      impairmentDescription: 'Viklangta Vivaran',
      emergencyContactName: 'Apaatkalin Sampark Naam',
      relationship: 'Rishta',
      emergencyContactPhone: 'Apaatkalin Sampark Phone',
      medicalConditions: 'Chikitsa Stithi',
      medications: 'Dawaiyan',
      allergies: 'Allergy',
      profilePhoto: 'Profile Photo'
    },
    gu: {
      firstName: 'Pahelu Naam',
      lastName: 'Avnaam',
      dateOfBirth: 'Janma Tarikh',
      gender: 'Ling',
      email: 'Email Patro',
      phone: 'Phone Number',
      address: 'Street No Pata',
      city: 'Shahar',
      state: 'Rajya',
      postalCode: 'Pin Code',
      country: 'Desh',
      primarySport: 'Mukhy Khel',
      secondarySport: 'Bij Khel',
      experienceLevel: 'Anubhav Star',
      yearsOfExperience: 'Anubhav Na Varsh',
      coachName: 'Coach Nu Naam',
      coachContact: 'Coach No Sampark',
      achievements: 'Safaltaao',
      disabilityType: 'Apangta No Prakaar',
      disabilityClassification: 'Vikalangtaa Vargikaran',
      impairmentDescription: 'Vikalangtaa Vivaran',
      emergencyContactName: 'Apaatkalin Sampark Naam',
      relationship: 'Nata',
      emergencyContactPhone: 'Apaatkalin Sampark Phone',
      medicalConditions: 'Arogya Stithi',
      medications: 'Davaiyon',
      allergies: 'Allergy',
      profilePhoto: 'Profile Photo'
    }
  };

  const speak = (text, fieldName = null) => {
    if (!isAudioEnabled || !speechRef.current || !voicesLoaded || !text) return;

    let processedText = text;
    // For Hindi and Gujarati, use the English-alphabet version for audio
    if (language === 'hi' && fieldName) {
      processedText = fieldTranslations['hi_en'][fieldName] || text;
    } else if (language === 'gu' && fieldName) {
      processedText = fieldTranslations['gu_en'][fieldName] || text;
    }

    const utterance = new SpeechSynthesisUtterance(processedText);
    let voiceToUse = selectedVoice;
    // For Gujarati, prefer a Hindi voice if available
    if (language === 'gu') {
      voiceToUse = getVoiceForLanguage('gu');
    } else {
      voiceToUse = selectedVoice || getVoiceForLanguage(language);
    }
    if (voiceToUse) {
      utterance.voice = voiceToUse;
      utterance.lang = voiceToUse.lang;
    } else {
      utterance.lang = 'en-US';
    }
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utteranceQueueRef.current.push(utterance);
    if (!isSpeaking) {
      processQueue();
    }
  };

  // Helper to play pre-recorded audio if available
  const playPreRecordedAudio = async (lang, fieldName) => {
    const audioPath = `/audio/${lang}/${fieldName}.mp3`;
    return new Promise((resolve, reject) => {
      const audio = new window.Audio(audioPath);
      audio.oncanplaythrough = () => {
        audio.play();
        audio.onended = resolve;
        audio.onerror = reject;
      };
      audio.onerror = reject;
    });
  };

  const speakField = async (fieldName) => {
    if (!isAudioEnabled || !fieldName) return;
    // Try to play pre-recorded audio for the field label
    try {
      await playPreRecordedAudio(language, fieldName);
      return;
    } catch {
      // If audio file not found or fails, fall back to SpeechSynthesis
      if (language === 'hi' || language === 'gu') {
        speak(fieldTranslations[language][fieldName] || fieldName, fieldName);
      } else {
        speak(fieldTranslations[language][fieldName] || fieldName);
      }
    }
  };

  const playAudio = () => {
    if (!isAudioEnabled) return;

    if (isSpeaking) {
      stopAudio();
    } else {
      const formStartTexts = {
        en: 'Form start audio',
        hi: 'फॉर्म शुरू ऑडियो',
        gu: 'ફોર્મ શરૂ ઓડિયો'
      };
      speak(formStartTexts[language] || formStartTexts.en);
    }
  };

  const stopAudio = () => {
    if (speechRef.current) {
      try {
        speechRef.current.cancel();
        utteranceQueueRef.current = [];
        setIsSpeaking(false);
      } catch (error) {
        console.warn('Error stopping speech:', error);
      }
    }
  };

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    if (!newState) {
      stopAudio();
    } else {
      const audioStateTexts = {
        en: `Audio ${newState ? 'enabled' : 'disabled'}`,
        hi: newState ? 'ऑडियो सक्षम' : 'ऑडियो अक्षम',
        gu: newState ? 'ઑડિયો સક્ષમ' : 'ઑડિયો અક્ષમ'
      };
      speak(audioStateTexts[language] || audioStateTexts.en);
    }
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    stopAudio();
    
    // Auto-select appropriate voice for the new language
    const voice = getVoiceForLanguage(newLanguage);
    if (voice) {
      setSelectedVoice(voice);
    }
    
    // Provide audio feedback for language change
    const languageNames = {
      en: 'English',
      hi: 'Hindi',
      gu: 'Gujarati'
    };
    
    const changeTexts = {
      en: `Language changed to ${languageNames[newLanguage]}`,
      hi: `भाषा बदली गई ${languageNames[newLanguage]}`,
      gu: `ભાષા બદલાઈ ગઈ ${languageNames[newLanguage]}`
    };
    
    speak(changeTexts[newLanguage] || changeTexts.en);
  };

  const toggleControls = () => {
    setIsControlsVisible(!isControlsVisible);
  };

  return (
    <ScreenReaderContext.Provider value={{ 
      speak, 
      speakField,
      isAudioEnabled, 
      isSpeaking, 
      language, 
      playAudio, 
      stopAudio, 
      toggleAudio, 
      changeLanguage,
      voicesLoaded
    }}>
      <div>
        {children}
        
        {/* Screen Reader Controls */}
        <div className="screen-reader-controls" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
        }}>
          <button
            onClick={toggleControls}
            className="btn-icon-primary mb-2"
            aria-label="Toggle accessibility controls"
            aria-expanded={isControlsVisible}
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Accessibility size={20} />
          </button>
          
          {isControlsVisible && (
            <div className="space-y-3" style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              minWidth: '200px'
            }}>
              <div className="flex items-center justify-center space-x-1">
                <button
                  onClick={toggleAudio}
                  className="screen-reader-button"
                  aria-label={isAudioEnabled ? 'Disable audio' : 'Enable audio'}
                  style={{
                    backgroundColor: isAudioEnabled ? '#4f46e5' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                
                <button
                  onClick={playAudio}
                  className="screen-reader-button"
                  aria-label={isSpeaking ? 'Pause audio' : 'Play audio'}
                  disabled={!isAudioEnabled}
                  style={{
                    backgroundColor: isAudioEnabled ? '#4f46e5' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: isAudioEnabled ? 'pointer' : 'not-allowed'
                  }}
                >
                  {isSpeaking ? <Pause size={18} /> : <Play size={18} />}
                </button>
                
                <button
                  onClick={stopAudio}
                  className="screen-reader-button"
                  aria-label="Stop audio"
                  disabled={!isAudioEnabled}
                  style={{
                    backgroundColor: isAudioEnabled ? '#4f46e5' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: isAudioEnabled ? 'pointer' : 'not-allowed'
                  }}
                >
                  <RotateCcw size={18} />
                </button>
              </div>
              
              <div className="flex items-center space-x-2" style={{ marginTop: '10px' }}>
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="screen-reader-select"
                  aria-label="Select language"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="gu">Gujarati</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScreenReaderContext.Provider>
  );
};

export default ScreenReader;