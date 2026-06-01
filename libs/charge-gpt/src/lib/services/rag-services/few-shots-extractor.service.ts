import { Dialog } from '../../models/prompt';
import { ProjectOutputType } from '../chat-gpt.service';
import { FewShot } from './few-shot.model';

export const extractFewShots = (
  prompt: Dialog[]
): {
  projectIds: string[];
  user: string;
  assistant: string;
}[] => {
  const dialogs = prompt.filter(({ role }) => role !== 'system');
  const fewShots = [];
  dialogs.forEach(({ content, role }, index) => {
    const currentIndex = Math.floor(index / 2);
    if (!fewShots[currentIndex]) {
      fewShots[currentIndex] = {
        projectIds: [],
        user: '',
        assistant: '',
      };
    }

    fewShots[currentIndex][role] = content;
  });

  return fewShots;
};

export const getValidFewshotsForProjectOutputType = (
  outputType: ProjectOutputType,
  fewShots: FewShot[]
): FewShot[] => {
  return fewShots.filter(({ projectIds }) => {
    if (!projectIds || projectIds.length === 0) {
      return true;
    }

    return projectIds.includes(outputType);
  });
};
