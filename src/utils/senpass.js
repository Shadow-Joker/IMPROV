import { generateHash } from './hashVerify';

/**
 * Generates a SenPass certificate data object
 * Tiers: Bronze, Silver, Gold, Platinum
 */
export async function generateSenPass(athlete, assessments, attestations) {
  const certId = 'SP-' + crypto.randomUUID().split('-')[0].toUpperCase();
  
  const certData = {
    id: certId,
    athleteId: athlete.id,
    athleteName: athlete.name,
    sport: athlete.sport,
    district: athlete.district,
    age: athlete.age,
    gender: athlete.gender,
    photo: athlete.photo,
    assessments: assessments.map(a => ({
      testType: a.testType,
      value: a.value,
      unit: a.unit,
      timestamp: a.timestamp,
      score: a.score || 0,
    })),
    witnessCount: attestations.length,
    witnesses: attestations.map(a => ({
      name: a.witnessName,
      phone: a.witnessPhone ? a.witnessPhone.slice(-4).padStart(10, '*') : '**********',
      verified: a.otpVerified,
    })),
    issuedAt: Date.now(),
    tier: calculateTier(assessments, attestations),
    issuer: athlete.registeredBy || 'System',
  };
  
  // Clean data for hashing (no circular refs)
  const dataToHash = {
    id: certData.id,
    athleteId: certData.athleteId,
    athleteName: certData.athleteName,
    sport: certData.sport,
    issuedAt: certData.issuedAt,
    tier: certData.tier,
    witnessCount: certData.witnessCount,
  };

  certData.hash = await generateHash(dataToHash);
  
  return certData;
}

function calculateTier(assessments, attestations) {
  const verifiedWitnesses = attestations.filter(a => a.otpVerified).length;
  const hasVideo = assessments.some(a => a.videoClip);
  const noAnomalies = assessments.every(a => !a.anomalyFlags || a.anomalyFlags.length === 0);
  
  if (verifiedWitnesses >= 3 && hasVideo && noAnomalies) return 'gold';
  if (verifiedWitnesses >= 3 && noAnomalies) return 'silver';
  if (verifiedWitnesses >= 1) return 'bronze';
  return 'basic';
}

export const TIER_COLORS = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  basic: '#A0A0A0'
};

export const TIER_BADGES = {
  gold: '🥇 GOLD AUTHENTICATED',
  silver: '🥈 SILVER VERIFIED',
  bronze: '🥉 BRONZE RECORDED',
  basic: '📄 BASIC SUBMISSION'
};
