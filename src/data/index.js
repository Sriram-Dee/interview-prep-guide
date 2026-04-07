import reactBasics from './reactBasics';
import reactHooks from './reactHooks';
import reactAdvanced from './reactAdvanced';
import reactPatterns from './reactPatterns';
import reactPerformance from './reactPerformance';
import reactEcosystem from './reactEcosystem';
import nodejs from './nodejs';
import expressjs from './expressjs';
import mongodb from './mongodb';
import websocket from './websocket';
import jsFundamentals from './jsFundamentals';
import mongoShell from './mongoShell';
import { behavioral, negotiation } from './behavioral';

export const questionSections = {
  'react-basics': reactBasics,
  'react-hooks': reactHooks,
  'react-advanced': reactAdvanced,
  'react-patterns': reactPatterns,
  'react-perf': reactPerformance,
  'react-ecosystem': reactEcosystem,
  'nodejs': nodejs,
  'expressjs': expressjs,
  'mongodb': mongodb,
  'mongo-shell': mongoShell,
  'websocket': websocket,
  'js-fundamentals': jsFundamentals,
};

export const behavioralData = behavioral;
export const negotiationData = negotiation;

export function getTotalQuestions() {
  let total = 0;
  for (const key in questionSections) {
    total += questionSections[key].length;
  }
  total += behavioral.length + negotiation.length;
  return total;
}

export function getSectionCount(sectionId) {
  if (sectionId === 'behavioral') return behavioral.length;
  if (sectionId === 'negotiation') return negotiation.length;
  return questionSections[sectionId]?.length || 0;
}
