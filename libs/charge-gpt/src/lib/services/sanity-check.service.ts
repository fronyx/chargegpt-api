import { Injectable } from '@nestjs/common';
import { ConversationHistory } from '../models/conversation-history.model';
import { ChatGptService } from './chat-gpt.service';
import { ToolkitProject } from '@fronyx/toolkit';

@Injectable()
export class SanityCheckService {

    constructor(
        private readonly chatGptService: ChatGptService
    ) { }

    async checkResponse(
        history: ConversationHistory,
        project: ToolkitProject
        ): Promise<{
            responseIsSane: boolean,
            insaneReason: string
        }> {
        return {
            responseIsSane: true,
            insaneReason: ''
        };
    }
}
