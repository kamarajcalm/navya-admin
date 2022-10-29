
import { getReferrer } from './utils';


export const isNavya = () => {
  const referrerType = getReferrer();
  if (referrerType && (referrerType === 'navya' || referrerType === 'tmc'))
  return true;
  return false;
}

export const isMSKCC = () => {
  const referrerType = getReferrer();
  if (referrerType && referrerType === 'mskcc')
  return true;
  return false;
}

export const isPM = () => {
  const referrerType = getReferrer();
  if (referrerType && referrerType === 'pm')
  return true;
  return false;
}

export const isAccessHope = () => {
  const referrerType = getReferrer();
  if (referrerType && referrerType === 'accesshope')
  return true;
  return false;
}
