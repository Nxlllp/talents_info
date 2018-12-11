const epexpp = require('./epexp.json');

module.exports = function talentsinfo(mod) {
	const command = mod.command || mod.require.command;
	let warned = false;
	let lvl = 0,
	exp = 0,
	dexp = 0,
	dcap = 0;

    // message on command
    command.add(['talent', 'talents', 'EP', '!EP'], msg);

    // send message exp/cap (exp%)
    function msg()
	{
        command.message(`<font color="#FDD017">Talents info:</font> LVL <font color="#00FFFF">${lvl}</font>, EXP: <font color="#00FFFF">${exp}</font>, soft DailyEXP <font color="#00FFFF">${dexp}/${sdcap()} (${Math.round(100*dexp/sdcap())}%)</font>`);
	}
	
	// calc sdcap
	function sdcap()
	{
		const softcap = 0.8901403358192;
		return Math.floor(dcap * softcap);
	}	
	
	mod.hook('S_LOAD_EP_INFO', 1, event => {
		exp = event.exp;
		lvl = event.level;
		dexp = event.dailyExp;
		dcap = event.dailyExpMax;
	});

	mod.hook('S_PLAYER_CHANGE_EP', 1, event => {
		let gained = event.expDifference;
		let exp = event.exp;
		let lvl = event.level;
		let dexp = event.dailyExp;
		let dcap = event.dailyExpMax;
		let scmod = Math.round(event.tsRev * 100);
	if (gained)
	{
		if (dexp >= sdcap())
		{
			if(!warned)
				{
					command.message('<font color="#FDD017">Talents EXP</font> Daily SoftCap <font color="#FF0000">reached!</font>');
					warned = true;	  
				}
		}	else	{
		warned = false;
		}
      let message = `<font color="#00FFFF">+${gained} EXP</font>`;
      if (warned)
    {
        message += `(${scmod}% mod)`;
	}	else	{
        message += `(${dexp}/${sdcap()}) (Daily Cap), <font color="#FFF380">${sdcap() - dexp}</font> EXP left for today uncapped)`;
    }
      command.message(message);
	  let epexp;
	  let epexp2;
	  let epp;
	  let epp2;
		if (epexp = epexpp.filter(b => b.level === lvl)[0]) {
		  epp = epexp.exp;
		if (epexp2 = epexpp.filter(b => b.level === lvl -1)[0]) {
		  epp2 = epexp2.exp;
		  //mmm = exp;
		 let mmm = Math.round((Number(exp)-epp2)/(epp-epp2)*1000) / 10;
			mod.command.message(`<font color="#FDD017"> EXP : </font><font color="#00FFFF">${exp} / ${epp} (${mmm}%)</font>`);
		};};	  
	  
    }
	});

	
	// open EP ui
    mod.hook('C_REQUEST_CONTRACT', 1, event => {
        if (event.type == 77)
		{
            msg();
        }
	});
};
