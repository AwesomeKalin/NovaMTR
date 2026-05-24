include(Resources.id("jsblock:scripts/pids_util.js"));


function create(ctx, state, pids) {
	print("FoameRail Standard PIDS loaded");
}

function render(ctx, state, pids) {
	if (pids.type == null){
		let a = 1;
	} else {
		Texture.create("BG 1")
		.texture("mtr:textures/block/white.png")
		.color(0xffffff)
		.size(pids.width,pids.height)
		.pos(0, 0)
		.draw(ctx);
		
		Texture.create("BG 2")
		.texture("mtr:textures/block/white.png")
		.color(0x50a900)
		.size(pids.width,10)
		.pos(0, 0)
		.draw(ctx);
		
		Text.create("Current time")
		.text(PIDSUtil.formatTime(MinecraftClient.worldDayTime()))
		.rightAlign()
		.size(pids.width,0)
		.pos(pids.width,0)
		.color(0xffffff)
		.draw(ctx);
		
		Texture.create("logo")
		.texture("jsblock:textures/foamerail-logo.png")
		.size(12,12)
		.pos(1, -1)
		.draw(ctx);		
	
		Texture.create("BG 2")
		.texture("mtr:textures/block/white.png")
		.color(0x207900)
		.size(pids.width,10)
		.pos(0, pids.height-10)
		.draw(ctx);
		
		let nameSize = 10;
		
		if (pids.type == "lcd_pids"){
			nameSize = 6;
		}
		
		Text.create("Station Name")
		.text(TextUtil.cycleString(pids.station().name))
		.size(pids.width,nameSize)
		.color(0xffffff)
		.pos(pids.width/2, pids.height-nameSize)
		.scale(1)
		.centerAlign()
		.scaleXY()
		.draw(ctx);
		
		Text.create("Next Train")
		.text(TextUtil.cycleString("下班列車:|Next Train:"))
		.size(pids.width,10)
		.color(0x000000)
		.pos(2.5, 15)
		.scale(1)
		.scaleXY()
		.draw(ctx);
		
		for(let i = 0; i < pids.rows-2; i++) {
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
				
				if(arrivals.terminating() == true){
					destinationText = "不載客|Not in Service";
				} else if(arrivals.circularState() != "NONE"){
					destinationText += "|經"+TextUtil.getCjkParts(nextStation)+"|Via "+TextUtil.getNonCjkParts(nextStation);
				}
				
				let circularTypeCjk = null;
				let circularTypeNonCjk = null;
				
				if(arrivals.circularState() == "ANTICLOCKWISE"){
					circularTypeCjk = "|逆時針";
					circularTypeNonCjk = "|Anti-Clockwise";
				} else if(arrivals.circularState() == "CLOCKWISE") {
					circularTypeCjk = "|順時針";
					circularTypeNonCjk = "|Clockwise";
				} else {
					circularTypeCjk = "";
					circularTypeNonCjk = "";
				}
				
				Texture.create("Line colour BG")
				.texture("mtr:textures/block/white.png")
				.color(arrivals.routeColor())
				.size(35,12)
				.pos(2.5, 10+((i+1)*20))
				.draw(ctx);
				Text.create("LineNameCjk")
				.text(TextUtil.cycleString(TextUtil.getCjkParts(arrivals.routeName())+circularTypeCjk))
				.size(35,20)
				.centerAlign()
				.color(0xffffff)
				.stretchXY()
				.scale(0.875)
				.pos(20, 10+((i+1)*20))
				.draw(ctx);
				Text.create("LineNameNonCjk")
				.text(TextUtil.cycleString(TextUtil.getNonCjkParts(arrivals.routeName())+circularTypeNonCjk))
				.size(80,20)
				.centerAlign()
				.color(0xffffff)
				.stretchXY()
				.scale(0.5)
				.pos(20, 18+((i+1)*20))
				.draw(ctx);
				
				Text.create("ArrivalNonCjk")
				.text(TextUtil.getNonCjkParts(destinationText))
				.size((pids.width-70)*1.525,20)
				.color(0x000000)
				.pos(40, 18+((i+1)*20))
				.scale(0.625)
				.stretchXY()
				.draw(ctx);
		
				Text.create("Arrival")
				.text(TextUtil.getCjkParts(destinationText))
				.size(pids.width-70,20)
				.color(0x000000)
				.pos(40, ((i+1)*20)+8)
				.scale(1)
				.stretchXY()
				.draw(ctx);
				
				Text.create("Next train text")
				.text(TextUtil.cycleString("泡沫鐵路|FoameRail"))
				.size(90,12)
				.pos(14,0)
				.color(0xffffff)
				.scaleXY()
				.draw(ctx);
				
				let deviation = arrivals.deviation();
				if((arrivals.arrivalTime() - Date.now()) / 1000 < 1) {
					Text.create("ETAArrive")
					.text(TextUtil.cycleString("已到站|Arrived"))
					.size(20,20)
					.color(0x000000)
					.pos(pids.width, 10+((i+1)*20))
					.scale(1.5)
					.rightAlign()
					.stretchXY()
					.draw(ctx);
				} else if((arrivals.arrivalTime() - Date.now()) / 1000 >= 1 && deviation < 20000){
					Text.create("ETA")
					.text(TextUtil.cycleString(PIDSUtil.getETAText(arrivals.arrivalTime())))
					.size(20,20)
					.color(0x000000)
					.pos(pids.width, 10+((i+1)*20))
					.scale(1.5)
					.rightAlign()
					.stretchXY()
					.draw(ctx);
				} else if(deviation >=20000){
					Text.create("ETADelayed")
					.text(TextUtil.cycleString("列車延誤|Delayed|最快"+TextUtil.getCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))+"|ETA "+TextUtil.getNonCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))))
					.size(20,20)
					.color(0x000000)
					.pos(pids.width, 10+((i+1)*20))
					.scale(1.5)
					.rightAlign()
					.stretchXY()
					.draw(ctx);
				}
			}
		}
	}
}

function dispose(ctx, state, pids) {
	print("FoameRail Standard PIDS unloaded");
}