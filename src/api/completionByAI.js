import log from "../log.js";
import axios from "axios";
import { strict as assert } from 'assert';

assert(process.env.OPEN_AI_API_KEY, 'Please define OPEN_AI_API_KEY env var');

export const completionByAI = async ({system_message, user_message, other_messages = []}) => {
  log.info('completionByAI', {
    system_message: system_message.slice(0, 10),
    user_message: user_message.slice(0, 10),
    other_messages: other_messages.length
  })

  const messages = [
    {
      role: "system",
      content: system_message
    },
    {
      role: "user",
      content: user_message
    }
  ]

  if (other_messages.length > 0) {
    messages.push(...other_messages)
  }

  const body = {
    model: "gpt-3.5-turbo",
    messages
  };

  const {data} = await axios.post('https://api.openai.com/v1/chat/completions', body, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`
    },
  });

  const summary = data.choices[0].message.content
  return summary
}