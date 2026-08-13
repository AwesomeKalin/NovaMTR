include(Resources.id("jsblock:scripts/pids_util.js"));


function create(ctx, state, pids) {
	print("FoameRail Old PIDS loaded");
}

function render(ctx, state, pids) {
	if (pids.type == null){
		let a = 1;
	} else {
		let nameSize = 10;
		
		if (pids.type == "lcd_pids"){
			nameSize = 6;
		}
		
		let customText = "歡迎乘搭泡沫鐵路|Welcome onboard FoameRail";
		
		if (pids.getCustomMessage(0) != ""){
			customText = pids.getCustomMessage(0);
		}
		
		Text.create("Custom text")
		.text(TextUtil.getCjkParts(customText)+TextUtil.getNonCjkParts(customText))
		.size(pids.width/1.6,15)
		.scale(1.5)
		.pos(0,pids.height-15)
		.color(0xff0000)
		.marquee()
		.fontMC()
		.centerAlign()
		.draw(ctx);
		
		for(let i = 0; i < pids.rows-1; i++) {
			let arrivals = pids.arrivals().get(i);
			
			if(arrivals != null) {
				let platforms = arrivals.route().getPlatforms();
				let nextStation = "";
				let destinations = platforms.get(platforms.size()-1).getStationName();
				let destinationText = arrivals.destination();
				
				if(arrivals.terminating() != true){
					for(let i=0; i<platforms.size()-1; i++){
						if(platforms.get(i).getPlatformId() == arrivals.platformId()){
							nextStation = platforms.get(i+1).getStationName();
							break;
						}
					}
				}
				
				let circularTypeCjk = null;
				let circularTypeNonCjk = null;
				
				if(arrivals.circularState() == "ANTICLOCKWISE"){
					circularTypeCjk = "逆時針經";
					circularTypeNonCjk = "|Anti-Clockwise via ";
				} else if(arrivals.circularState() == "CLOCKWISE") {
					circularTypeCjk = "順時針經";
					circularTypeNonCjk = "|Clockwise via ";
				} else {
					circularTypeCjk = "";
					circularTypeNonCjk = "";
				}
				
				if(arrivals.terminating() == true){
					destinationText = "不載客|Not in Service";
				} else if(arrivals.circularState() != "NONE"){
					destinationText = circularTypeCjk+TextUtil.getCjkParts(nextStation)+circularTypeNonCjk+TextUtil.getNonCjkParts(nextStation);
				}
		
				Text.create("Arrival")
				.text((i+1)+". "+TextUtil.cycleString(destinationText))
				.size(pids.width/1.5-35,30)
				.color(0xff0000)
				.pos(0, (i*20)+5)
				.scale(1.5)
				.stretchXY()
				.fontMC()
				.draw(ctx);
				
				let deviation = arrivals.deviation();
				if((arrivals.arrivalTime() - Date.now()) / 1000 < 1) {
					Text.create("ETAArrive")
					.text(TextUtil.cycleString("已到站|Arrived"))
					.size(30,30)
					.color(0xff0000)
					.pos(pids.width, (i*20)+5)
					.scale(1.5)
					.rightAlign()
					.stretchXY()
					.fontMC()
					.draw(ctx);
				} else if((arrivals.arrivalTime() - Date.now()) / 1000 >= 1 && deviation < 20000){
					Text.create("ETA")
					.text(TextUtil.cycleString(PIDSUtil.getETAText(arrivals.arrivalTime())))
					.size(30,30)
					.color(0xff0000)
					.pos(pids.width, (i*20)+5)
					.scale(1.5)
					.rightAlign()
					.stretchXY()
					.fontMC()
					.draw(ctx);
				} else if(deviation >=20000){
					Text.create("ETADelayed")
					.text(TextUtil.cycleString("列車延誤|Delayed|最快"+TextUtil.getCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))+"|ETA "+TextUtil.getNonCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))))
					.size(30,30)
					.color(0xff0000)
					.pos(pids.width, (i*20)+5)
					.scale(1.5)
					.rightAlign()
					.stretchXY()
					.fontMC()
					.draw(ctx);
				}
			}
		}
	}
}

function dispose(ctx, state, pids) {
	print("FoameRail Old PIDS unloaded");
}