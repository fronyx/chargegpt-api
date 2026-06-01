import { ConversationHistory } from '../models/conversation-history.model';
import { Coordinates, DialogFactory } from '../models/prompt';

export const setCurrentCoordinatesToHistory = (history: ConversationHistory, currentCoordinates: Coordinates) => {
    if ( history.isCurrentCoordinatesRequested() ) {
        const lastUserInput = history.getLastUserInput();
        history.addDialog(DialogFactory.fromUser(`${lastUserInput} - My current coordinates are: ${currentCoordinates.lat} / ${currentCoordinates.lng}`), true);
    }
    history.setLocationEnabled(true);
    history.setCurrentCoordinates(currentCoordinates);
}

export const resetHistoryCurrentCoordinates = (history: ConversationHistory) => {
    history.setLocationEnabled(false);
    history.setCurrentCoordinates('');
    history.setCountryCode('');
}
