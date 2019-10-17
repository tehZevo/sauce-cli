var request = require("request");
var minimist = require("minimist");

function iflUrl(query)
{
  return encodeURI(`https://www.google.com/search?q=${query}&btnI`);
}

module.exports = () =>
{
  const args = minimist(process.argv.slice(2))

  if(args._.length < 1)
  {
    return;
  }

  var query = args._.join(" ");
  var url = iflUrl(query);

  if (args.output || args.o)
  {
    request(url, function (err, res, body)
    {
      if(err)
      {
        throw err;
      }

      console.log(body);
    });
  }
  else
  {
    console.log(url);
  }
}
