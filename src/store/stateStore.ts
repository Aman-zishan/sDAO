import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const bootStrapAtom = atomWithStorage('bootStrap', 0);
