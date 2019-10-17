#!/usr/bin/env node

var rp = require("request-promise");
var minimist = require("minimist");
var cheerio = require("cheerio");
var UserAgent = require("user-agents");

function iflUrl(query)
{
  return encodeURI(`https://www.google.com/search?q=${query}&btnI`);
}

async function doRequest(url, options)
{
  options.uri = url;
  var html = await rp(options);
  var $ = cheerio.load(html);

  var title = $("title").text();
  //if redirect page
  if(title == "Redirect Notice")
  {
    //grab first link
    var redirectUrl = $("a").attr("href");
    //surf link
    return await doRequest(redirectUrl, options);
  }

  //otherwise return html
  return html;
}

module.exports = async () =>
{
  var args = minimist(process.argv.slice(2));
  var agent = new UserAgent().toString();
  var options = {
    headers: {'user-agent': agent}
  }

  if(args._.length < 1)
  {
    return;
  }

  var query = args._.join(" ");
  var url = iflUrl(query);

  if (args.output || args.o)
  {
    var html = await doRequest(url, options);
    console.log(html);
  }
  else
  {
    console.log(url);
  }
}
