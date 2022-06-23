// We import Chai to use its asserting functions here.
const { expect } = require("chai");

describe("Plarform contract", function () {
  let Platform;
  let hardhatPlatform;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Platform = await ethers.getContractFactory("Platform");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatPlatform = await Platform.deploy();
    const addProject = await hardhatPlatform
      .connect(addr1)
      .addProject({
        title: "Hola, mundo!",
        description: "Test description",
        projectType: "0",
        reward: "100"
      }, {
        value: 101,
      });
    await addProject.wait();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    it("Should add project", async function () {
      const addProject = await hardhatPlatform
        .connect(addr1)
        .addProject({
          title: "Hola, mundo!",
          description: "Test description",
          projectType: 0,
          reward: 100
        }, {
          value: 101,
        });
      await addProject.wait();
      const getAllProjects = await hardhatPlatform.getAllProjects();
      expect(await getAllProjects.length).to.equal(2);
    });

    it("Cannot add project with invalid amount", async function () {
      await expect(
        hardhatPlatform
          .connect(addr1)
          .addProject({
            title: "Hola, mundo!",
            description: "Test description",
            projectType: 0,
            reward: 100
          }, {
            value: 100,
          })
      ).to.be.revertedWith("Wrong amount submitted");
    });

    it("Should get project", async function () {
      const getProject = await hardhatPlatform.getProject(0);
      expect(await getProject.title).to.equal("Hola, mundo!");
      expect(await getProject.description).to.equal("Test description");
    });

    it("Should apply for project", async function () {
      const applyForProject = await hardhatPlatform
        .connect(addr2)
        .applyForProject(0);
      await applyForProject.wait();
      const getProject = await hardhatPlatform.getProject(0);
      expect(await getProject.assignee).to.equal(addr2.address);
    });

    it("Cannot assign project if address didn't apply", async function () {
      const addProject = await hardhatPlatform
        .connect(addr1)
        .addProject({
          title: "Hola, mundo!",
          description: "Test description",
          projectType: 1,
          reward: 100
        }, {
          value: 101,
        });
      await addProject.wait();
      await expect(
        hardhatPlatform.connect(addr1).assignProject(1, addr2.address)
      ).to.be.revertedWith("Address didn't apply to the project.");
    });

    it("Should assign project", async function () {
      const addProject = await hardhatPlatform
        .connect(addr1)
        .addProject({
          title: "Hola, mundo!",
          description: "Test description",
          projectType: 1,
          reward: 100
        }, {
          value: 101,
        });
      await addProject.wait();
      await hardhatPlatform.connect(addr2).applyForProject(1);
      const assignProject = await hardhatPlatform
        .connect(addr1)
        .assignProject(1, addr2.address);
      await assignProject.wait();
      const getProject = await hardhatPlatform.getProject(1);
      expect(await getProject.assignee).to.equal(addr2.address);
    });

    it("Cannot unassign not assigned project", async function () {
      await expect(
        hardhatPlatform.connect(addr1).unassignProject(0)
      ).to.be.revertedWith("Project is not assigned yet");
    });

    it("Should unassign project", async function () {
      const addProject = await hardhatPlatform
        .connect(addr1)
        .addProject({
          title: "Hola, mundo!",
          description: "Test description",
          projectType: 1,
          reward: 100
        }, {
          value: 101,
        });
      await addProject.wait();
      await hardhatPlatform.connect(addr2).applyForProject(1);
      const assignProject = await hardhatPlatform
        .connect(addr1)
        .assignProject(1, addr2.address);
      await assignProject.wait();
      await hardhatPlatform.connect(addr1).unassignProject(1);
      const getProject = await hardhatPlatform.getProject(1);
      expect(await getProject.assignee).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("Should submit result", async function () {
      const applyForProject = await hardhatPlatform
        .connect(addr2)
        .applyForProject(0);
      await applyForProject.wait();
      await hardhatPlatform.connect(addr2).submitResult(0, "result");
      const getProject = await hardhatPlatform.getProject(0);
      expect(await getProject.result).to.equal("result");
    });

    it("Should complete project", async function () {
      const applyForProject = await hardhatPlatform
        .connect(addr2)
        .applyForProject(0);
      await applyForProject.wait();
      await hardhatPlatform.connect(addr2).submitResult(0, "result");
      await hardhatPlatform.connect(addr1).completeProject(0, 5);
      const getProject = await hardhatPlatform.getProject(0);
      expect(await getProject.completedAt).to.be.above(0);
      expect(await hardhatPlatform.getRating(addr2.address)).to.equal(5);
    });

    it("Should delete project", async function () {
      const addProject = await hardhatPlatform
        .connect(addr1)
        .addProject({
          title: "Hola, mundo!",
          description: "Test description",
          projectType: 0,
          reward: 100
        }, {
          value: 101,
        });
      await addProject.wait();
      await hardhatPlatform.connect(addr1).deleteProject(1);
      const getAllProjects = await hardhatPlatform.getAllProjects();
      expect(await getAllProjects.length).to.equal(1);
      await expect(hardhatPlatform.getProject(1)).to.be.revertedWith(
        "Project does not exist"
      );
    });

    it("Should withdraw", async function () {
      expect(await hardhatPlatform.totalFees()).to.equal(1);
      await hardhatPlatform.withdrawFees();
      expect(await hardhatPlatform.totalFees()).to.equal(0);
    });

    it("Should set the right owner", async function () {
      expect(await hardhatPlatform.owner()).to.equal(owner.address);
    });

    it("Should get platform fee", async function () {
      expect(await hardhatPlatform.platformFeePercentage()).to.equal(1);
    });

    it("Should set the right fee", async function () {
      await hardhatPlatform.setPlatformFee(2);
      expect(await hardhatPlatform.platformFeePercentage()).to.equal(2);
    });



    //   it("Should assign the total supply of tokens to the owner", async function () {
    //     const ownerBalance = await hardhatToken.balanceOf(owner.address);
    //     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    //   });
    // });

    // describe("Transactions", function () {
    //   it("Should transfer tokens between accounts", async function () {
    //     // Transfer 50 tokens from owner to addr1
    //     await hardhatToken.transfer(addr1.address, 50);
    //     const addr1Balance = await hardhatToken.balanceOf(addr1.address);
    //     expect(addr1Balance).to.equal(50);

    //     // Transfer 50 tokens from addr1 to addr2
    //     // We use .connect(signer) to send a transaction from another account
    //     await hardhatToken.connect(addr1).transfer(addr2.address, 50);
    //     const addr2Balance = await hardhatToken.balanceOf(addr2.address);
    //     expect(addr2Balance).to.equal(50);
    //   });

    //   it("Should fail if sender doesn’t have enough tokens", async function () {
    //     const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    //     // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
    //     // `require` will evaluate false and revert the transaction.
    //     await expect(
    //       hardhatToken.connect(addr1).transfer(owner.address, 1)
    //     ).to.be.revertedWith("Not enough tokens");

    //     // Owner balance shouldn't have changed.
    //     expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //       initialOwnerBalance
    //     );
    //   });

    //   it("Should update balances after transfers", async function () {
    //     const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    //     // Transfer 100 tokens from owner to addr1.
    //     await hardhatToken.transfer(addr1.address, 100);

    //     // Transfer another 50 tokens from owner to addr2.
    //     await hardhatToken.transfer(addr2.address, 50);

    //     // Check balances.
    //     const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
    //     expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

    //     const addr1Balance = await hardhatToken.balanceOf(addr1.address);
    //     expect(addr1Balance).to.equal(100);

    //     const addr2Balance = await hardhatToken.balanceOf(addr2.address);
    //     expect(addr2Balance).to.equal(50);
    //   });
  });
});
