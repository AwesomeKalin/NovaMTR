include(Resources.id("jsblock:scripts/pids_util.js"));


function create(ctx, state, pids) {
	print("CHTR Modern PIDS loaded");
}

function render(ctx, state, pids) {
	if (pids.type == "pids_1a"){
		Text.create("Incompatibility")
		.text("THIS PIDS IS NOT COMPATIBLE WITH PIDS 1A! Use anything but this PIDS for it to function properly.")
		.size(pids.width,0)
		.pos(pids.width/2,0)
		.centerAlign()
		.color(0xffffff)
		.wrapText()
		.draw(ctx);
	} else {
		state.cycle = new CycleTracker(["nah", 12, "yeah", 12]);
		state.cycle.tick();
		state.nextTrainCycle = new CycleTracker(["white", 1, "non-white", 1]);
		state.nextTrainCycle.tick();
		
		Texture.create("BG 1")
		.texture("mtr:textures/block/white.png")
		.color(0xffffff)
		.size(pids.width,pids.height)
		.pos(0, 0)
		.draw(ctx);
		
		Texture.create("BG 2")
		.texture("mtr:textures/block/white.png")
		.color(0x797900)
		.size(pids.width,10)
		.pos(0, 0)
		.draw(ctx);
		
		Text.create("Current time")
		.text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true))
		.rightAlign()
		.size(pids.width,0)
		.pos(pids.width,0)
		.color(0xffffff)
		.draw(ctx);
		
		Texture.create("logo")
		.texture("mtr:chtr_logo.png")
		.size(12,12)
		.pos(1, -1)
		.draw(ctx);
		
		if(state.cycle.stateNow() + "" === "yeah"){
			Texture.create("BG 2")
			.texture("mtr:textures/block/white.png")
			.color(0x797900)
			.size(pids.width,10)
			.pos(0, pids.height-10)
			.draw(ctx);
			
			Texture.create("BG 3")
			.texture("mtr:textures/block/white.png")
			.color(0xffff88)
			.size(pids.width,14)
			.pos(0, 25)
			.draw(ctx);
			
			Texture.create("BG 4")
			.texture("mtr:textures/block/white.png")
			.color(0xffff88)
			.size(pids.width,14)
			.pos(0, 51)
			.draw(ctx);
			
			for(let i = 0; i < pids.rows; i++) {
				let arrivals = pids.arrivals().get(i);
				
				if(arrivals != null) {
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
					.size(30,12)
					.pos(2.5, (i+1)*13)
					.draw(ctx);

					Text.create("LineNameCjk")
					.text(TextUtil.cycleString(TextUtil.getCjkParts(arrivals.routeName())+circularTypeCjk))
					.size(30,13)
					.centerAlign()
					.color(0xffffff)
					.stretchXY()
					.scale(0.875)
					.pos(17.5, (i+1)*13)
					.draw(ctx);

					Text.create("LineNameNonCjk")
					.text(TextUtil.cycleString(TextUtil.getNonCjkParts(arrivals.routeName())+circularTypeNonCjk))
					.size(80,13)
					.centerAlign()
					.color(0xffffff)
					.stretchXY()
					.scale(0.375)
					.pos(17.5, 8+((i+1)*13))
					.draw(ctx);
			
					Text.create("Arrival")
					.text(TextUtil.cycleString(destinations))
					.size(45,13)
					.color(0x000000)
					.pos(70, (i+1)*13)
					.scale(1.5)
					.centerAlign()
					.stretchXY()
					.draw(ctx);
					
					Text.create("Next train text")
					.text(TextUtil.cycleString("下一班列車：|Next train:|"+arrivals.platformName()+"號月台|Platform "+arrivals.platformName()))
					.size(90,12)
					.pos(14,0)
					.color(0xffffff)
					.scaleXY()
					.draw(ctx);
					
					let deviation = arrivals.deviation();

					if((arrivals.arrivalTime() - Date.now()) / 1000 < 1) {
						Text.create("ETAArrive")
						.text(TextUtil.cycleString("已到站|Arrived"))
						.size(20,13)
						.color(0x000000)
						.pos(pids.width, (i+1)*13)
						.scale(1.5)
						.rightAlign()
						.stretchXY()
						.draw(ctx);
					} else if((arrivals.arrivalTime() - Date.now()) / 1000 >= 1 && deviation < 20){
						Text.create("ETA")
						.text(TextUtil.cycleString(PIDSUtil.getETAText(arrivals.arrivalTime())))
						.size(20,13)
						.color(0x000000)
						.pos(pids.width, (i+1)*13)
						.scale(1.5)
						.rightAlign()
					.stretchXY()
						.draw(ctx);
					} else if(deviation >=20){
						Text.create("ETADelayed")
						.text(TextUtil.cycleString("列車延誤|Delayed|最快"+TextUtil.getCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))+"|ETA "+TextUtil.getNonCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))))
						.size(20,13)
						.color(0x000000)
						.pos(pids.width, (i+1)*13)
						.scale(1.5)
						.rightAlign()
						.stretchXY()
						.draw(ctx);
					}
					
					Text.create("Station Name")
					.text(TextUtil.cycleString(pids.station().name))
					.size(pids.width,10)
					.color(0xffffff)
					.pos(pids.width/2, pids.height-10)
					.scale(1)
					.centerAlign()
					.scaleXY()
					.draw(ctx);
				}
			}
		} else {
			
			Texture.create("BG 3")
			.texture("mtr:textures/block/white.png")
			.color(0xffff88)
			.size(pids.width,14)
			.pos(0, pids.height-14)
			.draw(ctx);
			
			let arrivals = pids.arrivals().get(0);
			
			let destinations = arrivals.destination();
			
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
			
			let platforms = arrivals.route().getPlatforms();
			let lastStation = "";
			let nextStation = "";
			let startingStation = false;
			
			if(platforms.get(0).getStationName() == pids.station().name){
				startingStation = true;
			}
			
			for(let i=0; i<platforms.size()-1; i++){
				if(platforms.get(i+1).getStationName() == pids.station().name){
					lastStation = platforms.get(i).getStationName();
					break;
				}
			}
			
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
			
			if (startingStation == false){
				Text.create("Last stop")
				.text(TextUtil.cycleString(lastStation))
				.size(50,6)
				.color(0x888888)
				.pos(0, pids.height/2+4)
				.scale(1)
				.scaleXY()
				.draw(ctx);
				
				Texture.create("Line colour BG 2")
				.texture("mtr:textures/block/white.png")
				.color(arrivals.routeColor())
				.size(pids.width/2,6)
				.pos(0, (pids.height/2)-5)
				.draw(ctx);
			}
			
			if (arrivals.terminating() == false){
				Texture.create("Line colour BG 2")
				.texture("mtr:textures/block/white.png")
				.color(arrivals.routeColor())
				.size(pids.width/2,6)
				.pos(pids.width/2, (pids.height/2)-5)
				.draw(ctx);
			}
			
			Texture.create("Station circle")
			.texture("mtr:textures/block/station_circle.png")
			.size(12,12)
			.pos((pids.width/2)-6, (pids.height/2)-8)
			.draw(ctx);
			
			let rotate180 = new Matrices();
			rotate180.rotateZDegrees(180.0);
			
			let flashingArrow = null;
			let nsColor = null;
			
			if(state.nextTrainCycle.stateNow() + "" === "white"){
				flashingArrow = 0xffffff;
				nsColor = 0x000000;
			} else {
				flashingArrow = 0x88ff88;
				nsColor = 0x00bb00;
			}
			
			let arrow1 = flashingArrow;
			let arrow2 = 0x888888;
			
			if((arrivals.arrivalTime() - Date.now()) / 1000 < 1){
				arrow1 = 0x888888;
				arrow2 = flashingArrow;
			} else {
				arrow1 = flashingArrow;
				arrow2 = 0x888888;
			}
			
			Text.create("Next train text")
			.text(TextUtil.cycleString("歡迎乘搭巢鐵|Welcome onboard CHTR|"+arrivals.platformName()+"號月台|Platform "+arrivals.platformName()))
			.size(90,12)
			.pos(14,0)
			.scaleXY()
			.color(0xffffff)
			.draw(ctx);
			
			if (startingStation == false){
				Texture.create("Arrow")
				.texture("mtr:textures/block/sign/arrow.png")
				.matrices(rotate180)
				.color(arrow1)
				.size(6,6)
				.pos((pids.width/4)-65, (pids.height/2)-77)
				.draw(ctx);
			}
			
			if (arrivals.terminating() == false){
				Texture.create("Arrow 2")
				.texture("mtr:textures/block/sign/arrow.png")
				.matrices(rotate180)
				.color(arrow2)
				.size(6,6)
				.pos((pids.width/4)-145, (pids.height/2)-77)
				.draw(ctx);
				
				Text.create("Next stop")
				.text(TextUtil.cycleString(nextStation))
				.size(50,6)
				.color(nsColor)
				.pos(pids.width, pids.height/2+4)
				.scale(1)
				.scaleXY()
				.rightAlign()
				.draw(ctx);
			}
			
			Texture.create("Line colour BG")
			.texture("mtr:textures/block/white.png")
			.color(arrivals.routeColor())
			.size(30,12)
			.pos(2.5, pids.height-13)
			.draw(ctx);

			Text.create("LineNameCjk")
			.text(TextUtil.cycleString(TextUtil.getCjkParts(arrivals.routeName())+circularTypeCjk))
			.size(30,13)
			.centerAlign()
			.color(0xffffff)
			.stretchXY()
			.scale(0.875)
			.pos(17.5, pids.height-13)
			.draw(ctx);

			Text.create("LineNameNonCjk")
			.text(TextUtil.cycleString(TextUtil.getNonCjkParts(arrivals.routeName())+circularTypeNonCjk))
			.size(80,13)
			.centerAlign()
			.color(0xffffff)
			.stretchXY()
			.scale(0.375)
			.pos(17.5, 8+pids.height-13)
			.draw(ctx);
			
			Text.create("Arrival")
			.text(TextUtil.cycleString(destinations))
			.size(45,13)
			.color(0x000000)
			.pos(70, pids.height-13)
			.scale(1.5)
			.centerAlign()
			.stretchXY()
			.draw(ctx);
			
			Text.create("Station Name")
			.text(TextUtil.cycleString(pids.station().name))
			.size(80,13)
			.color(0x000000)
			.pos(pids.width/2, (pids.height/2)-21)
			.scale(1.5)
			.centerAlign()
			.stretchXY()
			.draw(ctx);
					
			let deviation = arrivals.deviation();

			if((arrivals.arrivalTime() - Date.now()) / 1000 < 1) {
				Text.create("ETAArrive")
				.text(TextUtil.cycleString("已到站|Arrived"))
				.size(20,13)
				.color(0x000000)
				.pos(pids.width, pids.height-13)
				.scale(1.5)
				.rightAlign()
				.stretchXY()
				.draw(ctx);
			} else if((arrivals.arrivalTime() - Date.now()) / 1000 >= 1 && deviation < 20){
				Text.create("ETA")
				.text(TextUtil.cycleString(PIDSUtil.getETAText(arrivals.arrivalTime())))
				.size(20,13)
				.color(0x000000)
				.pos(pids.width, pids.height-13)
				.scale(1.5)
				.rightAlign()
			.stretchXY()
				.draw(ctx);
			} else if(deviation >=20){
				Text.create("ETADelayed")
				.text(TextUtil.cycleString("列車延誤|Delayed|最快"+TextUtil.getCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))+"|ETA "+TextUtil.getNonCjkParts(PIDSUtil.getETAText(arrivals.arrivalTime()))))
				.size(20,13)
				.color(0x000000)
				.pos(pids.width, pids.height-13)
				.scale(1.5)
				.rightAlign()
				.stretchXY()
				.draw(ctx);
			}
		}
	}
}

function dispose(ctx, state, pids) {
	print("CHTR Modern PIDS unloaded");
}