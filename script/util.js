var util = {
  XOR: function (buffer) {
    let array = []
    for (let index = 0; index < buffer.length; index++) {
      const byte = buffer.readUInt8(index)
      array.push(73 ^ byte)
    }
    return new Buffer.from(array)
  }
}
module.exports = util
