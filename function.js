const { send } = require("micro");
const Twitter = require("twitter");
const url = require("url");
const qs = require("querystring");
require("now-env");

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const getData = async id => {
  const embed = await client.get("statuses/oembed", {
    id: id
  });
  const status = await client.get("statuses/show", {
    id: id,
    include_ext_alt_text: true,
    trim_user: true,
    include_entities: false
  });
  return {
    embed,
    status
  };
};

module.exports = async function(request, response) {
  const query = qs.parse(url.parse(request.url).query);
  const { id } = query;
  console.log(id);
  response.setHeader("Access-Control-Allow-Origin", "*");

  if (id) {
    try {
      const res = await getData(id);
      send(response, 200, res);
    } catch (e) {
      send(response, 500, e);
    }
  } else {
    send(response, 404, "Not Found");
  }
};
