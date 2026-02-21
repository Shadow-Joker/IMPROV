/* ========================================
   SENTRAK — Translations (English + Tamil)
   Owner: Rahul (feat/athlete)
   Phase 2: Complete audit — every UI string
   ======================================== */

const translations = {
    en: {
        // Navigation
        home: 'Home',
        register: 'Register',
        assess: 'Assess',
        scout: 'Scout',
        challenges: 'Challenges',
        profile: 'Profile',
        demo: 'Demo',

        // Registration
        name: 'Name',
        nameTamil: 'Name in Tamil',
        age: 'Age',
        gender: 'Gender',
        sport: 'Sport',
        district: 'District',
        village: 'Village',
        photo: 'Photo',
        submit: 'Submit',
        male: 'Male',
        female: 'Female',
        other: 'Other',

        // Registration prompts
        promptName: "What is the athlete's name?",
        promptNameTamil: "What is the name in Tamil?",
        promptAge: 'How old is the athlete?',
        promptGender: 'Select gender',
        promptSport: 'Which sport does the athlete play?',
        promptDistrict: 'Which district?',
        promptVillage: 'Which village or town?',
        promptPhoto: 'Take a photo of the athlete',
        promptReview: 'Review and confirm details',

        // Registration steps
        step1Title: 'Athlete Name',
        step2Title: 'Age & Gender',
        step3Title: 'Sport Selection',
        step4Title: 'Location',
        step5Title: 'Photo Capture',
        step6Title: 'Review & Submit',

        // Mental assessment
        mentalAssessment: 'Mental Profile Assessment',
        mentalScore: 'Mental Score',
        toughness: 'Toughness',
        teamwork: 'Teamwork',
        drive: 'Drive',
        strategy: 'Strategy',
        discipline: 'Discipline',
        questionOf: 'of',

        // Mental questions
        mq1: 'How quickly do you bounce back after a loss?',
        mq2: 'How well do you perform under pressure?',
        mq3: 'Can you stay focused during long training sessions?',
        mq4: 'Do you prefer team activities or individual ones?',
        mq5: 'How do you react when a teammate makes a mistake?',
        mq6: 'Do you actively encourage your teammates?',
        mq7: 'How many hours do you practice on your own each week?',
        mq8: 'Do you enjoy facing stronger opponents?',
        mq9: 'Do you set specific goals for yourself?',
        mq10: 'Can you adapt your strategy during a match?',
        mq11: "Can you identify your opponent's weaknesses?",
        mq12: 'Do you review your past performances?',
        mq13: 'How often do you skip practice?',
        mq14: 'Do you follow a daily routine?',
        mq15: 'Can you stay committed to boring training drills?',

        // Scale labels
        scale1: 'Never',
        scale2: 'Rarely',
        scale3: 'Sometimes',
        scale4: 'Often',
        scale5: 'Always',

        // Mental result messages
        championMindset: 'Champion Mindset! 🏆',
        strongPotential: 'Strong Potential! 💪',
        growingAthlete: 'Growing Athlete 🌱',
        keepTraining: 'Keep Training! 🎯',

        // Schemes
        schemesTitle: 'Government Sports Schemes',
        schemesSubtitle: 'Schemes you may qualify for',
        schemesMatched: 'Schemes You Qualify For',
        youQualify: 'You Qualify! ✓',
        learnMore: 'Learn More',
        applyNow: 'Apply Now →',
        benefit: 'Benefit',
        eligibility: 'Eligibility',
        noSchemes: 'Complete your profile to see matching schemes',
        totalPotentialValue: 'Total potential value',

        // Profile
        viewProfile: 'View Profile',
        talentRating: 'Talent Rating',
        totalAssessments: 'Total Assessments',
        communityVerified: 'Community Verified',
        assessments: 'Assessments',
        verified: 'Verified',
        pending: 'Pending',
        share: 'Share Profile',
        shareProfile: 'Share Profile',
        shareSuccess: 'Profile link copied!',
        copiedToClipboard: 'Copied to clipboard!',
        editProfile: 'Edit Profile',
        newAssessment: 'New Assessment',
        firstAssessmentCTA: 'Record your first assessment →',
        rankInDistrict: 'Rank in district',

        // Passport
        digitalPassport: 'Digital Talent Passport',
        talentPassport: 'Talent Passport',
        downloadPassport: 'Download Passport',
        downloadCard: 'Download Card',
        printPassport: 'Print Passport',
        printCard: 'Print Card',
        scanToVerify: 'Scan to verify',
        generatedOn: 'Generated on',
        athleteProfile: 'Athlete Profile',
        overallScore: 'Overall Score',

        // Photo
        photoCapture: 'Take Photo',
        retakePhoto: 'Retake',
        uploadFromGallery: 'Upload from gallery',

        // Steps
        step: 'Step',
        of: 'of',
        reviewSubmit: 'Review & Submit',

        // Common
        save: 'Save',
        cancel: 'Cancel',
        next: 'Next',
        back: 'Back',
        confirm: 'Confirm',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        offline: 'You are offline. Data is saved locally.',
        retry: 'Retry',
        close: 'Close',
        edit: 'Edit',
        tryAgain: 'Try Again',
        typeInstead: '⌨️ Type instead',
        registerAnother: 'Register Another',
        athleteRegistered: '🎉 Athlete Registered!',

        // Status messages
        registerSuccess: 'Athlete registered successfully!',
        profileSaved: 'Profile saved successfully!',
        mentalComplete: 'Mental assessment completed!',
        assessmentRecorded: 'Assessment recorded!',
        noAthleteFound: 'Athlete not found',

        // Error messages
        cameraError: 'Camera access denied or unavailable',
        cameraPermissionDenied: 'Camera permission denied. Please allow camera access in Settings.',
        voiceNotSupported: 'Voice input not supported in this browser',
        micPermDenied: 'Microphone permission denied',
        micPermissionDenied: 'Microphone permission denied. Please allow mic access in Settings.',
        noSpeechDetected: 'No speech detected. Tap the mic and speak clearly.',
        networkError: 'Speech recognition needs internet. Type your answer instead.',
        saveError: 'Failed to save data. Please try again.',

        // Voice
        tapToSpeak: 'Tap to speak',
        listening: 'Listening...',
        speakNow: 'Speak now...',
        voiceInput: 'Voice Input',

        // Demo
        demoModeBanner: "You're in demo mode — registration data is stored locally",
    },

    ta: {
        // Navigation
        home: 'முகப்பு',
        register: 'பதிவு',
        assess: 'மதிப்பீடு',
        scout: 'சாரணம்',
        challenges: 'சவால்கள்',
        profile: 'சுயவிவரம்',
        demo: 'விளக்கம்',

        // Registration
        name: 'பெயர்',
        nameTamil: 'தமிழில் பெயர்',
        age: 'வயது',
        gender: 'பாலினம்',
        sport: 'விளையாட்டு',
        district: 'மாவட்டம்',
        village: 'ஊர்',
        photo: 'புகைப்படம்',
        submit: 'சமர்ப்பி',
        male: 'ஆண்',
        female: 'பெண்',
        other: 'மற்றவை',

        // Registration prompts
        promptName: 'விளையாட்டு வீரரின் பெயர் என்ன?',
        promptNameTamil: 'தமிழில் பெயர் என்ன?',
        promptAge: 'விளையாட்டு வீரரின் வயது என்ன?',
        promptGender: 'பாலினத்தைத் தேர்ந்தெடுக்கவும்',
        promptSport: 'எந்த விளையாட்டு விளையாடுகிறார்?',
        promptDistrict: 'எந்த மாவட்டம்?',
        promptVillage: 'எந்த ஊர்?',
        promptPhoto: 'விளையாட்டு வீரரின் புகைப்படம் எடுக்கவும்',
        promptReview: 'விவரங்களை மதிப்பாய்வு செய்து உறுதிப்படுத்தவும்',

        // Registration steps
        step1Title: 'வீரரின் பெயர்',
        step2Title: 'வயது & பாலினம்',
        step3Title: 'விளையாட்டு தேர்வு',
        step4Title: 'இருப்பிடம்',
        step5Title: 'புகைப்படம்',
        step6Title: 'மதிப்பாய்வு & சமர்ப்பி',

        // Mental assessment
        mentalAssessment: 'மன திறன் மதிப்பீடு',
        mentalScore: 'மன திறன் மதிப்பெண்',
        toughness: 'மன உறுதி',
        teamwork: 'குழு ஒத்துழைப்பு',
        drive: 'உந்துதல்',
        strategy: 'உத்தி',
        discipline: 'ஒழுக்கம்',
        questionOf: '/',

        // Mental questions
        mq1: 'தோல்விக்குப் பிறகு எவ்வளவு விரைவாக மீள்கிறீர்கள்?',
        mq2: 'அழுத்தத்தின் கீழ் எவ்வளவு சிறப்பாக செயல்படுகிறீர்கள்?',
        mq3: 'நீண்ட பயிற்சி நேரங்களில் கவனம் செலுத்த முடியுமா?',
        mq4: 'குழு செயல்பாடுகள் அல்லது தனிப்பட்ட செயல்பாடுகளை விரும்புகிறீர்களா?',
        mq5: 'அணி வீரர் தவறு செய்யும் போது எப்படி எதிர்வினையாற்றுவீர்கள்?',
        mq6: 'உங்கள் அணி வீரர்களை ஊக்குவிக்கிறீர்களா?',
        mq7: 'வாரத்தில் எத்தனை மணி நேரம் தனியாக பயிற்சி செய்கிறீர்கள்?',
        mq8: 'வலுவான எதிரிகளை எதிர்கொள்ள விரும்புகிறீர்களா?',
        mq9: 'உங்களுக்கான குறிப்பிட்ட இலக்குகளை நிர்ணயிக்கிறீர்களா?',
        mq10: 'போட்டியின் போது உத்தியை மாற்ற முடியுமா?',
        mq11: 'எதிரியின் பலவீனங்களை கண்டறிய முடியுமா?',
        mq12: 'உங்கள் கடந்த கால செயல்திறனை மதிப்பாய்வு செய்கிறீர்களா?',
        mq13: 'எத்தனை முறை பயிற்சியை தவிர்க்கிறீர்கள்?',
        mq14: 'தினசரி வழக்கத்தை பின்பற்றுகிறீர்களா?',
        mq15: 'சலிப்பான பயிற்சிகளுக்கு உறுதியாக இருக்க முடியுமா?',

        // Scale labels
        scale1: 'ஒருபோதும் இல்லை',
        scale2: 'அரிதாக',
        scale3: 'சில நேரங்களில்',
        scale4: 'அடிக்கடி',
        scale5: 'எப்போதும்',

        // Mental result messages
        championMindset: 'சாம்பியன் மனநிலை! 🏆',
        strongPotential: 'வலுவான திறன்! 💪',
        growingAthlete: 'வளரும் வீரர் 🌱',
        keepTraining: 'பயிற்சியைத் தொடருங்கள்! 🎯',

        // Schemes
        schemesTitle: 'அரசு விளையாட்டுத் திட்டங்கள்',
        schemesSubtitle: 'நீங்கள் தகுதி பெறக்கூடிய திட்டங்கள்',
        schemesMatched: 'நீங்கள் தகுதி பெறும் திட்டங்கள்',
        youQualify: 'நீங்கள் தகுதி பெறுகிறீர்கள்! ✓',
        learnMore: 'மேலும் அறிய',
        applyNow: 'விண்ணப்பிக்க →',
        benefit: 'பயன்',
        eligibility: 'தகுதி',
        noSchemes: 'பொருத்தமான திட்டங்களைக் காண உங்கள் சுயவிவரத்தை நிறைவு செய்யுங்கள்',
        totalPotentialValue: 'மொத்த சாத்தியமான மதிப்பு',

        // Profile
        viewProfile: 'சுயவிவரத்தைக் காண',
        talentRating: 'திறமை மதிப்பீடு',
        totalAssessments: 'மொத்த மதிப்பீடுகள்',
        communityVerified: 'சமூக சரிபார்ப்பு',
        assessments: 'மதிப்பீடுகள்',
        verified: 'சரிபார்க்கப்பட்டது',
        pending: 'நிலுவையில்',
        share: 'சுயவிவரத்தைப் பகிர்',
        shareProfile: 'சுயவிவரத்தைப் பகிர்',
        shareSuccess: 'சுயவிவர இணைப்பு நகலெடுக்கப்பட்டது!',
        copiedToClipboard: 'கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது!',
        editProfile: 'சுயவிவரத்தைத் திருத்து',
        newAssessment: 'புதிய மதிப்பீடு',
        firstAssessmentCTA: 'உங்கள் முதல் மதிப்பீட்டைப் பதிவு செய்யுங்கள் →',
        rankInDistrict: 'மாவட்டத்தில் தரவரிசை',

        // Passport
        digitalPassport: 'டிஜிட்டல் திறமை கடவுச்சீட்டு',
        talentPassport: 'திறமை கடவுச்சீட்டு',
        downloadPassport: 'கடவுச்சீட்டைப் பதிவிறக்கு',
        downloadCard: 'அட்டையைப் பதிவிறக்கு',
        printPassport: 'கடவுச்சீட்டை அச்சிடு',
        printCard: 'அட்டையை அச்சிடு',
        scanToVerify: 'சரிபார்க்க ஸ்கேன் செய்யவும்',
        generatedOn: 'உருவாக்கப்பட்ட தேதி',
        athleteProfile: 'வீரர் சுயவிவரம்',
        overallScore: 'ஒட்டுமொத்த மதிப்பெண்',

        // Photo
        photoCapture: 'புகைப்படம் எடு',
        retakePhoto: 'மீண்டும் எடு',
        uploadFromGallery: 'கேலரியிலிருந்து பதிவேற்றவும்',

        // Steps
        step: 'படி',
        of: 'இல்',
        reviewSubmit: 'மதிப்பாய்வு & சமர்ப்பி',

        // Common
        save: 'சேமி',
        cancel: 'ரத்து செய்',
        next: 'அடுத்து',
        back: 'பின்',
        confirm: 'உறுதிப்படுத்து',
        loading: 'ஏற்றுகிறது...',
        error: 'பிழை',
        success: 'வெற்றி',
        offline: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். தரவு உள்ளூரில் சேமிக்கப்பட்டது.',
        retry: 'மீண்டும் முயற்சி',
        close: 'மூடு',
        edit: 'திருத்து',
        tryAgain: 'மீண்டும் முயற்சி செய்',
        typeInstead: '⌨️ தட்டச்சு செய்',
        registerAnother: 'மற்றொரு பதிவு',
        athleteRegistered: '🎉 வீரர் பதிவு செய்யப்பட்டார்!',

        // Status messages
        registerSuccess: 'வீரர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்!',
        profileSaved: 'சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது!',
        mentalComplete: 'மன மதிப்பீடு நிறைவடைந்தது!',
        assessmentRecorded: 'மதிப்பீடு பதிவு செய்யப்பட்டது!',
        noAthleteFound: 'வீரர் கிடைக்கவில்லை',

        // Error messages
        cameraError: 'கேமரா அணுகல் மறுக்கப்பட்டது அல்லது கிடைக்கவில்லை',
        cameraPermissionDenied: 'கேமரா அனுமதி மறுக்கப்பட்டது. அமைப்புகளில் கேமரா அணுகலை அனுமதிக்கவும்.',
        voiceNotSupported: 'இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை',
        micPermDenied: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது',
        micPermissionDenied: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. அமைப்புகளில் மைக் அணுகலை அனுமதிக்கவும்.',
        noSpeechDetected: 'பேச்சு கண்டறியப்படவில்லை. மைக்கை தட்டி தெளிவாக பேசுங்கள்.',
        networkError: 'குரல் அறிதல் இணையம் தேவை. தட்டச்சு செய்யுங்கள்.',
        saveError: 'தரவைச் சேமிக்க இயலவில்லை. மீண்டும் முயற்சிக்கவும்.',

        // Voice
        tapToSpeak: 'பேச தட்டவும்',
        listening: 'கேட்கிறது...',
        speakNow: 'இப்போது பேசுங்கள்...',
        voiceInput: 'குரல் உள்ளீடு',

        // Demo
        demoModeBanner: 'நீங்கள் டெமோ பயன்முறையில் உள்ளீர்கள் — பதிவுத் தரவு உள்ளூரில் சேமிக்கப்படும்',
    },
};

/**
 * Translation helper — returns the string for a given key and language.
 * Falls back to English, then returns the key itself if not found (no crash).
 * @param {string} key - translation key
 * @param {string} lang - 'en' or 'ta'
 * @returns {string}
 */
export function t(key, lang = 'en') {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
}

export default translations;
