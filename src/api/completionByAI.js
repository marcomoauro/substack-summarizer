import log from "../log.js";
import axios from "axios";

export const completionByAI = async ({system_message, user_message, system_message2}) => {
  log.info('completionByAI', {
    system_message: system_message.slice(0, 10),
    user_message: user_message.slice(0, 10),
    system_message2: system_message2?.slice(0, 10)
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

  if (system_message2) {
    messages.push({
      role: "system",
      content: system_message2
    })
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