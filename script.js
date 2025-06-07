function generate() {
    document.getElementById('output').textContent = `
handlers.ReturnCurrentVersionNew = function(args){
    return {"ResultCode":0,"BannedUsers":"` + document.getElementById('banned').value + `","MOTD":"<color=red>PLEASE DUPLICATE THE MOTD TEXT AND DELETE THE FIRST ONE THEN EDIT THE TEXT ON THE DUPLICATED ONE!</color>","SynchTime":"-LOADING-","Version":"` + document.getElementById('ver').value + `", "Message":"` + document.getElementById('ver').value + `"}
}`
}
