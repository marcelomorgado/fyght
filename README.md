# FyGHT
A karate crypto game

Your journey to became a master starts now.
Train with your master and challenge another players to see who is the best.
After which victory, your fighter gains +1 XP and <b>become stronger</b>.

| | Level | Description | Unlock |
| ------ | ------ | ------ | ------ |
| <img src="/ui/img/naked.png" alt="naked" width="75px"/> | Naked | You are ready to begin your journey when you let go all of material stuffs | - |



## Play

The game has already deployed at Ethereum ropsten network.
```
npm install light-server -g
npm start
```

If you want compile and deploy for yourself, follow steps below.

## Compile and deploy

### Compile
```
npm install truffle -g
npm install
truffle compile
```

### Deploy at Ropsten
You can deploy these contracts using [Infura](https://infura.io) account.
Update truffle.json with your infura key and wallet.
```
truffle migrate --network ropsten
```

### Deploy at Ganache-cli

```
npm install ganache-cli -g
ganacle-cli
truffle migrate --network development
```

## Running
Edit contract address (fyghtAddress) at js/fyght.js file.
```
npm install light-server -g
npm start
```

## Tests
```
truffle test
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

All images used on this project are available under Creative Commons Attribution license.
- naked, normal_guy, karate_kid, japonese, monk, ninja, no_one, daemon by [TGBB](https://piq.codeus.net/u/TGBB) / [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)
- master by [a5m00thcrimin4l](https://piq.codeus.net/u/a5m00thcrimin4l) / [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)
- pencil by [Tom](https://piq.codeus.net/u/Tom) / [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)
