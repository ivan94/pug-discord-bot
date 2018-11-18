import {assert} from "chai";
import Rank from "../commands/Rank";
import { buildArgs } from "../lib/CommandManager";


describe("Rank Command", function() {
    describe("#buildUrl", function() {
        it("should return a profile url based on a url", function() {
            var command = new Rank();
            assert.equal(command.buildUrl("https://playoverwatch.com/pt-br/career/pc/Ivanovikjch-1637"), "https://playoverwatch.com/pt-br/career/pc/Ivanovikjch-1637");
        });

        it("should return a profile url based on a battle tag", function () {
            var command = new Rank();
            assert.equal(command.buildUrl("Ivanovikjch#1637"), "https://playoverwatch.com/en-us/career/pc/Ivanovikjch-1637");
        })

        it("should return a profile url based on a psn id", function () {
            var command = new Rank();
            assert.equal(command.buildUrl("edu0582#psn"), "https://playoverwatch.com/en-us/career/psn/edu0582");
        })
    });
});

describe("Command Manager", function() {
    describe("#buildArgs", function() {
        it("should return empty args", function() {
            assert.equal(buildArgs("!rank").length, 0);
        });
        it("should return empty args while joining args", function () {
            assert.equal(buildArgs("!rank", true).length, 0);
        })
    });
});