# 发布流程

## 发布准备

复制env_sample到.env并修改各个参数, 然后

```
npm install
```

## 发布合约

```
npx hardhat run scripts/deploy.js --network rinkeby
```


## 测试Flashbots

提前把flashbotjs里面的data改掉，然后执行
```
node src/flashbots.js
```
