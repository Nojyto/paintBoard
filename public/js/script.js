//const socket = io.connect("/");
let canvas

window.onload = () => {
    canvas = new fabric.Canvas("canvas", {isDrawingMode:true})
    canvas.freeDrawingBrush.width = 3
    canvas.freeDrawingBrush.color = "#FF2800"
}

/*
socket.on("update", (img) => {
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

function insertImg(e){
    console.log("yeet")
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
    var activeObject = canvas.getActiveObject(),
    activeGroup = canvas.getActiveGroup()
    if(activeObject){
        canvas.remove(activeObject)
    }else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach((obj) => {canvas.remove(obj)})
    }
}

function clearCanvas(){
    canvas.clear()
    socket.emit("invoke", JSON.stringify(canvas))
}

function saveCanvas(isKeyBind){
    img = document.getElementById("downloadImg")
    img.href = canvas.toDataURL({format: 'png', quality: 0.8})
    img.download = "canvas.png"
    if(isKeyBind) img.click()
}

document.addEventListener("keyup", (evt) => {
    switch(evt.key){
        case "E": case "e":
            toggleEditMode(true)
            break
        case "Delete":
            delSelectedObj()
            break
        case "C": case "c":
            clearCanvas()
            break
        case "S": case "s":
            saveCanvas(true)
            break
        default: break
    }
})