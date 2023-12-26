/*
load in assets
-Models
-Textures
-Sounds
*/

//1
PShape entity_tank_red_chassis;
PShape entity_tank_red_turret;
PShape entity_tank_blue_chassis;
PShape entity_tank_blue_turret;
PShape entity_tank_brown_chassis;
PShape entity_tank_brown_turret;
PShape entity_tank_gray_chassis;
PShape entity_tank_gray_turret;
PShape entity_tank_teal_chassis;
PShape entity_tank_teal_turret;
PShape entity_tank_yellow_chassis;
PShape entity_tank_yellow_turret;
PShape entity_tank_pink_chassis;
PShape entity_tank_pink_turret;
PShape entity_tank_green_chassis;
PShape entity_tank_green_turret;
PShape entity_tank_purple_chassis;
PShape entity_tank_purple_turret;
PShape entity_tank_white_chassis;
PShape entity_tank_white_turret;
PShape entity_tank_black_chassis;
PShape entity_tank_black_turret;
PShape entity_shell_normal;
PShape entity_shell_rocket;
PShape entity_mine;
PShape terrain_cork;
PShape terrain_crate;
PShape terrain_hole;

//2
PImage background_wood;
PImage text_cork;
PImage text_crate;

//3


void loadAll(){
    loadModels();
    loadTextures();
    loadSounds();
}


void loadModels(){
    loadModels_tanks();
    loadModels_shells();
    loadModels_mines();
    loadModels_terrain();
}
void loadTextures(){
    loadText_backgrounds();
    loadTextures_terrain();
}
void loadSounds(){
    loadSounds_tanks();
    loadSounds_music();
    loadSounds_menus();
}


void loadModels_tanks(){
    loadModels_tanks_red();
    loadModels_tanks_blue();
    loadModels_tanks_brown();
    loadModels_tanks_gray();
    loadModels_tanks_teal();
    loadModels_tanks_yellow();
    loadModels_tanks_pink();
    loadModels_tanks_green();
    loadModels_tanks_purple();
    loadModels_tanks_white();
    loadModels_tanks_black();
}
void loadModels_tanks_red(){
    entity_tank_red_chassis = loadShape("tank_red_chassis.obj");
    entity_tank_red_turret  = loadShape("tank_red_turret.obj");
}
void loadModels_tanks_blue(){
    entity_tank_blue_chassis = loadShape("tank_blue_chassis.obj");
    entity_tank_blue_turret  = loadShape("tank_blue_turret.obj");
}
void loadModels_tanks_brown(){
    entity_tank_brown_chassis = loadShape("tank_brown_chassis.obj");
    entity_tank_brown_turret  = loadShape("tank_brown_turret.obj");
}
void loadModels_tanks_gray(){
    entity_tank_gray_chassis = loadShape("tank_gray_chassis.obj");
    entity_tank_gray_turret  = loadShape("tank_gray_turret.obj");
}
void loadModels_tanks_teal(){
    entity_tank_teal_chassis = loadShape("tank_teal_chassis.obj");
    entity_tank_teal_turret  = loadShape("tank_teal_turret.obj");
}
void loadModels_tanks_yellow(){
    entity_tank_yellow_chassis = loadShape("tank_yellow_chassis.obj");
    entity_tank_yellow_turret  = loadShape("tank_yellow_turret.obj");
}
void loadModels_tanks_pink(){
    entity_tank_pink_chassis = loadShape("tank_pink_chassis.obj");
    entity_tank_pink_turret  = loadShape("tank_pink_turret.obj");
}
void loadModels_tanks_green(){
    entity_tank_green_chassis = loadShape("tank_green_chassis.obj");
    entity_tank_green_turret  = loadShape("tank_green_turret.obj");
}
void loadModels_tanks_purple(){
    entity_tank_purple_chassis = loadShape("tank_purple_chassis.obj");
    entity_tank_purple_turret  = loadShape("tank_purple_turret.obj");
}
void loadModels_tanks_white(){
    entity_tank_white_chassis = loadShape("tank_white_chassis.obj");
    entity_tank_white_turret  = loadShape("tank_white_turret.obj");
}
void loadModels_tanks_black(){
    entity_tank_black_chassis = loadShape("tank_black_chassis.obj");
    entity_tank_black_turret  = loadShape("tank_black_turret.obj");
}
void loadModels_shells(){
    entity_shell_normal = loadShape("shell_normal.obj");
    //entity_shell_rocket = loadShape("shell_rocket.obj");
}
void loadModels_mines(){
    //pass
}
void loadModels_terrain(){
    terrain_cork  = loadShape("terrain_cork.obj");
    terrain_crate = loadShape("terrain_wood.obj");
    //terrain_hole  = loadShape("terrain_hole.obj");
}


void loadText_backgrounds(){
    background_wood = loadImage("background_wood.jpg");
}
void loadTextures_terrain(){
    text_cork  = loadImage("wood_plywood_new_0008_01_s.jpg");
    text_crate = loadImage("wood_plywood_new_0009_01_s.jpg");
}


void loadSounds_tanks(){
    //pass
}
void loadSounds_music(){
    //pass
}
void loadSounds_menus(){
    //pass
}