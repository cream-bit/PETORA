// ======================================================
// PETORA GAME.JS
// ======================================================


// ================= CONTRACT =================

const CONTRACT_ADDRESS =
    "0x5857a3612679c334d7DEA59e155b521221C21475";

const CONTRACT_ABI = [

    "function buyItem(uint256 itemId) payable",

    "function getMyItem(uint256 itemId) view returns (uint256)",

    "function getItemPrice(uint256 itemId) view returns (uint256)"

];


// ================= BLOCKCHAIN =================

let provider = null;

let signer = null;

let contract = null;

let currentAccount = null;


// ================= PET =================

let pet =
    localStorage.getItem("petoraPet") || "cat";

let petName =
    localStorage.getItem("petoraPetName") || "Mochi";


// ================= STATS =================

let stats =
    JSON.parse(
        localStorage.getItem("petoraStats")
    ) || {

        level: 1,

        exp: 0,

        happiness: 0,

        energy: 100,

        hunger: 0,

        food: 0

    };


// ================= INVENTORY =================

// เก็บเฉพาะจำนวนของที่มีอยู่จริงใน Inventory

let inventory =
    JSON.parse(
        localStorage.getItem("petoraInventory")
    ) || {

        0: 0,

        1: 0,

        2: 0,

        3: 0,

        4: 0,

        5: 0

    };


// ================= SHOP ITEMS =================

const SHOP_ITEMS = [

    {
        id: 0,
        name: "Meat Snack",
        icon: "🍖",
        price: "0.01"
    },

    {
        id: 1,
        name: "Milk Bottle",
        icon: "🥛",
        price: "0.01"
    },

    {
        id: 2,
        name: "Pet Cookie",
        icon: "🍪",
        price: "0.01"
    },

    {
        id: 3,
        name: "Fish Treat",
        icon: "🐟",
        price: "0.02"
    },

    {
        id: 4,
        name: "Cute Cupcake",
        icon: "🧁",
        price: "0.02"
    },

    {
        id: 5,
        name: "Pet Cake",
        icon: "🍰",
        price: "0.03"
    }

];


// ======================================================
// SAVE
// ======================================================

function saveStats() {

    localStorage.setItem(
        "petoraStats",
        JSON.stringify(stats)
    );

}


function saveInventory() {

    localStorage.setItem(
        "petoraInventory",
        JSON.stringify(inventory)
    );

}


// ======================================================
// PET IMAGE
// ======================================================

function getPetImage() {

    const petImages = {

        cat: "cat.png",

        dog: "dog.png",

        rabbit: "rabbit.png"

    };

    return petImages[pet] || "cat.png";

}


// ======================================================
// LOAD PET
// ======================================================

function loadPet() {

    const image =
        getPetImage();


    const petImage =
        document.getElementById("petImage");


    const petPageImage =
        document.getElementById("petPageImage");


    if (petImage) {

        petImage.src =
            image;

    }


    if (petPageImage) {

        petPageImage.src =
            image;

    }


    const petNameElement =
        document.getElementById("petName");


    const topPetName =
        document.getElementById("topPetName");


    const petPageName =
        document.getElementById("petPageName");


    if (petNameElement) {

        petNameElement.textContent =
            petName;

    }


    if (topPetName) {

        topPetName.textContent =
            petName;

    }


    if (petPageName) {

        petPageName.textContent =
            petName;

    }


    // ================= PET TYPE =================

    const petType =
        document.getElementById("petType");


    const petPageType =
        document.getElementById("petPageType");


    const petTypes = {

        cat: "Your Digital Cat",

        dog: "Your Digital Dog",

        rabbit: "Your Digital Rabbit"

    };


    const currentPetType =
        petTypes[pet] || "Your Digital Cat";


    if (petType) {

        petType.textContent =
            currentPetType;

    }


    if (petPageType) {

        petPageType.textContent =
            currentPetType;

    }

}


// ======================================================
// PET MOOD
// ======================================================

function updatePetMood() {

    const petElement =
        document.querySelector(".pet-interactive");

    const petEmoji =
        document.getElementById("petEmoji");


    if (!petElement) {
        return;
    }


    // ลบอารมณ์เดิม
    petElement.classList.remove(
        "mood-normal",
        "mood-happy",
        "mood-excited",
        "mood-hungry",
        "mood-tired"
    );


    // =========================
    // เลือกอารมณ์
    // =========================

    let currentMood = "mood-normal";


    if (stats.energy <= 20) {

        currentMood = "mood-tired";

    }

    else if (stats.hunger >= 70) {

        currentMood = "mood-hungry";

    }

    else if (stats.happiness >= 80) {

        currentMood = "mood-excited";

    }

    else if (stats.happiness >= 50) {

        currentMood = "mood-happy";

    }


    // ใส่ Class อารมณ์
    petElement.classList.add(currentMood);


    // =========================
    // Emoji ตามอารมณ์
    // =========================

    const moodEmojis = {

        "mood-normal": "🙂",

        "mood-happy": "😊",

        "mood-excited": "🤩",

        "mood-hungry": "🍖",

        "mood-tired": "😴"

    };


    if (petEmoji) {

        petEmoji.textContent =
            moodEmojis[currentMood] || "🙂";

        petEmoji.classList.add("show");

    }

}
// ======================================================
// REQUIRED EXP
// ======================================================

function getRequiredExp() {

    return 100 + ((stats.level - 1) * 50);

}

// ======================================================
// UPDATE PET UI
// ======================================================

function updatePetUI() {


    // LEVEL

    document.querySelectorAll(
        ".level-number"
    ).forEach(element => {

        element.textContent =
            stats.level;

    });


    const petPageLevel =
        document.getElementById(
            "petPageLevel"
        );


    if (petPageLevel) {

        petPageLevel.textContent =
            stats.level;

    }


    // EXP

    const requiredExp =
        getRequiredExp();


    const expText =
        document.querySelector(
            ".exp-text"
        );

    if (expText) {

        expText.textContent =
            `${stats.exp}/${requiredExp} EXP`;

    }


    const petPageExp =
        document.getElementById(
            "petPageExp"
        );

    if (petPageExp) {

        petPageExp.textContent =
            `${stats.exp} / ${requiredExp}`;

    }


    document.querySelectorAll(
        ".exp-fill"
    ).forEach(element => {

        const expPercent =
            (stats.exp / requiredExp) * 100;

        element.style.width =
            `${Math.min(expPercent, 100)}%`;

    });


    // HAPPINESS

    document.querySelectorAll(
        ".happiness-value"
    ).forEach(element => {

        element.textContent =
            `${stats.happiness}%`;

    });


    const petPageHappiness =
        document.getElementById(
            "petPageHappiness"
        );


    if (petPageHappiness) {

        petPageHappiness.textContent =
            `${stats.happiness}%`;

    }


    document.querySelectorAll(
        ".happiness-fill"
    ).forEach(element => {

        element.style.width =
            `${stats.happiness}%`;

    });


    // ENERGY

    document.querySelectorAll(
        ".energy-value"
    ).forEach(element => {

        element.textContent =
            `${stats.energy}%`;

    });


    const petPageEnergy =
        document.getElementById(
            "petPageEnergy"
        );


    if (petPageEnergy) {

        petPageEnergy.textContent =
            `${stats.energy}%`;

    }


    document.querySelectorAll(
        ".energy-fill"
    ).forEach(element => {

        element.style.width =
            `${stats.energy}%`;

    });


    // HUNGER

    document.querySelectorAll(
        ".hunger-value"
    ).forEach(element => {

        element.textContent =
            `${stats.hunger}%`;

    });


    const petPageHunger =
        document.getElementById(
            "petPageHunger"
        );


    if (petPageHunger) {

        petPageHunger.textContent =
            `${stats.hunger}%`;

    }


    document.querySelectorAll(
        ".hunger-fill"
    ).forEach(element => {

        element.style.width =
            `${stats.hunger}%`;

    });


    // FOOD

    const petPageFood =
        document.getElementById(
            "petPageFood"
        );


    if (petPageFood) {

        petPageFood.textContent =
            inventory[0] || 0;

    }


    saveStats();

    updatePetMood();

}


// ======================================================
// ADD EXP
// ======================================================

function addExp(amount) {

    stats.exp += amount;


    while (stats.exp >= getRequiredExp()) {

        const requiredExp =
            getRequiredExp();


        stats.exp -= requiredExp;

        stats.level++;


        stats.happiness =
            Math.min(
                100,
                stats.happiness + 5
            );


        alert(
            `🎉 ${petName} Level Up! Lv.${stats.level}`
        );

    }


    saveStats();

    updatePetUI();

}


// ======================================================
// FEED BUTTON
// ======================================================

function feedPet() {

    if ((inventory[0] || 0) <= 0) {

        alert("ไม่มี Meat Snack ใน Inventory 🍖");
        return;

    }

    // ใช้อาหาร 1 ชิ้น
    inventory[0]--;

    // ลดความหิว
    stats.hunger = Math.max(
        0,
        stats.hunger - 20
    );

    // เพิ่มความสุข
    stats.happiness = Math.min(
        100,
        stats.happiness + 10
    );

    // เพิ่ม EXP
    addExp(10);

    saveInventory();
    saveStats();

    updateInventoryPage();
    updateShopInventory();
    updatePetUI();

    showInventoryMessage(
        "🍖 " + petName + " กิน Meat Snack แล้ว!"
    );

}


// ======================================================
// PLAY
// ======================================================

// ======================================================
// PLAY MINI GAME - CATCH THE COINS
// ======================================================

let miniGameActive = false;
let miniGameTimer = null;
let miniGameAnimation = null;
let coinSpawnTimer = null;

let miniGameScore = 0;
let miniGameTime = 30;
let miniGamePetX = 0;
let miniGameCoins = [];


// =========================
// START MINI GAME
// =========================

function playPet() {

    if (stats.energy < 15) {

        alert("Energy ไม่เพียงพอ 💗");

        return;

    }


    // ใช้ Energy 15 เมื่อเริ่มเล่น
    stats.energy = Math.max(
        0,
        stats.energy - 15
    );

    saveStats();
    updatePetUI();


    startCoinGame();

}


// =========================
// CREATE GAME
// =========================

function startCoinGame() {

    if (miniGameActive) {
        return;
    }

    miniGameActive = true;

    miniGameScore = 0;
    miniGameTime = 30;
    miniGameCoins = [];
    miniGamePetX = 50;


    // สร้างหน้ามินิเกม
    let game = document.getElementById("coinMiniGame");

    if (!game) {

        game = document.createElement("div");

        game.id = "coinMiniGame";

        game.innerHTML = `

            <div class="coin-game-box">

                <div class="coin-game-header">

                    <div>
                        <h2>🪙 Catch the Coins!</h2>
                        <p>เลื่อนสัตว์เลี้ยงไปรับเหรียญ</p>
                    </div>

                    <button
                        class="coin-game-close"
                        id="closeCoinGame">
                        ×
                    </button>

                </div>


                <div class="coin-game-info">

                    <div>
                        🪙 Coins:
                        <strong id="coinScore">0</strong>
                    </div>

                    <div>
                        ⭐ EXP:
                        <strong id="coinExp">0</strong>
                    </div>

                    <div>
                        ⏱️ Time:
                        <strong id="coinTime">30</strong>
                    </div>

                </div>


                <div
                    class="coin-game-area"
                    id="coinGameArea">

                    <div
                        class="coin-game-pet"
                        id="coinGamePet">

                        <img
                            id="coinGamePetImage"
                            src=""
                            alt="Pet">

                    </div>

                </div>


                <div class="coin-game-controls">

                    <button
                        id="moveLeft"
                        class="move-button">
                        ◀
                    </button>

                    <span>
                        ใช้ ← → หรือปุ่มด้านล่าง
                    </span>

                    <button
                        id="moveRight"
                        class="move-button">
                        ▶
                    </button>

                </div>


                <button
                    id="exitCoinGame"
                    class="exit-game-button">
                    ออกจากเกม
                </button>

            </div>

        `;

        document.body.appendChild(game);

    }


    // รูปสัตว์ที่เลือก
    const petImage =
        miniGamePetImage();

    document.getElementById(
        "coinGamePetImage"
    ).src = petImage;


    document.getElementById(
        "coinMiniGame"
    ).classList.add("show");


    document.getElementById(
        "coinScore"
    ).textContent = "0";


    document.getElementById(
        "coinExp"
    ).textContent = "0";


    document.getElementById(
        "coinTime"
    ).textContent = "30";


    updateMiniGamePetPosition();


    // ปุ่มควบคุม
    document.getElementById(
        "moveLeft"
    ).onclick = function () {

        moveMiniGamePet(-1);

    };


    document.getElementById(
        "moveRight"
    ).onclick = function () {

        moveMiniGamePet(1);

    };


    document.getElementById(
        "exitCoinGame"
    ).onclick = function () {

        endCoinGame();

    };


    document.getElementById(
        "closeCoinGame"
    ).onclick = function () {

        endCoinGame();

    };


    // Keyboard
    document.onkeydown = function (event) {

        if (!miniGameActive) {
            return;
        }


        if (
            event.key === "ArrowLeft"
            || event.key.toLowerCase() === "a"
        ) {

            event.preventDefault();

            moveMiniGamePet(-1);

        }


        if (
            event.key === "ArrowRight"
            || event.key.toLowerCase() === "d"
        ) {

            event.preventDefault();

            moveMiniGamePet(1);

        }

    };


    // เริ่มสร้างเหรียญ
    coinSpawnTimer = setInterval(
        spawnCoin,
        850
    );


    // เวลา
    miniGameTimer = setInterval(
        function () {

            miniGameTime--;

            const timeElement =
                document.getElementById(
                    "coinTime"
                );

            if (timeElement) {

                timeElement.textContent =
                    miniGameTime;

            }


            if (miniGameTime <= 0) {

                endCoinGame();

            }

        },
        1000
    );


    // Animation
    miniGameAnimation =
        requestAnimationFrame(
            updateCoins
        );

}


// =========================
// PET IMAGE
// =========================

function miniGamePetImage() {

    if (pet === "cat") {

        return "cat.png";

    }

    if (pet === "dog") {

        return "dog.png";

    }

    return "rabbit.png";

}


// =========================
// MOVE PET
// =========================

function moveMiniGamePet(direction) {

    if (!miniGameActive) {
        return;
    }


    miniGamePetX += direction * 7;


    miniGamePetX =
        Math.max(
            5,
            Math.min(
                95,
                miniGamePetX
            )
        );


    updateMiniGamePetPosition();

}


// =========================
// UPDATE PET POSITION
// =========================

function updateMiniGamePetPosition() {

    const petElement =
        document.getElementById(
            "coinGamePet"
        );

    if (!petElement) {
        return;
    }


    petElement.style.left =
        miniGamePetX + "%";

}


// =========================
// SPAWN COIN
// =========================

function spawnCoin() {

    if (!miniGameActive) {
        return;
    }


    const area =
        document.getElementById(
            "coinGameArea"
        );

    if (!area) {
        return;
    }


    const coin =
        document.createElement("div");

    coin.className =
        "falling-coin";

    coin.textContent = "🪙";


    const areaWidth =
        area.clientWidth;


    const coinX =
        Math.random() *
        (areaWidth - 45);


    coin.style.left = coinX + "px";
    coin.style.top = "0px";
    coin.style.transform =
        "translate3d(0, -45px, 0)";


    area.appendChild(coin);


    miniGameCoins.push({

        element: coin,

        x: coinX,

        y: -45,

        speed:
            2.5 +
            Math.random() * 2

    });

}


// =========================
// UPDATE COINS
// =========================

function updateCoins() {

    if (!miniGameActive) {
        return;
    }


    const area =
        document.getElementById(
            "coinGameArea"
        );

    const petElement =
        document.getElementById(
            "coinGamePet"
        );


    if (!area || !petElement) {
        return;
    }


    const areaWidth =
        area.clientWidth;

    const areaHeight =
        area.clientHeight;


    const petWidth =
        petElement.offsetWidth;

    const petHeight =
        petElement.offsetHeight;


    // ตำแหน่งจริงของสัตว์
    const petCenterX =
        (miniGamePetX / 100) *
        areaWidth;


    miniGameCoins =
        miniGameCoins.filter(
            function (coin) {

                coin.y += coin.speed;

                coin.element.style.transform =
                    `translate3d(0, ${coin.y}px, 0)`;


                const coinLeft =
                    coin.x;

                const coinRight =
                    coin.x + 35;

                const petLeft =
                    petCenterX -
                    petWidth / 2;

                const petRight =
                    petCenterX +
                    petWidth / 2;


                const hitX =
                    coinRight > petLeft
                    &&
                    coinLeft < petRight;


                const hitY =
                    coin.y + 35 >
                    areaHeight - petHeight - 10
                    &&
                    coin.y <
                    areaHeight;


                // เก็บเหรียญ
                if (hitX && hitY) {

                    collectCoin(coin);

                    return false;

                }


                // เหรียญตกถึงพื้น
                if (
                    coin.y >
                    areaHeight + 50
                ) {

                    coin.element.remove();

                    return false;

                }


                return true;

            }
        );


    miniGameAnimation =
        requestAnimationFrame(
            updateCoins
        );

}


// =========================
// COLLECT COIN
// =========================

function collectCoin(coin) {

    coin.element.remove();


    miniGameScore++;


    const exp =
        miniGameScore * 5;


    document.getElementById(
        "coinScore"
    ).textContent =
        miniGameScore;


    document.getElementById(
        "coinExp"
    ).textContent =
        exp;


    // Effect
    const gameArea =
        document.getElementById(
            "coinGameArea"
        );


    const text =
        document.createElement("div");

    text.className =
        "coin-get-text";

    text.textContent =
        "+5 EXP ⭐";


    text.style.left =
        miniGamePetX + "%";


    text.style.bottom =
        "90px";


    gameArea.appendChild(text);


    setTimeout(
        function () {

            text.remove();

        },
        700
    );

}


// =========================
// END GAME
// =========================

function endCoinGame() {

    if (!miniGameActive) {
        return;
    }


    miniGameActive = false;


    clearInterval(
        miniGameTimer
    );

    clearInterval(
        coinSpawnTimer
    );


    cancelAnimationFrame(
        miniGameAnimation
    );


    document.onkeydown = null;


    // ลบเหรียญ
    miniGameCoins.forEach(
        function (coin) {

            if (coin.element) {
                coin.element.remove();
            }

        }
    );


    miniGameCoins = [];


    // ได้ EXP ตามจำนวนเหรียญ
    const earnedExp =
        miniGameScore * 5;


    if (earnedExp > 0) {

        addExp(earnedExp);

    }


    // Happiness ตามจำนวนเหรียญ
    stats.happiness =
        Math.min(
            100,
            stats.happiness +
            Math.min(
                20,
                miniGameScore * 2
            )
        );


    saveStats();
    updatePetUI();


    const game =
        document.getElementById(
            "coinMiniGame"
        );


    if (game) {

        game.classList.remove(
            "show"
        );

    }


    setTimeout(
        function () {

            alert(
                `🎮 Game Over!\n\n` +
                `🪙 เก็บเหรียญได้ ${miniGameScore} เหรียญ\n` +
                `⭐ ได้รับ ${earnedExp} EXP`
            );

        },
        200
    );

}


// ======================================================
// REST
// ======================================================

function restPet() {

    if (stats.energy >= 100) {

        alert("💤 Energy เต็มแล้ว!");
        return;

    }

    // เพิ่ม Energy
    stats.energy = Math.min(
        100,
        stats.energy + 30
    );

    // เพิ่ม EXP เล็กน้อย
    addExp(5);

    saveStats();
    updatePetUI();

}


// ======================================================
// USE ITEM
// ======================================================

function useShopItem(itemId) {

    const item =
        SHOP_ITEMS[itemId];


    if (!item) {

        return;

    }


    if ((inventory[itemId] || 0) <= 0) {

        showInventoryMessage(
            `ไม่มี ${item.name} ใน Inventory`
        );

        return;

    }


    // ลดจำนวน

    inventory[itemId]--;


    // ================= EFFECT =================

    switch (itemId) {


        // Meat Snack

        case 0:

            stats.hunger =
                Math.max(
                    0,
                    stats.hunger - 20
                );


            stats.happiness =
                Math.min(
                    100,
                    stats.happiness + 10
                );


            addExp(10);

            break;


        // Milk Bottle

        case 1:

            stats.energy =
                Math.min(
                    100,
                    stats.energy + 25
                );


            addExp(10);

            break;


        // Pet Cookie

        case 2:

            stats.happiness =
                Math.min(
                    100,
                    stats.happiness + 20
                );


            addExp(15);

            break;


        // Fish Treat

        case 3:

            stats.hunger =
                Math.max(
                    0,
                    stats.hunger - 30
                );


            stats.happiness =
                Math.min(
                    100,
                    stats.happiness + 15
                );


            addExp(15);

            break;


        // Cute Cupcake

        case 4:

            stats.happiness =
                Math.min(
                    100,
                    stats.happiness + 30
                );


            addExp(20);

            break;


        // Pet Cake

        case 5:

            stats.happiness =
                Math.min(
                    100,
                    stats.happiness + 40
                );


            stats.energy =
                Math.min(
                    100,
                    stats.energy + 10
                );


            addExp(25);

            break;

    }


    saveInventory();

    saveStats();

    updateInventoryPage();

    updateShopInventory();

    updatePetUI();


    showInventoryMessage(
        `${item.icon} ${item.name} used!`
    );

}


// ======================================================
// INVENTORY
// ======================================================

function updateInventoryPage() {

    const grid =
        document.querySelector(
            ".inventory-grid"
        );


    if (!grid) {

        return;

    }


    // ล้างของเดิม

    grid.innerHTML = "";


    let itemCount = 0;


    for (
        let i = 0;
        i < SHOP_ITEMS.length;
        i++
    ) {


        const amount =
            inventory[i] || 0;


        // ถ้าไม่มีของ ไม่สร้างการ์ด

        if (amount <= 0) {

            continue;

        }


        itemCount++;


        const item =
            SHOP_ITEMS[i];


        let effectText = "";


        switch (i) {

            case 0:

                effectText =
                    "Hunger -20<br>Happiness +10";

                break;


            case 1:

                effectText =
                    "Energy +25";

                break;


            case 2:

                effectText =
                    "Happiness +20";

                break;


            case 3:

                effectText =
                    "Hunger -30<br>Happiness +15";

                break;


            case 4:

                effectText =
                    "Happiness +30";

                break;


            case 5:

                effectText =
                    "Happiness +40<br>Energy +10";

                break;

        }


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "inventory-item-card";


        card.innerHTML = `

            <div class="inventory-item-icon">

                ${item.icon}

            </div>


            <div class="inventory-item-info">

                <h2>
                    ${item.name}
                </h2>

                <p>
                    ${effectText}
                </p>

            </div>


            <div class="inventory-item-bottom">

                <strong>
                    x${amount}
                </strong>


                <button
                    class="use-item-button"
                    onclick="useShopItem(${i})">

                    Use

                </button>

            </div>

        `;


        grid.appendChild(card);

    }


    // ================= EMPTY INVENTORY =================

    if (itemCount === 0) {

        grid.innerHTML = `

            <div class="inventory-empty">

                <div class="inventory-empty-icon">
                    🎒
                </div>

                <h2>
                    Inventory is Empty
                </h2>

                <p>
                    ซื้อไอเทมจาก Pet Shop
                    แล้วไอเทมจะแสดงที่นี่
                </p>

                <button
                    class="go-shop-button"
                    onclick="showPage('shop')">

                    🛒 Go to Pet Shop

                </button>

            </div>

        `;

    }


    // Pet Food เดิม

    const foodCount =
        document.getElementById(
            "foodCount"
        );


    if (foodCount) {

        foodCount.textContent =
            inventory[0] || 0;

    }


    const petPageFood =
        document.getElementById(
            "petPageFood"
        );


    if (petPageFood) {

        petPageFood.textContent =
            inventory[0] || 0;

    }

}


// ======================================================
// SHOP OWNED
// ======================================================

function updateShopInventory() {

    for (
        let i = 0;
        i < SHOP_ITEMS.length;
        i++
    ) {

        const owned =
            document.getElementById(
                `owned-${i}`
            );


        if (owned) {

            owned.textContent =
                inventory[i] || 0;

        }

    }

}


// ======================================================
// INVENTORY MESSAGE
// ======================================================

function showInventoryMessage(message) {

    const element =
        document.getElementById(
            "inventoryMessage"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    setTimeout(() => {

        element.textContent =
            "";

    }, 2500);

}


// ======================================================
// SHOP MESSAGE
// ======================================================

function showShopMessage(message) {

    const element =
        document.getElementById(
            "shopMessage"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;

}


// ======================================================
// CONNECT WALLET
// ======================================================

async function connectWallet() {

    if (!window.ethereum) {

        alert(
            "กรุณาติดตั้ง MetaMask ก่อน"
        );

        return;

    }


    try {

        provider =
            new ethers.BrowserProvider(
                window.ethereum
            );


        const accounts =
            await provider.send(
                "eth_requestAccounts",
                []
            );


        currentAccount =
            accounts[0];


        const network =
            await provider.getNetwork();


        if (
            Number(network.chainId) !== 97
        ) {

            alert(
                "กรุณาเปลี่ยน Network เป็น BNB Smart Chain Testnet"
            );

            return;

        }


        signer =
            await provider.getSigner();


        contract =
            new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );


        updateWalletUI();

        await loadBlockchainPurchases();


    } catch (error) {

        console.error(error);


        alert(
            "ไม่สามารถเชื่อมต่อ Wallet ได้"
        );

    }

}


// ======================================================
// WALLET UI
// ======================================================

function updateWalletUI() {

    if (!currentAccount) {

        return;

    }


    const shortAddress =
        currentAccount.slice(0, 6)
        + "..."
        + currentAccount.slice(-4);


    const walletAddress =
        document.getElementById(
            "walletAddress"
        );


    if (walletAddress) {

        walletAddress.textContent =
            shortAddress;

    }


    const walletFullAddress =
        document.getElementById(
            "walletFullAddress"
        );


    if (walletFullAddress) {

        walletFullAddress.textContent =
            currentAccount;

    }

}


// ======================================================
// LOAD BLOCKCHAIN PURCHASES
// ======================================================

async function loadBlockchainPurchases() {

    if (!contract) {

        return;

    }


    try {


        /*
         * สำคัญ:
         * Blockchain บอกว่าเคยซื้อกี่ชิ้น
         *
         * แต่ Inventory จะไม่ถูกเขียนทับทุกครั้ง
         * เพราะผู้เล่นสามารถใช้ของไปแล้ว
         */


        for (
            let i = 0;
            i < SHOP_ITEMS.length;
            i++
        ) {


            const blockchainCount =
                await contract.getMyItem(i);


            const purchased =
                Number(
                    blockchainCount
                );


            /*
             * ถ้า Inventory ยังไม่มีข้อมูล
             * ให้สร้างจากยอดที่ซื้อ
             *
             * ถ้ามี Inventory อยู่แล้ว
             * ไม่เขียนทับ
             */

            const inventoryExists =
                Object.prototype.hasOwnProperty.call(
                    inventory,
                    i
                );


            if (
                !inventoryExists
                ||
                inventory[i] === undefined
            ) {

                inventory[i] =
                    purchased;

            }

        }


        saveInventory();

        updateInventoryPage();

        updateShopInventory();


    } catch (error) {

        console.error(
            "Blockchain inventory error:",
            error
        );

    }

}


// ======================================================
// BUY ITEM
// ======================================================

async function buyShopItem(itemId) {

    if (!window.ethereum) {

        alert(
            "กรุณาติดตั้ง MetaMask ก่อน"
        );

        return;

    }


    if (!contract) {

        await connectWallet();

    }


    if (!contract) {

        return;

    }


    const item =
        SHOP_ITEMS[itemId];


    if (!item) {

        return;

    }


    try {


        showShopMessage(
            `กำลังซื้อ ${item.name}...`
        );


        const price =
            await contract.getItemPrice(
                itemId
            );


        const transaction =
            await contract.buyItem(
                itemId,
                {
                    value: price
                }
            );


        showShopMessage(
            "⏳ กำลังรอ Blockchain ยืนยัน..."
        );


        await transaction.wait();


        /*
         * ซื้อสำเร็จ
         * เพิ่ม Inventory 1 ชิ้น
         */

        inventory[itemId] =
            (inventory[itemId] || 0) + 1;


        saveInventory();


        updateInventoryPage();

        updateShopInventory();


        showShopMessage(
            `✅ ซื้อ ${item.name} สำเร็จ!`
        );


    } catch (error) {

        console.error(error);


        if (
            error.code === 4001
            ||
            error.code === "ACTION_REJECTED"
        ) {

            showShopMessage(
                "❌ ยกเลิกการทำรายการ"
            );

        } else {

            showShopMessage(
                "❌ การซื้อไม่สำเร็จ"
            );

        }

    }

}


// ======================================================
// CHANGE PET NAME
// ======================================================

function changePetName() {

    const newName =
        prompt(
            "ตั้งชื่อสัตว์เลี้ยงของคุณ:",
            petName
        );


    if (
        newName === null
        ||
        newName.trim() === ""
    ) {

        return;

    }


    petName =
        newName.trim();


    localStorage.setItem(
        "petoraPetName",
        petName
    );


    loadPet();

}


// ======================================================
// SHOW PAGE
// ======================================================

function showPage(pageId) {


    document.querySelectorAll(
        ".page"
    ).forEach(page => {

        page.classList.remove(
            "active-page"
        );

    });


    const selectedPage =
        document.getElementById(
            pageId
        );


    if (selectedPage) {

        selectedPage.classList.add(
            "active-page"
        );

    }


    document.querySelectorAll(
        ".menu-item"
    ).forEach(button => {

        button.classList.remove(
            "active"
        );

    });


    document.querySelectorAll(
        ".menu-item"
    ).forEach(button => {

        const clickText =
            button.getAttribute(
                "onclick"
            );


        if (
            clickText
            &&
            clickText.includes(
                `'${pageId}'`
            )
        ) {

            button.classList.add(
                "active"
            );

        }

    });


    if (pageId === "inventory") {

        updateInventoryPage();

    }


    if (pageId === "shop") {

        updateShopInventory();

    }


    if (pageId === "pet") {

        updatePetUI();

    }
    if (pageId === "ranking") {

    updateDemoRanking();

}

}


// ======================================================
// BACK
// ======================================================

function goBack() {

    window.location.href =
        "index.html";

}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {


        loadPet();

        updatePetUI();

        updateInventoryPage();

        updateShopInventory();


        // Feed

        const feedButton =
            document.querySelector(
                ".action-button.feed"
            );


        if (feedButton) {

            feedButton.onclick =
                feedPet;

        }


        // Play

        const playButton =
            document.querySelector(
                ".action-button.play"
            );


        if (playButton) {

            playButton.onclick =
                playPet;

        }


        // Rest

        const restButton =
            document.querySelector(
                ".action-button.rest"
            );


        if (restButton) {

            restButton.onclick =
                restPet;

        }


        // MetaMask

        if (window.ethereum) {

            try {

                provider =
                    new ethers.BrowserProvider(
                        window.ethereum
                    );


                const accounts =
                    await provider.send(
                        "eth_accounts",
                        []
                    );


                if (
                    accounts.length > 0
                ) {


                    currentAccount =
                        accounts[0];


                    const network =
                        await provider.getNetwork();


                    if (
                        Number(network.chainId)
                        === 97
                    ) {


                        signer =
                            await provider.getSigner();


                        contract =
                            new ethers.Contract(
                                CONTRACT_ADDRESS,
                                CONTRACT_ABI,
                                signer
                            );


                        updateWalletUI();


                        /*
                         * โหลดเฉพาะตอนที่ยังไม่มี
                         * Inventory ในเครื่อง
                         */

                        const hasInventory =
                            localStorage.getItem(
                                "petoraInventory"
                            );


                        if (!hasInventory) {

                            await loadBlockchainPurchases();

                        }

                    }

                }


            } catch (error) {

                console.error(error);

            }


            window.ethereum.on(
                "accountsChanged",
                function () {

                    window.location.reload();

                }
            );

        }

    }
);
// ======================================================
// DEMO RANKING
// ======================================================

function updateDemoRanking() {

    const rankingContainer =
        document.querySelector(".ranking-list");

    if (!rankingContainer) {
        return;
    }

    // ผู้เล่นจำลอง
    const demoPlayers = [
        {
            name: "Luna",
            pet: "Momo",
            image: "rabbit.png",
            level: 12,
            exp: 85
        },
        {
            name: "Mint",
            pet: "Mochi",
            image: "cat.png",
            level: 10,
            exp: 72
        },
        {
            name: "Nami",
            pet: "Cookie",
            image: "dog.png",
            level: 9,
            exp: 91
        },
        {
            name: "Ploy",
            pet: "Mimi",
            image: "cat.png",
            level: 7,
            exp: 91
        },
        {
            name: "Kiki",
            pet: "Momo",
            image: "rabbit.png",
            level: 6,
            exp: 45
        }
    ];


    // เพิ่มผู้เล่นปัจจุบัน
    demoPlayers.push({

        name: petName,

        pet: petName,

        image:
            pet === "cat"
                ? "cat.png"
                : pet === "dog"
                    ? "dog.png"
                    : "rabbit.png",

        level: stats.level,

        exp: stats.exp

    });


    // เรียงตาม Level และ EXP
    demoPlayers.sort((a, b) => {

        if (b.level !== a.level) {
            return b.level - a.level;
        }

        return b.exp - a.exp;

    });


    // ล้างข้อมูลเดิม
    rankingContainer.innerHTML = "";


    // สร้าง Ranking
    demoPlayers.forEach((player, index) => {

        const card =
            document.createElement("div");

        card.className =
            "ranking-item";


        // ไฮไลต์ตัวเรา
        if (player.name === petName) {

            card.classList.add(
                "current-player"
            );

        }


        const rank =
            index + 1;


        let rankIcon = rank;


        if (rank === 1) {
            rankIcon = "🥇";
        }

        else if (rank === 2) {
            rankIcon = "🥈";
        }

        else if (rank === 3) {
            rankIcon = "🥉";
        }


        card.innerHTML = `

            <div class="ranking-rank">
                ${rankIcon}
            </div>

            <div class="ranking-pet-icon">

                <img src="${player.image}" alt="${player.pet}">

            </div>

            <div class="ranking-player-info">

                <strong>
                    ${player.name}
                </strong>

                <span>
                    ${player.pet}
                </span>

            </div>

            <div class="ranking-level">

                <strong>
                    Lv.${player.level}
                </strong>

                <span>
                    ${player.exp} EXP
                </span>

            </div>

        `;


        rankingContainer.appendChild(card);

    });

}

// ======================================================
// GLOBAL
// ======================================================

window.showPage =
    showPage;


window.goBack =
    goBack;


window.changePetName =
    changePetName;


window.buyShopItem =
    buyShopItem;


window.useShopItem =
    useShopItem;


window.connectWallet =
    connectWallet;


window.feedPet =
    feedPet;


window.playPet =
    playPet;


window.restPet =
    restPet;


// ======================================================
// INTERACTIVE PET
// ======================================================

function petClick(event) {

    stats.happiness =
        Math.min(
            100,
            stats.happiness + 5
        );


    addExp(2);


    saveStats();


    updatePetUI();


    const petElement =
        event.currentTarget;


    const heart =
        document.createElement("div");


    heart.className =
        "pet-heart";


    heart.textContent =
        "❤️";


    const rect =
        petElement.getBoundingClientRect();


    heart.style.left =
        (event.clientX - rect.left) + "px";


    heart.style.top =
        (event.clientY - rect.top) + "px";


    petElement.appendChild(
        heart
    );


    setTimeout(function () {

        heart.remove();

    }, 1000);

}


window.petClick =
    petClick;