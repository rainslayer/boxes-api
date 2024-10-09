class RandomService {
  static rewardsValues = ["common", "rare", "epic", "legendary"];
  static probabilities = [0.6, 0.2, 0.15, 0.05];

  static generateRandomRewardValue() {
    const totalProbability = RandomService.probabilities.reduce(
      (acc, p) => acc + p,
      0
    );
    let cumulativeProbability = 0;
    const randomNum = Math.random() * totalProbability;

    for (let i = 0; i < RandomService.rewardsValues.length; i++) {
      cumulativeProbability += RandomService.probabilities[i];
      if (randomNum <= cumulativeProbability) {
        return RandomService.rewardsValues[i];
      }
    }
  }

  static getRandomArrayElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

module.exports = RandomService;
