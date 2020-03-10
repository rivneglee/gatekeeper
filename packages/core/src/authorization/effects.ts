import { Effect, EffectType } from '../types';

export const ALLOW_EFFECT: Effect = {
  type: EffectType.Allow,
};

export const NOTHING_EFFECT: Effect = {
  type: EffectType.Nothing,
};

export const DENY_EFFECT: Effect = {
  type: EffectType.Deny,
};
