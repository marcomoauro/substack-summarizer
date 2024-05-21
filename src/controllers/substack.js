import log from "../log.js";
import Article from "../models/Article.js";
import {APIError400} from "../errors.js";

export const summarizeArticle = async ({url, language}) => {
  log.info('Controller::Substack::summarizeArticle', {url, language});

  if (!url) {
    throw new APIError400('url is required')
  }

  if (!language) {
    throw new APIError400('language is required')
  }

  const summary = await Article.summarize({url, language})

  return {
    summary
  }
}