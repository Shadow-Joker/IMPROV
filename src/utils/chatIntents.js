export const INTENTS = [
  // Navigation
  { keywords: ['register', 'signup', 'new athlete', 'add athlete', 'பதிவு', 'coach'], 
    action: 'navigate', target: '/register', 
    response: 'Opening the athlete registration portal. Vanakkam! How can I help with registration?' },
  { keywords: ['assess', 'test', 'timer', 'record', 'measure', 'பரிசோதனை', 'sprint', 'run'], 
    action: 'navigate', target: '/assess', 
    response: 'Starting the assessment module. Get your stopwatch ready!' },
  { keywords: ['scout', 'search', 'find', 'discover', 'talent', 'தேடு', 'heatmap'], 
    action: 'navigate', target: '/scout', 
    response: 'Loading the Scout Dashboard. Discovering talent across Tamil Nadu...' },
  { keywords: ['profile', 'my profile', 'passport', 'senpass', 'சுயவிவரம்', 'id'], 
    action: 'navigate', target: '/profile', 
    response: 'Navigating to your Athlete Profile and SenPass Vault.' },
  { keywords: ['scheme', 'scholarship', 'fund', 'money', 'grant', 'உதவித்தொகை'], 
    action: 'navigate', target: '/schemes', 
    response: 'Checking current government scholarships and sports schemes for you.' },
  { keywords: ['setting', 'language', 'tamil', 'english', 'அமைப்பு', 'profile settings'], 
    action: 'navigate', target: '/settings', 
    response: 'Opening settings. You can change your language or update your profile here.' },
  { keywords: ['challenge', 'competition', 'district', 'போட்டி'], 
    action: 'navigate', target: '/challenges', 
    response: 'Showing active district challenges and leaderboards.' },
  
  // Queries
  { keywords: ['how many', 'count', 'total', 'athletes registered', 'எத்தனை', 'வீரர்கள்'], 
    action: 'query', handler: 'countAthletes', 
    response: 'Let me check the database...' },
  { keywords: ['what is', 'explain', 'help', 'how to', 'உதவி', 'guide'], 
    action: 'help', handler: 'showHelp', 
    response: 'SENTRAK is a digital talent discovery platform. I can help you register athletes or record scores.' },
  { keywords: ['rating', 'score', 'talent', 'rank', 'தரம்'], 
    action: 'query', handler: 'showRating', 
    response: 'Analyzing your performance metrics...' },
  { keywords: ['offline', 'sync', 'connected', 'internet', 'இணையம்'], 
    action: 'query', handler: 'checkStatus', 
    response: 'Checking your connectivity status...' },
  
  // Greetings
  { keywords: ['hi', 'hello', 'hey', 'vanakkam', 'வணக்கம்', 'bot'], 
    action: 'greet', 
    response: 'Vanakkam! 🙏 I am SenBot, your AI Sports Assistant. I can navigate the app for you or answer queries in Tamil and English. What would you like to do?' },
];

export function classifyIntent(input) {
  const lower = input.toLowerCase().trim();
  if (!lower) return null;

  for (const intent of INTENTS) {
    if (intent.keywords.some(k => lower.includes(k))) return intent;
  }
  return { 
    action: 'unknown', 
    response: 'I am not sure about that. Try: "Show my profile", "Start assessment", or "Search schemes".' 
  };
}
