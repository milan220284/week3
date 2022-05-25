//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const chai = require("chai");
const path = require("path");
const { buildPoseidon } = require('circomlibjs');


const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
const { expect } = require("chai");
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Number Mastermind 4/6 test", function () {
    this.timeout(100000000);

    it("Shoud correctly compute all matched values", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        
        const poseidon = await buildPoseidon();
        const solution = [0, 1, 2, 3];
        const guess = [0, 1, 2, 3];
        const hits = 4;
        const blows = 0;

        const privSalt = 0;
        const pubSolnHash = poseidon.F.toString((poseidon([0, 0, 1, 2, 3])));

        const data = {
            pubGuessA: guess[0],
            pubGuessB: guess[1],
            pubGuessC: guess[2],
            pubGuessD: guess[3],
            pubNumHit: hits,
            pubNumBlow: blows,
            pubSolnHash,
            privSolnA: solution[0],
            privSolnB: solution[1],
            privSolnC: solution[2],
            privSolnD: solution[3],
            privSalt,
        }

        const witness = await circuit.calculateWitness(data, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(pubSolnHash)));

    });

    it("Shoud correctly compute 2 matched values and 2 right values but on wrong position", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        
        const poseidon = await buildPoseidon();
        const solution = [0, 1, 2, 3];
        const guess = [1, 0, 2, 3];
        const hits = 2;
        const blows = 2;

        const privSalt = 0;
        const pubSolnHash = poseidon.F.toString((poseidon([0, 0, 1, 2, 3])));

        const data = {
            pubGuessA: guess[0],
            pubGuessB: guess[1],
            pubGuessC: guess[2],
            pubGuessD: guess[3],
            pubNumHit: hits,
            pubNumBlow: blows,
            pubSolnHash,
            privSolnA: solution[0],
            privSolnB: solution[1],
            privSolnC: solution[2],
            privSolnD: solution[3],
            privSalt,
        }

        const witness = await circuit.calculateWitness(data, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(pubSolnHash)));

    });

    it("Shoud correctly compute 2 matched values", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        
        const poseidon = await buildPoseidon();
        const solution = [0, 1, 2, 3];
        const guess = [5, 4, 2, 3];
        const hits = 2;
        const blows = 0;

        const privSalt = 0;
        const pubSolnHash = poseidon.F.toString((poseidon([0, 0, 1, 2, 3])));

        const data = {
            pubGuessA: guess[0],
            pubGuessB: guess[1],
            pubGuessC: guess[2],
            pubGuessD: guess[3],
            pubNumHit: hits,
            pubNumBlow: blows,
            pubSolnHash,
            privSolnA: solution[0],
            privSolnB: solution[1],
            privSolnC: solution[2],
            privSolnD: solution[3],
            privSalt,
        }

        const witness = await circuit.calculateWitness(data, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(pubSolnHash)));

    });

    it("Shoud fail for inavlid solution", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        
        const poseidon = await buildPoseidon();
        const solution = [0, 0, 0, 0];
        const guess = [1, 0, 2, 3];
        const hits = 2;
        const blows = 2;

        const privSalt = 0;
        const pubSolnHash = poseidon.F.toString((poseidon([0, 0, 0, 2, 3])));

        const data = {
            pubGuessA: guess[0],
            pubGuessB: guess[1],
            pubGuessC: guess[2],
            pubGuessD: guess[3],
            pubNumHit: hits,
            pubNumBlow: blows,
            pubSolnHash,
            privSolnA: solution[0],
            privSolnB: solution[1],
            privSolnC: solution[2],
            privSolnD: solution[3],
            privSalt,
        }

        const witness = await circuit.calculateWitness(data, true);

        expect(witness).toBe(false);

    });



});