manager cManager;

void setup(){
    fullScreen(P2D);
    cManager = new manager();
}
void draw(){
    background(0,0,0);
    cManager.calcGameState();
    cManager.displayGameState();
}

void keyPressed(){
    cManager.calcControls_keyPressed();
}
void keyReleased(){
    cManager.calcControls_keyReleased();
}
void mousePressed(){
    cManager.calcControls_mousePressed();
}
void mouseReleased(){
    cManager.calcControls_mouseReleased();
}

/*
TodoList;
--> Fix collision bugs
--> Ensure transitions work / are implemented better
--> Add more stages + assests for transition
--> Do AI tank decision making
*/