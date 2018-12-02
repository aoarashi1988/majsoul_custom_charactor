var app = require('express')()
var http = require('http').Server(app)
var cors = require('cors')
var fs = require('fs')

var util = require('./script/util')

function getImage (originalUrl) {
  var path = formatUrl(originalUrl)
  var data = fs.readFileSync(path)
  console.log('read data  = ', data)
  // var buffer = Buffer.from(data)
  // console.log('transfer to buffer, length = ', buffer.length)
  var encodeBuffer = util.XOR(data)
  console.log('encode buffer, length = ', encodeBuffer.length)
  // console.log('encode buffer = ' + encodeBuffer)
  // return buffer
  return encodeBuffer
}

function formatUrl (originalUrl) {
  return __dirname + originalUrl
}

app.use(cors())

app.get('/charactors/*', (req, res) => {
    // res.sendFile(__dirname + req.originalUrl)
    // return 
  console.log(req.originalUrl)
  var image = getImage(req.originalUrl)
  res.send(image)
})
app.get('/bgm/*', (req, res) => {
    res.sendFile(__dirname + req.originalUrl)
})

app.get('/script/*', (req, res) => {
  res.sendFile(__dirname + req.originalUrl)
})

http.listen(8000, () => {
  console.log('server is running on port 8000')
})
