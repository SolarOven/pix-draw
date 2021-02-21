fl_loaded=true;
width=window.innerWidth;
height=window.innerHeight;
//tools
	function fl_new_cavdata(){
		var s=Array();
		for(i=0;i<H_cell;i++){
			s.push(new Array());
			for(j=0;j<W_cell;j++){
				s[i].push([0,0,0,0]);
		  	}
		}
		return s;
	}
	function fl_new_cav(new_cav_name){

		var body=document.getElementById("body");
		var new_cav=fl_crt("canvas",new_cav_name,"draw",body,"");
		new_cav.style.top="0px";
		new_cav.style.left="0px";
		new_cav.style.position="absolute";
		new_cav.width=width;
		new_cav.height=height;

		msg[new_cav_name]=[0,fl_new_cavdata()];//zindex未定，为0
	}
	function fl_crt(tagname,id,classe,father,msg){

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
//设置css样式以及定义右键
	function fl_set_floor(divs){

		// divs.setAttribute("style", "border-radius:5px;");
		divs.style.width="100px";	
		divs.style.height="30px";
		divs.style.border="1px solid black";
		divs.style.position="absolute";
		divs.style.top="0px";
		divs.style.background="white";
		divs.style.fontSize="70%";
		divs.setAttribute("ondblclick","fl_turn_ctx_cur(this)");
	}
	function fl_set_cont(divs){

		divs.style.width="100px";
		divs.style.height="200px";
		divs.style.border="1px solid black";
		divs.style.position="fixed";
		divs.style.top="200px";
		divs.style.left="0px";
		divs.style.zIndex=0;
	}
	function fl_drag_and_right(obj){//定义右键以及拖拽功能


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
					fl_setpos();
				}
				document.onmouseup=function(){
					obj.style.left=0+"px";
					fl_setcavzindex();
					document.onmousemove=null;
					document.onmouseup=null;
				}

			}
			else{
				fl_selected=this;
				fl_ul.style.display="block";
				fl_lis[0].style.display="block";
				fl_lis[1].style.display="block";
				fl_lis[2].style.display="block";
				fl_ul.style.top=e.clientY+"px";
				fl_ul.style.left=e.clientX+"px";

			}

		}
	}

//right-click menu
	function fl_cancel(){
		fl_ul.style.display="none";
		fl_lis[0].style.display="none";
		fl_lis[1].style.display="none";
		fl_lis[2].style.display="none";


		var rename_input=document.getElementById("fl_rename_input");
		var rename_button=document.getElementById("fl_rename_button");
		
		rename_input.style.display="none";
		rename_button.style.display="none";

		fl_selected=null;
	}
	function fl_delete_floor_and_canv(){
		fl_del(fl_selected);

		fl_cancel();
	}
	function fl_rename_floor_and_canv(obj){
		var rename_input=document.getElementById("fl_rename_input");
		var rename_button=document.getElementById("fl_rename_button");
		var selected_name="";

		rename_input.style.display="block";
		rename_button.style.display="block";
	 	
	 	rename_input.style.top=event.clientY+"px";
	 	rename_button.style.top=String(Number(event.clientY)+35)+"px";

	 	rename_input.style.left=event.clientX+"px";
	 	rename_button.style.left=String(Number(event.clientX)+30)+"px";
	}
	function fl_rename(){

		if(fl_selected==null){
			alert("error,fl_selected==null");
		}
		else{
			selected_name=fl_selected.id.substring(2,);
			var rename_cav=document.getElementById("draw_"+selected_name);
			var rename_floor=fl_selected;

			var willbe_name=document.getElementById("fl_rename_input").value;
			rename_floor.innerHTML=willbe_name;
			rename_floor.id="f_"+willbe_name;
			rename_cav.id="draw_"+willbe_name;
			fl_cancel();
			//【bug】推测若是用dom标签写的改id就会清空属性，其他则不会。

		}
	}


function fl_setpos(){//更新右侧图层控制栏中，图层的顺序

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
function fl_setcavzindex(){//must after setpos
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
		var floor_to_cav=document.getElementById(cavid);
		msg[cavid][0] = floor_to_cav.style.zIndex = (-6-i);

	}
}
function fl_button_add(){
	var new_cav_name=fl_add_floor("");
	fl_setpos();
	new_cav_name="draw_"+new_cav_name;
	fl_new_cav(new_cav_name);
	fl_setcavzindex();

}
function fl_add_floor(floor_name){//floor_name="xxxx" or ""(auto) not "draw_xxxx"

	var n=document.getElementsByClassName("floorbox").length;
	if(floor_name==''){
		floor_name=(n+1);
	}

	var fs=document.getElementById("container");
	fl_set_cont(fs);

	f=fl_crt("div","f_"+floor_name,"floorbox",fs,floor_name);
	fl_set_floor(f);
	fl_drag_and_right(f);
	f.style.top=n*41+"px";
	return floor_name;_and_right
}
function fl_turn_ctx_cur(obj){

	var fls=document.getElementsByClassName("floorbox");
	for(var i=0;i<fls.length;i++){
		fls[i].style.background="white";
	}

	var cavname="draw_"+obj.id.substring(2,);
	cur_ctx=document.getElementById(cavname).getContext("2d");
	cur_cavid=cavname;
	obj.style.background="red";
}
function fl_newcav_and_floor(floor_name){//floor_name="xxxx" not "draw_xxxx" or ""(auto)

	var new_cav_name=fl_add_floor(floor_name);
	fl_setpos();
	new_cav_name="draw_"+new_cav_name;
	fl_new_cav(new_cav_name);
	fl_setcavzindex();
	return new_cav_name;
}


function fl_clear(all=false){

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
function fl_del(name_obj,usename=false){
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
	fl_setpos();
	fl_setcavzindex();
}


//init
	function fl_add_floor_init(){//根据当前存在的图层数，增加左侧图层控制栏

		var body=document.getElementById("body");
		var cavs=document.getElementsByClassName("draw");
		//此处对cavs按zindex排序,cavs_list是排序后的
		
		var cavs_list=[]
		var ainfo,binfo;
		for(var i=0;i<cavs.length;i++){
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


		var fs=fl_crt("div","container","",body,"");
		fl_set_cont(fs);
		fs.style.top="100px";
		//按照排的顺序逐个增加floor
		for(var i=0;i<n;i++){

			fl_add_floor( cavs_list[i].id.substring(5,));
		}


		//最后整理格式

		fl_setpos();
		fl_setcavzindex();

		//set floor right menu
		fl_ul=fl_crt("ul","floormenu","",body,"");

		fl_lis=[];
		var li0=fl_crt("li","floormenu0","",fl_ul,"delete");
		var li1=fl_crt("li","floormenu1","",fl_ul,"rename");
		var li2=fl_crt("li","floormenu2","",fl_ul,"cancel");
		
		fl_lis.push(li0);
		fl_lis.push(li1);
		fl_lis.push(li2);

		fl_ul.style.position="absolute";
		fl_ul.style.display="none";
		fl_ul.style.border="1px solid black";
		fl_ul.style.background="white";	
		fl_ul.style.width="100px";
		fl_ul.style.height="60px";


		fl_lis[0].style.display="none";
		fl_lis[1].style.display="none";
		fl_lis[2].style.display="none";


		fl_lis[0].setAttribute("onclick","fl_delete_floor_and_canv(this)");
		fl_lis[1].setAttribute("onclick","fl_rename_floor_and_canv(this)");
		fl_lis[2].setAttribute("onclick","fl_cancel()");
		//set ret menu --- rename

		// <input id="fl_rename_box" type="text" placeholder="Please input your floor's name">
		// <button id="fl_yesrename" onclick="yesrename()"></button>
		// function fl_crt(tagname,id,classe,father,msg)
		var fl_rename_input=fl_crt("input","fl_rename_input","",body,"");
		var fl_rename_button=fl_crt("button","fl_rename_button","",body,"yes");
		
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

		fl_rename_button.setAttribute("onclick","fl_rename()");	
	}
	function fl_init(){

		fl_selected=null;
		fl_add_floor_button();
		fl_add_floor_init();
	}
	function fl_add_floor_button(){

		var body=document.getElementById("body");
		var b=fl_crt("button","add_floor","",body,"addfloor");
		b.style.position="fixed";
		b.style.width="100px";
		b.style.height="50px";
		b.style.top="150px";
		b.style.left="0px";
		b.setAttribute("onclick","fl_button_add()");
	}
fl_init();

//【bug】要改掉addfloor时的名米ingfangshi