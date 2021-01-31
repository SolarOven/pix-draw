//jan 27 22:27 latest , and refresh in this file in last days
cl_model_selected_H=0;
function cl_model_crt(tagname,id,classe,father,msg){

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
function cl_model_drawRect(ctx,Lx,Ly,width,height){

	ctx.beginPath();
	ctx.strokeStyle = 'rgba(245,245,245,1)'; 
	ctx.lineWidth = 1; 
	ctx.moveTo(Lx,Ly);
	ctx.lineTo(Lx+width,Ly);
	ctx.lineTo(Lx+width,Ly+height);
	ctx.lineTo(Lx,Ly+height);
	ctx.lineTo(Lx,Ly)
	ctx.stroke();
}
//color transfer
function cl_model_HSL2RGB(hsl_array){//input array[3],return rgb str

	var h=hsl_array[0];//need not transfer,because inputer is myself
	var s=hsl_array[1];
	var l=hsl_array[2];
	var r,g,b;
	if(s==0){
		r=g=b=1;

	}
	else{
		var hue2rgb=function hew2rgb(p,q,t){
			if(t<0) 	t+=1;
			if(t>1) 	t-=1;
			if(t<1/6)	return p+(q-p)*6*t;
			if(t<1/2)	return q;
			if(t<2/3)	return p+(q-p)*(2/3-t)*6;
			return p;
		}
		var q=l<0.5 ? l*(1+s) : l+s-l*s;



		var p=2*l-q;
		r=hue2rgb(p,q,h+1/3);
		g=hue2rgb(p,q,h);
		b=hue2rgb(p,q,h-1/3);
			
	}
	var result="";
	rgb=[Math.round(r*255),Math.round(g*255),Math.round(b*255)];
	
	for (var  i  in rgb){
			result+=String(rgb[i]);
			result+=",";
	}
	return "rgba("+result.substring(0,result.length-1)+",1)";
}


function cl_model_init(){
	var body=document.getElementsByTagName("body")[0];

	//color box container
	var cbc=cl_model_crt("div","cl_model_container","",body,"");
		//conf
		cbc.style.position="fixed";
		cbc.style.top="450px";
		cbc.style.left="30px";
		cbc.style.width="100px";
		cbc.style.zIndex=0;

	//color selector
	var cbx1=cl_model_crt("canvas","cl_model_color1","",cbc,"");
		//conf
		cbx1.style.position="absolute";
		cbx1.style.top="0px";
		cbx1.style.left="0px";
		cbx1.style.width="100px";
		cbx1.style.height="20px";
		cbx1.style.border="1px solid black";
		cbx1.style.margin="none";

		cbx1.width="100";//设置canvas内画布不能加px
		cbx1.height="20";

		//draw
		var ctx1=cbx1.getContext("2d");

		for(var i=0;i<100;i++){
			ctx1.fillStyle=cl_model_HSL2RGB([i*0.01,1,0.5]);
			ctx1.fillRect(i*1,0,1,20);
		}

	//S&L selector
	var cbx2=cl_model_crt("canvas","cl_model_color2","",cbc,"");

		//conf
		cbx2.style.width="100px";
		cbx2.style.height="100px";
		cbx2.style.border="1px solid black";
		cbx2.style.position="absolute";
		cbx2.style.top="20px";
		cbx2.style.left="0px";

		cbx2.width="100";
		cbx2.height="100";
		//draw
		var ctx2=cbx2.getContext("2d");

		for(var i=0;i<10;i++){
		  for(var j=0;j<10;j++){
		    ctx2.fillStyle=cl_model_HSL2RGB([0.4,i*0.1,j*0.1]);
		    ctx2.fillRect(i*10,j*10,10,10);
		  }
		}



	//select event part
		//color_tag's body
		var color_tag1=cl_model_crt("canvas","cl_model_color_tag1","",body,"");
			cl_model_selected="rgb"
				//conf
				color_tag1.style.width="40px";
				color_tag1.style.height="40px";
				color_tag1.style.position="absolute";
				color_tag1.style.border="1px solid black";
				color_tag1.style.zIndex=0;
				var container_info=window.getComputedStyle(document.getElementById("cl_model_container"));
				var left=container_info["left"];
				var _top=container_info["top"];
				color_tag1.style.left=left;
				color_tag1.style.top=String(Number(_top.substring(0,_top.length-2))-41)+"px";


				color_tag1.width=40;
				color_tag1.height=40;
		//color1 event
		var cl_model_color1=document.getElementById("cl_model_color1");
			cl_model_color1.onmousedown=function(e){
				var x=e.clientX;
				var container=document.getElementById("cl_model_container");

				var cbx1=document.getElementById("cl_model_color1");
				var ctx1=cbx1.getContext("2d");
				
				var cbx2=document.getElementById("cl_model_color2");
				var ctx2=cbx2.getContext("2d");


				//get color
				var cx=window.getComputedStyle(container)["left"]
				var cx=Number(cx.substring(0,cx.length-2));
				var delta_x=x-cx;
				var H=delta_x/100;

				var color_tag1=document.getElementById("cl_model_color_tag1");
				var color_tag1_ctx=color_tag1.getContext("2d");
				
				cur_color=cl_model_HSL2RGB([H,1,0.5]);

				color_tag1_ctx.fillStyle=cur_color;
				color_tag1_ctx.fillRect(0,0,40,40);





				//draw
				for(var i=0;i<10;i++){
				  for(var j=0;j<10;j++){
				    ctx2.fillStyle=cl_model_HSL2RGB([H,i*0.1,j*0.1]);
				    ctx2.fillRect(i*10,j*10,10,10);
				  }
				}
				cl_model_selected_H=H;
				color_tag1.style.left=String(x-20)+"px";


				cl_model_color1.onmousemove=function(e){
					var x=e.clientX;
					var container=document.getElementById("cl_model_container");

					var cbx1=document.getElementById("cl_model_color1");
					var ctx1=cbx1.getContext("2d");
					
					var cbx2=document.getElementById("cl_model_color2");
					var ctx2=cbx2.getContext("2d");


					//get color
					var cx=window.getComputedStyle(container)["left"]
					var cx=Number(cx.substring(0,cx.length-2));
					var delta_x=x-cx;
					var H=delta_x/100;

					var color_tag1=document.getElementById("cl_model_color_tag1");
					var color_tag1_ctx=color_tag1.getContext("2d");
					
					cur_color=cl_model_HSL2RGB([H,1,0.5]);

					color_tag1_ctx.fillStyle=cur_color;
					color_tag1_ctx.fillRect(0,0,100,100);


					var color_tag1=document.getElementById("cl_model_color_tag1");
					color_tag1.style.left=String(x-20)+"px";




					//draw

					for(var i=0;i<10;i++){
					  for(var j=0;j<10;j++){
					    ctx2.fillStyle=cl_model_HSL2RGB([H,i*0.1,j*0.1]);
					    ctx2.fillRect(i*10,j*10,10,10);
					  }
					}

				}
				cl_model_color1.onmouseup=function(){
					cl_model_color1.onmousemove=null;
				}
			}	
		//color2 event
		var cl_model_color2=document.getElementById("cl_model_color2");
			cl_model_color2.onmousedown=function(e){
				var x=e.clientX;
				var y=e.clientY;
				var cx=window.getComputedStyle(document.getElementById("cl_model_container"))["left"];
				var cy=window.getComputedStyle(document.getElementById("cl_model_container"))["top"];
				
				var cx=Number(cx.substring(0,cx.length-2));
				var cy=Number(cy.substring(0,cy.length-2))+20;
				
				var delta_x=Math.floor ( (x-cx)/10 )*10;
				var delta_y=Math.floor ( (y-cy)/10 )*10;


				var ctx2=this.getContext("2d");
				
				//draw
				for(var i=0;i<10;i++){
				  for(var j=0;j<10;j++){
				    ctx2.fillStyle=cl_model_HSL2RGB([cl_model_selected_H,i*0.1,j*0.1]);
				    ctx2.fillRect(i*10,j*10,10,10);
				  }
				}

				cl_model_drawRect(ctx2,delta_x,delta_y,10,10);
				var r=ctx2.getImageData(delta_x+1,delta_y+1,1,1).data;
				var rgbstr="rgb("+r[0]+","+r[1]+","+r[2]+")";
				cur_color=rgbstr;

				var colortag=document.getElementById("cl_model_color_tag1");
				var colortag_ctx=colortag.getContext("2d");
				colortag_ctx.fillStyle=cur_color;
				colortag_ctx.fillRect(0,0,100,100);



			}

}
cl_model_init();