tl_loaded=true;
//pen width
	tl_penwidth=1;
	function tl_add_penwidth(){
		tl_penwidth+=1;
		document.getElementById("tl_penwidth_msg").innerHTML=String(tl_penwidth);
	}
	function tl_minus_penwidth(){
		tl_penwidth-=1;
		document.getElementById("tl_penwidth_msg").innerHTML=String(tl_penwidth);
	}

//method
	function tl_CS_method(drawctx,color,x,y,W,H){	//color selector
		
		var rgba=drawctx.getImageData(x,y,1,1).data;
		

		var colors="rgba("+String(rgba.subarray(0,3))+","+String( rgba[3]/255)+")";
		var color_tag1_ctx=document.getElementById("cl_color_tag1").getContext("2d");
		color_tag1_ctx.fillStyle=cur_color;
		color_tag1_ctx.clearRect(0,0,40,40);
		color_tag1_ctx.fillRect(0,0,40,40);
		cur_color=colors;
	}
	function tl_draw_method(drawctx,color,x,y,W,H){
		var R=W* (tl_penwidth-1);
		var x=x-R;
		var y=y-R;
		var W=W+2*R;
		var H=H+2*R;
		drawctx.fillStyle=color;
		drawctx.fillRect(x,y,W,H);


			var a=parseInt( x/cell_len);
			var b=parseInt( y/cell_len);

			var a_add=parseInt(W/cell_len);
			var b_add=parseInt(W/cell_len);

			var list=color;
			list=list.split(",")
			list[0]=list[0].substring(5,);
			list[3]=list[3].substring(0,list[3].length-1);

			for(var i=a;i<a+a_add;i++){
				for(var j=b;j<b+b_add;j++){
					msg[cur_cavid][1][j][i]=list;
				}
			}
			
	}
	function tl_clean_method(drawctx,color,x,y,W,H){
		var R=W* (tl_penwidth-1);
		var x=x-R;
		var y=y-R;
		var W=W+2*R;
		var H=H+2*R;
		drawctx.clearRect(x,y,W,H);

			var a=parseInt( x/cell_len);
			var b=parseInt( y/cell_len);

			var a_add=parseInt(W/cell_len);
			var b_add=parseInt(H/cell_len);

			for(var i=a;i<a+a_add;i++){
				for(var j=b;j<b+b_add;j++){
					msg[cur_cavid][1][j][i]=[0,0,0,0];
				}
			}
	}
	function tl_mvcav_method(drawctx,color,x,y,W,H){
		var R=W* (tl_penwidth-1);
		drawctx.clearRect(x-R,y-R,W+2*R,H+2*R);
	}

	function tl_willdraw(drawctx,color,x,y,W,H){
			
		var R=W* (tl_penwidth-1);
		var x=x-R;
		var y=y-R;
		var W=W+2*R;
		var H=H+2*R;
		drawctx.fillStyle=color;
		drawctx.fillRect(x,y,W,H);
	

	}


	function tl_willclean(drawctx,color,x,y,W,H){

		drawctx.clearRect(0,0,width,height);
	

	}


//change method
	function tl_useCS(){

		document.getElementById("ereaser").innerHTML="now:color selector🎨";
		cur_method=tl_CS_method;
	}
	function tl_usepen(){
		document.getElementById("ereaser").innerHTML="now:draw✏️";
		
		cur_method=tl_draw_method;
	}
	function tl_useereaser(){

		document.getElementById("ereaser").innerHTML="now:clean";;	
		cur_method=tl_clean_method;
	}

//tools
	function tl_crt(tagname,id,classe,father,msg){

		var s=document.createElement(tagname);
		if(msg!=""){
			s.appendChild(document.createTextNode(msg));
		}
		if(classe!=""){
			s.setAttribute("class",classe);			
		}
		s.setAttribute("id",id);
		father.appendChild(s);
		return s
	}

//init
	function tl_init(){
		//快捷键
		document.onkeydown=function(){
			var pressedkey=window.event.keyCode;
			
			switch(pressedkey) {
			    	case 69://e
				        tl_useereaser();
				        break;
			    	case 66://b
				       	tl_usepen();
				        break;
				    case 83://s
				    	tl_useCS();
				    	break;
			}

		}

		//penwidth controler
		var div,minu,add,msg;
			var body=document.getElementById("body");
			
			div=tl_crt("div","tl_penwidth_control","",body,"");
			minus=tl_crt("button","tl_minus","",div,"-");
			msg=tl_crt("p","tl_penwidth_msg","",div,"1");
			add=tl_crt("button","tl_add","",div,"+");

			div.style.position="fixed";
			div.style.width="200px";
			div.style.height="50px";
			div.style.top="0px";
			div.style.left="550px";
			div.style.zIndex="0";




			minus.style.top="0px";
			minus.style.left="0px";
			minus.style.width="50px";
			minus.style.height="50px";
			minus.setAttribute("onclick","tl_minus_penwidth()");
			minus.style.position="aboslute";
			minus.style.zIndex="0";


			msg.style.position="absolute";
			msg.style.zIndex="0";
			msg.style.top="0px";
			msg.style.left="70px";
			msg.style.width="20px";


			add.style.top="0px";
			add.style.left="100px";
			add.style.position="absolute";
			add.style.width="40px";
			add.style.height="50px";
			add.setAttribute("onclick","tl_add_penwidth()");
			add.style.zIndex="0";

		cur_method=tl_draw_method;
	}
		
//run 
	tl_init();