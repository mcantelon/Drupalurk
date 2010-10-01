// pull content via JSONP
// the "extra" argument is as yet unused... there for if I want to use the
// function to pull different types of content
function get_external_content(page, extra) {

  jQuery.getJSON('http://mikecantelon.com/json/planet_drupal?page=' + page +'&callback=?', function(data) {

    var element, has_next_page

    // clear sidebar
    $('#sidebar_pager').html('')
    $('#sidebar').html('')

    // assemble pager HTML
    if (data['pager']) {
    	has_next_page = (page + 1) < data['pager'].total
    	if (page > 0) {
    		// add first page link
    		jQuery('<a href="#">First</a>')
     		  .addClass('button')
              .click(function() {
            	get_external_content(0, extra)
              })
              .appendTo('#sidebar_pager')

    		jQuery('<span> </span>').appendTo('#sidebar_pager')

    		// add previous page link
    		jQuery('<a href="#">Prev</a>')
    		  .addClass('button')
              .click(function() {
            	get_external_content((page - 1), extra)
              })
              .appendTo('#sidebar_pager')
    	}
    	if (page > 0 && has_next_page) {
    		jQuery('<span> </span>').appendTo('#sidebar_pager')
    	}
    	if (has_next_page) {
    		// add next page link
    		jQuery('<a href="#">Next</a>')
     		  .addClass('button')
    		  .click(function() {
    			get_external_content((page + 1), extra)
    		  })
    	      .appendTo('#sidebar_pager')

    		jQuery('<span> </span>').appendTo('#sidebar_pager')

    		// add last page link
    		jQuery('<a href="#">Last</a>')
    		  .addClass('button')
              .click(function() {
            	get_external_content(data['pager'].total - 1, extra)
              })
              .appendTo('#sidebar_pager')
    	}
    }

    // assemble feed HTML
  	for(var index in data['nodes']) {
      element = data['nodes'][index].node
      jQuery('<h3>' + element.Title + '</h3>').appendTo('#sidebar')
      jQuery('<p>' + element.Body + '</p>').appendTo('#sidebar')
      if (element.Link) {
      	var link = jQuery('<div><a href="#">More</a></div>')
      	  .addClass('more')
      	  .attr('onClick', "chrome.tabs.create({\"url\": \"" + element.Link + "\"})")
      	  .appendTo('#sidebar')
      }
    }

    /// scroll to top
    $('#sidebar').scrollTop(0)
  })
}