let gameState = {
    Z: 0, P: 95, S: 2800, H: 3000, E: 0, Y: 3, A: 1000, I: 5, Q: 1, D1: 0, P1: 0,
    step: 0, price: 0
};  // Initial state of the game variables

let gameOver = false;  // Track whether the game has ended

const output = document.getElementById('gameOutput');  // Get reference to the output element
const input = document.getElementById('playerInput');  // Get reference to the player input field
const debugText = document.getElementById('debugText');  // Get reference to the debug information area

function display(text) {
    // Append new text to the game output area and auto-scroll
    output.textContent += text + '\n';
    output.scrollTop = output.scrollHeight;
}

function updateDebugInfo() {
    // Display the current game state in the debug information section
    debugText.textContent = `
        Year: ${gameState.Z}
        Population: ${gameState.P}
        Grain in Store: ${gameState.S} bushels
        Land Owned: ${gameState.A} acres
        Harvest Yield: ${gameState.Y} bushels per acre
        Rats Ate: ${gameState.E} bushels
        Newcomers: ${gameState.I}
        Price of Land: ${gameState.price} bushels per acre
    `;
}

function startGame() {
    // Begin the game with introductory text
    display("\n\nTRY YOUR HAND AT GOVERNING ANCIENT SUMERIA");
    display("FOR A TEN-YEAR TERM OF OFFICE.\n");

    updateDebugInfo();  // Show initial game state details
    nextStep();  // Proceed to the first game step
}

function nextStep() {
    // Advance to the next game step and update game state accordingly
    gameState.step++;
    updateDebugInfo();  // Refresh debug info display

    switch(gameState.step) {
        case 1:
            displayYearReport();  // Provide yearly report to the player
            break;
        case 2:
            askHowManyAcresToBuy();  // Ask the player how many acres to purchase
            break;
        case 3:
            askHowManyAcresToSell();  // Ask the player how many acres to sell
            break;
        case 4:
            askHowMuchGrainToFeedPeople();  // Ask the player how much grain to allocate for feeding people
            break;
        case 5:
            askHowManyAcresToPlant();  // Ask the player how many acres to plant with seed
            break;
        case 6:
            calculateYearEnd();  // End of year calculations and updates
            break;
        default:
            if (gameState.Z >= 10) {
                displayFinalReport();  // Show final report after 10 years
            } else {
                gameState.step = 0;  // Reset step to continue to the next year
                nextStep();  // Start the next year
            }
            break;
    }
}

function displayYearReport() {
    // Report yearly results to the player
    gameState.Z++;  // Increase the year count
    display(`\n\nHAMMURABI:  I BEG TO REPORT TO YOU, IN YEAR ${gameState.Z}, 0 PEOPLE STARVED, ${gameState.I} CAME TO THE CITY,`);
    gameState.P += gameState.I;  // Update population with newcomers
    display(`POPULATION IS NOW ${gameState.P}`);
    display(`THE CITY NOW OWNS ${gameState.A} ACRES.`);
    display(`YOU HARVESTED ${gameState.Y} BUSHELS PER ACRE.`);
    display(`THE RATS ATE ${gameState.E} BUSHELS.`);
    display(`YOU NOW HAVE ${gameState.S} BUSHELS IN STORE.\n`);
    updateDebugInfo();  // Refresh debug info display
    if (gameState.Z === 10) {
        gameState.step = 6;  // Prepare to finalize the game after 10 years
    } else {
        nextStep();  // Proceed to the next step of the game
    }
}

function askHowManyAcresToBuy() {
    // Determine the price of land and ask the player how much to buy
    gameState.price = Math.floor(Math.random() * 10) + 17;  // Randomly generate land price
    display(`LAND IS TRADING AT ${gameState.price} BUSHELS PER ACRE.`);
    display("HOW MANY ACRES DO YOU WISH TO BUY?");
}

function askHowManyAcresToSell() {
    // Ask the player how many acres to sell
    display("HOW MANY ACRES DO YOU WISH TO SELL?");
}

function askHowMuchGrainToFeedPeople() {
    // Ask the player how much grain to allocate for feeding the population
    display("HOW MANY BUSHELS DO YOU WISH TO FEED YOUR PEOPLE?");
}

function askHowManyAcresToPlant() {
    // Ask the player how many acres to plant with seed
    display("HOW MANY ACRES DO YOU WISH TO PLANT WITH SEED?");
}

function processInput() {
    if (gameOver) return;  // Prevent input processing if the game has ended

    const value = parseInt(input.value);  // Parse player input as an integer
    if (isNaN(value) || value < 0) {
        display("PLEASE ENTER A VALID NUMBER.");  // Warn player if input is invalid
        return;
    }

    switch (gameState.step) {
        case 2:  // Step for buying land
            if (value * gameState.price > gameState.S) {
                display("HAMMURABI:  THINK AGAIN. YOU HAVE ONLY " + gameState.S + " BUSHELS OF GRAIN.");  // Not enough grain to buy requested acres
                return;
            }
            gameState.A += value;  // Increase land owned
            gameState.S -= value * gameState.price;  // Deduct grain spent
            display(`You chose to buy ${value} acres.`);
            break;
        case 3:  // Step for selling land
            if (value > gameState.A) {
                display("HAMMURABI:  THINK AGAIN. YOU OWN ONLY " + gameState.A + " ACRES.");  // Not enough land to sell requested acres
                return;
            }
            gameState.A -= value;  // Decrease land owned
            gameState.S += value * gameState.price;  // Add grain gained
            display(`You chose to sell ${value} acres.`);
            break;
        case 4:  // Step for feeding the population
            if (value > gameState.S) {
                display("HAMMURABI:  THINK AGAIN. YOU HAVE ONLY " + gameState.S + " BUSHELS OF GRAIN.");  // Not enough grain to feed population
                return;
            }
            gameState.S -= value;  // Deduct grain used for feeding
            gameState.C = Math.floor(value / 20);  // Calculate how many people are fed
            display(`You chose to feed your people ${value} bushels of grain.`);
            break;
        case 5:  // Step for planting crops
            if (value > gameState.A) {
                display("HAMMURABI:  THINK AGAIN. YOU OWN ONLY " + gameState.A + " ACRES.");  // Not enough land to plant requested acres
                return;
            }
            if (value / 2 > gameState.S) {
                display("HAMMURABI:  THINK AGAIN. YOU HAVE ONLY " + gameState.S + " BUSHELS OF GRAIN. YOU CAN ONLY PLANT " + Math.floor(gameState.S * 2) + " ACRES.");  // Not enough grain to plant all acres
                return;
            }
            if (value > 10 * gameState.P) {
                display("BUT YOU HAVE ONLY " + gameState.P + " PEOPLE TO TEND THE FIELDS!");  // Not enough people to tend all requested acres
                return;
            }
            gameState.S -= Math.floor(value / 2);  // Deduct grain used for planting
            gameState.H = value * gameState.Y;  // Calculate harvested grain
            display(`You chose to plant ${value} acres.`);
            break;
        default:
            break;
    }

    input.value = '';  // Clear player input field
    updateDebugInfo();  // Refresh debug info display
    nextStep();  // Proceed to the next game step
}

function calculateYearEnd() {
    // End-of-year calculations and game state updates
    gameState.E = Math.floor(gameState.S / (Math.random() * 5 + 1));  // Calculate grain eaten by rats
    gameState.S = gameState.S - gameState.E + gameState.H;  // Update grain storage
    gameState.I = Math.floor(Math.random() * 10 * (20 * gameState.A + gameState.S) / gameState.P / 100 + 1);  // Calculate number of newcomers
    gameState.D = gameState.P - gameState.C;  // Calculate number of people who starved

    if (gameState.D > 0.45 * gameState.P) {
        display("YOU STARVED TOO MANY PEOPLE! YOU'VE BEEN IMPEACHED AND THROWN OUT OF OFFICE.");  // Game over condition
        displayFinalReport();  // Display final report and end the game
        gameOver = true;  // Set the game over state
        return;  // Stop further game execution
    }
    gameState.step = 0;  // Reset step counter for the next year
    nextStep();  // Start the next year
}

function displayFinalReport() {
    // Show final game report and thank the player
    display("GAME OVER. THANK YOU FOR PLAYING!");
    if (!document.getElementById('restartButton')) {  // Ensure the restart button is created only once
        displayRestartButton();  // Create and display the restart button
    }
}

function displayRestartButton() {
    const container = document.getElementById('gameContainer');  // Get reference to the game container
    const restartButton = document.createElement('button');  // Create a new button element
    restartButton.id = 'restartButton';  // Assign a unique ID to the restart button
    restartButton.textContent = "Restart Game";  // Set button text
    restartButton.style.padding = "10px 20px";  // Style the button
    restartButton.style.fontSize = "16px";  // Set font size for better readability
    restartButton.style.marginTop = "20px";  // Add margin above the button
    restartButton.style.cursor = "pointer";  // Change cursor to pointer for button
    restartButton.onclick = function() {
        resetGame();  // Trigger game reset when clicked
    };
    container.appendChild(restartButton);  // Add the restart button to the game container
}

function resetGame() {
    // Reset the game to its initial state for a new session
    gameState = {
        Z: 0, P: 95, S: 2800, H: 3000, E: 0, Y: 3, A: 1000, I: 5, Q: 1, D1: 0, P1: 0,
        step: 0, price: 0
    };  // Reinitialize the game state variables
    gameOver = false;  // Reset game over state to false
    output.textContent = "";  // Clear game output display
    debugText.textContent = "";  // Clear debug information display
    document.getElementById('restartButton').remove();  // Remove the restart button from the UI
    startGame();  // Restart the game
}

// Initialize the game when the web page is fully loaded
window.onload = startGame;
