function copy() {
    navigator.clipboard.writeText(document.getElementById("output").innerText);
}
document.getElementById('ib').addEventListener('change', e => {
    if (!document.getElementById('ib').checked) {
        document.getElementById('insta-ban').textContent = ``
    }
    else {
        document.getElementById('insta-ban').innerHTML = `<input id="modderators" class="i" placeholder="Player IDs (separate with commas)" type="text"><p><input id="webhook" class="i" placeholder="Webhook URL" type="text">`;
    }
});
function generate() {
    if (!document.getElementById('ib').checked) {
        document.getElementById('output').textContent = `
handlers.ReturnCurrentVersionNew = function(args){
    return {"ResultCode":0,"BannedUsers":"` + document.getElementById('banned').value + `","MOTD":"<color=red>PLEASE DUPLICATE THE MOTD TEXT AND DELETE THE FIRST ONE THEN EDIT THE TEXT ON THE DUPLICATED ONE!</color>","SynchTime":"-LOADING-","Version":"` + document.getElementById('ver').value + `", "Message":"` + document.getElementById('ver').value + `"}
}`
    }
    else {
        document.getElementById('output').textContent = `
handlers.ReturnCurrentVersionNew = function(args){
    return {"ResultCode":0,"BannedUsers":"` + document.getElementById('banned').value + `","MOTD":"<color=red>PLEASE DUPLICATE THE MOTD TEXT AND DELETE THE FIRST ONE THEN EDIT THE TEXT ON THE DUPLICATED ONE!</color>","SynchTime":"-LOADING-","Version":"` + document.getElementById('ver').value + `", "Message":"` + document.getElementById('ver').value + `"}
}
    
var hostids = "` + document.getElementById('modderators').value + `";
var gamedown = false;

var webhookURL = "` + document.getElementById('webhook').value + `";

handlers.requestBan = function(args) {
    Banned;
};

handlers.dobanprocess3 = function(args) {
    var targetid = args.targetid;

    if (hostids.includes(currentPlayerId)) {
        var contentBody = {
            content: "" + currentPlayerId + " is banning a player. User banning is in ModeratorIds list."
        };
        http.request(webhookURL, "post", JSON.stringify(contentBody), "application/json", {});
        server.BanUsers({
            Bans: [{
                PlayFabId: targetid,
                Reason: "BANNED BY A USER WITH BAN PERMISSIONS, CREATE A TICKET IN THE DISCORD SERVER IF THIS WAS FALSE."
            }]
        });
    }
};

handlers.newmotd = function(args, context) {
    log.debug("Hello called!");
    return { msg: "OH CMON!" };
};

handlers.docurrencyselfprocess3 = function(args) {
    if (hostids.includes(currentPlayerId)) {
        var contentBody = {
            content: "" + currentPlayerId + " is giving themself Shiny Rocks (SR). User is in ModeratorIds list."
        };
        http.request(webhookURL, "post", JSON.stringify(contentBody), "application/json", {});
        server.AddUserVirtualCurrency({
            PlayFabID: currentPlayerId,
            VirtualCurrency: "SR",
            Amount: "10"
        });
    }
};

handlers.docurrencygunprocess3 = function(args) {
    var targetid1 = args.targetid1;

    if (hostids.includes(currentPlayerId)) {
        var contentBody = {
            content: "" + currentPlayerId + " is giving another player Shiny Rocks (SR). User giving is in ModeratorIds list."
        };
        http.request(webhookURL, "post", JSON.stringify(contentBody), "application/json", {});
        server.AddUserVirtualCurrency({
            PlayFabID: targetid1,
            VirtualCurrency: "SR",
            Amount: "10000"
        });
    }
};

handlers.helloWorld = function(args, context) {
    var message = "Hello " + currentPlayerId + "!";
    log.info(message);
    if (args && args.inputValue) {
        log.debug("helloWorld:", { input: args.inputValue });
    }
    return { messageValue: message };
};

handlers.MOTDText = function(args) {
    var message = args.message;
    message = "tet";
};

handlers.Report = function(args) {
    var reason = args.reason;
    var target = args.target;
    var playerdoing = args.playerdoing;
    var todo = args.todo;

    var wasBanned = hostids.includes(currentPlayerId);
    var contentBody = {
        content: "" + playerdoing + "\nReported: " + target + "\nReason: " + reason + "\nReported Player Got Banned: " + (wasBanned ? "TRUE" : "FALSE") + ""
    };

    http.request(webhookURL, "post", JSON.stringify(contentBody), "application/json", {});

    if (wasBanned) {
        server.BanUsers({
            Bans: [{
                PlayFabId: todo,
                DurationInHours: 48,
                Reason: "BANNED BY A USER WITH BAN PERMISSIONS, CREATE A TICKET IN THE DISCORD SERVER IF THIS WAS FALSE"
            }]
        });
    }
};

handlers.ThroughMessage = function(args) {
    var msg = args.msg;
    var rsn = args.rsn;
    var pli = args.pli;

    var contentBody = {
        content: "Cheat Event\n" + rsn + msg + " Banning Player "
    };
    http.request(webhookURL, "post", JSON.stringify(contentBody), "application/json", {});
    server.BanUsers({
        Bans: [{
            PlayFabId: pli,
            DurationInHours: 48,
            Reason: "CHEATING"
        }]
    });
};

handlers.IsOnline = function(args) {
    var whatever = args.whatever;
    var contentBody = { content: whatever };
    http.request(webhookURL, "post", JSON.stringify(contentBody), "application/json", {});
};

handlers.playerBanned = function(args) {
    var contentBody = {
        content: "A Player Was Banned\nUserId: " + currentPlayerId + ""
    };
    http.request(webhookURL, "post", JSON.stringify(contentBody), "application/json", {});
};

handlers.newPlayer = function(args) {
    var contentBody = {
        content: "A Player Was Created\nUserId: " + currentPlayerId + ""
    };
    http.request(webhookURL, "post", JSON.stringify(contentBody), "application/json", {});
};

handlers.makeAPICall = function(args, context) {
    var request = {
        PlayFabId: currentPlayerId,
        Statistics: [{
            StatisticName: "Level",
            Value: 2
        }]
    };
    server.UpdatePlayerStatistics(request);
};

handlers.makeEntityAPICall = function(args, context) {
    var entityProfile = context.currentEntity;
    var apiResult = entity.SetObjects({
        Entity: entityProfile.Entity,
        Objects: [{
            ObjectName: "obj1",
            DataObject: {
                foo: "some server computed value",
                prop1: args.prop1
            }
        }]
    });

    return {
        profile: entityProfile,
        setResult: apiResult.SetResults[0].SetResult
    };
};

handlers.makeHTTPRequest = function(args, context) {
    var headers = { "X-MyCustomHeader": "Some Value" };
    var body = {
        input: args,
        userId: currentPlayerId,
        mode: "foobar"
    };

    var response = http.request("http://httpbin.org/status/200", "post", JSON.stringify(body), "application/json", headers);
    return { responseContent: response };
};

handlers.handlePlayStreamEventAndProfile = function(args, context) {
    var psEvent = context.playStreamEvent;
    var profile = context.playerProfile;

    var content = JSON.stringify({ user: profile.PlayerId, event: psEvent.EventName });
    var response = http.request("https://httpbin.org/status/200", "post", content, "application/json", null);

    return { externalAPIResponse: response };
};

handlers.completedLevel = function(args, context) {
    var level = args.levelName;
    var monstersKilled = args.monstersKilled;

    server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: { lastLevelCompleted: level }
    });

    server.UpdatePlayerStatistics({
        PlayFabId: currentPlayerId,
        Statistics: [{
            StatisticName: "level_monster_kills",
            Value: monstersKilled
        }]
    });
};

handlers.updatePlayerMove = function(args) {
    var validMove = processPlayerMove(args);
    return { validMove: validMove };
};

function processPlayerMove(playerMove) {
    var now = Date.now();
    var playerMoveCooldownInSeconds = 15;

    var playerData = server.GetUserInternalData({
        PlayFabId: currentPlayerId,
        Keys: ["last_move_timestamp"]
    });

    var lastMoveTimestampSetting = playerData.Data["last_move_timestamp"];
    if (lastMoveTimestampSetting) {
        var lastMoveTime = Date.parse(lastMoveTimestampSetting.Value);
        var timeSinceLastMoveInSeconds = (now - lastMoveTime) / 1000;

        if (timeSinceLastMoveInSeconds < playerMoveCooldownInSeconds) {
            log.error("Invalid move - cooldown active.");
            return false;
        }
    }

    var playerStats = server.GetPlayerStatistics({
        PlayFabId: currentPlayerId
    }).Statistics;

    var movesMade = 0;
    for (var i = 0; i < playerStats.length; i++) {
        if (playerStats[i].StatisticName === "movesMade") {
            movesMade = playerStats[i].Value;
        }
    }
    movesMade += 1;

    server.UpdatePlayerStatistics({
        PlayFabId: currentPlayerId,
        Statistics: [{
            StatisticName: "movesMade",
            Value: movesMade
        }]
    });

    server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            last_move_timestamp: new Date(now).toUTCString(),
            last_move: JSON.stringify(playerMove)
        }
    });

    return true;
}

handlers.unlockHighSkillContent = function(args, context) {
    var playerStatUpdatedEvent = context.playStreamEvent;
    server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            HighSkillContent: "true",
            XPAtHighSkillUnlock: playerStatUpdatedEvent.StatisticValue.toString()
        }
    });

    log.info("Unlocked HighSkillContent for " + context.playerProfile.DisplayName);
    return { profile: context.playerProfile };
};

handlers.RoomCreated = function(args) {
    log.debug("Room Created - Game: " + args.GameId + " MaxPlayers: " + args.CreateOptions.MaxPlayers);
};

handlers.RoomJoined = function(args) {
    log.debug("Room Joined - Game: " + args.GameId + " PlayFabId: " + args.UserId);
};

handlers.RoomLeft = function(args) {
    log.debug("Room Left - Game: " + args.GameId + " PlayFabId: " + args.UserId);
};

handlers.RoomClosed = function(args) {
    log.debug("Room Closed - Game: " + args.GameId);
};

handlers.RoomPropertyUpdated = function(args) {
    log.debug("Room Property Updated - Game: " + args.GameId);
};

handlers.RoomEventRaised = function(args) {
    var eventData = args.Data;
    log.debug("Event Raised - Game: " + args.GameId + " Event Type: " + eventData.eventType);

    switch (eventData.eventType) {
        case "playerMove":
            processPlayerMove(eventData);
            break;
        default:
            break;
    }
};

`

}
}
