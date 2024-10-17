import { ethers } from "hardhat";
import { loadFixture, } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai"

async function deployFundMeFixture() {
    const decimals = 18;
    const ethToUsd = 2603;
    const fiveUsdInEth = ethers.parseEther('0.0019');
    const fourUsdInEth = ethers.parseEther('0.0015');
    const initialAnswer = ethToUsd * 10 ** 8;

    const MockV3AggregatorTest = await ethers.getContractFactory('MockV3AggregatorTest')
    const mockV3AggregatorTest = await MockV3AggregatorTest.deploy(decimals, initialAnswer);

    const FundMe = await ethers.getContractFactory("FundMe")
    const fundMe = await FundMe.deploy(mockV3AggregatorTest.target)

    const [owner, addr1, ...accounts] = await ethers.getSigners()

    return {
        mockV3AggregatorTest,
        fundMe,
        owner,
        addr1,
        accounts
    }
}

describe("FundMe", () => {
    describe('Deployment', () => {
        it('Deve atribuir o endereço ao agregador de preços', async () => {
            const { fundMe, mockV3AggregatorTest } = await loadFixture(deployFundMeFixture);
            expect.fail("It will be implemented in the class")
        });
        it("Deve definir o proprietário como a pessoa que faz o deploy", async function () {
            const { fundMe } = await loadFixture(deployFundMeFixture);
            expect.fail("It will be implemented in the class")
        });
    });

    describe("Fund", function () {
        it("Deve registrar o valor correto quando alguém envia fundos", async function () {
            const { fundMe, addr1 } = await loadFixture(deployFundMeFixture);
            expect.fail("It will be implemented in the class")
        });

        it("Deve emitir um evento de funding", async function () {
            const { fundMe, addr1 } = await loadFixture(deployFundMeFixture);
            expect.fail("It will be implemented in the class")
        });

        it("Deve falhar se o valor enviado for menor que o mínimo exigido", async function () {
            const { fundMe, addr1 } = await loadFixture(deployFundMeFixture);
            expect.fail("It will be implemented in the class")
        });
    });

    describe("Withdraw", function () {
        it("Deve permitir que apenas o proprietário faça a retirada", async function () {
            const { fundMe, owner, addr1 } = await loadFixture(deployFundMeFixture);
            expect.fail("It will be implemented in the class")
        });

        it("Deve permitir retirada correta dos fundos", async function () {
            const { fundMe, owner } = await loadFixture(deployFundMeFixture);
            expect.fail("The student must implement")
        });
    });
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe.skip("CheaperWithdraw", function () {
        it("Deve realizar retirada mais barata corretamente", async function () {
            const { fundMe, owner } = await loadFixture(deployFundMeFixture);
            expect.fail("The student must implement")
        });
    });
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe.skip("getAmountFundedPerAddress", function () {
        it("Deve retornar o valor correto financiado por um endereço", async function () {
            const { fundMe, addr1 } = await loadFixture(deployFundMeFixture);
            expect.fail("It will be implemented in the class")
        });
    });
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe.skip("getVersion", function () {
        it("Deve retornar a versão correta do agregador", async function () {
            const { fundMe, mockV3AggregatorTest } = await loadFixture(deployFundMeFixture);
            expect.fail("The student must implement")
        });
    });
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe("getFunder", function () {
        it("Deve retornar o financiador correto", async function () {
            const { fundMe, addr1 } = await loadFixture(deployFundMeFixture);
            expect.fail("It will be implemented in the class")
        });
    });
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe("getPriceFeed", function () {
        it("Deve retornar o endereço correto do agregador de preços", async function () {
            const { fundMe, mockV3AggregatorTest } = await loadFixture(deployFundMeFixture);
            expect.fail("The student must implement")
        });
    });
})