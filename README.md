Here’s a comprehensive **README** for your project:

---

# Revolve Credit (REVC)

**Revolve Credit (REVC)** is a decentralized utility token deployed on the Binance Smart Chain (BSC). It enables automated minting through USDT transactions, where users can specify the number of cycles for swapping. The smart contract facilitates minting, transferring, and holding of REVC tokens with metrics tracking and transparent auditing.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Smart Contract Details](#smart-contract-details)
- [Functions](#functions)
- [Usage](#usage)
- [Setup and Deployment](#setup-and-deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The REVC token offers a unique mechanism for minting tokens based on user-provided USDT. Users specify a number of swap cycles, and the smart contract divides the USDT across cycles, mints REVC accordingly, and transfers a portion to the holding wallet while leaving 1 REVC in each cycle wallet to increase the holder count.

## Features

- **Automated Minting**: REVC tokens are minted each time USDT is swapped based on user input.
- **Cycle-based Swapping**: The total USDT amount is divided across a specified number of cycles.
- **Metrics Tracking**: Tracks metrics like total supply, transfers, swap values, and total USD equivalent.
- **Holding Wallet**: Accumulates the majority of minted REVC tokens while leaving 1 REVC in each cycle wallet.
- **Transparency**: Includes an audit URL for transparency, gas fee management, and event logging for each completed cycle.

## Smart Contract Details

- **Token**: Revolve Credit (REVC)
- **Blockchain**: Binance Smart Chain (BSC)
- **Decimal Precision**: 18
- **Minting Rate**: 1 REVC per 1 USDT (adjustable based on total USDT divided by cycles)
- **Cycle Logic**: Allows users to specify a number of cycles for minting and distribution.

## Functions

### Core Functions

1. **mintREVC**: Mints REVC tokens in exchange for USDT.
   - **Parameters**: `usdtAmount` (amount of USDT to mint REVC)
   - **Operation**: Transfers USDT, mints REVC to main wallet, and updates metrics.

2. **executeSwapCycle**: Distributes USDT and mints REVC across multiple cycles.
   - **Parameters**: `totalUsdtAmount`, `cycleWallets[]`
   - **Operation**: Divides USDT across `swapCycles`, mints REVC, and transfers most to holding wallet.

3. **setSwapCycles**: Sets the number of cycles for swapping (only owner).
4. **setHoldingWallet**: Sets the holding wallet address where REVC tokens accumulate (only owner).
5. **withdrawUSDT**: Allows the owner to withdraw accumulated USDT from the contract.
6. **getOverallValue**: Returns the overall USD equivalent of the swapped USDT.

### Helper Functions

- **getBNBBalance**: Returns the contract’s current BNB balance.
- **setAuditUrl**: Sets or updates the audit URL for transparency.

## Usage

### Setting up Cycles

1. **Specify Swap Cycles**: Use `setSwapCycles` to define the number of cycles (e.g., 5).
2. **Provide USDT**: When a user wants to mint REVC, they can specify the USDT amount and desired cycles.
3. **Execute Cycles**: The contract divides the USDT among cycles, mints REVC, transfers to the holding wallet, and retains 1 REVC in each cycle wallet.

### Example Call

Assume a user wants to mint with 100 USDT and set 5 cycles:
- Call `executeSwapCycle(100 * 10**18, cycleWallets)`, where `cycleWallets` is an array of 5 predefined wallet addresses.
- Each cycle wallet will receive 20 USDT, mint 20 REVC, and send 19 REVC to the holding wallet.

## Setup and Deployment

### Prerequisites

- **Node.js** and **npm**
- **Hardhat** for contract deployment
- **Binance Smart Chain (BSC)** wallet address

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/revolve-credit
   cd revolve-credit
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   - Create a `.env` file with your BSC RPC URL and wallet private key.
   ```plaintext
   BSC_RPC_URL="https://bsc-dataseed.binance.org/"
   PRIVATE_KEY="your-private-key"
   ```

4. **Deploy the Contract**:
   ```bash
   npx hardhat run scripts/deploy.js --network bsc
   ```

5. **Verify on BSCScan (Optional)**:
   ```bash
   npx hardhat verify --network bsc <contract-address> <constructor-arguments>
   ```

## Contributing

1. Fork the project.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -am 'Add new feature'`).
4. Push to branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

