class transition_missionFail{
    /*
    This is a game state which displays the transition from;
    -Round ending to unsuccessfully
    To
    -New round starting

    Timings are as follows; --> Counts in frames
    [  0       1       2      3      4   ]
    [Banner, Black, Screen, Black, Banner]

    Only 1 instance of this state should every be in the GameStates at once
    */
    int timer = 0;
    String cState = "null";

    IntList timings_frames    = new IntList(60,60,60,60,60);
    StringList timings_states = new StringList("banner_roundEnd", "black", "screen_stats", "black", "banner_roundStart");

    transition_missionFail(){
        reset_state();
    }

    void reset_state(){
        timer = 0;
        cState = "null";
    }
    void calc_transitionState(){
        String state    = "null";   //Strings note usually nullable => cautious
        int runningTime = 0;
        for(int i=0; i<timings_frames.size(); i++){
            runningTime += timings_frames.get(i);
            if(timer < runningTime){
                state = timings_states.get(i);
                break;
            }
        }
        cState = state;
    }
    void calc_timer(){
        timer++;
    }
    void calc_removeFinishedState(int thisStateNumber){
        if(cState == "null"){
            cManager.removeFromStates(thisStateNumber);
        }
    }
}