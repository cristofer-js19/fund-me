import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai"

async function deployFundMeFixture() {
    const decimals = 18;
    const ethToUsd = 2603;
    const initialAnswer = ethToUsd * 10 ** 8;
    const minimalValue = ethers.parseEther('0.0020');
    const notMinimalValue = ethers.parseEther('0.0015');
    const contractValidityInDays = 7;

    const MockV3AggregatorTest = await ethers.getContractFactory('MockV3AggregatorTest');
    const mockV3AggregatorTest = await MockV3AggregatorTest.deploy(decimals, initialAnswer);

    await mockV3AggregatorTest.waitForDeployment()

    const FundMe = await ethers.getContractFactory("FundMe")
    const fundMe = await FundMe.deploy(mockV3AggregatorTest.target, contractValidityInDays);

    await fundMe.waitForDeployment()

    const [owner, funder1, ...accounts] = await ethers.getSigners()

    return {
        mockV3AggregatorTest,
        fundMe,
        owner,
        funder1,
        accounts,
        minimalValue,
        notMinimalValue,
        contractValidityInDays
    }
}

describe("FundMe", () => {
    describe('Deployment', () => {
        it('Deve atribuir o endereço ao agregador de preços', async () => {
            const { fundMe, mockV3AggregatorTest } = await loadFixture(deployFundMeFixture);
            expect(await fundMe.getPriceFeed()).to.equal(mockV3AggregatorTest.target)
        });
        it("Deve definir o proprietário como a pessoa que faz o deploy", async function () {
            const { fundMe, owner } = await loadFixture(deployFundMeFixture);
            expect(await fundMe.owner()).to.equal(owner.address)
        });
    });
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe("Fund", function () {
        it("Deve registrar o valor correto quando alguém envia fundos", async function () {
            const { fundMe, funder1, minimalValue, owner } = await loadFixture(deployFundMeFixture);
            await fundMe.connect(funder1).fund({ value: minimalValue })
            expect(await fundMe.getAmountFundedPerAddress(funder1.address)).to.equal(minimalValue)

        });

        it("Deve emitir um evento de funding", async function () {
            const { fundMe, funder1, owner, minimalValue } = await loadFixture(deployFundMeFixture);
            await expect(fundMe.connect(funder1).fund({ value: minimalValue }))
                .to.emit(fundMe, "Funde").withArgs(funder1.address, owner.address, minimalValue)
        });

        it("Deve falhar se o valor enviado for menor que o mínimo exigido", async function () {
            const { fundMe, funder1, notMinimalValue } = await loadFixture(deployFundMeFixture);
            await expect(fundMe.connect(funder1).fund({ value: notMinimalValue }))
                .to.revertedWithCustomError(fundMe, "EtherNotEnough");
        });

        it("Deve falhar se a operação de funding estiver fora do prazo permitido", async function() {
            const { fundMe, funder1, minimalValue, contractValidityInDays } = await loadFixture(deployFundMeFixture);
            await ethers.provider.send("evm_increaseTime", [(contractValidityInDays * 86400) + 1]);
            await ethers.provider.send("evm_mine", []);

            await expect(fundMe.connect(funder1).fund({ value: minimalValue })).
                to.revertedWithCustomError(fundMe, "InvalidDateForFunding");
        });
    });
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe("Withdraw", function () {
        it("Deve permitir que apenas o proprietário faça a retirada", async function () {
            const { fundMe, funder1 } = await loadFixture(deployFundMeFixture);
            await expect(fundMe.connect(funder1)
                .withdraw()).
                to.
                revertedWithCustomError(fundMe, "OwnableUnauthorizedAccount")
                .withArgs(funder1.address)
        });

        it("Deve permitir retirada correta dos fundos", async function () {
            await executeWithdrawTest(false);
        });
    });
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe("CheaperWithdraw", function () {
        it("Deve realizar retirada mais barata corretamente", async function () {
            await executeWithdrawTest(true);
        });
    });

    async function executeWithdrawTest(cheaperWithdraw: boolean) {
        const { fundMe, funder1, owner } = await loadFixture(deployFundMeFixture);

        await fundMe.connect(funder1).fund({ value: ethers.parseEther("1") })

        const initialContractBalance = await ethers.provider.getBalance(fundMe.target);
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

        const withdrawTx = (cheaperWithdraw) ? await fundMe.cheaperWithdraw() : await fundMe.withdraw();
        const receipt = await withdrawTx.wait()

        const gasUsed = receipt?.gasUsed as bigint
        const gasprice = receipt?.gasPrice as bigint
        const gasAmount = gasUsed * gasprice;

        const beforeContractBalance = await ethers.provider.getBalance(fundMe.target);
        const beforeOwnerBalance = await ethers.provider.getBalance(owner.address);

        expect(beforeContractBalance).to.equal(0);
        expect(beforeOwnerBalance).to.equal((initialContractBalance + initialOwnerBalance) - gasAmount);
    }
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe("getAmountFundedPerAddress", function () {
        it("Deve retornar o valor correto financiado por um endereço", async function () {
            const { fundMe, funder1 } = await loadFixture(deployFundMeFixture);
            await fundMe.connect(funder1).fund({ value: ethers.parseEther("1") });
            await fundMe.connect(funder1).fund({ value: ethers.parseEther("1") });
            expect (await fundMe.getAmountFundedPerAddress(funder1.address)).to.equal(ethers.parseEther("2"));
        });
    });
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe("getVersion", function () {
        it("Deve retornar a versão correta do agregador", async function () {
            /**
             * According to the below link, version is equal to "0":
             * https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/tests/MockV3Aggregator.sol
             */
            const { fundMe, mockV3AggregatorTest } = await loadFixture(deployFundMeFixture);
            expect (await fundMe.getVersion()).to.equal(await mockV3AggregatorTest.version())
        });
    });
    /**
     * The student must implement - remove skip to implement unit tests
     */
    describe("getFunder", function () {
        it("Deve retornar o financiador correto", async function () {
            const { fundMe, funder1 } = await loadFixture(deployFundMeFixture);
            await fundMe.connect(funder1).fund({ value: ethers.parseEther("1") });
            expect (await fundMe.getFunder(0)).to.equal(funder1.address);
        });
    });
})