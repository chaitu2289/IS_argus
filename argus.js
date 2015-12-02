function InteractiveTrainer(workarea) {
	this.workarea = $(workarea);
	this.all_divs = [];
	this.is_selected_element = -1;
	this.offset = [];
//	console.log($('#file-form').html())
/*
	this.workarea.html(
'		<div class="col-md-8">'+
'			<div style="margin:1em">'+
'				<img id="target" class="img-responsive">'+
'			</div>'+
'		</div>'+
'		<div class="col-md-4">'+
'			<div style="margin:1em">'+
'				<input id="updatebtn" type="button" class="btn" value="Update">'+
'			</div>'+
'		</div>'
	);
*/
	this.jcrop_api = null;
	

}

InteractiveTrainer.prototype = {

		show_image: function(labels) {
			
			/* arg: labels - coordinates of objects which are 
			 *		obtained from caffe backend
			 *
			 *	This function converts all labels to divs 
			 *	and defines divs onclick functions
			 *
			 */
	
			console.log(labels);
			var img = document.getElementById('target');
			var scaled_height = parseInt($('#target').css('height'));
			var scaled_width = parseInt($('#target').css('width'));
                        var natural_width = img.naturalWidth;
                        var natural_height = img.naturalHeight;
                        width_factor =  (scaled_width/natural_width);
                        height_factor =  (scaled_height/natural_height);
			

			for (i = 0; i < labels.length; i++) {
			
				//extract top left coordinates,height, width
				var _x = labels[i][1][0];
				var _y = labels[i][1][1]; 
				var _w = labels[i][1][2];
				var _h = labels[i][1][3];
				_x = _x*height_factor;
				_y = _y*width_factor;
				_w = _w*width_factor;
				_h = _h*height_factor;		
				//create div with all the css properties
				var $div = $('<div />').width(_w).height(_h).css({
					position: 'absolute',
					zIndex: 2000,
					top: _x,
					left: _y,
					border: "2px solid #ff0000",
					background: "rgba(0, 255, 127, 0.3)",
				});
			
				$div.attr("id", i);
				$div.append("<p>"+labels[i][2]+"</p>")
				var selfObj = this;

				/*
				 * make the box usable(draggable) by Jcrop to update the box when mouse is clicked down in the div element
				 */
				$div.mousedown(
					function(e){
						selfObj.is_selected_element = parseInt($(this).attr('id'));
						$(this).hide();
						var x1 = $(this).css('left');
						x1 = parseInt(x1)
						var y1 = $(this).css('top');
						y1 = parseInt(y1);
						var width = $(this).width()
						var height = $(this).height();
				
						var x2 = x1 + width;
						var y2 = y1 + height;
				
						selfObj.jcrop_api.setSelect([x1,y1,x2,y2]);
						selfObj.hide_other_elements($(this).attr('id'));
						return false;
					}
	
				);

				var $img = $('.jcrop-holder');
				$img.click(function(e) {
					selfObj.imgClick = 1;
					console.log("mouse position " + e.pageX + e.pageY);
				});
				$img.append($div).css({
					position : 'absolute'
		    		});
				this.all_divs.push($div);
			}
			
			

	
		},

		save: function() {
			console.log('save_image');

			var form = document.getElementById('file-form');
                        var fileSelect = document.getElementById('file-select');
                        var uploadButton = document.getElementById('upload-button');
                        var files = fileSelect.files;
                        var formData = new FormData();
                        var file = files[0];
                        var labels = [];
			var coordinates = [];
			for (var i=0; i<this.all_divs.length; i++) {
				var div_element = this.all_divs[i];
				//console.log(div_element.text());
                                var div_x = parseInt(div_element.css('left'));
                                var div_y = parseInt(div_element.css('top'));
                                var div_width = div_element.width();
                                var div_height = div_element.height();
                                var last_corner_x = div_x + div_width;
                                var last_corner_y = div_y + div_height;
				var tag = div_element.text();	
				var box = new Array([div_x, div_y],[div_width, div_height]);
				var json_object = {"box": box, "label": tag, "_id": i};
				coordinates.push(json_object);
			}
			for (var j = 0; j < coordinates.length; j++) {
				var element = coordinates[j];
				console.log(element);
			}
			var data = {"image_id" : 1, "labels": coordinates};

                        formData.append('test_image', file, file.name);
			formData.append('image_data', JSON.stringify(data));

                        /*
                         * Create an XMLHttpRequest to communicate with PHP 
                         */
			
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', 'modified_api.php?op=save', false);
                        xhr.onload = function () {
                                if (xhr.status === 200) {
					console.log(xhr.responseText);
                                        //response =  JSON.parse(xhr.responseText) ;
                                } else {
                                        alert('An error occurred!');
                                }
                        };

                        xhr.send(formData);
			
			
		},
		
		learn_features: function() {
			var xhr = new XMLHttpRequest();
                        xhr.open('POST', 'modified_api.php?op=learn_features', false);
                        xhr.onload = function () {
                                if (xhr.status === 200) {
                                        console.log(xhr.responseText);
                                        //response =  JSON.parse(xhr.responseText) ;
                                } else {
                                        alert('An error occurred!');
                                }
                        };
			xhr.send();

		},

		identify_objects: function(frm) {
			console.log('Executing identify_objects');
			
			
			var form = document.getElementById('file-form');
			var fileSelect = document.getElementById('file-select');
			var uploadButton = document.getElementById('upload-button');
			var files = fileSelect.files;
			var formData = new FormData();
			var file = files[0];
			var labels = [];

			formData.append('test_image', file, file.name);

			/*
			 * Create an XMLHttpRequest to communicate with PHP 
			 */

			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'modified_api.php?op=identify_objects', false);
			xhr.onload = function () {
				if (xhr.status === 200) {
					//console.log(xhr.responseText);
					response =  JSON.parse(xhr.responseText) ;
				} else {
					alert('An error occurred!');
				}
			};

			xhr.send(formData);	
			
			/*
			 * Got "response" from caffe backend and store all coordinates in "labels" datastructure
			 */
			
			var _id = response._id;
			var _labels = response.labels;
			for (i=0; i<_labels.length; i++) {
				var label_id = _labels[i]._id;
				var box = _labels[i].box[0].concat(_labels[i].box[1]);
				var tag = _labels[i].tag;
				labels.push([label_id, box, tag]);
			}
			
		
			// send image to api.php using $.ajax POST request with op "identify_objects"
			//var labels = { _id: "1", labels: [] }; // get labels from ajax result
			this.activate_jcrop();
			//this.offset[0] = $('.jcrop-holder').offset().left;
			//this.offset[1] = $('.jcrop-holder').offset().top;
			this.show_image(labels);
			
			var $img = $('.jcrop-holder');
			var selfObj = this;
			this.update_z_values();

			
		},

		update_z_values: function() {

			/*
			 * The function incrementes z values of the inner div elements which are 
			 * fully contained by bigger div elements
			 */
			for (var i=0; i<this.all_divs.length; i++) {
				var outer_div = this.all_divs[i];
				var outer_div_x = parseInt(outer_div.css('left'));
				var outer_div_y = parseInt(outer_div.css('top'));
				var outer_div_width = outer_div.width();
				var outer_div_height = outer_div.height();
				var outer_last_corner_x = outer_div_x + outer_div_width;
				var outer_last_corner_y = outer_div_y + outer_div_height;
				for (var j=0; j<this.all_divs.length; j++) {
					if (i!= j) {
						var inner_div = this.all_divs[j];
						var inner_div_x = parseInt(inner_div.css('left'));
						var inner_div_y = parseInt(inner_div.css('top'));
						var inner_div_width = inner_div.width();
						var inner_div_height = inner_div.height();
						var inner_last_corner_x = inner_div_x + inner_div_width;
						var inner_last_corner_y = inner_div_y + inner_div_height;
						if ((outer_div_x < inner_div_x) && (outer_div_y < inner_div_y) && (outer_last_corner_x > inner_last_corner_x) && (outer_last_corner_y > inner_last_corner_y)) {
							inner_div.css('z-index', outer_div.css('z-index') + 1);
						} 
				
					}					
				}
			}

		},
		
		scale_boxes: function() {
			var img = document.getElementById('target');
			scaled_width =  img.clientWidth;
			scaled_height = img.clientHeight;
			natural_width = img.naturalWidth;
			natural_height = img.naturalHeight;
			width_factor = 1 - (scaled_width/natural_width);
			height_factor = 1 - (scaled_height/natural_height);
		 	
			for (var i=0; i<this.all_divs.length; i++) {
                                var outer_div = this.all_divs[i];
                                var outer_div_x = parseInt(outer_div.css('left'));
                                var outer_div_y = parseInt(outer_div.css('top'));
                                var outer_div_width = outer_div.width();
                                var outer_div_height = outer_div.height();

				
			}	
						
		},

		
		activate_jcrop: function() {
			var self_obj = this;
			jQuery(function($) {
				console.log($('#target'))
				$('#target').Jcrop({
 		 		}, function() {
					console.log('krishna yes');
					self_obj.jcrop_api = this;
				});
			});
		},
	
		select_new_object: function() {
			var selfObj = this;
			var img = document.getElementById('target');
                        var scaled_height = parseInt($('#target').css('height'));
                        var scaled_width = parseInt($('#target').css('width'));
			//selfObj.jcrop_api.setSelect([0,0,scaled_width,scaled_height]);
                        selfObj.hide_all_elements();
			
		
		},

		hide_all_elements: function() {

			for (var i=0; i < this.all_divs.length; i++) {
                                var inner_div = this.all_divs[i]
                                inner_div.hide();
			}


		},
	
		hide_other_elements: function(index) {

			/*
			 *The function hides all the divs except the div that is selected
			 *
			 */
/*
			var outer_div = this.all_divs[index];
			var outer_div_x = parseInt(outer_div.css('left'));
			var outer_div_y = parseInt(outer_div.css('top'));
			var outer_div_width = outer_div.width();
			var outer_div_height = outer_div.height();
			var outer_last_corner_x = outer_div_x + outer_div_width;
			var outer_last_corner_y = outer_div_y + outer_div_height;
*/
			for (var i=0; i < this.all_divs.length; i++) {
				var inner_div = this.all_divs[i]
				if (index != i) {
					inner_div.hide();
				}
/*
				if (i!= index) {
					var inner_div = this.all_divs[i];
					var inner_div_x = parseInt(inner_div.css('left'));
					var inner_div_y = parseInt(inner_div.css('top'));
					var inner_div_width = inner_div.width();
					var inner_div_height = inner_div.height();
					var inner_last_corner_x = inner_div_x + inner_div_width;
					var inner_last_corner_y = inner_div_y + inner_div_height;
					if ((outer_div_x > inner_div_x) && (outer_div_y > inner_div_y) && (outer_last_corner_x < inner_last_corner_x) && (outer_last_corner_y < inner_last_corner_y)) {
						inner_div.hide();
						} 
				
						

					if (((outer_div_x < inner_div_x < outer_last_corner_x) && (outer_div_y < inner_div_y < outer_last_corner_y)) || ((outer_div_x < inner_div_x + inner_div_width < outer_last_corner_x) && (outer_div_y < inner_div_y < outer_last_corner_y)) || ((outer_div_x < inner_div_x < outer_last_corner_x) && (outer_div_y < inner_div_y + inner_div_height < outer_div_last_corner_y)) || ((outer_div_x < inner_div_x + inner_div_width < outer_last_corner_x) && (outer_div_y < inner_div_y + inner_div_height < outer_div_last_corner_y)))    {
				

						inner_div.hide();			
				
					}
				}
*/
			}
			
		},

		confirm_selection: function() {

			var it = this;

			if (it.is_selected_element >= 0) {
                                new_coordinates = it.jcrop_api.tellSelect();
                                new_h = new_coordinates.h;
                                new_w = new_coordinates.w;
                                new_x1 = new_coordinates.x;
                                new_x2 = new_coordinates.x2
                                new_y1 = new_coordinates.y;
                                new_y2 = new_coordinates.y2;
                                if  (it.all_divs[it.is_selected_element].text() !=  $('#tag').val()) {
                                        if ($('#tag').val() != '') {
                                                it.all_divs[it.is_selected_element].text(($('#tag').val()));
                                        }
                                }
                                console.log(it.all_divs[it.is_selected_element].text());
                                it.all_divs[it.is_selected_element].width(new_w).height(new_h).css({
                                        top: new_y1,
                                        left: new_x1
                                })
                                it.all_divs[it.is_selected_element].show()
                                it.is_selected_element = -1;
                                it.jcrop_api.release();
                                it.imgClick = 0;
                                it.update_z_values();
                                for (var i=0; i < it.all_divs.length; i++) {
                                        it.all_divs[i].show();
                                }
                                $("#tag").val("");
                                return false;

                        }
			else if (it.imgClick == 1) {
                                new_coordinates = it.jcrop_api.tellSelect();
				console.log("logging tell select")
				console.log(new_coordinates)
                                _h = new_coordinates.h;
                                _w = new_coordinates.w;
                                _x = new_coordinates.x;
                                _x2 = new_coordinates.x2
                                _y = new_coordinates.y;
                                _y2 = new_coordinates.y2;


                                $tag = $('#tag').val();
                                var $div = $('<div />').width(_w).height(_h).css({
                                        position: 'absolute',
                                        zIndex: 2000,
                                        left: _x,
                                        top: _y,
                                        border: "2px solid #ff0000",
                                        background: "rgba(0, 255, 127, 0.3)",

                                });
                                $div.append("<p>"+$tag+"</p>")

                                $div.attr("id", it.all_divs.length);
				$div.mousedown(

                                        function(e){
                                                it.is_selected_element = parseInt($(this).attr('id'));
                                                $(this).hide();
                                                var x1 = $(this).css('left');
                                                x1 = parseInt(x1)
                                                var y1 = $(this).css('top');
                                        y1 = parseInt(y1);
                                        var width = $(this).width()
                                        var height = $(this).height();

                                        var x2 = x1 + width;
                                        var y2 = y1 + height;

                                        it.jcrop_api.setSelect([x1,y1,x2,y2]);
                                        it.hide_other_elements($(this).attr('id'));
                                        return false;
                                }

                                );

                                var $img = $('.jcrop-holder');

                                $img.append($div).css({
                                        position : 'absolute'
                                });
                                it.all_divs.push($div);
                                it.jcrop_api.release();
                                it.imgClick = 0
                                it.update_z_values();
				for (var i=0; i < it.all_divs.length; i++) {
                                        it.all_divs[i].show();
                                }

                                $("#tag").val("");
                                return false;
                        }

			

		}

};

function start() {
	it = new InteractiveTrainer($('#workarea'));
	
	$('#upload-button').click(function(e) {
		e.preventDefault();
		it.identify_objects(this);
		$('#select_new_object').toggle();
		$('#crop').toggle();
		
	});

	$('#select_new_object').click(function(e) {
		it.imgClick == 1
		it.select_new_object();
	})

	
	$('#crop').click(function(e) {
		it.confirm_selection();
		$('#save').toggle();			
	})

	$('#save').click(function(e) {
		it.save();
	})

	$('#learn_features').click(function(e) {
		it.learn_features();
	})
	

	//$('#learn_features').on('click', this.learn_features);
}

function previewFile() {
	if ($('.jcrop-holder').length) {
		$('.jcrop-holder').remove();
	}
	var preview = document.querySelector('img');
        var file    = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();
	reader.onload = function () {
                preview.src = reader.result;
        }
	if ($('#target').is(':hidden')) {
		jcrop_api.destroy()
		$('#target').show()
		    //$('#target').attr('src', '#');
		if( $('#target').attr('style') )  {
			console.log('chaitanya');
                        $('#target').removeAttr('style')
                }

	}
  	//var preview = document.querySelector('img');
  	//var file    = document.querySelector('input[type=file]').files[0];
  	//var reader  = new FileReader();
	
	//reader.onload = function () {
	//	preview.src = reader.result;
	//}

	if (file) {
		reader.readAsDataURL(file);
	} else {
		preview.src = "";
	}
}

$(document).ready(
start
);
