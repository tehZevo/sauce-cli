#!/usr/bin/env node
// w e l c o m e  t o  m y  j a v a s c r i p t  t u t o r i a l

const rp = require("request-promise");
const minimist = require("minimist");
const cheerio = require("cheerio");
const UserAgent = require("user-agents");

function iflUrl(query)
{
  return encodeURI(`https://www.google.com/search?q=${query}&btnI`);
}

async function doRequest(url, options)
{
  options.uri = url;
  let html = await rp(options);
  let $ = cheerio.load(html);

  let title = $("title").text();
  //if redirect page
  if(title == "Redirect Notice")
  {
    //grab first link
    let redirectUrl = $("a").attr("href");
    //surf link
    return await doRequest(redirectUrl, options);
  }

  //otherwise return html
  return html
};

module.exports = async () =>
{
  let args = minimist(process.argv.slice(2));
  let agent = new UserAgent().toString();
  let options = {
    headers: {'user-agent': agent}
  }

  if(args._.length < 1)
  {
    return;
  }

  let query = args._.join(" ");
  let url = iflUrl(query);

  if (args.output || args.o)
  {
    let html = await doRequest(url, options);
    console.log(html);
  }
  else
  {
    console.log(url);
  }
}
