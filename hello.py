from flask import Flask
import json
from flask import render_template,request,redirect,jsonify
app=Flask(__name__)





@app.route("/")
def hello_world():
    return "hello!,gg,Hello,World!"

@app.route('/multi')
@app.route('/multi/<name>')
def multi(name=None):
    return render_template('multi_cav.html',name=name)

@app.route("/pix_draw", methods=("GET", "POST"))
def out():
  # GET请求
  if request.method == "GET":
    return render_template("pix_draw.html")
  # POST请求
  if request.method == "POST":

    # 获取数据并转化成字典
    user_info = request.form.to_dict()
    #now the dict is unfinish statue,the imagedata is mixed together,need more dispose,this will be done in def in()


    #the file will be writen is such file:{"name":"xxx","size":"xx,xx","draw":"xx,xx,...",...}
    # the "name":"xx" item is not useful anymore,so it will be del
    name=user_info["name"]
    del user_info["name"]
    asjson=json.dumps(user_info)
    with open("./draw_files/"+name+".json","w") as f:
        f.write(asjson)
    return "success",200

@app.route("/in",methods=("GET","POST"))
def in_not_python():
    df_rsp="No Such File";
    #get
    if request.method == "GET":
        return "cant get",500;
    else:
        user_info=request.form.to_dict()
        #user_info:{"name":xxx},name is what we need to load
        with open("./draw_files/"+user_info["name"]+".json","r") as f:
            txt=f.read()
        mid_rsp=json.loads(txt)
        #because the loaded file is {"size":"xx,xx","draw":"xx,xx,xx,...","draw1":"xx,xx,xx,..."}
        #every "draw" item need to be transfirm to "draw":[ zindex,[[],[],[]] ]
        #and the size depends on mid_rsp["size"]

        end_rsp={}
        size=eval(mid_rsp["size"])
        del mid_rsp["size"]

        for it in mid_rsp.items():
            draw_name=it[0]
            draw_value=eval(it[1])#[xx,xx,xx,.....]
            zindex=draw_value[0]
            
            pix_value=[draw_value[i:i+4] for i in range(len(draw_value))[1::4]] #[[xx,xx,xx,xx],[xx,xx,xx,xx],....]
            end_rsp[draw_name]=[zindex,[]]
            for row in range(size[0]):
                end_rsp[draw_name][1].append([])
                for line in range(size[1]):
                    end_rsp[draw_name][1][row].append( pix_value[ row*size[1]+line ] )
            #now i find that it need the width and the length cells
            #so then i need to change the out_draw.html
        return jsonify(end_rsp)




