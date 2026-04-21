include(Resources.id("jsblock:scripts/pids_util.js"));


function create(ctx, state, pids) {
	print("CHTR Modern PIDS loaded");
}

function render(ctx, state, pids) {
	if (pids.type != "pids_projector"){
		Text.create("Incompatibility")
		.text("THIS PIDS IS ONLY COMPATIBLE WITH PIDS PROJECTOR! Use the PIDS projector for it to function properly.")
		.size(pids.width,0)
		.pos(pids.width/2,0)
		.centerAlign()
		.color(0xffffff)
		.wrapText()
		.draw(ctx);
	} else {
		Texture.create("BG 1")
		.texture("mtr:textures/block/white.png")
		.color(0x000000)
		.size(144,68)
		.pos(4, 4)
		.draw(ctx);
		
		Text.create("Current time")
		.text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true))
		.rightAlign()
		.size(20,0)
		.pos(148,4)
		.color(0xff7900)
		.draw(ctx);
		
		let arrivals = pids.arrivals().get(0);
				
		if(arrivals != null) {
			
			Text.create("Current platform")
			.text(TextUtil.cycleString(arrivals.platformName()+"號月台|Platform "+arrivals.platformName()))
			.size(124,0)
			.pos(4,4)
			.color(0xff7900)
			.draw(ctx);
			
			let destinations = arrivals.destination();
					
			let platforms = arrivals.route().getPlatforms();
			let nextStation = "";
							
			for(let i=0; i<platforms.size()-1; i++){
				if(platforms.get(i).getStationName() == pids.station().name){
					nextStation = platforms.get(i+1).getStationName();
					break;
				}
			}
					
			if(arrivals.terminating() == true){
				destinations = "不載客|Not in Service";
			} else if(arrivals.circularState() != "NONE"){
				destinations += "|經"+TextUtil.getCjkParts(nextStation)+"|Via "+TextUtil.getNonCjkParts(nextStation);
			}
			
			Text.create("Arrival")
			.text(TextUtil.cycleString(destinations))
			.size(70,13)
			.color(0xff7900)
			.pos(4, 59)
			.scale(1.5)
			.stretchXY()
			.draw(ctx);
					
			Text.create("Next train text")
			.text(TextUtil.cycleString("下一班列車：|Next train:"))
			.size(90,13)
			.pos(76,40)
			.color(0xff7900)
			.scaleXY()
			.centerAlign()
			.draw(ctx);
					
			let deviation = arrivals.deviation();

			if((arrivals.arrivalTime() - Date.now()) / 1000 < 1) {
				Text.create("ETAArrive")
				.text(TextUtil.cycleString("已到站|Arrived"))
				.size(20,13)
				.color(0xff7900)
				.pos(148, 59)
				.scale(1.5)
				.rightAlign()
				.stretchXY()
				.draw(ctx);
			} else if((arrivals.arrivalTime() - Date.now()) / 1000 >= 1 && deviation < 20){
				Text.create("ETA")
				.text(TextUtil.cycleString(PIDSUtil.getETAText(arrivals.arrivalTime())))
				.size(20,13)
				.color(0xff7900)
				.pos(148, 59)
				.scale(1.5)
				.rightAlign()
				.stretchXY()
				.draw(ctx);
			} else if(deviation >=20){
				Text.create("ETADelayed")
				.text(TextUtil.cycleString("列車延誤|Delayed|最快"+TextUtil.getCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))+"|ETA "+TextUtil.getNonCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))))
				.size(20,13)
				.color(0xff7900)
				.pos(148, 59)
				.scale(1.5)
				.rightAlign()
				.stretchXY()
				.draw(ctx);
			}
					
		Text.create("Station Name")
		.text(TextUtil.cycleString("歡迎光臨"+TextUtil.getCjkParts(pids.station().name)+"|Welcome to "+TextUtil.getNonCjkParts(pids.station().name)))
		.size(96,10)
		.color(0xff7900)
		.pos(76, 24)
		.scale(1.5)
		.centerAlign()
		.stretchXY()
		.draw(ctx);	
		}
	}
}

function dispose(ctx, state, pids) {
	print("CHTR Modern PIDS unloaded");
}