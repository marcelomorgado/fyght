const p = (myXp, hisXp) => 1000 / (myXp + hisXp);

for (let myXp = 1; myXp <= 100; ++myXp) {
  for (let hisXp = 1; hisXp <= 100; ++hisXp) {
    console.log(`myXp=${myXp}, hisXp=${hisXp}, p=${p(myXp, hisXp)}`);
  }
}
