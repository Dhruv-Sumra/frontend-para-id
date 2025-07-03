import { useState } from 'react';

export default function IdCardDetails() {
  const [playerId, setPlayerId] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [player, setPlayer] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpMsg('');
    setError('');
    setOtp('');
    setPlayer(null);
    try {
      const response = await fetch('/api/idcards/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      setOtpSent(true);
      setOtpMsg('OTP sent to your email. Please check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlayer(null);
    setOtpMsg('');
    try {
      const response = await fetch('/api/idcards/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to find player');
      setPlayer(data.player);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ID Card Details
          </h1>
          <p className="text-lg text-gray-600">
            Enter your Player ID and Email to view your details
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="playerId" className="block text-sm font-medium text-gray-700 mb-2">
                  Player ID
                </label>
                <input
                  type="text"
                  id="playerId"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your Player ID"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setOtpSent(false); setOtp(''); setOtpMsg(''); }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading || !email}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
                {otpMsg && <div className="text-green-600 text-sm mt-1">{otpMsg}</div>}
              </div>
            </div>
            {otpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the OTP sent to your email"
                  required
                  maxLength={6}
                  minLength={6}
                  pattern="[0-9]{6}"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !otpSent}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying...' : 'View Details'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Player Details Card */}
        {player && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">
                Player ID Card
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name:</span>
                      <p className="text-gray-800">{player.firstName} {player.lastName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Player ID:</span>
                      <p className="text-gray-800">{player.playerId}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <p className="text-gray-800">{player.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <p className="text-gray-800">{player.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Gender:</span>
                      <p className="text-gray-800">{player.gender}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                      <p className="text-gray-800">{new Date(player.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Sports Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Sports Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Primary Sport:</span>
                      <p className="text-gray-800">{player.primarySport}</p>
                    </div>
                    {player.secondarySport && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Secondary Sport:</span>
                        <p className="text-gray-800">{player.secondarySport}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-500">Experience Level:</span>
                      <p className="text-gray-800">{player.experienceLevel}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Years of Experience:</span>
                      <p className="text-gray-800">{player.yearsOfExperience}</p>
                    </div>
                  </div>
                </div>

                {/* Disability Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Disability Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Disability Type:</span>
                      <p className="text-gray-800">{player.disabilityType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Classification:</span>
                      <p className="text-gray-800">{player.disabilityClassification}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Address
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Street:</span>
                      <p className="text-gray-800">{player.address.street}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">City:</span>
                      <p className="text-gray-800">{player.address.city}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">State:</span>
                      <p className="text-gray-800">{player.address.state}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Postal Code:</span>
                      <p className="text-gray-800">{player.address.postalCode}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Country:</span>
                      <p className="text-gray-800">{player.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}