import { atom } from 'recoil';

const AuthAtom = atom<number | null>({
  key: 'auth',
  default: null,
});

export {AuthAtom}