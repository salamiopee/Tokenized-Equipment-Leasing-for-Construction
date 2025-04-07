# Tokenized Equipment Leasing for Construction

This project implements a tokenized equipment leasing system for the construction industry using Clarity smart contracts on the Stacks blockchain. The system enables efficient management of heavy machinery leasing through transparent, secure, and automated processes.

## Overview

The system consists of four main smart contracts:

1. **Asset Registration Contract**: Records and manages details of heavy machinery
2. **Lessee Verification Contract**: Validates qualified construction companies
3. **Usage Tracking Contract**: Monitors equipment hours and operating conditions
4. **Maintenance Scheduling Contract**: Manages service schedules based on actual usage

## Smart Contracts

### Asset Registration Contract

This contract handles the registration and management of construction equipment:

- Register new equipment with detailed information
- Query equipment details
- Update equipment availability status
- Transfer equipment ownership

### Lessee Verification Contract

This contract manages the verification of construction companies:

- Register new construction companies
- Verify company credentials through authorized verifiers
- Check company verification status

### Usage Tracking Contract

This contract tracks the usage of registered equipment:

- Record equipment usage hours and conditions
- Store usage history
- Calculate total usage hours

### Maintenance Scheduling Contract

This contract manages maintenance schedules based on usage data:

- Set maintenance intervals based on hours or dates
- Record maintenance events
- Check if maintenance is due

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Clarity development environment
- [Stacks CLI](https://github.com/blockstack/stacks.js) - For interacting with the Stacks blockchain

### Installation

1. Clone the repository:

