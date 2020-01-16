var fyghtAddress = "0xf079b71e8788a48f22740040e8ac131b74f4c675";
var fyght;
var userAccount;
var trainingFee = 0.005;
var currentTrainingCost;

$("#btnCreateSend").click(function(){
  createFighter($("[name='creationName']").val());
});

$("button[name='btnTrainingSend']").last().click(function(){
    getFighterByOwner(userAccount).then(function(ids) {
      let fighterId = ids[0];
      training(fighterId);
    });
})


function displayEnimiesFighters() {
  $("#enimiesFighters").empty();

  getFightersCount().then(function(maxId) {

    var enimiesCount = 0;

    for(id = 0; id < maxId; ++id) {
      fyght.methods.fighterToOwner(id).call().then(function(owner){

        if(owner != userAccount) {
          $("#noEnimiesAlert").hide();
          getFighterByOwner(owner).then(displayEnimieFighter);
        }

      });
    }
  });
}

function displayEnimieFighter(id) {

    getFighterDetails(id).then(function(fighter) {

      let name = (fighter.name == "") ? "no name" : fighter.name;

      $("#enimiesFighters").append(`
        <div class="card fighter-id-${fighter.id}" style="max-width: 16rem;">
          <img class="card-img-top" src="img/${fighter.skin}.png" >
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <h6 class="card-subtitle mb-2 text-muted ">Probability <span class="vitoryProbability"></span>%</h6>
            <h6 class="card-subtitle mb-2 text-muted">XP: ${fighter.xp} / Qi: ${fighter.qi}</h6>
            <p class="card-text">${fighter.winCount} wins / ${fighter.lossCount} losses</p>
            <button name="btnAttack" class="btn btn-primary">Attack!</button>
          </div>
        </div>
      `);

      $(".fighter-id-"+fighter.id).find("button[name='btnAttack']").click(function() {
          getFighterByOwner(userAccount).then(function(id) {
            attack(id, fighter.id);
          });
      });

      getFighterByOwner(userAccount).then(function(id){
        getVictoryProbability(id, fighter.id).then(function(probability) {
          $(".fighter-id-"+fighter.id).find('.vitoryProbability').html(probability);
        });
      });

    });

}

function displayMyFighter(id) {
  $("#myFighters").empty();

  if(id == undefined)
    $('#createCharacterModal').modal({show: true, keyboard: false, backdrop: false});

    getFighterDetails(id).then(function(fighter) {

      currentTrainingCost = trainingFee*fighter.qi;
      $("#currentTrainingCost").html(currentTrainingCost);

      let name = fighter.name == "" ? "no name" : fighter.name;

      $("#myFighters").append(`
        <div class="card fighter-id-${fighter.id}">
          <div class="card-header ">
            <button class="btn-clipboard btnRename" title="" data-original-title=""><img src="img/pencil.png" style="width: 15px" /></button>
            <button class="btn-clipboard btnChangeSkin" title="" data-original-title=""><img src="img/no_one.png" style="width: 15px" /></button>
          </div>
          <img class="card-img-top" src="img/${fighter.skin}.png" >
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">XP: ${fighter.xp} / Qi: ${fighter.qi}</h6>
            <p class="card-text">${fighter.winCount} wins / ${fighter.lossCount} losses</p>
            <p></p>
          </div>
        </div>`);

        $("#myFighters").find(".fighter-id-"+fighter.id).find(".btnRename").unbind().click(function() {
            $("#renameCharacterModal").modal('show');
            $("#btnRenameSend").unbind().click(function() {
              renameFighter(fighter.id, $("[name='editionName']").val());
            });
        });

        $("#myFighters").find(".fighter-id-"+fighter.id).find(".btnChangeSkin").click(function() {

            $("#changeSkinModelModal").modal('show');

            $("#changeSkinModelModal").find('button').unbind().click(function() {
              $("#changeSkinModelModal").modal('hide');
              let newSkin = $(this).attr('class');

              if(fighter.xp < 80) {
                $("#alertsModal").find('.modal-body').html('PATIENCE YOU MUST HAVE my young padawan.<br/>You must achieve 80 XP to change your skin.');
                $("#alertsModal").modal('show');
              } else if(newSkin == 'master' && (fighter.xp < 100 || fighter.qi < 100)) {
                $("#alertsModal").find('.modal-body').html("You must achieve 100 XP and 100 Qi to became a master. You're almost there.");
                $("#alertsModal").modal('show');
              } else {
                changeSkin(fighter.id, newSkin);
              }
            });
        });
    });
}

function attack(fighterId, targetId) {
  var notify;
  return fyght.methods.attack(fighterId, targetId).send({ from: userAccount })
  .on("transactionHash", function(hash) {
    notify = $.notify('Fighting! Wait a while...', { type: 'info', delay: 0 });
  })
  .on("receipt", function(receipt) {
    wait();
    getFighterByOwner(userAccount).then(displayMyFighter);
    displayEnimiesFighters();
    notify.close();
    //let winnerId = parseInt(JSON.stringify(receipt.events.Attack.returnValues.winnerId));
  })
  .on("error", function(error) {
    $.notify(error, { type: 'danger' });
  });
}

function createFighter(name) {
  var notify;

  return fyght.methods.createFighter(name).send({ from: userAccount })
  .on("transactionHash", function(hash) {
    $('#createCharacterModal').modal('hide')
    notify = $.notify('Creating your character...', { type: 'info', delay: 0 });
  })
  .on("receipt", function(receipt) {
    wait()
    getFighterByOwner(userAccount).then(displayMyFighter);
    notify.close();
  })
  .on("error", function(error) {
    $.notify(error, { type: 'danger' });
  });
}

function changeSkin(fighterId, newSkin) {
  var notify;

  return fyght.methods.changeSkin(fighterId, newSkin).send({ from: userAccount })
  .on("transactionHash", function(hash) {
    notify = $.notify('Changing your skin...', { type: 'info', delay: 0 });
  })
  .on("receipt", function(receipt) {
    wait();
    getFighterByOwner(userAccount).then(displayMyFighter);
    notify.close();
  })
  .on("error", function(error) {
    $.notify(error, { type: 'danger' });
  });
}

function renameFighter(fighterId, name) {
  var notify;

  return fyght.methods.renameFighter(fighterId, name).send({ from: userAccount })
  .on("transactionHash", function(hash) {
    $('#renameCharacterModal').modal('hide')
    notify = $.notify('Renaming your character...', { type: 'info', delay: 0 });
  })
  .on("receipt", function(receipt) {
    wait();
    getFighterByOwner(userAccount).then(displayMyFighter);
    notify.close();
  })
  .on("error", function(error) {
    $.notify(error, { type: 'danger' });
  });
}

function training(fighterId) {
  var notify;
  var fee = web3js.utils.toWei(currentTrainingCost.toString(), "ether");

  return fyght.methods.training(fighterId).send({ from: userAccount, value: fee })
  .on("transactionHash", function(hash) {
    notify = $.notify('Training in progress...', { type: 'info', delay: 0 });
  })
  .on("receipt", function(receipt) {
    wait();
    getFighterByOwner(userAccount).then(displayMyFighter);
    notify.close();
  })
  .on("error", function(error) {
    $.notify(error, { type: 'danger' });
  });
}

function getFighterDetails(id) {
  return fyght.methods.fighters(id).call();
}

function fighterToOwner(id) {
  return fyght.methods.fighterToOwner(id).call();
}

function getFighterByOwner(owner) {
  return new Promise(function(resolve, reject){
      fyght.methods.getFightersByOwner(owner).call().then(function(ids) {
        resolve(ids[0]);
      });
  });
}

function getFightersCount() {
  return fyght.methods.getFightersCount().call();
}

function getVictoryProbability(attackerId, targetId) {
  return fyght.methods.calculateAttackerProbability(attackerId, targetId).call();
}


/*
  Used to fix bug with web3@1.0 + ganache-cli
  Contract states not changes immediatily after a transaction receipt
  https://github.com/ethereum/web3.js/issues/1239
*/
var msToWait = 0;
function wait(){
   var start = new Date().getTime();
   var end = start;
   while(end < start + msToWait) {
     end = new Date().getTime();
  }
}

function startApp() {

  fyght = new web3js.eth.Contract(fyghtABI, fyghtAddress);

  var accountInterval = setInterval(function() {
    // Check if account has changed
    web3js.eth.getAccounts().then(function(accounts){
      if (accounts[0] !== userAccount) {
        userAccount = accounts[0];
        // Call a function to update the UI with the new account
        getFighterByOwner(userAccount).then(function(id) {
          displayMyFighter(id);
        });
        displayEnimiesFighters();
      }
    });
  }, 100);
}

window.addEventListener('load', function() {

  // If web3 is not injected (modern browsers)...
  if (typeof web3 === 'undefined') {
      // Listen for provider injection
      window.addEventListener('message', ({ data }) => {
          if (data && data.type && data.type === 'ETHEREUM_PROVIDER_SUCCESS') {
              // Use injected provider, start dapp...
              web3js = new Web3(ethereum);
          }
      });
      // Request provider
      window.postMessage({ type: 'ETHEREUM_PROVIDER_REQUEST' }, '*');

  }
  // If web3 is injected (legacy browsers)...
  else {
      // Use injected provider, start dapp
      web3js = new Web3(web3.currentProvider);
  }

  if(typeof web3js !== 'undefined') {

    web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case "1":
          break
        case "2":
          break
        case "3":
          break
        case "4":
          break
        case "42":
          break
        default:
          msToWait = 10000;
      }
    });

    startApp();
  }
  else {
      let msg = "Install <a href='https://metamask.io' target='_blank'>Metamask wallet<a/> to proceed";
      $("#alertsModal").find('.modal-body').html(msg);
      $("#alertsModal").modal({show: true, keyboard: false, backdrop: false, focus: true});
  }
});
