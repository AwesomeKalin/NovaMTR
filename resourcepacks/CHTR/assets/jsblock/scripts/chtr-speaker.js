include(Resources.id("jsblock:scripts/pids_util.js"));


function create(ctx, state, pids) {
	state.currentSound = new StateTracker();
	if (state.currentSound.stateNow() == null){
		state.currentSound.setState("off");
	}
}

function render(ctx, state, pids) {
	let soundManager = ctx.getSoundManager();
	
	const specialStations = ["重新點北|Spawn North","北門|Northgate","紅利|Redleigh","牛頓泳池|Newton Lido","牛頓橋|Newton Bridge","赫爾斯頓|Helston","重生點城|Spawn City"];

	arrivals = pids.arrivals().get(0);
	nextArrival = pids.arrivals().get(1);

	if (arrivals){
		if(state.currentSound.stateNow() + "" === "doorClose" && state.currentSound.stateNowDuration() >= 16){
			state.currentSound.setState("off");
			//print("Status is now "+state.currentSound.stateNow());
		} else if(state.currentSound.stateNow() + "" === "doorOpen" && ((arrivals.departureTime() - Date.now()) / 1000 + (arrivals.arrivalTime() - Date.now()) / 1000) <= 10){
			state.currentSound.setState("doorClose");
			//print("Status is now "+state.currentSound.stateNow());
			if(((arrivals.departureTime() - Date.now()) / 1000 + (arrivals.arrivalTime() - Date.now()) / 1000) >= 5){
				soundManager.playSound(Resources.id("jsblock:chtr_door_c"),Vector3f.ZERO,1.0,1.0);
			}
		} else if(state.currentSound.stateNow() + "" === "trainArrive" && (arrivals.arrivalTime() - Date.now()) / 1000 < -1.5){
			state.currentSound.setState("doorOpen");
			//print("Status is now "+state.currentSound.stateNow());
			if((arrivals.arrivalTime() - Date.now()) / 1000 > -6){
				soundManager.playSound(Resources.id("jsblock:chtr_door_o"),Vector3f.ZERO,1.0,1.0);
			}
		} else if(state.currentSound.stateNow() + "" === "off" && (arrivals.arrivalTime() - Date.now()) / 1000 < 20){
			state.currentSound.setState("trainArrive");
			//print("Status is now "+state.currentSound.stateNow());
			//print(specialStations.includes(pids.station().name)+"||"+pids.station().name);
			if((arrivals.arrivalTime() - Date.now()) / 1000 > 15){
				if(!specialStations.includes(String(pids.station().name)) || arrivals.terminating() == true){
					if((arrivals.terminating() == true && nextArrival.terminating() == true) || nextArrival == null){
						soundManager.playSound(Resources.id("jsblock:chtr_nis"),Vector3f.ZERO,1.0,1.0);
					} else if(arrivals.terminating() == true && nextArrival != null && nextArrival.terminating() == false){
						soundManager.playSound(Resources.id("jsblock:chtr_nis_next_train"),Vector3f.ZERO,1.0,1.0);
					} else {
						soundManager.playSound(Resources.id("jsblock:chtr_arrive"),Vector3f.ZERO,1.0,1.0);
					}
				} else {
					//print("DOING EHT "+arrivals.destination());
					switch(String(arrivals.destination())){
						case "巴利日莎海殿|Berryessa Ocean Monument":
							soundManager.playSound(Resources.id("jsblock:chtr_berryessa"),Vector3f.ZERO,1.0,1.0);
							break;
						case "愛爾海·巴利日莎島|Erie Ocean, Berryessa Island":
							soundManager.playSound(Resources.id("jsblock:chtr_erie"),Vector3f.ZERO,1.0,1.0);
							break;
						case "杉木村|Spruce Village":
							soundManager.playSound(Resources.id("jsblock:chtr_spruce"),Vector3f.ZERO,1.0,1.0);
							break;
						case "重生點城|Spawn City":
							if(TextUtil.getNonCjkParts(arrivals.routeName()) == "Spawn City Line"){
								soundManager.playSound(Resources.id("jsblock:chtr_spawn"),Vector3f.ZERO,1.0,1.0);
							} else if(arrivals.circularState() == "CLOCKWISE"){
								soundManager.playSound(Resources.id("jsblock:chtr_clockwise"),Vector3f.ZERO,1.0,1.0);
							} else {
								soundManager.playSound(Resources.id("jsblock:chtr_anticlockwise"),Vector3f.ZERO,1.0,1.0);
							}
							break;
						case "紅利北|Redleigh North":
							soundManager.playSound(Resources.id("jsblock:chtr_redleigh"),Vector3f.ZERO,1.0,1.0);
							break;
						case "赫爾斯頓|Helston":
							if(TextUtil.getNonCjkParts(arrivals.routeName()) == "Helston Line"){
								soundManager.playSound(Resources.id("jsblock:chtr_helston_hsl"),Vector3f.ZERO,1.0,1.0);
							} else {
								soundManager.playSound(Resources.id("jsblock:chtr_helston_bgl"),Vector3f.ZERO,1.0,1.0);
							}
							break;
						case "伯克斯西|Berks West":
							soundManager.playSound(Resources.id("jsblock:chtr_berks"),Vector3f.ZERO,1.0,1.0);
							break;
						case "背爾頓原|Belton Green":
							soundManager.playSound(Resources.id("jsblock:chtr_belton"),Vector3f.ZERO,1.0,1.0);
							break;
						default:
							soundManager.playSound(Resources.id("jsblock:chtr_arrive"),Vector3f.ZERO,1.0,1.0);
					}
				}
			}
		}
	}
}

function dispose(ctx, state, pids) {
	
}