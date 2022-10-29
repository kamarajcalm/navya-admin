
import { getReferrer } from '../utils';

const defaultVars = {
  'color': '#893487',
  'color-rgb': '137, 52, 135',
  'color-contrast': '#ffffff',
  'color-contrast-rgb': '255, 255, 255',
  'color-shade': '#9e4f8c',
  'color-tint': '#bc6ba9',
  'color-dark': '#515151',
  'font-family': "Gotham Rounded SSm A, Gotham Rounded SSm B",
  'h1-font-family': "Gotham Rounded SSm A, Gotham Rounded SSm B",
  'login-background-color': '#fff',
  'text-color': '#515151'
};

export const avatarStyles = {
  'tmc': { ...defaultVars },
  'navya': { ...defaultVars },
  'accesshope': {
    'color': '#7817D6',
    'color-rgb': '0, 108, 190',
    'color-contrast': '#ffffff',
    'color-contrast-rgb': '255, 255, 255',
    'color-shade': '#4e75fb',
    'color-tint': '#1c73ca',
    'color-dark': '#515151',
    'font-family': "HCo Gotham SSm,Helvetica Neueu,helvetica,arial,sans-serif",
    'h1-font-family': 'HCo Gotham SSm,Helvetica Neueu,helvetica,arial,sans-serif',
    'login-background-color': '#4e75fb',
    'text-color': '#000'
  }
}

export const setAvatarStyles = (referrer) => {
  const style = avatarStyles[referrer] || defaultVars;
  setAvtStyles(style, null);
}

export const getAvatarStyles = () => {
  const referrer = getReferrer();
  return avatarStyles[referrer] || defaultVars;
}

function setAvtStyles(style, subProperty) {

  const rootStyle = document.documentElement.style;

  for (let styleProp in style ) {
    if (typeof style[styleProp] === 'object') {
      setAvtStyles(style[styleProp], styleProp);
    } else {
      let stylePropDisplay = subProperty ? `${subProperty}-${styleProp}` : styleProp;
      rootStyle.setProperty(`--ion-avatar-${stylePropDisplay}`, style[styleProp]);
    }
  }
}
