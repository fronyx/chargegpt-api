import { Injectable } from '@nestjs/common';
import { Answer, DialogFactory, Record } from '../models/prompt';
import { resetHistoryCurrentCoordinates } from './current-coordinates-setter.util';
import { FilterResponseDto } from '../models/conversation-dto';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { ConversationHistory } from '../models/conversation-history.model';
import { ConversationService } from './conversations.service';
import { storeConversationHistory } from './conversation-persist.service';
import { ToolkitProject } from '@fronyx/toolkit';
import { getHistory } from './conversation-factory.service';

@Injectable()
export class ContextService {
  constructor(
    private readonly conversationService: ConversationService,
  ) {
  }

  async askChargeGptWithAdditionalContext(payload: {
    project: ToolkitProject,
    history: ConversationHistory,
    text: string,
    deniedContext?: string,
  }): Promise<Answer> {
    let text = payload.text;
    if (payload?.deniedContext === 'Location') {

      text = 'Location denied';
      resetHistoryCurrentCoordinates(payload.history);

      payload.history.addDialog(DialogFactory.fromUser(text), true);
    }

    return this.conversationService.processChat(payload.history, text, payload.project);
  }

  async recordUserActivity(payload: {
    project: ToolkitProject,
    conversationId: string,
    records: Record[]
  }): Promise<void> {
    const history = await getHistory(payload);
    for (const record of payload.records) {
      const isFilters = record.activity.includes('filters');
      const isInteger = record.activity.includes('integer_value');
      const isArray = record.activity.includes('array_value');
      const isBoolean = record.activity.includes('boolean_value');
      const isRemovedActivity = record.activity.includes('value_removed');
      const filterName = record?.filterName;
      const filterValue = record?.filterValue;

      if (isFilters) {
        if (!isObjectEmpty(record?.filters)) {
          await this.recordFiltersActivity(history, record.filters, payload.project);
        }
      }

      if (isInteger) {
        const currentValue = history.getData()?.[filterName];
        const operation = isRemovedActivity ? 'removeValue' : 'addValue';
        const {
          dialog,
          updatedValue
        } = new RecordIntegerActivity(filterName, Number(filterValue), currentValue)[operation]();

        if (!isEmptyString(dialog)) {
          recordFilters(history, filterName, updatedValue);
          history.addDialog(DialogFactory.fromUser(dialog), true);
        }
      }

      if (isArray) {
        const currentValue = history.getData()?.[filterName];
        const operation = isRemovedActivity ? 'removeValue' : 'addValue';
        const {
          dialog,
          updatedValue
        } = new RecordArrayActivity(filterName, filterValue, currentValue)[operation]();

        if (!isEmptyString(dialog)) {
          recordFilters(history, filterName, updatedValue);
          history.addDialog(DialogFactory.fromUser(dialog), true);
        }
      }

      if (isBoolean) {
        const currentValue = history.getData()?.[filterName];
        const operation = isRemovedActivity ? 'removeValue' : 'addValue';
        const {
          dialog,
          updatedValue
        } = new RecordBooleanActivity(filterName, currentValue)[operation]();

        if (!isEmptyString(dialog)) {
          recordFilters(history, filterName, updatedValue);
          history.addDialog(DialogFactory.fromUser(dialog), true);
        }
      }
    }
    await storeConversationHistory(history);
  }

  async recordFiltersActivity(history: ConversationHistory, filters: FilterResponseDto, project: ToolkitProject) {
    project.chargegpt_filter_config.forEach(({ name }) => {
      const value = filters[name];

      if (filters[name] === history.getData()[name]) {
        return;
      }

      recordFilters(history, name, value);
      history.addDialog(DialogFactory.fromUser(`Set ${name} to ${value}`), true);
    })
  }
}

export class RecordIntegerActivity {
  private readonly name: string;
  private readonly val: number;
  private readonly currentVal: number;

  constructor(name: string, value: number, currentValue: number) {
    this.name = name;
    this.val = value;
    this.currentVal = currentValue;
  }

  removeValue(): { dialog: string, updatedValue: number } {
    let updatedValue;

    if (isEmptyString(this.name)) {
      return {
        dialog: '',
        updatedValue: this.currentVal
      };
    }

    if (this.name === 'min_power') {
      updatedValue = 0;
    }

    if (this.name === 'max_power') {
      updatedValue = 500;
    }

    return {
      dialog: `Change ${this.name} to default value`,
      updatedValue
    }
  }

  addValue(): { dialog: string, updatedValue: number } {
    if (!this.val && isEmptyString(this.name)) {
      return {
        dialog: '',
        updatedValue: this.currentVal
      };
    }

    if (Number(this.val) === Number(this.currentVal)) {
      return {
        dialog: '',
        updatedValue: this.currentVal
      };
    }

    return {
      dialog: `Set ${this.name} to ${this.val}`,
      updatedValue: Number(this.val)
    }
  }
}

export class RecordArrayActivity {
  private readonly name: string;
  private readonly val: string;
  currentVal: string[];

  constructor(name: string, value: string, currentValue: string[]) {
    this.name = name;
    this.val = value;
    this.currentVal = currentValue;
  }

  removeValue(): { dialog: string, updatedValue: string[] } {
    if (isEmptyString(this.val) || isEmptyString(this.name) || isObjectEmpty(this.currentVal)) {
      return {
        dialog: '',
        updatedValue: this.currentVal
      };
    }

    if (this.currentVal.includes(this.val)) {
      return {
        dialog: `Remove ${this.val} from ${this.name}`,
        updatedValue: this.currentVal.filter(item => item !== this.val)
      }
    }

    return {
      dialog: '',
      updatedValue: this.currentVal
    };
  }

  addValue(): { dialog: string, updatedValue: string[] } {
    if (isEmptyString(this.val) && isEmptyString(this.name)) {
      return {
        dialog: '',
        updatedValue: this.currentVal
      };
    }

    if (!this.currentVal.includes(this.val)) {
      this.currentVal.push(this.val);

      return {
        dialog: `Add ${this.name}`,
        updatedValue: this.currentVal
      }
    }

    return {
      dialog: '',
      updatedValue: this.currentVal
    };
  }
}

export class RecordBooleanActivity {
  private readonly name: string;
  private readonly currentVal: boolean;

  constructor(name: string, currentValue: boolean) {
    this.name = name;
    this.currentVal = currentValue;
  }

  removeValue(): { dialog: string, updatedValue: boolean } {
    if (isEmptyString(this.name) || !this.currentVal) {
      return {
        dialog: '',
        updatedValue: this.currentVal
      };
    }

    if (this.currentVal) {
      return {
        dialog: `Disable ${this.name}`,
        updatedValue: !this.currentVal
      }
    }
  }

  addValue(): { dialog: string, updatedValue: boolean } {
    if (isEmptyString(this.name)) {
      return {
        dialog: '',
        updatedValue: this.currentVal
      };
    }

    if (!this.currentVal) {
      return {
        dialog: `Enable ${this.name}`,
        updatedValue: !!this.currentVal
      };
    }
  }
}

const recordFilters = (history: ConversationHistory, key: string, value: any) => {
  switch (key) {
    case 'min_power':
      history.setMinPower(value ?? 0);
      break;
    case 'max_power':
      history.setMaxPower(value ?? 500);
      break;
    case 'power_enabled':
      history.setPowerEnabled(value);
      break;
    case 'only_free':
      history.setOnlyFree(value);
      break;
    case 'only_pay_with_neutral-payment-provider':
      history.setOnlyPayWithneutral-payment-provider(value);
      break;
    case 'only_4_or_5_stars':
      history.setOnly4Or5Stars(value);
      break;
    case 'only_public':
      history.setOnlyPublic(value);
      break;
    case 'only_tariff_kwh':
      history.setOnlyTariffKwh(value);
      break;
    case 'only_tariff_min':
      history.setOnlyTariffMin(value);
      break;
    case 'only_remote_start_capable':
      history.setOnlyRemoteStartCapable(value);
      break;
    case 'only_auto_charge':
      history.setOnlyAutoCharge(value);
      break;
    case 'hide_not_available':
      history.setHideNotAvailable(value);
      break;
    case 'hide_no_state':
      history.setHideNoState(value);
      break;
    case 'hide_unknown':
      history.setHideUnknown(value);
      break;
    case 'hide_coming_soon':
      history.setHideComingSoon(value);
      break;
    case 'type_of_locations': {
      if (typeof value === 'string') {
        history.setTypeOfLocations([value]);
      } else {
        history.setTypeOfLocations(value);
      }
      break;
    }
    case 'type_of_locations_enabled':
      history.setTypeOfLocationsEnabled(value);
      break;
    case 'plug_types_enabled':
      history.setPlugTypesEnabled(value);
      break;
    default:
      break;
  }
}

