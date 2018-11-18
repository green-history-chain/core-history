const shellExec = require('shell-exec')

const exec = async (command) => {
    let cmd ='sudo '+__dirname+`/wizbltempcoin-cli -testnet ${command}`
    // console.log(cmd);?
    
    let answer = await shellExec(cmd)
    // console.log('ANSWER', answer);
    return answer
}

class WizblApi {
    constructor(){
      //  this.init()
    }

    async init(){
        await shellExec('sudo '+__dirname+'/wizbltempcoind -testnet -daemon')
        return await exec('setaccount TwTpdpu23kKvZtHN3zW8tj7frgETYFLUPv2ruv denishetman1@gmail.com')
    }

    async commands(command){
        return await exec(command)
    }

    async getbestblockhash(){
        return await exec('getbestblockhash')
    }

    async stop(){
        return await exec('stop')
    }
}

wizblApi = new WizblApi()

module.exports = wizblApi
