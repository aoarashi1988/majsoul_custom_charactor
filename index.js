const app = require('express')()
const http = require('http')
const server = http.Server(app)
const cors = require('cors')
const fs = require('fs')
const util = require('./script/util')

app.use(cors())

function getImage(originalUrl) {
  const path = formatUrl(originalUrl)
  const data = fs.readFileSync(path)
  console.log('read data  = ', data)
  const encodeBuffer = util.XOR(data)
  console.log('encode buffer, length = ', encodeBuffer.length)
  return encodeBuffer
}

function formatUrl(originalUrl) {
  return __dirname + originalUrl
}

app.get('/charactors/*', (req, res) => {
  console.log(req.originalUrl)
  const image = getImage(req.originalUrl)
  res.send(image)
})

app.get('/bgm/*', (req, res) => {
  res.sendFile(__dirname + req.originalUrl)
})

app.get('/script/*', (req, res) => {
  res.sendFile(__dirname + req.originalUrl)
})

server.listen(8000, () => {
  console.log('\nserver is running on port 8000')
})

function getVersionJson() {
  return new Promise((resolve, reject) => {

    console.log('\n正在获取version.json...')

    http.get('http://majsoul.union-game.com/0/version.json', res => {

      const { statusCode } = res
      const contentType = res.headers['content-type']
      let error

      if (200 !== statusCode) {
        error = new Error(`请求失败\n状态码：${statusCode}`)
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`非法的 content-type\n期待的是 application/json 但接受到的是 ${contentType}`)
      }

      if (error) {
        reject(error.message)
        res.resume()
        return
      }

      res.setEncoding('utf8')

      let rawData = ''

      res.on('data', chunk => { rawData += chunk })

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          console.log('\n获取成功')
          resolve(parsedData)
        } catch (err) {
          reject(`转换version.json失败: ${err.message}`)
        }
      }).on('error', e => {
        reject(`报错： ${e.message}`)
      })
    })
  })
}

function getCodeJS(versionJson) {
  return new Promise((resolve, reject) => {

    console.log('\n正在获取code.js...')

    const codeJsUrl = `http://majsoul.union-game.com/0/${versionJson['code']}`

    http.get(codeJsUrl, res => {

      const { statusCode } = res

      if (200 !== statusCode) {
        reject('获取code.js失败')
      }

      res.setEncoding('utf8')

      let codeJS = ''

      res.on('data', chunk => {
        codeJS += chunk
      })

      res.on('end', () => {
        console.log('\n获取成功')
        resolve(codeJS)
      })
    })
  })
}

function checkCodePatchedJS(codeJS) {
  return new Promise((resolve, reject) => {

    console.log('\n校验本地code.patched.js...')

    const path = __dirname + '/script/code.patched.js'
    const exists = fs.existsSync(path)

    if (exists) {
      fs.unlinkSync(path)
    }

    console.log('\n校验完毕')
    resolve(codeJS)
  })
}

function readBgmJS(codeJS) {
  return new Promise((resolve, reject) => {

    console.log('\n读取本地bgm.js...')

    const path = __dirname + '/script/bgm.js'
    const exists = fs.existsSync(path)

    if (exists) {
      const bgmJS = fs.readFileSync(path, 'utf8')
      console.log('\n读取成功')
      resolve({ codeJS, bgmJS })
    }

    reject('/script/bgm.js 文件不存在， 你可以前往 https://github.com/aoarashi1988/majsoul_custrom_charactor 下载对应文件')
  })
}

function writeCodePatchedJS({ codeJS, bgmJS }) {

  console.log('\n开始写入本地code.patched.js...')
  
  const codePatchedJS = codeJS + bgmJS
  const path = __dirname + '/script/code.patched.js'

  fs.writeFileSync(path, codePatchedJS)

  console.log('\n写入完毕')
}

getVersionJson()
  .then(getCodeJS)
  .then(checkCodePatchedJS)
  .then(readBgmJS)
  .then(writeCodePatchedJS)
  .catch(console.log)

function initDir(dir) {
  fs.exists(__dirname + `/${dir}`, exists => {
    if (!exists) {
      fs.mkdir(__dirname + `/${dir}`, err => {
        if (err) {
          console.log(`创建 /${dir} 目录失败，请手动创建`)
        }
      })
    }
  })
}

initDir('bgm')
initDir('charactors')