;(function ($, window, document) {
	var defaults = {
		data: [], // show data
		id: '', // determine dom ID
		props: { // Parameter name
			name: 'name',
			key: 'time',
		},
		index: 0, //selected by default
		width: '150px',
		selectedPointCallback:function(index){}
	};

	var TimeAxis = function (options) {
		this.options = Object.assign(defaults, options);
		this.props = this.options.props;
		this.id = this.options.id;
		this.width = this.options.width;
		this.init();
	};

	TimeAxis.prototype = {

		// Component initialization
		init: function () {
			// Generate timeline box html
			this.setTimeBox();
		},

		//Generate timeline box html
		setTimeBox: function () {
			var id = "#" + this.id;
			var html = '<span id="pre"><</span> <div class="cx-time-box"> <ul></ul></div><span id="next">></span>';
			$(id).empty().append(html);
			//Generate timeline html
			this.setTimeAxisHtml();

			var self = this;

			$(id + '>span:first').on('click', function () {
				self.timeAxisMove(-1);
				self.options.selectedPointCallback(self.options.data[self.options.index].time,self.options.index);
			});

			$(id + '>span:last').on('click', function () {
				self.timeAxisMove(1);
				self.options.selectedPointCallback(self.options.data[self.options.index].time,self.options.index);
			})
		},

		// Generate timeline html
		setTimeAxisHtml: function () {
			var list = this.options.data || [];
			var html = '';
			var self = this;
			$.each(list, function (index, item) {
				html += '<li class="cx-round-box cx-round-box'+index+'">';
				html += '<div class="cx-time-top">'+item[self.props.name]+'</div>';
				html += '<div class="cx-time-round" data-index="'+index+'"></div>';
				html += '<div class="cx-time-bottom">'+item[self.props.key]+'</div>';
				html += '</li>';
				if(index != list.length - 1){
					html += '<li class="cx-time-line" style="width: '+ self.width +'"></li>';
				}
			});
			var cls = "#" + this.id + ' ul';
			$(cls).empty().append(html);
			$(cls + ' .cx-time-round').on('click', function () {
				self.options.index = $(this).data('index');
				self.timeAxisActive();
				self.options.selectedPointCallback(self.options.data[self.options.index].time,self.options.index);
			})
			this.timeAxisMove(0);
		},

		//Click to move the selected time node
		timeAxisMove: function (num){
			var list = this.options.data || [];
			this.options.index += num;
		    if(this.options.index < 0){
		        this.options.index = list.length - 1;
		    }
		    if(this.options.index > list.length - 1){
		        this.options.index = 0;
		    }
		    this.timeAxisRoll();
		    this.timeAxisActive(this.options.index);
		},

		//Select node to scroll left and right
		timeAxisRoll: function (){
			var list = this.options.data || [];

			var width = parseInt(this.width);
			var roll = -(this.options.index * width);
			var widthBox = $('.cx-time-box').width();//Timebox width
			var widthBox1 = Math.abs(list.length * width); //Actual Total width
			if(widthBox > widthBox1){
				return
			}
			var i = parseInt(widthBox/width);//Show number of timeline
			
			var timeAxisLast = this.options.index == list.length -1//Whether the last parameter is selected

			if(timeAxisLast){
				roll =  -(widthBox1 - widthBox);
			}

			if(this.options.index + i > list.length && !timeAxisLast){
				return
			}

			var cla = "#" + this.id + ' ul li';
			$(cla).animate({
				'left': roll + 'px'
			});
		},

		//Swipe back and forth and click events
		timeAxisActive: function (num) {
			$('.cx-round-box').removeClass('cx-time-active');
			$('.cx-round-box' + this.options.index).addClass('cx-time-active');
		}
	};
	window.oTimeAxios = TimeAxis;
})(jQuery, window, document);
