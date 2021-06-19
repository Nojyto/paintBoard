//const socket = io.connect("/");
let canvas


window.onload = () => {
    canvas = new fabric.Canvas("canvas", {isDrawingMode:true})
    canvas.freeDrawingBrush.width = 3
    canvas.freeDrawingBrush.color = "#FF2800"
    /*canvas.setHeight(window.innerHeigh - 64);
    canvas.setWidth(window.innerWidth - 64);*/
}

/*window.addEventListener("resize", () => {
    canvas.setHeight(window.innerHeight - 64);
    canvas.setWidth(window.innerWidth - 64);
})*/

/*socket.on("update", (img) => {
    canvas.loadFromJSON(img, () => canvas.renderAll())
})

window.addEventListener("mouseup", e => {
    socket.emit("invoke", JSON.stringify(canvas))
})*/

function updateBrushWidth(value){
    canvas.freeDrawingBrush.width = value
}

function updateBrushColor(value){
    canvas.freeDrawingBrush.color = value
}

function toggleEditMode(isKeyBind){
    let mode = document.getElementById("editMode")
    if(isKeyBind) mode.checked = !mode.checked
    canvas.isDrawingMode = !mode.checked
}

function groupSelection(){
    if(canvas.getActiveObject() && canvas.getActiveObject().type === "activeSelection"){
        canvas.getActiveObject().toGroup()
        canvas.requestRenderAll()
    }else if(canvas.getActiveObject() && canvas.getActiveObject().type === "group") {
        canvas.getActiveObject().toActiveSelection();
        canvas.requestRenderAll();
    }
}

function copySelection() {
	canvas.getActiveObject().clone((cloned) => {_clipboard = cloned})
}

function pasteSelection() {
    if(!document.getElementById("editMode").checked) toggleEditMode(true)
	_clipboard.clone((clonedObj) => {
        canvas.discardActiveObject()
        clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
        })
        if (clonedObj.type === "activeSelection") {
            clonedObj.canvas = canvas;
            clonedObj.forEachObject((obj) => {canvas.add(obj)})
            clonedObj.setCoords();
        } else {
           canvas.add(clonedObj);
        }
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
        
        _clipboard = clonedObj;
    })
}

function insertTxtBox(){
    let fontSize = prompt("Enter font size", 16)
    if(fontSize === null) return
    if(fontSize === "" || isNaN(fontSize)){
        alert("Invalid input. Action aborted.")
        return
    }

    let color = prompt("Enter text color", "black")
    if(color === null) return
    if(fontSize === "" || !(color => {
        const s = new Option().style
        s.color = color
        return s.color !== ''
    })){
        alert("Invalid input. Action aborted.")
        return
    }

    if(!document.getElementById("editMode").checked) toggleEditMode(true)
    canvas.add(new fabric.Textbox("Text", {
        width: 125,
        top: 10,
        left: 10,
        fontSize: fontSize,
        fill: color,
        textAlign: "center",
        fixedWidth: 150
    }))
}

function insertImg(e){
    let reader = new FileReader()
        reader.onload = (evt) => {
            let imgObj = new Image()
            imgObj.src = evt.target.result
            imgObj.onload = () => {
                let img = new fabric.Image(imgObj).set({
                    angle: 0,
                    padding: 10,
                    cornersize: 10,
                    height: 250,
                    width: 250,
                })
                canvas.centerObject(img).add(img).renderAll()
            }
        }
    reader.readAsDataURL(e.target.files[0])
}

function delSelectedObj(){
    let selection = canvas.getActiveObject();
    if(selection.type === "activeSelection")
        selection.forEachObject((el) => {canvas.remove(el)})
    else
        canvas.remove(selection)
    canvas.discardActiveObject().requestRenderAll()
}

function clearCanvas(){
    if(!confirm("Are you sure you want to clear the canvas?")) return
    canvas.clear()
    //socket.emit("invoke", JSON.stringify(canvas))
}

function saveCanvas(isKeyBind){
    img = document.getElementById("downloadImg")
    img.href = canvas.toDataURL({format: 'png', quality: 0.8})
    img.download = "canvas.png"
    if(isKeyBind) img.click()
}

document.addEventListener("keyup", (evt) => {
    switch(evt.key){
        case "Insert":
            toggleEditMode(true)
            break 
        case "Delete":
            delSelectedObj()
            break
        default: break
    }
})