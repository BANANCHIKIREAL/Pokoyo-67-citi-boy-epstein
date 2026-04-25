// Игровые переменные
let coins = 0;
let clickPower = 1;
let coinsPerSecond = 0;
let totalUpgradesOwned = 0;

// Улучшения с кринжовыми бомжовскими названиями
const upgrades = [
    {
        id: 'dirty_socks',
        name: '🧦 Грязные носки',
        description: 'Пахнут как деньги, приносят +1 монету в секунду',
        baseCost: 10,
        coinsPerSecond: 1,
        clickPowerBonus: 0,
        owned: 0,
        costMultiplier: 1.15
    },
    {
        id: 'cardboard_sign',
        name: '📋 Картонный табличка',
        description: 'Помогает попрошайничать +2 монеты в секунду',
        baseCost: 25,
        coinsPerSecond: 2,
        clickPowerBonus: 0,
        owned: 0,
        costMultiplier: 1.2
    },
    {
        id: 'plastic_bottle',
        name: '🍾 Пластиковая бутылка',
        description: 'Собираешь макулатуру +5 монет в секунду',
        baseCost: 50,
        coinsPerSecond: 5,
        clickPowerBonus: 0,
        owned: 0,
        costMultiplier: 1.25
    },
    {
        id: 'rusty_spoon',
        name: '🥄 Ржавая ложка',
        description: 'Улучшает попрошайничество +1 к силе клика',
        baseCost: 100,
        coinsPerSecond: 0,
        clickPowerBonus: 1,
        owned: 0,
        costMultiplier: 1.3
    },
    {
        id: 'shopping_cart',
        name: '🛒 Продуктовая тележка',
        description: 'Мобильный дом +10 монет в секунду',
        baseCost: 200,
        coinsPerSecond: 10,
        clickPowerBonus: 0,
        owned: 0,
        costMultiplier: 1.35
    },
    {
        id: 'cardboard_box',
        name: '📦 Картонная коробка',
        description: 'Пентхаус для бомжа +20 монет в секунду',
        baseCost: 500,
        coinsPerSecond: 20,
        clickPowerBonus: 0,
        owned: 0,
        costMultiplier: 1.4
    },
    {
        id: 'golden_tooth',
        name: '🦷 Золотой зуб',
        description: 'Статусный предмет +5 к силе клика',
        baseCost: 1000,
        coinsPerSecond: 0,
        clickPowerBonus: 5,
        owned: 0,
        costMultiplier: 1.5
    },
    {
        id: 'homeless_gang',
        name: '👥 Бомжовская банда',
        description: 'Команда попрошаек +50 монет в секунду',
        baseCost: 2500,
        coinsPerSecond: 50,
        clickPowerBonus: 0,
        owned: 0,
        costMultiplier: 1.6
    },
    {
        id: 'magic_bottlecap',
        name: '🔮 Магическая крышка',
        description: 'Артефакт улиц +10 к силе клика',
        baseCost: 5000,
        coinsPerSecond: 0,
        clickPowerBonus: 10,
        owned: 0,
        costMultiplier: 1.7
    },
    {
        id: 'underground_kingdom',
        name: '👑 Подземное королевство',
        description: 'Стань королём канализации +200 монет в секунду',
        baseCost: 10000,
        coinsPerSecond: 200,
        clickPowerBonus: 0,
        owned: 0,
        costMultiplier: 1.8
    },
    {
        id: 'crypto_bottle',
        name: '💎 Крипто-бутылка',
        description: 'Майнинг на бутылках +500 монет в секунду',
        baseCost: 25000,
        coinsPerSecond: 500,
        clickPowerBonus: 0,
        owned: 0,
        costMultiplier: 1.9
    },
    {
        id: 'god_tier_hobo',
        name: '🌟 БОГ-БОМЖ',
        description: 'Просветление улиц +50 к силе клика',
        baseCost: 100000,
        coinsPerSecond: 0,
        clickPowerBonus: 50,
        owned: 0,
        costMultiplier: 2.0
    }
];

// Инициализация игры
function initGame() {
    loadGame();
    updateDisplay();
    renderUpgrades();
    startAutoSave();
    
    // Добавляем обработчики событий
    document.getElementById('clicker-image').addEventListener('click', handleClick);
}

// Обработка клика по бомжу
function handleClick(event) {
    coins += clickPower;
    updateDisplay();
    
    // Показываем эффект клика
    showClickEffect(event);
    
    // Анимация монеток
    animateCoins();
    
    // Сохраняем игру
    saveGame();
}

// Показ эффекта клика
function showClickEffect(event) {
    const effect = document.getElementById('click-effect');
    const rect = event.target.getBoundingClientRect();
    
    effect.textContent = `+${clickPower}`;
    effect.style.left = `${event.clientX - rect.left}px`;
    effect.style.top = `${event.clientY - rect.top}px`;
    effect.style.opacity = '1';
    effect.style.animation = 'none';
    
    // Перезапускаем анимацию
    setTimeout(() => {
        effect.style.animation = 'floatUp 1s ease-out';
    }, 10);
}

// Анимация монеток
function animateCoins() {
    const coinsDisplay = document.querySelector('.coins-display');
    coinsDisplay.classList.remove('pulse');
    setTimeout(() => {
        coinsDisplay.classList.add('pulse');
    }, 10);
}

// Отображение улучшений
function renderUpgrades() {
    const upgradesGrid = document.getElementById('upgrades-grid');
    upgradesGrid.innerHTML = '';
    
    upgrades.forEach(upgrade => {
        const upgradeElement = createUpgradeElement(upgrade);
        upgradesGrid.appendChild(upgradeElement);
    });
}

// Создание элемента улучшения
function createUpgradeElement(upgrade) {
    const div = document.createElement('div');
    div.className = 'upgrade-item';
    div.id = `upgrade-${upgrade.id}`;
    
    const currentCost = getCurrentCost(upgrade);
    const canAfford = coins >= currentCost;
    
    if (!canAfford) {
        div.classList.add('disabled');
    } else {
        div.classList.add('affordable');
    }
    
    div.innerHTML = `
        <div class="upgrade-header">
            <span class="upgrade-name">${upgrade.name}</span>
            <span class="upgrade-cost">🪙 ${formatNumber(currentCost)}</span>
        </div>
        <div class="upgrade-description">${upgrade.description}</div>
        <div class="upgrade-owned">Куплено: ${upgrade.owned}</div>
    `;
    
    div.addEventListener('click', () => buyUpgrade(upgrade));
    
    return div;
}

// Покупка улучшения
function buyUpgrade(upgrade) {
    const currentCost = getCurrentCost(upgrade);
    
    if (coins >= currentCost) {
        coins -= currentCost;
        upgrade.owned++;
        
        // Применяем бонусы
        clickPower += upgrade.clickPowerBonus;
        coinsPerSecond += upgrade.coinsPerSecond;
        totalUpgradesOwned++;
        
        updateDisplay();
        renderUpgrades();
        saveGame();
        
        // Показываем эффект покупки
        showPurchaseEffect(upgrade);
    }
}

// Получение текущей стоимости улучшения
function getCurrentCost(upgrade) {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
}

// Эффект покупки
function showPurchaseEffect(upgrade) {
    console.log(`Куплено: ${upgrade.name}!`);
}

// Обновление дисплея
function updateDisplay() {
    document.getElementById('coins').textContent = formatNumber(Math.floor(coins));
    document.getElementById('per-second').textContent = formatNumber(coinsPerSecond);
    document.getElementById('click-power').textContent = clickPower;
    updateUpgradesAvailability();
}

// Обновление доступности улучшений
function updateUpgradesAvailability() {
    upgrades.forEach(upgrade => {
        const upgradeElement = document.getElementById(`upgrade-${upgrade.id}`);
        if (upgradeElement) {
            const currentCost = getCurrentCost(upgrade);
            const canAfford = coins >= currentCost;
            
            // Удаляем старые классы
            upgradeElement.classList.remove('disabled', 'affordable');
            
            // Добавляем нужный класс
            if (canAfford) {
                upgradeElement.classList.add('affordable');
            } else {
                upgradeElement.classList.add('disabled');
            }
        }
    });
}

// Форматирование чисел
function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' млрд';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' млн';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + ' тыс';
    return Math.floor(num).toString();
}

// Автоматический доход
function startAutoIncome() {
    setInterval(() => {
        if (coinsPerSecond > 0) {
            coins += coinsPerSecond / 10; // Делим на 10, так как интервал 100мс
            updateDisplay();
        }
    }, 100);
}

// Сохранение игры
function saveGame() {
    const gameData = {
        coins,
        clickPower,
        coinsPerSecond,
        totalUpgradesOwned,
        upgrades: upgrades.map(u => ({
            id: u.id,
            owned: u.owned
        }))
    };
    
    localStorage.setItem('hoboClickerSave', JSON.stringify(gameData));
}

// Загрузка игры
function loadGame() {
    const savedData = localStorage.getItem('hoboClickerSave');
    
    if (savedData) {
        const gameData = JSON.parse(savedData);
        coins = gameData.coins || 0;
        clickPower = gameData.clickPower || 1;
        coinsPerSecond = gameData.coinsPerSecond || 0;
        totalUpgradesOwned = gameData.totalUpgradesOwned || 0;
        
        if (gameData.upgrades) {
            gameData.upgrades.forEach(savedUpgrade => {
                const upgrade = upgrades.find(u => u.id === savedUpgrade.id);
                if (upgrade) {
                    upgrade.owned = savedUpgrade.owned;
                }
            });
        }
    }
}

// Автосохранение
function startAutoSave() {
    setInterval(saveGame, 30000); // Сохраняем каждые 30 секунд
}

// Сброс игры
function resetGame() {
    if (confirm('Ты уверен, что хочешь начать с нуля? Весь прогресс будет потерян!')) {
        localStorage.removeItem('hoboClickerSave');
        location.reload();
    }
}

// Добавляем кнопку сброса в консоль
console.log('Для сброса игры введи: resetGame()');

// Запуск игры
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    startAutoIncome();
});

// Клавиатурные сокращения
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        document.getElementById('clicker-image').click();
    }
});
