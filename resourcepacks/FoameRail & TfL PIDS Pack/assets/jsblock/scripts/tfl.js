include(Resources.id("jsblock:scripts/pids_util.js"));


function create(ctx, state, pids) {
	print("TfL PIDS loaded");
}

function render(ctx, state, pids) {
	if (pids.type == null){
		let a = 1;
	} else {
		Texture.create("BG yea")
		.texture("mtr:textures/block/white.png")
		.color(0x505090)
		.size(pids.width/2,pids.height)
		.pos(0, 0)
		.draw(ctx);
		
		Texture.create("BG 0")
		.texture("mtr:textures/block/white.png")
		.color(0x202050)
		.size(pids.width/2,20)
		.pos(0, 0)
		.draw(ctx);
		
		Texture.create("BG 1")
		.texture("mtr:textures/block/white.png")
		.color(0xdddddd)
		.size(pids.width/2,pids.height)
		.pos(pids.width/2, 0)
		.draw(ctx);
		
		Texture.create("BG 2")
		.texture("mtr:textures/block/white.png")
		.color(0xffffff)
		.size(pids.width/4,10)
		.pos((pids.width/2)-(pids.width/8), 0)
		.draw(ctx);
		
		Text.create("Current time")
		.text(PIDSUtil.formatTime(MinecraftClient.worldDayTime()))
		.centerAlign()
		.size(pids.width/4,0)
		.pos(pids.width/2,2.5)
		.color(0x000000)
		.draw(ctx);
		
		Texture.create("logo")
		.texture("jsblock:textures/tfl-logo.png")
		.size(pids.height/2,pids.height/2)
		.pos((pids.width/4)*3-(pids.height/4), 5)
		.draw(ctx);	
		
		let nameSize = 10;
		
		if (pids.type == "lcd_pids"){
			nameSize = 6;
		}
		
		Text.create("Station Name")
		.text(TextUtil.getNonCjkParts(pids.station().name))
		.size(pids.width/4.5,20)
		.color(0xffffff)
		.pos(2.5, 2.5)
		.scale(1.5)
		.stretchXY()
		.draw(ctx);
		
		if(pids.rows-2==2) {
			Texture.create("BG A")
			.texture("mtr:textures/block/white.png")
			.color(0x7070b0)
			.size(pids.width/2,30)
			.pos(0, 47.5)
			.draw(ctx);
		}
		
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
				
				if(arrivals.terminating() == true && i==0){
					Text.create("Infotext")
					.text("This train terminates here.")
					.size(pids.width/2-5,20)
					.color(0x000000)
					.pos((pids.width/4)*3, pids.height/(5/3))
					.scale(1)
					.centerAlign()
					.wrapText()
					.draw(ctx);
				} else {
					Text.create("Infotext")
					.text("This train is formed of "+arrivals.carCount()+" coaches.")
					.size(pids.width/2-5,20)
					.color(0x000000)
					.pos((pids.width/4)*3, pids.height/(5/3))
					.scale(1)
					.centerAlign()
					.wrapText()
					.draw(ctx);
				}
				
				if(arrivals.terminating() == true){
					destinationText = "Not in Service";
				} else if(arrivals.circularState() != "NONE"){
					destinationText += "|Via "+TextUtil.getNonCjkParts(nextStation);
				}
				
				let circularTypeCjk = null;
				let circularTypeNonCjk = null;
				
				if(arrivals.circularState() == "ANTICLOCKWISE"){
					circularTypeCjk = "";
					circularTypeNonCjk = "|Anti-Clockwise";
				} else if(arrivals.circularState() == "CLOCKWISE") {
					circularTypeCjk = "";
					circularTypeNonCjk = "|Clockwise";
				} else {
					circularTypeCjk = "";
					circularTypeNonCjk = "";
				}

				Text.create("LineNameNonCjk")
				.text(TextUtil.cycleString(TextUtil.getNonCjkParts(arrivals.routeName())+circularTypeNonCjk))
				.size(80,20)
				.color(0xffffff)
				.stretchXY()
				.scale(0.5)
				.pos(2.5, 18+((i+1)*25))
				.draw(ctx);
				
				Texture.create("BG A")
				.texture("mtr:textures/block/white.png")
				.color(arrivals.routeColor())
				.size(pids.width/2,1)
				.pos(0, 13+((i+1)*25))
				.draw(ctx);
		
				Text.create("Arrival")
				.text(TextUtil.cycleString(TextUtil.getNonCjkParts(destinationText)))
				.size((pids.width/3)-5,20)
				.color(0xffffff)
				.pos(2.5, ((i+1)*25))
				.scale(1.5)
				.stretchXY()
				.draw(ctx);
				
				Texture.create("BG 4")
				.texture("mtr:textures/block/white.png")
				.color(0xffffff)
				.size(20,7.5)
				.pos((pids.width/2)-22.5, 14.25+((i+1)*25))
				.draw(ctx);
				
				let deviation = arrivals.deviation();
				if((arrivals.arrivalTime() - Date.now()) / 1000 < 1) {
					Text.create("ETAArrive")
					.text("Arrived")
					.size(26,20)
					.color(0x000000)
					.pos((pids.width/2)-2.5, 15+((i+1)*25))
					.scale(0.75)
					.rightAlign()
					.stretchXY()
					.draw(ctx);
				} else if((arrivals.arrivalTime() - Date.now()) / 1000 >= 1 && deviation < 20000){
					Text.create("ETA")
					.text(TextUtil.cycleString(PIDSUtil.getETAText(arrivals.arrivalTime())))
					.size(26,20)
					.color(0x000000)
					.pos((pids.width/2)-2.5, 15+((i+1)*25))
					.scale(0.75)
					.rightAlign()
					.stretchXY()
					.draw(ctx);
				} else if(deviation >=20000){
					Text.create("ETADelayed")
					.text(TextUtil.cycleString("Delayed|ETA "+TextUtil.getNonCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))))
					.size(26,20)
					.color(0x000000)
					.pos((pids.width/2)-2.5, 15+((i+1)*25))
					.scale(0.75)
					.rightAlign()
					.stretchXY()
					.draw(ctx);
				}
			}
		}
	}
}

function dispose(ctx, state, pids) {
	print("TfL PIDS unloaded");
}