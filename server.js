const express = require("express")
const server  = require("http").Server(express().use("/", express.static("public/")))
const io      = require("socket.io")(server)

const host    = "localhost", port = 8080
let canvas, users = 0;

io.on("connection", (socket) => {
    console.log(`Users connected: ${++users}`)

    socket.emit("update", canvas)
    socket.on("invoke", (img) => {
        //console.log("Canvas updated.")
        io.emit("update", canvas = img)
    })
    socket.on("disconnect", (socket) => {
        console.log(`Users connected: ${--users}`)
    })
})


server.listen(port, host, () => console.log(`Live on => http://${host}:${port}`))
