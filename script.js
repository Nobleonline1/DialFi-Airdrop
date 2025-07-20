// script.js

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const mineButton = document.getElementById('mineButton');
    const totalSupplyDisplay = document.getElementById('total-supply-display');
    const lastMinedTimeDisplay = document.getElementById('last-mined-time');
    const countdownDisplay = document.getElementById('countdown');

    // Added elements for user balances
    const userDiFiBalanceDisplay = document.getElementById('user-difi-balance');
    const userDpowerBalanceDisplay = document.getElementById('user-dpower-balance');

    const currentDpowerDisplay = document.getElementById('current-dpower'); // This was inside dpower conversion section, now we have a global one
    const dpowerToConvertInput = document.getElementById('dpower-to-convert');
    const convertDpowerBtn = document.getElementById('convertDpowerBtn');
    const convertedDifiDisplay = document.getElementById('converted-difi');
    const purchaseAmountUsdInput = document.getElementById('purchase-amount-usd');
    const purchaseDpowerBtn = document.getElementById('purchaseDpowerBtn');
    const paymentDetailsDiv = document.getElementById('payment-details');
    const cryptoAmountSpan = document.getElementById('crypto-amount');
    const paymentAddressSpan = document.getElementById('payment-address');
    const menuButton = document.getElementById('menuButton');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const tasksLink = document.getElementById('tasksLink');
    const contactLink = document.getElementById('contactLink');
    const tasksModal = document.getElementById('tasksModal');
    const contactModal = document.getElementById('contactModal');
    const closeButtons = document.querySelectorAll('.modal-content .close-button');
    const claimTaskButtons = document.querySelectorAll('.claim-task-btn');

    // Initial Data (Client-side simulation)
    let totalSupply = 50000000; // 50,000,000 DiFi
    let lastMineTimestamp = localStorage.getItem('lastMineTimestamp') ? parseInt(localStorage.getItem('lastMineTimestamp')) : 0;
    let userDpower = localStorage.getItem('userDpower') ? parseInt(localStorage.getItem('userDpower')) : 0;
    let userDiFi = localStorage.getItem('userDiFi') ? parseFloat(localStorage.getItem('userDiFi')) : 0;

    // Function to update all balance displays
    function updateAllBalances() {
        totalSupplyDisplay.textContent = totalSupply.toLocaleString();
        userDiFiBalanceDisplay.textContent = userDiFi.toFixed(2); // Display DiFi with 2 decimal places
        userDpowerBalanceDisplay.textContent = userDpower.toLocaleString();
    }

    // Update UI on load
    updateAllBalances();
    updateMiningUI();
    updateConvertedDiFi(); // Update conversion display based on initial Dpower

    // --- Core Functionality ---

    // Mining
    function updateMiningUI() {
        const now = Date.now();
        const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

        if (now - lastMineTimestamp >= twelveHours) {
            mineButton.disabled = false;
            countdownDisplay.textContent = "Ready to Mine!";
            lastMinedTimeDisplay.textContent = new Date(lastMineTimestamp).toLocaleString();
        } else {
            mineButton.disabled = true;
            const timeRemaining = twelveHours - (now - lastMineTimestamp);
            startCountdown(timeRemaining);
            lastMinedTimeDisplay.textContent = new Date(lastMineTimestamp).toLocaleString();
        }
    }

    function startCountdown(ms) {
        let remaining = ms;
        const interval = setInterval(() => {
            remaining -= 1000;
            if (remaining <= 0) {
                clearInterval(interval);
                updateMiningUI();
            } else {
                const hours = Math.floor(remaining / (1000 * 60 * 60));
                const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
                countdownDisplay.textContent =
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }, 1000);
    }

    mineButton.addEventListener('click', () => {
        if (totalSupply >= 0.25) { // Ensure supply is not negative
            userDiFi += 0.25;
            totalSupply -= 0.25;
            lastMineTimestamp = Date.now();

            localStorage.setItem('lastMineTimestamp', lastMineTimestamp);
            localStorage.setItem('userDiFi', userDiFi);
            localStorage.setItem('totalSupply', totalSupply); // Save total supply as well
            alert('You have successfully mined 0.25 diFi!');
            updateAllBalances(); // Update all balances after mining
            updateMiningUI();
        } else {
            alert('Mining is currently unavailable. Total supply is depleted.');
            mineButton.disabled = true;
        }
    });

    // Referral Bonus (simulated)
    window.copyToClipboard = (elementId) => {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('Referral link copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

    // Dpower Conversion
    function updateConvertedDiFi() {
        const dpowerVal = parseInt(dpowerToConvertInput.value) || 0;
        if (dpowerVal >= 250) {
            const convertibleDiFi = (dpowerVal / 250) * 0.25;
            convertedDifiDisplay.textContent = convertibleDiFi.toFixed(2);
        } else {
            convertedDifiDisplay.textContent = '0';
        }
    }

    dpowerToConvertInput.addEventListener('input', updateConvertedDiFi);

    convertDpowerBtn.addEventListener('click', () => {
        const dpowerToConvert = parseInt(dpowerToConvertInput.value);
        if (dpowerToConvert >= 250 && dpowerToConvert <= userDpower && dpowerToConvert % 250 === 0) {
            const diFiEarned = (dpowerToConvert / 250) * 0.25;
            userDpower -= dpowerToConvert;
            userDiFi += diFiEarned;

            localStorage.setItem('userDpower', userDpower);
            localStorage.setItem('userDiFi', userDiFi);
            updateAllBalances(); // Update all balances after conversion
            dpowerToConvertInput.value = '';
            updateConvertedDiFi();
            alert(`Successfully converted ${dpowerToConvert} Dpower to ${diFiEarned.toFixed(2)} diFi!`);
        } else if (dpowerToConvert % 250 !== 0) {
            alert('Please enter a value that is a multiple of 250 Dpower.');
        } else {
            alert('Insufficient Dpower or invalid amount for conversion.');
        }
    });

    // Premium Purchase
    purchaseDpowerBtn.addEventListener('click', () => {
        const usdAmount = parseInt(purchaseAmountUsdInput.value);
        if (usdAmount >= 5 && usdAmount % 5 === 0) {
            const dpowerEarned = (usdAmount / 5) * 10000;
            const cryptoAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''); // Simulate random address

            cryptoAmountSpan.textContent = `$${usdAmount} (equivalent crypto amount will be calculated by a real backend)`;
            paymentAddressSpan.textContent = cryptoAddress;
            paymentDetailsDiv.style.display = 'block';

            // Simulate adding Dpower after a "payment" (for front-end demo)
            // In a real app, this would be handled by a payment gateway callback
            setTimeout(() => {
                userDpower += dpowerEarned;
                localStorage.setItem('userDpower', userDpower);
                updateAllBalances(); // Update all balances after purchase
                alert(`Simulated purchase successful! You received ${dpowerEarned.toLocaleString()} Dpower.`);
                paymentDetailsDiv.style.display = 'none';
                purchaseAmountUsdInput.value = '';
            }, 5000); // Simulate a 5-second processing time
        } else {
            alert('Please enter a valid amount in multiples of $5.');
        }
    });

    // --- Menu and Modal Functionality ---

    // Open side menu
    menuButton.addEventListener('click', () => {
        sideMenu.style.width = '250px';
    });

    // Close side menu
    closeMenuBtn.addEventListener('click', () => {
        sideMenu.style.width = '0';
    });

    // Open Tasks Modal
    tasksLink.addEventListener('click', (e) => {
        e.preventDefault();
        tasksModal.style.display = 'flex';
        sideMenu.style.width = '0'; // Close side menu when modal opens
    });

    // Open Contact Modal
    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.style.display = 'flex';
        sideMenu.style.width = '0'; // Close side menu when modal opens
    });

    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === tasksModal) {
            tasksModal.style.display = 'none';
        }
        if (event.target === contactModal) {
            contactModal.style.display = 'none';
        }
    });

    // Simulate Task Completion
    claimTaskButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const reward = parseFloat(e.target.dataset.reward);
            if (!e.target.disabled) {
                userDiFi += reward;
                localStorage.setItem('userDiFi', userDiFi);
                updateAllBalances(); // Update all balances after claiming task
                alert(`You claimed ${reward} diFi for completing the task!`);
                e.target.disabled = true; // Disable button after claiming
                e.target.textContent = 'Claimed!';
            }
        });
    });

    // Initialize total supply from localStorage if it exists
    if (localStorage.getItem('totalSupply')) {
        totalSupply = parseFloat(localStorage.getItem('totalSupply'));
    }
    updateAllBalances(); // Ensure balances are updated on page load
});


//Header display different text every 2 seconds
    const messages = ["DialFi Airdrop", "Claim tokens!", "Dial a code!", "Send crypto!", "Receive!",
     "Offline!", "Low fees!", "Don't miss!", "DialFi Airdrop"];
    let currentIndex = 0;
    const headerElement = document.getElementById("dialfiHeader");

    function displayNextMessage() {
        if (currentIndex < messages.length) {
            headerElement.textContent = messages[currentIndex];
            currentIndex++;
        } else {
            // Optional: Loop back to the beginning or clear the interval
            currentIndex = 0; // To loop the messages
            // clearInterval(messageInterval); // To stop after all messages are displayed once
        }
    }

    // Call displayNextMessage every 2 seconds (2000 milliseconds)
    const messageInterval = setInterval(displayNextMessage, 2000);