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
	
	if (pids.type == null){
		let a = 1;
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
		.text(PIDSUtil.formatTime(MinecraftClient.worldDayTime()))
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
			
			if (pids.type != "pids_1a"){
				Texture.create("BG 4")
				.texture("mtr:textures/block/white.png")
				.color(0xffff88)
				.size(pids.width,14)
				.pos(0, 51)
				.draw(ctx);
			}
			
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
			
			arrivals = pids.arrivals().get(0);
			nextArrival = pids.arrivals().get(1);
			
			if(arrivals){
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
			
			for(let i = 0; i < pids.rows; i++) {
				arrivals = pids.arrivals().get(i);
				
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
					.text(TextUtil.cycleString(destinationText))
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
					} else if((arrivals.arrivalTime() - Date.now()) / 1000 >= 1 && deviation < 2000){
						Text.create("ETA")
						.text(TextUtil.cycleString(PIDSUtil.getETAText(arrivals.arrivalTime())))
						.size(20,13)
						.color(0x000000)
						.pos(pids.width, (i+1)*13)
						.scale(1.5)
						.rightAlign()
						.stretchXY()
						.draw(ctx);
					} else if(deviation >=2000){
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
				}
			}
		} else {
			
			Texture.create("BG 3")
			.texture("mtr:textures/block/white.png")
			.color(0xffff88)
			.size(pids.width,14)
			.pos(0, pids.height-14)
			.draw(ctx);
			
			arrivals = pids.arrivals().get(0);
			nextArrival = pids.arrivals().get(1);
			
			if (arrivals != null){
			
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
				
				let platforms = arrivals.route().getPlatforms();
				let destinations = platforms.get(platforms.size()-1).getStationName();
				let destinationText = arrivals.destination();
				let lastStation = "";
				let nextStation = "";
				let startingStation = false;
				
				if(platforms.get(0).getPlatformId() == arrivals.platformId() && arrivals.terminating() != true){
					startingStation = true;
				}
				
				for(let i=0; i<platforms.size()-1; i++){
					if(platforms.get(i+1).getPlatformId() == arrivals.platformId()){
						lastStation = platforms.get(i).getStationName();
						break;
					}
				}
				
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
					.texture("mtr:arrow-flipped.png")
					.color(arrow1)
					.size(6,6)
					.pos((pids.width/4), (pids.height/2)-5)
					.draw(ctx);
				}
				
				if (arrivals.terminating() == false){
					Texture.create("Arrow 2")
					.texture("mtr:arrow-flipped.png")
					.color(arrow2)
					.size(6,6)
					.pos((pids.width/4)*3, (pids.height/2)-5)
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
				.text(TextUtil.cycleString(destinationText))
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
				} else if((arrivals.arrivalTime() - Date.now()) / 1000 >= 1 && deviation < 2000){
					Text.create("ETA")
					.text(TextUtil.cycleString(PIDSUtil.getETAText(arrivals.arrivalTime())))
					.size(20,13)
					.color(0x000000)
					.pos(pids.width, pids.height-13)
					.scale(1.5)
					.rightAlign()
				.stretchXY()
					.draw(ctx);
				} else if(deviation >=2000){
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
}

function dispose(ctx, state, pids) {
	
}