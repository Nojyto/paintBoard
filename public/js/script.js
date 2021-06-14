let canvas

window.onload = async () => {
    canvas = new fabric.Canvas("canvas", {isDrawingMode:true})
    canvas.freeDrawingBrush.width = 3
    canvas.freeDrawingBrush.color = "#FF2800"
}

document.getElementById("editMode").addEventListener("change", () => {
    canvas.isDrawingMode = !document.getElementById("editMode").checked
})

function updateBrushWidth(value){
    document.getElementById("width").innerHTML = value
    canvas.freeDrawingBrush.width = value
}

function updateBrushColor(value){
    canvas.freeDrawingBrush.color = value
}

document.getElementById("clearCanvas").addEventListener("click", () => {
    canvas.clear()
    socket.emit("invoke", JSON.stringify(canvas))
})

document.getElementById('downloadImg').addEventListener('click', () => {
    img = document.getElementById('downloadImg')
    img.href = canvas.toDataURL({format: 'png', quality: 0.8})
    img.download = 'canvas.png'
})

document.getElementById("imageLoader").onchange = (e) => {
    var reader = new FileReader();
        reader.onload = function (event){
            var imgObj = new Image()
            imgObj.src = event.target.result
            imgObj.onload = () => {
                var image = new fabric.Image(imgObj)
                image.set({
                    angle: 0,
                    padding: 10,
                    cornersize: 10,
                    height: 110,
                    width: 110,
                })
                canvas.centerObject(image)
                canvas.add(image)
                canvas.renderAll()
            }
        }
    reader.readAsDataURL(e.target.files[0])
}


const socket = io.connect("/");

socket.on("update", (img) => {
    canvas.loadFromJSON(img, () => canvas.renderAll(), (o, obj) => {/*console.log(o, obj)*/})
})

window.addEventListener("mouseup", e => {
    socket.emit("invoke", JSON.stringify(canvas))
})