import log from '../log.js'
import axios from "axios";
import {completionByAI} from "../api/completionByAI.js";

export default class Article {

  static summarize = async ({url, language}) => {
    log.info('Model::Article::summarize', {url, language})

    const {content, title, link} = await Article.#scrapeArticle({url})

    const summary = await completionByAI({
      system_message: `
        As a professional summarizer, create a concise and comprehensive summary of the provided article, while adhering to these guidelines:
        * Craft a summary that is detailed, thorough, in-depth, and complex, while maintaining clarity and conciseness.
        * Incorporate main ideas and essential information, eliminating extraneous language and focusing on critical aspects.
        * Rely strictly on the provided text, without including external information.
        * Format the summary in paragraph form for easy understanding.
        * Utilize at least 800 words.
      `,
      user_message: content,
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

    const regexes = [
      /<p>(.*?)<\/p>/gs,
      /<h1>(.*?)<\/h1>/gs,
      /<h2>(.*?)<\/h2>/gs,
      /<h3>(.*?)<\/h3>/gs,
      /<h4>(.*?)<\/h4>/gs,
      /<h5>(.*?)<\/h5>/gs,
      /<h6>(.*?)<\/h6>/gs,
      /<h7>(.*?)<\/h7>/gs
    ];

    const extracted_content = [];

    for (let regex of regexes) {
      let match;
      while ((match = regex.exec(body.post.body_html)) !== null) {
        extracted_content.push(match[1]);
      }
    }

    const content = extracted_content.join(' ');

    const link = body.post.canonical_url + '?r=oshyp'

    return { content, title: body.post.title, link }
  }

}