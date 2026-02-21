/* ========================================
   SENTRAK — Government Sports Schemes Data + Matcher
   Owner: Rahul (feat/athlete)
   ======================================== */

export const SCHEMES = [
    {
        id: 'khelo-india',
        name: 'Khelo India Youth Games',
        nameTamil: 'கேலோ இந்தியா இளைஞர் விளையாட்டுகள்',
        description: 'National youth sports program supporting talented athletes with training, exposure and financial assistance.',
        eligibility: { minAge: 10, maxAge: 21, sports: [], genders: [], states: [], minPercentile: 0 },
        benefit: 'Annual scholarship covering training, equipment, diet and travel',
        benefitAmount: '₹5,00,000/year',
        url: 'https://kheloindia.gov.in',
    },
    {
        id: 'tops',
        name: 'Target Olympic Podium Scheme (TOPS)',
        nameTamil: 'இலக்கு ஒலிம்பிக் மேடை திட்டம் (TOPS)',
        description: 'Elite-level support for athletes with potential to win medals at Olympics and Paralympics.',
        eligibility: { minAge: 18, maxAge: 35, sports: [], genders: [], states: [], minPercentile: 90 },
        benefit: 'Customized training, international exposure, equipment and coaching',
        benefitAmount: '₹10,00,000+',
        url: 'https://tops.gov.in',
    },
    {
        id: 'sai-centers',
        name: 'SAI Training Centers',
        nameTamil: 'SAI பயிற்சி மையங்கள்',
        description: 'Sports Authority of India residential training centers for young athletes.',
        eligibility: { minAge: 14, maxAge: 21, sports: [], genders: [], states: [], minPercentile: 50 },
        benefit: 'Residential training, coaching, medical support and education',
        benefitAmount: '₹2,00,000/year',
        url: 'https://sportsauthorityofindia.nic.in',
    },
    {
        id: 'tn-cm-sports',
        name: 'TN CM Sports Development Fund',
        nameTamil: 'தமிழ்நாடு முதலமைச்சர் விளையாட்டு மேம்பாட்டு நிதி',
        description: 'Tamil Nadu state program to develop grassroots sports talent.',
        eligibility: { minAge: 8, maxAge: 25, sports: [], genders: [], states: ['Tamil Nadu', 'TN'], minPercentile: 0 },
        benefit: 'Cash award, training support and sports equipment',
        benefitAmount: '₹1,00,000',
        url: 'https://sportsdevelopment.tn.gov.in',
    },
    {
        id: 'nsdf',
        name: 'National Sports Development Fund',
        nameTamil: 'தேசிய விளையாட்டு மேம்பாட்டு நிதி',
        description: 'Merit-based funding for athletes showing exceptional promise.',
        eligibility: { minAge: 12, maxAge: 30, sports: [], genders: [], states: [], minPercentile: 60 },
        benefit: 'Training grants, equipment funding and travel support',
        benefitAmount: '₹50,000-5,00,000',
        url: 'https://yas.nic.in/sports/nsdf',
    },
    {
        id: 'rural-sports',
        name: 'Rural Sports Programme',
        nameTamil: 'கிராமப்புற விளையாட்டுத் திட்டம்',
        description: 'Dedicated program for discovering and nurturing sports talent in rural areas.',
        eligibility: { minAge: 8, maxAge: 21, sports: [], genders: [], states: [], minPercentile: 0 },
        benefit: 'Training camps, sports equipment and district-level exposure',
        benefitAmount: '₹50,000',
        url: 'https://ruralsports.gov.in',
    },
    {
        id: 'ugc-sports',
        name: 'Sports Scholarship (UGC)',
        nameTamil: 'விளையாட்டு உதவித்தொகை (UGC)',
        description: 'University Grants Commission scholarship for student athletes balancing sports and education.',
        eligibility: { minAge: 15, maxAge: 25, sports: [], genders: [], states: [], minPercentile: 40 },
        benefit: 'Tuition waiver, monthly stipend and sports fund',
        benefitAmount: '₹25,000-1,00,000',
        url: 'https://ugc.ac.in',
    },
    {
        id: 'scst-sports',
        name: 'SC/ST Sports Scholarship',
        nameTamil: 'SC/ST விளையாட்டு உதவித்தொகை',
        description: 'Reserved category scholarship for SC/ST students excelling in sports.',
        eligibility: { minAge: 10, maxAge: 25, sports: [], genders: [], states: [], minPercentile: 0 },
        benefit: 'Full scholarship covering training, education and equipment',
        benefitAmount: '₹75,000',
        url: 'https://socialjustice.nic.in',
    },
    {
        id: 'women-sports',
        name: 'Women in Sports Initiative',
        nameTamil: 'விளையாட்டில் பெண்கள் முன்முயற்சி',
        description: 'Special initiative to encourage and support female athletes at grassroots level.',
        eligibility: { minAge: 8, maxAge: 25, sports: [], genders: ['female'], states: [], minPercentile: 0 },
        benefit: 'Training support, safe sports facilities and coaching',
        benefitAmount: '₹1,00,000',
        url: 'https://wcd.nic.in',
    },
    {
        id: 'district-fund',
        name: 'District Sports Development Fund',
        nameTamil: 'மாவட்ட விளையாட்டு மேம்பாட்டு நிதி',
        description: 'District-level funding for promising athletes in local tournaments.',
        eligibility: { minAge: 8, maxAge: 21, sports: [], genders: [], states: [], minPercentile: 0 },
        benefit: 'Equipment, travel support and tournament registration',
        benefitAmount: '₹30,000',
        url: 'https://sportsdevelopment.gov.in',
    },
    {
        id: 'fit-india',
        name: 'Fit India Movement Grant',
        nameTamil: 'ஃபிட் இந்தியா இயக்க மானியம்',
        description: 'Grants for fitness programs and sports initiatives promoting healthy lifestyles.',
        eligibility: { minAge: 10, maxAge: 30, sports: [], genders: [], states: [], minPercentile: 0 },
        benefit: 'Fitness program funding and equipment support',
        benefitAmount: '₹20,000',
        url: 'https://fitindia.gov.in',
    },
    {
        id: 'state-council',
        name: 'State Sports Council Grant',
        nameTamil: 'மாநில விளையாட்டு கவுன்சில் மானியம்',
        description: 'State-level grants for athletes performing at state and national tournaments.',
        eligibility: { minAge: 12, maxAge: 25, sports: [], genders: [], states: [], minPercentile: 30 },
        benefit: 'Cash awards, coaching support and tournament sponsorship',
        benefitAmount: '₹50,000-2,00,000',
        url: 'https://sportscouncil.gov.in',
    },
];

/**
 * Match athlete against all schemes based on eligibility criteria
 * @param {Object} athlete - athlete object from dataShapes
 * @returns {Object[]} array of matching scheme objects
 */
export function matchSchemes(athlete) {
    if (!athlete) return [];

    return SCHEMES.filter((scheme) => {
        const elig = scheme.eligibility;

        // Age check
        if (athlete.age && elig.minAge && athlete.age < elig.minAge) return false;
        if (athlete.age && elig.maxAge && athlete.age > elig.maxAge) return false;

        // Gender check
        if (elig.genders && elig.genders.length > 0) {
            if (!elig.genders.includes(athlete.gender)) return false;
        }

        // Sport check
        if (elig.sports && elig.sports.length > 0) {
            if (!elig.sports.includes(athlete.sport)) return false;
        }

        // State check (for TN-specific schemes)
        if (elig.states && elig.states.length > 0) {
            // All athletes in SENTRAK are from TN, so this always passes
            // But keep the check for future extensibility
        }

        // Percentile check — use talent rating as proxy
        // Convert talentRating (1000-2500) to percentile (0-100)
        if (elig.minPercentile && elig.minPercentile > 0) {
            const percentile = Math.max(0, Math.min(100, ((athlete.talentRating - 1000) / 1500) * 100));
            if (percentile < elig.minPercentile) return false;
        }

        return true;
    });
}
