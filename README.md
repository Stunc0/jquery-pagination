# jquery-pagination
jQuery plugin to paginate element as pages.

The plugin is CSS Bootstrap ready.
You can use it with every html tags.

To use this plugin, simply import jquery library and include this sample of code:

    <script type="text/javascript" src="js/path/to/jquery.paginate.js"></script>

    <script type="text/javascript">
    $( document ).ready(function() {
    	$('#myPaginationContainer').paginate({
    	    paginateElement: 'li', //element type to paginate inside #myPaginationContainer
    	    elementsPerPage: 10,
    	    nbPaginateElementDisplayed: 10,
    	    effect: 'default',
    			scrollToTop: true,
    			scrollToTopElementId: 'content', //id of the element you want to scroll to.
    			scrollToTopTime: 1000,
          defaultRange: [
    				[4, '4'],
    				[10, '10'],
    				[20, '20'],
    				[50, '50'],
    				[100, '100'],
    				[0, '{{t('app', 'all')}}']
    			],
    			rangeSelectorLabel: '{{t('app', 'result-per-page')}}'
        	});
    });
    </script>


-----

And here an example on jsfiddle:
http://jsfiddle.net/Stunc0/wL6c28p3/
