import log from '../log.js'
import axios from "axios";
import {completionByAI} from "../api/completionByAI.js";

export default class Article {

  static summarize = async ({url, language}) => {
    log.info('Model::Article::summarize', {url, language})

    const {body_html, title, link} = await Article.#scrapeArticle({url})

    const summary = await completionByAI({
      system_message: `
        As a professional summarizer, create a concise and comprehensive summary of the provided text, be it an article, post, conversation, or passage, while adhering to these guidelines:
        * Craft a summary that is detailed, thorough, in-depth, and complex, while maintaining clarity and conciseness.
        * Incorporate main ideas and essential information, eliminating extraneous language and focusing on critical aspects.
        * Rely strictly on the provided text, without including external information.
        * Format the summary in paragraph form for easy understanding.
        * Utilize at least 500 words.
      `,
      user_message: body_html,
      system_message2: `Translate to language ${language}`
    })

    return { summary, title, link}
  }

  static #scrapeArticle = async ({url}) => {
    log.info('Model::Article::scrapeArticle', {url})

    const {data} = await axios.get(url)

    const scripts = data.match(/<script>(.*?)<\/script>/gs);
    const script = scripts.find((script) => script.includes('body_html'))
    const first_part = script.split('("').slice(1)[0]
    const cleaned_json = '\"'+ first_part.split('")')[0] + '\"'
    const escaped_json = JSON.parse(cleaned_json)
    const body = JSON.parse(escaped_json)
    const body_html = body.post.body_html.slice(0, -3000)

    const link = body.post.canonical_url + '?r=oshyp'

    return { body_html, title: body.post.title, link }
  }

}