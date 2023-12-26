class stage{
    /*
    Maps which rounds are played on
    Stores information about tiles and entities
    */
    ArrayList<ArrayList<tile>> tiles = new ArrayList<ArrayList<tile>>();
    ArrayList<tank> player_tanks     = new ArrayList<tank>();   //Tanks controlled by ith players
    ArrayList<tank> ai_tanks         = new ArrayList<tank>();   //Ai controlled tanks
    ArrayList<shell> shells          = new ArrayList<shell>();
    ArrayList<mine> mines            = new ArrayList<mine>();

    PVector startPos = new PVector(width/5.0,height/3.0,0);  //Where tiles start being drawn from (top-left corner)
    float tWidth     = 30.0; //Width of a tile

    stage(){
        //pass
    }

    PVector get_tileCoord(PVector pos){
        /*
        Gets the tile a position is contained within, returns the coord 
        of that tile

        Assumes pos=(0,0) is the top left of the entire grid

        Note; This will still return values for out-of-bounds points
        */
        return new PVector(floor(pos.x/tWidth), floor(pos.y/tWidth));
    }
    PVector get_tilePos(PVector coord){
        /*
        Returns the CENTER position of the tile coord given

        Note; This will still return values for out-of-bounds points
        */
        return new PVector((coord.x+0.5)*tWidth, (coord.y+0.5)*tWidth);
    }
}