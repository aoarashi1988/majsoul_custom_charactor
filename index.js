const app = require('express')()
const https = require('https')
const http = require('http')
const server = http.Server(app)
const cors = require('cors')
const fs = require('fs')
const util = require('./script/util')
const path = require('path')

app.use(cors())

function getImage (originalUrl) {
  const path = formatUrl(originalUrl)
  console.log('\n接收到图片资源请求，路径 = ', path)
  let data
  try {
    console.log('\n正在读取本地文件...')
    data = fs.readFileSync(path)
  } catch (error) {
    throw '\n文件不存在，请检查charactors文件夹内容'
  }
  console.log('\n本地文件读取完毕，正在加密...')
  const encodeBuffer = util.XOR(data)
  console.log('\n加密完毕，返回加密后图片')
  return encodeBuffer
}

function formatUrl (originalUrl) {
  return __dirname + originalUrl
}

app.get('/charactors/*', (req, res) => {
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

function getVersionJson () {
  return new Promise((resolve, reject) => {

    console.log('\n正在获取version.json...')

    https.get('https://majsoul.union-game.com/0/version.json', res => {

      const { statusCode } = res
      const contentType = res.headers['content-type']
      let error

      if (200 !== statusCode) {
        error = new Error(`\n请求失败\n状态码：${statusCode}`)
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`\n非法的 content-type\n期待的是 application/json 但接受到的是 ${contentType}`)
      }

      if (error) {
        reject(error.message)
        res.resume()
        return
      }

      res.setEncoding('utf8')

      let rawData = ''

      res.on('data', chunk => {
        rawData += chunk})

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          console.log('\n获取 version.json 成功')
          resolve(parsedData)
        } catch (err) {
          reject(`\n转换version.json失败: ${err.message}`)
        }
      }).on('error', e => {
        reject(`\n报错： ${e.message}`)
      })
    })
  })
}

function getCodeJS (versionJson) {
  return new Promise((resolve, reject) => {

    console.log('\n正在获取code.js...')

    const codeJsUrl = `https://majsoul.union-game.com/0/${versionJson['code']}`

    https.get(codeJsUrl, res => {

      const { statusCode } = res

      if (200 !== statusCode) {
        reject('\n获取code.js失败')
      }

      res.setEncoding('utf8')

      let codeJS = ''

      res.on('data', chunk => {
        codeJS += chunk
      })

      res.on('end', () => {
        console.log('\n获取 原始code.js 成功 ')
        resolve(codeJS)
      })
    })
  })
}

function checkCodePatchedJS (codeJS) {
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

function getpatchJSPaths (){
  const excuteConfig = require('./config.json')
  const excuteJSs = excuteConfig.excute.filter(item => !!item.active)
  return excuteJSs.map(item => path.join(__dirname, item.path))
}
const patchJSPaths = getpatchJSPaths()

function readPatchJS (codeJS) {
  return new Promise((resolve, reject) => {
    let patchJS = ''
    console.log('开始读取本地patch文件')
    for (let index = 0; index < patchJSPaths.length; index++) {
      const path = patchJSPaths[index]
      const exists = fs.existsSync(path)
      if (exists) {
        patchJS += fs.readFileSync(path, 'utf8')
      }
    }
    resolve({codeJS, patchJS})

    reject('\n/script/bgm.js 文件不存在， 你可以前往 https://github.com/aoarashi1988/majsoul_custrom_charactor 下载对应文件')
  })
}

function writeCodePatchedJS ({ codeJS, patchJS }) {
  console.log('\n开始写入本地code.patched.js...')

  const codePatchedJS = codeJS + patchJS
  const path = __dirname + '/script/code.patched.js'

  fs.writeFileSync(path, codePatchedJS)

  console.log('\n写入本地code.patched.js完毕')
  console.log('\n本地服务器初始化完成，祝君雀力日进 \\(^o^)/~')
}

getVersionJson()
  .then(getCodeJS)
  .then(checkCodePatchedJS)
  .then(readPatchJS)
  .then(writeCodePatchedJS)
  .catch(console.log)

function initDir (dir) {
  console.log(`\n检查 /${dir} 目录是否存在...`)
  fs.exists(__dirname + `/${dir}`, exists => {
    if (!exists) {
      console.log(`\n/${dir}目录不存在，正在尝试创建...`)
      fs.mkdir(__dirname + `/${dir}`, err => {
        if (err) {
          console.log(`\n/${dir} 目录创建失败，请手动创建`)
        } else {
          console.log(`\n/${dir} 目录创建成功`)
        }
      })
    } else {
      console.log(`\n/${dir} 目录已存在，无需重复创建`)
    }
  })
}

initDir('bgm')
initDir('charactors')
