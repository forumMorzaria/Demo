$(function() {

	var _win		= $(window),
		_canvas 	= $('#canvas'),
		//_ctx 		= _canvas[0].getContext('2d'),

		_color		= '#000',
		_fill		= '#000',
		_stroke 	= 1,

		_cWidth 	= +_canvas.attr('width'),
		_cHeight	= +_canvas.attr('Height'),
		_cPos 		= {
			x: _canvas.offset().left,
			y: _canvas.offset().top
		},

		_mPos = { x:0, y:0 },
		_mOldPos = { x:0, y:0 },
		_mStartPos = { x:0, y:0 },
		isDrag		= false;

	// setup the rulers with counters and markers
	var hRuler 	= $('#horizontalRuler'),
		vRuler 	= $('#verticalRuler'),
		status 	= $('#statusBar'),
		hMarker	= $('#hMarker'),
		vMarker	= $('#vMarker');

	function setupRulers() {
		var hCount = (_cWidth + 1)/10,
			vCount = (_cHeight + 1)/10 ,
			hList = $('<ul/>'),
			vList = $('<ul/>'),
			i = 0, k;

		// clear out the counter first
		hRuler.find('ul').remove();
		vRuler.find('ul').remove();

		// add the coordinates list
		for ( ; i < hCount; i++) {
			k = i* 10  ;
			
			hList.append( $('<li>' + k + '</li>').css('left', k+'mm') );
		}
		hRuler.css('width', _cWidth+'mm').append(hList);

		for (i = 0; i < vCount; i++) {
			k = i*10 ;
			vList.append( $('<li>' + k + '</li>').css('top', k+'mm') );
		}
		vRuler.css('height', _cHeight+"mm").append(vList);
	}
	setupRulers();

	// the main move event
	_canvas.on('mousemove', function(e) {
		var delta, dx, dy;

		_mPos.x = e.pageX - _cPos.x;
		_mPos.y = e.pageY - _cPos.y;

		// move the markers
		hMarker.css('left', _mPos.x);
		vMarker.css('top', _mPos.y);

		// update status
		status.empty().append(
			'<label title="cursor position">X ' + _mPos.x 
			+ ' Y ' + _mPos.y + '</label>'
		);

		if (isDrag) {
			delta = dist(_mPos, _mStartPos).delta;
			status.append(
				'<label>X<sub>1</sub> ' + _mStartPos.x 
				+ ' Y<sub>1</sub> ' + _mStartPos.y + '</label>'
				+ '<label>&Delta; ' + delta + '</label>'
			);
		}

		// record the position for next frame
		_mOldPos = _mPos;
	});

	_canvas.on('mousedown', function(e) {
		if (!isDrag) {
			isDrag = true;
			_mStartPos.x = e.pageX - _cPos.x;
			_mStartPos.y = e.pageY - _cPos.y;
		}
	});

	_canvas.on('mouseup', function(e) {
		if (isDrag) {
			isDrag = false;
		}
	});

	// modify canvas size
	var setSizePanel = $('#set_cSize'),
		toolBox = $('#toolBox');
	
	$('#set_cWidth').val(_cWidth);
	$('#set_cHeight').val(_cHeight);
	setSizePanel.on('change', 'input,select', function() {
		
		if($(this).is('select')){
			
			var layout = $(this).val();
			if(layout === 'A4Portrait'){
				$('#set_cWidth').val(210);
				$('#set_cHeight').val(297);
				_cWidth = 210;
				_cHeight = 297;
			}else if(layout === 'A4Landscape'){
				$('#set_cWidth').val(297);
				$('#set_cHeight').val(210);
				_cWidth = 297;
				_cHeight = 210;
			}
			_canvas.css('width', _cWidth+'mm');
			_canvas.css('height', _cHeight+'mm');
			status.css('width', _cWidth+ 'mm');
			setSizePanel.css('width', _cWidth+'mm');
			toolBox.css('left', (_cWidth + 10) + 'mm' );
			toolBox.css('height', (_cHeight + 15) + 'mm');
			
		}
		
		else if($(this).is('input')){
			var that = $(this), val = that.val();
			if (val <= 100 || val > 800) {
				val = val <= 100 ? 100 : 800;
				that.val(val+'mm');
			}

			if (that.attr('id') == 'set_cWidth') {
				_cWidth = +val;
				_canvas.css('width', _cWidth+'mm');

				status.css('width', _cWidth+ 'mm');
				setSizePanel.css('width', _cWidth+'mm');
				toolBox.css('left', (_cWidth + 10) + 'mm' );
			}
			else if (that.attr('id') == 'set_cHeight') {
				_cHeight = +val;
				_canvas.css('height', _cHeight+'mm');
				toolBox.css('height', (_cHeight + 15) + 'mm');
			}

		}
		
		// update rulers
		setupRulers();

		// reset the markers
		hMarker.css('left', 0);
		vMarker.css('top', 0);
	}).css('width', _cWidth+"mm");

	// toggle grid
	$('#gridOn').on('click', function(e) {
		if ($(this).prop('checked')) {
			_canvas.addClass('grid');
		}
		else {
			_canvas.removeClass('grid');
		}
	});

	toolBox.on('click', '.shape-tool', function(e) {
		toolBox.find('.active').removeClass('active');
		$(this).addClass('active');
	})
});

function dist(p1, p2) {
	var dx = p2.x - p1.x,
		dy = p2.y - p1.y;

	return { delta: Math.sqrt( dx*dx + dy*dy ) | 0, x: dx, y: dy };
}

