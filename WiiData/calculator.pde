class calculator{
    /*
    Performs all major calculations within the game
    e.g collision
    */
    //pass

    calculator(){
        //pass
    }

    void calcState(int state){
        if(state == 0){
            calcInMatch(cManager.cStage);
        }
        if(state == 1){
            calcTransition_missionSuccess(cManager.cTransition_missionSuccess);
        }
        if(state == 2){
            calcTransition_missionFail(cManager.cTransition_missionFail);
        }
        //...
    }
    void calcKeyPressed(int state, stage cStage){
        if(state == 0){
            //Player Tank controls
            //---------------------
            //##########################
            //#### PURELY BUGFIXING ####
            //##########################
            if(key == '8'){
                cManager.startTransition_missionFail();
            }
            //##########################
            //#### PURELY BUGFIXING ####
            //##########################


            if(key == 'w'){
                //P1 accelerate up (+ve)
                if(cStage.player_tanks.size()>0){
                    cStage.player_tanks.get(0).accUp    = true;}
            }
            if(key == 's'){
                //P1 accelerate down (-ve)
                if(cStage.player_tanks.size()>0){
                    cStage.player_tanks.get(0).accDwn   = true;}
            }
            if(key == 'a'){
                //P1 turn chassis CCW
                if(cStage.player_tanks.size()>0){
                    cStage.player_tanks.get(0).tCCW     = true;}
            }
            if(key == 'd'){
                //P1 turn chassis CW
                if(cStage.player_tanks.size()>0){
                    cStage.player_tanks.get(0).tCW      = true;}
            }
            if(key == 'q'){
                //P1 fire shell
                if(cStage.player_tanks.size()>0){
                    println("--Firing Shell--");
                    cStage.player_tanks.get(0).tryFireShell(cStage, this);}
            }
            if(key == 'e'){
                //P1 lay mine
                if(cStage.player_tanks.size()>0){
                    println("--Laying Mine--");
                    cStage.player_tanks.get(0).layMine(cStage);}
            }
            //## TEMPORARY FOR BUG FIXING ##
            if(key == '1'){
                if(cStage.player_tanks.size()>0){
                    cStage.player_tanks.get(0).cTurret.rotation -= PI/16.0;}
            }
            if(key == '2'){
                if(cStage.player_tanks.size()>0){
                    cStage.player_tanks.get(0).cTurret.rotation += PI/16.0;}
            }
            //## TEMPORARY FOR BUG FIXING ##

            //...
            //-----
        }
        //...
    }
    void calcKeyReleased(int state, stage cStage){
        if(state == 0){
            //Player Tank controls
            //---------------------
            if(key == 'w'){
                //P1 accelerate up (+ve)
                if(cStage.player_tanks.size()>0){
                    cStage.player_tanks.get(0).accUp    = false;}
            }
            if(key == 's'){
                //P1 accelerate down (-ve)
                if(cStage.player_tanks.size()>0){
                    cStage.player_tanks.get(0).accDwn   = false;}
            }
            if(key == 'a'){
                //P1 turn chassis CCW
                if(cStage.player_tanks.size()>0){
                    cStage.player_tanks.get(0).tCCW     = false;}
            }
            if(key == 'd'){
                //P1 turn chassis CW
                if(cStage.player_tanks.size()>0){
                    cStage.player_tanks.get(0).tCW      = false;}
            }

            //...
            //-----
        }
        //...
    }
    void calcMousePressed(int state, stage cStage){
        if(state == 0){
            //####
            //## SPECIFY HERE WHAT MOUSE PR DOES IN GAMESTATE X
            //####
        }
        //...
    }
    void calcMouseReleased(int state, stage cStage){
        if(state == 0){
            //####
            //## SPECIFY HERE WHAT MOUSE RE DOES IN GAMESTATE X
            //####
        }
        //...
    }


    void calcRoundOver(stage cStage){
        if( checkRoundOver(cStage) && !cManager.cInfo.roundOver ){
            cManager.cInfo.roundOver = true;
        }
    }
    boolean checkRoundOver(stage cStage){
        return checkAllTanksDestroyed(cStage);
    }
    boolean checkAllTanksDestroyed(stage cStage){
        /*
        Checks if all tanks and destroyed, and hence a new stage 
        should start
        */
        if(cStage.ai_tanks.size() == 0){
            return true;}
        else{
            return false;}
    }


    void calcInMatch(stage cStage){
        calcTanks(cStage);
        calcShells(cStage);
        calcCollisionCases(cStage);
        calcRoundOver(cStage);
    }
    void calcTanks(stage cStage){
        /*
        Performs calculations for tanks
        e.g dynamics, ...
        */
        calcPlayerTanks(cStage);
        calcAiTanks(cStage);
    }
    void calcPlayerTanks(stage cStage){
        for(int i=0; i<cStage.player_tanks.size(); i++){
            cStage.player_tanks.get(i).calcDynamics();
        }
    }
    void calcAiTanks(stage cStage){
        for(int i=0; i<cStage.ai_tanks.size(); i++){
            cStage.ai_tanks.get(i).calcDynamics();
        }
    }
    void calcShells(stage cStage){
        for(int i=0; i<cStage.shells.size(); i++){
            cStage.shells.get(i).calcDynamics();
        }
    }


    /*
    -------------
    LEGACY BELOW

    boolean checkBoxBoxCollision(PVector p1, PVector d1, PVector p2, PVector d2, stage cStage){
        
        Checks if 2 boxes, specified each by a centre point and dimension, are 
        colliding with eachother
        NOTE; dimensions (d1, d2) here are in pixels e.g have already been specified in terms of number of tWidths when parsed in
        p = pos
        d = dimension

        ########
        #####################################################################
        ## NEED TO CHANGE TO ROTATING RECTANGLE COLLISION, NOT JUST STATIC ##
        #####################################################################
        ########
        
        boolean withinX = abs(p1.x-p2.x) < (cStage.tWidth*d1.x/2.0) + (cStage.tWidth*d2.x/2.0);
        boolean withinY = abs(p1.y-p2.y) < (cStage.tWidth*d1.y/2.0) + (cStage.tWidth*d2.y/2.0);
        if(withinX && withinY){
            return true;}
        else{
            return false;}
    }

    LEGACY ABOVE
    -------------
    */
    boolean checkBoxBoxCollision(PVector p1, PVector d1, float r1, PVector p2, PVector d2, float r2, stage cStage){
        /*
        BoxBox collision using separation axis theorem

        1. Locate all vertices of each box
        2. Find the normals to each side (not duplicated) for each box (=> 8 in total, 4 dupes => 4 in reality)
        3. Find projections onto each axis for each corner for each box, find min and max
        4. Compare min and max for cross over (depending on centre's projection to axis, determining a 'which side' perspective)
        5. If crossing, keep checking
        6. If NOT crossing, end here, no collision
        7. If ALL cross, is colliding
        */
        //1
        ArrayList<PVector> b1Verts = findBoxVertices(p1, d1, r1, cStage);
        ArrayList<PVector> b2Verts = findBoxVertices(p2, d2, r2, cStage);
        //2
        ArrayList<PVector> bNorms = new ArrayList<PVector>();
        PVector b1v1 = vecUnitDir(b1Verts.get(0), b1Verts.get(1));PVector ortho_b1v1 = new PVector(b1v1.y, -b1v1.x);
        PVector b1v2 = vecUnitDir(b1Verts.get(0), b1Verts.get(2));PVector ortho_b1v2 = new PVector(-b1v2.y, b1v2.x);
        bNorms.add(ortho_b1v1);bNorms.add(ortho_b1v2);//Find using 0->1 and 0->2
        PVector b2v1 = vecUnitDir(b2Verts.get(0), b2Verts.get(1));PVector ortho_b2v1 = new PVector(b2v1.y, -b2v1.x);
        PVector b2v2 = vecUnitDir(b2Verts.get(0), b2Verts.get(2));PVector ortho_b2v2 = new PVector(-b2v2.y, b2v2.x);
        bNorms.add(ortho_b2v1);bNorms.add(ortho_b2v2);//Find using 0->1 and 0->2
        //3
        //For all normals
        boolean isColliding = true;
        for(int i=0; i<bNorms.size(); i++){
            //Find projections for b1 -> min and max
            float b1Max = vecDot(bNorms.get(i), b1Verts.get(0) );
            float b1Min = vecDot(bNorms.get(i), b1Verts.get(0) );
            for(int j=0; j<b1Verts.size(); j++){
                float pProj = vecDot(bNorms.get(i), b1Verts.get(j));
                if(pProj > b1Max){
                    b1Max = pProj;}
                if(pProj < b1Min){
                    b1Min = pProj;}
            }
            //Find projections for b2 -> min and max#
            float b2Max = vecDot(bNorms.get(i), b2Verts.get(0) );
            float b2Min = vecDot(bNorms.get(i), b2Verts.get(0) );
            for(int j=0; j<b2Verts.size(); j++){
                float pProj = vecDot(bNorms.get(i), b2Verts.get(j));
                if(pProj > b2Max){
                    b2Max = pProj;}
                if(pProj < b2Min){
                    b2Min = pProj;}
            }
            //Compare max and mins
            boolean noOverlap = true;
            if( (b2Max < b1Min) || (b1Max < b2Min) ){
                noOverlap = false;}
            if(!noOverlap){
                //Then cannot possibly have collision => end sequence
                isColliding = false;
                break;
            }
            //If ARE overlaps, keep checking norms for rest
        }
        return isColliding;
    }
    boolean checkCircleBoxCollision(PVector p1, float d, PVector p2, PVector d2, float r2, stage cStage){
        /*
        BoxBox collision using separation axis theorem
        CircleBox is a simplified case of BoxBox

        p1 = pos of CIRCLE
        d  = diameter of circle

        p2, d2, r2 for the BOX

        1. Locate all vertices of each box
        2. Find the normals to each side (not duplicated) for each box (=> 8 in total, 4 dupes => 4 in reality)
        3. Find projections onto each axis for each corner for each box, find min and max
        4. Compare min and max for cross over (depending on centre's projection to axis, determining a 'which side' perspective)
        5. If crossing, keep checking
        6. If NOT crossing, end here, no collision
        7. If ALL cross, is colliding
        */
        //1
        ArrayList<PVector> b2Verts = findBoxVertices(p2, d2, r2, cStage);
        //2
        ArrayList<PVector> bNorms = new ArrayList<PVector>();
        PVector b2v1 = vecUnitDir(b2Verts.get(0), b2Verts.get(1));PVector ortho_b2v1 = new PVector(b2v1.y, -b2v1.x);
        PVector b2v2 = vecUnitDir(b2Verts.get(0), b2Verts.get(2));PVector ortho_b2v2 = new PVector(-b2v2.y, b2v2.x);
        bNorms.add(ortho_b2v1);bNorms.add(ortho_b2v2);//Find using 0->1 and 0->2
        //3
        //For all normals
        boolean isColliding = true;
        for(int i=0; i<bNorms.size(); i++){
            //Find projections for b1 -> min and max
            float b1Max = vecDot(bNorms.get(i), p1) +cStage.tWidth*d/2.0;
            float b1Min = vecDot(bNorms.get(i), p1) -cStage.tWidth*d/2.0;
            
            //Find projections for b2 -> min and max#
            float b2Max = vecDot(bNorms.get(i), b2Verts.get(0) );
            float b2Min = vecDot(bNorms.get(i), b2Verts.get(0) );
            for(int j=0; j<b2Verts.size(); j++){
                float pProj = vecDot(bNorms.get(i), b2Verts.get(j));
                if(pProj > b2Max){
                    b2Max = pProj;}
                if(pProj < b2Min){
                    b2Min = pProj;}
            }
            //Compare max and mins
            boolean noOverlap = true;
            if( (b2Max < b1Min) || (b1Max < b2Min) ){
                noOverlap = false;}
            if(!noOverlap){
                //Then cannot possibly have collision => end sequence
                isColliding = false;
                break;
            }
            //If ARE overlaps, keep checking norms for rest
        }
        return isColliding;
    }
    ArrayList<PVector> findBoxVertices(PVector pos, PVector dim, float rot, stage cStage){
        /*
        Finds the vertices of a box as a list as follows;
        0 - 1
        |   |
        2 - 3
        */
        ArrayList<PVector> vertexList = new ArrayList<PVector>();
        //Go through all corners
        for(int j=-1; j<2; j+=2){
            for(int i=-1; i<2; i+=2){
                //Add rotated point to list as though about origin (using matrix, x=i*dim.x/2, y=j*dim.y/2)
                vertexList.add( new PVector(i*(cStage.tWidth*dim.x/2.0)*cos(rot) -j*(cStage.tWidth*dim.y/2.0)*sin(rot), i*(cStage.tWidth*dim.x/2.0)*sin(rot) +j*(cStage.tWidth*dim.y/2.0)*cos(rot)) );
            }
        }
        //Translate rotated point to be about pos, NOT origin
        for(int i=0; i<vertexList.size(); i++){
            vertexList.get(i).x += pos.x;
            vertexList.get(i).y += pos.y;
        }
        return vertexList;
    }
    PVector findTileCoord(PVector point, stage cStage){
        /*
        Finds the coordinate of the tile located under the given point
        */
        return new PVector( floor(point.x /cStage.tWidth), floor(point.y /cStage.tWidth) );
    }
    ArrayList<PVector> searchNearby_walls(PVector iCoord, int n, int mode, stage cStage){
        /*
        Looks for walls in and n x n (n usually being 3) radius around a given initial coordinate (of a tile, iCoord)
        for tiles that are;
        --> mode 0; tank collideable
        --> mode 1; shell collideable
        Returns a list of coordinates where these cases are true

        1. Look in n x n
        2. If not out of bounds
        3. Check specific rules for mode
        4. If both, mark it
        5. Return marked
        */
        ArrayList<PVector> marked = new ArrayList<PVector>();
        //1
        for(int j=-floor(float(n)/2.0); j<ceil(float(n)/2.0); j++){
            for(int i=-floor(float(n)/2.0); i<ceil(float(n)/2.0); i++){
                PVector cCoord = new PVector(iCoord.x +i, iCoord.y +j);
                //2
                boolean inBounds = ( (0<=int(cCoord.x))&&(int(cCoord.x)<cStage.tiles.get(0).size()) ) && ( (0<=int(cCoord.y))&&(int(cCoord.y)<cStage.tiles.size()) );
                if(inBounds){
                    //3
                    boolean valid = false;
                    if(mode == 0){
                        if(cStage.tiles.get( int(cCoord.y) ).get( int(cCoord.x) ).tankCollision){
                            valid = true;}}
                    if(mode == 1){
                        if(cStage.tiles.get( int(cCoord.y) ).get( int(cCoord.x) ).shellCollision){
                            valid = true;}}
                    //...
                    if(valid){
                        //4
                        marked.add( new PVector(cCoord.x, cCoord.y) );
                    }
                }
            }
        }
        return marked;
    }
    void moveTankOutBoxBoxCollision(tank cTank, PVector p, PVector d, float rot, stage cStage){
        /*
        Moves an entity backwards out of a box
        Centre = p
        Dim = d (in terms of # tWidths NOT pixels)
        Then sets velocity of entity to 0

        NOTE; Rotation consideration here to [stop 0 velocity collisions], which cause [BIG problems]
        */
        //Reverse effect of rotation
        if(cTank.tCCW){
            cTank.turnChassisCW();}
        if(cTank.tCW){
            cTank.turnChassisCCW();}

        //Evaluate not rotational motion
        if( (cTank.accUp || cTank.accDwn) || (vecMag(cTank.vel) != 0) ){
            float scale = 0.005;         //**Resolution of backwards moving (relative to frames)
            int countermeasure = 0;     //**Safety against infinite loops
            PVector nVel = new PVector(scale*cTank.vel.x, scale*cTank.vel.y, scale*cTank.vel.z);
            while(countermeasure < 300){
                cTank.pos.x -= nVel.x;
                cTank.pos.y -= nVel.y;
                cTank.pos.z -= nVel.z;
                boolean stillColliding = checkBoxBoxCollision(cTank.pos, cTank.dim, cTank.cChassis.rotation, p, d, rot, cStage);
                if(!stillColliding){
                    //cTank.vel = new PVector(0,0,0);
                    break;}
                countermeasure++;
            }
        }
    }
    void moveEntityOutCircleBoxCollision(entity cEntity, PVector p, PVector d, float rot, stage cStage){
        /*
        Moves an entity backwards out of a box

        --> This will check 3x3 area to ensure it is fully removed from collision even after moving out THIS box
        -> p here specifies the centre of the 3x3 it will check
        Assumes [ENTITY IS CIRCLE] and [OTHER IS BOX]

        Centre = p
        Dim = d (in terms of # tWidths NOT pixels)
        Then sets velocity of entity to 0
        */
        float scale        = 0.2;  //**Resolution of backwards moving (relative to frames)
        int countermeasure = 0;    //**Safety against infinite loops
        PVector nVel = new PVector(scale*cEntity.vel.x, scale*cEntity.vel.y, scale*cEntity.vel.z);   //New velocity
        while(countermeasure < 1000){
            cEntity.pos.x -= nVel.x;
            cEntity.pos.y -= nVel.y;
            cEntity.pos.z -= nVel.z;
            boolean stillColliding = false;
            for(int j=int(p.y)-1; j<int(p.y)+1; j++){
                for(int i=int(p.x)-1; i<int(p.x)+1; i++){
                    PVector newCoord = new PVector(i,j);
                    PVector newPos   = cStage.get_tilePos(newCoord);
                    if(cStage.tiles.get(int(newCoord.y)).get(int(newCoord.x)).shellCollision){
                        if(checkCircleBoxCollision(cEntity.pos, cEntity.dim.x, newPos, d, rot, cStage) ){
                            stillColliding = true;
                            break;
                        }
                    }
                }
                if(stillColliding){
                    break;}
            }
            if(!stillColliding){
                break;}
            countermeasure++;
        }
    }
    void calcCollisionCases(stage cStage){
        /*
        Checks all collision cases for the main game
        */
        checkCollision_tankWall(cStage);
        checkCollision_tankTank(cStage);
        checkCollision_shellWall(cStage);
        checkCollision_shellTank(cStage);
        checkCollision_mineTank(cStage);
        checkCollision_mineShell(cStage);
    }
    /*
    --------------
    LEGACY BELOW

    void deflectShellOffWall(shell cShell, PVector bPos, PVector bDim, stage cStage){
        
        Move out of wall
        Find which wall the shell will collide with
        Deflect its velocity accordingly

        p = shell pos

        p'|-----------|
          | p         |
          |~~ ~~X     |
          | b  a      |
          |___________|

          Hence;
          a = distance from box centre to point
          b = distance from point to box L/R edge
          c = scale factor to take point to L/R edge

          If p' has a y component > centre +dimY/2, then would hit the T/B
          If "" ""                < "" ""         , then would hit the L/R
        
        PVector velNormal = vecUnit(cShell.vel);
        float a = abs(cShell.pos.x -bPos.x);
        float b = bDim.x/2.0 -a;
        float c = b/velNormal.x;
        float pPrimeY = abs(cShell.pos.y -c*velNormal.y);
        //#################################################
        //## IS GETTING THE SIDE WRONG AT CERTAIN ANGLES ##
        //#################################################
        if(pPrimeY > bPos.y +bDim.y/2.0){
            //Top / Bottom collision => reverse Y vel
            moveEntityOutCircleBoxCollision(cShell, bPos, bDim, 0, cStage);
            cShell.vel.y *= -1;
        }
        else{
            //Left / Right collision => reverse X vel
            moveEntityOutCircleBoxCollision(cShell, bPos, bDim, 0, cStage);
            cShell.vel.x *= -1;
        }
    }

    LEGACY ABOVE
    --------------
    */
    void deflectShellOffWall(shell cShell, stage cStage){
        /*
        Will move a projectile out of a wall and collide appropriately. This will account 
        for travelling through walls (e.g at corners)
        Note; This will break if called and is NOT inside a wall

        1. Check if it is colliding with anything, --> Keep on moving back
        2. Consider the line projecting forward, see what it hits first
        3. Reflect according to this collision
        */
        println("DEFLECTING");
        int limiter = 0;    //Should only occur 3 times max ish, usually only once
        //1
        while(limiter < 1000){
            //#####################################################################
            //## MAY HAVE PROBLEMS IF TARGET IS SPAWNED INSIDE A BOX IMMEDIATELY ##
            //#####################################################################
            PVector boxCoord = cStage.get_tileCoord(cShell.pos);    //Tile shell appears in
            boolean collisionOccurred = false;
            //## MAKE IT CHECK OUT OF BOUNDS ##
            for(int j=int(boxCoord.y)-1; j<int(boxCoord.y)+1; j++){          //##Check 3x3##
                for(int i=int(boxCoord.x)-1; i<int(boxCoord.x)+1; i++){      //##Check 3x3##
                    PVector currentCoord = new PVector(i,j);
                    PVector currentPos   = cStage.get_tilePos(currentCoord);
                    if(cStage.tiles.get(int(currentCoord.y)).get(int(currentCoord.x)).shellCollision){
                        if( checkCircleBoxCollision(cShell.pos, cShell.dim.x, currentPos, new PVector(cStage.tWidth, cStage.tWidth), 0, cStage) ){
                            collisionOccurred = true;
                            break;
                        }
                    }
                }
                if(collisionOccurred){
                    break;}
            }
            if(collisionOccurred){
                //###########
                //## THIS NEEDS TO BE CHANGED TO A "KEEP MOVING UNTIL 3X3 HAS NO COLLISION"
                //###########
                //moveEntityOutCircleBoxCollision(cShell, boxPos, new PVector(cStage.tWidth, cStage.tWidth), 0, cStage);
            }
            else{
                break;}
            limiter++;
            println("Limiter --> ",limiter);
        }
        //2
        boolean isVerticalCollision = determine_earlyCollisionDir_wall(cShell.pos, vecUnit(cShell.vel), cStage);
        //3
        cShell.vel = new PVector(0,0);
        //if(isVerticalCollision){
        //    cShell.vel.x *= -1.0;}
        //else{
        //    cShell.vel.y *= -1.0;}



        /*
        OLD METHOD
        BROKEN AT CORNERS
        --> MOVEOUT FUNC HAS BEEN CHANGED SINCE PERHAPS


        //1
        float p1 = bPos.x -cStage.tWidth*bDim.x/2.0;
        float p2 = bPos.x +cStage.tWidth*bDim.x/2.0;
        float p3 = bPos.y -cStage.tWidth*bDim.y/2.0;
        float p4 = bPos.y +cStage.tWidth*bDim.y/2.0;
        float k1 = (p1-cShell.pos.x) / (cShell.vel.x);
        float k2 = (p2-cShell.pos.x) / (cShell.vel.x);
        //2
        float k = k1;
        if(k2 < 0){
            k = k2;}
        float yComp = cShell.pos.y +cShell.vel.y*k;
        boolean inBounds = (p3 <= yComp) && (yComp < p4);
        if(inBounds){
            //Valid => Vertical collision (flip X)
            //3
            //Ensure this fully moves out of ALL nearby box collisions --> Keep checking 3x3
            moveEntityOutCircleBoxCollision(cShell, bPos, bDim, 0, cStage);
            cShell.vel.x *= -1;
        }
        else{
            //NOT Valid => Horizontal collision (flip Y)
            //3
            moveEntityOutCircleBoxCollision(cShell, bPos, bDim, 0, cStage);
            cShell.vel.y *= -1;
        }
        */
    }
    boolean determine_earlyCollisionDir_wall(PVector iPos, PVector dir, stage cStage){
        /*
        #####
        ## THIS SEEMS BAD
        #####
        */
        return true;
    }
    float find_interceptionFactor(PVector iPos, PVector dir, PVector point1, PVector point2){
        /*
        Finds the magnitude of the distance between the 2 lines defined
        */
        PVector wall_dir = new PVector(point1.x-point2.x, point1.y-point2.y);
        PVector disp = new PVector(iPos.x-point1.x, iPos.y-point1.y);
        float lambda = 999999999.0;
        if(dir.x/dir.y != wall_dir.x/wall_dir.y){   //If not parallel
            lambda = (wall_dir.x*disp.y - wall_dir.y*disp.x)/(dir.x*wall_dir.y - dir.y*wall_dir.x);}
        return lambda;
    }
    void checkCollision_tankWall(stage cStage){
        /*
        Looks through all tanks, checks for nearby walls that they could 
        collide with
        If they would collide, then move them out of the wall

        1. Look through all tanks
        2. Checks walls around tile tank is over
        3. If any that could collide with tank, check them
        4. If a collision does occur, move tank backwards out of wall
        */

        // PLAYER VERSION
        //----------------
        //1
        for(int i=0; i<cStage.player_tanks.size(); i++){
            //2
            PVector tankTileCoord = findTileCoord(cStage.player_tanks.get(i).pos, cStage);
            ArrayList<PVector> possibleWalls = searchNearby_walls(tankTileCoord, 3, 0, cStage);
            //3
            for(int j=0; j<possibleWalls.size(); j++){
                PVector wallPos = new PVector(possibleWalls.get(j).x*cStage.tWidth, possibleWalls.get(j).y*cStage.tWidth);
                PVector wallDim = new PVector(1.0, 1.0);
                boolean isColliding = checkBoxBoxCollision(cStage.player_tanks.get(i).pos, cStage.player_tanks.get(i).dim, cStage.player_tanks.get(i).cChassis.rotation, wallPos, wallDim, 0, cStage);
                if(isColliding){
                    //4
                    moveTankOutBoxBoxCollision(cStage.player_tanks.get(i), wallPos, wallDim, 0, cStage);
                    cStage.player_tanks.get(i).vel = new PVector(0,0,0);
                }
            }
        }

        // AI VERSION --> COPIED OVER
        //----------------------------
        for(int i=0; i<cStage.ai_tanks.size(); i++){
            //2
            PVector tankTileCoord = findTileCoord(cStage.ai_tanks.get(i).pos, cStage);
            ArrayList<PVector> possibleWalls = searchNearby_walls(tankTileCoord, 3, 0, cStage);
            //3
            for(int j=0; j<possibleWalls.size(); j++){
                PVector wallPos = new PVector(possibleWalls.get(j).x*cStage.tWidth, possibleWalls.get(j).y*cStage.tWidth);
                PVector wallDim = new PVector(cStage.tWidth, cStage.tWidth);
                boolean isColliding = checkBoxBoxCollision(cStage.ai_tanks.get(i).pos, cStage.ai_tanks.get(i).dim, cStage.ai_tanks.get(i).cChassis.rotation, wallPos, wallDim, 0, cStage);
                if(isColliding){
                    //4
                    moveTankOutBoxBoxCollision(cStage.ai_tanks.get(i), wallPos, wallDim, 0, cStage);
                    cStage.ai_tanks.get(i).vel = new PVector(0,0,0);
                }
            }
        }
    }
    void checkCollision_tankTank(stage cStage){
        for(int i=0; i<cStage.player_tanks.size(); i++){
            for(int p=0; p<cStage.player_tanks.size(); p++){
                if(i != p){    
                    boolean isColliding = checkBoxBoxCollision(cStage.player_tanks.get(i).pos, cStage.player_tanks.get(i).dim, cStage.player_tanks.get(i).cChassis.rotation, cStage.player_tanks.get(p).pos, cStage.player_tanks.get(p).dim, cStage.player_tanks.get(p).cChassis.rotation, cStage);
                    if(isColliding){
                        moveTankOutBoxBoxCollision(cStage.player_tanks.get(i), cStage.player_tanks.get(p).pos, cStage.player_tanks.get(p).dim, cStage.player_tanks.get(p).cChassis.rotation, cStage);
                        cStage.player_tanks.get(i).vel = new PVector(0,0,0);}
                }
            }
            for(int p=0; p<cStage.ai_tanks.size(); p++){   
                boolean isColliding = checkBoxBoxCollision(cStage.player_tanks.get(i).pos, cStage.player_tanks.get(i).dim, cStage.player_tanks.get(i).cChassis.rotation, cStage.ai_tanks.get(p).pos, cStage.ai_tanks.get(p).dim, cStage.ai_tanks.get(p).cChassis.rotation, cStage);
                if(isColliding){
                    moveTankOutBoxBoxCollision(cStage.player_tanks.get(i), cStage.ai_tanks.get(p).pos, cStage.ai_tanks.get(p).dim, cStage.ai_tanks.get(p).cChassis.rotation, cStage);
                    cStage.player_tanks.get(i).vel = new PVector(0,0,0);}
            }
        }

        // AI VERSION --> COPIED OVER BUT JUST FOR OTHER AI (ai vs player check already done)
        //----------------------------
        for(int i=0; i<cStage.ai_tanks.size(); i++){
            for(int p=0; p<cStage.ai_tanks.size(); p++){
                if(i != p){
                    boolean isColliding = checkBoxBoxCollision(cStage.ai_tanks.get(i).pos, cStage.ai_tanks.get(i).dim, cStage.ai_tanks.get(i).cChassis.rotation, cStage.ai_tanks.get(p).pos, cStage.ai_tanks.get(p).dim, cStage.ai_tanks.get(p).cChassis.rotation,cStage);
                    if(isColliding){
                        moveTankOutBoxBoxCollision(cStage.ai_tanks.get(i), cStage.ai_tanks.get(p).pos, cStage.ai_tanks.get(p).dim, cStage.ai_tanks.get(p).cChassis.rotation, cStage);
                        cStage.ai_tanks.get(i).vel = new PVector(0,0,0);}
                }
            }
        }
    }
    void checkCollision_shellWall(stage cStage){
        /*
        Checks all shells to see if they will
        */
        //1
        for(int i=cStage.shells.size()-1; i>=0; i--){
            //2
            PVector shellTileCoord = findTileCoord(cStage.shells.get(i).pos, cStage);
            ArrayList<PVector> possibleWalls = searchNearby_walls(shellTileCoord, 3, 1, cStage);
            //3
            for(int j=0; j<possibleWalls.size(); j++){
                PVector wallPos = new PVector(possibleWalls.get(j).x*cStage.tWidth, possibleWalls.get(j).y*cStage.tWidth);
                PVector wallDim = new PVector(1.0, 1.0);
                boolean isColliding = checkCircleBoxCollision(cStage.shells.get(i).pos, cStage.shells.get(i).dim.x, wallPos, wallDim, 0, cStage);
                if(isColliding){
                    //4
                    boolean atLimit = cStage.shells.get(i).checkDeflectLimit();
                    if(atLimit){
                        //Remove if at limit
                        cStage.shells.remove(i);
                        break;
                    }
                    else{
                        //Otherwise deflect it
                        deflectShellOffWall(cStage.shells.get(i), cStage);
                    }
                }
            }
        }
    }
    void checkCollision_shellTank(stage cStage){
        //1
        for(int i=cStage.shells.size()-1; i>=0; i--){
            boolean shellRemoved = false;   //Skips second check (which would be IMPOSSIBLE if destroyed => ABSOLUTELY NEEDED DO NOT REMOVE)

            //FOR PLAYER TANKS
            //------------------
            for(int j=cStage.player_tanks.size()-1; j>=0; j--){
                boolean isColliding = checkCircleBoxCollision(cStage.shells.get(i).pos, cStage.shells.get(i).dim.x, cStage.player_tanks.get(j).pos, cStage.player_tanks.get(j).dim, cStage.player_tanks.get(j).cChassis.rotation, cStage);
                if(isColliding){
                    //Destroy both
                    cStage.shells.remove(i);
                    cStage.player_tanks.remove(j);
                    shellRemoved = true;
                    break;
                }
            }

            //FOR AI TANKS
            //--------------
            if(!shellRemoved){
                for(int j=cStage.ai_tanks.size()-1; j>=0; j--){
                    boolean isColliding = checkCircleBoxCollision(cStage.shells.get(i).pos, cStage.shells.get(i).dim.x, cStage.ai_tanks.get(j).pos, cStage.ai_tanks.get(j).dim, cStage.ai_tanks.get(j).cChassis.rotation, cStage);
                    if(isColliding){
                        //Destroy both
                        cStage.shells.remove(i);
                        cStage.ai_tanks.remove(j);
                        break;
                    }
                }
            }
        }
    }
    void checkCollision_mineTank(stage cStage){
        for(int i=cStage.mines.size()-1; i>=0; i--){
            boolean alreadyExploded = false;

            //For PLAYER
            //------------
            for(int j=cStage.player_tanks.size()-1; j>=0; j--){
                //Check whitelist
                boolean isWhitelisted = false;
                for(int z=0; z<cStage.mines.get(i).whitelist.size(); z++){
                    if(cStage.mines.get(i).whitelist.get(z) == cStage.player_tanks.get(j).ID){
                        isWhitelisted = true;
                        break;}
                }

                if(!isWhitelisted){
                    boolean isColliding = checkCircleBoxCollision(cStage.mines.get(i).pos, 2.0*cStage.mines.get(i).activeRad, cStage.player_tanks.get(j).pos, cStage.player_tanks.get(j).dim, cStage.player_tanks.get(j).cChassis.rotation, cStage);
                    if(isColliding){
                        //If they collide, activate mine and destroy both
                        explodeMine(cStage.mines.get(i), cStage, i);
                        alreadyExploded = true;
                        break;
                    }
                }
            }

            //For AI
            //--------
            if(!alreadyExploded){
                for(int j=cStage.ai_tanks.size()-1; j>=0; j--){
                    //Check whitelist
                    boolean isWhitelisted = false;
                    for(int z=0; z<cStage.mines.get(i).whitelist.size(); z++){
                        if(cStage.mines.get(i).whitelist.get(z) == cStage.ai_tanks.get(j).ID){
                            isWhitelisted = true;
                            break;}
                    }

                    if(!isWhitelisted){
                        boolean isColliding = checkCircleBoxCollision(cStage.mines.get(i).pos, 2.0*cStage.mines.get(i).activeRad, cStage.ai_tanks.get(j).pos, cStage.ai_tanks.get(j).dim, cStage.ai_tanks.get(j).cChassis.rotation, cStage);
                        if(isColliding){
                            //If they collide, activate mine and destroy both
                            explodeMine(cStage.mines.get(i), cStage, i);
                            break;
                        }
                    }
                }
            }
        }
    }
    void checkCollision_mineShell(stage cStage){
        for(int i=cStage.mines.size()-1; i>=0; i--){
            for(int j=cStage.shells.size()-1; j>=0; j--){
                boolean isColliding = checkCircleBoxCollision(cStage.shells.get(j).pos, cStage.shells.get(j).dim.x, cStage.mines.get(i).pos, cStage.mines.get(i).dim, 0, cStage);
                if(isColliding){
                    //If they collide, activate mine and destroy both
                    explodeMine(cStage.mines.get(i), cStage, i);
                    break;
                }
            }
        }
    }


    void explodeMine(mine cMine, stage cStage, int n){
        /*
        Calculates what is effected by this mine exploding
        (the nth mine in the list), then destroys itself
        */
        explodeMine_shells(cMine, cStage);
        explodeMine_tanks(cMine, cStage);
        explodeMine_walls(cMine, cStage);
        cStage.mines.remove(n);
    }
    void explodeMine_shells(mine cMine, stage cStage){
        for(int i=cStage.shells.size()-1; i>=0; i--){
            float dist = vecDist(cMine.pos, cStage.shells.get(i).pos);
            if(dist < cMine.explodeRad*cStage.tWidth){
                cStage.shells.remove(i);
            }
        }
    }
    void explodeMine_tanks(mine cMine, stage cStage){
        //For PLAYERS
        //------------
        for(int i=cStage.player_tanks.size()-1; i>=0; i--){
            float dist = vecDist(cMine.pos, cStage.player_tanks.get(i).pos);
            if(dist < cMine.explodeRad*cStage.tWidth){
                cStage.player_tanks.remove(i);
            }
        }

        //For AI
        //--------
        for(int i=cStage.ai_tanks.size()-1; i>=0; i--){
            float dist = vecDist(cMine.pos, cStage.ai_tanks.get(i).pos);
            if(dist < cMine.explodeRad*cStage.tWidth){
                cStage.ai_tanks.remove(i);
            }
        }
    }
    void explodeMine_walls(mine cMine, stage cStage){
        /*
        When a mine explodes, the check is made
        Looks in radius for tiles applicatable
        Then destroys all applicable

        NOTE; Only destroys tiles with their CENTRE in the blast zone
        */
        //**This is inefficient, but the calculation rarely occurs (once a million frames), so is probably fine
        ArrayList<PVector> marked = new ArrayList<PVector>();   //So dont skip rows or cols when deleting halfway through
        for(int j=0; j<cStage.tiles.size(); j++){
            for(int i=0; i<cStage.tiles.get(j).size(); i++){
                if(cStage.tiles.get(j).get(i).destructable){
                    float dist = vecDist(cMine.pos, new PVector(i*cStage.tWidth, j*cStage.tWidth, cMine.pos.z));
                    if(dist < cMine.explodeRad*cStage.tWidth){
                        marked.add( new PVector(i,j) );
                    }
                }
            }
        }
        for(int i=0; i<marked.size(); i++){
            cStage.tiles.get(int(marked.get(i).y)).remove( int(marked.get(i).x) );
            cStage.tiles.get(int(marked.get(i).y)).add( int(marked.get(i).x), new empty() );
        }
    }
    int checkTankShells(tank cTank, stage cStage){
        /*
        Checks the stage for all shells fired by the given tank, and returns the number currently on screen for it
        This is used to limit the number of shells a tank can fire at once
        */
        int shellCounter = 0;
        for(int i=0; i<cStage.shells.size(); i++){
            if(cStage.shells.get(i).owner == cTank.ID){
                shellCounter++;
            }
        }
        return shellCounter;
    }

    //###########################################
    //### SHOULD MERGE THESE CLASSES INTO ONE ###
    //###########################################
    //Mission Success Transition
    void calcTransition_missionSuccess(transition_missionSuccess cTransition){
        cTransition.calc_timer();
        cTransition.calc_transitionState();
        cTransition.calc_removeFinishedState(1);    //1 to specify what gameState number this transition is
    }
    //Mission Fail Transition
    void calcTransition_missionFail(transition_missionFail cTransition){
        cTransition.calc_timer();
        cTransition.calc_transitionState();
        cTransition.calc_removeFinishedState(2);    //1 to specify what gameState number this transition is
    }
}