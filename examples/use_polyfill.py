import never_jscore


ctx = never_jscore.Context()

with open('incapsua2.js','r',encoding='utf8')as f:
    # ctx.compile(f.read())
    ctx.eval(f.read())
