function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function attackVictoryProbability(a, b) {


  let aPoint = (a.xp*3 + a.qi*2)/5;
  let bPoint = (b.xp*3 + b.qi*2)/5;

  let p = aPoint*100/(aPoint+bPoint)+5;

  console.log(a, b, p.toFixed(2), 'aPoint=' + aPoint + ', bPoint='+bPoint)

}

let attackers = [];
let targets = [];

for(xp = 1; xp <= 10; ++xp) {
  for(qi = 1; qi <= 10; ++qi) {
    attackers.push({ xp: xp, qi: qi });
    targets.push({ xp: xp, qi: qi });
  }
}

shuffle(attackers);
shuffle(targets)

//for(i = 0; i < attackers.length; ++i)
//   attackVictoryProbability(attackers[i], targets[i])

/*
{ xp: 8, qi: 10 } { xp: 7, qi: 2 } '64.65' 'aPoint=8.5, bPoint=5.75'
{ xp: 8, qi: 0 } { xp: 7, qi: 0 } '58.33' 'aPoint=6, bPoint=5.25'
*/
//attackVictoryProbability({ xp: 1, qi: 1 }, { xp: 1, qi: 1 })
//attackVictoryProbability({ xp: 2, qi: 1 }, { xp: 1, qi: 1 })
//attackVictoryProbability({ xp: 3, qi: 1 }, { xp: 1, qi: 1 })
//attackVictoryProbability({ xp: 10, qi: 3 }, { xp: 30, qi: 1 })
//attackVictoryProbability({ xp: 8, qi: 0 }, { xp: 7, qi: 0 })
