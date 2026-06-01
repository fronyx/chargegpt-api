import axios from 'axios';
import { Dialog } from '../../../models/prompt';
import { useTryAsync } from 'no-try';

const url =
  process.env.OPENAI_CHAT_COMPLETIONS_URL ?? 'https://openai.example.com/openai/deployments/example/chat/completions?api-version=2023-12-01-preview';
const headers = {
  headers: { 'api-key': process.env.OPENAI_API_KEY ?? 'replace-me' },
  timeout: 5000,
};

export const quickTaskService = async (prompt: Dialog[]): Promise<string> => {
  const payload = {
      messages: [...prompt

      ],
      temperature: 0,
      seed: 1337,
  };

  let completion;
  let isSuccessful = false, retryCount = 0;
  while (!isSuccessful && retryCount < 4) {
    const [err, res] = await useTryAsync(() => axios.post<any>(url, payload, headers));

    if (err && retryCount === 3) {
      throw err;
    }

    if (err && (err as any).respons && (err as any).response.status === 429) {
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
      continue;
    } if (err) {
      throw err;
    }

    isSuccessful = true;
    completion = res;
  }
  const message = completion.data.choices[0].message;
  return message.content;
};
