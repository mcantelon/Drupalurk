// search using a hashtag, skipping old tweets, with update_tweets as callback
function twitter_search(hashtag, since_id) {

  hashtag = escape(hashtag)

  // create script element for JSONP call to Twitter search API
  var twitterJSON = document.createElement('script')
  twitterJSON.type='text/javascript'

  twitterJSON.src='http://search.twitter.com/search.json?callback=update_tweets&q="' + hashtag + '"'

  if (since_id) {
    twitterJSON.src += '&since_id=' + since_id
  }

  twitterJSON.src += '&' + (new Date().getTime())

  // add to document, executing JSONP call
  document.getElementsByTagName('head')[0].appendChild(twitterJSON)

  return false
}

// make URLs into HTML links
function link_urls(id) {
  var x = document.getElementById(id);
  x.innerHTML = x.innerHTML.replace(/(http:\/\/[^ ]+)/g, "<a href='#' onClick=\"chrome.tabs.create({'url': '$1'})\">$1</a>/");
}

// render tweets retrieved from a twitter search
function update_tweets(tweets) {

  var hashtag = unescape(tweets.query)
  var max_tweets = 8
  var tweets_to_show

  // trim quotes from query
  var hashtag_human = hashtag.substring(1, hashtag.length - 1)

  var tweet_html = ''

  tweets_to_show = (tweets.results.length >= max_tweets) ? max_tweets : tweets.results.length

  // Render retrieved tweets
  for (var i=0; i < tweets_to_show; i++) {

    var user  = tweets.results[i].from_user
    var tweet = tweets.results[i].text
    var id    = tweets.results[i].id
    var url   = 'http://twitter.com/' + user + '/status/' + id

    var profile_image = tweets.results[i].profile_image_url

    // yeah, this code is gross... make it nice at some point
    tweet_html += '<li class="new_tweet" style="display:none;list-style:none;">'
    tweet_html += '<div class="tweet_wrapper clearfix">'
    tweet_html += '<div class="tweet_profile_image"><img src="' + profile_image + '" width="48" height="48" align="left" style="margin-right: 5px; margin-bottom: 5px"></div>'
    tweet_html += '<div class="tweet_text_wrapper">'
    tweet_html += '<span class="tweet_text" id="tweet_' + id + '">' + tweet + '</span><br />'
    tweet_html += "<a href='#' onClick=\"chrome.tabs.create({'url': '" + url + "'})\">" + user + '</a>'
    tweet_html += '</div class="tweet_text_wrapper">'
    tweet_html += '</div class="tweet_wrapper">'
    tweet_html += '</li>'
  }

  // truncate existing tweet before prepending new ones
  while (i + $("#tweets > li").size() > max_tweets) {
    $("#tweets > li:last").remove()
  }

  // Display retrieved tweets
  $('#tweets').prepend(tweet_html)
  $('.new_tweet').slideDown('slow', function() {
    $('.new_tweet').fadeIn('slow')
    $('.new_tweet').attr('class', '')
  });


  // Render retrieved tweets
  for (var i=0; i < tweets_to_show; i++) {

    var id    = tweets.results[i].id
    link_urls('tweet_' + id)
  }

  // Keep track of the last id retrieved
  if (!tweets.results[0]) {
    since_id = $('#last_id').html()
  }
  else {
    since_id = tweets.results[0].id
    $('#last_id').html(since_id)
  }

  // hide loading indicator
  $('#tweets_loading').hide()

  // Search Twitter in 3 seconds
  setTimeout('twitter_search("' + hashtag_human + '", since_id)', 3000)
}