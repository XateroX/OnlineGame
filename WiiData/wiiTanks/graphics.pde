class graphics{
    /*
    Manages all displaying of assets
    */
    //pass

    graphics(){
        //pass
    }

    void displayState(int state){
        if(state == 0){
            displayInMatch(cManager.cStage);
        }
        if(state == 1){
            displayTransition_missionSuccess(cManager.cTransition_missionSuccess, cManager.cInfo);
        }
        if(state == 2){
            displayTransition_missionFail(cManager.cTransition_missionFail, cManager.cInfo);
        }
        //...
    }


    void displayInMatch(stage cStage){
        displayLighting(); 
        displayBackground();
        displayMines(cStage);
        displayTanks(cStage);
        displayShells(cStage);
        displayTiles(cStage);
    }
    void displayLighting(){
        pushStyle();

        //spotLight(200,200,200, width/2.0 +300, height/2.0, 1200, -1, 0, 0, PI/2, 0.001);

        popStyle();
    }
    void displayBackground(){
        //background(30,30,60);
        pushStyle();
        imageMode(CORNER);
        //image(background_wood, 0,0, width,height);
        popStyle();
    }
    void displayMines(stage cStage){
        for(int i=0; i<cStage.mines.size(); i++){
            displayMine(cStage.mines.get(i), cStage);
        }
    }
    void displayTanks(stage cStage){
        displayAiTanks(cStage);
        displayPlayerTanks(cStage);
    }
    void displayAiTanks(stage cStage){
        for(int i=0; i<cStage.ai_tanks.size(); i++){
            displayTank(cStage.ai_tanks.get(i), cStage);
        }
    }
    void displayPlayerTanks(stage cStage){
        for(int i=0; i<cStage.player_tanks.size(); i++){
            displayTank(cStage.player_tanks.get(i), cStage);
        }
    }
    void displayShells(stage cStage){
        for(int i=0; i<cStage.shells.size(); i++){
            displayShell(cStage.shells.get(i), cStage);
        }
    }

    //Simplified
    void displayTank(tank cTank, stage cStage){
        pushStyle();
        pushMatrix();

        translate(cStage.startPos.x, cStage.startPos.y, cStage.startPos.z);
        translate(cTank.pos.x, cTank.pos.y);

        //Chassis
        pushMatrix();
        fill(250,250,250);
        rotate(cTank.cChassis.rotation);
        rectMode(CENTER);
        rect(0,0,cTank.dim.x*cStage.tWidth,cTank.dim.y*cStage.tWidth);

        stroke(0,255,0);       //
        strokeWeight(5);       // BUGFIXING DIR LINES
        line(0,0,0,   30,0,0); //

        popMatrix();

        //Turret
        pushMatrix();
        fill(70,70,70);
        stroke(255,0,0);
        strokeWeight(4);
        //translate(0,0, cTank.thRatio*cStage.tWidth);
        rotate(cTank.cTurret.rotation);
        rect(0,0, cTank.dim.x*cStage.tWidth*0.5, cTank.dim.y*cStage.tWidth*0.5);

        stroke(255,0,0);       //
        strokeWeight(5);       // BUGFIXING DIR LINES
        line(0,0,0,   20,0,0); //
        
        popMatrix();    

        popMatrix();
        popStyle();
    }
    void displayShell(shell cShell, stage cStage){
        pushStyle();
        pushMatrix();

        translate(cStage.startPos.x, cStage.startPos.y, cStage.startPos.z);

        fill(255,0,0);
        translate(cShell.pos.x, cShell.pos.y);
        ellipse(0,0, cShell.dim.x*cStage.tWidth, cShell.dim.y*cStage.tWidth);

        popMatrix();
        popStyle();
    }
    void displayMine(mine cMine, stage cStage){
        pushStyle();
        pushMatrix();

        translate(cStage.startPos.x, cStage.startPos.y, cStage.startPos.z);

        fill(255,0,0);
        translate(cMine.pos.x, cMine.pos.y);
        rectMode(CENTER);
        rect(0,0, cMine.dim.x*cStage.tWidth, cMine.dim.y*cStage.tWidth);

        translate(0,0,0.5*cStage.tWidth);
        noFill();
        strokeWeight(3);
        stroke(200,0,0,125);
        ellipse(0,0, 2.0*cMine.explodeRad*cStage.tWidth, 2.0*cMine.explodeRad*cStage.tWidth);
        stroke(0,200,0,125);
        ellipse(0,0, 2.0*cMine.activeRad*cStage.tWidth, 2.0*cMine.activeRad*cStage.tWidth);

        popMatrix();
        popStyle();
    }
    void displayTiles(stage cStage){
        pushStyle();
        pushMatrix();

        rectMode(CENTER);

        translate(cStage.startPos.x, cStage.startPos.y, cStage.startPos.z);

        fill(255);
        stroke(0);
        strokeWeight(1);
        for(int j=0; j<cStage.tiles.size(); j++){
            for(int i=0; i<cStage.tiles.get(j).size(); i++){
                pushMatrix();
                translate(i*cStage.tWidth, j*cStage.tWidth);
                noFill();
                noStroke();
                if(cStage.tiles.get(j).get(i).name == "tile_crate"){
                    fill(255,0,0);}
                if(cStage.tiles.get(j).get(i).name == "tile_cork"){
                    fill(0,255,0);}
                if(cStage.tiles.get(j).get(i).name == "tile_hole"){
                    fill(0,0,255);}
                rect(0,0,cStage.tWidth,cStage.tWidth);
                popMatrix();
            }
        }

        popMatrix();
        popStyle();
    }

    //Modelled
    /*
    void displayTiles(stage cStage){
        pushStyle();
        pushMatrix();

        translate(cStage.startPos.x, cStage.startPos.y, cStage.startPos.z);

        for(int j=0; j<cStage.tiles.size(); j++){
            for(int i=0; i<cStage.tiles.get(j).size(); i++){
                pushMatrix();
                translate(i*cStage.tWidth, j*cStage.tWidth);
                if(cStage.tiles.get(j).get(i).model != null){
                    shape(cStage.tiles.get(j).get(i).model, 0,0, cStage.tWidth, cStage.tWidth);}
                popMatrix();
            }
        }

        popMatrix();
        popStyle();
    }
    void displayTank(tank cTank, stage cStage){
        pushStyle();
        pushMatrix();

        translate(cStage.startPos.x, cStage.startPos.y, cStage.startPos.z);
        translate(cTank.pos.x, cTank.pos.y, cTank.pos.z);

        //Chassis
        pushMatrix();
        //shapeMode(CENTER);
        rotateZ(cTank.cChassis.rotation);
        shape(cTank.cChassis.model, 0,0, cTank.dim.x*cStage.tWidth, cTank.dim.y*cStage.tWidth);

        //stroke(0,255,0);       //
        //strokeWeight(5);       // BUGFIXING DIR LINES
        //line(0,0,0,   30,0,0); //

        popMatrix();

        //Turret
        pushMatrix();
        translate(0,0, cTank.thRatio*cStage.tWidth);
        rotateZ(cTank.cTurret.rotation);
        shape(cTank.cTurret.model, 0,0, cTank.dim.x*cStage.tWidth*0.9, cTank.dim.y*cStage.tWidth*0.7);

        //stroke(255,0,0);       //
        //strokeWeight(5);       // BUGFIXING DIR LINES
        //line(0,0,0,   20,0,0); //
        
        popMatrix();    

        popMatrix();
        popStyle();
    }
    void displayShell(shell cShell, stage cStage){
        pushStyle();
        pushMatrix();

        translate(cStage.startPos.x, cStage.startPos.y, cStage.startPos.z);

        translate(cShell.pos.x, cShell.pos.y, cShell.pos.z);
        shape(cShell.model, 0,0, cShell.dim.x*cStage.tWidth, cShell.dim.y*cStage.tWidth);

        popMatrix();
        popStyle();
    }
    void displayMine(mine cMine, stage cStage){
        pushStyle();{}
        pushMatrix();
        shapeMode(CENTER);

        translate(cStage.startPos.x, cStage.startPos.y, cStage.startPos.z);

        fill(255,0,0);
        translate(cMine.pos.x, cMine.pos.y, cMine.pos.z);
        box(cMine.dim.x*cStage.tWidth);

        translate(0,0,0.5*cStage.tWidth);
        noFill();
        strokeWeight(3);
        stroke(200,0,0,125);
        ellipse(0,0, 2.0*cMine.explodeRad*cStage.tWidth, 2.0*cMine.explodeRad*cStage.tWidth);
        stroke(0,200,0,125);
        ellipse(0,0, 2.0*cMine.activeRad*cStage.tWidth, 2.0*cMine.activeRad*cStage.tWidth);
        //####
        //## MODEL NEEDS TO BE MADE
        //####

        popMatrix();
        popStyle();
    }
    */


    //Mission Success Transition
    void displayTransition_missionSuccess(transition_missionSuccess cTransition, info cInfo){
        display_label(cTransition.cState);
    }
    //Mission Fail Transition
    void displayTransition_missionFail(transition_missionFail cTransition, info cInfo){
        display_label(cTransition.cState);
    }
    void display_label(String labelName){
        if(labelName == "banner_roundEnd"){
            display_label_bannerRoundEnd();}
        if(labelName == "black"){
            display_label_black();}
        if(labelName == "screen_stats"){
            display_label_screenStats();}
        if(labelName == "banner_roundStart"){
            display_label_bannerRoundStart();}
    }
    void display_label_bannerRoundEnd(){
        pushStyle();
        rectMode(CENTER);
        textAlign(CENTER,CENTER);

        stroke(0);
        fill(0);
        rect(80,80,100,100);

        stroke(255);
        fill(255);
        text("Banner End", 80, 80);
        popStyle();
    }
    void display_label_black(){
        pushStyle();
        rectMode(CENTER);
        textAlign(CENTER,CENTER);

        stroke(0);
        fill(0);
        rect(80,80,100,100);

        stroke(255);
        fill(255);
        text("Black", 80, 80);
        popStyle();
    }
    void display_label_screenStats(){
        pushStyle();
        rectMode(CENTER);
        textAlign(CENTER,CENTER);

        stroke(0);
        fill(0);
        rect(80,80,100,100);

        stroke(255);
        fill(255);
        text("Screen Stats", 80, 80);
        popStyle();
    }
    void display_label_bannerRoundStart(){
        pushStyle();
        rectMode(CENTER);
        textAlign(CENTER,CENTER);

        stroke(0);
        fill(0);
        rect(80,80,100,100);

        stroke(255);
        fill(255);
        text("Banner Start", 80, 80);
        popStyle();
    }

}