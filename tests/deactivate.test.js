import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_BOT_ACTIVATE, COMMAND_BOT_DEACTIVATE } from '../app/commands/index.js';
import { t } from '../locales/index.js';
import storage from '../storage/index.js';
import {
  createEvents, MOCK_TEXT_OK, MOCK_USER_01, TIMEOUT,
} from './utils.js';

beforeEach(() => {
  //
});

afterEach(() => {
  removePrompt(MOCK_USER_01);
});

test('COMMAND_BOT_DEACTIVATE', async () => {
  const events = [
    ...createEvents([COMMAND_BOT_ACTIVATE.text]),
    ...createEvents(['嗨！']),
    ...createEvents([COMMAND_BOT_DEACTIVATE.text]),
    ...createEvents(['嗨！']), // should be ignored
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getPrompt(MOCK_USER_01).sentences.length).toEqual(4);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [
        t('__ERROR_MISSING_ENV')('VERCEL_ACCESS_TOKEN'),
        COMMAND_BOT_ACTIVATE.reply,
      ],
      [MOCK_TEXT_OK],
      [
        t('__ERROR_MISSING_ENV')('VERCEL_ACCESS_TOKEN'),
        COMMAND_BOT_DEACTIVATE.reply,
      ],
    ],
  );
}, TIMEOUT);