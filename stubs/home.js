
import { getReferrer } from '../utils';

const tmcHome = []

const accessHopeHome = [];

const getStubForHome = () => {
  const referrer = getReferrer();
  switch(referrer) {
    case 'tmc':
      return tmcHome;
    case 'accesshope':
      return accessHopeHome;
  }
  return tmcHome;
}

export default getStubForHome;
