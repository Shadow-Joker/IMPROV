/* ========================================
   SENTRAK — Sport-Specific Metrics & SAI Tests
   Owner: Sharvesh (feat/assessment)
   ======================================== */

/**
 * SPORT_METRICS — keyed by sport name.
 * Each sport maps to an array of metric definitions.
 * Each metric: { key, name, nameTamil, unit, inputType, description, benchmarks }
 * inputType: "timer" | "manual" | "count" | "rating"
 */
export const SPORT_METRICS = {
  Cricket: [
    { key: 'bowling_speed', name: 'Bowling Speed', nameTamil: 'பந்து வேகம்', unit: 'km/h', inputType: 'manual', description: 'Speed of delivery measured by radar/estimate', benchmarks: { 'U-14': { male: { avg: 85, good: 100, excellent: 110 }, female: { avg: 75, good: 90, excellent: 100 } }, 'U-16': { male: { avg: 90, good: 105, excellent: 120 }, female: { avg: 80, good: 95, excellent: 110 } } } },
    { key: 'batting_distance', name: 'Batting Distance', nameTamil: 'அடிக்கும் தூரம்', unit: 'm', inputType: 'manual', description: 'Longest hit distance in a session', benchmarks: { 'U-14': { male: { avg: 40, good: 50, excellent: 65 }, female: { avg: 35, good: 45, excellent: 55 } }, 'U-16': { male: { avg: 50, good: 65, excellent: 80 }, female: { avg: 40, good: 50, excellent: 65 } } } },
    { key: 'fielding_reaction', name: 'Fielding Reaction', nameTamil: 'கள நடவடிக்கை', unit: 's', inputType: 'timer', description: 'Reaction time to catch/field a ball', benchmarks: { 'U-14': { male: { avg: 0.6, good: 0.45, excellent: 0.35 }, female: { avg: 0.65, good: 0.5, excellent: 0.4 } }, 'U-16': { male: { avg: 0.5, good: 0.4, excellent: 0.3 }, female: { avg: 0.55, good: 0.45, excellent: 0.35 } } } },
  ],
  Football: [
    { key: 'sprint_40m', name: '40m Sprint', nameTamil: '40மீ ஓட்டம்', unit: 's', inputType: 'timer', description: 'Time to sprint 40 meters', benchmarks: { 'U-14': { male: { avg: 6.5, good: 5.8, excellent: 5.0 }, female: { avg: 7.0, good: 6.2, excellent: 5.5 } }, 'U-16': { male: { avg: 6.0, good: 5.3, excellent: 4.8 }, female: { avg: 6.5, good: 5.8, excellent: 5.2 } } } },
    { key: 'endurance_beep_level', name: 'Beep Test Level', nameTamil: 'சகிப்பு நிலை', unit: 'level', inputType: 'manual', description: 'Endurance beep test level reached (1-20)', benchmarks: { 'U-14': { male: { avg: 7, good: 9, excellent: 11 }, female: { avg: 6, good: 8, excellent: 10 } }, 'U-16': { male: { avg: 8, good: 10, excellent: 13 }, female: { avg: 7, good: 9, excellent: 11 } } } },
    { key: 'passing_accuracy', name: 'Passing Accuracy', nameTamil: 'பாஸ் துல்லியம்', unit: '/10', inputType: 'count', description: 'Successful passes out of 10 attempts', benchmarks: { 'U-14': { male: { avg: 5, good: 7, excellent: 9 }, female: { avg: 5, good: 7, excellent: 9 } }, 'U-16': { male: { avg: 6, good: 8, excellent: 10 }, female: { avg: 6, good: 8, excellent: 10 } } } },
    { key: 'dribble_time', name: 'Dribble Time', nameTamil: 'டிரிபிள் நேரம்', unit: 's', inputType: 'timer', description: 'Time to complete dribble course', benchmarks: { 'U-14': { male: { avg: 14.0, good: 12.0, excellent: 10.5 }, female: { avg: 15.0, good: 13.0, excellent: 11.5 } }, 'U-16': { male: { avg: 13.0, good: 11.0, excellent: 9.5 }, female: { avg: 14.0, good: 12.0, excellent: 10.5 } } } },
  ],
  Kabaddi: [
    { key: 'raid_success_rate', name: 'Raid Success Rate', nameTamil: 'ரெய்டு வெற்றி', unit: '%', inputType: 'manual', description: 'Percentage of successful raids', benchmarks: { 'U-14': { male: { avg: 40, good: 60, excellent: 80 }, female: { avg: 35, good: 55, excellent: 75 } }, 'U-16': { male: { avg: 45, good: 65, excellent: 85 }, female: { avg: 40, good: 60, excellent: 80 } } } },
    { key: 'tackle_count', name: 'Tackle Count', nameTamil: 'தடுப்பு எண்ணிக்கை', unit: 'count', inputType: 'count', description: 'Number of successful tackles in a session', benchmarks: { 'U-14': { male: { avg: 3, good: 5, excellent: 8 }, female: { avg: 2, good: 4, excellent: 7 } }, 'U-16': { male: { avg: 4, good: 6, excellent: 10 }, female: { avg: 3, good: 5, excellent: 8 } } } },
    { key: 'flexibility', name: 'Flexibility', nameTamil: 'நெகிழ்வுத்தன்மை', unit: 'cm', inputType: 'manual', description: 'Sit-and-reach flexibility measurement', benchmarks: { 'U-14': { male: { avg: 20, good: 25, excellent: 30 }, female: { avg: 22, good: 28, excellent: 33 } }, 'U-16': { male: { avg: 22, good: 28, excellent: 34 }, female: { avg: 25, good: 30, excellent: 36 } } } },
  ],
  Hockey: [
    { key: 'sprint_30m', name: '30m Sprint', nameTamil: '30மீ ஓட்டம்', unit: 's', inputType: 'timer', description: 'Time to sprint 30 meters', benchmarks: { 'U-14': { male: { avg: 5.2, good: 4.8, excellent: 4.4 }, female: { avg: 5.5, good: 5.1, excellent: 4.7 } }, 'U-16': { male: { avg: 4.9, good: 4.5, excellent: 4.1 }, female: { avg: 5.3, good: 4.8, excellent: 4.5 } } } },
    { key: 'dribble_slalom', name: 'Dribble Slalom', nameTamil: 'டிரிபிள் சிலாலம்', unit: 's', inputType: 'timer', description: 'Time to complete slalom dribble course', benchmarks: { 'U-14': { male: { avg: 12.0, good: 10.5, excellent: 9.0 }, female: { avg: 13.0, good: 11.5, excellent: 10.0 } }, 'U-16': { male: { avg: 11.0, good: 9.5, excellent: 8.5 }, female: { avg: 12.0, good: 10.5, excellent: 9.0 } } } },
    { key: 'shot_accuracy', name: 'Shot Accuracy', nameTamil: 'ஷாட் துல்லியம்', unit: '/10', inputType: 'count', description: 'Goals scored out of 10 attempts', benchmarks: { 'U-14': { male: { avg: 4, good: 6, excellent: 8 }, female: { avg: 4, good: 6, excellent: 8 } }, 'U-16': { male: { avg: 5, good: 7, excellent: 9 }, female: { avg: 5, good: 7, excellent: 9 } } } },
    { key: 'endurance_beep', name: 'Beep Test', nameTamil: 'பீப் சோதனை', unit: 'level', inputType: 'manual', description: 'Endurance beep test level reached', benchmarks: { 'U-14': { male: { avg: 7, good: 9, excellent: 11 }, female: { avg: 6, good: 8, excellent: 10 } }, 'U-16': { male: { avg: 8, good: 10, excellent: 13 }, female: { avg: 7, good: 9, excellent: 11 } } } },
  ],
  Badminton: [
    { key: 'shuttle_run', name: 'Shuttle Run', nameTamil: 'ஷட்டில் ஓட்டம்', unit: 's', inputType: 'timer', description: 'Time to complete shuttle run course', benchmarks: { 'U-14': { male: { avg: 12.5, good: 11.0, excellent: 9.8 }, female: { avg: 13.5, good: 12.0, excellent: 10.8 } }, 'U-16': { male: { avg: 11.5, good: 10.2, excellent: 9.2 }, female: { avg: 12.5, good: 11.2, excellent: 10.2 } } } },
    { key: 'reaction_time', name: 'Reaction Time', nameTamil: 'எதிர்வினை நேரம்', unit: 's', inputType: 'timer', description: 'Light-based reaction time test', benchmarks: { 'U-14': { male: { avg: 0.35, good: 0.28, excellent: 0.22 }, female: { avg: 0.38, good: 0.32, excellent: 0.25 } }, 'U-16': { male: { avg: 0.30, good: 0.25, excellent: 0.20 }, female: { avg: 0.35, good: 0.28, excellent: 0.23 } } } },
    { key: 'smash_count_60s', name: 'Smash Count (60s)', nameTamil: 'ஸ்மாஷ் எண்ணிக்கை', unit: 'count', inputType: 'count', description: 'Number of smashes in 60 seconds', benchmarks: { 'U-14': { male: { avg: 20, good: 30, excellent: 40 }, female: { avg: 18, good: 26, excellent: 35 } }, 'U-16': { male: { avg: 25, good: 35, excellent: 45 }, female: { avg: 22, good: 30, excellent: 40 } } } },
    { key: 'footwork_test', name: 'Footwork Test', nameTamil: 'கால் வேலை சோதனை', unit: 's', inputType: 'timer', description: 'Time to complete 6-point footwork drill', benchmarks: { 'U-14': { male: { avg: 18.0, good: 15.0, excellent: 13.0 }, female: { avg: 19.5, good: 16.5, excellent: 14.5 } }, 'U-16': { male: { avg: 16.0, good: 13.5, excellent: 11.5 }, female: { avg: 17.5, good: 15.0, excellent: 13.0 } } } },
  ],
  Wrestling: [
    { key: 'pushups_60s', name: 'Push-ups (60s)', nameTamil: 'புஷ்-அப் (60வி)', unit: 'count', inputType: 'count', description: 'Number of push-ups in 60 seconds', benchmarks: { 'U-14': { male: { avg: 25, good: 40, excellent: 55 }, female: { avg: 15, good: 25, excellent: 35 } }, 'U-16': { male: { avg: 35, good: 50, excellent: 65 }, female: { avg: 20, good: 35, excellent: 45 } } } },
    { key: 'situps_60s', name: 'Sit-ups (60s)', nameTamil: 'சிட்-அப் (60வி)', unit: 'count', inputType: 'count', description: 'Number of sit-ups in 60 seconds', benchmarks: { 'U-14': { male: { avg: 30, good: 45, excellent: 60 }, female: { avg: 25, good: 40, excellent: 55 } }, 'U-16': { male: { avg: 40, good: 55, excellent: 70 }, female: { avg: 35, good: 50, excellent: 65 } } } },
    { key: 'flexibility', name: 'Flexibility', nameTamil: 'நெகிழ்வுத்தன்மை', unit: 'cm', inputType: 'manual', description: 'Sit-and-reach flexibility measurement', benchmarks: { 'U-14': { male: { avg: 20, good: 28, excellent: 35 }, female: { avg: 24, good: 32, excellent: 38 } }, 'U-16': { male: { avg: 22, good: 30, excellent: 37 }, female: { avg: 26, good: 34, excellent: 40 } } } },
    { key: 'weight', name: 'Body Weight', nameTamil: 'உடல் எடை', unit: 'kg', inputType: 'manual', description: 'Athlete body weight', benchmarks: { 'U-14': { male: { avg: 45, good: 50, excellent: 55 }, female: { avg: 42, good: 48, excellent: 52 } }, 'U-16': { male: { avg: 55, good: 60, excellent: 68 }, female: { avg: 50, good: 55, excellent: 62 } } } },
  ],
  Athletics_Track: [
    { key: '100m', name: '100m Sprint', nameTamil: '100மீ ஓட்டம்', unit: 's', inputType: 'timer', description: '100 meter sprint time', benchmarks: { 'U-14': { male: { avg: 14.0, good: 13.0, excellent: 12.0 }, female: { avg: 15.0, good: 14.0, excellent: 13.0 } }, 'U-16': { male: { avg: 13.5, good: 12.5, excellent: 11.8 }, female: { avg: 14.2, good: 13.2, excellent: 12.5 } } } },
    { key: '200m', name: '200m Sprint', nameTamil: '200மீ ஓட்டம்', unit: 's', inputType: 'timer', description: '200 meter sprint time', benchmarks: { 'U-14': { male: { avg: 29.0, good: 27.0, excellent: 25.0 }, female: { avg: 32.0, good: 29.5, excellent: 27.5 } }, 'U-16': { male: { avg: 27.5, good: 25.5, excellent: 23.5 }, female: { avg: 30.0, good: 28.0, excellent: 26.0 } } } },
    { key: '400m', name: '400m Run', nameTamil: '400மீ ஓட்டம்', unit: 's', inputType: 'timer', description: '400 meter run time', benchmarks: { 'U-14': { male: { avg: 72, good: 66, excellent: 60 }, female: { avg: 80, good: 74, excellent: 68 } }, 'U-16': { male: { avg: 65, good: 58, excellent: 53 }, female: { avg: 72, good: 66, excellent: 60 } } } },
    { key: '800m', name: '800m Run', nameTamil: '800மீ ஓட்டம்', unit: 's', inputType: 'timer', description: '800 meter run time', benchmarks: { 'U-14': { male: { avg: 170, good: 155, excellent: 140 }, female: { avg: 185, good: 170, excellent: 155 } }, 'U-16': { male: { avg: 155, good: 140, excellent: 125 }, female: { avg: 170, good: 155, excellent: 140 } } } },
    { key: '1500m', name: '1500m Run', nameTamil: '1500மீ ஓட்டம்', unit: 's', inputType: 'timer', description: '1500 meter run time', benchmarks: { 'U-14': { male: { avg: 340, good: 310, excellent: 280 }, female: { avg: 370, good: 340, excellent: 310 } }, 'U-16': { male: { avg: 310, good: 280, excellent: 255 }, female: { avg: 340, good: 310, excellent: 285 } } } },
  ],
  Athletics_Field: [
    { key: 'long_jump', name: 'Long Jump', nameTamil: 'நீளம் தாண்டுதல்', unit: 'm', inputType: 'manual', description: 'Longest jump distance', benchmarks: { 'U-14': { male: { avg: 4.0, good: 4.8, excellent: 5.5 }, female: { avg: 3.5, good: 4.2, excellent: 4.8 } }, 'U-16': { male: { avg: 4.8, good: 5.6, excellent: 6.4 }, female: { avg: 4.2, good: 4.9, excellent: 5.5 } } } },
    { key: 'high_jump', name: 'High Jump', nameTamil: 'உயரம் தாண்டுதல்', unit: 'm', inputType: 'manual', description: 'Highest successful jump', benchmarks: { 'U-14': { male: { avg: 1.25, good: 1.45, excellent: 1.65 }, female: { avg: 1.15, good: 1.35, excellent: 1.50 } }, 'U-16': { male: { avg: 1.45, good: 1.65, excellent: 1.85 }, female: { avg: 1.30, good: 1.50, excellent: 1.65 } } } },
    { key: 'shot_put', name: 'Shot Put', nameTamil: 'குண்டு எறிதல்', unit: 'm', inputType: 'manual', description: 'Shot put throw distance', benchmarks: { 'U-14': { male: { avg: 8.0, good: 10.5, excellent: 13.0 }, female: { avg: 7.0, good: 9.0, excellent: 11.0 } }, 'U-16': { male: { avg: 10.5, good: 13.0, excellent: 15.5 }, female: { avg: 9.0, good: 11.5, excellent: 13.5 } } } },
    { key: 'discus', name: 'Discus Throw', nameTamil: 'வட்டு எறிதல்', unit: 'm', inputType: 'manual', description: 'Discus throw distance', benchmarks: { 'U-14': { male: { avg: 22.0, good: 30.0, excellent: 38.0 }, female: { avg: 18.0, good: 25.0, excellent: 32.0 } }, 'U-16': { male: { avg: 30.0, good: 40.0, excellent: 50.0 }, female: { avg: 25.0, good: 33.0, excellent: 42.0 } } } },
    { key: 'javelin', name: 'Javelin Throw', nameTamil: 'ஈட்டி எறிதல்', unit: 'm', inputType: 'manual', description: 'Javelin throw distance', benchmarks: { 'U-14': { male: { avg: 25.0, good: 35.0, excellent: 45.0 }, female: { avg: 20.0, good: 28.0, excellent: 38.0 } }, 'U-16': { male: { avg: 35.0, good: 48.0, excellent: 60.0 }, female: { avg: 28.0, good: 38.0, excellent: 48.0 } } } },
  ],
  Swimming: [
    { key: '50m_freestyle', name: '50m Freestyle', nameTamil: '50மீ ஃப்ரீஸ்டைல்', unit: 's', inputType: 'timer', description: '50 meter freestyle swim time', benchmarks: { 'U-14': { male: { avg: 40.0, good: 33.0, excellent: 28.0 }, female: { avg: 42.0, good: 35.0, excellent: 30.0 } }, 'U-16': { male: { avg: 35.0, good: 29.0, excellent: 25.0 }, female: { avg: 38.0, good: 32.0, excellent: 28.0 } } } },
    { key: '100m_freestyle', name: '100m Freestyle', nameTamil: '100மீ ஃப்ரீஸ்டைல்', unit: 's', inputType: 'timer', description: '100 meter freestyle swim time', benchmarks: { 'U-14': { male: { avg: 95.0, good: 75.0, excellent: 62.0 }, female: { avg: 100.0, good: 80.0, excellent: 66.0 } }, 'U-16': { male: { avg: 85.0, good: 66.0, excellent: 56.0 }, female: { avg: 92.0, good: 72.0, excellent: 62.0 } } } },
    { key: 'technique_score', name: 'Technique Score', nameTamil: 'நுட்ப மதிப்பெண்', unit: '/5', inputType: 'rating', description: 'Coach-rated technique score (1-5)', benchmarks: { 'U-14': { male: { avg: 3, good: 4, excellent: 5 }, female: { avg: 3, good: 4, excellent: 5 } }, 'U-16': { male: { avg: 3.5, good: 4.5, excellent: 5 }, female: { avg: 3.5, good: 4.5, excellent: 5 } } } },
  ],
  Boxing: [
    { key: 'punch_count_30s', name: 'Punch Count (30s)', nameTamil: 'குத்து எண்ணிக்கை', unit: 'count', inputType: 'count', description: 'Number of punches in 30 seconds', benchmarks: { 'U-14': { male: { avg: 100, good: 130, excellent: 160 }, female: { avg: 90, good: 120, excellent: 150 } }, 'U-16': { male: { avg: 120, good: 150, excellent: 180 }, female: { avg: 110, good: 140, excellent: 170 } } } },
    { key: 'reaction_test', name: 'Reaction Test', nameTamil: 'எதிர்வினை சோதனை', unit: 's', inputType: 'timer', description: 'Visual stimulus reaction time', benchmarks: { 'U-14': { male: { avg: 0.35, good: 0.25, excellent: 0.18 }, female: { avg: 0.38, good: 0.28, excellent: 0.21 } }, 'U-16': { male: { avg: 0.30, good: 0.22, excellent: 0.15 }, female: { avg: 0.33, good: 0.25, excellent: 0.18 } } } },
    { key: 'endurance_3min', name: 'Endurance (3 min)', nameTamil: 'சகிப்பு (3 நிமிடம்)', unit: '/5', inputType: 'rating', description: 'Rated endurance over 3-minute round (1-5)', benchmarks: { 'U-14': { male: { avg: 3, good: 4, excellent: 5 }, female: { avg: 3, good: 4, excellent: 5 } }, 'U-16': { male: { avg: 3.5, good: 4.5, excellent: 5 }, female: { avg: 3.5, good: 4.5, excellent: 5 } } } },
    { key: 'weight', name: 'Body Weight', nameTamil: 'உடல் எடை', unit: 'kg', inputType: 'manual', description: 'Athlete body weight', benchmarks: { 'U-14': { male: { avg: 45, good: 50, excellent: 55 }, female: { avg: 42, good: 48, excellent: 52 } }, 'U-16': { male: { avg: 55, good: 60, excellent: 68 }, female: { avg: 50, good: 55, excellent: 62 } } } },
  ],
  Archery: [
    { key: 'score_10m', name: 'Score at 10m', nameTamil: '10மீ மதிப்பெண்', unit: '/300', inputType: 'manual', description: 'Total score at 10 meters (0-300)', benchmarks: { 'U-14': { male: { avg: 180, good: 220, excellent: 260 }, female: { avg: 180, good: 220, excellent: 260 } }, 'U-16': { male: { avg: 200, good: 250, excellent: 280 }, female: { avg: 200, good: 250, excellent: 280 } } } },
    { key: 'score_20m', name: 'Score at 20m', nameTamil: '20மீ மதிப்பெண்', unit: '/300', inputType: 'manual', description: 'Total score at 20 meters (0-300)', benchmarks: { 'U-14': { male: { avg: 150, good: 190, excellent: 240 }, female: { avg: 150, good: 190, excellent: 240 } }, 'U-16': { male: { avg: 180, good: 230, excellent: 265 }, female: { avg: 180, good: 230, excellent: 265 } } } },
    { key: 'score_30m', name: 'Score at 30m', nameTamil: '30மீ மதிப்பெண்', unit: '/300', inputType: 'manual', description: 'Total score at 30 meters (0-300)', benchmarks: { 'U-14': { male: { avg: 120, good: 160, excellent: 210 }, female: { avg: 120, good: 160, excellent: 210 } }, 'U-16': { male: { avg: 150, good: 200, excellent: 245 }, female: { avg: 150, good: 200, excellent: 245 } } } },
  ],
  Weightlifting: [
    { key: 'snatch_max', name: 'Snatch Max', nameTamil: 'ஸ்நாட்ச் அதிகபட்சம்', unit: 'kg', inputType: 'manual', description: 'Maximum snatch lift weight', benchmarks: { 'U-14': { male: { avg: 30, good: 45, excellent: 60 }, female: { avg: 25, good: 35, excellent: 45 } }, 'U-16': { male: { avg: 45, good: 65, excellent: 85 }, female: { avg: 35, good: 50, excellent: 65 } } } },
    { key: 'clean_jerk_max', name: 'Clean & Jerk Max', nameTamil: 'க்ளீன் & ஜெர்க் அதிகபட்சம்', unit: 'kg', inputType: 'manual', description: 'Maximum clean & jerk lift weight', benchmarks: { 'U-14': { male: { avg: 40, good: 55, excellent: 75 }, female: { avg: 30, good: 45, excellent: 60 } }, 'U-16': { male: { avg: 60, good: 80, excellent: 105 }, female: { avg: 45, good: 65, excellent: 80 } } } },
    { key: 'body_weight', name: 'Body Weight', nameTamil: 'உடல் எடை', unit: 'kg', inputType: 'manual', description: 'Athlete body weight', benchmarks: { 'U-14': { male: { avg: 45, good: 50, excellent: 55 }, female: { avg: 42, good: 48, excellent: 52 } }, 'U-16': { male: { avg: 55, good: 60, excellent: 68 }, female: { avg: 50, good: 55, excellent: 62 } } } },
  ],
};

/**
 * SAI_TESTS — the 8 standard SAI (Sports Authority of India) battery tests
 */
export const SAI_TESTS = [
  { key: '30m_sprint', name: '30m Sprint', nameTamil: '30மீ ஓட்டம்', unit: 's', inputType: 'timer', description: 'Sprint 30 meters as fast as possible. Stand behind the starting line. On "Go", sprint to the finish line.', icon: '🏃', benchmarks: { 'U-14': { male: { avg: 5.2, good: 4.8, excellent: 4.4 }, female: { avg: 5.5, good: 5.1, excellent: 4.7 } }, 'U-16': { male: { avg: 4.9, good: 4.5, excellent: 4.1 }, female: { avg: 5.3, good: 4.8, excellent: 4.5 } } } },
  { key: '60m_sprint', name: '60m Sprint', nameTamil: '60மீ ஓட்டம்', unit: 's', inputType: 'timer', description: 'Sprint 60 meters at full speed. Stand behind the starting line. On "Go", sprint through the finish line.', icon: '🏃‍♂️', benchmarks: { 'U-14': { male: { avg: 9.5, good: 8.5, excellent: 7.8 }, female: { avg: 10.0, good: 9.0, excellent: 8.2 } }, 'U-16': { male: { avg: 8.8, good: 7.9, excellent: 7.2 }, female: { avg: 9.4, good: 8.4, excellent: 7.6 } } } },
  { key: '600m_run', name: '600m Run', nameTamil: '600மீ ஓட்டம்', unit: 's', inputType: 'timer', description: 'Run 600 meters (1.5 laps of a standard track). Pace yourself for endurance.', icon: '🏃‍♀️', benchmarks: { 'U-14': { male: { avg: 130, good: 115, excellent: 100 }, female: { avg: 145, good: 130, excellent: 115 } }, 'U-16': { male: { avg: 115, good: 100, excellent: 90 }, female: { avg: 130, good: 115, excellent: 105 } } } },
  { key: 'standing_broad_jump', name: 'Standing Broad Jump', nameTamil: 'நிலை நீளம் தாண்டுதல்', unit: 'm', inputType: 'manual', description: 'Stand with toes behind the line. Jump forward as far as possible. Measure from the line to the nearest contact point.', icon: '🦘', benchmarks: { 'U-14': { male: { avg: 1.8, good: 2.1, excellent: 2.4 }, female: { avg: 1.6, good: 1.9, excellent: 2.2 } }, 'U-16': { male: { avg: 2.1, good: 2.4, excellent: 2.7 }, female: { avg: 1.8, good: 2.1, excellent: 2.4 } } } },
  { key: 'vertical_jump', name: 'Vertical Jump', nameTamil: 'செங்குத்து தாவல்', unit: 'cm', inputType: 'manual', description: 'Stand next to a wall and reach up — mark the height. Jump as high as possible and mark again. Measure the difference.', icon: '⬆️', benchmarks: { 'U-14': { male: { avg: 35, good: 45, excellent: 55 }, female: { avg: 30, good: 40, excellent: 50 } }, 'U-16': { male: { avg: 45, good: 55, excellent: 65 }, female: { avg: 35, good: 45, excellent: 55 } } } },
  { key: 'shuttle_run_4x10m', name: 'Shuttle Run (4×10m)', nameTamil: 'ஷட்டில் ஓட்டம் (4x10மீ)', unit: 's', inputType: 'timer', description: 'Run between 2 lines 10m apart, 4 times (total 40m). Pick up and place blocks at each end.', icon: '🔄', benchmarks: { 'U-14': { male: { avg: 11.5, good: 10.5, excellent: 9.8 }, female: { avg: 12.0, good: 11.0, excellent: 10.2 } }, 'U-16': { male: { avg: 10.8, good: 9.8, excellent: 9.0 }, female: { avg: 11.4, good: 10.4, excellent: 9.6 } } } },
  { key: 'flexibility_sit_reach', name: 'Sit & Reach', nameTamil: 'உட்கார்ந்து நீட்டு', unit: 'cm', inputType: 'manual', description: 'Sit with legs straight. Reach forward as far as possible along the ruler. Record the furthest reach in cm.', icon: '🧘', benchmarks: { 'U-14': { male: { avg: 15, good: 20, excellent: 25 }, female: { avg: 18, good: 24, excellent: 28 } }, 'U-16': { male: { avg: 18, good: 24, excellent: 28 }, female: { avg: 20, good: 26, excellent: 32 } } } },
  { key: 'bmi', name: 'BMI', nameTamil: 'உடல் நிறை குறியீடு', unit: 'kg/m²', inputType: 'calculated', description: 'Body Mass Index = weight (kg) / height (m)². Enter height and weight to auto-calculate.', icon: '⚖️', benchmarks: { 'U-14': { male: { avg: 19, good: 21, excellent: 21 }, female: { avg: 19, good: 21, excellent: 21 } }, 'U-16': { male: { avg: 20, good: 22, excellent: 22 }, female: { avg: 20, good: 22, excellent: 22 } } } },
];

/**
 * Sport emoji map for UI display
 */
export const SPORT_ICONS = {
  Cricket: '🏏',
  Football: '⚽',
  Kabaddi: '🤼',
  Hockey: '🏑',
  Badminton: '🏸',
  Wrestling: '🤼‍♂️',
  Athletics_Track: '🏃',
  Athletics_Field: '🥏',
  Swimming: '🏊',
  Boxing: '🥊',
  Archery: '🏹',
  Weightlifting: '🏋️',
};

/**
 * Calculates a percentile score (0-100) based on metric benchmarks.
 * @param {number} value - The recorded value for the metric
 * @param {string} metricKey - The unique key of the metric
 * @param {string} ageGroup - e.g. "U-14", "U-16"
 * @param {string} gender - "male" or "female"
 * @returns {number} Score from 0 to 100
 */
export const calculatePercentile = (value, metricKey, ageGroup = 'U-16', gender = 'male') => {
  if (value === undefined || value === null || isNaN(value)) return 0;

  // Find metric in SAI_TESTS or SPORT_METRICS
  let metric = SAI_TESTS.find(m => m.key === metricKey);
  if (!metric) {
    for (const sport in SPORT_METRICS) {
      const found = SPORT_METRICS[sport].find(m => m.key === metricKey);
      if (found) {
        metric = found;
        break;
      }
    }
  }

  if (!metric || !metric.benchmarks) return 50; // default middle if no benchmark

  const ageData = metric.benchmarks[ageGroup] || metric.benchmarks['U-16'];
  const data = ageData[gender] || ageData.male;

  // If time-based (lower is better) or count/distance (higher is better)
  const isLowerBetter = ['s', 'timer', 'shuttle_run', 'run', 'sprint'].some(k => metricKey.includes(k) || metric.unit === 's');

  let percentile = 0;

  if (isLowerBetter) {
    if (value <= data.excellent) percentile = 100;
    else if (value <= data.good) percentile = 75 + ((data.good - value) / (data.good - data.excellent)) * 25;
    else if (value <= data.avg) percentile = 50 + ((data.avg - value) / (data.avg - data.good)) * 25;
    else percentile = Math.max(0, 50 - ((value - data.avg) / data.avg) * 50);
  } else {
    if (value >= data.excellent) percentile = 100;
    else if (value >= data.good) percentile = 75 + ((value - data.good) / (data.excellent - data.good)) * 25;
    else if (value >= data.avg) percentile = 50 + ((value - data.avg) / (data.good - data.avg)) * 25;
    else percentile = Math.max(0, 50 - ((data.avg - value) / data.avg) * 50);
  }

  return Math.min(100, Math.max(0, Math.round(percentile)));
};
