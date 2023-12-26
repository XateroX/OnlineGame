class shell extends entity{
    int owner;  //Used to credit the tank that fired the shell with kills, and to determine how many shells a given tank has fired on screen

    int nDeflected = 0; //Number of times it has deflected
    int deflectLim;     //Number of times it can deflect before being destroyed (e.g 1 = can deflect once)

    PShape model;

    shell(PVector pos, PVector vel, PVector acc, int shellOwner){
        super(pos, vel, acc);
        owner = shellOwner;
        dim = new PVector(0.2,0.2); //Relative to tWidth, bounding radius(???)
    }

    void calcDynamics(){
        calcAcc();
        calcVel();
        calcPos();
    }
    void calcAcc(){
        //pass
    }
    void calcVel(){
        vel.x += acc.x;
        vel.y += acc.y;
    }
    void calcPos(){
        pos.x += vel.x;
        pos.y += vel.y;
    }
    boolean checkDeflectLimit(){
        /*
        Increments number of times the shell has been deflected
        Then returns if it has reached its limit
        */
        nDeflected++;
        if(nDeflected > deflectLim){
            return true;}
        else{
            return false;}
    }
}
class shell_normal extends shell{
    //pass

    shell_normal(PVector pos, PVector vel, PVector acc, int owner){
        super(pos, vel, acc, owner);
        dim = new PVector(0.2,0.2); //Relative to tWidth, bounding radius(???)
        deflectLim = 1;

        model = entity_shell_normal;
    }
}
class shell_rocket extends shell{
    //pass

    shell_rocket(PVector pos, PVector vel, PVector acc, int owner){
        super(pos, vel, acc, owner);
        dim = new PVector(0.6,0.4); //Relative to tWidth, bounding radius(???)
        deflectLim = 0;

        model = entity_shell_rocket;
    }
}