/*
 * Here is the generic text box that has several limits.
 * Display Orientation:
 * 	- Top, Middle, Bottom
 * Text Strings max of 4, including name.
 * We will be displaying the border as broken up chunks so we 
 * 	can better display.
 * Author: Christopher Bartlett
 * 8-15-17: Bartlett: Version is working with the phaser api pretty well and 
    will serve as a basis for the next version that uses portraits and 
    actions.
 * 5-28-17: Bartlett: Initial version.
 */

class GenericTextBox
{
	/*
	 * Setting up the top, middle, bottom, 
	 * -The # of strings the text box will be sized to.
	 * -What border will we be displaying.
	 * @param * game : The game object from phaser.
	 * @param int position : 1:top 2:middle 3:bottom.
	 * @param dialog_array str_array 2d: An 2d array of strings.
	 * @param int border_id : The id of the display.
	 */
	constructor(game, p_x, p_y, position, dialog_array, border_id, text_size)
	{
    let error_str = "ERROR::GenericTextBox:constructor";
    
    console.log("GenericTextBox is being created.");
    this.m_game_obj = game;
		this.m_indent = 10;
    this.m_main_indent = 20;
    this.m_line_spacing = 32;
    this.m_player_x = p_x;
    this.m_player_y = p_y;
    this.m_x = 0;
    this.m_y = 0;
    this.m_text = "DEBUG";
		this.m_text_1;
		this.m_text_2;
		this.m_text_3;
		this.m_text_4;
    this.m_text_5;
    this.m_text_array = [];
    this.m_dialog_array_current_position = 0;
    this.m_num_of_text_lines = 5;
		
    if (game == null)
    { console.error(error_str + "game is null."); return;}
    //this.m_game_obj.add.sprite(0,0,'textbox');
    
    if (!testVarValidity(p_x, 'number', -1, 1000, error_str))
    { console.error("p_x is wrong: " + p_x); return; }
    if (!testVarValidity(p_y, 'number', -1, 1000, error_str))
    { console.error("p_y is wrong: " + p_y); return; }
    
		if (!testVarValidity(position, 'number', 0, 4, error_str))
		{
      console.error('location is out of scope: ' + location);
			return;
		}
		this.m_position = position;
		
		switch(this.m_position)
		{
			case 1: // top
				this.m_x = 0;
				this.m_y = 0;
				break;
			case 2: // middle
				this.m_x = 0;
				this.m_y = this.m_game_obj.height / 2 - (100);
				break;
			case 3: // bottom
				this.m_x = 0;
				this.m_y = (this.m_game_obj.height / 3) * 2;
				break;
			default:
				console.log("ERROR::position not recognized: " + position);
        this.m_x = 0;
        this.m_y = 0;
		}
		
		if (dialog_array == 'undefined')
		{
			console.error('ERROR::GenericTextBox:constructor:' +
                " dialog_array is not an array?");
			return;
		}
    if (dialog_array.length == 0)
    {
      console.error("ERROR::GenericTextBox:constructor: dialog_array has no elements?" );
      return;
    }
    this.m_dialog_array = dialog_array;
		
		
		if (!testVarValidity(border_id, 'number', 0, 4, error_str))
		{
      console.error('border_id is out of scope: ' + border_id);
			return;
		}
    
		this.m_border_id = border_id;
    //this.m_border = this.m_game_obj.add.sprite(this.m_player_x + this.m_x, this.m_player_y + this.m_y, 'textbox');
    this.m_border = this.m_game_obj.add.sprite(this.m_player_x+this.m_x, this.m_y,'textbox');
       
    this.m_text_1 = game.add.text(this.m_player_x + this.m_x + this.m_indent, 
        this.m_y + this.m_line_spacing,
        this.m_text, {fontSize: '16px', fill: '#000'});
    this.m_text_2 = game.add.text(this.m_player_x + this.m_x + this.m_main_indent, 
        this.m_y + this.m_line_spacing*2, 
        this.m_text, {fontSize: '16px', fill: '#000'});
    this.m_text_3 = game.add.text(this.m_player_x + this.m_x + this.m_main_indent, 
        this.m_y + this.m_line_spacing*3,
        this.m_text, {fontSize: '16px', fill: '#000'});
    this.m_text_4 = game.add.text(this.m_player_x + this.m_x + this.m_main_indent, 
        this.m_y + this.m_line_spacing*4, 
        this.m_text, {fontSize: '16px', fill: '#000'});
    this.m_text_5 = game.add.text(this.m_player_x + this.m_x + this.m_main_indent, 
        this.m_y + this.m_line_spacing*5, 
        this.m_text, {fontSize: '16px', fill: '#000'});
        
    // add the text objects to the text_array
    this.m_text_array.push(this.m_text_1);
    this.m_text_array.push(this.m_text_2);
    this.m_text_array.push(this.m_text_3);
    this.m_text_array.push(this.m_text_4);
    this.m_text_array.push(this.m_text_5);
    
    console.log("Successfully created GenericTextBox obj");
	}

    /*
     Typically called after the button press from the main game. 
    */
    advanceText()
    {
        if (this.m_dialog_array == 'undefined')
        {
            console.log("GenericTextBox:advance_text ERROR: The dialog_array does not exist?");
            this.destroy();
            return false;
        }
        // check to see if we are NOT at the end of the m_dialog_array 
        if (this.m_dialog_array.length <= this.m_dialog_array_current_position)
        {
            // We are at the end so destroy the text_box.
            this.destroy();
            return false;
        }
        else // update the text.
        {
            if (this.m_dialog_array[this.m_dialog_array_current_position].length < this.m_num_of_text_lines)
            {
                for (var i = 0; i < this.m_dialog_array[this.m_dialog_array_current_position].length; i++)
                {
                    this.m_text_array[i].text = this.m_dialog_array[this.m_dialog_array_current_position][i];
                }

                // Lets make the unused text positions to ""
                for (var i = this.m_dialog_array[this.m_dialog_array_current_position].length; i < 5; i++)
                {
                    this.m_text_array[i].text = "";
                }
            }
            else
            {
                // There was too much text so just print what you can.
                for (var i = 0; i < this.m_num_of_text_lines; i++)
                {
                    this.m_text_array[i].text = this.m_dialog_array[this.m_dialog_array_current_position][i];
                }
            }
        }
        this.m_dialog_array_current_position += 1;
        return true;
    }


    /*
    Displays the text from the different array of more_text_array.
    @return true or false 
    */
    moreText()
    {
      // Check if more_text_array exists.
      if (more_text_array == 'undefined')
      {
        return;
      }
      if (more_text_array.length = 0)
      {
        return;
      }
      
      for (var i = 0; i < this.m_dialog_array[this.m_dialog_array_current_position].length; i++)
      {
        this.m_text_array[i].text = more_text_array[0][i];
      }
    }

    /*
        Destroying the text_box's text and game's background so we can get back to
        the game.
    */
    destroy()
    {
        // make everything invisible then remove it.
        this.m_border.visible = false;
        this.m_border.remove;
        this.m_text_1.destroy();
        this.m_text_2.destroy();
        this.m_text_3.destroy();
        this.m_text_4.destroy();
        this.m_text_5.destroy();
        // Commented out because of javascript shallow copy.
        //this.m_dialog_array.length = 0;
        this.m_text_array.length = 0;
    }
}
