const CONTRACT_ADDRESS =
    "0x015295FA302e30e6eA3A115b4258bDc54fc7aF37";


const CONTRACT_ABI = [

    "function buyPetFood() public payable",

    "function getMyFood() public view returns (uint256)",

    "function foodPrice() public view returns (uint256)"

];


let provider = null;
let signer = null;
let contract = null;
let walletAddress = null;


const connectButton =
    document.getElementById("connectWallet");

const startGameButton =
    document.getElementById("startGameButton");

const walletStatus =
    document.getElementById("walletStatus");

const petSelection =
    document.getElementById("petSelection");

const closePetSelection =
    document.getElementById("closePetSelection");

const petOptions =
    document.querySelectorAll(".pet-option");

const confirmPet =
    document.getElementById("confirmPet");

const petNameInput =
    document.getElementById("petNameInput");


let selectedPet = null;


// ===============================
// CONNECT WALLET
// ===============================

connectButton.addEventListener(
    "click",
    async function () {

        if (typeof window.ethereum === "undefined") {

            alert(
                "กรุณาติดตั้ง MetaMask ก่อนค่ะ 🦊"
            );

            return;
        }


        try {

            await window.ethereum.request({
                method: "eth_requestAccounts"
            });


            provider =
                new ethers.BrowserProvider(
                    window.ethereum
                );


            signer =
                await provider.getSigner();


            contract =
                new ethers.Contract(
                    CONTRACT_ADDRESS,
                    CONTRACT_ABI,
                    signer
                );


            walletAddress =
                await signer.getAddress();


            const network =
                await provider.getNetwork();


            // BNB Testnet = Chain ID 97

            if (network.chainId !== 97n) {

                walletStatus.textContent =
                    "⚠️ กรุณาเปลี่ยนเป็น BNB Smart Chain Testnet";

                alert(
                    "กรุณาเปลี่ยน Network ใน MetaMask เป็น BNB Smart Chain Testnet ก่อนค่ะ"
                );

                startGameButton.disabled = true;

                return;
            }


            const shortAddress =
                walletAddress.substring(0, 6) +
                "..." +
                walletAddress.substring(
                    walletAddress.length - 4
                );


            connectButton.textContent =
                "✓ " + shortAddress;


            startGameButton.disabled =
                false;


            walletStatus.textContent =
                "เชื่อมต่อ Wallet สำเร็จ 🎉";


            localStorage.setItem(
                "petoraWallet",
                walletAddress
            );


            alert(
                "เชื่อมต่อ MetaMask สำเร็จแล้วค่ะ 🎉"
            );

        } catch (error) {

            console.error(
                "Wallet Error:",
                error
            );

            walletStatus.textContent =
                "❌ ไม่สามารถเชื่อมต่อ Wallet ได้";

            alert(
                "เกิดข้อผิดพลาดในการเชื่อมต่อ MetaMask"
            );
        }
    }
);


// ===============================
// START GAME
// ===============================

startGameButton.addEventListener(
    "click",
    function () {

        if (!walletAddress) {

            alert(
                "กรุณา Connect Wallet ก่อนค่ะ 💗"
            );

            return;
        }


        petSelection.classList.add(
            "show"
        );
    }
);


// ===============================
// SELECT PET
// ===============================

petOptions.forEach(
    function (option) {

        option.addEventListener(
            "click",
            function () {

                petOptions.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );
                    }
                );


                option.classList.add(
                    "selected"
                );


                selectedPet =
                    option.dataset.pet;


                confirmPet.disabled =
                    false;
            }
        );
    }
);


// ===============================
// CLOSE PET SELECT
// ===============================

closePetSelection.addEventListener(
    "click",
    function () {

        petSelection.classList.remove(
            "show"
        );
    }
);


// ===============================
// CONFIRM PET
// ===============================

confirmPet.addEventListener(
    "click",
    function () {

        if (!selectedPet) {

            alert(
                "กรุณาเลือกสัตว์เลี้ยงก่อนค่ะ 🐾"
            );

            return;
        }


        const petName =
            petNameInput.value.trim();


        if (!petName) {

            alert(
                "กรุณาตั้งชื่อสัตว์เลี้ยงก่อนค่ะ 💗"
            );

            petNameInput.focus();

            return;
        }


        // Save pet

        localStorage.setItem(
            "petoraPet",
            selectedPet
        );


        // Save name

        localStorage.setItem(
            "petoraPetName",
            petName
        );


        // Reset stats สำหรับสัตว์ตัวใหม่

        localStorage.setItem(
            "petoraStats",
            JSON.stringify({
                level: 1,
                exp: 0,
                happiness: 0,
                energy: 100,
                hunger: 0,
                food: 0
            })
        );


        window.location.href =
            "game.html";
    }
);


// ===============================
// METAMASK ACCOUNT CHANGE
// ===============================

if (typeof window.ethereum !== "undefined") {

    window.ethereum.on(
        "accountsChanged",
        function () {

            location.reload();

        }
    );
}