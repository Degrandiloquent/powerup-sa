import React, { useState, useEffect } from 'react';
import { Search, Zap, MapPin, Clock, AlertCircle, Info, Star, Bell } from 'lucide-react';
import { getCurrentStatus, searchAreas, getAreaSchedule } from './api/loadshedding';

const PowerUpSA = () => {
  const [stage, setStage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadCurrentStatus();
    loadFavorites();
    checkNotificationPermission();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('powerup-favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  };

  const loadCurrentStatus = async () => {
    setLoading(true);
    try {
      const status = await getCurrentStatus();
      if (status && status.eskom) {
        setStage({
          stage: status.eskom.stage,
          updated: new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' }),
          next_stages: status.eskom.next_stages || []
        });
      } else {
        // Fallback to mock data with REAL dates
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const tomorrowMidnight = new Date(tomorrow);
        tomorrowMidnight.setHours(0, 0, 0, 0);
        
        const tomorrowAfternoon = new Date(tomorrow);
        tomorrowAfternoon.setHours(16, 0, 0, 0);
        
        setStage({
          stage: 4,
          updated: new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' }),
          next_stages: [
            { 
              stage: 3, 
              start_timestamp: tomorrowMidnight.toISOString()
            },
            { 
              stage: 2, 
              start_timestamp: tomorrowAfternoon.toISOString()
            }
          ]
        });
      }
    } catch (err) {
      console.error('Error loading status:', err);
      // Use real dates for error fallback
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const tomorrowMidnight = new Date(tomorrow);
      tomorrowMidnight.setHours(0, 0, 0, 0);
      
      const tomorrowAfternoon = new Date(tomorrow);
      tomorrowAfternoon.setHours(16, 0, 0, 0);
      
      setStage({
        stage: 4,
        updated: new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' }),
        next_stages: [
          { 
            stage: 3, 
            start_timestamp: tomorrowMidnight.toISOString()
          },
          { 
            stage: 2, 
            start_timestamp: tomorrowAfternoon.toISOString()
          }
        ]
      });
    }
    setLoading(false);
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.length > 2) {
      setLoading(true);
      try {
        const results = await searchAreas(value);
        console.log('Search results received:', results);
        setAreas(results || []);
      } catch (err) {
        console.error('Search error:', err);
        setAreas([]);
      }
      setLoading(false);
    } else {
      setAreas([]);
    }
  };

  const selectArea = async (area) => {
    setSelectedArea(area);
    setSearchTerm(area.name);
    setAreas([]);
    setLoading(true);
    
    try {
      const data = await getAreaSchedule(area.id);
      console.log('Schedule data received:', data);
      if (data && data.schedule && data.schedule.days) {
        setSchedule(data.schedule.days);
      } else {
        // Mock schedule with REAL dates
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);
        const dayThree = new Date(today);
        dayThree.setDate(dayThree.getDate() + 3);
        
        setSchedule([
          { 
            date: today.toISOString().split('T')[0], 
            stages: [[4, ['16:00-18:30', '20:00-22:30']]] 
          },
          { 
            date: tomorrow.toISOString().split('T')[0], 
            stages: [[3, ['08:00-10:30', '18:00-20:30']]] 
          },
          { 
            date: dayAfter.toISOString().split('T')[0], 
            stages: [[3, ['12:00-14:30', '20:00-22:30']]] 
          },
          { 
            date: dayThree.toISOString().split('T')[0], 
            stages: [[2, ['06:00-08:30', '18:00-20:30']]] 
          }
        ]);
      }
    } catch (err) {
      console.error('Schedule error:', err);
      // Use real dates on error
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(dayAfter.getDate() + 2);
      const dayThree = new Date(today);
      dayThree.setDate(dayThree.getDate() + 3);
      
      setSchedule([
        { 
          date: today.toISOString().split('T')[0], 
          stages: [[4, ['16:00-18:30', '20:00-22:30']]] 
        },
        { 
          date: tomorrow.toISOString().split('T')[0], 
          stages: [[3, ['08:00-10:30', '18:00-20:30']]] 
        },
        { 
          date: dayAfter.toISOString().split('T')[0], 
          stages: [[3, ['12:00-14:30', '20:00-22:30']]] 
        },
        { 
          date: dayThree.toISOString().split('T')[0], 
          stages: [[2, ['06:00-08:30', '18:00-20:30']]] 
        }
      ]);
    }
    setLoading(false);
  };

  const toggleFavorite = (area) => {
    let newFavorites;
    const isFavorite = favorites.some(fav => fav.id === area.id);
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== area.id);
    } else {
      newFavorites = [...favorites, area];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('powerup-favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (areaId) => {
    return favorites.some(fav => fav.id === areaId);
  };

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      new Notification('PowerUp SA', {
        body: 'Notifications enabled! You will be alerted before load shedding.',
        icon: '/favicon.ico'
      });
    }
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
    alert('Notifications disabled. You can re-enable them anytime.');
  };

  const getStageColor = (stageNum) => {
    if (stageNum <= 2) return 'bg-yellow-500';
    if (stageNum <= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatScheduleSlots = (day) => {
    const slots = [];
    if (day.stages && Array.isArray(day.stages)) {
      day.stages.forEach(([stageNum, times]) => {
        if (Array.isArray(times)) {
          times.forEach(timeSlot => {
            slots.push({
              date: day.date,
              time: timeSlot,
              stage: stageNum
            });
          });
        }
      });
    }
    return slots;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Zap className="text-yellow-400" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-white">PowerUp SA</h1>
              <p className="text-gray-300 text-sm">Stay ahead of load shedding</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Notification Banner */}
        {!notificationsEnabled && (
          <div className="bg-blue-500/20 backdrop-blur-md rounded-2xl p-4 mb-6 border border-blue-500/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Bell className="text-blue-400" size={24} />
                <div>
                  <p className="text-white font-medium">Get load shedding alerts</p>
                  <p className="text-gray-300 text-sm">Enable notifications to stay informed</p>
                </div>
              </div>
              <button
                onClick={enableNotifications}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        )}

        {notificationsEnabled && (
          <div className="bg-green-500/20 backdrop-blur-md rounded-2xl p-4 mb-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-green-400" size={24} />
                <p className="text-white font-medium">Notifications enabled ✓</p>
              </div>
              <button
                onClick={disableNotifications}
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                Disable
              </button>
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="text-yellow-400" />
              Favorite Locations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {favorites.map(fav => (
                <button
                  key={fav.id}
                  onClick={() => selectArea(fav)}
                  className="bg-black/20 hover:bg-black/30 rounded-lg p-3 border border-white/10 hover:border-yellow-400/50 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{fav.name}</div>
                      <div className="text-gray-400 text-sm">{fav.region}</div>
                    </div>
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Stage Card */}
        {stage && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <AlertCircle className="text-yellow-400" />
                Current Status
              </h2>
              <span className="text-sm text-gray-300">
                Updated: {stage.updated}
              </span>
            </div>
            
            <div className="flex items-center gap-6 flex-wrap">
              <div className={`${getStageColor(stage.stage)} rounded-2xl p-6 min-w-[120px]`}>
                <div className="text-center">
                  <div className="text-white text-sm font-medium mb-1">Stage</div>
                  <div className="text-white text-5xl font-bold">{stage.stage}</div>
                </div>
              </div>
              
              {stage.next_stages && stage.next_stages.length > 0 && (
                <div className="flex-1 min-w-[250px]">
                  <h3 className="text-white font-medium mb-3">Upcoming Changes</h3>
                  {stage.next_stages.slice(0, 2).map((next, idx) => (
                    <div key={idx} className="bg-black/20 rounded-lg p-3 mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-200">Stage {next.stage}</span>
                        <span className="text-gray-300 text-sm">
                          {new Date(next.start_timestamp).toLocaleString('en-ZA', { 
                            timeZone: 'Africa/Johannesburg',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="text-blue-400" />
            Find Your Area Schedule
          </h2>
          
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search your suburb or area..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {loading && searchTerm.length > 2 && (
              <div className="absolute w-full mt-2 p-4 bg-slate-800 border border-white/20 rounded-xl text-white text-center">
                Searching...
              </div>
            )}
            
            {areas.length > 0 && !loading && (
              <div className="absolute w-full mt-2 bg-slate-800 border border-white/20 rounded-xl overflow-hidden shadow-xl z-10 max-h-64 overflow-y-auto">
                {areas.map(area => (
                  <div
                    key={area.id}
                    className="flex items-center border-b border-white/10 last:border-b-0"
                  >
                    <button
                      onClick={() => selectArea(area)}
                      className="flex-1 px-4 py-3 text-left hover:bg-white/10 transition-colors"
                    >
                      <div className="text-white font-medium">{area.name}</div>
                      <div className="text-gray-400 text-sm">{area.region}</div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(area);
                      }}
                      className="px-4 py-3 hover:bg-white/10 transition-colors"
                    >
                      <Star 
                        className={isFavorite(area.id) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}
                        size={20}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!loading && searchTerm.length > 2 && areas.length === 0 && (
              <div className="absolute w-full mt-2 p-4 bg-slate-800 border border-white/20 rounded-xl text-gray-300 text-center">
                No areas found. Try "johannesburg" or "cape town"
              </div>
            )}
          </div>

          {!selectedArea && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex gap-2 text-blue-300 text-sm">
                <Info size={18} className="flex-shrink-0 mt-0.5" />
                <p>Search for your area to see your personalized load shedding schedule</p>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Section */}
        {selectedArea && schedule.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Clock className="text-green-400" />
                Schedule for {selectedArea.name}
              </h2>
              <button
                onClick={() => toggleFavorite(selectedArea)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <Star 
                  className={isFavorite(selectedArea.id) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}
                  size={20}
                />
                <span className="text-white text-sm">
                  {isFavorite(selectedArea.id) ? 'Saved' : 'Save'}
                </span>
              </button>
            </div>
            
            <div className="space-y-3">
              {schedule.map((day, dayIdx) => {
                const slots = formatScheduleSlots(day);
                return slots.map((slot, slotIdx) => (
                  <div
                    key={`${dayIdx}-${slotIdx}`}
                    className="bg-black/20 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-colors"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-semibold">{slot.date}</span>
                        </div>
                        <div className="text-gray-300">{slot.time}</div>
                      </div>
                      <div className={`${getStageColor(slot.stage)} rounded-lg px-4 py-2`}>
                        <div className="text-white text-sm font-medium">Stage {slot.stage}</div>
                      </div>
                    </div>
                  </div>
                ));
              })}
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p className="mt-1">Helping South Africans stay powered up 💡</p>
        </div>
      </div>
    </div>
  );
};

export default PowerUpSA;