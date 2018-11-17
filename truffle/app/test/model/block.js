'use strict';

// import MerkleTools from 'merkle-tools';
import SparseMerkle from '../lib/SparseMerkle';
import PatriciaMerkle from '../lib/ParticiaMerkle';
import { PlasmaTransaction } from './tx';
import RLP from 'rlp';
import ethUtil from 'ethereumjs-util';
const BN = ethUtil.BN;
class Block {
  constructor (data) {
    if (Buffer.isBuffer(data)) {
      let decodedData = RLP.decode(data);
      this.blockNumber = decodedData && decodedData[0];
      this.merkleRootHash = decodedData && decodedData[1];
      this.transactions = decodedData && decodedData[2];
    } else if (data && typeof data === 'object') {
      this.blockNumber = data.blockNumber;
      this.transactions = data.transactions || [];
      
      let leaves = this.transactions.map(tx => {
      
        let key = new BN(tx.token_id, 16).toString(10);
  
        return { key, hash: tx.getHash(false) };
      });

      this.merkle = new PatriciaMerkle(leaves);
      this.merkle.buildTree();
      this.merkleRootHash = this.merkle.getMerkleRoot();
    }
  }

  getRlp() {
    if (this._rlp) {
      return this._rlp;
    }
    let transactions = this.transactions;
    if (transactions[0] && transactions[0] instanceof PlasmaTransaction) {
      transactions = transactions.map(tx => tx.getRaw());
    }

    this._rlp = RLP.encode([this.blockNumber, this.merkleRootHash, transactions]);
    return this._rlp;
  }

  toJson() {
    let data = [
      this.blockNumber,
      this.merkleRootHash,
      this.transactions
    ];

    return ethUtil.baToJSON(data);
  }

  getJson() {
    let data = {
      blockNumber: ethUtil.bufferToInt(this.blockNumber.toString()),
      merkleRootHash: this.merkleRootHash.toString('hex'),
      transactions: []
    };

    for (let txRlp of this.transactions) {
      let tx = new PlasmaTransaction(txRlp);
      data.transactions.push(tx.getJson());
    }
    return data;
  }
}

module.exports = Block;
