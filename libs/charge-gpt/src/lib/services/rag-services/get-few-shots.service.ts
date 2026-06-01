import { FewShot } from './few-shot.model';
import { render } from 'mustache';

export const getFewShotExamples = (fewShots: FewShot[], translationAssets: Record<string, unknown>): FewShot[] => {
    return fewShots.map(fewShot => ({
        ...fewShot,
        assistant: render(fewShot.assistant, translationAssets),
        user: render(fewShot.user, translationAssets),
    }));
};

export const renderFewShotTemplate = (fewShot: FewShot, translationAssets: Record<string, unknown>): FewShot => {
    return {
        ...fewShot,
        assistant: render(fewShot.assistant, translationAssets),
        user: render(fewShot.user, translationAssets),
    };
};