import React, { useState } from 'react';
import { HelpCircle, Volume2, VolumeX, Languages, Accessibility, X, Info } from 'lucide-react';
import { useScreenReader } from './ScreenReader';

const AccessibilityHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAudioEnabled, toggleAudio, language, changeLanguage, testAudio } = useScreenReader();

  const accessibilityFeatures = [
    {
      title: "Screen Reader Support",
      description: "Full compatibility with screen readers like JAWS, NVDA, and VoiceOver",
      icon: Accessibility
    },
    {
      title: "Keyboard Navigation",
      description: "Navigate the entire website using only your keyboard",
      icon: Accessibility
    },
    {
      title: "High Contrast Mode",
      description: "Enhanced visibility with high contrast color schemes",
      icon: Accessibility
    },
    {
      title: "Reduced Motion",
      description: "Minimize animations for users with motion sensitivity",
      icon: Accessibility
    }
  ];

  const keyboardShortcuts = [
    { key: "Tab", description: "Navigate between elements" },
    { key: "Enter/Space", description: "Activate buttons and links" },
    { key: "Escape", description: "Close modals and menus" },
    { key: "Ctrl + /", description: "Toggle accessibility help" }
  ];

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        aria-label="Open accessibility help"
      >
        <HelpCircle size={24} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Accessibility size={24} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Accessibility Help</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-icon-secondary"
                aria-label="Close accessibility help"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Controls */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <button
                      onClick={toggleAudio}
                      className="btn-icon-primary"
                      aria-label={isAudioEnabled ? 'Disable audio' : 'Enable audio'}
                    >
                      {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <div>
                      <p className="font-medium text-gray-900">Audio</p>
                      <p className="text-sm text-gray-600">
                        {isAudioEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Languages size={20} className="text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Language</p>
                      <select
                        value={language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="mt-1 input-field text-sm"
                        aria-label="Select language"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="gu">Gujarati</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={testAudio}
                    className="btn-outline w-full"
                    disabled={!isAudioEnabled}
                  >
                    Test Audio
                  </button>
                </div>
              </div>

              {/* Accessibility Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accessibilityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <feature.icon size={20} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{feature.title}</p>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{shortcut.description}</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Accessibility Tips</h4>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      <li>• Use the Tab key to navigate through interactive elements</li>
                      <li>• Press Enter or Space to activate buttons and links</li>
                      <li>• Use the screen reader controls in the bottom-right corner</li>
                      <li>• Enable high contrast mode in your system settings for better visibility</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Need more help? Contact our support team.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityHelp; 