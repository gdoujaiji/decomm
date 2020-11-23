pragma solidity ^0.6.2;
import '@openzeppelin/contracts/token/ERC20/IERC20.sol'; 

contract PaymentProcessor {
    address public admin;
    IERC20 public dai;

    event PaymentDone(
        address payer,
        uint amount,
        uint paymentId,
        uint date // date in solidity is reprsented as integer
    );
    constructor(address adminAddress, address daiAddress) public {
        admin = adminAddress;
        dai = IERC20(daiAddress);// IREC20 interface from open zeppelin
    }

    function pay(uint amount, uint paymentId) external {
        dai.transferFrom(msg.sender, admin, amount);
        emit PaymentDone(msg.sender, amount, paymentId, block.timestamp); // block.timestamp is a built in variable in solidity
    }
}