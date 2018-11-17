const shellExec = require('shell-exec')

const exec = async (command) => {
    return await shellExec(`../../wizblnode/wizbltempcoin-cli -testnet ${command}`).stdout
}

class WizblApi {
    constructor(){
        this.init()
    }

    async init(){
        await shellExec('../../wizblnode/wizbltempcoind -testnet -daemon')
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
