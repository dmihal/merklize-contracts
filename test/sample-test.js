const { expect } = require("chai");
const { keccakFromString, bufferToHex } = require('ethereumjs-util');
const { MerkleTree } = require('../src/merkleTree');

describe('MerkleProof', function () {
  describe('verify', function () {
    it('returns true for a valid Merkle proof', async function () {
      const MerkleProofWrapper = await ethers.getContractFactory('MerkleProofWrapper');
      const merkleProof = await MerkleProofWrapper.deploy();

      const elements = ['a', 'b', 'c', 'd'];
      const merkleTree = new MerkleTree(elements);

      const root = merkleTree.getHexRoot();

      const proof = merkleTree.getHexProof(elements[0]);

      const leaf = bufferToHex(keccakFromString(elements[0]));

      expect(await merkleProof.verify(proof, root, leaf)).to.equal(true);
    });

    it('returns false for an invalid Merkle proof', async function () {
      const MerkleProofWrapper = await ethers.getContractFactory('MerkleProofWrapper');
      const merkleProof = await MerkleProofWrapper.deploy();

      const correctElements = ['a', 'b', 'c'];
      const correctMerkleTree = new MerkleTree(correctElements);

      const correctRoot = correctMerkleTree.getHexRoot();

      const correctLeaf = bufferToHex(keccakFromString(correctElements[0]));

      const badElements = ['d', 'e', 'f'];
      const badMerkleTree = new MerkleTree(badElements);

      const badProof = badMerkleTree.getHexProof(badElements[0]);

      expect(await merkleProof.verify(badProof, correctRoot, correctLeaf)).to.equal(false);
    });

    it('returns false for a Merkle proof of invalid length', async function () {
      const MerkleProofWrapper = await ethers.getContractFactory('MerkleProofWrapper');
      const merkleProof = await MerkleProofWrapper.deploy();

      const elements = ['a', 'b', 'c'];
      const merkleTree = new MerkleTree(elements);

      const root = merkleTree.getHexRoot();

      const proof = merkleTree.getHexProof(elements[0]);
      const badProof = proof.slice(0, proof.length - 5);

      const leaf = bufferToHex(keccakFromString(elements[0]));

      expect(await merkleProof.verify(badProof, root, leaf)).to.equal(false);
    });
  });
});