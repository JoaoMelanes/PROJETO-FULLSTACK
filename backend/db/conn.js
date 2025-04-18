const mogoose = require('mongoose')

async function main() {
   await mogoose.connect('mongodb://localhost:27017/getapet')
   console.log('Concetou ao mongoose')
}

main().catch((e) => {
 console.log(e)
})

module.exports = mogoose