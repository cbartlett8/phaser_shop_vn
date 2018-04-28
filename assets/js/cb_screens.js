/*
  NOTE: The following variables and functions operate the stack
  that pushes and pops different screens that diaply to the 
  screen. It is just implemented like this to keep things 
  from getting too crazy.
  Assumptions: 
  -Screens can hide and unhide. 
  -All screens are stored within the screen_stack.
*/
var screen_stack = [];

function pushScreen(screen)
{
  console.log("Adding Screen: " + screen.getName());
  
  // Check if there was existing screens before to hide.
  if ( screen_stack.length > 0)
  {
    let scr = screen_stack[screen_stack.length - 1];
    console.log("Hiding: " + scr.getName());
    scr.hide();
  }
  screen_stack.push(screen);
}

function popScreen()
{
  let old_top = screen_stack.pop();
  console.log("Destroying: " + old_top.getName());
  old_top.destroy();
  old_top = null;
  
  console.log("Screen Stack size: " + screen_stack.length);
    
  if (screen_stack.length > 0)
  {
    let top = screen_stack[screen_stack.length - 1];
    console.log("Unhiding Screen: " + top.getName());
    top.unhide();
  }
}

// destroys all the screens in the screen_stack.
function clearScreens()
{
  for (let i = 0; i < screen_stack.length; i++)
  {
    popScreen();
  }
}

// gives the number of screens that are in the screen_stack.
function getNumberOfScreens()
{
  return screen_stack.length;
}

// function to call for an update to the current screen.
function updateTopScreen()
{
  screen_stack[screen_stack.length - 1].update();
}

/*
 * Generic buttons with a custom label as I didnt want to make a 
 * bunch of buttons for everything!!!
 */
class clickableTextButton
{
  /*
   * So we have the x, y pos as integers 
   * param text str - string of text.
   * param callback ptr - The function to call with the button press.
   * param type - 0: no para, 1: new obj with game, 2: no new just param
   * param callback_para string - The parameters to pass with callback.
   */
  constructor(x, y, text, callback, type, call_para)
  {
    let error_str = "clickableTextButton:constructor:"
    if (testVarValidity(x, "number", 0, 1000, error_str) == false)
    { console.error("x: " + x + " c=0"); x = 0; }
    if (testVarValidity(x, "number", 0, 1000, error_str) == false)
    { console.error("y: " + y + " c=0"); y = 0; }
    if (testVarValidity(text, "string", -123, 123, error_str) == false)
    { console.error("text: " + text + " c=\"ERROR\""); text = "ERROR"; }
    
    this.m_text_x = x + 32;
    this.m_text_y = y + 24;
    this.m_text_array = [];
    this.m_button = game.add.button(x, y, 'button_generic',
      null, this, 1,0,2,1); // overFrame, outFrame, downFrame, upFrame
    this.m_text_array.push( game.add.text(this.m_text_x, 
        this.m_text_y,
        text, {fontSize: '16px', fill: '#000'}) );
    this.m_callback = callback;
    this.m_type = type;
    this.m_call_para = call_para;
        
    this.m_button.events.onInputDown.add(function()
    {
      // Here we would advance to the saveScreen.
      //pushScreen(new SaveScreen(game));
      if (type == 0)
      {
        callback();
      }
      else if (type == 1)
      {
        callback(new call_para(game));
      }
      else if (type == 2)
      {
        //console.log(error_str + " type is 2?");
        callback(call_para);
      }
      else
      {
        console.log(error_str + " unknown type: " + this.m_type);
      }
    });
  }
  hide()
  {
    this.m_button.inputEnabled = false;
    //this.m_text.alpha = 0.1
    for (let i = 0; i < this.m_text_array.length; i++)
    {
        this.m_text_array[i].alpha = 0.1;
    }
    this.m_button.alpha = 0.1
  }
  unhide()
  {
    this.m_button.inputEnabled = true;
    //this.m_text.alpha = 1.0;
    for (let i = 0; i < this.m_text_array.length; i++)
    {
        this.m_text_array[i].alpha = 1.0;
    }
    this.m_button.alpha = 1.0;
  }
  
  // Functions to change the size of the button.
  changeWidth(new_w)
  {
    this.m_button.width = new_w;
  }
  changeHeight(new_h)
  {
    this.m_button.height = new_h;
  }
  
  // function to add text to the button, mostly used for save and load
  // buttons. The strings should be generated one line at a time. Sent
  // to this function one at a time as it should place the string 
  // on the next line.
  addText(string)
  {
    if (this.m_text_array.length == 0)
    { return; }
    
    let y = this.m_text_array[this.m_text_array.length-1].y;
    let x = this.m_text_array[this.m_text_array.length-1].x;
    this.m_text_array.push( game.add.text(x, 
        y+16,
        string, {fontSize: '16px', fill: '#000'}) );
  }
  // helper function that destroys all strings EXCEPT the first one.
  clearText()
  {
    for (let i = 1; i < this.m_text_array.length; i++)
    {
      this.m_text_array[i].text = "";
      this.m_text_array[i].destroy();
    }
    this.m_text_array.length = 1;
  } 
  destroy()
  {
    //this.m_text.text = "";
    //this.m_text = null;
    //this.m_text.destroy();
    for (let i = 0; i < this.m_text_array.length; i++)
    { this.m_text_array[i].destroy(); }
    this.m_button.destroy();
  }
}

/*
  Just checking if the browser actually supports the option to 
  have local storage.
*/
function isLocalSupported()
{
  try {
    const key = "_blah_blah";
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch (e)
  {
    return false;
  }
}

/*
 This function will just create the save data for the most important
 properties right now. VERY BETA! 3-24-18 Mostly WORKING 3-30-18
 @param slot int - The save "slot"
 @return true on success, false on failure.
*/
function saveSlot(slot)
{
  if (isLocalSupported() == false) { return false; }
  console.log("Trying to SAVE and it is supported.");
  localStorage.setItem("slot_" + slot + "_player_name", player_name);
  
  localStorage.setItem("slot_" + slot + "_day_completed", JSON.stringify(1));
  localStorage.setItem("slot_" + slot + "_order_completed", 
    JSON.stringify(actor_order_index));
  
  if (actor != null)
  {
    localStorage.setItem("slot_" + slot + "_dialog_completed", 
      JSON.stringify(actor.getCurrentDialogIndex()));
  }
  else
  {
    localStorage.setItem("slot_" + slot + "_dialog_completed", JSON.stringify(0));
  }
  
  updateTopScreen();
}

// Same as save just needs the slot number.
function loadSlot(slot)
{
  if (isLocalSupported() == false) { return false; }
  console.log("Trying to LOAD and it is supported.");
  player_name = localStorage.getItem("slot_" + slot + "_player_name");
  let day = parseInt(localStorage.getItem("slot_" + slot + "_day_completed"));
  let order = parseInt(localStorage.getItem("slot_" + slot + "_order_completed"));
  let dialog = parseInt(localStorage.getItem("slot_" + slot + "_dialog_completed"));
  
  // Set the day.
  
  // Set the actor to be generated.
  actor_order_index = order;
  
  if (actor != null)
  {
    // destroy the old actor
    actor.destroy();
  }
  
  // Create a new actor object.
  actor = new Actor(game, "En", "Ex", "Bl", 
    actor_order_array[actor_order_index], dialog_array,  
    resolveActorSprite(scriptfile_substr));
  
  console.log("Load INFO: Name: " + player_name + " day: " + day + 
    " order: " + order + " dialog: " + dialog);
}

// Just setting the values to null.
function deleteSlot(slot)
{
  if (isLocalSupported() == false) { return false; }
  console.log("Trying to DELETE and it is supported.");
  localStorage.setItem("slot_" + slot + "_player_name",null);
  localStorage.setItem("slot_" + slot + "_day_completed", null);
  localStorage.setItem("slot_" + slot + "_order_completed", null);
  localStorage.setItem("slot_" + slot + "_dialog_completed", null);
  
  updateTopScreen();
}

// Function for grabbing the values from a save slot.
// @return array of values 
function peekSlot(slot)
{
  if (isLocalSupported() == false) { return false; }
  var array = [];
  array.push("Name: " + localStorage.getItem("slot_" + slot + "_player_name"));
  array.push("Day#: " + parseInt(localStorage.getItem("slot_" + slot + "_day_completed")));
  array.push("Order Pos: " + parseInt(localStorage.getItem("slot_" + slot + "_order_completed")));
  array.push("Dialog Pos: " + parseInt(localStorage.getItem("slot_" + slot + "_dialog_completed")));
  return array;
}

/*
 * Here is the options screen.
 */
class OptionsScreen
{
  constructor(game_obj)
  {
    if (game_obj == null)
    {
        console.error("OptionsScreen:constructor:game_obj is null");
        return;
    }
    // Generate the background
    this.m_game_obj = game_obj;
    this.m_margin = 25;
    this.m_sprite_height = 64;
    this.m_sprite_width = 128;
    this.m_background = this.m_game_obj.add.sprite(0,0, 'options_screen_back');
    this.m_name = "OptionsScreen";
    this.m_buttons = [];
    
    // Generate the buttons
    this.m_buttons.push(new clickableTextButton(this.m_game_obj.width * 0.25 - this.m_sprite_width, 
      this.m_game_obj.height * 0.25 - this.m_sprite_height, 
      "Save Game", pushScreen, 1, SaveScreen));
    this.m_buttons.push(new clickableTextButton(this.m_game_obj.width * 0.75 - this.m_sprite_width, 
      this.m_game_obj.height * 0.25 - this.m_sprite_height,
      "Load Game", pushScreen, 1, LoadScreen));
    this.m_buttons.push(new clickableTextButton(this.m_game_obj.width * 0.5 - this.m_sprite_width, 
      this.m_game_obj.height * 0.35 - this.m_sprite_height,
      "Relationships", pushScreen, 1, SaveScreen));
    this.m_buttons.push(new clickableTextButton(this.m_game_obj.width * 0.5 - this.m_sprite_width, 
      this.m_game_obj.height * 0.5 - this.m_sprite_height, 
      "Button Config", pushScreen, 1, SaveScreen));
    this.m_buttons.push(new clickableTextButton(this.m_game_obj.width * 0.5 - this.m_sprite_width, 
      this.m_game_obj.height * 0.7 - this.m_sprite_height, 
      "Return", popScreen, 0, "unusued"));
    this.m_buttons.push(new clickableTextButton(this.m_game_obj.width * 0.75 - this.m_sprite_width, 
      this.m_game_obj.height * 0.9 - this.m_sprite_height, 
      "Speaker_Down", popScreen, 0, "un-used"));
    this.m_buttons.push(new clickableTextButton(this.m_game_obj.width * 0.25 - this.m_sprite_width, 
      this.m_game_obj.height * 0.9 - this.m_sprite_height, 
      "Speaker_Up", popScreen, 0, "un-used"));
  }
  
  hide()
  {
    this.m_background.alpha = 0.1;
    
    for (let i = 0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i].hide();
    }
  }
  
  unhide()
  {
    this.m_background.alpha = 1.0;
    
    for (let i = 0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i].unhide();
    }
  }
  
  getName()
  { return this.m_name; }
  
  destroy()
  {
    // Destroy the buttons.
    for (let i = 0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i].destroy();
    }
    
    // Destroy the background.
    this.m_background.destroy();
  }
}

class SaveScreen
{
  constructor(game_obj)
  {
    if (game_obj == null)
    { console.error("SaveScreen:constructor:game_obj is null!"); return; }
    
    this.m_game_obj = game_obj;
    this.m_margin = 25;
    this.m_row_1_y = 50;
    this.m_row_2_y = 200;
    this.m_row_3_y = 350;
    this.m_name = "SaveScreen";
    this.m_buttons = [];
    
    this.m_background = this.m_game_obj.add.sprite(0,0, 'save_screen_back');
      
    this.m_buttons.push(new clickableTextButton(this.m_margin, this.m_row_1_y, 
      "Save Slot #1", saveSlot, 2, 1));
    this.m_buttons.push(new clickableTextButton(this.m_margin, this.m_row_2_y, 
      "Save Slot #2", saveSlot, 2, 2));
    this.m_buttons.push(new clickableTextButton(this.m_margin, this.m_row_3_y, 
      "Save Slot #3", saveSlot, 2, 3));
    for (let i = 0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i].changeWidth(600);
      this.m_buttons[i].changeHeight(175);
      let info_array = peekSlot(i+1);
      for (let j = 0; j < info_array.length; j++)
      {
        this.m_buttons[i].addText(info_array[j]);
      }
    }
      
    this.m_buttons.push(new clickableTextButton(this.m_game_obj.width - this.m_margin - 128, 
      this.m_row_1_y, "Delete Save", deleteSlot, 2, 1));
    this.m_buttons.push(new clickableTextButton(this.m_game_obj.width - this.m_margin - 128, 
      this.m_row_2_y, "Delete Save", deleteSlot, 2, 2));
    this.m_buttons.push(new clickableTextButton(this.m_game_obj.width - this.m_margin - 128, 
      this.m_row_3_y, "Delete Save", deleteSlot, 2, 3));
      
    this.m_buttons.push(new clickableTextButton(this.m_margin, 
      this.m_game_obj.height - 100, "Return", popScreen, 0, "nothing"));
    
  }
  
  update()
  {
    for (let i = 0; i < 3; i++)
    {
      // peek the three slots again
      // clearText from teh buttons
      // addtext from the arrays.
      let info_array = peekSlot(i+1);
      
      // CAUTION: DIFFERENT BUTTON ARRANGEMENT COULD FUCK US.
      this.m_buttons[i].clearText();
      for (let j = 0; j < info_array.length; j++)
      {
        this.m_buttons[i].addText(info_array[j]);
      }
    }
  }
  
  getName()
  { return this.m_name; }
  
  hide()
  {
    this.m_background.alpha = 0.1;
    
    for (let i = 0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i].hide();
    }
  }
  
  unhide()
  {
    this.m_background.alpha = 1.0;
    
    for (let i = 0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i].unhide();
    }
    
  }
  
  destroy()
  {
    for (let i = 0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i].destroy();
    }
    this.m_background.destroy();
  }
}

/*
 * Here is the very beta load screen.
 */
class LoadScreen
{
  constructor(game_obj)
  {
    if (game_obj == null)
    { console.error("LoadScreen:constructor:game_obj is null!"); return; }
    
    this.m_game_obj = game_obj;
    this.m_margin = 25;
    this.m_row_1_y = 100;
    this.m_row_2_y = 200;
    this.m_row_3_y = 300;
    this.m_name = "LoadScreen";
    
    this.m_background = this.m_game_obj.add.sprite(0,0, 'load_screen_back');
    
    this.m_buttons = [];
    
    this.m_buttons.push(new clickableTextButton(this.m_margin, 
      this.m_row_1_y, "Load Save #1", loadSlot, 2, 1));
    this.m_buttons.push(new clickableTextButton(this.m_margin, 
      this.m_row_2_y, "Load Save #2", loadSlot, 2, 2));
    this.m_buttons.push(new clickableTextButton(this.m_margin, 
      this.m_row_3_y, "Load Save #3", loadSlot, 2, 3));
    this.m_buttons.push(new clickableTextButton(this.m_margin,
      this.m_game_obj.height - 100, "Return", popScreen, 0, "unused")); 
  }
  
  getName()
  { return this.m_name; }
  
  hide()
  {
    this.m_background.alpha = 0.1;
    
    for (let i = 0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i].hide();
    }
  }
  
  unhide()
  {
    this.m_background.alpha = 1.0;
    
    for (let i = 0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i].unhide();
    }
  }
  
  destroy()
  {
    for (let i = 0; i < this.m_buttons.length; i++)
    {
      this.m_buttons[i].destroy();
    }
    
    this.m_background.destroy();
  }
}
