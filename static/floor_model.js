
width=window.innerWidth;
height=window.innerHeight;

function fl_model_new_cav(new_cav_name){

	var body=document.getElementById("body");
	var new_cav=fl_model_crt("canvas",new_cav_name,"draw",body,"");
	new_cav.style.top="0px";
	new_cav.style.left="0px";
	new_cav.style.position="absolute";
	new_cav.width=width;
	new_cav.height=height;
}

function fl_model_crt(tagname,id,classe,father,msg){

	var s=document.createElement(tagname);
	if(msg!=""){
		s.appendChild(document.createTextNode(msg));
	}
	if(classe!=""){
		s.setAttribute("class",classe);			
	}
	s.setAttribute("id",id);
	father.appendChild(s);
	return s;
}

function fl_model_set_floor(divs){

	// divs.setAttribute("style", "border-radius:5px;");
	divs.style.width="100px";	
	divs.style.height="30px";
	divs.style.border="1px solid black";
	divs.style.position="absolute";
	divs.style.top="0px";
	divs.style.background="white";
	divs.style.fontSize="70%";
	divs.setAttribute("ondblclick","fl_model_turn_ctx_cur(this)");
}

function fl_model_set_cont(divs){

	divs.style.width="100px";
	divs.style.height="200px";
	divs.style.border="1px solid black";
	divs.style.position="fixed";
	divs.style.top="200px";
	divs.style.left="0px";
	divs.style.zIndex=0;

}


function fl_model_add_floor_init(){

	var body=document.getElementById("body");
	var cavs=document.getElementsByClassName("draw");
	//此处对cavs按zindex排序,cavs_list是排序后的
	
	var cavs_list=[]
	var ainfo,binfo;
	for(var i=0;i<cavs.length;i++)
	{
	  cavs_list.push(cavs[i]);
	}



	cavs_list.sort(function(a,b){
		ainfo=window.getComputedStyle(a);
 		binfo=window.getComputedStyle(b);
	  	var az=Number(ainfo["z-index"]);
	  	var bz=Number(binfo["z-index"]);
	  	return bz-az;
		}
	)

	var n=cavs.length;


	var fs=fl_model_crt("div","container","",body,"");
	fl_model_set_cont(fs);
	fs.style.top="100px";
	//按照排的顺序逐个增加floor
	for(var i=0;i<n;i++){

		fl_model_add_floor( cavs_list[i].id.substring(5,));
	}


	//最后整理格式

	fl_model_setpos();
	fl_model_setcavzindex();

	//set floor right menu
	fl_model_ul=fl_model_crt("ul","floormenu","",body,"");

	fl_model_lis=[];
	var li0=fl_model_crt("li","floormenu0","",fl_model_ul,"delete");
	var li1=fl_model_crt("li","floormenu1","",fl_model_ul,"rename");
	var li2=fl_model_crt("li","floormenu2","",fl_model_ul,"cancel");
	
	fl_model_lis.push(li0);
	fl_model_lis.push(li1);
	fl_model_lis.push(li2);

	fl_model_ul.style.position="absolute";
	fl_model_ul.style.display="none";
	fl_model_ul.style.border="1px solid black";
	fl_model_ul.style.background="white";	
	fl_model_ul.style.width="100px";
	fl_model_ul.style.height="60px";


	fl_model_lis[0].style.display="none";
	fl_model_lis[1].style.display="none";
	fl_model_lis[2].style.display="none";


	fl_model_lis[0].setAttribute("onclick","fl_model_delete_floor_and_canv(this)");
	fl_model_lis[1].setAttribute("onclick","fl_model_rename_floor_and_canv(this)");
	fl_model_lis[2].setAttribute("onclick","fl_model_cancel()");
	//set ret menu --- rename

	// <input id="fl_rename_box" type="text" placeholder="Please input your floor's name">
	// <button id="fl_yesrename" onclick="yesrename()"></button>
	// function fl_model_crt(tagname,id,classe,father,msg)
	var fl_rename_input=fl_model_crt("input","fl_model_rename_input","",body,"");
	var fl_rename_button=fl_model_crt("button","fl_model_rename_button","",body,"yes");
	
	fl_rename_input.style.position="absolute";
	fl_rename_button.style.position="absolute";
	
	fl_rename_input.style.display="none";
	fl_rename_button.style.display="none";

	fl_rename_button.style.width="50px";
	fl_rename_button.style.height="30px";


	fl_rename_input.style.width="100px";
	fl_rename_input.style.height="30px";

	fl_rename_button.style.zIndex=10;
	fl_rename_input.style.zIndex=10;

	fl_rename_button.setAttribute("onclick","fl_model_rename()");
	
}

function fl_model_cancel(){
	fl_model_ul.style.display="none";
	fl_model_lis[0].style.display="none";
	fl_model_lis[1].style.display="none";
	fl_model_lis[2].style.display="none";


	var rename_input=document.getElementById("fl_model_rename_input");
	var rename_button=document.getElementById("fl_model_rename_button");
	
	rename_input.style.display="none";
	rename_button.style.display="none";

	fl_model_selected=null;
}
function fl_model_delete_floor_and_canv(){
	fl_model_del(fl_model_selected);
	console.log("delete_floor_and_canv");

	fl_model_cancel();
}

function fl_model_rename_floor_and_canv(obj){
	var rename_input=document.getElementById("fl_model_rename_input");
	var rename_button=document.getElementById("fl_model_rename_button");
	var selected_name="";

	rename_input.style.display="block";
	rename_button.style.display="block";
 	
 	rename_input.style.top=event.clientY+"px";
 	rename_button.style.top=String(Number(event.clientY)+35)+"px";

 	rename_input.style.left=event.clientX+"px";
 	rename_button.style.left=String(Number(event.clientX)+30)+"px";


 	console.log("rename_floor_and_canv");

}

function fl_model_rename(){

	if(fl_model_selected==null){
		alert("error,fl_model_selected==null");
	}
	else{
		selected_name=fl_model_selected.id.substring(2,);
		var rename_cav=document.getElementById("draw_"+selected_name);
		var rename_floor=fl_model_selected;

		var willbe_name=document.getElementById("fl_model_rename_input").value;
		rename_floor.innerHTML=willbe_name;
		rename_floor.id="f_"+willbe_name;
		rename_cav.id="draw_"+willbe_name;
		fl_model_cancel();
		//【bug】推测若是用dom标签写的改id就会清空属性，其他则不会。

	}

}

function fl_model_drag_and_right(obj){


	obj.oncontextmenu = function(e){
       		e.preventDefault();
	};


	obj.onmousedown=function(e){
		
		if(e.button==0){
			var e=event?event:window.event;

			var ox=(e.clientX-obj.offsetLeft);

			var oy=(e.clientY-obj.offsetTop);
			document.onmousemove=function(event){
				var e=event?event:window.event;
				obj.style.top=e.clientY-oy +"px";
				obj.style.left=e.clientX-ox +"px";	
				fl_model_setpos();
			}
			document.onmouseup=function(){
				obj.style.left=0+"px";
				fl_model_setcavzindex();
				document.onmousemove=null;
				document.onmouseup=null;
			}

		}
		else{
			fl_model_selected=this;
			fl_model_ul.style.display="block";
			fl_model_lis[0].style.display="block";
			fl_model_lis[1].style.display="block";
			fl_model_lis[2].style.display="block";
			fl_model_ul.style.top=e.clientY+"px";
			fl_model_ul.style.left=e.clientX+"px";

		}

	}
}
function fl_model_setpos(){

	var fls=document.getElementsByClassName("floorbox");
	var fls_array=[]
	for(var i=0;i<fls.length;i++){
	  fls_array.push(fls[i]);
	}

	fls_array.sort(
	  function(a,b){
	  		return a.offsetTop-b.offsetTop;
		}
	);


	for(var i=0;i<fls.length;i++){
		fls_array[i].style.top=i*35+"px";
		
	}
}
function fl_model_setcavzindex(){//must after setpos
	console.log("set cav id");
	//获取floors，然后对其top排序，在上的放前面
	var fls=document.getElementsByClassName("floorbox");
	var fls_array=[]
	for(var i=0;i<fls.length;i++){
	  fls_array.push(fls[i]);
	}

	fls_array.sort(
	  function(a,b){
	  		return a.offsetTop-b.offsetTop;
		}
	);
	//对排好的floor，更改cav的zindex
	for(var i=0;i<fls.length;i++){

		var cavid="draw_"+fls_array[i].id.substring(2,);
		console.log(cavid);
		var floor_to_cav=document.getElementById(cavid);
		floor_to_cav.style.zIndex=(-6-i);
	}
}


function fl_model_add_floor_button(){

	var body=document.getElementById("body");
	var b=fl_model_crt("button","add_floor","",body,"addfloor");
	b.style.position="fixed";
	b.style.width="100px";
	b.style.height="50px";
	b.style.top="150px";
	b.style.left="0px";
	b.setAttribute("onclick","fl_model_button_add()");
}
function fl_model_button_add(){
	var new_cav_name=fl_model_add_floor("");
	
	fl_model_setpos();
	new_cav_name="draw_"+new_cav_name;
	fl_model_new_cav(new_cav_name);
	fl_model_setcavzindex();

}
function fl_model_add_floor(floor_name){//floor_name="xxxx" or ""(auto) not "draw_xxxx"

	var n=document.getElementsByClassName("floorbox").length;
	if(floor_name==''){
		floor_name=(n+1);
	}

	var fs=document.getElementById("container");
	fl_model_set_cont(fs);

	f=fl_model_crt("div","f_"+floor_name,"floorbox",fs,floor_name);
	fl_model_set_floor(f);
	fl_model_drag_and_right(f);
	f.style.top=n*41+"px";
	return floor_name;_and_right
}
// fl_model_last_floor_name="";
function fl_model_turn_ctx_cur(obj){

	var fls=document.getElementsByClassName("floorbox");
	for(var i=0;i<fls.length;i++){
		fls[i].style.background="white";
	}

	var cavname="draw_"+obj.id.substring(2,);
	cur_ctx=document.getElementById(cavname).getContext("2d");
	obj.style.background="red";

}
function fl_model_newcav_and_floor(floor_name){//floor_name="xxxx" not "draw_xxxx" or ""(auto)

	var new_cav_name=fl_model_add_floor(floor_name);
	fl_model_setpos();
	new_cav_name="draw_"+new_cav_name;
	fl_model_new_cav(new_cav_name);
	fl_model_setcavzindex();
	return new_cav_name;
}


function fl_model_clear(all=false){

	var floors=document.getElementsByClassName("floorbox");
	
	while(floors.length!=0){
		floors[0].remove();
	}

	var draws=document.getElementsByClassName("draw");
	while(draws.length!=0){
		draws[0].remove();
	}
	if(all==true){
		document.getElementById("container").remove();
	}
}
function fl_model_del(name_obj,usename=false){
	if(usename==true){
		name=name_obj;
		var cav=document.getElementById("draw_"+name);
		var fl=document.getElementById("f_"+name);
		
	}

	else{
		name=name_obj.id.substring(2,);
		var cav=document.getElementById("draw_"+name);
		
		fl=name_obj;
	}

	fl.remove();
	cav.remove();
	fl_model_setpos();
	fl_model_setcavzindex();
}


window.onload=function(){
	fl_model_selected=null;
	fl_model_last_floor_name="";
	fl_model_add_floor_button();
	fl_model_add_floor_init();

}

//【bug】要改掉addfloor时的名米ingfangshi