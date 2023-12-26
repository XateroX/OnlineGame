class entity{
    /*
    Anything with dynamics
    e.g tanks, shells

    These positions are **relative to the stage**, the origin being startPos
    */
    PVector pos;
    PVector vel;
    PVector acc;

    PVector dim;    //Can refer to bounding box width, or radius

    entity(PVector iPos, PVector iVel, PVector iAcc){
        pos = iPos;
        vel = iVel;
        acc = iAcc;
    }
}