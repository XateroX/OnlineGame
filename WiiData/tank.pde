class tank extends entity{
    /*
    Note; Max straight line speed = engineThrust/frictionCoeff => for eThrust =2.4, fCoeff =0.8, maxSpeed ~3 pxls fr^-1
    */
    int ID = floor(random(10000000, 99999999)); //Unique identifier for each tank -> bullets have associated IDs for tanks

    boolean accUp  = false;
    boolean accDwn = false;
    boolean tCW  = false;
    boolean tCCW = false;

    chassis cChassis = new chassis();
    turret cTurret   = new turret();
    float thRatio = 0.5;   //Tank height ratio, how far from the floor to the top of chassis, in terms of tWidths -> find experimentally

    float frictionCoeff = 0.7;
    float engineThrust = 1.2;   //How strong engine is
    int nMaxShell;              //Maximum number of shells that this tank can have fired on screen at once
    float rSpeed = 1.0*PI/64.0; //Rotation speed of chassis

    tank(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(0.8, 0.8);    //Relative to tWidth, bounding box size
    }

    void calcDynamics(){
        /*
        Calculates pos,vel,acc and rotational changes
        */
        calcAcc();
        calcVel();
        calcPos();
        calcChassisRot();
        calcTurretRot();
    }
    void tryFireShell(stage cStage, calculator cCalc){
        /*
        Checks if is able to fire a shell first, and if so does it
        */
        int ownedShells = cCalc.checkTankShells(this, cStage);
        if(ownedShells < nMaxShell){
            fireShell(cStage);}
    }
    void fireShell(stage cStage){
        /*
        Fires a shell from the turret of this tank
        */
        PVector turretDir = cTurret.getDir();
        float offset = 1.1*dim.x*cStage.tWidth;
        float fireSpeed = 3.0;
        shell_normal newShell = new shell_normal( new PVector(pos.x +offset*turretDir.x, pos.y +offset*turretDir.y, pos.z), new PVector(fireSpeed*turretDir.x, fireSpeed*turretDir.y, 0), new PVector(0,0,0), ID );
        cStage.shells.add(newShell);
    }
    void layMine(stage cStage){
        /*
        Lays a mine beneath this tank
        Whitelists this tank inside the placed mine
        */
        mine newMine = new mine( new PVector(pos.x,pos.y,pos.z), new PVector(0,0,0), new PVector(0,0,0) );
        newMine.whitelist.add(ID);
        cStage.mines.add(newMine);
    }
    void calcAcc(){
        PVector force = new PVector(0,0,0);

        //Friction
        float velMag = vecMag(vel);
        PVector velDir = vecUnit(vel);
        force.x -= frictionCoeff*velMag*velDir.x;
        force.y -= frictionCoeff*velMag*velDir.y;

        //Thrust
        if(accUp){
            //Accelerating forward
            PVector dir = cChassis.getDir();
            force.x += engineThrust*dir.x;
            force.y += engineThrust*dir.y;
        }
        if(accDwn){
            //Accelerating forward
            PVector dir = cChassis.getDir();
            force.x -= engineThrust*dir.x;
            force.y -= engineThrust*dir.y;
        }

        //Acc
        acc.x = force.x/1.0;
        acc.y = force.y/1.0;
    }
    void calcVel(){
        vel.x += acc.x;
        vel.y += acc.y;
    }
    void calcPos(){
        pos.x += vel.x;
        pos.y += vel.y;
    }
    void calcChassisRot(){
        if(tCCW){
            turnChassisCCW();}
        if(tCW){
            turnChassisCW();}
    }
    void turnChassisCCW(){
        cChassis.rotation -= rSpeed;
        //Keep within correct bounds (0,2PI)
        cChassis.rotation %= 2.0*PI;
        if(cChassis.rotation < 0){
            cChassis.rotation += 2.0*PI;}
    }
    void turnChassisCW(){
        cChassis.rotation += rSpeed;
        //Keep within correct bounds (0,2PI)
        cChassis.rotation %= 2.0*PI;
        if(cChassis.rotation < 0){
            cChassis.rotation += 2.0*PI;}
    }
    void calcTurretRot(){
        /*
        Turrets have instantaneous turn speed
        */
        //pass
    }
}
class chassis{
    PShape model = null;
    float rotation = 0.0;

    chassis(){
        //pass
    }

    PVector getDir(){
        /*
        Returns unit vector direction that this is pointing at
        */
        return new PVector(cos(rotation), sin(rotation));
    }
}
class turret{
    PShape model = null;
    float rotation = 0.0;

    turret(){
        //pass
    }

    PVector getDir(){
        /*
        Returns unit vector direction that this is pointing at
        */
        return new PVector(cos(rotation), sin(rotation));
    }
}


class tank_red extends tank{
    //pass

    tank_red(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size 
        nMaxShell = 4;

        cChassis.model = entity_tank_red_chassis;
        cTurret.model  = entity_tank_red_turret;
    }
}
class tank_blue extends tank{
    //pass

    tank_blue(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size
        nMaxShell = 4;

        cChassis.model = entity_tank_blue_chassis;
        cTurret.model  = entity_tank_blue_turret;
    }
}
class tank_brown extends tank{
    //pass

    tank_brown(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size
        nMaxShell = 4;

        cChassis.model = entity_tank_brown_chassis;
        cTurret.model  = entity_tank_brown_turret;
    }
}
class tank_gray extends tank{
    //pass

    tank_gray(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size
        nMaxShell = 4;

        cChassis.model = entity_tank_gray_chassis;
        cTurret.model  = entity_tank_gray_turret;
    }
}
class tank_teal extends tank{
    //pass

    tank_teal(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size
        nMaxShell = 4;

        cChassis.model = entity_tank_teal_chassis;
        cTurret.model  = entity_tank_teal_turret;
    }
}
class tank_yellow extends tank{
    //pass

    tank_yellow(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size
        nMaxShell = 4;

        cChassis.model = entity_tank_yellow_chassis;
        cTurret.model  = entity_tank_yellow_turret;
    }
}
class tank_pink extends tank{
    //pass

    tank_pink(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size
        nMaxShell = 4;

        cChassis.model = entity_tank_pink_chassis;
        cTurret.model  = entity_tank_pink_turret;
    }
}
class tank_green extends tank{
    //pass

    tank_green(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size
        nMaxShell = 4;

        cChassis.model = entity_tank_green_chassis;
        cTurret.model  = entity_tank_green_turret;
    }
}
class tank_purple extends tank{
    //pass

    tank_purple(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size
        nMaxShell = 4;

        cChassis.model = entity_tank_purple_chassis;
        cTurret.model  = entity_tank_purple_turret;
    }
}
class tank_white extends tank{
    //pass

    tank_white(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size
        nMaxShell = 4;

        cChassis.model = entity_tank_white_chassis;
        cTurret.model  = entity_tank_white_turret;
    }
}
class tank_black extends tank{
    //pass

    tank_black(PVector pos, PVector vel, PVector acc){
        super(pos, vel, acc);
        dim = new PVector(1.1, 0.8);    //Relative to tWidth, bounding box size
        nMaxShell = 4;

        cChassis.model = entity_tank_black_chassis;
        cTurret.model  = entity_tank_black_turret;
    }
}