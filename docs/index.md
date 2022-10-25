# Solidity API

## IcrErc20

### mint

```solidity
function mint(uint256 mintAmount) external returns (uint256)
```

### redeem

```solidity
function redeem(uint256 redeemTokens) external returns (uint256)
```

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```

### balanceOfUnderlying

```solidity
function balanceOfUnderlying(address account) external returns (uint256)
```

## InvestMoney

### crToken

```solidity
contract IcrErc20 crToken
```

### addTokenToCREAM

```solidity
event addTokenToCREAM(uint256 _amount, uint256 _time)
```

### withdrawTokenFromCREAM

```solidity
event withdrawTokenFromCREAM(uint256 _amount, uint256 _time)
```

### _initialize_InvestMoney

```solidity
function _initialize_InvestMoney(address _crToken) internal virtual
```

Contract variable initialization function

### _mintCrtoken

```solidity
function _mintCrtoken(address _token, uint256 _amount) internal virtual
```

Function to add money to the stake fund of CREAM finance

### _redeemCrtoken

```solidity
function _redeemCrtoken(uint256 _amount) internal virtual
```

Function to withdraw money from the stake fund of CREAM finance

### _getCrtokenBalance

```solidity
function _getCrtokenBalance() internal view virtual returns (uint256)
```

_Returns the amount of token in crToken that the contract has._

### _getCrtokenBalanceOfUnderlying

```solidity
function _getCrtokenBalanceOfUnderlying() internal virtual returns (uint256)
```

_Returns the amount of token that the contract has generated since the start of the stake._

## BitbetLottery

### _contract_is_initialize

```solidity
bool _contract_is_initialize
```

### lotteryRaund

```solidity
uint256 lotteryRaund
```

### _ticketPrice

```solidity
uint256 _ticketPrice
```

### _busd

```solidity
contract IERC20 _busd
```

### _userTicket

```solidity
mapping(uint256 => mapping(uint256 => address)) _userTicket
```

### isInitialized

```solidity
modifier isInitialized()
```

### _initialize_contract

```solidity
function _initialize_contract(address _crToken, address _randomNumber, address _vrfCoordinator) external
```

Contract variable initialization function

### buyATicket

```solidity
function buyATicket(uint256 _ticketNumber) public
```

### _transferTokenToContrat

```solidity
function _transferTokenToContrat() internal returns (bool)
```

## IRandomNumber

### getRandomNumber

```solidity
function getRandomNumber() external returns (bytes32 requestId)
```

### setUntil

```solidity
function setUntil(uint256 _until) external
```

### randomResult

```solidity
function randomResult() external view returns (uint256)
```

### lastRequestId

```solidity
function lastRequestId() external view returns (bytes32)
```

## IVRFCoordinator

### callBackWithRandomness

```solidity
function callBackWithRandomness(bytes32 requestId, uint256 randomness, address consumerContract) external
```

## RandomNumberInteract

### _lastLotteryResult

```solidity
uint256 _lastLotteryResult
```

### randomNumber

```solidity
contract IRandomNumber randomNumber
```

### vrfCoordinator

```solidity
contract IVRFCoordinator vrfCoordinator
```

### lastLotteryResult

```solidity
event lastLotteryResult(uint256 _result, uint256 _time)
```

### _initialize_randomNumberInteract

```solidity
function _initialize_randomNumberInteract(address _randomNumber, address _vrfCoordinator) internal
```

Contract variable initialization function

### _getRandomNumber

```solidity
function _getRandomNumber() internal
```

Function to get a random number between 1 - 999999 using ChainLink VRF.

## RandomNumber

### keyHash

```solidity
bytes32 keyHash
```

### lastRequestId

```solidity
bytes32 lastRequestId
```

### fee

```solidity
uint256 fee
```

### randomResult

```solidity
uint256 randomResult
```

### until

```solidity
uint256 until
```

### newRandomNumber

```solidity
event newRandomNumber(uint256 _newResult)
```

_These are the global variables used for contract management._

### newNumberLimit

```solidity
event newNumberLimit(uint256 _until)
```

### withdrawContractFunds

```solidity
event withdrawContractFunds(uint256 _time, bool _success)
```

### constructor

```solidity
constructor(address _vrfCoordinator, address _linkAddress, address _adminContract) public
```

The address of the VRF Coordinator contract must be supplied, depending on the blocksChain in which we are.
        @dev For both the keyHash and Fee variables, their value will be variable as long as different strings are used.

### getRandomNumber

```solidity
function getRandomNumber() public returns (bytes32 requestId)
```

This function allows you to request a random number 
        @dev For this function to work, you must previously supply this contract with Link Token, to cover 
        the corresponding fees. This function can only be called by the owner of the contract.

### fulfillRandomness

```solidity
function fulfillRandomness(bytes32 requestId, uint256 randomness) internal
```

_Internal function overridden to set the variable randomResult._

### setUntil

```solidity
function setUntil(uint256 _until) public
```

This function allows you to set the variable until, this variable will be used to delimit the range of 
        numbers in which you want to obtain the random number, ex: 1 to 50.
        @dev This function can only be called by the owner of the contract.

### withdrawFunds

```solidity
function withdrawFunds(bool _withdrawToken, address _targetToken) public returns (bool _success)
```

Function designed to be able to withdraw all the funds from the contract in case of 
        receiving any token or ETH,
        @dev If you want the function to retrieve tokens as well, you must provide the address of the token 
        and set _withdrawToken to true.

## VRFCoordinator

### constructor

```solidity
constructor(address linkAddress) public
```

