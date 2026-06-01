import { Injectable } from '@nestjs/common';
import { sendFeedbackMetric } from './conversation-quality.service';
import { ToolkitProject } from '@fronyx/toolkit';
import { getHistory } from './conversation-factory.service';

@Injectable()
export class FeedbackService {
  async submitFeedback(args: {
    project: ToolkitProject;
    conversationId: string;
    feedback: string;
    text?: string;
    responseId?: string;
  }): Promise<void> {
    const history = await getHistory({
      conversationId: args.conversationId,
      project: args.project,
    });
    const lastUserRequest = history.getLastUserInput();

    const feedbackLog = {
      conversationId: args.conversationId,
      projectName: args.project.name,
      message: '[Feedback]',
      inner_message: {
        rating: args.feedback,
        text: args.text,
        lastUserRequest,
        responseId: args.responseId,
      },
    };
    console.log(JSON.stringify(feedbackLog));
    await sendFeedbackMetric(
      args.project.name,
      args.feedback
    );
  }
}
