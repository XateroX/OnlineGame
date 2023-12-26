class tile{
    /*
    Holds information about terrain on this tile
    */
    String name;
    boolean tankCollision;      //Tanks cannot move through this
    boolean shellCollision;     //Shells cannot move through this
    boolean destructable;       //Explosives (mines) can destroy this

    PShape model;

    tile(){
        //pass
    }
}

class empty extends tile{
    //pass

    empty(){
        name = "tile_empty";
        tankCollision  = false;
        shellCollision = false;
        destructable   = false;

        model = null;
    }
}
class hole extends tile{
    //pass

    hole(){
        name = "tile_hole";
        tankCollision  = true;
        shellCollision = false;
        destructable   = false;

        pushStyle();
        fill(0);
        //model = createShape(SPHERE, 1);
        popStyle();
    }
}
class cork extends tile{
    //pass

    cork(){
        name = "tile_cork";
        tankCollision  = true;
        shellCollision = true;
        destructable   = true;

        noStroke();
        //model = createShape(BOX, 1,1,1);
        //model.setTexture(text_cork);
    }
}
class crate extends tile{
    //pass

    crate(){
        name = "tile_crate";
        tankCollision  = true;
        shellCollision = true;
        destructable   = false;

        noStroke();
        //model = createShape(BOX, 1,1,1);
        //model.setTexture(text_crate);
    }
}