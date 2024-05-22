import log from '../log.js'
import axios from "axios";
import {completionByAI} from "../api/completionByAI.js";

export default class Article {

  static summarize = async ({url, language}) => {
    log.info('Model::Article::summarize', {url, language})

    const raw_article = await Article.#scrapeArticle({url})

    const summary = await completionByAI({
      system_message: `You are an intelligent assistant that summarizes articles. 
                       The provided text contains HTML characters. 
                       Ignore any HTML tags or entities and focus on summarizing the main content 
                       of the article in 500 words.`,
      user_message: raw_article,
      system_message2: `Translate the summary to language ${language}`
    })

    return summary
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

    return body_html;
  }

}